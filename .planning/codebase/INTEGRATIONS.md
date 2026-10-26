# Integrations & External Services

**Analysis Date:** 2026-10-25

## Backend API Gateway Integration
The frontend connects to the backend through a typed network layer (`frontend/src/lib/api-client.ts`) and route configuration (`frontend/src/constants/config.ts`).
- **Base Endpoint**: Configured via `process.env.EXPO_PUBLIC_API_URL`, falling back to `http://localhost:5000`.
- **Session Cookie Authentication**: Requests use `credentials: "include"` ensuring httpOnly session cookies are transmitted for web sessions.
- **Error Handling**: `ApiError` class parses non-2xx status codes and backend error payloads (`ApiErrorBody`).

### Route Endpoints (`frontend/src/constants/config.ts`)
1. **Health Verification**:
   - `GET /api/v1/health` — Checks backend microservice and database status.
2. **User Authentication & Management (`frontend/src/services/auth.ts`)**:
   - `POST /api/v1/user/register` — Accepts multipart `FormData` including `username`, `email`, `password`, and avatar binary payload.
   - `POST /api/v1/user/login` — JSON payload with credentials (`email`, `password`) returning `AuthResponse`.
   - `GET /api/v1/user/profile` — Retrieves the authenticated user object (`id`, `username`, `email`, `avatarUrl`, `role`, timestamps).
   - `POST /api/v1/user/logout` — Destroys user session on the server.

## Database & Cloud Storage Architecture (`docker-compose.yml`)
- **PostgreSQL 17 (Alpine)**:
  - Accessible on port `5432` with credentials defined in local environment.
  - Houses schemas for user accounts, tournament brackets, game playtest campaigns, bug submissions, and telemetry traces.
- **MinIO Object Storage**:
  - S3-compatible object storage service running on ports `9000` (API) and `9001` (Console).
  - Used for storing high-resolution user avatars, game test video clips, bug report screenshot attachments, and log exports.

## External Static Assets & CDNs
- **Unsplash Image CDN**: High-resolution gameplay backdrop images for featured game cards (`FeaturedGames.tsx`).
- **Local Static GLB Hosting**: Optimized 3D model assets served from `frontend/public/models/` (`ai_robot.optimized.glb`, `ps5_controller.optimized.glb`, `Sleek Plasma Sidearm.optimized.glb`, `2010_williams_fw32.optimized.glb`, `2015_bmw_3.0_csl_hommage_r_concept.optimized.glb`).
- **Google Fonts / System Fonts**: Inter, system sans-serif fonts mapped cleanly across web and native platforms in `src/constants/theme.ts`.
