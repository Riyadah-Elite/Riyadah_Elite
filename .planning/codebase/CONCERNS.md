# Concerns & Technical Debt

**Analysis Date:** 2026-10-25

## Technical Considerations & Risk Areas

### 1. Git Sparse-Checkout Scope
- **Issue**: The local repository checkout is in sparse-checkout mode covering `frontend/`.
- **Impact**: Backend code (`server/`), database seeds, Prisma schemas, and Docker backend containers reside in the wider repository or on remote.
- **Remediation**: Frontend developers can develop autonomously with mock responses or point `EXPO_PUBLIC_API_URL` to a deployed staging backend or local Docker instance.

### 2. WebGL Performance on Lower-End Devices
- **Issue**: The 3D Nexus uses Three.js with multiple meshes, contact shadows, and three preloaded GLB models.
- **Current Mitigations**:
  - Clamped DPR `[1, 1.5]` to avoid 3x retina over-rendering.
  - Assets strictly optimized from 102.7 MB down to 28.1 MB total (hero payload <14 MB).
  - Headless Khronos glTF 2.0 conformance validator in place.
- **Recommendations**: Continue monitoring frame times; provide a static CSS hero fallback for low-power or WebGL-unsupported environments.

### 3. Modal / Navigation Flow Completion (Phase 1 Target)
- **Issue**: The Navbar "Sign In" and "Join Now" CTA buttons currently display alert prompts linking to the underlying endpoints (`/api/v1/user/login` and `/api/v1/user/register`).
- **Next Phase**: Phase 1 is scheduled to build interactive authentication modals, persistent auth token state, and authenticated user navigation drawers.

### 4. ESLint R3F JSX Warnings
- **Issue**: ESLint flags `@react-three/fiber` declarative props (e.g., `position`, `rotation`, `intensity`, `args`) as unknown DOM properties (`react/no-unknown-property`).
- **Remediation**: Configure `eslint-plugin-react` `ignore` list for standard Three.js R3F element attributes to achieve zero warnings.
