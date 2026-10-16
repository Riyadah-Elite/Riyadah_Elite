# Project Structure

## Directory Hierarchy

```
Riyadah_Elite/
├── .planning/                  # GSD planning, codebase intelligence, and roadmap
│   └── codebase/              # Codebase maps and technical documentation
├── docker-compose.yml         # Local infrastructure services (PostgreSQL 17, MinIO)
├── README.md                  # Project overview
└── frontend/                  # React Native mobile application
    ├── app.json               # Expo project manifest & configuration
    ├── babel.config.js        # Babel compiler configuration with NativeWind
    ├── metro.config.js        # Metro bundler config with NativeWind integration
    ├── tailwind.config.js     # Tailwind CSS theme and content globs
    ├── tsconfig.json          # TypeScript path aliases (@/* -> ./src/*)
    ├── package.json           # Frontend dependencies & scripts
    └── src/
        ├── app/               # Expo Router directory
        │   ├── _layout.tsx    # Root layout & Navigation Stack
        │   └── index.tsx      # Initial screen
        ├── components/        # Reusable UI component library
        │   ├── ui/            # Atomic primitives (button.tsx)
        │   ├── themed-text.tsx
        │   └── themed-view.tsx
        ├── constants/         # Static configuration, endpoints & themes
        │   ├── colors.ts
        │   └── config.ts
        ├── hooks/             # Custom React hooks (theming, device detection)
        ├── lib/               # Shared utilities (api-client.ts, cn.ts)
        ├── services/          # Data fetching & backend interaction services (auth.ts)
        └── types/             # Shared TypeScript models and interfaces
```
