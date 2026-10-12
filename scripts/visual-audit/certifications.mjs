// Certifications: wall/ledger/lightbox interactions (mouse, keyboard, touch). usage: node certifications.mjs (expects the SSR build on :4100)
import { chromium } from 'playwright';
const b = await chromium.launch();
const log = (...a) => console.log(...a);
// Desktop mouse
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4100/', { waitUntil: 'networkidle' });
  await p.evaluate(() => { document.documentElement.classList.remove('has-snap'); document.getElementById('certifications').scrollIntoView(); });
  await p.waitForTimeout(500);
  const rows = p.locator('#certifications .row');
  await rows.nth(1).hover(); await p.waitForTimeout(500);
  log('hover row2 caption:', await p.locator('.preview__caption').innerText(), '| lit marks:', await p.locator('.mark.is-on .mark__name').allInnerTexts(), '| dim rows:', await p.locator('#certifications .row.is-dim').count());
  await p.screenshot({ path: 'cx-hover-row.png' });
  await p.locator('#certifications .mark').nth(0).hover(); await p.waitForTimeout(400);
  log('hover mark1 dim rows:', await p.locator('#certifications .row.is-dim').count());
  await p.screenshot({ path: 'cx-hover-mark.png' });
  await rows.nth(6).locator('button').click(); await p.waitForTimeout(700);
  log('dialog open:', await p.locator('dialog.lightbox').evaluate((d) => d.open), await p.locator('.lightbox__links a').allInnerTexts());
  await p.screenshot({ path: 'cx-lightbox.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  log('after esc open:', await p.locator('dialog.lightbox').evaluate((d) => d.open), 'focus:', await p.evaluate(() => document.activeElement?.textContent.trim().slice(0,40)));
  // keyboard
  await p.keyboard.press('Tab'); await p.waitForTimeout(300);
  log('tab focus:', await p.evaluate(() => document.activeElement?.textContent.trim().slice(0,40)), 'caption:', await p.locator('.preview__caption').innerText());
}
// Phone touch
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto('http://localhost:4100/', { waitUntil: 'networkidle' });
  await p.evaluate(() => { document.documentElement.classList.remove('has-snap'); document.getElementById('certifications').scrollIntoView(); });
  await p.waitForTimeout(500);
  await p.locator('#certifications .mark').nth(1).tap(); await p.waitForTimeout(400);
  log('tap mark2 pressed:', await p.locator('.mark[aria-pressed=true] .mark__name').allInnerTexts(), 'dim rows:', await p.locator('#certifications .row.is-dim').count());
  await p.screenshot({ path: 'cx-tap-mark.png' });
  await p.locator('#certifications .mark').nth(1).tap(); await p.waitForTimeout(300);
  log('tap again dim rows:', await p.locator('#certifications .row.is-dim').count());
  await p.locator('#certifications .row button').nth(0).tap(); await p.waitForTimeout(700);
  await p.screenshot({ path: 'cx-lightbox-phone.png' });
  log('phone dialog open:', await p.locator('dialog.lightbox').evaluate((d) => d.open));
}
await b.close();
