---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# Technical Debt, Concerns & Known Issues

**Analysis Date:** 2026-10-03

## High Priority Concerns

### 1. Mock Data & Zero Fake Data Compliance

- **Issue**: Discovery views (`GameTestingDiscoveryPage.tsx` and `TournamentDiscoveryPage.tsx`) contain hardcoded mock campaign arrays.
- **Currency Bug**: Several items in discovery lists use Indian Rupee currency symbols (`₹120,000`, `₹85,000`) instead of Saudi Riyals (SAR) or USD, conflicting with the Saudi/GCC market identity.
- **Remediation**: Migrate mock data to clear demonstration badges, correct currency formatting to SAR, and replace in-memory arrays with live backend API endpoints once database schema is built.

### 2. Missing Backend Business Models & Routes

- **Issue**: `server/prisma/schema.prisma` contains only a baseline `HealthCheck` model. No entities exist for `User`, `Game`, `TestingCampaign`, `Application`, or `Tournament`.
- **Issue**: `server/src/app.ts` only registers the health endpoint.
- **Remediation**: Design and migrate PostgreSQL schema for core business domains; implement corresponding Express controllers and routes with validation.

## Medium Priority Concerns

### 1. Client Bundle Chunk Size

- **Issue**: Production client build issues a chunk size warning (`dist/assets/index-C1vBkYHG.js` is ~566 kB) because all 10 page routes are bundled eagerly into the main entry.
- **Remediation**: Introduce React code splitting using `React.lazy()` and `React.Suspense` for page routes in `client/src/App.tsx`.

### 2. Authentication Gateway

- **Issue**: Routes `/login` and `/signup` render `AuthPlaceholderPage.tsx`. While honest about pending functionality, real registration and session management are not yet implemented.
- **Remediation**: Implement authentication service in Sprint 2.

## Low Priority / Housekeeping

### 1. Working Copy Git Status

- **Issue**: The working directory has uncommitted files in `client/` and staged/unstaged deletions of the 7 subdirectories in `Design_Stitch_Organized/01-public-marketing/`.
- **Remediation**: Commit the verified public marketing frontend implementation and cleanly resolve the working copy state.

---

*Codebase analysis: 2026-10-03*
