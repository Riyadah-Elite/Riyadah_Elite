---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# Technology Stack

**Analysis Date:** 2026-10-03

## Core Technologies

### Languages & Runtime

- **TypeScript**: Strict typechecking (`^5.8.2` across root, client, and server)
- **Node.js**: Modern JavaScript runtime (v20+ recommended, tested on Node v24)
- **npm**: Monorepo package manager using root npm workspaces

### Monorepo Structure

- **Root**: `package.json` with npm workspaces:
  - `client` (`./client`)
  - `server` (`./server`)
- Concurrently runs development scripts (`npm run dev`)
- Root workspace-aware linting, formatting, typechecking, and testing

### Frontend (`client/`)

- **Framework**: React 19 (`react` `^19.0.0`, `react-dom` `^19.0.0`)
- **Build Tool / Bundler**: Vite (`vite` `^6.2.0`, `@vitejs/plugin-react` `^4.3.4`)
- **Routing**: React Router v7 (`react-router-dom` `^7.3.0`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` `^4.0.9`, `tailwindcss` `^4.0.9`)
- **Typography & Icons**: Google Fonts (Space Grotesk, Plus Jakarta Sans), Material Symbols Outlined
- **Graphics / Shaders**: Native Canvas 2D / WebGL shader integration (`HeroShader.tsx`)
- **Testing**: Vitest (`vitest` `^3.0.7`), `@testing-library/react` (`^16.2.0`), `@testing-library/jest-dom` (`^6.6.3`), `jsdom` (`^26.0.0`)

### Backend (`server/`)

- **Framework**: Express (`express` `^4.21.2`, `@types/express` `^5.0.0`)
- **Execution & Watcher**: `tsx` (`^4.19.3`) for high-performance TypeScript execution in dev
- **HTTP Middleware**: `cors` (`^2.8.5`), `express.json()`
- **Database ORM**: Prisma (`@prisma/client` `^6.4.1`, `prisma` `^6.4.1`)
- **Testing**: Vitest (`vitest` `^3.0.7`), `supertest` (`^7.0.0`)

---

## Build, Lint & Quality Tools

- **Type Checking**: `tsc --noEmit` across client and server
- **Linting**: ESLint flat config (`eslint` `^9.21.0`, `typescript-eslint` `^8.25.0`)
- **Code Formatting**: Prettier (`prettier` `^3.5.2`)

---

*Codebase analysis: 2026-10-03*
