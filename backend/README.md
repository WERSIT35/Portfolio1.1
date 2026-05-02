# Portfolio Admin Backend (Multi-User)

This backend adds a multi-user admin system for your portfolio so you can edit all content sections from an admin panel.

## Features

- JWT authentication
- Multi-user admin roles:
  - `super_admin`: full access (users + content)
  - `editor`: content editing access
  - `viewer`: read-only (no admin write)
- Editable sections:
  - `hero`, `ctas`, `skills`, `education`, `experience`, `certificates`, `projects`, `contact`, `meta`
- File-based JSON datastore (easy to replace with Mongo/Postgres later)

## Setup

1. Copy env file:
   - `cp .env.example .env` (or create manually on Windows)
2. Install dependencies:
   - `npm install`
3. Run development server:
   - `npm run dev`

Server runs at `http://localhost:4300` by default.

## Default Seed Users

Created automatically on first startup:

- Super admin:
  - email: `admin@portfolio.local`
  - password: `Admin@12345`
- Editor:
  - email: `editor@portfolio.local`
  - password: `Editor@12345`

Change these immediately after first login.

## API

### Auth

- `POST /api/auth/login`
  - body: `{ "email": "...", "password": "..." }`
- `GET /api/auth/me` (Bearer token)

### Public Content

- `GET /api/content`
- `GET /api/content/:section`

### Admin Content (super_admin/editor)

- `PUT /api/admin/content/:section` (Bearer token)
  - body: any JSON for that section

### Admin User Management (super_admin only)

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PATCH /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
