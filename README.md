# Portfolio 1.1

A premium full-stack portfolio platform built with Angular 18 and an optional Node/Express + MongoDB CMS backend.

<p align="left">
  <img alt="Angular" src="https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white" />
  <img alt="SCSS" src="https://img.shields.io/badge/SCSS-Design_System-CC6699?logo=sass&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" />
</p>

## Why This Project
- Production-style portfolio architecture, not just a static landing page
- Shared design system with tokens, reusable card patterns, motion, and theme modes
- Flexible content model: run fully static or switch to live API without component rewrites
- Optional admin/backend surface for authenticated content management

## Table of Contents
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Content Modes](#content-modes)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)

## Architecture
```text
Frontend (Angular 18)
  ├─ Standalone components + router
  ├─ Shared styles/tokens (SCSS design system)
  ├─ Static content source (portfolio-content.ts)
  └─ Optional live content via HTTP services

Backend (Optional)
  ├─ Express API + JWT auth
  ├─ MongoDB + Mongoose models
  ├─ Zod environment validation
  └─ Admin/content endpoints + uploads
```

## Features
| Area | What it includes |
|---|---|
| UI System | Theme switcher, consistent cards, typography hierarchy, interaction polish |
| Home Experience | Rich hero, interactive process/experience sections, premium motion language |
| Content Pipeline | Static-first data + seamless API mode toggle |
| Backend | Auth, content endpoints, uploads, admin-focused workflows |
| Performance | Standalone architecture, lazy loading patterns, scoped style system |

## Tech Stack
### Frontend
- Angular 18
- TypeScript
- RxJS
- SCSS
- Bootstrap Icons
- Splide
- Lenis

### Backend (optional)
- Node.js
- Express
- MongoDB + Mongoose
- Zod
- JWT
- Multer

## Project Structure
```text
.
├─ src/
│  ├─ app/
│  │  ├─ components/          # Route/UI components
│  │  ├─ data/                # Static content source
│  │  ├─ interfaces/          # Shared data contracts
│  │  └─ services/            # Static/API data access
│  ├─ environments/           # Runtime mode and API base settings
│  └─ styles/                 # Global design system + shared SCSS
├─ backend/                   # Optional CMS/API service
└─ README.md
```

## Quick Start
### 1) Install dependencies
```bash
npm install
npm --prefix backend install
```

### 2) Run frontend only (static mode)
```bash
npm start
```
Open `http://localhost:4200`.

### 3) Run frontend + backend (live API mode)
```bash
npm run backend:dev
npm start
```
Then set `useApi: true` in:
- `src/environments/environment.development.ts`
- `src/environments/environment.ts`

## Scripts
### Root (frontend + backend passthrough)
- `npm start` - start Angular dev server
- `npm run build` - production frontend build
- `npm run watch` - development watch build
- `npm test` - Angular unit tests
- `npm run backend:dev` - backend dev server
- `npm run backend:build` - backend TypeScript build
- `npm run backend:start` - run compiled backend

### Backend direct
- `npm --prefix backend run seed` - seed admin/content data

## Environment Variables
Create `backend/.env`:

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
- `JWT_SECRET` (minimum 32 chars)

## Content Modes
This project supports two interchangeable modes:

1. Static Mode
- Uses `src/app/data/portfolio-content.ts`
- Fastest local setup

2. API Mode
- Uses backend endpoints via `apiBase`
- Toggle with `useApi: true` in environment files
- No component-level rewrites needed

## Build and Deployment
### Frontend build
```bash
npm run build
```
Output path: `dist/portfolio1.1`

### Production checklist
- Set `useApi` and `apiBase` correctly for environment
- Configure backend `.env` with production secrets
- Set `CORS_ORIGIN` to deployed frontend URL
- Serve backend uploads path if uploads are enabled

## Troubleshooting
- Frontend starts but no live data:
  - Verify backend is running on `PORT` (default `4300`)
  - Verify `useApi: true` and correct `apiBase`
- Backend exits on startup:
  - Check `backend/.env` and `JWT_SECRET` length
  - Ensure `MONGO_URI` is reachable
- Content routes broken after data edits:
  - Keep entity IDs stable in `portfolio-content.ts`

## License
Private project. All rights reserved unless explicitly stated otherwise.
