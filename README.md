# Portfolio 1.1

Modern full-stack portfolio built with Angular (frontend) and an optional Node/Express + MongoDB CMS backend.

## Highlights
- Angular 18 standalone architecture
- Rich UI system (SCSS tokens, shared card styles, motion, theme switcher)
- Static-first content model with optional API mode
- Admin-ready backend with JWT auth and content endpoints

## Tech Stack
- Frontend: Angular 18, TypeScript, RxJS, SCSS
- UI libs: Bootstrap Icons, Splide, Lenis
- Backend: Node.js, Express, MongoDB (Mongoose), Zod, JWT, Multer

## Project Structure
- `src/` Angular application
- `src/app/data/portfolio-content.ts` static content source
- `src/styles/` global design system and shared styles
- `backend/` optional CMS/API server

## Quick Start
### 1) Install dependencies
```bash
npm install
npm --prefix backend install
```

### 2) Run frontend only (static content)
```bash
npm start
```
Open `http://localhost:4200`.

### 3) Run frontend + backend (live API mode)
```bash
npm run backend:dev
npm start
```
Then set `useApi: true` in the active environment file:
- `src/environments/environment.development.ts`
- `src/environments/environment.ts`

## Scripts
### Frontend (root)
- `npm start` - Angular dev server
- `npm run build` - production build
- `npm run watch` - dev build in watch mode
- `npm test` - unit tests

### Backend (root passthrough)
- `npm run backend:dev` - run backend with `tsx watch`
- `npm run backend:build` - build backend TS
- `npm run backend:start` - run built backend

### Backend (direct)
- `npm --prefix backend run seed` - seed data/admin

## Backend Environment Variables
Create `backend/.env` with:

```env
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=your_super_long_secret_at_least_32_chars
JWT_EXPIRES_IN=7d
PORT=4300
CORS_ORIGIN=http://localhost:4200
UPLOAD_DIR=uploads
PUBLIC_UPLOAD_PATH=/uploads
MAX_UPLOAD_MB=5
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=change-me-strong
SEED_ADMIN_NAME=Admin
```

Required:
- `MONGO_URI`
- `JWT_SECRET` (minimum 32 characters)

## Content Modes
This project supports two data modes without component rewrites:
- **Static mode**: reads from `src/app/data/portfolio-content.ts`
- **API mode**: reads from backend via `apiBase`

Toggle with `useApi` in environment files.

## Build
```bash
npm run build
```
Output is generated in `dist/portfolio1.1`.

## Notes
- Backend is optional for portfolio browsing.
- Keep IDs in `portfolio-content.ts` stable because routes depend on them.
- Admin/backend routes require valid JWT auth.

## License
Private project. All rights reserved unless explicitly stated otherwise.
