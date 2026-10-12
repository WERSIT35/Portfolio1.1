// Case study ("Dossier") interactions. usage: node case-study.mjs <outDir> [baseUrl]
// Chapter rail fills and tracks the read line; next case lens + difference blend on mouse and
// keyboard (none on touch); lightbox opens, steps with arrows, closes on Esc; next case nav.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [outDir = 'case-study', BASE = 'http://localhost:4200'] = process.argv.slice(2);
const OUT = path.resolve(outDir);
fs.mkdirSync(OUT, { recursive: true });

const b = await chromium.launch();
let fails = 0;
const check = (ok, msg) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
  if (!ok) fails++;
};

// Desktop, mouse + keyboard ------------------------------------------------------------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/work/shello', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(OUT, 'cover-1440.png') });

  const rail = () =>
    p.evaluate(() => ({
      progress: parseFloat(
        getComputedStyle(document.querySelector('.chapters')).getPropertyValue('--progress'),
      ),
      active: [...document.querySelectorAll('.chapter')].findIndex((c) =>
        c.classList.contains('is-active'),
      ),
    }));
  check((await rail()).progress === 0, 'rail empty at the top');

  await p.evaluate(() =>
    document.querySelectorAll('.chapter')[1].scrollIntoView({ block: 'start' }),
  );
  await p.waitForTimeout(500);
  const mid = await rail();
  check(
    mid.progress > 0 && mid.progress < 1 && mid.active >= 1,
    `rail mid-way (${mid.progress.toFixed(2)}, chapter ${mid.active + 1})`,
  );
  await p.screenshot({ path: path.join(OUT, 'chapters-1440.png') });

  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(500);
  const end = await rail();
  check(end.progress === 1, 'rail full at the end');

  // Next case: mouse over the name.
  const name = p.locator('.next__name');
  const box = await name.boundingBox();
  await p.mouse.move(box.x + 40, box.y + box.height / 2);
  await p.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2, { steps: 12 });
  await p.waitForTimeout(900);
  const hot = await p.evaluate(() => ({
    hot: document.querySelector('.next').classList.contains('is-hot'),
    lens: getComputedStyle(document.querySelector('.next .lens')).opacity,
    blend: getComputedStyle(document.querySelector('.next__name')).mixBlendMode,
  }));
  check(
    hot.hot && hot.lens === '1' && hot.blend === 'difference',
    `next hover: lens ${hot.lens}, blend ${hot.blend}`,
  );
  await p.screenshot({ path: path.join(OUT, 'next-hover-1440.png') });
  await p.mouse.move(5, 5);
  await p.waitForTimeout(400);
  check(
    !(await p.evaluate(() => document.querySelector('.next').classList.contains('is-hot'))),
    'next hover clears on leave',
  );

  // Keyboard focus on the next link parks the lens.
  await p.locator('.next__link').focus();
  await p.keyboard.press('Shift+Tab');
  await p.keyboard.press('Tab');
  await p.waitForTimeout(500);
  check(
    await p.evaluate(() => document.querySelector('.next').classList.contains('is-hot')),
    'next focus-visible shows the lens',
  );

  // Lightbox.
  await p.locator('#plates-title').scrollIntoViewIfNeeded();
  await p.locator('.plate').nth(0).click();
  await p.waitForTimeout(600);
  const cap = () => p.locator('.lightbox__caption').innerText();
  check((await cap()).includes('1 / 12'), `lightbox opens at 1 (${await cap()})`);
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(150);
  check((await cap()).includes('2 / 12'), 'ArrowRight steps forward');
  await p.keyboard.press('ArrowLeft');
  await p.keyboard.press('ArrowLeft');
  await p.waitForTimeout(150);
  check((await cap()).includes('12 / 12'), 'ArrowLeft wraps to the last');
  await p.screenshot({ path: path.join(OUT, 'lightbox-1440.png') });
  await p.keyboard.press('Escape');
  check(!(await p.evaluate(() => document.querySelector('dialog.lightbox').open)), 'Esc closes');

  // Navigate to the next case: page rebuilds, rail resets, title updates.
  await p.locator('.next__link').click();
  await p.waitForURL('**/work/lumina-games');
  await p.waitForFunction(() => scrollY === 0, null, { timeout: 4000 }).catch(() => {});
  await p.waitForTimeout(800);
  const after = await p.evaluate(() => ({
    y: scrollY,
    title: document.title,
    h1: document.querySelector('h1').textContent.trim(),
  }));
  check(
    after.y === 0 && after.h1.startsWith('Lumina') && after.title.startsWith('Lumina'),
    `next nav: ${after.title} @y=${after.y}`,
  );
  check((await rail()).progress === 0, 'rail resets on the next case');
  await ctx.close();
}

// Phone, touch ------------------------------------------------------------------------
{
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + '/work/elite-weddings', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(OUT, 'cover-390.png') });
  await p.locator('#plates-title').scrollIntoViewIfNeeded();
  await p.locator('.plate').nth(1).tap();
  await p.waitForTimeout(600);
  check(
    (await p.locator('.lightbox__caption').innerText()).includes('2 / 8'),
    'tap opens the plate',
  );
  await p.screenshot({ path: path.join(OUT, 'lightbox-390.png') });
  await p.locator('.lightbox__close').tap();
  await p.locator('.next__link').scrollIntoViewIfNeeded();
  check(
    await p.evaluate(
      () => getComputedStyle(document.querySelector('.next .lens')).display === 'none',
    ),
    'no lens on phones',
  );
  await p.screenshot({ path: path.join(OUT, 'next-390.png') });
  await ctx.close();
}

await b.close();
console.log(fails ? `\n${fails} failing checks` : '\nall checks pass');
process.exit(fails ? 1 : 0);
