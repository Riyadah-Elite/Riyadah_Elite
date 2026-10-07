# Riyadah Elite

Riyadah Elite is a competitive gaming opportunity ecosystem and QA infrastructure platform. It bridges game studios, indie developers, competitive players, community tournament organizers, and QA testers across the MENA region and globally.

The platform provides structured, verifiable pathways for gamers to turn competitive skill and hardware testing capability into recognized experience, community reputation, and legitimate compensation.

---

## Table of Contents

- [Overview](#overview)
- [Core Concept](#core-concept)
- [Current Architecture](#current-architecture)
- [User Roles](#user-roles)
- [Key Platform Features](#key-platform-features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
  - [Frontend Workspace](#frontend-workspace)
  - [Backend Workspace](#backend-workspace)
  - [Running Both Workspaces](#running-both-workspaces)
  - [Important Script Clarification](#important-script-clarification)
- [Database & Prisma Workflow](#database--prisma-workflow)
- [Testing](#testing)
- [Build & Verification](#build--verification)
- [API Overview](#api-overview)
- [Render Deployment](#render-deployment)
  - [Frontend Static Site](#frontend-static-site)
  - [Backend Web Service](#backend-web-service)
  - [Neon PostgreSQL Production Database](#neon-postgresql-production-database)
- [Security Guidelines](#security-guidelines)
- [Development Notes](#development-notes)

---

## Overview

Riyadah Elite operates as a full-stack monolithic PERN-stack architecture structured into client frontends and a unified backend:

1. **`client/`**: React 19 web single-page application built with Vite and TypeScript.
2. **`mobile/`**: React Native mobile application built with Expo and TypeScript.
3. **`server/`**: Monolithic Express REST API built with Node.js, TypeScript, and Prisma ORM connecting to Neon PostgreSQL, backed by local/managed Redis, RabbitMQ, and MinIO/S3 infrastructure.

> **Architecture Clarification**: Riyadah Elite is a **monolithic backend application**. There are no backend microservices. Redis (caching), RabbitMQ (event/job queue), and MinIO (object storage) are integrated infrastructure dependencies utilized directly by the monolithic Express server.

---

## Current Architecture

The production and development architecture follows a decoupled client-to-monolith model:

```text
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│     Web Client (React 19/Vite)  │      │   Mobile Client (React Native)  │
│     Tailwind CSS v4 + TS        │      │   Expo + TypeScript             │
└────────────────┬────────────────┘      └────────────────┬────────────────┘
                 │                                        │
                 │              HTTP / REST (/api/v1)     │
                 └───────────────────┬────────────────────┘
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    Monolithic Express 4 / Node API  │
                  │    TypeScript + Zod + JWT           │
                  └──────┬───────────┬───────────┬──────┘
                         │           │           │
            ┌────────────┼───────────┼───────────┴────────────┐
            ▼            ▼           ▼                        ▼
     ┌─────────────┐ ┌───────┐ ┌──────────┐         ┌───────────────────┐
     │ Prisma ORM  │ │ Redis │ │ RabbitMQ │         │ MinIO / S3        │
     │     │       │ │ Cache │ │  Queue   │         │ (Presigned Media) │
     │     ▼       │ └───────┘ └──────────┘         └───────────────────┘
     │ Neon PG DB  │
     └─────────────┘
```

- **Web Frontend**: Runs independently as a Vite SPA on port 5173 (Dev) / Render Static Site (Prod).
- **Mobile Frontend**: Runs independently as a React Native / Expo application on iOS & Android.
- **Monolithic Backend**: Runs on port 5000 (Dev) / Render Web Service (Prod) exposing `/api/v1`.
- **Database**: Hosted on Neon PostgreSQL with pooled `DATABASE_URL` runtime connection and direct `DIRECT_URL` for migrations.
- **Object Storage**: S3-compatible MinIO for binary file storage (avatars, bug evidence, tournament banners) using presigned direct-upload URLs.
- **Cache Layer**: Redis caching read-heavy endpoints (opportunities, tournaments, settings, categories) with auto-invalidation.
- **Event Queue**: RabbitMQ message broker managing asynchronous background jobs (emails, notifications).

---

## Core Concept


### 1. Game Testing & QA Ecosystem (Primary Focus)

Riyadah Elite is **not a game hosting platform** and does not host game downloads on its own application servers. Game developers build and maintain their games independently using their own engines (Unreal Engine, Unity, Godot, custom engines) and provide secure, official test builds or download links.

Riyadah Elite coordinates the recruitment and structured QA lifecycle:

```text
Game Developer / Studio
        │
        ▼ (Publishes opportunity with hardware specs, focus areas, & build link)
Riyadah Testing Opportunity
        │
        ▼ (Player reviews requirements and submits application)
Tester Applies with Rig Specs (GPU, CPU, RAM, OS, Availability, NDA agreement)
        │
        ▼ (Application accepted by studio or automated review)
External Game Testing Execution (Tester downloads build & stress-tests gameplay)
        │
        ▼ (Structured feedback, reproducible steps, crash logs, screenshots)
Bug Reports & QA Feedback Submission
        │
        ▼ (Aggregated analytics & verified tester scoring)
Developer Receives Actionable QA Results
```

### 2. Tournament Discovery & Organization (Secondary Feature)

Alongside structured QA, Riyadah Elite hosts an open tournament directory supporting:
- Community and grassroots esports competitions
- Creator and YouTuber invitationals
- College and university leagues
- Organizer-hosted regional brackets (MENA / Saudi Arabia focus)
- Solo, existing team, or new squad registration flows

> **Important**: Riyadah Elite is not a gambling or betting website. It does not operate games of chance or casino mechanics. Its purpose is to create legitimate professional pathways in game QA, competitive play, and community event organization.

---

## Current Architecture

The production and development architecture follows a direct, decoupled client-server model:

```text
┌─────────────────────────────────┐
│     Client (React 19 / Vite)    │  Port 5173 (Dev) / Render Static Site (Prod)
│     Tailwind CSS v4 + TS        │
└────────────────┬────────────────┘
                 │ HTTP / REST (/api/v1)
                 ▼
┌─────────────────────────────────┐
│     Server (Express 4 / Node)   │  Port 5000 (Dev) / Render Web Service (Prod)
│     TypeScript + Zod + JWT      │
└────────────────┬────────────────┘
                 │ Prisma ORM 6.4.1
                 ▼
┌─────────────────────────────────┐
│      Neon PostgreSQL            │  Serverless Postgres (Dual-connection:
│      (production branch)        │  Pooled DATABASE_URL + Direct DIRECT_URL)
└─────────────────────────────────┘
```

- **Frontend**: Runs completely independently as a Vite SPA.
- **Backend**: Runs completely independently as an Express HTTP server.
- **Database**: Hosted on Neon PostgreSQL. Prisma uses `DATABASE_URL` (pooled connection) for runtime queries and `DIRECT_URL` (direct connection) for schema operations and migrations.

---

## User Roles

The platform defines four distinct roles in the database schema (`Role` enum):

### 1. `PLAYER` (Tester / Competitive Gamer)
- **Account & Profile**: Manage gaming profile, hardware specifications (GPU, CPU, RAM, OS), favorite genres, primary gaming platforms, and bio.
- **Testing Opportunities**: Browse active game opportunities, view focus areas and testing requirements, and submit testing applications agreeing to NDAs and telemetry guidelines.
- **Testing Workspace**: Track application statuses (`PENDING`, `UNDER_REVIEW`, `ACCEPTED`, `REJECTED`, `COMPLETED`), view testing history, and inspect tester scores.
- **Tournaments**: Discover tournaments by game/region, register as solo or team squad, review anti-cheat and rule agreements, and receive unique registration tickets.

### 2. `DEVELOPER` (Studio / Indie Game Creator)
- **Studio Profile & Verification**: Manage studio details and submit official developer verification requests.
- **Game Titles & Opportunities**: Create and manage game profiles, launch QA campaigns/opportunities, define target platforms, test stages (`Alpha`, `Beta`), hardware prerequisites, and tester capacity.
- **Tester Management**: Review applicant tester profiles, evaluate applicant hardware specs, and inspect tester feedback and submitted reports.
- **Campaign Analytics**: Track active campaigns, tester capacity fill rates, and testing earnings/credits.

### 3. `HOST` (Tournament Organizer / Community Host)
- **Host Profile**: Manage tournament host bio, organization branding, contact info, and website.
- **Tournament Lifecycle**: Draft, publish, open registration, pause, and conclude tournaments.
- **Bracket & Rules Configuration**: Configure tournament brackets (`Single Elimination`, etc.), region, game titles, entry fees, prize pools, participant limits, and rules.
- **Registration Management**: Inspect registered participants and manage participant statuses (`CONFIRMED`, `WAITLISTED`, `CHECKED_IN`, `WITHDRAWN`, `DISQUALIFIED`).

### 4. `ADMIN` (Internal Operations & Compliance)
- **User Directory**: View registered users across all roles, filter by role/verification status, and modify user roles or account status.
- **Developer Review**: Audit and review pending studio verification submissions.
- **Finance & Metrics**: Inspect financial overviews, platform metrics, active testing runs, and tournament registries.
- **Audit Logging**: All sensitive admin modifications generate persistent `AdminAuditLog` records tracking actor ID, action name, target entity, and audit metadata.

---

## Key Platform Features

- **Decoupled Auth System**: Custom JWT authentication (`/api/v1/auth`) with bcrypt password hashing, HTTP-only cookie support, rate-limiting (`express-rate-limit`), and cryptographic password reset tokens (`PasswordResetToken`).
- **Hardware-Aware QA Matchmaking**: Testers provide exact rig specifications (GPU, CPU, RAM) so game developers can recruit specific configurations for hardware compatibility testing.
- **Role-Based Access Control**: Middleware enforcement (`requireAuth`, `requireRole`) guarding developer, host, and administrative endpoints.
- **Zod Request Validation**: Comprehensive Zod schema validation across all authentication, application, tournament, and administrative request payloads.
- **Dual-Connection Prisma Database Layer**: Engineered for serverless PostgreSQL platforms (Neon) with connection pooling for HTTP traffic and direct connection for migrations.

---

## Tech Stack

### Web Frontend (`client/`)
- **Core**: React 19, TypeScript 5.8
- **Tooling & Bundler**: Vite 6.2
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), `clsx`, `tailwind-merge`
- **State & Data Fetching**: TanStack React Query v5
- **Routing**: React Router v7
- **Forms & Validation**: React Hook Form, Zod
- **Icons**: Lucide React
- **Testing**: Vitest 3.0, Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), jsdom

### Mobile Frontend (`mobile/`)
- **Core**: React Native 0.76, React 18
- **Platform Tooling**: Expo SDK 52, TypeScript 5.3
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **API Client**: Strongly typed Fetch client targeting `/api/v1`
- **Architecture**: Independent mobile client; zero backend logic or database access

### Monolithic Backend (`server/`)
- **Runtime**: Node.js (v20+ recommended)
- **Framework**: Express 4.21, TypeScript 5.8
- **ORM**: Prisma ORM 6.4.1 (`@prisma/client`)
- **Database**: Neon PostgreSQL (serverless connection pooling)
- **Cache Layer**: Redis (`ioredis` client with non-blocking resilience)
- **Event Broker**: RabbitMQ (`amqplib` with dead-letter exchange)
- **Object Storage**: MinIO / S3 (`@aws-sdk/client-s3` with presigned URLs)
- **Security & Auth**: `jsonwebtoken`, `bcrypt` / `bcryptjs`, `cookie-parser`, `express-rate-limit`, `cors`
- **Validation**: Zod
- **Testing**: Vitest 3.0, Supertest 7.0

---

## Repository Structure

```text
Riyadah_Elite/
├── client/                          # Web frontend workspace (Vite + React 19)
│   ├── src/
│   │   ├── components/              # UI components, layout elements, modals
│   │   ├── lib/                     # API client, utility functions
│   │   ├── pages/                   # Page routes (Player, Dev, Host, Admin, Auth)
│   │   ├── App.tsx                  # React Router routes and provider setup
│   │   └── main.tsx                 # Client bootstrap
│   ├── .env.example                 # Web frontend environment template
│   ├── package.json                 # Web client dependencies & scripts
│   └── tsconfig.json                # Web client TypeScript configuration
├── mobile/                          # Mobile frontend workspace (React Native + Expo)
│   ├── src/
│   │   ├── components/              # Reusable mobile UI components (LoadingView, ErrorView)
│   │   ├── config/                  # Theme tokens, colors, environment constants
│   │   ├── context/                 # AuthContext & session state
│   │   ├── navigation/              # Bottom tabs & stack navigation container
│   │   ├── screens/                 # Mobile screens (Home, Playtests, Tournaments, Profile, Auth)
│   │   ├── services/                # Mobile API client targeting /api/v1
│   │   └── types/                   # Shared TypeScript models
│   ├── .env.example                 # Mobile environment template (EXPO_PUBLIC_API_URL)
│   ├── app.json                     # Expo application configuration
│   ├── package.json                 # Mobile dependencies & scripts
│   └── tsconfig.json                # Mobile TypeScript configuration
├── server/                          # Monolithic backend workspace (Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma            # Prisma schema (PostgreSQL / Neon)
│   ├── src/
│   │   ├── lib/                     # Prisma client instance, security/crypto helpers
│   │   ├── middleware/              # Auth, role check, and rate-limiting middleware
│   │   ├── routes/                  # Express API routers (auth, player, dev, host, admin, tournament)
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── services/                # Infrastructure abstractions (StorageService, CacheService, QueueService, DatabaseService)
│   │   ├── app.ts                   # Express app setup and route mounting
│   │   └── index.ts                 # HTTP server bootstrap and graceful shutdown
│   ├── .env.example                 # Backend environment template (Neon, MinIO, Redis, RabbitMQ)
│   ├── package.json                 # Server dependencies & scripts
│   └── tsconfig.json                # Server TypeScript configuration
├── docker-compose.yml               # Local developer infrastructure (MinIO, Redis, RabbitMQ)
├── .neon                            # Linked Neon project configuration
├── neon.ts                          # Neon SDK configuration
├── .gitignore                       # Git ignore rules
├── package.json                     # Monorepo root workspace configuration
└── README.md                        # Project documentation
```


---

## Environment Configuration

The repository **intentionally does not use a root `.env` file**. Environment variables are strictly partitioned between the client and server workspaces.

### 1. Client Environment (`client/.env`)

Template: `client/.env.example`

```bash
# Copy template inside client/
cd client
cp .env.example .env
```

Variables:
```env
# Backend API Base URL (must be prefixed with VITE_ to be exposed to Vite)
VITE_API_URL=http://localhost:5000/api/v1
```

> **Security Warning**: Any variable starting with `VITE_` is baked into the public browser bundle. Never put database credentials, private keys, or server secrets in `client/.env`.

### 2. Server Environment (`server/.env`)

Template: `server/.env.example`

```bash
# Copy template inside server/
cd server
cp .env.example .env
```

Variables:
```env
# Server Environment & Port
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# PostgreSQL / Prisma Database Connection Strings (Neon)
DATABASE_URL="postgresql://user:password@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"

# Authentication Security (JWT)
JWT_SECRET="replace_with_a_secure_random_secret_at_least_32_characters"
JWT_EXPIRES_IN="7d"

# Email Provider Configuration (Optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="apikey_or_user"
SMTP_PASS="secret_password_or_token"
SMTP_FROM="Riyadah Elite <security@riyadahelite.com>"
```

- **`DATABASE_URL`**: Pooled connection string (used by Prisma Client at runtime for API queries).
- **`DIRECT_URL`**: Direct unpooled connection string (used by Prisma CLI for migrations and schema pushes).

---

## Local Development

Both workspaces can be started independently or together using root convenience scripts.

### Frontend Workspace

To run the frontend independently:

```bash
cd client
npm install
npm run dev
```

The client will start at:
```text
http://localhost:5173
```

### Backend Workspace

To run the backend independently:

```bash
cd server
npm install
npm run dev
```

The backend server will start at:
```text
http://localhost:5000
```

Verify backend health at:
```text
GET http://localhost:5000/api/v1/health
```

Expected response (`200 OK`):
```json
{
  "status": "ok",
  "timestamp": "2026-10-08T01:50:00.000Z",
  "uptime": 12.34,
  "service": "riyadah-elite-server"
}
```

### Running Both Workspaces

From the **repository root**, you can run both workspaces concurrently:

```bash
# From root directory:
npm install
npm run dev
```

### Important Script Clarification

| Command | Working Directory | What It Does |
|---|---|---|
| `npm run dev` | `client/` | Starts Vite on `http://localhost:5173`. |
| `npm run dev` | `server/` | Starts Express server via `tsx watch` on `http://localhost:5000`. |
| `npm run dev` | Root (`/`) | Runs `npm run dev` concurrently across workspaces via `--workspaces --if-present`. |
| `npm run dev:client` | Root (`/`) | Root convenience script that invokes `client` workspace dev server. |
| `npm run dev:server` | Root (`/`) | Root convenience script that invokes `server` workspace dev server. |

> **Note**: Do **NOT** run `npm run dev:client` or `npm run dev:server` while inside the `client/` or `server/` directories. Those scripts are defined exclusively in the root `package.json`.

---

## Database & Prisma Workflow

The database schema is defined in [server/prisma/schema.prisma](file:///d:/website/Riyadah%20Elite/Riyadah_Elite/server/prisma/schema.prisma).

### Prisma Commands

All Prisma commands can be run from the root using workspace scripts, or directly inside `server/`:

#### From the Repository Root:
```bash
# Generate Prisma Client
npm run prisma:generate

# Deploy migrations to database
npm run prisma:migrate

# Open Prisma Studio web inspector
npm run prisma:studio
```

#### From the `server/` Directory:
```bash
cd server

# Generate Prisma Client
npx prisma generate

# Push schema directly (development prototyping)
npx prisma db push

# Deploy pending migrations
npx prisma migrate deploy

# Open Prisma Studio web inspector
npx prisma studio
```

---

## Testing

The project uses **Vitest** for both frontend component testing and backend API integration tests.

### Run All Tests (Root)
```bash
npm test
```
Runs tests across all workspaces concurrently (`npm run test --workspaces --if-present`).

### Frontend Tests (`client/`)
```bash
cd client
npm test
```
Executes client unit and integration tests including authentication pages, developer pages, host pages, and player dashboard flows.

### Backend Tests (`server/`)
```bash
cd server
npm test
```
Executes server API tests using Supertest across:
- `app.test.ts` (Health endpoint verification)
- `auth.test.ts` & `authJourney.test.ts` (Signup, login, session validation, password reset)
- `player.test.ts` (Opportunities, application submissions, profile updates)
- `developer.test.ts` (Campaign creation, game registration, applicant review)
- `host.test.ts` (Tournament creation, bracket management, participant status updates)
- `admin.test.ts` (User administration, verification reviews, audit logging)

---

## Build & Verification

Before deployment or committing changes, run the verification scripts:

```bash
# Typecheck TypeScript across all workspaces
npm run typecheck

# Build both client and server for production
npm run build

# Check code formatting
npm run format:check
```

Workspace-specific build commands:
- Frontend: `npm run build:client` (or `cd client && npm run build`) → outputs to `client/dist/`
- Backend: `npm run build:server` (or `cd server && npm run build`) → outputs to `server/dist/`

---

## API Overview

All API endpoints are versioned under the `/api/v1` prefix.

### 1. Health & Status
- `GET /api/v1/health` — Public health check returning service uptime and timestamp.

### 2. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/signup` — Register new user account (`PLAYER` by default). Rate-limited.
- `POST /api/v1/auth/login` — Authenticate user and issue JWT token (in response and HTTP-only cookie). Rate-limited.
- `GET /api/v1/auth/me` — Retrieve currently authenticated user profile and active role (`requireAuth`).
- `POST /api/v1/auth/logout` — Invalidate session and clear auth cookies.
- `POST /api/v1/auth/forgot-password` — Request password reset email and generate reset token. Rate-limited.
- `POST /api/v1/auth/reset-password` — Reset password using verified cryptographic token.

### 3. Player & Testing Opportunities (`/api/v1/player`)
- `GET /api/v1/player/opportunities` — Public listing of active game testing campaigns (supports query filters for genre, platform, search).
- `GET /api/v1/player/opportunities/:idOrSlug` — Public detailed opportunity view (focus areas, requirements, capacity).
- `GET /api/v1/player/overview` — Authenticated player dashboard statistics (active tests, completed tests, applications).
- `GET /api/v1/player/profile` — Get authenticated player's profile and hardware configuration.
- `PUT /api/v1/player/profile` — Update player profile, hardware specifications (GPU, CPU, RAM), and bio.
- `PUT /api/v1/player/settings/password` — Update player password (`requireAuth`).
- `GET /api/v1/player/applications` — List all testing applications submitted by the player.
- `POST /api/v1/player/applications` — Submit a game testing application with hardware rig specs and NDA agreement.
- `GET /api/v1/player/tournaments` — List tournaments the player has registered for.

### 4. Tournament Discovery & Registration (`/api/v1/tournaments`)
- `GET /api/v1/tournaments` — Public tournament list with game, format, and region filters.
- `GET /api/v1/tournaments/:idOrSlug` — Public tournament detail view with rules, bracket type, and organizer info.
- `POST /api/v1/tournaments/:idOrSlug/register` — Register for tournament (Solo or Squad, generates unique `ticketCode`).

### 5. Developer Workspace (`/api/v1/developer`)
- `GET /api/v1/developer/overview` — Studio metrics, active campaigns, pending applicants, and tester counts.
- `GET /api/v1/developer/games` — List studio's registered games.
- `POST /api/v1/developer/games` — Register a new game profile.
- `GET /api/v1/developer/games/:id` — Get details of a studio's game.
- `GET /api/v1/developer/campaigns` — List studio's QA testing campaigns.
- `POST /api/v1/developer/campaigns` — Create a new testing opportunity/campaign.
- `GET /api/v1/developer/campaigns/:id` — Campaign detail view with applicant metrics.
- `GET /api/v1/developer/testers` — List applicants across campaigns with hardware specs.
- `GET /api/v1/developer/feedback` — List QA feedback and bug reports from testers.
- `GET /api/v1/developer/earnings` — Studio budget and testing credit status.
- `GET /api/v1/developer/verification` — Check studio verification status.
- `POST /api/v1/developer/verification` — Submit studio verification request.
- `GET /api/v1/developer/profile` & `PUT /api/v1/developer/profile` — View and update studio profile.
- `GET /api/v1/developer/support` & `POST /api/v1/developer/support` — Developer support inquiries.

### 6. Tournament Host Workspace (`/api/v1/host`)
- `GET /api/v1/host/overview` — Host metrics (hosted tournaments, total participants, active brackets).
- `GET /api/v1/host/tournaments` — List tournaments organized by host.
- `POST /api/v1/host/tournaments` — Create a new tournament.
- `GET /api/v1/host/tournaments/:id` — Get host tournament details.
- `PUT /api/v1/host/tournaments/:id` — Update tournament details, rules, or registration status.
- `GET /api/v1/host/tournaments/:id/registrations` — View registered participants.
- `PUT /api/v1/host/tournaments/:id/registrations/:registrationId` — Update participant status (`CONFIRMED`, `CHECKED_IN`, etc.).
- `GET /api/v1/host/profile` & `PUT /api/v1/host/profile` — View and update organizer profile.

### 7. Admin Workspace (`/api/v1/admin`)
- `GET /api/v1/admin/overview` — High-level platform metrics and user counts.
- `GET /api/v1/admin/users` — Search and paginate all users.
- `PATCH /api/v1/admin/users/:id/role` — Update a user's role (`PLAYER`, `DEVELOPER`, `HOST`, `ADMIN`).
- `PATCH /api/v1/admin/users/:id/status` — Modify user active status or verification flag.
- `GET /api/v1/admin/developers` — List developer verification applications.
- `POST /api/v1/admin/developers/:id/verify` — Approve or reject developer verification.
- `GET /api/v1/admin/finance/overview` — Platform financial and testing credit overview.
- `GET /api/v1/admin/audit-logs` — Inspect system audit logs.

---

## Render Deployment

The application is deployed on Render as two separate services: a Static Site for the frontend and a Web Service for the backend.

```text
Render Static Site (Frontend)
          │
          │ HTTPS (Requests to /api/v1)
          ▼
Render Web Service (Backend)
          │
          │ PostgreSQL Wire Protocol (SSL)
          ▼
Neon PostgreSQL (Database)
```

### Frontend Static Site

- **Service Type**: Static Site
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Public URL of your deployed Render backend (e.g. `https://riyadah-elite-api.onrender.com/api/v1`).

### Backend Web Service

- **Service Type**: Web Service
- **Environment**: Node
- **Root Directory**: `server`
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start` (runs `node dist/index.js`)
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (or assigned by Render)
  - `CLIENT_URL`: Public URL of your deployed Render frontend (e.g. `https://riyadah-elite.onrender.com`)
  - `DATABASE_URL`: Pooled Neon connection string (`postgresql://...@ep-...-pooler...neon.tech/neondb?sslmode=require`)
  - `DIRECT_URL`: Direct Neon connection string (`postgresql://...@ep-......neon.tech/neondb?sslmode=require`)
  - `JWT_SECRET`: Secure, random 64-character secret
  - `JWT_EXPIRES_IN`: `7d`

### Neon PostgreSQL Production Database

- **Provider**: Neon Serverless PostgreSQL
- **Project**: Linked in `.neon` (`lingering-mouse-51224411`)
- **Branch**: `production`
- **Connection Model**:
  - `DATABASE_URL`: Used for connection-pooled application queries in production.
  - `DIRECT_URL`: Used for direct migrations and schema changes.

---

## Security Guidelines

1. **Never Commit Secrets**: Never commit `.env` or `.env.local` files to Git. Both directories have `.gitignore` rules preventing `.env` commits.
2. **Do Not Leak Database Credentials**: Neither `DATABASE_URL` nor `DIRECT_URL` should ever be placed in `client/.env` or bundled into client code.
3. **Keep `JWT_SECRET` Strong**: Ensure `JWT_SECRET` in production is a cryptographically strong string with at least 32 characters.
4. **CORS Restrictions**: In production, `CLIENT_URL` must point strictly to your verified frontend domain to prevent unauthorized cross-origin requests.
5. **Rate Limiting**: Authentication endpoints (`/api/v1/auth/signup`, `/api/v1/auth/login`, `/api/v1/auth/forgot-password`) have active IP rate limiters to mitigate brute-force attacks.

---

## Development Notes

- **Independent Running**: Both `client` and `server` are completely independent Node projects. You can open separate terminal windows, navigate to their directories, and start them independently.
- **Node Version**: Recommended Node.js version is v20 LTS or higher.
- **No Third-Party Backend Dependencies**: The current architecture does not require external queue managers (RabbitMQ/Kafka), caching layers (Redis), or third-party auth services. All logic is self-contained in the Express API and Neon database.
