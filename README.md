# ✈️ Traveloop: The Future of Neural Travel Planning

Traveloop is a premium, full-stack travel orchestration platform designed for modern explorers. By combining high-performance architectural patterns with advanced AI (Gemini), Traveloop transforms fragmented trip planning into a seamless, cinematic experience.

![Traveloop Dashboard](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

### 🧠 AI Travel Architect (Gemini Pro)
*   **Neural Itineraries**: Generate day-by-day journey plans with localized activity suggestions.
*   **Smart Budget Estimation**: Automatic cost forecasting based on travel style (Budget, Mid-range, Luxury).
*   **Contextual Intelligence**: Weather outlooks, local delicacy recommendations, and pro-travel tips.

### 💰 Comprehensive Financial Hub
*   **Multi-Currency Support**: Realtime currency selection and persistent user preferences.
*   **Aggregated Spending**: Track total planned vs. actual spent across all adventures.
*   **Granular Categories**: Breakdown expenses by transport, food, accommodation, and more.

### 📦 Precision Packing Modules
*   **Checklist Persistence**: Never forget an essential item with reactive packing checklists.
*   **Realtime Progress**: Visual progress tracking across all active journeys.

### ✍️ Journey Journals
*   **Standalone & Linked Notes**: Record thoughts either globally or tied to specific trips.
*   **Pinning & Search**: Stay organized with high-priority pinned notes and fuzzy search.

### 🌍 Global Localization
*   **Multi-Locale**: Full support for English, Hindi, and Arabic.
*   **RTL Orientation**: Native Right-to-Left (RTL) document direction for Arabic users.

---

## 🛠️ Tech Stack

**Frontend**
*   [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/) (Design System)
*   [TanStack Query v5](https://tanstack.com/query) (State & Cache Management)
*   [Framer Motion](https://www.framer.com/motion/) (Cinematic Animations)
*   [React-i18next](https://react.i18next.com/) (Internationalization)

**Backend**
*   [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
*   [Prisma ORM](https://www.prisma.io/) (Database Management)
*   [NeonDB](https://neon.tech/) (Serverless PostgreSQL)
*   [Zod](https://zod.dev/) (Type-safe Validation)
*   [JWT](https://jwt.io/) (Secure Authentication)

---

## 🏁 Quick Start

### 1. Prerequisites
*   Node.js v18+
*   PostgreSQL Database (or Neon.tech account)
*   Gemini API Key (Google AI Studio)

### 2. Environment Configuration
Create a `.env` file in the `/server` directory:

```env
DATABASE_URL="postgresql://user:pass@host/db"
JWT_SECRET="your_ultra_secure_secret"
GEMINI_API_KEY="your_gemini_key"
PORT=5000
```

### 3. Backend Setup
```bash
cd server
npm install
npx prisma db push
npm run dev
```

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 📂 Architecture Overview

```text
Traveloop/
├── client/                 # React Application
│   ├── src/
│   │   ├── components/     # Atomic UI units
│   │   ├── context/        # Auth & Global state
│   │   ├── hooks/          # Shared logic (debounce, auth)
│   │   ├── pages/          # Routed views
│   │   └── services/       # Axios API instances
├── server/                 # Express API
│   ├── prisma/             # Schema & Migrations
│   └── src/
│       ├── controllers/    # Business logic
│       ├── middleware/     # Auth & Error guards
│       └── routes/         # Endpoint definitions
```

---

## 🛣️ Future Roadmap
- [ ] **Collaborative Planning**: Multi-user trip editing.
- [ ] **Offline Mode**: LocalStorage caching for journals and checklists.
- [ ] **Map Integration**: Interactive trip maps using Leaflet/Google Maps.
- [ ] **Realtime Chat**: Socket.io integration for trip participants.

---
*Built with ❤️ by the Traveloop Team.*
