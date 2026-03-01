<h1 align="center">AppointmentLelo.io</h1>

<p align="center">
  A robust, slot-based backend system for real-time appointment booking.
</p>

## 🚀 Overview

AppointmentLelo.io is an appointment booking API built with a modern TypeScript stack. It provides specialized capabilities for Service Providers to schedule availability and for Users to explore active services, view dynamically generated time slots, and book appointments seamlessly.

## 🛠️ Tech Stack

- **Core**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens) & bcrypt

## ✨ Core Features

- **Role-Based Workflows**: Separate logic and authorization for `USER` and `SERVICE_PROVIDER`.
- **Service Management**: Providers can create services (e.g., Medical, Beauty, Fitness) and declare weekly availability windows.
- **Dynamic Slot Engine**: Slots are determined on-the-fly based on service duration, provider availability, and existing bookings—avoiding redundant database bloat.
- **Provider Dashboards**: Providers can easily fetch their daily appointment schedule.

## 📦 Getting Started

### Prerequisites

- [Bun](https://bun.com) (or Node.js)
- PostgreSQL

### Setup & Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Environment Setup:** Create a `.env` file in the root.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/appointmentlelo"
   PORT=3000
   JWT_SECRET="your_super_secret_key"
   SALT_ROUNDS=10
   ```

3. **Database Migration:**
   ```bash
   npx prisma migrate dev
   ```

4. **Run the Development Server:**
   ```bash
   bun run dev
   # or
   bun run index.ts
   ```

## 🗺️ API Endpoints

### Auth
- `POST /auth/register` - Create a new user/provider.
- `POST /auth/login` - Authenticate and receive a JWT.

### Services
- `POST /services` - Create a new service (Provider only).
- `GET /services` - Fetch all services (Query: `?type=MEDICAL`).
- `POST /services/:serviceId/availability` - Define recurring weekly availability.
- `GET /services/:serviceId/slots` - Fetch dynamically generated free slots for a specific date.

### Appointments
- `POST /appointments` - Book a specific slot.
- `GET /appointments/me` - View all your booked appointments (User only).

### Providers
- `GET /providers/me/schedule` - Get all booked appointments for the day across services.
