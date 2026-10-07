# Riyadah Elite — PERN Monorepo Foundation

Clean, minimal PERN stack monorepo with GSD (Get Shit Done) integration.

## Architecture & Monorepo Structure

```text
Riyadah_Elite/
├── client/                     # Frontend (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/ui/     # Reusable atomic UI components (e.g. Button)
│   │   ├── pages/             # Route views (HomePage temporary baseline)
│   │   ├── test/              # Test setup & configuration
│   │   ├── App.tsx            # React Router setup
│   │   ├── index.css          # Tailwind CSS v4 entrypoint
│   │   └── main.tsx           # Client root mounting
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vitest.config.ts
├── server/                     # Backend (Express + TypeScript + Prisma ORM)
│   ├── prisma/
│   │   └── schema.prisma      # PostgreSQL schema baseline
│   ├── src/
│   │   ├── app.ts             # Express application & route setup
│   │   ├── app.test.ts        # Health endpoint integration test
│   │   └── index.ts           # Graceful server bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
├── docs/                       # Essential project documentation
├── .env.example                # Safe environment variable template
├── .gitignore                  # Monorepo git ignore rules
├── .prettierrc                 # Prettier configuration
└── package.json                # Root npm workspaces configuration
```

---

## Prerequisites

- **Node.js**: v20+ (tested on v24.19.0)
- **npm**: v10+ (tested on v12.0.2)
- **PostgreSQL**: Neon PostgreSQL in production, or local/remote instance for development

---

## Getting Started

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` and `DIRECT_URL` point to your PostgreSQL / Neon instance:

```env
# Neon PostgreSQL pooled connection (for application queries)
DATABASE_URL="postgresql://user:password@ep-xyz-pooler.region.aws.neon.tech/neondb?sslmode=require"

# Neon PostgreSQL direct connection (for migrations)
DIRECT_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

_Note: To apply migrations, run `npm run prisma:migrate`._

---

## Available Scripts

### Root Monorepo Scripts

- `npm run dev`: Concurrently start both client and server development servers.
- `npm run dev:client`: Start Vite development server (`http://localhost:5173`).
- `npm run dev:server`: Start Express server using `tsx` watcher (`http://localhost:5000`).
- `npm run build`: Build production assets for both client and server.
- `npm run typecheck`: Run TypeScript verification across all workspaces.
- `npm run lint`: Lint both client and server using ESLint.
- `npm run format`: Format codebase using Prettier.
- `npm run format:check`: Check formatting adherence across the repository.
- `npm run test`: Run Vitest unit & integration test suites.
- `npm run prisma:generate`: Generate Prisma Client in the server workspace.
- `npm run prisma:migrate`: Run database migrations in development.

---

## GSD (Get Shit Done) Integration

GSD is installed and verified via `@opengsd/gsd-core` (v1.15.0) in the global Antigravity environment (`~/.gemini/antigravity`).

### Workflow Capabilities

- `/gsd-new-project`: Interactive discovery, project questioning, and roadmap creation.
- `/gsd-plan-phase`: Create detailed phase plans with verification loops.
- `/gsd-execute-phase`: Execute phases with dependency-aware step parallelization.
- `/gsd-verify-work`: Conversational UAT feature verification.
- `/gsd-progress`: Progress tracking and situational next actions.
