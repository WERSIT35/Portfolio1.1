// Generates public/sitemap.xml, public/robots.txt and the 1200×630 link-preview images in
// public/assets/og/ (home.png + one per project), all from src/app/data/site-data.ts.
//
//   node scripts/seo/generate.mjs           # sitemap + robots (no browser needed)
//   node scripts/seo/generate.mjs --og      # also the OG images (needs: cd scripts/seo && npm i,
//                                           # and a Chromium; set CHROME_PATH if not default)
//
// Re-run after changing projects or contact data, then commit the outputs.
import { build } from 'esbuild';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE_URL = 'https://portfolio1-1-mu.vercel.app';

const bundled = await build({
  entryPoints: [join(ROOT, 'src/app/data/site-data.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
});
const data = await import(
  'data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64')
);
const { PROJECTS, CONTACT } = data;
const today = new Date().toISOString().slice(0, 10);

// sitemap + robots -------------------------------------------------------------------
const urls = [`${SITE_URL}/`, ...PROJECTS.map((p) => `${SITE_URL}/work/${p.slug}`)];
writeFileSync(
  join(ROOT, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(
  join(ROOT, 'public/robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(`sitemap.xml: ${urls.length} URLs · robots.txt`);

if (!process.argv.includes('--og')) process.exit(0);

// OG images ----------------------------------------------------------------------------
const { chromium } = await import('playwright-core');
const font = (file) => pathToFileURL(join(ROOT, 'public/fonts', file)).href;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const status = (s) => ({ live: 'Live', 'in-production': 'In production', 'in-development': 'In development', prototype: 'Prototype' })[s] ?? s;

const shell = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Geist;src:url(${font('geist/Geist-Regular.woff2')});font-weight:400}
@font-face{font-family:Geist;src:url(${font('geist/Geist-Medium.woff2')});font-weight:500}
@font-face{font-family:Geist;src:url(${font('geist/Geist-Bold.woff2')});font-weight:700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#0a0a0a;color:#fafafa;font-family:Geist,sans-serif;overflow:hidden}
.k{font-size:20px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#a1a1a1}
.rule{height:1px;background:rgb(255 255 255/16%)}
</style></head><body>${body}</body></html>`;

const live = PROJECTS.filter((p) => p.status === 'live').length;
const portrait = pathToFileURL(join(ROOT, 'public', CONTACT.image)).href;
const pages = [
  {
    file: 'home.png',
    html: shell(`
<div style="position:absolute;right:0;top:0;width:420px;height:630px;background:url(${portrait}) 50% 30%/cover;filter:grayscale(1) contrast(1.05)"></div>
<div style="position:absolute;left:72px;top:64px;right:480px;bottom:64px;display:flex;flex-direction:column">
  <p class="k">${esc(CONTACT.location)}</p>
  <h1 style="margin-top:auto;font-size:112px;font-weight:700;line-height:.9;letter-spacing:-.045em">${esc(CONTACT.name)}<br>${esc(CONTACT.surname)}</h1>
  <p style="margin-top:28px;font-size:30px;font-weight:500">Full-stack web platforms to STM32 firmware.</p>
  <div class="rule" style="margin-top:28px"></div>
  <p style="margin-top:20px;font-size:24px;color:#c8c8c8"><b style="color:#fff;font-size:30px">${PROJECTS.length}</b> projects · ${live} live · Full-Stack Engineer</p>
</div>`),
  },
  ...PROJECTS.map((p, i) => ({
    file: `${p.slug}.png`,
    html: shell(`
<div style="position:absolute;inset:64px 72px;display:flex;flex-direction:column">
  <p class="k">Case study ${String(i + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')} · Otar Davitashvili</p>
  <h1 style="margin-top:auto;font-size:${p.projName.length > 22 ? 84 : 112}px;font-weight:700;line-height:.95;letter-spacing:-.04em">${esc(p.projName)}</h1>
  <p style="margin-top:24px;font-size:30px;font-weight:500;color:#e5e5e5">${esc(p.subname.split(' — ')[0])}</p>
  ${p.result ? `<p style="margin-top:12px;font-size:24px;color:#c8c8c8">${esc(p.result)}</p>` : ''}
  <div class="rule" style="margin-top:28px"></div>
  <p style="margin-top:20px;font-size:22px;color:#a1a1a1">${esc(p.stack.slice(0, 4).join(' · '))} · ${p.year} · ${status(p.status)}</p>
</div>`),
  })),
];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const outDir = join(ROOT, 'public/assets/og');
mkdirSync(outDir, { recursive: true });
// Rendered from real files (not setContent) so file:// fonts and the portrait are allowed to load.
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
for (const { file, html } of pages) {
  const htmlPath = join(tmp, file.replace(/\.png$/, '.html'));
  writeFileSync(htmlPath, html);
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').length);
  if (!fonts) throw new Error(`Geist did not load for ${file}`);
  await page.screenshot({ path: join(outDir, file), type: 'png' });
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`${pages.length} OG images → public/assets/og/`);
