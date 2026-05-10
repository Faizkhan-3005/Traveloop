# ✈️ Traveloop — Plan Smarter. Travel Better.

<div align="center">

![Traveloop Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&auto=format&fit=crop&q=80)

### AI-Powered Travel Operating System for Modern Explorers

Traveloop transforms chaotic trip planning into a seamless, intelligent, and cinematic experience powered by Gemini AI.

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge)

</div>

---

# 🌍 Overview

Traveloop is a next-generation full-stack travel orchestration platform designed for travelers who want more than spreadsheets and scattered notes.

By combining AI-powered itinerary generation, intelligent budgeting, multilingual support, and collaborative planning workflows, Traveloop delivers a premium travel management experience built for the modern web.

Whether you're planning a solo backpacking journey, a luxury vacation, or a group adventure — Traveloop acts as your intelligent travel companion.

---

# ✨ Core Features

## 🧠 AI Travel Architect (Gemini Pro)

Generate intelligent, contextual travel plans powered by Gemini AI.

### Features
- ✨ AI-generated day-by-day itineraries
- 🌤️ Weather-aware planning suggestions
- 🍜 Local food & culture recommendations
- 💸 Dynamic travel budget estimation
- 🎒 Travel tips tailored to destination
- 🧭 Personalized travel styles:
  - Budget
  - Mid-range
  - Luxury

---

## 💰 Financial Command Center

Track every rupee, dollar, or euro across your journey.

### Capabilities
- 💱 Multi-currency support
- 📊 Budget vs Actual expense analytics
- 🧾 Categorized spending breakdowns
- 📈 Total trip financial summaries
- 🔄 Persistent user currency preferences

---

## 📦 Smart Packing System

Never forget essentials again.

### Includes
- ✅ Interactive packing checklists
- 📍 Trip-specific packing modules
- 📊 Realtime completion tracking
- 🧠 AI packing recommendations *(planned)*

---

## ✍️ Journey Journals

Capture experiences and memories in one place.

### Journal Features
- 📝 Standalone & trip-linked notes
- 📌 Pinned important entries
- 🔍 Fast fuzzy searching
- 🗂️ Organized travel memory management

---

## 🌐 Internationalization & Accessibility

Designed for global travelers.

### Supported
- 🇺🇸 English
- 🇮🇳 Hindi
- 🇸🇦 Arabic (RTL Supported)

---

# 🛠️ Tech Stack

## Frontend Architecture

| Technology | Purpose |
|---|---|
| React + Vite | High-performance frontend |
| Tailwind CSS | Design system & styling |
| TanStack Query v5 | API state & caching |
| Framer Motion | Cinematic animations |
| React-i18next | Localization |
| Axios | API communication |

---

## Backend Architecture

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM | Database abstraction |
| Neon PostgreSQL | Serverless database |
| JWT | Authentication |
| Zod | Validation & type safety |
| Gemini API | AI itinerary generation |

---

# ☁️ System Architecture

```mermaid
graph TD

A[React Frontend] --> B[Express API]
B --> C[Prisma ORM]
C --> D[(Neon PostgreSQL)]

B --> E[Gemini AI]
B --> F[JWT Authentication]

A --> G[TanStack Query Cache]
A --> H[Framer Motion UI]