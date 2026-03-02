<h1 align="center">AppointmentLelo.io</h1>

<p align="center">
  A slot-based fullstack appointment booking system built with a modern TypeScript stack.
</p>

---

## 🚀 Overview

AppointmentLelo.io is a role-based appointment booking platform. **Service Providers** create services, define their weekly availability, and view their daily schedule. **Users** browse the service catalog, filter by category, pick a dynamically-generated time slot, and book appointments — all in real time.

---

## 🏗️ Architecture

Monorepo with two independent packages:

```
/
├── frontend/   # React + Vite SPA
└── backend/    # Express + Prisma REST API
```

---

## 💻 Frontend

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (Vite 7) |
| Styling | Tailwind CSS v4 — custom 16-token design system |
| Routing | React Router v7 |
| Animation | Framer Motion |
| HTTP | Axios |
| State | React Context API (Auth + Theme) |
| Icons | Lucide React |

### Features

- **Auth** — Register / Login with JWT; tokens and roles persisted to `localStorage`
- **Role-based routing** — `USER` and `SERVICE_PROVIDER` see completely different UIs; protected routes redirect unauthenticated users
- **User Dashboard** — Browse all services, filter by category (`MEDICAL`, `BEAUTY`, `FITNESS`, `HOUSE_HELP`, `EDUCATION`, `OTHER`)
- **Slot Viewer** — Pick a date, see dynamically generated available time slots, book instantly
- **My Appointments** — View all upcoming and past bookings
- **Provider Dashboard** — Create new services, manage the service catalog
- **Set Availability** — Define weekly availability windows per service (day + start/end time)
- **Daily Schedule** — View all incoming appointments for a given date
- **Dark / Light Mode** — System-preference aware; smooth 300ms CSS transition on every element; persisted to `localStorage`; toggled via an animated Framer Motion button in the navbar

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

> App runs at [http://localhost:5173](http://localhost:5173)

---

## ⚙️ Backend

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Bun |
| Framework | Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Auth | JWT + bcrypt |

### Features

- **Role-Based Auth** — `USER` and `SERVICE_PROVIDER` roles enforced at middleware level on every protected endpoint
- **Dynamic Slot Engine** — Slots are computed on-the-fly from availability rules minus existing bookings; no pre-generated slot rows in the database
- **Overlap Prevention** — Setting overlapping availability windows returns `409 Conflict`
- **Double-Booking Prevention** — Booking an already-taken slot returns `409 Conflict`; uses a Prisma transaction for safety
- **Past-date Guard** — Slots for past dates or past times (today) are excluded from results
- **Provider self-booking guard** — Providers cannot book their own services

### Getting Started

1. **Install dependencies**
   ```bash
   cd backend
   bun install
   ```

2. **Environment** — Create `.env` inside `/backend`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/appointmentlelo"
   PORT=3000
   JWT_SECRET="your_super_secret_key"
   SALT_ROUNDS=10
   ```

3. **Migrate the database**
   ```bash
   npx prisma migrate dev
   ```

4. **Run**
   ```bash
   bun run dev
   ```

> API runs at [http://localhost:3000](http://localhost:3000)

---

## 🗺️ API Reference

### Auth — `/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new user or provider |
| `POST` | `/auth/login` | — | Login and receive a JWT |

### Services — `/services`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/services` | — | List all services (optional `?type=` filter) |
| `POST` | `/services` | `SERVICE_PROVIDER` | Create a new service |
| `POST` | `/services/:id/availability` | `SERVICE_PROVIDER` (owner) | Set a weekly availability window |
| `GET` | `/services/:id/slots?date=YYYY-MM-DD` | — | Get available slots for a date |

### Appointments — `/appointments`
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/appointments` | `USER` | Book a slot by `slotId` |
| `GET` | `/appointments/me` | `USER` | View own appointments |

### Providers — `/providers`
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/providers/me/schedule?date=YYYY-MM-DD` | `SERVICE_PROVIDER` | View daily appointment schedule |
