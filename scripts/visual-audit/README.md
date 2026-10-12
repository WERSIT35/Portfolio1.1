# Visual audit harness

Layout and interaction checks for the portfolio, kept out of the app build.

```sh
cd scripts/visual-audit && npm install        # once (uses the installed Chromium)
# in the repo root: ng build, then serve the SSR build
NG_ALLOWED_HOSTS=localhost PORT=4100 node dist/Portfolio/server/server.mjs
```

| Script | What it checks |
|---|---|
| `section.mjs <sectionId> <outDir> [nowrapSelector] [baseUrl]` | One home section at 8 sizes (320 → 1920): no horizontal scroll, no text off-screen, island never covers the head, one h1. Screenshots per size. |
| `audit.mjs <outDir>` (env `BASE`) | Home + every `/work/:slug` page at several widths. Add new project slugs to `SLUGS`. |
| `cover.mjs <outDir> [baseUrl]` | Hero: screenshots + luminance under the letters that cross the photo. |
| `xp.mjs <outDir> [baseUrl]` | Experience ledger layout + interactions. |
| `certifications.mjs` | Certifications wall/ledger/lightbox with mouse, keyboard and touch. |
| `case-study.mjs <outDir> [baseUrl]` | Case study: chapter rail, next-case lens (mouse, keyboard, none on touch), lightbox arrows/Esc, next-case navigation. |

Lighthouse: `npx lighthouse http://localhost:4100/ --only-categories=accessibility,best-practices [--preset=desktop] --chrome-flags="--headless=new"`.

Class names repeat across sections (`.row`, `.mark`), so always scope selectors to the section id.
