<h1 align="center">AppointmentLelo.io (Fullstack)</h1>

<p align="center">
  A robust, slot-based fullstack system for real-time appointment booking.
</p>

## 🚀 Overview

AppointmentLelo.io is an appointment booking system built with a modern TypeScript stack. It provides a beautiful, minimal React frontend and a robust slot-based Express backend. It includes specialized workflows for **Service Providers** to schedule their availability and manage their catalog of services, and for **Users** to explore active services, view dynamically generated time slots, and book appointments seamlessly.

## 🏗️ Project Architecture

The repository is structured as a monorepo containing two main directories:

- `/frontend` - The React + Vite SPA.
- `/backend` - The Express + Prisma REST API.

---

## 💻 Frontend (React)

A clean, minimal, and aesthetic Single Page Application designed to offer a fantastic user experience without clutter.

### Tech Stack
- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS v4 (Soft neutral colors, rounded corners, zero gradients)
- **Routing**: React Router v6
- **State & API**: Context API (Auth) + Axios

### Features
- **User Dashboard**: Browse and filter services, view available dynamic time slots by date, and book appointments.
- **Provider Dashboard**: Providers can create services, set their weekly availability down to the minute, and view their daily schedule of incoming appointments.

### Getting Started
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Backend (Express API)

A solid Node.js REST API that calculates dynamic slots on-the-fly to prevent database bloat, and secures endpoints using role-based JWT authentication.

### Tech Stack
- **Core**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens) & bcrypt

### Features
- **Role-Based Workflows**: Separate logic and authorization for `USER` and `SERVICE_PROVIDER`.
- **Dynamic Slot Engine**: Slots are determined instantly based on service duration, provider availability rules, and existing bookings.

### Getting Started

1. **Install dependencies:**
   ```bash
   cd backend
   bun install
   ```

2. **Environment Setup:** Create a `.env` file inside `/backend`.
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

4. **Run the Server:**
   ```bash
   bun run dev
   ```

## 🗺️ API Endpoints Summary

- **Auth**: `POST /auth/register`, `POST /auth/login`
- **Services**: `POST /services`, `GET /services`, `POST /services/:serviceId/availability`, `GET /services/:serviceId/slots`
- **Appointments**: `POST /appointments`, `GET /appointments/me`
- **Providers**: `GET /providers/me/schedule`
