# CLAUDE.md — Repository Guidelines & Execution Rules

This file provides strict guidance to Claude Code (`claude.ai/code`) when working in this repository. Read and adhere to all rules during every session.

---

## 1. Project Overview & Role
- **Project:** Bespoke personal portfolio for Otar Davitashvili (Applied AI & Full-Stack Engineer).
- **Stack:** Angular 22 (Standalone components, modern control flow, SSR/hydration via `@angular/ssr`), Tailwind CSS / SCSS.
- **Data Sources:** Primary content is defined in `Data.md` at the repo root and `Otar Davitashvili Resume.pdf`. Do not invent, embellish, or alter these facts.

---

## 2. Anti-Slop UI/UX & Design Principles

To ensure a high-end, distinct aesthetic, strictly avoid generic AI template tropes.

### Typography
- **BANNED:** Inter, Roboto, Arial, Space Grotesk.
- **Display Headlines:** Cabinet Grotesk, Syne, Clash Display, or Playfair Display.
- **Body & Code:** Geist, Satoshi, or Plus Jakarta Sans.

### Palette & Visual Texture
- **Base Background:** Deep charcoal/black (`#0A0A0A` or `#0D0F12`).
- **Accents:** Use one primary intentional accent (e.g., desaturated amber, chartreuse, or emerald) paired with subtle white alpha borders (`border-white/10`).
- **Textures:** Incorporate subtle radial light spotlights, noise overlays, and glassmorphic container surfaces instead of heavy flat drop shadows.

### Layout & Motion
- **Layout:** Use asymmetrical grids, staggered cards, overlapping spatial elements, and generous negative space.
- **Micro-Interactions:** Snappy hover states, smooth transitions, and subtle scroll-driven reveals.
- **Responsive Targets:** Ensure flawless layout across mobile (`375px`) and desktop (`1440px`).

---

## 3. Angular 22 Architecture & Code Standards

- **Standalone Architecture:** All components must be `standalone: true`. No `NgModules`.
- **Modern Control Flow:** Use native `@if`, `@for`, `@switch`, and `@defer` syntax. Never use legacy `*ngIf` or `*ngFor` directives.
- **State Management:** Use Angular Signals (`signal()`, `computed()`, `input()`, `output()`) for reactive state and component inputs/outputs. Use RxJS primarily for API stream handling.
- **Types & Interfaces:** Create strict TypeScript interfaces under `src/app/interfaces/*.ts` matching `Data.md` before building UI components.
- **Hydration & SSR:** Ensure code is SSR-safe (check platform context with `isPlatformBrowser` before referencing `window` or `document`).

---

## 4. Component Pattern Adaptation (React -> Angular)

> ⚠️ **CRITICAL:** UI component libraries such as `shadcn/ui`, `21st.dev`, `Magic UI`, or `Aceternity` are built for React and **will not install directly via CLI** into this Angular project.

When leveraging designs or patterns from these ecosystems:
1. Treat them strictly as **visual and architectural reference patterns**.
2. Manually port the layout structure, Tailwind utility classes, and Framer Motion logic into native **Angular 22 standalone components** using CSS keyframes, Tailwind, or Angular animations.

---

## 5. Tooling & Visual Verification (Puppeteer MCP)

Claude Code must visually inspect its work before considering any UI component complete.

1. **Launch Dev Server:** Ensure the app is running locally at `http://localhost:4200`.
2. **Puppeteer Navigation:** Use the Puppeteer MCP server (`@modelcontextprotocol/server-puppeteer`) to navigate to `http://localhost:4200`.
3. **Capture & Inspect:** Take screenshots of newly created or updated sections at both desktop (`1440x900`) and mobile (`375x812`) viewports.
4. **Self-Audit:** Examine the screenshot for typography execution, contrast, padding consistency, mobile overflow, and adherence to anti-slop design rules before asking for user approval.

---

## 6. Commands & CLI Workflow

- `npm start` / `ng serve` — Run local dev server (`http://localhost:4200`).
- `ng build` — Production build (`dist/`).
- `ng test` — Run unit tests via Vitest.
- `ng generate component components/<name>` — Scaffold a new standalone component.
- `node dist/Portfolio/server/server.mjs` — Run production SSR server build.

---

## 7. Formatting & Code Style

- **Prettier:** 100-character print width, single quotes, Angular parser for templates.
- **Indent:** 2 spaces, final newline enforced.
- **Naming:** kebab-case for filenames, PascalCase for classes, camelCase for variables/signals.