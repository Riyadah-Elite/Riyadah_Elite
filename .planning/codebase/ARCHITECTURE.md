---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# System Architecture

**Analysis Date:** 2026-10-03

## Architectural Pattern

The project is structured as a **clean PERN monorepo** with separated presentation and backend concerns:

```text
[ Client (Vite + React 19 SPA) ]
                |
           REST / JSON
                v
 [ Server (Node.js + Express API) ]
                |
           Prisma ORM
                v
     [ PostgreSQL Database ]
```

## Frontend Architecture (`client/`)

- **Component Hierarchy**:
  - `PublicLayout`: Global wrapper component rendering fixed `PublicNavbar`, dynamic child content via `<Outlet />`, and sticky `PublicFooter`.
  - Layout ensures no duplicated navigation headers across routes.
  - Routed Pages (`src/pages/`):
    - `LandingPage`: Composed of 12 distinct modular landing sections.
    - Discovery Pages (`GameTestingDiscoveryPage`, `TournamentDiscoveryPage`): Client-side filtering, grid/list view toggles, category selectors.
    - Detail Pages (`GameTestingDetailsPage`, `TournamentDetailsPage`): Deep parameter lookup.
    - Information Pages (`HowItWorksPage`, `ForDevelopersPage`, `GameRightsOwnershipPage`).
    - Gateways (`AuthPlaceholderPage`, `NotFoundPage`).
- **State Management**: Local React hooks (`useState`, `useEffect`). No heavy global store needed yet for public marketing.

## Backend Architecture (`server/`)

- **Express Application Pipeline** (`server/src/app.ts`):
  - Request parsing: `express.json()`
  - Security headers & CORS: configured for frontend origins
  - Routing: Versioned route pattern (`/api/v1/...`)
  - Health check handler: `GET /api/v1/health`
  - Fallback handlers: 404 JSON response and centralized 500 error handler
- **Bootstrap** (`server/src/index.ts`):
  - Listens on `PORT` (defaults to 5000)
  - Handles graceful shutdown (`SIGTERM`, `SIGINT`)

---

*Codebase analysis: 2026-10-03*
