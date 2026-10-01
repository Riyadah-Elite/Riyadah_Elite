# Riyadah Elite

## What This Is
Riyadah Elite is a modern web application for gaming tournaments. This phase focuses on building the frontend from Google Stitch designs with strict adherence to a Zero-Fake-Data policy.

## Core Value
Faithfully translate the Google Stitch designs into a fully functional, production-ready Next.js application, without inventing mock data. Empty states must be truthful.

## Requirements

### Validated
- ✓ Monorepo architecture (Next.js frontend, Express backend, shared Zod schemas)
- ✓ Tailwind CSS v4 setup with brand design tokens
- ✓ Plus Jakarta Sans and Space Grotesk fonts integrated
- ✓ Landing page empty state implemented
- ✓ PostgreSQL, Redis, and BullMQ worker infrastructure scaffolded

### Active
- [ ] Implement Game Discovery screens
- [ ] Implement Tournament Discovery screens
- [ ] Implement Auth flows
- [ ] Implement Workspace dashboards
- [ ] Implement Internal Operations pages

### Out of Scope
- [ ] Generating fake data (strictly forbidden)
- [ ] Redesigning Google Stitch components

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No Fake Data | Ensures the UI logic correctly handles empty/unavailable states and prepares for real API integration. | Enforced in `docs/no-fake-data-policy.md` |
| Google Stitch as Source of Truth | Avoids design drift and ensures UI/UX fidelity. | 52 screens audited |

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-01 after initialization*
