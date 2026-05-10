# Traveloop

Traveloop is a full-stack travel planning platform built with:

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon-ready via `DATABASE_URL`)

## Features

- Authentication (register/login with JWT)
- Dashboard summary (trips, activities, budget)
- Trip creation and listing
- Itinerary builder
- City and activity management
- Budget tracking
- Packing checklist with toggle
- Trip notes
- Public trip sharing via slug URL

## Project Structure

```text
client/   # React app
server/   # Express API + Prisma schema
```

## Setup

### Backend

```bash
cd /home/runner/work/Traveloop/Traveloop/server
cp .env.example .env
# set DATABASE_URL to your Neon PostgreSQL URL and JWT_SECRET
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend

```bash
cd /home/runner/work/Traveloop/Traveloop/client
npm install
npm run dev
```

Set `VITE_API_URL` (optional) to point to your API, e.g. `http://localhost:5000/api`.
