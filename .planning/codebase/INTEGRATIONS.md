---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Integrations

**Analysis Date:** 2026-10-01

## External APIs & Services

- **Google Stitch:** Source of truth for UI/UX (MCP connection configured). Project ID: `8345456905560020712`.
- **Database:** PostgreSQL (Self-hosted in dev via Docker, managed in prod).
- **Caching & Queue:** Redis (Self-hosted in dev via Docker, managed in prod).

## Planned/Required Integrations

- Authentication: Clerk, Supabase Auth, or similar (TBD based on Stitch mockups).
- Payment Gateway (if applicable).
- Email delivery (if BullMQ workers dispatch emails).

<!-- refreshed: 2026-10-01 -->
