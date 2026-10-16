# Integrations & External Services

## Backend API Endpoints
The frontend communicates with a REST API gateway via `src/lib/api-client.ts` pointing to `API_BASE_URL` (`EXPO_PUBLIC_API_URL` or fallback `http://localhost:5000`):
- `GET /api/v1/health` - Server health check
- `POST /api/v1/user/register` - Multipart form registration (username, email, password, avatar binary)
- `POST /api/v1/user/login` - JSON credentials authentication (email, password)
- `GET /api/v1/user/profile` - Authenticated user profile retrieval
- `POST /api/v1/user/logout` - Session invalidation

## Storage & Assets
- **MinIO**: Local S3-compatible object storage service (ports `9000` & `9001` configured in `docker-compose.yml`) for user avatars and game testing media artifacts.
- **PostgreSQL**: Relational database (port `5432` configured in `docker-compose.yml`) storing user profiles, tournament metadata, bug reports, and testing records.

## Authentication & State
- Token/Cookie-based auth headers handled via `apiRequest` in `src/lib/api-client.ts`.
- Future integration points: Tournament brackets, developer opportunity listings, QA bug report submissions with attachments.
