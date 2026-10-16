# Concerns & Technical Debt

## Critical Architectural Considerations

1. **Git Sparse Checkout Active**:
   - The workspace currently has sparse checkout enabled restricting local files to `frontend/`.
   - The remote repository contains backend services (`server/` with Prisma migrations, auth routes, developer/host/player routes) which are currently excluded from the local working directory.
   - Any full-stack feature development or end-to-end integration testing against the backend will require either broadening the sparse-checkout patterns or running the backend containerized.

2. **Incomplete Client Screens**:
   - The frontend was recently rewritten into React Native / Expo SDK 58. Currently, only the baseline `index.tsx` screen and `auth.ts` service exist.
   - Tournament, player opportunity, bug reporting, and host management screens from the original specification need to be re-implemented.

3. **Backend Service Mocking / Availability**:
   - `API_BASE_URL` points to `http://localhost:5000` by default. When testing on physical mobile devices, `localhost` resolves to the phone itself. Developers must configure `EXPO_PUBLIC_API_URL` to point to their machine's LAN IP address or a hosted staging environment.

4. **Security & Credential Management**:
   - Verify that all `.env` and environment variables intended for `EXPO_PUBLIC_*` do not expose sensitive API keys or credentials, as they are inlined into client-side JS bundles.
