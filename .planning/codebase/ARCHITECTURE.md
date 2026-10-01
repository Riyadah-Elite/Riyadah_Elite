---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Architecture

**Analysis Date:** 2026-10-01

## System Context

Riyadah Elite is a modern web application consisting of a Next.js frontend, an Express.js API backend, and a PostgreSQL database. Redis is used for caching and managing BullMQ background jobs.

## Architectural Layers

### Frontend (Next.js App Router)

- **Server Components:** Default for all pages to optimize load times and SEO.
- **Client Components:** Used only for interactive elements.
- **Styling:** Tailwind CSS v4 using CSS variables.
- **Data Fetching:** Direct server-side fetches or trpc/react-query (pattern TBD).

### Backend (Express)

- **Routes:** Define API endpoints.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain the core business logic (`src/services/`).
- **Repositories (Prisma):** Database access layer.
- **Workers:** BullMQ workers for offloading heavy tasks (e.g., emails).

### Data Flow

Client -> Next.js Server (BFF) -> Express API -> Service Layer -> Prisma ORM -> PostgreSQL
Background tasks: Express API -> Redis Queue -> BullMQ Worker -> Third-party service

## Key Rules

- **No Fake Data:** Strict policy against mocking UI with fake data. Must use explicit empty states.
- **Business Logic Placement:** Logic belongs in `backend/src/services`, NOT route handlers.
- **Strict UI Adherence:** Frontend must match Google Stitch designs exactly.

<!-- refreshed: 2026-10-01 -->
