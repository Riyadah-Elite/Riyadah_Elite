---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Concerns

**Analysis Date:** 2026-10-01

## Technical Debt & Issues

- **Infrastructure Start:** PostgreSQL and Redis containers were configured (`docker-compose.yml`) but need to be running to verify `prisma pull` and BullMQ connections.
- **Stitch Integrations:** Requires systematic rollout of the 52 audited screens without drifting from the designs.
- **Security:** RBAC, security headers, and rate-limiting are outstanding and must be configured for production readiness.
- **Database:** Prisma schema needs to be fully defined based on the Stitch UI requirements to support the real data mapping (Zero-Fake-Data policy).

<!-- refreshed: 2026-10-01 -->
