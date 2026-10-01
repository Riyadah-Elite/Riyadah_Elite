---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Tech Stack

**Analysis Date:** 2026-10-01

## Monorepo

- **Workspace:** npm workspaces
- **Tooling:** (Likely Turborepo, optional)
- **Shared:** `shared/` workspace for types, schemas (Zod).

## Frontend (`frontend/`)

- **Runtime:** Node.js
- **Framework:** Next.js 16.3.8 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using CSS variables, `@theme inline` in `globals.css`)
- **Fonts:** Plus Jakarta Sans (Primary), Space Grotesk (Secondary)
- **UI Components:** Implemented to match Google Stitch design (Strictly).

## Backend (`backend/`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Architecture:** Routes, Controllers, Services, Repositories, Middleware. Business logic in `src/services`.
- **Validation:** Zod schemas imported from `shared/`
- **Error Handling:** Centralized.

## Database & Infrastructure

- **Relational DB:** PostgreSQL
- **ORM / Migrations:** Prisma
- **Caching & KV:** Redis
- **Background Jobs:** BullMQ (Worker processes separate from Express route handlers).
- **Local Dev:** Docker Compose (`infrastructure/docker/docker-compose.yml`)

<!-- refreshed: 2026-10-01 -->
