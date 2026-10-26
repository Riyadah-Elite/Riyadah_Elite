# Testing & Validation Strategy

**Analysis Date:** 2026-10-25

## Quality Assurance Checkpoints

### 1. Static Type Checking
- **Command**: `npx tsc --noEmit` from within `frontend/`
- Validates the entire codebase against TypeScript ~6.0.3.
- Enforces strict null checks, prop typings, and module resolution across `@/*` paths.
- Current status: **0 errors**.

### 2. Linting & Code Quality
- **Command**: `npx expo lint` from within `frontend/`
- Uses ESLint 9 with `eslint-config-expo`.
- Enforces React hooks dependencies, unused imports, and modern JavaScript standards.
- Current status: **0 errors** (52 expected R3F declarative JSX property warnings).

### 3. Asset & glTF 2.0 Conformance Validation
- **Command**: `node frontend/scripts/pipeline/optimize-glb.js <input> <output>`
- Validates:
  - Magic header `glTF` and container length.
  - glTF 2.0 JSON chunk structure and specification version.
  - Accessor bounds (`min <= max`) and bufferView byte offset alignment (4-byte alignment).
  - Material and texture reference indices integrity.
- Any regression in 3D assets fails the build pipeline immediately with exit code 1.

## Future Testing Milestones
- **Unit Testing**: Implement Jest + `@testing-library/react-native` for unit testing reusable atomic primitives (`button.tsx`, `themed-text.tsx`) and hooks (`useColorScheme`, `useTheme`).
- **Service & Mock Testing**: Add tests for `apiRequest` in `src/lib/api-client.ts` with mock fetch responses covering network dropouts, 401 unauthenticated errors, and multipart form serialization.
- **End-to-End (E2E) & Visual Testing**: Playwright for web regression testing of the 4-stage hero scroll interpolation and form flows; Maestro for iOS/Android native flow verification.
