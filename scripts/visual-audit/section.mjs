// Shared section audit. usage: node section.mjs <sectionId> <outDir> [nowrapSelector] [baseUrl]
// Checks at 8 sizes: no horizontal scroll, no visible text off-screen, nowrap selector stays on one
// line (display type never breaks mid-word), island never covers the section head, one h1.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [id, outDir = id, nowrap = '', BASE = 'http://localhost:4200'] = process.argv.slice(2);
const OUT = path.resolve(outDir);
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [[320, 640], [375, 667], [390, 664], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];

const b = await chromium.launch();
let fails = 0;
for (const [w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 1024, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate((id) => {
    document.documentElement.classList.remove('has-snap');
    document.getElementById(id).scrollIntoView();
    return document.fonts.ready;
  }, id);
  await p.waitForTimeout(500);
  const r = await p.evaluate(({ id, nowrap }) => {
    const issues = [];
    const vw = innerWidth;
    const sec = document.getElementById(id);
    if (document.documentElement.scrollWidth > vw) issues.push(`scrollWidth ${document.documentElement.scrollWidth}`);
    if (document.querySelectorAll('h1').length !== 1) issues.push('h1 count');
    const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (el.closest('[aria-hidden="true"], .sr-only, [inert]')) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      // Inside a horizontal scroller (swipe strip / marquee): clipped by design.
      let scroller = false;
      for (let a = el; a && a !== sec; a = a.parentElement) if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(a).overflowX)) scroller = true;
      if (scroller) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const x of rg.getClientRects()) if (x.width >= 1 && (x.right > vw + 0.5 || x.left < -0.5)) issues.push(`off-screen "${n.textContent.trim().slice(0, 28)}"`);
    }
    if (nowrap) {
      for (const el of sec.querySelectorAll(nowrap)) {
        // Every word must stay whole: no line may start mid-word.
        const t = [...el.childNodes].filter((c) => c.nodeType === 3).map((c) => c).find((c) => c.textContent.trim());
        if (!t) continue;
        let prevTop = null;
        for (let i = 0; i < t.textContent.length; i++) {
          const rg = document.createRange();
          rg.setStart(t, i);
          rg.setEnd(t, i + 1);
          const top = Math.round(rg.getBoundingClientRect().top);
          if (prevTop !== null && top > prevTop + 4 && /\S/.test(t.textContent[i - 1] ?? ' ') && /\S/.test(t.textContent[i])) {
            issues.push(`mid-word break in "${t.textContent.trim().slice(0, 30)}"`);
            break;
          }
          if (rg.getBoundingClientRect().width) prevTop = top;
        }
      }
    }
    const isl = document.querySelector('app-dynamic-island .island').getBoundingClientRect();
    for (const el of sec.querySelectorAll('header *')) {
      if (!el.textContent.trim() || el.children.length) continue;
      const x = el.getBoundingClientRect();
      if (x.right > isl.left && x.left < isl.right && x.bottom > isl.top && x.top < isl.bottom) issues.push(`island covers head: ${el.textContent.trim().slice(0, 24)}`);
    }
    return { issues, height: Math.round(sec.getBoundingClientRect().height) };
  }, { id, nowrap });
  await p.screenshot({ path: path.join(OUT, `${id}-${w}x${h}.png`) });
  console.log(`${r.issues.length ? 'FAIL' : 'ok  '} @${w}x${h} height=${r.height}`);
  for (const i of [...new Set(r.issues)].slice(0, 8)) console.log('     ', i);
  fails += r.issues.length ? 1 : 0;
  await ctx.close();
}
await b.close();
console.log(`${fails} failing sizes`);
