# SmartFind — Smart Lost & Found Recovery Platform

> **Tagline:** “Lost it? Found it? SmartFind brings them together.”

SmartFind is an end-to-end, production-ready lost and found recovery platform that connects users reporting lost or found items using a weighted Smart Matching engine, real-time claim workflows, notifications, abuse reporting, and an Admin Dashboard.

---

## 🚀 Tech Stack

### Frontend
- **React.js** (v18)
- **Tailwind CSS** (v3)
- **React Router DOM** (v6)
- **Lucide React** (Icons)
- **Vite** (Build Tool)

### Backend
- **Node.js** & **Express.js**
- **MongoDB Atlas** & **Mongoose** (v8)
- **JWT (JSON Web Tokens)** & **bcryptjs** (v3)
- **Security**: `helmet`, `express-rate-limit`, `cors`
- **Testing**: Built-in `node:test` test runner

---

## ✨ Features Across All Phases (Phases 1 - 7)

* **Phase 1 — Modern Responsive UI**: Directory pages for Lost & Found items, search & filter bars, status badges, category cards, and item details view.
* **Phase 2 — JWT Authentication & User Profiles**: User registration, login, profile management, password encryption (`bcryptjs`), and token auth (`authMiddleware`).
* **Phase 3 — Lost & Found Item Reporting**: Complete reporting form system (create, edit, delete, owner authorization).
* **Phase 4 — Smart Matching Engine**: Automated weighted algorithm scoring potential matches between lost and found items based on Category, Title, Description, Location, and Date similarity.
* **Phase 5 — Notifications & Recovery Claims**: In-app notifications, unread counters, recovery request submission, owner accept/reject/complete workflow.
* **Phase 6 — Admin Dashboard & Platform Moderation**: Role-based access control (`ADMIN`), admin statistics, user management (suspension, role changes, deletion), item management, report moderation, and admin audit trail (`AdminActivity`).
* **Phase 7 — Production Readiness, Security & Performance**:
  * Security headers via `helmet`
  * API Rate Limiting via `express-rate-limit`
  * Centralized error middleware & production stack trace suppression
  * Compound Mongoose indexes on `User`, `Item`, `Notification`, `RecoveryRequest`, `Report`
  * Automated backend test suite (`npm test`)

---

## 🛠️ Local Development Setup

### 1. Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas cluster or local MongoDB instance

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🧪 Testing

Run backend automated tests:
```bash
cd backend
npm test
```

Build frontend for production:
```bash
cd frontend
npm run build
```

Preview frontend production build:
```bash
cd frontend
npm run preview
```

---

## 📜 License
MIT License
