---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# External Integrations & Services

**Analysis Date:** 2026-10-03

## Database Integration

- **Database Engine**: Neon PostgreSQL (Serverless Postgres)
- **ORM**: Prisma Client (`server/prisma/schema.prisma`)
- **Connection Configuration**: 
  - `DATABASE_URL`: Neon pooled connection string for runtime queries (e.g., `postgresql://...neon.tech/neondb?sslmode=require`)
  - `DIRECT_URL`: Neon direct unpooled connection string for migrations and schema pushes
- **Target Deployment Platform**: Render Web Service (backend API) and Render Static Site (frontend)
- **Optional/Future Services**: AWS (optional object storage or cloud utilities, not required for core MVP)
- **Current Models**:
  - `HealthCheck`, `User`, `PlayerProfile`, `DeveloperProfile`, `HostProfile`, `Game`, `TestingCampaign`, `GameTestingApplication`, `Tournament`, `TournamentRegistration`, `AuditLog`, `PlatformSetting`

## Network & API Interfaces

- **Express HTTP Server**: Standard REST interface
- **Endpoints Implemented**:
  - `GET /api/v1/health`: Returns service health status, timestamp, uptime, and service identifier
- **CORS Setup**: Configured in `server/src/app.ts` with origins dynamic from `CLIENT_URL` (defaults to `http://localhost:5173`) and `credentials: true`

## Planned & Pending Integrations

- **Authentication**: Upcoming user/studio auth provider (JWT/sessions). Currently routed to honest early-access notice in `client/src/pages/AuthPlaceholderPage.tsx`.
- **Payment & Escrow (KSA / Regional)**: SAMA / SARIE / Mada considerations for tournaments and prize distribution.
- **Identity & Compliance**: Nafath/Absher and Saudi Esports Federation regulatory frameworks are identified requirements for future phases, but no third-party SDKs or API keys are integrated yet.

---

*Codebase analysis: 2026-10-03*
