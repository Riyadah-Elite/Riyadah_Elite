---
last_mapped_commit: 7f6e98c255113bb87bad69287bdcc3985d2e70d1
last_mapped_at: 2026-10-03
---
# Codebase Structure

**Analysis Date:** 2026-10-03

## Directory Organization

```text
Riyadah_Elite/
├── client/                                    # Frontend Application
│   ├── public/                                # Static public assets
│   ├── src/
│   │   ├── assets/                            # Brand logos, avatars, demo imagery
│   │   ├── components/
│   │   │   ├── landing/                       # 12 Modular landing sections (Hero, Shader, CTAs)
│   │   │   ├── layout/                        # PublicNavbar, PublicFooter, PublicLayout
│   │   │   └── ui/                            # Atomic UI primitives (Button)
│   │   ├── pages/                             # Routed views (Landing, Discovery, HowItWorks, etc.)
│   │   ├── test/                              # Vitest test setup and matchers
│   │   ├── App.tsx                            # Root route declarations with PublicLayout
│   │   ├── index.css                          # Tailwind CSS v4 directives
│   │   └── main.tsx                           # React entrypoint
│   ├── package.json                           # Client dependencies & scripts
│   ├── tsconfig.json                          # TypeScript project configuration
│   ├── vite.config.ts                         # Vite configuration
│   └── vitest.config.ts                       # Frontend test configuration
├── server/                                    # Backend Application
│   ├── prisma/
│   │   └── schema.prisma                      # PostgreSQL database schema
│   ├── src/
│   │   ├── app.ts                             # Express application configuration
│   │   ├── app.test.ts                        # Integration test for health check
│   │   └── index.ts                           # Server listener & lifecycle
│   ├── package.json                           # Server dependencies & scripts
│   ├── tsconfig.json                          # TypeScript project configuration
│   └── eslint.config.js                       # Server linting rules
├── Design_Stitch_Organized/                   # Organized Reference Library (Groups 01-09)
│   ├── 02-authentication/                     # Auth screen mockups & references
│   ├── 03-player-experience/                  # Player dashboard & match screens
│   ├── 04-developer-workspace/                # Game submission & telemetry screens
│   ├── 05-tournament-host/                    # Tournament management screens
│   ├── 06-internal-admin/                     # Admin & executive command centers
│   ├── 07-shared-assets/                      # Badges, tokens & icons
│   ├── 08-documentation/                      # DESIGN.md and screen mappings
│   └── 09-unclassified/                       # Miscellaneous references
├── docs/                                      # Monorepo technical documentation
├── .env.example                               # Monorepo environment configuration template
├── package.json                               # Monorepo root workspaces config
└── README.md                                  # Setup, architecture & GSD instructions
```

## Key File Locations & Entrypoints

- Frontend Router: `client/src/App.tsx`
- Layout Component: `client/src/components/layout/PublicLayout.tsx`
- Public Navbar: `client/src/components/layout/PublicNavbar.tsx`
- Server App Entry: `server/src/app.ts`
- Database Schema: `server/prisma/schema.prisma`

---

*Codebase analysis: 2026-10-03*
