# CLAUDE_CHECKPOINT — resume point

> Last updated: 2026-10-12. Read this file **and** `CLAUDE.md` before touching code.
> `main` is clean and deployed (Vercel). Last merged: #39 (CV without the GLI claim). The 2026-10-12 session
> shipped the case-study redesign (#28), the repo facts audit (#30), the CV generator and its refreshes (#31–#39).

---

## 0. How we work

1. **Art direction over checklists.** Pitch a concept in chat (a few lines, maybe a sketch) before building
   anything new; the user rejected "correct but boxy" designs and dislikes wasted space.
2. Once a concept is approved, build it straight through: branch → verify → commit → PR → merge
   (the user's standing instruction: "Merge when you finish the task fully, don't stop").
3. **Facts only** from `src/app/data/site-data.ts` (= `Data.md`), the public GitHub repos (WERSIT35) and the
   user's confirmed answers. Never invent or embellish. Conflicts go to the user (see §4).
4. After editing `site-data.ts`, regenerate `Data.md` with `cp src/app/data/site-data.ts Data.md`.
5. Commits end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; PR bodies end with
   `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. No model names elsewhere.

---

## 1. Design language — "Cover" (approved, used by every home section)

- **Type:** Geist only (`--font-geist`, @font-face in `src/styles.scss`). Big display sizes, tight tracking
  (-0.03 to -0.04em). Labels ≥12px; uppercase only for kickers.
- **Colour:** strictly monochrome. `#0A0A0A` ground, `#FAFAFA` ink, `#A1A1A1` muted, `#c8c8c8` body copy,
  hairlines `rgb(255 255 255 / 12%)`. Logos and stamps in greyscale; documents in colour only in a lightbox.
- **Layout:** edge to edge, gutter `16px` on phones, `max(32px, 4vw)` from 768px. No grids of equal cards; facts are
  plain text rows and colophons. Section head = `NN / Name` kicker + title (+ a right-aligned count/range).
  From 768px each section's top padding is `calc(var(--island-top) + var(--island-h) + 16px)`; phones reserve
  `var(--dock-clear)` at the bottom for the docked island.
- **Motion:** one signature interaction per section; every hover has a keyboard (`:focus-visible`) and touch (tap)
  equivalent; `prefers-reduced-motion` turns it all off.

| Section | Signature |
|---|---|
| 01 Hero "Cover" | B&W photo slab wiped in with clip-path; name in `mix-blend-mode: difference` crosses it; cursor drift |
| 02 Experience "Ledger" | time rule whose span tracks the open/hovered role |
| 03 Projects | editorial index, cursor lens, inverting names |
| 04 Skills | braking marquee bands, "Used in" evidence card (phones: inline detail) |
| 05 Certifications | issuer wall (counts) over a ledger; row hover lights its mark + desktop preview; lightbox |
| 06 Education | degree records over one year rule |
| 07 Contact | contained closing stage, email sized to fit, magnetic letters, tap-to-copy |
| `/work/:slug` "Dossier" | name crosses a greyscale slab (or a light spec plate when there are no screens); chapter rail fills as you read; plates in colour in a lightbox; next case keeps the index hover (white + difference blend over a trailing lens) |

Scroll spy picks the **last** visible section (stages overlap while one sinks behind the next).
Contact is `.stage--auto` (`min-height: 0`).

---

## 2. Architecture

Angular 22, standalone components, signals, zoneless, SSR (`@angular/ssr`). Home `/` is prerendered;
`/work/:slug` is server-rendered (`src/app/app.routes.server.ts`).

- Data: `src/app/data/site-data.ts` (EXPERIENCES, CERTIFICATIONS, REPOSITORIES, SKILLS, PROJECTS, EDUCATION_ITEMS,
  CONTACT), `src/app/data/issuers.ts` (issuer logos). Interfaces in `src/app/interfaces/`.
- Skill groups: `src/app/utils/skill-groups.ts` (add a mapping for every new skill, else it lands in "Other").
- Skills evidence (`skills-section.ts`): matches skill names against stacks of projects, roles, certifications,
  degree coursework (BSc/MSc) and `REPOSITORIES` (public repos that aren't projects).
- New skills: append to all six SKILLS parallel arrays (name, color `#ffffff`, icon, learned `[]`, gained `[]`,
  rating `0` = no self-rating, the UI hides the dots).

---

## 3. Verification (do this before every PR)

```sh
npx ng build && npx ng test --watch=false
npx prettier --check <changed files>     # normalise CRLF first: sed -i 's/\r$//' <file>
NG_ALLOWED_HOSTS=localhost PORT=4100 node dist/Portfolio/server/server.mjs   # serve the SSR build
cd scripts/visual-audit && npm install   # once
node section.mjs <sectionId> <out> "" http://localhost:4100
BASE=http://localhost:4100 node audit.mjs <out>
```

See `scripts/visual-audit/README.md`. Lighthouse: Accessibility 100 and Best Practices 100 on mobile + desktop.
Look at the screenshots (390×844 and 1440×900 at least) before calling UI done.

Gotchas:
- Class names repeat across sections (`.row`, `.mark`): scope test selectors to the section id.
- Never animate `clip-path` to/from `none`; use `inset(0 0 0 0)`.
- Touch: `pointerleave` fires on lift before `click`; make hover-clearing handlers mouse-only.
- Hidden Chrome tabs freeze rAF/IntersectionObserver; verify motion with Playwright/Puppeteer.
- HMR rebuilds template nodes: long-lived observers watch the host `ElementRef`, never a `#ref`.
- Windows: complex inline `node -e`/sed quoting breaks; write a script file or use the Edit tool.

---

## 4. Open items

**Waiting on the user (don't change without an answer):**
- W3Schools AWS certificate image shows "Oto Your family name": needs a re-issued certificate with the surname
  set. (Date confirmed: Sep 20, 2023, fixed in data.)
- MSc (BTU) start year unknown; shown as "Expected 2026" only.
- FastAPI and MySQL have no project evidence (kept by request). Firebase (TatooGen) and NGINX (Shello,
  GiftShop-app) now do.
- Lean Tech and Icecat were missing from the old résumé; both are on the site and in the new CVs.
- The slot provider project is **Lumina Games** (game: **Vault 20K**, the repo's casing), never "Provider" /
  "Banana X" (user correction, 2026-10-12). Slug `lumina-games`; the old `/work/provider-banana-x-engine`
  redirects.
- Akhali Sakhli and PetC have no repo; their entries are unverified. PetC ran Dec 2025 – Jun 2026 (user
  confirmed); its status stays "in production" (the platform, not the engagement).
- Kept but unproven by the repos: Shello "pre-order import" (owner fact) and the `lessons` texts.

**Repo facts audit (2026-10-12):** every PROJECTS entry was checked against its GitHub repo (one agent per
repo) and corrected; repos are the source of truth. Case pages show `approach` instead of `highlights` when
both exist, so put anything a reader must see into `approach`. Repo-side issues for the user (not the site):
Provider's public `SECURITY_INCIDENT.md` (API-token exposure: rotate) and committed `tmp-server-*.log`;
TatooGen README/home screen still say "DALL-E 3" (also visible in its Pic1Web screenshot); Tns README and
CLAUDE.md deploy URL are stale; the stm32-f767 MQTT repo commits a 146 MB `Debug/`; several repos have no
README (GiftShop-app, public-vending-machine-oop, otar.davitashvili.final, the RS-485 repo).

**Next work, in order:**
0. Provider repo (offered, not done, needs the user's go-ahead): its public `CHECKPOINT.md` and
   `website/index.html` still claim GLI certification; change to "RTP validated in-house; GLI planned". Optionally
   add the RGS load test (a copy is kept at `scripts/cv/evidence/lumina-rgs-load-test.ts`; it runs inside
   the Provider repo's `platform/`) so the CV's numbers are reproducible.
1. Phone polish: Experience rule when all rows are collapsed (pick a default row), Skills tap hint, Education
   "Expected" label at the screen edge, BTU logo, Contact gap.
2. Mobile performance (Lighthouse perf ~55) and SEO (case studies now set their own title + description).
3. Island brand link: `aria-label="Back to top"` doesn't contain its visible "OD" (Lighthouse
   label-content-name-mismatch, unscored).
4. Delete the now-unused `components/shared/{glass-card,badge-chip,metric-tile}` (and `count-up` directive if
   still unused) — removal was blocked by a permission prompt in the Dossier session; needs the user's OK.
5. Delete the orphan `pr-assets/*` screenshot branches once the user no longer needs them.
6. Optional: the site's own headline still says "Full-Stack Engineer" (`src/index.html` title, hero); the CVs
   position the user as "Founding Engineer". Pitch before changing the hero.

---

## 5. CV (`scripts/cv/`, see its README)

Two variants from one content file (`content.mjs`): **iGaming** ("Founding Engineer · iGaming Platforms, Risk &
Integrity", for targeted applications) and **Founding-Engineer** (general; the site's "Download CV"). Both must stay
exactly 2 pages (A4, Segoe UI, one teal accent, ATS-safe: no letter-spaced headings, real tab stops).
`node build.mjs` → `export-pdf.ps1` (Word) → copy the Founding-Engineer PDF to
`public/assets/me/Otar-Davitashvili-CV.pdf` **and** `public/assets/me/OTAR DAVITASHVILI.pdf` (old URL). The built
files and `Otar-Davitashvili-LinkedIn-and-Cover-Letter.md` live in the repo root, gitignored (public repo).

Facts on the CV and where they come from (never add numbers without a source; the user asked for "good numbers"
once and was refused):
- Lumina Games: part-time venture, not incorporated, pre-launch (demo live, RGS not hosted). **No GLI
  certification, never claim it.** RTP: `qa/rtp-certification-report*.md` in the Provider repo (30M seeded rounds per
  mode; second seed 200M; pooled base 96.359% ± 0.073). Security: `qa/security/findings-register.md` (internal
  review, 8 findings, 2 High). Load test (2026-10-12, i7-12700K, one Node process, in-memory, sandbox wallet, real
  HTTP, N sessions spinning back to back): ~1,150 spins/s plateau from 10 sessions, p99 13 ms at 10, 0 errors over
  69k spins, `/admin/v1/reports/reconciliation` diff 0.
- Betlive: from the user's 8 monthly team reports (own rows only; never store colleagues' names): up to 3,300
  items/month, top 3 of 11–12 by monthly volume in 5 of 8 months, #1 twice.
- HeatFlow: Lighthouse measured 2026-10-12 (mobile perf 97, desktop 100, SEO 100). Other client sites scored
  44–75 on performance and are not cited.
- Lean Tech: no clients; the user trained a 5-person team from zero coding experience; they built house
  detection systems and pneumatic mechanism prototypes.
- PetC: user built profiles, Instagram-style stories, search, scrolling feeds, QR-code pages, forms.
- An external AI review scored an earlier draft 6/10; its valid points were fixed (#36). The remaining gap is real
  production use (operators, traffic), which only the user can add.
