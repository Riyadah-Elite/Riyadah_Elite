---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Structure

**Analysis Date:** 2026-10-01

## Root Directory

- `frontend/` - Next.js App Router application.
- `backend/` - Express.js REST API.
- `shared/` - Types, interfaces, and Zod schemas shared between frontend and backend.
- `infrastructure/docker/` - Docker Compose setups (e.g., `docker-compose.yml` for PG and Redis).
- `docs/` - Project documentation, audit logs, and policies (e.g., `no-fake-data-policy.md`).

## Frontend Structure

- `src/app/` - Next.js App Router pages, layouts, and global styles (`globals.css`).
- `src/components/` - Reusable UI components.
- `src/lib/` - Utility functions.

## Backend Structure

- `src/routes/` - Express route definitions.
- `src/controllers/` - HTTP request handlers.
- `src/services/` - Business logic.
- `src/workers/` - BullMQ job processors.
- `prisma/` - Database schema and migrations.

<!-- refreshed: 2026-10-01 -->
