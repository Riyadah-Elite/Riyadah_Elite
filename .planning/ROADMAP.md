# Riyadah Elite — Project Roadmap

**Current Milestone:** Phase 1: Authentication & Identity Foundation  
**Updated:** 2026-10-03  

## Phases

### Phase 1: Authentication & Identity Foundation (IN PROGRESS)
- [x] Analyze 6 Google Stitch authentication designs in `Design_Stitch_Organized/02-authentication/`
- [ ] Implement database user & token models in `server/prisma/schema.prisma`
- [ ] Implement Express authentication endpoints (`signup`, `login`, `me`, `logout`, `forgot-password`, `reset-password`)
- [ ] Implement backend unit & integration tests with security assertions
- [ ] Implement 6 React authentication pages matching Stitch design system
- [ ] Connect frontend forms to real backend endpoints and test end-to-end flows
- [ ] Verify zero fake customer-facing data and clean typecheck/test/build

### Phase 2: Core Platform Database & Campaigns API
- [ ] Migrate PostgreSQL schema for `Game`, `TestingCampaign`, `Application`, and `Feedback`
- [ ] Build REST API routes for games discovery and application submission
- [ ] Connect client `/games` and `/games/:id` to real database endpoints (replacing mock arrays)
- [ ] Correct all bounty currency formats to SAR/USD

### Phase 3: Esports Tournament Management System
- [ ] Migrate PostgreSQL schema for `Tournament`, `Participant`, and `Match`
- [ ] Build tournament bracket generation and check-in APIs
- [ ] Connect client `/tournaments` to real database endpoints

### Phase 4: Developer Studio & Player Workspaces
- [ ] Implement Developer Workspace portal
- [ ] Implement Player Profile & Reputation Pass portal
- [ ] Role-based access control (RBAC)

### Phase 5: Administration, Regional Compliance & Production Hardening
- [ ] Platform operations & trust/safety command center
- [ ] Regional integrations (SAMA/Mada, Saudi Esports Federation verification requirements)
- [ ] Security audit & performance tuning
