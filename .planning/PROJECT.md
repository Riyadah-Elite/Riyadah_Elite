# Riyadah Elite (رياضة إليت)

**Unified Gaming & Esports Ecosystem for Players, Studios, and Tournament Organizers**

## Executive Overview
Riyadah Elite is a modern PERN-stack competitive gaming and playtesting platform built for the Saudi/GCC and broader international gaming ecosystem. It connects:
1. **Players / Testers**: Discover upcoming games, participate in verified playtesting, submit structured bug telemetry, and compete in esports tournaments.
2. **Game Developers / Studios**: Submit builds (Unreal Engine, Unity, WebGL), launch targeted playtest campaigns, reward reproduction reports, and review gameplay analytics.
3. **Tournament Organizers**: Host esports events, generate brackets, verify participant registration, and manage fair prize distribution.
4. **Platform Operations**: Internal administration workspaces for trust & safety, verification, arbitration, and platform health.

## Core Technical Foundation
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 layout pattern (deployed on Render).
- **Backend**: Node.js, Express, TypeScript, REST API (`/api/v1/...`) (deployed on Render).
- **Database**: Neon PostgreSQL with Prisma ORM (`DATABASE_URL` pooled, `DIRECT_URL` direct).
- **Architecture**: Monolithic full-stack monorepo (`client/` and `server/` workspaces).
- **Visual Design Reference**: Google Stitch Design Archive (`Design_Stitch_Organized/` groups 01–09).
- **Core Visual Tokens**: Dark cyber tactical theme (`#050A30`, `#0A0F35`), Electric Blue (`#233DFF`), Primary Sky Blue (`#5CB6F9`), Soft White (`#DFE0FF`).

## Guiding Principles & Non-Negotiables
- **Zero Fake Data**: Never hardcode fake user sessions, simulated login completions, fake transaction histories, or fabricated tournament telemetry. Clear distinction between loading, successful record set, empty state, network error, and unauthenticated/unauthorized states.
- **Truth in Localization**: Saudi/GCC market alignment using authentic currency labeling (SAR / USD, never unintended foreign currency symbols) and real verification workflows.
- **Security & Integrity**: Passwords hashed securely using industry-standard algorithms (bcrypt/argon2); cryptographic randomness for reset tokens; strict schema validation with Zod; zero credentials leaked in logs or client bundles.
