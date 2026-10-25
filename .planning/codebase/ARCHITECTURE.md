# Architecture

**Analysis Date:** 2026-10-25

## System Overview
Riyadah Elite is a premier regional gaming, playtesting, and tournament ecosystem. The frontend is built on a modern hybrid architecture using React Native with Expo SDK 58, targeting both Web (via React Native Web + Three.js) and Native iOS/Android apps with a unified codebase.

```mermaid
graph TD
    subgraph Client [Frontend App (Expo SDK 58 / React 19)]
        Layout[RootLayout _layout.tsx] --> Home[HomeScreen index.tsx]
        Home --> WebHero[HeroSection.web.tsx]
        WebHero --> ThreeCanvas[Three.js Canvas]
        ThreeCanvas --> NexusScene[HeroScene3D.web.tsx - 4-Stage Camera]
        NexusScene --> Models[Optimized GLB Assets]
        Home --> LandingSections[Landing Components: About, Games, QA, Tournaments...]
        LandingSections --> Services[Services Layer: auth.ts]
        Services --> ApiClient[api-client.ts]
    end

    subgraph Backend [Backend Infrastructure]
        ApiClient -->|REST JSON / Multipart| Express[Express API Gateway :5000]
        Express --> Postgres[(PostgreSQL 17 :5432)]
        Express --> MinIO[(MinIO Object Storage :9000)]
    end
```

## Architectural Layers

### 1. Root Layout & Routing Layer (`frontend/src/app/`)
- **File-Based Routing**: Powered by Expo Router (`expo-router/entry`).
- **`_layout.tsx`**: Sets up `SafeAreaProvider`, `ThemeProvider` (with dark/light theme persistence), and configures NativeWind web compatibility flags (`darkMode: 'class'`).
- **`index.tsx`**: Detects current platform (`Platform.OS === 'web'`). Renders standard responsive web layout on browsers with smooth scrolling, and scrollable container on native mobile devices.

### 2. 4-Stage Cinematic 3D Nexus System (`frontend/src/components/3d/` & `landing/`)
The centerpiece of the landing experience is a scroll-controlled 3D scene:
- **Stage 1: Arrival (0.00 – 0.20)**: Eye-level heroic framing of the central AI playtest robot inside a luminous cyan portal torus. Negative space preserved on left for title and call-to-actions.
- **Stage 2: Discovery (0.20 – 0.45)**: Camera moves forward and pans right, revealing the secondary floating gaming artifacts (PS5 DualSense Controller and Sleek Plasma Sidearm in orbital paths).
- **Stage 3: Ecosystem (0.45 – 0.75)**: Camera pulls back and elevates into a wide panoramic view showing the multi-tier platform, cybernetic disc, and crystalline halo.
- **Stage 4: Transition (0.75 – 1.00)**: Soft top-down perspective blending the 3D scene smoothly into the `#features` section below.
- **Deterministic Camera Interpolation**: Uses delta-timed Three.js `lerp` and `damp` functions, ensuring flawless camera interpolation when scrolling downwards or upwards.

### 3. Component Architecture & Section Rhythm
Each section addresses a core business capability:
1. `Navbar.tsx`: Sticky navigation with glassmorphism, responsive mobile hamburger drawer, and auth modal entry points.
2. `HeroSection.web.tsx`: Orchestrates the Three.js canvas, GSAP entrance choreography, and stage indicator pill.
3. `FeatureCards.tsx`: Core value propositions (Tournament Engine, Telemetry Feedback, Studio Matchmaking).
4. `FeaturedGames.tsx`: Showcase of titles under active test (Aegis Protocol, Ascent, Apex Formula).
5. `PlatformStats.tsx`: Platform health and activity metrics (45K+ testers, 180+ tournaments, 12K+ verified bugs).
6. `GameTesting.tsx`: Structured QA pipeline explanation and active bounty cards.
7. `Tournaments.tsx`: Esports tournament schedules, formats, and guaranteed prize pools.
8. `Rewards.tsx`: Contributor incentives, payout channels, and hardware gear rewards.
9. `About.tsx`: Editorial narrative featuring 4 Core Pillars (Mission, Vision, Studio Partnership, Community Integrity) and 4 Architectural Milestones.
10. `Community.tsx`: Discord, Twitter/X, Twitch, and regional developer guild integrations.
11. `Newsletter.tsx`: Playtest announcements and developer digest subscription.
12. `Footer.tsx`: Legal disclaimers, navigation links, and copyright notices.

### 4. Client State & Service Abstractions
- Network requests are encapsulated inside `src/services/` (e.g., `auth.ts`).
- `src/lib/api-client.ts` centralizes `fetch`, credential transmission, error response parsing, and HTTP status verification.
