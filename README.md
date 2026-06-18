# ASCEND — Gym Management Platform

A production-grade MERN stack gym management application with role-based authentication, workout tracking, and membership management.

## Setup

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

### Backend
```bash
cd ascend/backend
npm install
npm run seed      # Seeds demo accounts and workout data
npm run dev       # Starts API on http://localhost:5000
```

### Frontend
```bash
cd ascend/frontend
npm install
npm run dev       # Starts UI on http://localhost:5173
```

## Demo Credentials

| Role   | Email                 | Password   |
|--------|-----------------------|------------|
| Staff  | staff@ascend.com      | staff123   |
| Member | member@ascend.com     | member123  |
| Member | riya@ascend.com       | member123  |
| Member | arjun@ascend.com      | member123  |
| Member | neha@ascend.com       | member123  |

## Features

### Member Dashboard
- View personal PR records (Squat, Bench Press, Deadlift)
- Browse recent workout session history
- Log new sessions with dynamic exercise builder
- Track membership status and expiry countdown

### Staff Dashboard
- View all members with membership status overview
- Search and filter by membership state (Active / Expiring / Expired)
- Drill into any member's full profile and workout history
- Update membership status and expiry date inline

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Database  | MongoDB + Mongoose                  |
| Backend   | Express.js + Node.js                |
| Auth      | JWT (role-based: member / staff)    |
| Frontend  | React 18 + Vite                     |
| Styling   | Tailwind CSS v3 (Dark Brutalist)    |
| Animation | Framer Motion                       |
| Charts    | Recharts (installed, ready to use)  |
| HTTP      | Axios with auth interceptor         |
| Dates     | date-fns                            |

## API Endpoints

### Auth
- `POST /api/auth/register` — Create new member account
- `POST /api/auth/login` — Login (returns JWT)
- `GET /api/auth/me` — Get current user profile

### Workouts (Protected)
- `GET /api/workouts/my` — Get own workout history
- `GET /api/workouts/prs` — Get personal records
- `POST /api/workouts` — Log a new workout session
- `DELETE /api/workouts/:id` — Delete a workout

### Staff (Staff only)
- `GET /api/staff/members` — List all members
- `GET /api/staff/members/:id` — Get member profile
- `GET /api/staff/members/:id/workouts` — Get member's workouts
- `PATCH /api/staff/members/:id/membership` — Update membership status
