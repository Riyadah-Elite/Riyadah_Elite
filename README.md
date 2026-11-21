# Play Point

> **PLAY. TEST. COMPETE.**
> One platform for gamers, developers, and esports organizers. Discover games, test new builds, report bugs, and compete in tournaments.

*(Note: Play Point was formerly developed under the engineering working name Riyadah Elite.)*

---

## Architecture Overview

Play Point is a full-stack, cross-platform gaming ecosystem composed of:

- **Frontend (`/frontend`)**:
  - React Native / Expo SDK 58 (Universal Web & Mobile).
  - React 19.3 & Expo Router typed navigation.
  - Custom tactile design system (Neumorphic / Claymorphic / Glassmorphic) styled for high-performance esports workflows.
  - Multi-role UI supporting `USER` (Gamers & QA Testers), `DEVELOPER` (Studios & Creators), `ORG` (Tournament Organizers), and `ADMIN` (Platform Operators).
- **Backend (`/backend`)**:
  - Node.js & TypeScript with InversifyJS IoC container architecture.
  - Express.js REST API with clean domain controllers (`/api/v1/user`, `/api/v1/listing`, `/api/v1/tournament`, `/api/v1/application`, etc.).
  - Prisma ORM 5 with PostgreSQL connection pooling.
  - JWT authentication with secure HTTP cookies and mobile keychain Bearer tokens.
  - MinIO / S3 object storage for build binaries, tournament badges, and screenshots.
- **Database**:
  - Managed PostgreSQL (Neon Serverless 16) with relational integrity across Users, Listings, Applications, Bug Reports, Tournaments, and Registrations.

---

## Core Capabilities

1. **Esports Tournaments**:
   - Tournament publishing and bracket management for organizers and administrators.
   - Real-time tournament registration with squad/team and individual enrollment.
   - Automated participant slot calculation and status progression (`UPCOMING`, `ONGOING`, `COMPLETED`).

2. **Game Testing & QA Intake**:
   - Game studio campaign publishing with downloadable builds and testing requirements.
   - Structured tester enrollment and application workflows.
   - Telemetry and bug intake reporting with severity ratings, affected areas, and reproduction steps.
   - Developer triage review pipeline (`PENDING`, `ACCEPTED`, `REJECTED`).

3. **Role-Based Access Control (RBAC)**:
   - Strict tier separation between Gamers (`USER`), Studios (`DEVELOPER`), Organizers (`ORG`), and Super Admins (`ADMIN`).
   - Private ownership isolation ensuring studios only manage their own campaigns and bug submissions.

4. **Security & Session Reliability**:
   - Password hashing with PBKDF2 / Bcrypt.
   - Dual-token persistence (primary `playpoint.token` with seamless backward-compatible fallback).
   - Strict input validation via Zod and class-validator.

---

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL (or Neon DB connection string)
- Python 3.10+ (for QA automation suites)

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Server boots at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npx expo start --web --port 8081
# Web app boots at http://localhost:8081
```

### 3. Verification & Auditing
```bash
# Validate Prisma schema
cd backend && npx prisma validate

# Run database referential integrity audit
cd backend && npx tsx scripts/audit_database_integrity.ts

# Export frontend production build
cd frontend && npx expo export --platform web

# Run end-to-end browser regression suite
python -u scripts/qa_stage_8.py
```
