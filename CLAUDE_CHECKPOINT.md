# CLAUDE_CHECKPOINT — resume point

> Last updated: 2026-10-12. Read this file **and** `CLAUDE.md` before touching code.
> `main` is clean and deployed (Vercel). Last merged: PR #25 (Certifications redesign).

---

## 0. How we work

1. **Art direction over checklists.** Pitch a concept in chat (a few lines, maybe a sketch) before building
   anything new; the user rejected "correct but boxy" designs and dislikes wasted space.
2. Once a concept is approved, build it straight through: branch → verify → commit → PR → merge
   (the user's standing instruction: "Merge when you finish the task fully, don't stop").
3. **Facts only** from `src/app/data/site-data.ts` (= `Data.md`), the résumé (`Otar Davitashvili Resume.pdf`) and the
   public GitHub profile (WERSIT35). Never invent or embellish. Conflicts go to the user (see §4).
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
- Freelance start: site says Sep 2022, résumé says 09/2024 (kept the site's; suggested updating the CV).
- W3Schools AWS certificate image shows "Oto Your family name" and "Issued September 20, 2023"; the data says 2024.
  Needs a re-issued certificate (surname set on W3Schools) and the correct year.
- MSc (BTU) start year unknown; shown as "Expected 2026" only.
- FastAPI, MySQL, Firebase, NGINX have no project evidence (kept by request).
- Lean Tech and Icecat are on the site but not on the résumé (kept).

**Next work, in order:**
1. **Case-study pages** (`/work/:slug`, `src/app/pages/project-detail/`): still the old design (glass cards, "At a glance" boxes).
   Pitch a Cover-language concept in chat first.
2. Phone polish: Experience rule when all rows are collapsed (pick a default row), Skills tap hint, Education
   "Expected" label at the screen edge, BTU logo, Contact gap.
3. Mobile performance (Lighthouse perf ~55) and SEO.
4. Island brand link: `aria-label="Back to top"` doesn't contain its visible "OD" (Lighthouse
   label-content-name-mismatch, unscored).
5. Delete the orphan `pr-assets/*` screenshot branches once the user no longer needs them.
