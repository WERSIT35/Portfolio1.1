# Otar Davitashvili Portfolio

Personal portfolio website for Otar Davitashvili, focused on presenting production work, technical strengths, education, certifications, and direct contact paths in a clean, responsive single-brand experience.

Live website: [otodavitashvili.netlify.app](https://otodavitashvili.netlify.app/)

## Overview

This project is built as an Angular portfolio application with an additional Express + TypeScript admin backend for managing portfolio content through a protected admin panel.

The site highlights:

- Hero section with resume download
- Selected projects with image galleries, web/mobile view switching, and detail pages
- Skills, education, experience, and certifications sections
- Contact page with email, phone, GitHub, and LinkedIn links
- Admin login and JSON-based content editor for portfolio sections

## Tech Stack

- Angular 18
- TypeScript
- SCSS
- RxJS
- Splide.js
- Bootstrap Icons
- Node.js
- Express
- JWT authentication

## Project Structure

```text
src/       Angular frontend
public/    Static assets, project media, resume PDF
backend/   Express admin API, auth, and file-based content store
```

## Local Development

### Frontend

Install dependencies and start the Angular app:

```bash
npm install
npm start
```

Frontend runs at `http://localhost:4200`.

### Admin Backend

Install backend dependencies and start the admin API:

```bash
npm --prefix backend install
npm run backend:dev
```

Backend runs at `http://localhost:4300`.

The backend uses `backend/.env` with these defaults:

```env
PORT=4300
JWT_SECRET=dev_change_this_secret
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:4200
DATA_FILE_PATH=data/db.json
```

## Admin Panel

The admin panel is available at `/admin/login` and supports:

- Authenticated admin login
- Section-based portfolio content editing
- Role-aware access
- Admin user creation for `super_admin`

Default seeded users are documented in [backend/README.md](backend/README.md).

## Featured Content Areas

- Home / hero presentation
- Projects showcase
- Education timeline
- Experience section
- Certifications
- Contact page

## Scripts

```bash
npm start
npm run build
npm run test
npm run backend:dev
npm run backend:build
npm run backend:start
```

## Contact

- Email: `otowork3@gmail.com`
- GitHub: [WERSIT35](https://github.com/WERSIT35)
- LinkedIn: [otar-davitashvili](https://www.linkedin.com/in/otar-davitashvili/)
