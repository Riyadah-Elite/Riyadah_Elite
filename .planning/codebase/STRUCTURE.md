# Project Structure

**Analysis Date:** 2026-10-25

## Repository Organization

```
Riyadah_Elite/
├── .planning/                  # Project planning, state, roadmap, and codebase intelligence
│   ├── codebase/              # 7-document codebase map (Architecture, Stack, Conventions, etc.)
│   ├── onboarding/            # Onboarding summary and history
│   ├── PROJECT.md             # Project scope, business goals, and principles
│   ├── REQUIREMENTS.md        # Functional and technical requirements
│   ├── ROADMAP.md             # Development phases and milestones
│   └── STATE.md               # Current implementation state and next steps
├── docker-compose.yml         # Local containerized infrastructure (PostgreSQL 17, MinIO)
├── README.md                  # Root documentation
└── frontend/                  # Cross-platform Expo SDK 58 application
    ├── app.json               # Expo project manifest & mobile metadata
    ├── babel.config.js        # Babel configuration for Expo & NativeWind
    ├── eslint.config.js       # ESLint 9 flat configuration
    ├── metro.config.js        # Metro bundler config with NativeWind preset
    ├── package.json           # Dependencies, devDependencies, and run scripts
    ├── package-lock.json      # Locked npm dependencies (v3 format)
    ├── tailwind.config.js     # Tailwind CSS theme extension & content paths
    ├── tsconfig.json          # TypeScript compiler options and '@/*' alias
    ├── public/                # Static public assets served to web clients
    │   ├── models/            # 3D GLTF/GLB models (raw, optimized, and staging)
    │   │   ├── ai_robot.optimized.glb
    │   │   ├── ps5_controller.optimized.glb
    │   │   ├── Sleek Plasma Sidearm.optimized.glb
    │   │   ├── 2010_williams_fw32.optimized.glb
    │   │   └── 2015_bmw_3.0_csl_hommage_r_concept.optimized.glb
    │   └── *.png              # Visual audit and screenshot previews
    ├── scripts/
    │   ├── reset-project.js   # Script to reset project back to blank template
    │   └── pipeline/          # 3D asset optimization pipeline
    │       ├── blender_optimize.py   # Headless Blender 5.1 texture resizer & exporter
    │       ├── optimize-glb.js       # Node.js pipeline orchestration script
    │       └── validate-gltf.js      # Khronos glTF 2.0 conformance validator
    └── src/
        ├── global.css         # Tailwind base, components, and utilities
        ├── app/               # Expo Router file-based routes
        │   ├── _layout.tsx    # Root layout, ThemeProvider, and safe area setup
        │   └── index.tsx      # Main landing view router
        ├── components/
        │   ├── 3d/            # Three.js 3D scene and model components
        │   │   ├── HeroScene3D.web.tsx  # 4-stage cinematic nexus camera & scene
        │   │   └── RobotModel.web.tsx   # Isolated robot model loader
        │   ├── landing/       # Modular landing page sections
        │   │   ├── About.tsx            # Mission, Vision, Pillars & Architecture
        │   │   ├── Community.tsx        # Discord & Social channels
        │   │   ├── FeatureCards.tsx     # 3 Value propositions
        │   │   ├── FeaturedGames.tsx    # Curated game showcase cards
        │   │   ├── Footer.tsx           # Platform footer & navigation
        │   │   ├── GameTesting.tsx      # QA testing pipeline & bounties
        │   │   ├── HeroSection.tsx      # Native mobile hero fallback
        │   │   ├── HeroSection.web.tsx  # Web 3D hero with GSAP entrance
        │   │   ├── Navbar.tsx           # Glassmorphism header & drawer
        │   │   ├── Newsletter.tsx       # Developer & tester digest
        │   │   ├── PlatformStats.tsx    # Ecosystem metrics strip
        │   │   ├── Rewards.tsx          # Contributor compensation
        │   │   └── Tournaments.tsx      # Championship listings & prize pools
        │   ├── ui/            # Atomic primitives (button.tsx)
        │   ├── themed-text.tsx
        │   └── themed-view.tsx
        ├── constants/
        │   ├── config.ts      # API endpoints & environment constants
        │   └── theme.ts       # Color tokens, typography, and spacing
        ├── hooks/
        │   ├── use-color-scheme.ts      # Mobile color scheme hook
        │   ├── use-color-scheme.web.ts  # Web color scheme hook with class sync
        │   └── use-theme.ts             # Theme access hook
        ├── lib/
        │   ├── api-client.ts  # Typed fetch client with error handling
        │   └── cn.ts          # clsx + tailwind-merge helper
        ├── services/
        │   └── auth.ts        # Authentication methods (login, register, profile)
        └── types/
            └── auth.ts        # TypeScript interfaces for users & auth tokens
```
