# CLAUDE.md

This file guides Claude Code in this repository.

## Project Profile
- Project type: Angular portfolio app with optional Node/Express backend
- Primary focus: frontend UI/UX polish, data/content updates, safe iterative improvements
- Collaboration style: concise, practical, minimal-token output, direct execution over long theory

## How To Work Here
- Prefer small, targeted diffs over broad refactors.
- Preserve existing architecture and naming unless explicitly asked.
- Touch only files relevant to the request.
- Keep responses short and action-oriented.
- Always list changed files and what changed.

## Stack And Commands
Frontend (repo root):
- `npm start` (serves `http://localhost:4200/`)
- `npm run build` (output: `dist/portfolio1.1`)
- `npm test` (Karma/Jasmine, all specs)
- Single spec: `npx ng test --include='**/contact.component.spec.ts'`

Backend (`backend/`, run from repo root):
- `npm run backend:dev` (tsx watch, listens on `PORT`, default `4300`)
- `npm run backend:build` / `npm run backend:start`
- `npm --prefix backend run seed` (seeds admin user + content from `backend/.env`)
- Requires `backend/.env` (`MONGO_URI`, `JWT_SECRET` ≥32 chars) — backend exits on startup if missing/unreachable.

## Architecture Snapshot
- Angular standalone components (no NgModules)
- Routes: `src/app/app.routes.ts`
- App config: `src/app/app.config.ts`
- Main content source: `src/app/data/portfolio-content.ts`
- Shared interfaces: `src/app/interfaces/*.ts`
- Services: `src/app/services/*.service.ts`

## Styling Rules (Important)
- Reuse existing design tokens and mixins first.
- Avoid hard-coded colors when token variables exist.
- Shared card styling belongs in `src/styles/_cards.scss`.
- Keep component SCSS scoped for component-specific styles.
- Maintain consistent behavior on `/` and matching `/all*` pages.

## UI Editing Priorities
When restyling sections like certifications, projects, education:
1. Improve hierarchy (title, issuer, date, metadata).
2. Improve spacing rhythm and readability.
3. Keep copy/content unchanged unless asked.
4. Ensure responsive behavior on mobile and desktop.
5. Preserve accessibility (contrast, focus visible, readable text sizes).

## Data Editing Rules
- `portfolio-content.ts` is consumed across pages; keep IDs stable.
- Do not silently rename keys in interfaces/data.
- If shape changes are required, update interfaces and impacted consumers.

## Change Safety
- Do not add new dependencies unless explicitly requested.
- Do not perform destructive git operations unless explicitly requested.
- If unrelated local changes exist, leave them untouched.
- If a risky change is needed, state risk briefly before editing.

## Output Contract For Tasks
For implementation requests, return:
1. What was changed (brief)
2. Changed files
3. Verification done (build/test/manual)
4. Any remaining risk or follow-up

## Preferred Prompt Behavior
- Be concise and avoid token-heavy explanations.
- Skip generic tutorials unless asked.
- Prefer doing the work directly over proposing many alternatives.
- If ambiguity is low, choose the safest reasonable assumption and proceed.

## Frontend Quality Bar
- No boilerplate-looking UI patches.
- Respect existing visual language of the project.
- Avoid over-animating; use subtle, meaningful motion only.
- Ensure clean layout at common widths (mobile, tablet, desktop).
