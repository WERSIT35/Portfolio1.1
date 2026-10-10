// One-time image optimizer: writes a .webp sibling for every PNG/JPG under public/assets,
// then an -800w.webp variant of every project screenshot wider than that (the srcset's
// phone candidate, see utils/project-media.ts). Originals are kept.
// Run with `npm run optimize:images`; `-- --variants-only` skips the first pass.
import { readdir, stat } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets';
const DEFAULT_MAX_WIDTH = 1600;
const QUALITY = 80;
const VARIANT_ROOT = 'public/assets/projects';
const VARIANT_WIDTH = 800;
const VARIANTS_ONLY = process.argv.includes('--variants-only');

// Social crawlers handle PNG more reliably than WebP.
const SKIP = new Set(['og-card.png']);

// Full-size certificates need extra resolution so text stays legible in the lightbox.
const maxWidthFor = (file) =>
  /Certification[\\/]Claude[\\/](?!.*-card)/.test(file) ? 2400 : DEFAULT_MAX_WIDTH;

// '#' in a URL starts a fragment, so C#.png becomes Csharp.webp.
const outputName = (file) => basename(file, extname(file)).replace(/#/g, 'sharp') + '.webp';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let before = 0;
let after = 0;

for await (const file of VARIANTS_ONLY ? [] : walk(ROOT)) {
  if (!/\.(png|jpe?g)$/i.test(file) || SKIP.has(basename(file))) continue;

  const out = join(dirname(file), outputName(file));
  const { size } = await stat(file);
  const info = await sharp(file)
    .resize({ width: maxWidthFor(file), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  before += size;
  after += info.size;
  console.log(`${(size / 1024).toFixed(0).padStart(6)}KB -> ${(info.size / 1024).toFixed(0).padStart(5)}KB  ${out}`);
}

console.log(`\nTotal: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);

for await (const file of walk(VARIANT_ROOT)) {
  if (!file.endsWith('.webp') || file.endsWith(`-${VARIANT_WIDTH}w.webp`)) continue;
  if ((await sharp(file).metadata()).width <= VARIANT_WIDTH) continue;

  const out = file.replace(/\.webp$/, `-${VARIANT_WIDTH}w.webp`);
  const info = await sharp(file).resize({ width: VARIANT_WIDTH }).webp({ quality: QUALITY }).toFile(out);
  console.log(`${(info.size / 1024).toFixed(0).padStart(6)}KB  ${out}`);
}
