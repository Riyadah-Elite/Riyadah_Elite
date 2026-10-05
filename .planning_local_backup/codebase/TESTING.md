---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# Testing Strategy & Patterns

**Analysis Date:** 2026-10-03

## Testing Framework & Configuration

- **Runner**: Vitest v3 (`vitest`) across both frontend and backend workspaces.
- **Frontend Environment**: `jsdom` configured in `client/vitest.config.ts` with `@testing-library/react` and `@testing-library/jest-dom`.
- **Backend Environment**: `node` environment configured with `supertest` for Express route integration testing.

## Current Test Suites & Coverage

### Frontend (`client/`)

1. `client/src/components/ui/Button.test.tsx` (2 tests):
   - Renders button label accurately.
   - Applies variant classes (`primary`, `outline`, sizes).
2. `client/src/components/layout/PublicNavbar.test.tsx` (2 tests):
   - Renders logo brand link and primary navigation routes (`Games`, `Tournaments`, `How It Works`, `For Developers`).
   - Renders action buttons (`Log In`, `Get Started`).
3. `client/src/components/layout/PublicLayout.test.tsx` (2 tests):
   - Verifies route integration under `<PublicLayout />`.
   - Confirms that navigating to `/how-it-works` and `/for-developers` correctly renders the single shared navbar and footer without duplication or omission.

### Backend (`server/`)

1. `server/src/app.test.ts` (2 tests):
   - `GET /api/v1/health` returns HTTP 200 with status `"ok"` and valid ISO timestamp.
   - `GET /api/v1/nonexistent` returns HTTP 404 with error message envelope.

## Running Tests

- Run all monorepo tests: `npm test`
- Run client tests only: `npm test -w client`
- Run server tests only: `npm test -w server`

---

*Codebase analysis: 2026-10-03*
