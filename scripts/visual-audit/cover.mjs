// "Cover" hero: screenshots + legibility of the letters that cross onto the photo.
// usage: node cover.mjs <outDir> [baseUrl]
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(process.argv[2] ?? 'cover');
const BASE = process.argv[3] ?? 'http://localhost:4200';
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [
  [320, 640],
  [375, 667],
  [390, 664],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];

const b = await chromium.launch();
let fails = 0;
for (const [w, h] of SIZES) {
  const ctx = await b.newContext({
    viewport: { width: w, height: h },
    isMobile: w < 768,
    hasTouch: w < 1024,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => {
    document.documentElement.classList.remove('has-snap');
    return document.fonts.ready;
  });
  await p.waitForTimeout(1800); // entrance + wipe done

  const info = await p.evaluate(() => {
    const hero = document.querySelector('#top');
    const slab = hero.querySelector('.slab');
    const s = slab.getBoundingClientRect();
    const cs = getComputedStyle(slab);
    // Visible part of the slab = its box minus its clip-path inset.
    const m = cs.clipPath.match(/inset\(([^)]+)\)/);
    const ins = m ? m[1].split(/\s+/).map((v) => parseFloat(v) || 0) : [0, 0, 0, 0];
    const [t, r, bt, l] = ins.length === 1 ? [ins[0], ins[0], ins[0], ins[0]] : ins.length === 4 ? ins : [ins[0], ins[1] ?? ins[0], ins[2] ?? ins[0], ins[3] ?? ins[1] ?? ins[0]];
    const vis = { left: s.left + l, right: s.right - r, top: s.top + t, bottom: Math.min(s.bottom - bt, innerHeight) };
    // Per-character rects of the name, keep the ones over the visible photo.
    const crossing = [];
    for (const word of hero.querySelectorAll('.name__word')) {
      const node = word.firstChild;
      for (let i = 0; i < node.textContent.length; i++) {
        const ch = node.textContent[i];
        if (!ch.trim()) continue;
        const rg = document.createRange();
        rg.setStart(node, i);
        rg.setEnd(node, i + 1);
        const c = rg.getBoundingClientRect();
        const x0 = Math.max(c.left, vis.left), x1 = Math.min(c.right, vis.right);
        const y0 = Math.max(c.top, vis.top), y1 = Math.min(c.bottom, vis.bottom);
        if (x1 - x0 > 2 && y1 - y0 > 2) crossing.push({ ch, x: Math.round(x0), y: Math.round(y0), w: Math.round(x1 - x0), h: Math.round(y1 - y0) });
      }
    }
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth) issues.push(`scrollWidth ${document.documentElement.scrollWidth}`);
    if (document.querySelectorAll('h1').length !== 1) issues.push('h1 count');
    for (const wd of hero.querySelectorAll('.name__word, .btn')) {
      const rg = document.createRange();
      rg.selectNodeContents(wd);
      const tops = [...rg.getClientRects()].filter((x) => x.width > 1 && x.height > 4).map((x) => Math.round(x.top));
      if (new Set(tops.map((t) => Math.round(t / 8))).size > 1 && wd.classList.contains('name__word')) issues.push(`wraps: ${wd.textContent.trim()}`);
    }
    const name = hero.querySelector('.name').getBoundingClientRect();
    if (name.right > innerWidth + 0.5) issues.push(`name overflows viewport (${Math.round(name.right)})`);
    // Colophon and CTAs must stay off the photo.
    for (const el of hero.querySelectorAll('.colophon .role, .facts li, .btn')) {
      const r2 = el.getBoundingClientRect();
      if (r2.right > vis.left + 1 && r2.left < vis.right && r2.bottom > vis.top && r2.top < vis.bottom) issues.push(`over photo: ${el.textContent.trim().slice(0, 24)}`);
    }
    // Island must not cover hero text or buttons.
    const n = document.querySelector('app-dynamic-island .island').getBoundingClientRect();
    for (const el of hero.querySelectorAll('.label, .name__word, .role, .facts li, .btn')) {
      const r2 = el.getBoundingClientRect();
      if (r2.right > n.left && r2.left < n.right && r2.bottom > n.top && r2.top < n.bottom) issues.push(`island covers: ${el.textContent.trim().slice(0, 24)}`);
    }
    const ctaBottom = Math.round(hero.querySelector('.ctas').getBoundingClientRect().bottom);
    return { crossing, issues, ctaBottom, nameSize: getComputedStyle(hero.querySelector('.name')).fontSize, edge: Math.round(vis.left), vh: innerHeight };
  });

  await p.screenshot({ path: path.join(OUT, `hero-${w}.png`) });
  // Legibility: photo brightness behind each crossing letter, with the name hidden.
  await p.addStyleTag({ content: '#top .name { visibility: hidden !important; }' });
  const shot = await p.screenshot();
  const { data, info: im } = await sharp(shot).grayscale().raw().toBuffer({ resolveWithObject: true });
  const lum = info.crossing.map((c) => {
    let sum = 0, n = 0;
    for (let y = c.y; y < c.y + c.h && y < im.height; y++)
      for (let x = c.x; x < c.x + c.w && x < im.width; x++) { sum += data[y * im.width + x]; n++; }
    return { ch: c.ch, mean: n ? Math.round(sum / n) : null };
  });
  const darkest = lum.reduce((m, c) => (c.mean !== null && c.mean < m.mean ? c : m), { ch: '-', mean: 999 });
  if (info.crossing.length && darkest.mean < 190) info.issues.push(`crossing letter "${darkest.ch}" over dark photo (${darkest.mean})`);
  if (!info.crossing.length && w >= 360) info.issues.push('no letters cross the photo');
  if (info.ctaBottom > info.vh) info.issues.push(`CTAs below the fold (${info.ctaBottom} > ${info.vh})`);

  console.log(`${info.issues.length ? 'FAIL' : 'ok  '} @${w} name=${info.nameSize} edge=${info.edge} cta↓=${info.ctaBottom}/${info.vh} crossing=${lum.map((c) => c.ch + c.mean).join(' ')}`);
  for (const i of [...new Set(info.issues)]) console.log('     ', i);
  fails += info.issues.length ? 1 : 0;
  await ctx.close();
}
await b.close();
console.log(`\n${fails} failing widths`);
