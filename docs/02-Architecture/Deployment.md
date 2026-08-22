# Deployment Architecture & Strategy

## 1. Overview

GlobeTrotter is designed for simple, reliable, and cost-effective deployment. The application follows a 2-tier client-server architecture:
1. **Frontend**: Static SPA (Single Page Application) built with Vite + React + TS, deployable to Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront.
2. **Backend**: Express.js REST API server, deployable to Render, Railway, Fly.io, AWS EC2, or Docker container environments.
3. **Database**: PostgreSQL (production) hosted on Supabase, Render Postgres, Railway, or AWS RDS, with SQLite supported for zero-config local development.

---

## 2. Environment Configuration

### Environment Variables Matrix

| Variable | Description | Scope | Sample Value (Prod) |
|---|---|---|---|
| `NODE_ENV` | Runtime environment | Backend | `production` |
| `PORT` | Server HTTP port | Backend | `5000` |
| `DATABASE_URL` | Relational DB connection string | Backend | `postgresql://user:pass@host:5432/globetrotter` |
| `JWT_SECRET` | Secret key for signing tokens | Backend | `<high-entropy-random-string>` |
| `JWT_EXPIRES_IN` | Token lifetime | Backend | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | Backend | `https://globetrotter.app` |
| `VITE_API_BASE_URL` | API base URL for client HTTP requests | Frontend | `https://api.globetrotter.app/api/v1` |

---

## 3. Deployment Pipeline & CI/CD Workflow

```mermaid
flowchart LR
    A[Git Commit / Push] --> B[GitHub Repository]
    B --> C{Branch?}
    C -- main --> D[Production CI/CD]
    C -- dev --> E[Staging CI/CD]

    D --> F[Run Tests & Linter]
    F --> G[Build Frontend & Backend]
    G --> H[Run Prisma Migrations]
    H --> I[Deploy API to Hosting Platform]
    H --> J[Deploy SPA to CDN Hosting]
```

---

## 4. Production Build & Run Instructions

### Backend Build & Execution
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma db push

# Build TypeScript to JavaScript (/dist)
npm run build

# Start production server
npm start
```

### Frontend Build & Deployment
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build production assets (/dist)
npm run build
```

---

## 5. Security & SSL

- **HTTPS Enforcement**: All production traffic must run over SSL/TLS (HTTPS).
- **HTTP to HTTPS Redirection**: Enforced at CDN / reverse proxy layer (Nginx or Cloudflare).
- **Security Headers**: Managed via `helmet` middleware on Express API (`X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`).
