---
phase: 1
title: Discovery Screens
status: active
---

# Phase 1: Discovery Screens

## Goal
Implement the Game Testing Discovery and Tournament Discovery pages based on the Google Stitch designs, strictly adhering to the Zero-Fake-Data policy.

## Scope
- Screen 8533aab53b2942f4ba823d519cc11050 (Game Testing Discovery)
- Screen 0f9fd4e324da4ecea1bbdeb511ec81fd (Tournament Discovery)

## Requirements
- Create `frontend/src/app/games/page.tsx` for Game Testing Discovery.
- Create `frontend/src/app/tournaments/page.tsx` for Tournament Discovery.
- Create Prisma schema models for `Game` and `Tournament` to support these pages.
- Add Express API routes for fetching games and tournaments, returning empty lists if no real data exists.
- Implement UI empty states according to `docs/no-fake-data-policy.md`.

## Execution Steps
1. **Prisma Schema Update:** Add `Game` and `Tournament` models to `backend/prisma/schema.prisma`.
2. **Backend API:** Create `/api/games` and `/api/tournaments` endpoints.
3. **Frontend API Integration:** Set up data fetching logic in Next.js.
4. **Stitch Implementation (Games):** Download and convert the HTML/CSS for the Game Discovery screen into a Next.js Server Component.
5. **Stitch Implementation (Tournaments):** Download and convert the HTML/CSS for the Tournament Discovery screen into a Next.js Server Component.
6. **Verification:** Ensure the pages render correctly, match the Stitch design, and display the required empty states since the DB is empty.

## Status
- [ ] Prisma schema updated
- [ ] Backend API implemented
- [ ] Game Discovery UI implemented
- [ ] Tournament Discovery UI implemented
- [ ] Verification passed
