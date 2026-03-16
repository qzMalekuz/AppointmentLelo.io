<p align="center">
  <img src="./docs/appointment.png" alt="AppointmentLelo.io Banner" width="100%" />
</p>

<h1 align="center">AppointmentLelo.io</h1>

<p align="center">
  Simple, fast, and reliable slot-based appointment booking for users and service providers.
</p>

---

## Overview

AppointmentLelo.io is a fullstack role-based scheduling platform:

- `USER` can browse services, view available slots, and book appointments.
- `SERVICE_PROVIDER` can create services, set availability, and track daily schedules.

It includes a modern SaaS landing page, dark/light theme support, responsive layouts, and secure backend APIs.

---

## Monorepo Structure

```text
/
├── frontend/   # React SPA (Vite + Tailwind)
└── backend/    # Express API (Prisma + PostgreSQL)
```

---

## Frontend

### Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Router v7
- Framer Motion
- Lucide React
- Axios
- React Context API (Auth + Theme)

### Core Functionality

- Modern marketing landing page:
  - Sticky navbar with CTA + theme toggle
  - Hero, trusted-by, features, workflow, product preview, CTA, credits, footer
- Auth flows:
  - Login / Register pages with role support
- User app:
  - Service discovery + category filter
  - Slot selection and instant booking
  - My appointments table
- Provider app:
  - Create service
  - Set weekly availability
  - Daily schedule view
- Theme system:
  - Global dark/light mode with persistence (`localStorage`)
- Responsive behavior:
  - Mobile, tablet, desktop optimized layouts and controls

---

## Backend

### Tech Stack

- Node/Bun runtime
- Express 5 + TypeScript
- Prisma 7
- PostgreSQL
- Zod validation
- JWT auth + bcrypt password hashing
- express-rate-limit

### Core Functionality

- JWT-based auth with role-based route protection
- Service creation and provider availability management
- Dynamic slot engine from availability windows
- Overlap detection for provider availability
- Slot booking with duplicate booking prevention
- Provider schedule endpoint for selected date

### Security Hardening

- CORS restricted via `CLIENT_ORIGIN`
- Global and auth-specific rate limiting
- `x-powered-by` disabled
- Request JSON payload size limit
- No internal error details leaked in auth responses

---

## Setup

### 1) Backend

```bash
cd backend
bun install
```

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/appointmentlelo"
PORT=3000
CLIENT_ORIGIN="http://localhost:5173"
JWT_SECRET="replace_with_strong_secret"
SALT_ROUNDS=10
```

Run migrations and start server:

```bash
npx prisma migrate dev
bun run dev
```

Backend runs on `http://localhost:3000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API Surface

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Services

- `GET /services`
- `POST /services` (provider only)
- `POST /services/:serviceId/availability` (provider owner only)
- `GET /services/:serviceId/slots?date=YYYY-MM-DD`

### Appointments

- `POST /appointments` (user only)
- `GET /appointments/me` (user only)

### Providers

- `GET /providers/me/schedule?date=YYYY-MM-DD` (provider only)

---

## Notes

- The README banner points to `./docs/banner.png`.
- Place your provided banner image at that path to render it at the top in centered layout.
