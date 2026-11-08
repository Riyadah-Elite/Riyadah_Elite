# Riyadah Elite — Next-Gen Competitive Gaming & Structured Playtesting Ecosystem

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo-v52-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-Web-61DAFB.svg)](https://necolas.github.io/react-native-web/)
[![Tests](https://img.shields.io/badge/Tests-13%20Passing-brightgreen.svg)](https://nodejs.org/api/test.html)

**Riyadah Elite** is a premier esports, game playtesting, and competitive tournament ecosystem built for high-performance web and mobile runtimes. It seamlessly bridges game developers with competitive players, providing structured bug reporting, high-tick-rate replay telemetry, sanctioned tournament brackets, and escrow bounty rewards.

---

## 🏛 Architecture Overview

### 1. Universal Cross-Platform Primitives
Built on React Native + Expo Router using custom universal primitives (`View`, `Text`, `Pressable`, `Image`, `TextInput`, `SafeAreaView`) located in `src/components/primitives.tsx`. Every screen compiles seamlessly to:
- **Web (Expo Web / React Native Web / Vite / Next.js compatible)**
- **iOS & Android native targets**

### 2. 14 Sequential Cinematic Public Landing Sections
The public landing page features 14 sequential cinematic sections with distinct motion profiles:
1. **Section 01 · Hero WebGL Arena:** Interactive 3D arena with Three.js Timer delta synchronization and 3-stage scroll scrubber (`01 Discover` → `02 Test` → `03 Compete`).
2. **Section 02 · About Tri-Region Ecosystem:** High-res raster map showing MENA, Europe, and Asia low-latency routing.
3. **Section 03 · Four Foundational Pillars:** Core platform value propositions.
4. **Section 04 · Industry Problem Landscape:** The gap between amateur gaming and verified QA telemetry.
5. **Section 05 · The Riyadah Elite Solution:** Automated telemetry collection and escrow bounty rewards.
6. **Section 06 · How It Works (Step-by-Step):** Interactive operative progression timeline.
7. **Section 07 · Feature Matrix & Specifications:** Detailed feature breakdowns.
8. **Section 08 · Games & Playtesting Catalog:** Filterable catalog of verified and active playtesting titles.
9. **Section 09 · Competitive Tournament Circuits:** Live and upcoming sanctioned tournaments.
10. **Section 10 · Global Rankings & Podium:** Top-3 podium cards and verified tester rankings.
11. **Section 11 · Community & Character Cast:** 6 original Riyadah Elite operative characters.
12. **Section 12 · FAQ Knowledge Hub:** Interactive accordion answering common platform questions.
13. **Section 13 · Final Horizon Portal:** High-voltage CTA gateway into the NEXUS operating platform.
14. **Section 14 · Footer & System Telemetry:** System status, legal disclosures, and ecosystem links.

### 3. Authenticated NEXUS Workspace
Full-featured operative operating platform matching Google Stitch specifications:
- **Dashboard Hub (`/dashboard`):** High-voltage Hero banner ("Play. Test. Win."), active operative node preview, dual-track stats ticker, cohort capacity meter, and quick-action shortcuts.
- **Bug Reporting Workbench (`/bug-report`):** Engine/build selector, 4-tier classification chips, dynamic reproduction steps builder, expected vs. actual comparison, automated hardware telemetry stamp, SHA-256 crash log receipt generator, and floating glassmorphic dispatch toast.
- **Dev ↔ QA Collaboration Studio (`/chat`):** Split-screen workbench featuring Unreal Engine 5.4.1 replay simulation with frame scrubber (`0412 / 1200`), spatial bounding box reticle, 3 SVG telemetry sparkline cards, and a docked messaging drawer with C++ syntax blocks and attachment downloads.
- **Tournament Discovery (`/tournaments`):** Filter tabs (Open, Live, Completed), prize pool badges, search filter, secondary region/game filter strip, Squad Registration modal, and Sanctioned Circuit Rulebook modal.
- **Tournament Bracket Engine (`/bracket-viewer`):** 4-stage interactive tree (Round of 16 → Quarterfinals → Semifinals → Grand Finals) with interactive Match Details drawer.
- **Operative Profile Dossier (`/profile`):** Callsign banner, Scrim & Telemetry Ready interactive toggle switch, Escrow Bounty Wallet ($4,850 USD) with Deposit/Withdrawal modals, hardware rig specifications, and verified accolades grid.
- **Telemetry Notifications (`/notifications`):** Filter tabs (All, Tournaments, QA Bounties, Builds), cyan pulse indicators, "Mark all read" action, zero-inbox state, and top navigation bar bell anchor popover.
- **Dual-Track Leaderboard (`/leaderboard`):** Toggle between active Top-3 podium and pre-season ghost silhouette empty state.
- **Authentication Enclave (`/auth`):** 3-panel artboard covering Sign In (Modal A), Register with division assignment (Modal B), and 2FA Biometric WebAuthn & 6-digit TOTP input (Modal C).

### 4. Strict 7-Color Design System
All styling strictly adheres to the official locked Riyadah Elite color palette:
- **Obsidian (`#0B0D12`):** Main backgrounds, page canvas (`--bg-canvas`), Hero arena.
- **Midnight Navy (`#11141C`):** Secondary section surfaces (`--bg-surface`), table shells, and sidebars.
- **Deep Slate (`#181C26`):** Cards, panels, modal boxes, and claymorphic containers (`--bg-card`).
- **Electric Violet (`#8B5CF6`):** Primary brand accent (`--accent-primary`), glowing highlights, and active borders.
- **Bright Cyan (`#22D3EE`):** Secondary accent (`--accent-secondary`), live telemetry pings, and status badges.
- **Electric Blue (`#3B82F6`):** Tertiary accents (`--accent-tertiary`), buttons, and links.
- **Crisp White (`#F8FAFC`):** Primary typography (`--text-primary`) and high-contrast labels.

---

## 🚀 Development & Scripts

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation
```bash
cd frontend
npm install
```

### Local Development Server
```bash
npm start
# or
npx expo start --web
```
Opens the interactive web application at `http://localhost:8081`.

### Type Checking
```bash
npx tsc --noEmit
```
Performs strict TypeScript verification across all routes and components with zero errors.

### Automated Test Battery
```bash
npm test
```
Executes the comprehensive automated unit and integration test suite (13 test suites covering business rules, token enforcement, asset integrity, and SEO metadata).

### Production Web Export
```bash
npx expo export --platform web
```
Exports optimized production web bundles into `dist/` ready for hosting on Netlify, Vercel, or AWS S3 / CloudFront.

---

## 📁 Directory Structure

```
frontend/
├── assets/                 # High-resolution raster images, icons, and diagrams
├── src/
│   ├── app/                # Expo Router file-based route definitions
│   │   ├── _layout.tsx     # Root web and native layout shell
│   │   ├── index.tsx       # Landing page mount point
│   │   ├── auth/           # Operative authentication & 2FA routes
│   │   ├── dashboard/      # NEXUS operative dashboard hub
│   │   ├── games/          # Game testing library & detail routes
│   │   ├── tournaments/    # Competitive tournament circuit routes
│   │   ├── bracket-viewer/ # Interactive 4-stage tournament bracket engine
│   │   ├── bug-report/     # Defect reporting & crash receipt generator
│   │   ├── chat/           # Dev ↔ QA replay studio & collaboration bridge
│   │   ├── leaderboard/    # Dual-track ladder & ranking podium
│   │   ├── notifications/  # Telemetry alert popover & notification feed
│   │   └── profile/        # Player dossier, hardware specs & escrow wallet
│   ├── components/
│   │   ├── common/         # Common shell components (Header, Sidebar, Modals)
│   │   ├── landing/        # Cinematic landing page sections
│   │   ├── nexus/          # Modular NEXUS workspace views
│   │   ├── three/          # Three.js WebGL arena canvas & Timer timekeeping
│   │   ├── seo/            # Dynamic JSON-LD structured data & metadata
│   │   └── primitives.tsx  # Universal cross-platform React Native primitives
│   ├── landing/            # Landing page controller & section sequencer
│   ├── styles/             # Modular CSS effects & surface animations
│   ├── theme/              # Official 7-color token definitions
│   └── utils/              # Business rules, validation & telemetry algorithms
├── package.json
└── tsconfig.json
```

---

## 🔒 Security & Performance Guarantees
- **Zero Legacy Tokens:** Validated against obsolete lime (`#b1f733`) and mint (`#45dfa4`) tokens.
- **Strict Content Security:** All SVG assets and raster graphics verified for dimensions, aspect ratios, and format standards.
- **Universal Primitives:** No raw unstyled HTML elements outside universal primitive wrappers.
- **High-Tick Netcode:** Simulates 128Hz netcode tick rates with low-latency telemetry ingestion.

---

## 📄 License
Proprietary & Confidential — **Riyadah Elite**. All rights reserved.
