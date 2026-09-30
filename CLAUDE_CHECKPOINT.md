# CLAUDE_CHECKPOINT — Portfolio Redesign (resume point)

> Last updated: 2026-09-30. Read this file **and** `CLAUDE.md` before touching any code.
> This portfolio is being rebuilt **from scratch, one section at a time** — never patch the old layout.

---

## 0. How we work (non-negotiable)

1. **Propose 2 radically different concepts first**, wait for the user to pick, then build. Never build unasked.
2. **One section per round**, then **stop for review**. Don't roll into the next section.
3. Every build: `ng build` (SSR + prerender clean) + `ng test` (Vitest) + visual check at desktop and phone
   (375×812 **and** 375×667) — see §6 for the browser-testing gotchas.
4. Facts come only from `src/app/data/site-data.ts` / `Data.md` / the résumé. Never invent content.
5. The user reviews motion by hand in a real browser — say plainly what couldn't be observed live.

---

## 1. Aesthetic — "Luxury Minimalist Brutalism" (Obsidian & Silver)

- **Deep dark mode:** `--color-bg: #0a0a0a`, `--color-bg-raised: #0d0f12`.
- **Monochrome only. NO colours anywhere** — no chartreuse/olive/green (rejected as "tech-bro"), no brand colours
  on devicons (and never the devicon `colored` class), no per-project hues. Photos/certificates are
  **greyscale at rest → full colour only on hover/focus of the active item**.
- **Accents:** metallic silver `--color-accent: #e0e0e0`; highlights / active states pure white `--color-white: #fff`.
- **Ink:** `--color-ink #ededed`, `--color-ink-mid #b8b8b8`, `--color-ink-dim #9a9a9a`.
- **Structure = 1px lines:** `--color-border: rgb(255 255 255 / 10%)`, `--color-border-strong: rgb(255 255 255 / 20%)`.
  No heavy drop shadows — depth comes from overlap, glass, soft radial "spotlights" and the grain.
- **Glass:** smoked translucent surfaces + inset 1px top highlight + 1px edge. `backdrop-filter` is fine on flat
  UI, but **never inside 3D-transformed stacks** (Chrome mis-orders layers — see Certifications).
- **Texture:** fixed animated film grain (`.grain` in `app.html`, ~5.5% opacity, `steps(6)` drift).
- **Radius token:** `--radius-tile: 1.5rem`; pills `999px`.

## 2. Typography

- **Display:** Cabinet Grotesk (500/700/**800 Extrabold**) — massive headings, tight tracking (`-0.03em … -0.045em`),
  line-height ~0.86–0.95. Big words are often **stroke-only at rest** (`-webkit-text-stroke: 1px rgb(255 255 255 / 15–20%)`,
  `color: transparent`) and **fill pure white** when active. On phones, thin strokes blur → use solid dark grey instead.
- **Body:** Satoshi (400/500/700/900). Banned: Inter, Roboto, Arial, Space Grotesk.
- **Architectural labels:** 0.625–0.75rem, **UPPERCASE, `letter-spacing: 0.1–0.14em`**, ink-dim.
  Section kickers follow `NN / Name` (e.g. `05 / Certifications`).
- **Numbers:** `font-variant-numeric: tabular-nums`; indexes zero-padded (`01`, `08`).
- **Sizing:** container-query units (`cqi/cqh/cqmin`) + `clamp()`/`min()` so type is fitted to its box — nothing
  scrolls inside a tile.

## 3. Physics & interaction rules

- **Nothing snaps instantly.** Every state change eases. Tokens in `src/styles.scss`:
  - `--ease-luxe: cubic-bezier(0.19, 1, 0.22, 1)` — heavy, deliberate settles (openings, widenings, reveals).
  - `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`; `--ease-spring`: `linear()` spring (~15% overshoot) — use sparingly.
  - Asymmetric timing where it matters: **open slow (0.55–0.6s luxe), close fast (0.28s `cubic-bezier(0.4,0,0.2,1)`,
    zero delay)** — declare the closing transition on the *base* state and the opening one on the *active* state.
- **CSS can't interpolate `auto`.** Measure natural sizes with `ResizeObserver` → CSS vars → animate real pixels
  (this is how the Dynamic Island morph works). `0fr→1fr` grid tricks do NOT resize a shrink-to-fit box.
- **Springs & lerps in JS (rAF), dt-normalised,** for anything physical:
  - Lerp-followers (glass lenses/cards trail the cursor): Projects lens `0.11`/frame, Skills card `0.14`, deck tilt `0.10`.
  - Semi-implicit Euler springs: Certifications deck `K=0.05, D=0.74` → ~3.7% settle, 90% at ~220ms, rest ~0.7s.
    Tune new springs offline with a tiny node simulation (overshoot / 90% time / settle time) before shipping.
  - Exponential easing with time constants: Skills marquees `BRAKE_TAU 160ms`, `RESUME_TAU 450ms`, scroll-velocity boost.
  - Loops run only while needed (IntersectionObserver / settle detection); `cancelAnimationFrame` on destroy.
- **Section heads:** every section except the Hero opens with `NN / Name` + title (the Hero is a cover: no header row; the island calls it "Prologue" and "Architecting digital experiences." lives under the name in the intro tile) — 02 Experience · Three roles, in parallel, 03 Projects · Selected works, 04 Skills · The toolkit, in motion, 05 Certifications · On the record, 06 Education · The foundation, 07 Contact · The next step.
- **Magnetic weights:** `magneticWeight="heavy"` (K 0.022 / D 0.81, shared with the Contact letters) for CTAs; default `light` (K 0.14 / D 0.78) for the island. The directive is dt-normalised (same feel at 60/120Hz).
- **Magnetic** (`appMagnetic`) is a JS spring on the standalone `translate` property — it must **never write
  `transition`/`transform` inline** (that bug once killed the island's transitions).
- **Scroll:** every home section is a full-viewport `.stage` (`min-height: 100svh`); `html.has-snap` uses
  `scroll-snap-type: y proximity` (NOT mandatory, no `snap-stop: always`). Depth transition = scroll-driven
  `animation-timeline: view()` on `.stage__inner` (translateY 30% + scale 0.95 + black veil to 0.65, eased
  keyframes), wrapped in `@supports` + `prefers-reduced-motion: no-preference`. Global `scroll-behavior: smooth`.
- **Island = pure overlay (2026-09-30):** sections carry NO island clearance padding (just 1.25rem / 0.75rem gutters). Stage hairline is a `::before`, not `border-top` (a border made stages 1px taller → snap drift). Phones: island **docked at the bottom** (`--island-bottom`, 20px/40px 50% shadow, panel opens upward); every phone stage reserves `--dock-clear` (0 on desktop) at its bottom edge so nothing sits under the dock.
- **Every section fits exactly one viewport** (`height: 100svh`) at 1440×900, 1920×911, 375×812 and 375×667;
  short screens (`max-height ~620px`) fall back to `height: auto; min-height: 100svh` rather than crushing content.
- **Accessibility is part of the spec:** real buttons/links, `aria-expanded`/`aria-controls` disclosures,
  `inert` on hidden panels, `:focus-visible` outlines (1px white), keyboard paths for every pointer interaction,
  `prefers-reduced-motion` fallbacks for every motion system, native `<dialog>` for lightboxes.
- **SSR-safe:** browser-only work in `afterNextRender` (no `window` at module scope); server render shows final
  values (e.g. count-up renders the number, clock shows `--:--`).

## 4. Architecture map (Angular 22, standalone, signals, zoneless)

- **Shell:** `src/app/app.html` = `<app-dynamic-island />` + `<main><router-outlet/></main>` + `.grain`.
  `pages/home-page` wraps each section in `<div class="stage"><div class="stage__inner">…</div></div>` and
  toggles `html.has-snap` (removed on leave, so `/work/:slug` pages don't snap).
- **Global styles/tokens:** `src/styles.scss` (fonts, tokens, `.stage`, grain, `.img-fade`, reduced-motion).
- **Directives** (`src/app/directives/`): `magnetic`, `spotlight` (`--spot-x/y` + optional tilt), `count-up`,
  `img-loaded` (`.img-fade` → `.is-loaded`), `spy-section` (+ `services/scroll-spy.service.ts` for the island label),
  `reveal-on-scroll` (legacy).
- **Utils:** `project-media.ts` (`desktopShots/mobileShots` by `*Mob*` filename), `project-status.ts`,
  `skill-groups.ts` (groups + learned/gained, no colours).
- **Assets:** all images are WebP siblings made by `npm run optimize:images` (`scripts/optimize-images.mjs`, sharp);
  `og-card.png` stays PNG; `C#.png` → `Csharp.webp`.
- **Budget:** `angular.json` `anyComponentStyle` raised to 12kB warn / 20kB error.
- **Known gotchas:** Angular emulated encapsulation raises specificity (`.tile > *` beat `.portrait__media` → use
  explicit classes); a template ref `#card` shadows a component member named `card`; `RouterLink` navigates from its
  own click handler — `preventDefault()` can't stop it (use a separate `<button>` for phone disclosures).

## 5. Progress

| Section | Status | Concept shipped | Key files |
|---|---|---|---|
| Foundation (WebP, data, C# cert, meta/OG) | ✅ **100% COMPLETE** | — | `scripts/optimize-images.mjs`, `site-data.ts`, `index.html` |
| Shell + Dynamic Island nav | ✅ **100% COMPLETE** | Floating pill; measured-pixel morph (open 0.6s luxe / close 0.28s) | `components/layout/dynamic-island/*` |
| Hero | ✅ **100% COMPLETE** | Recruiter pass: no header row; contrast ladder name › role › pitch › tagline; clock, "3 roles" stat, Fig. chip and icon marquee cut; static Core stack keyword rows (pitch skills first, phones: top 2 per group); Download CV + View the work as the dominant bottom-right pair; lerped bento plane parallax (±1.2°, 6px drift); heavy-magnet CTAs; cinematic staggered drop-in entrance; Bento grid; B/W portrait → colour; live Tbilisi clock; count-ups; stack marquee | `components/hero/hero-section/*` |
| Experience | ✅ **100% COMPLETE** | "Triptych", now data-driven for any role count (5 real roles, 2026-10-01): `--count` from the data sizes the open panel as row − (count−1)·strip (phone: same, vertically; 44px bands); summaries are stored verbatim and split into lead + numbered lines at '. ' + capital; watermark span and "Sep 2022 → Present" range derived from the dates; luxe widening, staggered side-slide; phone accordion. Hero "Currently" lists every "… – Present" role, engineering first | `components/experience/experience-section/*` |
| Projects | ✅ **100% COMPLETE** | "Index" — massive stroke names, lerped glass lens (flip above/below), crossfading shots; phone accordion | `components/projects/projects-section/*` |
| Skills | ✅ **100% COMPLETE** | "Ticker" — 6 JS-physics marquees, eased brake/resume, scroll-velocity boost, trailing glass card; phone sheet | `components/skills/skills-section/*` |
| Certifications | ✅ **100% COMPLETE** | "Deck" — 3D spring peel, lerped tilt + glare, B/W → colour front plate, `<dialog>` lightbox, flat crossfade for reduced motion | `components/certifications/certifications-section/*` |
| Education | ✅ **COMPLETE** | "Cinematic Transcript" (A+B mix) — B/W campus stills w/ drift, scrubbable 2019→2027 rail (lerped playhead, tabs), transcript + course list; list hover warms still to colour; phone = vertical rail | `components/education/education-section/*` |
| Contact | ✅ **100% COMPLETE** | "Curtain" — sticky stage beneath the page (`.stage--curtain`), Education lifts off as a rounded sheet (`.stage--lift`, own view timeline `--curtain` via `timeline-scope` on app-home-page) with edge-tracking shade + veil/rise; JS-fitted Cabinet 800 email (outline → white), per-letter heavy spring magnet (K 0.022 / D 0.81); action row: copy (Copied ✓ 2s), résumé, GitHub, LinkedIn, phone, live Tbilisi clock w/ seconds | `components/contact/contact-section/*`, `styles.scss` curtain block |

Also still open (not blocking): `og:image` needs an absolute URL once the production domain is known;
`og-card.png` may still contain the old green; `src/styles.scss` uses deprecated Sass `@import 'tailwindcss'`.
**Committed** on branch `feature/luxury-brutalism-redesign` (branched from `master`; main branch: `main`). Not pushed.

## 6. Browser-testing gotchas (Claude-in-Chrome)

- The automation tab reports `visibilityState: "hidden"` → rAF doesn't fire, CSS transitions / smooth scroll barely
  advance, timers throttle to ≥1s. **Never `await requestAnimationFrame`** in `javascript_exec` (hangs the tab).
- Verify motion deterministically: pause CSS transitions via `getAnimations()` + `currentTime` and measure; for JS
  loops use `ng.getComponent(el)` (dev mode) and call the private `tick(t)` with synthetic 16ms timestamps.
- Images inside composited 3D layers may look blank until any style change forces a repaint — not a z-order bug.
- The window can't be resized → test phones in same-origin iframes (375×812, 375×667) via `document.write`.
- The user's `ng serve` sometimes misses edits written by node/sed scripts → check served `<style>` text; `touch` the file.
- Navigating to the same URL with a different `#hash` does **not** reload — use `location.reload()` for a clean state.
- **Dev-server HMR rebuilds template DOM on load** for components edited during the `ng serve` session (same
  instance, new nodes). Long-lived observers must watch the host (`inject(ElementRef)`), never a `#ref` inside the
  template — this froze the Skills ticker once. Hidden Chrome tabs never fire rAF/IO: verify live motion with Puppeteer.

---

## 7. NEXT: Education — two concepts (awaiting the user's pick)

**Facts available (site-data.ts → `EDUCATION_ITEMS`):**
- **University of Georgia** — BSc Computer Science, `2019–2025`; subjects: Data Structures & Algorithms, Computer Networks,
  Operating Systems, OOP, Oracle Database Design & Programming, Intro to Web Technologies, IT Services & Project
  Management, Discrete Mathematics, Computer Architecture. Logo `Universities/ug.webp`, cover `covers/ug.webp`.
- **Business and Technology University** — MSc DevOps, **In Progress, expected 2026** (coursework, *not* professional
  DevOps experience — keep that caveat; **no start year in the data — don't invent one**); subjects: containerization &
  orchestration, cloud infrastructure, CI/CD systems, production deployment strategies. Logo `btu.webp`, cover `btu.webp`.
- **freeCodeCamp** — Professional Certificates, `Ongoing`; Responsive Web Design, JS Algorithms & Data Structures,
  Front-End Development Libraries, Intro to AWS Solutions. Logo `fcc.svg`, cover `fcc.webp`.
- Unused asset available: `Universities/w3.webp` (already used as an issuer logo in Certifications).

### Concept A — "Transcript Line" (a measured timeline you scrub)
```
┌────────────────────────────────────────────────────────────────────────┐
│ 06 / Education                                     2019 ──────── 2026  │
│                                                                        │
│  2019    2020    2021    2022    2023    2024    2025    2026          │
│   │───────┼───────┼───────┼───────┼───────┼───────┼───────┼── ◀ playhead│
│   ███████████████████████████████████████████████████▌ UG · BSc CS     │
│                                           ┄┄┄┄┄┄┄┄┄┄┄┄┄◆ BTU · MSc 2026 │
│                                   ▪ ▪    ▪ ▪              fcc · certs  │
│────────────────────────────────────────────────────────────────────────│
│  BSc COMPUTER SCIENCE            │ 01 Data Structures & Algorithms     │
│  University of Georgia           │ 02 Computer Networks                │
│  2019 — 2025                     │ 03 Operating Systems   …  09        │
└────────────────────────────────────────────────────────────────────────┘
```
- A hairline **architectural timeline 2019 → 2026** with tabular year ticks, drawn in by a scroll-driven animation
  (`animation-timeline: view()`, stroke-dashoffset) as the stage arrives.
- **Tracks:** UG as a solid white bar over 2019–2025; BTU as a **dashed, slowly "flowing" line ending in a ◆ at 2026**
  labelled *In progress · expected 2026* (no invented start); freeCodeCamp as **tick marks at real certificate issue
  dates** pulled from `CERTIFICATIONS` (2023, 2024…).
- **Playhead physics:** a vertical silver line lerps (≈0.12/frame) to the cursor's x; the year under it reads out in
  tabular numerals; tracks under the playhead brighten. Click/Enter on a track **locks** it.
- **Lower half = "transcript":** giant Cabinet degree title (stroke → white), institution + dates, and the subjects as a
  numbered course list (`01 … 09`) whose rows rise in with the luxe stagger; the logo chip sits monochrome beside it.
  The institution's **cover photo bleeds in B/W behind the transcript** at low opacity, warming to colour on hover.
- **Keyboard:** tracks are buttons (← → between them); `aria-pressed` on the locked one. **Phones:** the timeline turns
  vertical down the left edge; tapping a node swaps the transcript below — all inside 100svh.
- **Why:** shows chronology/overlap honestly (the BSc→MSc hand-off and certs in parallel) with a new interaction
  (scrubbing) that no other section uses.

### Concept B — "Cinema Stills" (full-bleed campus frames with a credits roll)
```
┌────────────────────────────────────────────────────────────────────────┐
│ 06 / Education                                          01 / 03  ▮▯▯   │
│ ░░░░░░░░░░░░░░ full-bleed B/W campus still (covers/ug) ░░░░░░░░░░░░░░░ │
│ ░░░                                                         CREDITS ░░ │
│ ░░░  B S c                                                  Data Str.░ │
│ ░░░  COMPUTER SCIENCE   ← giant outlined title over photo   Networks ░ │
│ ░░░  [ug] University of Georgia · 2019 — 2025               OS  ↑    ░ │
│ ░░░                                                         OOP roll ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│   ◀  drag / ← →  ▶             next still wipes in via clip-path ▶     │
└────────────────────────────────────────────────────────────────────────┘
```
- Each institution is a **full-viewport cinematic still** from `covers/*` in high-contrast B/W with a slow Ken Burns
  drift and the global grain on top; hovering warms it to colour (same rule as the portrait).
- The degree title sits over the photo **massive and stroke-only**, filling white on arrival; the institution line
  carries the monochrome logo chip and tabular dates. BTU carries an explicit **"In progress · expected 2026"** badge.
- **Transitions:** the next still **wipes in with a spring-driven `clip-path: inset()`** (a vertical blade sweeping
  across, K/D tuned like the deck) while the outgoing title slides left and the incoming one rises from a mask.
  Paging = drag/flick (touch-action pan-y), arrows, ← → keys, and a segmented progress bar.
- **Credits roll:** subjects scroll upward on the right edge like film credits (slow, pauses on hover, eased
  brake/resume reusing the Skills marquee physics); focusable list for keyboard/AT with the motion paused.
- **Reduced motion:** stills crossfade, no Ken Burns, credits become a static list. **Phones:** still fills the top ~55%,
  title + credits (static list) below, swipe to page — within 100svh.
- **Why:** the only section driven by photography — a cinematic change of pace after the typographic lists and the
  3D deck, and it finally uses the campus cover images at full scale.

*(Contact concepts are proposed only after Education ships.)*
