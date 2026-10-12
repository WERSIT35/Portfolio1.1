import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE ?? 'http://localhost:4200';
const OUT = path.resolve(process.argv[2] ?? 'shots');
const SLUGS = [
  'shello',
  'lumina-games',
  'elite-weddings',
  'tatoogen',
  'stm32-ethernet-mqtt-controller',
  'mpu6050-attitude-monitor',
  'ov5640-camera-capture',
  'akhali-sakhli',
  'petc-platform',
  'heatflow',
];
const PAGES = [['home', '/'], ...SLUGS.map((s) => [s, `/work/${s}`])];
const WIDTHS = [
  [360, 780],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const failures = [];

for (const [w, h] of WIDTHS) {
  const phone = w < 768;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: phone,
    hasTouch: w < 1440,
    reducedMotion: 'reduce',
  });
  for (const [name, url] of PAGES) {
    if (only && !only.includes(name)) continue;
    const page = await ctx.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Walk the page so @defer (on viewport) blocks and lazy images render.
    await page.evaluate(async () => {
      document.documentElement.classList.remove('has-snap');
      const step = innerHeight * 0.6;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });

    const report = await page.evaluate((phone) => {
      const issues = [];
      const vw = window.innerWidth;
      const doc = document.documentElement;
      if (doc.scrollWidth > vw) issues.push(`scrollWidth ${doc.scrollWidth} > innerWidth ${vw}`);

      const isBox = (el) => {
        const cs = getComputedStyle(el);
        return (
          cs.overflowX !== 'visible' ||
          parseFloat(cs.borderLeftWidth) > 0 ||
          parseFloat(cs.borderRightWidth) > 0 ||
          (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent')
        );
      };
      const label = (el) =>
        el.tagName.toLowerCase() +
        (el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/).join('.')
          : '');

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        const el = node.parentElement;
        if (!el || seen.has(el)) continue;
        seen.add(el);
        if (el.closest('[aria-hidden="true"], dialog:not([open]), [inert], script, style')) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const r = range.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const text = node.textContent.trim().slice(0, 40);

        // Intentional clipping (ellipsis or overflow hidden on an ancestor) is reported, not failed.
        let box = el;
        while (box && box !== document.body && !isBox(box)) box = box.parentElement;
        if (!box) continue;
        const b = box.getBoundingClientRect();
        const bcs = getComputedStyle(box);
        const left = b.left + parseFloat(bcs.borderLeftWidth);
        const right = b.right - parseFloat(bcs.borderRightWidth);
        const clipped = bcs.overflowX !== 'visible';
        const ellipsis = getComputedStyle(el).textOverflow === 'ellipsis' || bcs.textOverflow === 'ellipsis';
        // Intentional: visually-hidden (sr-only) boxes, swipeable rails, the marquee band.
        const srOnly = b.width <= 2 || b.height <= 2;
        let scroller = false;
        for (let a = el; a && a !== document.body; a = a.parentElement) {
          if (['auto', 'scroll'].includes(getComputedStyle(a).overflowX)) scroller = true;
        }
        const marquee = !!el.closest('.band__viewport');
        if (srOnly || scroller || marquee) continue;
        if ((r.right > right + 1 || r.left < left - 1) && !ellipsis) {
          issues.push(
            `${clipped ? 'clipped' : 'overflow'} "${text}" in ${label(el)} -> box ${label(box)} ` +
              `(text ${Math.round(r.left)}..${Math.round(r.right)}, box ${Math.round(left)}..${Math.round(right)})`,
          );
        }
        if (r.right > vw + 1 || r.left < -1) {
          // Only a failure when the text is actually on screen (not clipped away by a scroller).
          const inScroller = el.closest('[style*="overflow"], .rail, .track');
          if (!clipped && !inScroller) issues.push(`offscreen "${text}" in ${label(el)} (${Math.round(r.left)}..${Math.round(r.right)})`);
        }
      }

      // Phone dock: scrolled to the end, nothing readable may sit under it.
      if (phone) {
        const nav = document.querySelector('app-dynamic-island .island');
        if (nav) {
          const n = nav.getBoundingClientRect();
          const main = document.querySelector('main');
          const w2 = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
          let t;
          while ((t = w2.nextNode())) {
            if (!t.textContent.trim()) continue;
            const pe = t.parentElement;
            if (pe.closest('[aria-hidden="true"]')) continue;
            const rg = document.createRange();
            rg.selectNodeContents(t);
            for (const rr of rg.getClientRects()) {
              if (rr.bottom > n.top + 1 && rr.top < n.bottom && rr.right > n.left && rr.left < n.right) {
                // Only count it if it's the topmost thing (not under a sticky sheet).
                const hit = document.elementFromPoint(
                  Math.min(Math.max(rr.left + rr.width / 2, 0), vw - 1),
                  Math.min(Math.max(rr.top + rr.height / 2, 0), innerHeight - 1),
                );
                if (hit && (nav.contains(hit) || hit === pe || pe.contains(hit) || hit.contains(pe))) {
                  issues.push(`under-dock "${t.textContent.trim().slice(0, 40)}" in ${label(pe)}`);
                }
              }
            }
          }
        }
      }
      return issues;
    }, phone);

    await page.screenshot({ path: path.join(OUT, `${name}-${w}.png`), fullPage: true });
    const tag = `${name} @${w}`;
    if (report.length) {
      failures.push([tag, report]);
      console.log(`FAIL ${tag}`);
      for (const i of [...new Set(report)].slice(0, 25)) console.log('   ', i);
    } else console.log(`ok   ${tag}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${failures.length} failing page/width combos`);
process.exit(failures.length ? 1 : 0);
