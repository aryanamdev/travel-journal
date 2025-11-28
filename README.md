# Nomad Journal

A Gen‑Z‑friendly travel journaling app built with Next.js App Router. Log your trips with mood, weather, map pins and journals per city or era.

## Features

- **Auth & profiles**
  - Email/password register & login
  - Secure JWT cookie auth, logout, `me` endpoint
- **Journals**
  - Create, edit, delete journals (e.g. "Summer 25 in Europe")
  - Color accents and optional cover image per journal
  - Left-hand journal rail for quick switching
- **Entries**
  - Create entries attached to a journal
  - Mood, weather, long‑form content
  - Optional geo location (lat/lng) for map pins
  - List view, calendar heatmap, and live map view
- **UI layout**
  - 3‑column dashboard (`/userProfile`):
    - **Left:** journals + actions
    - **Middle:** entry composer + map / calendar / list views
    - **Right:** journal detail & editor
  - Theming tailored for travelers / wanderers
- **API & docs**
  - RESTful API under `/api/v2` (users, journals, entries)
  - OpenAPI 3 spec at project root: `openapi.yaml`
  - Swagger UI at `/api-docs`

## Tech stack

- **Frontend**: Next.js App Router, React, TypeScript, Tailwind‑style utility classes, shadcn‑inspired UI components
- **State management**: [Zustand](https://github.com/pmndrs/zustand)
- **Backend**: Next.js route handlers + Mongoose models
- **Auth**: JWT in HTTP‑only cookie, custom middleware
- **Validation**: Zod schemas
- **DB**: MongoDB (via Mongoose)
- **Testing**: Vitest

## Project structure

Key folders:

- `src/app`
  - `page.tsx` – marketing / landing page
  - `login/page.tsx` – login
  - `register/page.tsx` – register
  - `userProfile/page.tsx` – main 3‑column dashboard
  - `api/v2/...` – API route handlers (users, journals, entries, openapi)
  - `api-docs/route.ts` – Swagger UI page
- `src/controllers` – auth, journal, entry controllers
- `src/services` – business logic for auth, journals, entries
- `src/models` – Mongoose models
- `src/schemas` – Zod DTOs
- `src/lib` – shared helpers (errors, responses, auth wrapper, validation, etc.)
- `src/store` – Zustand stores (e.g. `useJournalStore.ts`)
- `src/types` – shared `User`, `Journal`, `Entry` types

## API overview

Base URL for version 2:

- `https://<your-host>/api/v2`

Main resources:

- **Auth (`/api/v2/users`)**
  - `POST /register` – create account
  - `POST /login` – log in, sets `token` HTTP‑only cookie
  - `GET  /logout` – clear session cookie
  - `GET  /me` – return current user (requires auth)
  - `POST /verifyEmail` – verify email with token
- **Journals (`/api/v2/journal`)**
  - `GET  /` – list journals for current user
  - `POST /` – create journal
  - `PATCH /{id}` – update journal
  - `DELETE /{id}` – delete journal
- **Entries (`/api/v2/entries`)**
  - `GET  /` – list entries (optionally `?journalId=...`)
  - `POST /` – create entry
  - `GET  /{id}` – get single entry
  - `PATCH /{id}` – update entry
  - `DELETE /{id}` – delete entry

See `openapi.yaml` or `/api-docs` for detailed schemas and response structures.

## State management (Zustand)

Zustand is used to keep key app state in sync across the dashboard:

- `src/store/useJournalStore.ts` holds:
  - `me` – current user
  - `loadingUser` – loading flag for viewer fetch
  - `journals` – list of journals
  - `entries` – list of entries (optionally filtered in the UI)
  - `selectedJournalId` – which journal is active
  - setters and a `reset()` utility

The `/userProfile` page uses this store to:

- Populate the dashboard after hitting the auth/journal/entry APIs
- Share selected journal/entries between the journal rail, views, and editor

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or hosted)

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root with at least:

```bash
MONGODB_URI="mongodb+srv://..."
JWT_SECRET="super-secret-jwt-key"
EMAIL_FROM="no-reply@example.com"
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT=587
SMTP_USER="smtp-user"
SMTP_PASS="smtp-pass"
```

Adjust names/values to whatever your existing `dbConfig` and email helper expect.

### Run the dev server

```bash
npm run dev
```

Then open:

- Home / marketing page: `http://localhost:3000/`
- Register: `http://localhost:3000/register`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/userProfile`
- API docs: `http://localhost:3000/api-docs`

### Build for production

```bash
npm run build
npm start
```

## Testing

Vitest is wired for unit tests:

```bash
npm test
# or
npm run test:watch
```

Add tests under `tests/` or alongside your modules as needed.

## Swagger / OpenAPI

- The OpenAPI spec lives in `openapi.yaml`.
- A read‑only HTTP endpoint is available at `/api/v2/openapi`.
- Swagger UI is served at `/api-docs` using the spec from that endpoint.

## Notes

- All auth‑protected routes expect a `token` cookie set by the login endpoint.
- Map view is powered by Leaflet + React‑Leaflet and uses `entry.location` for markers.
- The UI is intentionally opinionated toward travel journaling but the API and models are generic enough to adapt for other journaling/time‑capsule use cases.
