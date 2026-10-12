/**
 * Copy kept with the CV (the source of its load-test numbers). Run it from the Provider repo:
 *   cp lumina-rgs-load-test.ts <Provider>/platform/scripts/load-test.ts && cd <Provider>/platform && npm ci
 *
 * RGS load test over real HTTP (local, single process, in-memory persistence,
 * sandbox wallet). N players each get a real HMAC-signed launch + session, then
 * spin back to back (one round at a time per session, as the RGS enforces).
 *
 *   npx tsx scripts/load-test.ts            # levels 1,10,50,100,200 · 15 s each
 *   LEVELS=50,100 SECONDS=30 npx tsx scripts/load-test.ts
 *   WALLET_MS=20 npx tsx scripts/load-test.ts   # simulate a 20 ms casino wallet
 */
import { buildContainer } from "../src/container";
import { buildApp } from "../src/app";
import { createLogger } from "../src/lib/logger";
import { SandboxWallet } from "../src/modules/wallet/sandbox-wallet";
import { computeSignature } from "../src/lib/security/hmac";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import os from "node:os";

const PORT = Number(process.env.PORT ?? 8199);
const BASE = `http://127.0.0.1:${PORT}`;
const LEVELS = (process.env.LEVELS ?? "1,10,50,100,200").split(",").map(Number);
const SECONDS = Number(process.env.SECONDS ?? 15);
const WALLET_MS = Number(process.env.WALLET_MS ?? 0);

const pct = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];

async function main(): Promise<void> {
  const cfg = {
    launchSecret: "lt-launch", sessionSecret: "lt-session", adminSecret: "lt-admin",
    hmacSkewSeconds: 30, rateLimitPerMin: 100_000_000
  };
  const wallet = new SandboxWallet();
  if (WALLET_MS > 0) {
    // Same adapter, every wallet call delayed: stands in for a casino's network round trip.
    for (const m of ["debit", "credit", "rollback", "balance"] as const) {
      const original = (wallet as unknown as Record<string, (...a: unknown[]) => Promise<unknown>>)[m];
      if (typeof original !== "function") continue;
      (wallet as unknown as Record<string, unknown>)[m] = async (...a: unknown[]) => {
        await new Promise((r) => setTimeout(r, WALLET_MS));
        return original.apply(wallet, a);
      };
    }
  }
  const container = buildContainer(cfg, { wallet });
  const app = buildApp({ logger: createLogger({ level: "error", pretty: false, env: "local" }), container });
  await app.listen({ host: "127.0.0.1", port: PORT });

  const op = container.mgmt.createOperator({ name: "Load Casino", slug: "load", default_currency: "GEL" });
  container.mgmt.setOperatorStatus(op.id, "live");
  container.mgmt.addDomain(op.id, "play.load.test", "prod");
  const cred = container.mgmt.issueCredential(op.id, "prod", ["127.0.0.1/32"]);
  const game = container.mgmt.registerGame({ code: "bananax", title: "Vault 20K" });
  let mc = container.mgmt.createMathConfig({
    game_id: game.id, version: container.engine.rulesVersion(), rtp_profile_key: "bananax",
    theoretical_rtp: 96.38, config_hash: `sha256:${container.engine.rulesHash()}`
  });
  mc = container.mgmt.approveMathConfig(container.mgmt.submitMathConfigForReview(mc.id).id, "math-lead");
  container.mgmt.assignGame({ operator_id: op.id, game_id: game.id, math_config_id: mc.id, currency: "GEL", allowed_bets: [1, 5, 10] });

  async function openSession(player: string): Promise<string> {
    wallet.setBalance(player, "GEL", 1_000_000_000);
    const body = JSON.stringify({ game_code: "bananax", operator_player_id: player, currency: "GEL", origin: "play.load.test" });
    const ts = Math.floor(Date.now() / 1000).toString();
    const sig = computeSignature(cred.api_secret, { timestamp: ts, method: "POST", path: "/operator/v1/launch", rawBody: body });
    const launch = await fetch(`${BASE}/operator/v1/launch`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": cred.credential.api_key_id, "x-timestamp": ts, "x-nonce": randomUUID(), "x-signature": sig },
      body
    });
    if (launch.status !== 200 && launch.status !== 201) throw new Error(`launch ${launch.status} ${await launch.text()}`);
    const { launch_token } = (await launch.json()) as { launch_token: string };
    const init = await fetch(`${BASE}/game/v1/session/init`, { method: "POST", headers: { authorization: `Bearer ${launch_token}` } });
    if (init.status !== 200 && init.status !== 201) throw new Error(`init ${init.status} ${await init.text()}`);
    return ((await init.json()) as { session_token: string }).session_token;
  }

  console.log(`host: ${os.cpus()[0]?.model} · ${os.cpus().length} threads · Node ${process.version} · in-memory · wallet +${WALLET_MS} ms`);
  console.log("players  spins/s   p50 ms  p95 ms  p99 ms   errors   spins");
  let playerSeq = 0;
  for (const players of LEVELS) {
    const sessions = await Promise.all(Array.from({ length: players }, () => openSession(`p${++playerSeq}`)));
    const latencies: number[] = [];
    const errors = new Map<string, number>();
    const deadline = performance.now() + SECONDS * 1000;
    const started = performance.now();
    await Promise.all(sessions.map(async (token) => {
      while (performance.now() < deadline) {
        const t0 = performance.now();
        const res = await fetch(`${BASE}/game/v1/spin`, {
          method: "POST",
          headers: { authorization: `Bearer ${token}`, "content-type": "application/json", "idempotency-key": randomUUID() },
          body: JSON.stringify({ bet_amount: 1 })
        });
        const text = await res.text();
        const ms = performance.now() - t0;
        if (res.status === 200 || res.status === 201) {
          latencies.push(ms);
        } else {
          let code = String(res.status);
          try { code += " " + (JSON.parse(text) as { error?: { code?: string } }).error?.code; } catch { /* keep status */ }
          errors.set(code, (errors.get(code) ?? 0) + 1);
        }
      }
    }));
    const elapsed = (performance.now() - started) / 1000;
    latencies.sort((a, b) => a - b);
    const errCount = [...errors.values()].reduce((a, b) => a + b, 0);
    const total = latencies.length + errCount;
    console.log(
      `${String(players).padStart(7)}  ${(latencies.length / elapsed).toFixed(0).padStart(7)}  ${pct(latencies, 50).toFixed(1).padStart(7)} ${pct(latencies, 95).toFixed(1).padStart(7)} ${pct(latencies, 99).toFixed(1).padStart(7)}  ${((errCount / total) * 100).toFixed(2).padStart(6)}%  ${String(total).padStart(6)}` +
        (errors.size ? `   ${[...errors].map(([k, v]) => `${k}×${v}`).join(", ")}` : "")
    );
  }
  // Money correctness after the load: the RGS's own ledger-vs-wallet reconciliation.
  const tok = container.adminAuth.mintToken({ admin_id: "lt", scope: "provider", operator_id: null, role: "provider_super_admin" });
  const recon = await (await fetch(`${BASE}/admin/v1/reports/reconciliation?operator_id=${op.id}`, { headers: { authorization: `Bearer ${tok}` } })).json();
  const summary = await (await fetch(`${BASE}/admin/v1/reports/summary?operator_id=${op.id}`, { headers: { authorization: `Bearer ${tok}` } })).json();
  console.log(`reconciliation: ${JSON.stringify(recon).slice(0, 300)}`);
  console.log(`summary: ${JSON.stringify(summary).slice(0, 300)}`);
  await app.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
