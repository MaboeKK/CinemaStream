# CinemaStream

CinemaStream is a full-stack movie & TV catalog application: browse trending, top-rated, and genre-filtered titles pulled live from TMDB, save favourites, track watch history, and manage users through a role-based admin dashboard. The frontend is a React SPA with a custom dark theme; the backend is a small Node/Express API handling auth and user-generated data only.

## Features

- **Live catalog from TMDB** — trending, popular, top-rated, new-release, and genre-filtered movies & TV series, all fetched directly from The Movie Database API (no local movie/series database)
- **Infinite scroll** on `/movies` and `/series` — the catalog grid loads the next page automatically as you scroll, replacing manual pagination
- **Search** — an overlay search experience across titles and genres, plus per-page search/genre filtering
- **Trailer & details modal** — trailer playback, cast, genres, and "more like this" recommendations for any title
- **My List & Liked Titles** — client-side (`localStorage`) personalization, no account sync required
- **Watch history** — recorded per user and surfaced as "Continue Watching" and in the admin dashboard
- **Role-based authentication** — email/password registration with OTP email verification, JWT access/refresh tokens in httpOnly cookies, CSRF protection, and `guest`/`admin` roles
- **Admin dashboard** — user management table, top-shows chart, monthly user growth chart, and a weekly activity heatmap
- **Dark theme design system** — CSS custom properties for colors/spacing/typography, shared across auth, catalog, and admin surfaces

## Tech Stack

### Frontend (`cinemastream/frontend`)

- React 19 + Vite
- React Router v7
- Axios (`api/httpClient.js`) for backend requests; native `fetch` for TMDB/YouTube calls
- Plain CSS with CSS custom properties for the design-token system (no Tailwind or CSS Modules) — MUI (`@mui/material`, `@mui/x-data-grid`) is used only in the admin dashboard, with `recharts` and `react-plotly.js` for its charts
- `react-icons` for icons, `react-youtube` for trailer embeds
- Vitest + React Testing Library for tests, ESLint + Prettier for linting/formatting

### Backend (`cinemastream/backend`)

- Node.js + Express 5
- PostgreSQL (via `pg`)
- JWT (`jsonwebtoken`) access/refresh tokens delivered as httpOnly cookies, `bcrypt` for password hashing
- `express-rate-limit` for auth rate limiting, `cors` + custom CSRF middleware, `joi` for request validation
- `nodemailer` (Gmail SMTP) for OTP/password-reset emails
- Vitest + Supertest for integration tests, ESLint + Prettier for linting/formatting

Layered architecture: `routes/` → `controllers/` → `services/` → `repositories/`, with `middleware/`, `config/`, and `utils/` alongside.

## Database Architecture

The database holds **only user accounts and user-generated data — no movie/series/genre catalog data**. All title metadata (posters, descriptions, cast, ratings, genres, trending/popular lists) is fetched directly from TMDB by the frontend at request time; the schema was audited and trimmed to remove a set of unused TMDB-cache tables (`movies`, `series`, `genres`, `movie_genres`, `series_genres`) that had no code path reading or writing them.

Three tables remain:

| Table | Purpose |
|---|---|
| `users` | Accounts — name, email, hashed password, email-verification/reset tokens, role (`guest`/`admin`), timestamps |
| `login_history` | Login/logout audit trail (timestamp, IP, user agent, success flag) — also powers the admin "Monthly User Growth" chart |
| `watched_history` | Per-user watch events (movie/series id + a denormalized title snapshot) — powers "Continue Watching" and the admin "Top Shows"/activity-heatmap charts |

Schema DDL lives in `cinemastream/backend/db/schema.sql`; `cinemastream/backend/db/seed.local.sql` is a local-only (not version-controlled) dump for seeding a dev database.

## Setup

### Prerequisites

- Node.js 20+
- A local PostgreSQL instance
- A [TMDB API key](https://www.themoviedb.org/settings/api) and a [YouTube Data API v3 key](https://console.cloud.google.com/apis/credentials)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (for sending OTP/reset emails)

### 1. Database

```bash
createdb cinemastream
psql -d cinemastream -f cinemastream/backend/db/schema.sql
```

### 2. Backend

```bash
cd cinemastream/backend
npm install
cp .env.example .env   # then fill in the values below
npm run dev             # starts on http://localhost:5000
```

Required `backend/.env` values:

| Variable | Description |
|---|---|
| `POSTGRES_URI` | Postgres connection string, e.g. `postgres://user:password@localhost:5432/cinemastream` |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail address + App Password used to send OTP/reset emails |
| `JWT_SECRET` / `REFRESH_SECRET` | Long, random, **distinct** secrets for signing access/refresh JWTs (e.g. `openssl rand -hex 32`) |
| `PORT` | Port the API listens on (default `5000`) |
| `CORS_ORIGIN` | Exact origin the frontend is served from, e.g. `http://localhost:3000` |
| `NODE_ENV` | `development` \| `test` \| `production` |

### 3. Frontend

```bash
cd cinemastream/frontend
npm install
cp .env.example .env   # then fill in the values below
npm run dev             # starts on http://localhost:3000
```

Required `frontend/.env` values:

| Variable | Description |
|---|---|
| `VITE_TMDB_API_KEY` | TMDB API key, used for all catalog/search data |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API key, used to resolve trailer videos |

## Scripts & Testing

Run from `cinemastream/frontend/` or `cinemastream/backend/` respectively:

| Command | Frontend | Backend |
|---|---|---|
| Start dev server | `npm run dev` | `npm run dev` (nodemon) |
| Run production build | `npm run build` | `npm start` |
| Lint | `npm run lint` | `npm run lint` |
| Format | `npm run format` | `npm run format` |
| Run tests | `npm test` | `npm test` |

Backend tests (`backend/tests/integration/`) run against a real local Postgres database — make sure it's running and migrated (see [Database](#1-database)) before running `npm test`.

CI (`.github/workflows/ci.yml`) runs frontend lint + tests on every push to `develop` and every PR into `develop`/`main`.
