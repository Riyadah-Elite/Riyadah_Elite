---
last_mapped_at: 2026-10-01
last_mapped_commit: 59deb3f8b11438711eec961580dd8e1dd5b32c02
---
# Conventions

**Analysis Date:** 2026-10-01

## Code Style

- **TypeScript:** Strict mode enabled. Avoid `any`.
- **Formatting:** Prettier.
- **Linting:** ESLint standard configuration.

## Naming Conventions

- **Components:** PascalCase (e.g., `TournamentCard.tsx`).
- **Files/Folders (Backend):** kebab-case (e.g., `user-service.ts`).
- **Files/Folders (Frontend):** kebab-case for directories, standard Next.js conventions (`page.tsx`, `layout.tsx`).

## Architectural Conventions

- **Zero-Fake-Data:** UIs must display actual data or explicitly empty states (e.g., "No tournaments available").
- **Google Stitch Compliance:** UIs must faithfully reproduce the Stitch designs without creative deviation.
- **Business Logic:** Must be encapsulated in `backend/src/services`.
- **Validation:** Use Zod schemas defined in the `shared/` workspace for both frontend payloads and backend validation.

<!-- refreshed: 2026-10-01 -->
