# 🌍 GlobeTrotter — Smart Travel & Itinerary Platform

> A full-stack, state-of-the-art travel planning and itinerary management suite powered by Node.js, Express, Prisma ORM, Neon PostgreSQL, React 18, and Vite.

---

## 🚀 Key Modules & Capabilities

GlobeTrotter provides travelers with a seamless end-to-end trip planning workflow:

- **🔐 Module 1: Authentication & User Accounts**
  - JWT bearer authentication with bcrypt password hashing.
  - Secure registration, login, profile management, and password reset flows.

- **📊 Module 2: Interactive Dashboard Hub**
  - Real-time travel metrics, upcoming trip countdowns, recent activity feeds, and quick navigation.

- **📍 Module 3 & 5: Destination & Activity Discovery**
  - Curated city destination catalogue with daily cost estimates, ratings, tags, and category filters.
  - Activity search with duration, pricing, and category filters.

- **✈️ Module 4: Trip Management & Multi-Stop Sequencer**
  - Create trips with custom date ranges, cover images, and ordered destination stops.

- **🗓️ Module 6 & 7: Day-Wise Itinerary Builder & View Hub**
  - Construct day sections (`Day 1: Beach Day`), set section budgets, attach activity items with start times and costs.
  - View trip itineraries in both **Day-Wise Accordion View** and **Vertical Timeline View**.

- **💰 Module 8: Budget & Cost Management**
  - Set planned trip budgets, record multi-category expenses (`TRANSPORT`, `ACCOMMODATION`, `ACTIVITIES`, `MEALS`, `MISCELLANEOUS`).
  - Automatic spending calculation, daily cost averages, category breakdown bars, and over-budget status warning alerts.

- **📅 Module 9: Interactive Travel Calendar**
  - Monthly calendar grid rendering trip dates, day section events, and activity schedules.

- **🌐 Module 10 & 11: Community Hub & Public Sharing**
  - Publish trip plans to the community feed with search, category filtering, and sorting.
  - Generate shareable public links (`/share/:token`) with read-only view and **"Copy Trip to My Account"** cloning capability.

- **🛡️ Module 12: Admin & System Analytics**
  - Protected admin panel (`/admin`) for viewing system metrics (users, 30-day registrations, trips by status, engagement totals), popular cities/activities ranking, and user role management.

- **🔍 Cross-Module Utilities**
  - Command-palette global search (`Cmd+K`), image upload/storage service, toast notification alerts, confirmation dialogs, and responsive layouts.

---

## 🛠️ Technology Stack

### Backend Architecture
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL hosted on Neon Serverless
- **ORM**: Prisma ORM (v5.22.0)
- **Validation**: Zod schema validation
- **Authentication**: JSON Web Tokens (JWT) & bcrypt

### Frontend Architecture
- **Framework**: React 18 & TypeScript
- **Bundler**: Vite
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design Tokens (Responsive, Glassmorphism, Modern Typography)

---

## 💻 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Repository Setup & Environment
Clone the repository:
```bash
git clone https://github.com/Dhruva-Vaghela/Globe-Trotter.git
cd Globe-Trotter
```

Configure `.env` file in root directory:
```env
PORT=5000
DATABASE_URL="postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="super-secret-jwt-key"
```

### 2. Backend Setup
```bash
cd backend
npm install
DATABASE_URL="postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma db push
DATABASE_URL="postgresql://neondb_owner:npg_JU7aEI5nlOyS@ep-jolly-fog-az4250at-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" npx prisma generate
npm run build
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend application will run at `http://localhost:5173` and communicate with the backend at `http://localhost:5000/api/v1`.

---

## 🧪 Automated Testing & Verification

GlobeTrotter includes a comprehensive master automated API test suite covering all backend services, business logic calculations, and authorization guards.

Run the master test suite:
```bash
cd backend
npx tsx src/test_all_modules.ts
```

### Verified Test Suites:
- `test_modules_6_7.ts`: 13 / 13 PASSED (Itinerary Builder & View Hub)
- `test_module_8.ts`: 10 / 10 PASSED (Budget & Cost Management)
- `test_module_11.ts`: 8 / 8 PASSED (Public / Shared Itinerary)
- `test_module_12.ts`: 10 / 10 PASSED (Admin & Analytics)
- `test_module_17.ts`: 2 / 2 PASSED (Global Search & Upload)

---

## 📁 Repository Structure

```text
Globe-Trotter/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Database models & relationships
│   ├── src/
│   │   ├── config/               # Environment & Database config
│   │   ├── controllers/          # HTTP request handlers
│   │   ├── middlewares/          # Auth, Admin, and Validation middlewares
│   │   ├── routes/               # Express routing endpoints
│   │   ├── services/             # Business logic & Database services
│   │   └── test_all_modules.ts   # Master test runner
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # UI, Admin, Itinerary, and Budget components
│   │   ├── context/              # AuthContext and ToastContext
│   │   ├── pages/                # Application pages
│   │   ├── routes/               # AppRoutes & ProtectedRoute guards
│   │   └── utils/                # API client & formatting helpers
│   └── package.json
└── docs/                         # Planning, Architecture, and API specification docs
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
