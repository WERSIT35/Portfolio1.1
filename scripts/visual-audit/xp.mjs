// Experience "Ledger": layout checks at all sizes + interaction proof. usage: node xp.mjs <out> [base]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2] ?? 'xp');
const BASE = process.argv[3] ?? 'http://localhost:4200';
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [
  [320, 640], [375, 667], [390, 664], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080],
];

const b = await chromium.launch();
let fails = 0;
for (const [w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 1024, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    document.documentElement.classList.remove('has-snap');
    document.querySelector('#experience').scrollIntoView();
    return document.fonts.ready;
  });
  await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const issues = [];
    const vw = innerWidth;
    const sec = document.querySelector('#experience');
    if (document.documentElement.scrollWidth > vw) issues.push(`scrollWidth ${document.documentElement.scrollWidth}`);
    if (document.querySelectorAll('h1').length !== 1) issues.push('h1 count');
    // Text inside the section must stay inside the viewport and its row.
    const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (el.closest('[aria-hidden="true"], .sr-only, [inert]')) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const x of rg.getClientRects()) {
        if (x.width < 1) continue;
        if (x.right > vw + 0.5 || x.left < -0.5) issues.push(`off-screen "${n.textContent.trim().slice(0, 24)}"`);
      }
    }
    // Display type never breaks mid-word: years always one line.
    for (const y of sec.querySelectorAll('.row__years')) {
      const rg = document.createRange();
      rg.selectNodeContents(y);
      if (new Set([...rg.getClientRects()].map((x) => Math.round(x.top))).size > 1) issues.push(`years wrap: ${y.textContent}`);
    }
    // Rule ticks inside the section.
    for (const t of sec.querySelectorAll('.rule__tick')) {
      const x = t.getBoundingClientRect();
      if (x.left < 0 || x.right > vw) issues.push(`tick off-screen ${t.textContent}`);
    }
    // Island must not cover the section head or a row head at rest (section at the top).
    const isl = document.querySelector('app-dynamic-island .island').getBoundingClientRect();
    for (const el of sec.querySelectorAll('.xp__kicker, .xp__title, .xp__range, .row__head')) {
      const x = el.getBoundingClientRect();
      if (x.bottom > innerHeight) continue; // below the fold: scrolls clear of the dock
      // A section taller than the screen scrolls under the fixed dock like any list; only its
      // head must never be covered (the bottom padding lets the last row scroll clear).
      if (sec.getBoundingClientRect().height > innerHeight && el.classList.contains('row__head')) continue;
      if (x.right > isl.left && x.left < isl.right && x.bottom > isl.top && x.top < isl.bottom) issues.push(`island covers ${el.className}: ${el.textContent.trim().slice(0, 24)}`);
    }
    const first = sec.querySelector('.row__role').textContent.trim();
    const expanded = [...sec.querySelectorAll('.row__head')].map((b) => b.getAttribute('aria-expanded'));
    return { issues, first, expanded: expanded.join(','), height: Math.round(sec.getBoundingClientRect().height) };
  });
  await p.screenshot({ path: path.join(OUT, `xp-${w}x${h}.png`) });
  console.log(`${r.issues.length ? 'FAIL' : 'ok  '} @${w}x${h} height=${r.height} first="${r.first}" expanded=${r.expanded}`);
  for (const i of [...new Set(r.issues)].slice(0, 10)) console.log('     ', i);
  fails += r.issues.length ? 1 : 0;
  await ctx.close();
}

// Interaction proof at 1440 (motion on) and 390 (touch).
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => { document.documentElement.classList.remove('has-snap'); document.querySelector('#experience').scrollIntoView(); });
  await p.waitForTimeout(400);
  const span = () => p.evaluate(() => { const s = document.querySelector('.rule__span'); const r = s.getBoundingClientRect(); const rule = document.querySelector('.rule').getBoundingClientRect(); return `${Math.round(r.left - rule.left)}..${Math.round(r.right - rule.left)} of ${Math.round(rule.width)} op=${getComputedStyle(s).opacity}`; });
  console.log('rest (open row 1):', await span());
  // Hover row 3 → rule previews it; sample the transition mid-way.
  const row3 = p.locator('.row__head').nth(2);
  await row3.hover();
  await p.waitForTimeout(150);
  const mid = await p.evaluate(() => document.getAnimations().filter((a) => a.effect?.target?.classList?.contains('rule__span')).map((a) => `${a.transitionProperty}@${Math.round(a.currentTime)}ms`).join(' '));
  console.log('transitions mid-way:', mid || 'none');
  await p.screenshot({ path: path.join(OUT, 'xp-1440-hover-mid.png') });
  await p.waitForTimeout(700);
  console.log('hover row 3      :', await span(), '|', await row3.textContent());
  // Open row 3 via click; body grows.
  await row3.click();
  await p.waitForTimeout(150);
  const growing = await p.evaluate(() => document.getAnimations().filter((a) => a.transitionProperty === 'grid-template-rows').length);
  await p.waitForTimeout(700);
  const st = await p.evaluate(() => [...document.querySelectorAll('.row__head')].map((b) => b.getAttribute('aria-expanded')).join(','));
  console.log('click row 3      : expanded', st, '| grid-row transitions seen:', growing);
  await p.mouse.move(5, 5);
  await p.waitForTimeout(700);
  console.log('mouse away       :', await span());
  await p.screenshot({ path: path.join(OUT, 'xp-1440-row3-open.png') });
  // Keyboard: focus first head, ArrowDown twice, Enter.
  await p.locator('.row__head').first().focus();
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('ArrowDown');
  const focused = await p.evaluate(() => document.activeElement.textContent.trim().slice(0, 30));
  await p.keyboard.press('Enter');
  await p.waitForTimeout(100);
  console.log('keyboard ↓↓ Enter: focus on', JSON.stringify(focused), 'expanded', await p.evaluate(() => [...document.querySelectorAll('.row__head')].map((b) => b.getAttribute('aria-expanded')).join(',')));
  await ctx.close();

  const rm = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const q = await rm.newPage();
  await q.goto(BASE + '/', { waitUntil: 'networkidle' });
  await q.locator('.row__head').nth(2).click();
  await q.waitForTimeout(50);
  console.log('reduced motion   : running transitions =', await q.evaluate(() => document.getAnimations().filter((a) => a.effect?.target?.closest?.('#experience')).length));
  await rm.close();

  const ph = await b.newContext({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true });
  const t = await ph.newPage();
  await t.goto(BASE + '/', { waitUntil: 'networkidle' });
  await t.evaluate(() => { document.documentElement.classList.remove('has-snap'); document.querySelector('#experience').scrollIntoView(); });
  await t.locator('.row__head').nth(1).tap();
  await t.waitForTimeout(800);
  await t.locator('.row__head').nth(1).tap();
  await t.waitForTimeout(800);
  console.log('touch open+close row 2: expanded', await t.evaluate(() => [...document.querySelectorAll('.row__head')].map((b) => b.getAttribute('aria-expanded')).join(',')), '| rule on:', await t.evaluate(() => document.querySelector('.rule__span').classList.contains('is-on')));
  await ph.close();
}
await b.close();
console.log(`\n${fails} failing sizes`);
