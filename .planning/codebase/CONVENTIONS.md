---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# Coding Conventions

**Analysis Date:** 2026-10-03

## Standards & Formatting

- **TypeScript**: Strict mode enabled (`strict: true`) across both `client` and `server`. No implicit `any`.
- **Formatting**: Prettier configured at root (`.prettierrc`) with 100 character print width, single quotes in JS/TS, and trailing commas where valid.
- **Linting**: ESLint 9 flat configuration across monorepo workspaces.

## Component & Design System Conventions

- **Atomic Components**: Placed in `client/src/components/ui/` with explicit props, variant classes, and dedicated unit tests (e.g. `Button.tsx` and `Button.test.tsx`).
- **Feature Sections**: Placed in `client/src/components/landing/` or related domain subdirectories.
- **Layout Consistency**: Shared chrome (navigation bars, footers, breadcrumbs) are centralized in `client/src/components/layout/` and instantiated exclusively through React Router layout routes (`<Outlet />`).
- **Color Tokens**:
  - Light Sky Blue: `#CAE8FF`
  - Primary Blue: `#5CB6F9`
  - Electric Blue: `#233DFF`
  - Deep Navy Background: `#050A30` / `#0a0f35`
  - Soft White Text: `#F7FBFF` / `#dfe0ff`
- **Typography Tokens**:
  - Headlines: `font-headline` (Space Grotesk)
  - Body: `font-body` (Plus Jakarta Sans)

## API & Server Conventions

- Routes prefixed with version identifier (`/api/v1/...`).
- Handlers return JSON response envelopes with explicit `status: "ok" | "error"`.
- Errors caught by centralized Express middleware rather than crashing the process.

---

*Codebase analysis: 2026-10-03*
