# Roadmap

## Phase 0: Landing Page & Interactive 3D Web Rebuild (Complete)
- [x] Stage A: Repository audit, safe frontend backup (`backups/frontend_backup_20261024`), asset extraction (`public/models/`), and obsolete frame removal.
- [x] Stage B: Compatible web 3D & animation foundation (Three.js, @react-three/fiber, @react-three/drei, gsap, lucide-react-native).
- [x] Stage C: Riyadah Elite theme tokens, global typography, and responsive page shell.
- [x] Stage D: Interactive 3D Hero (`HeroSection.web.tsx`, `HeroScene3D.web.tsx` with PlayStation controller, responsive staging, and native fallback).
- [x] Stage E: Full landing-page component suite (Navbar, FeatureCards, FeaturedGames, PlatformStats, GameTesting, Tournaments, Rewards, About, Community, Newsletter, Footer).
- [x] Stage F: Web & native verification (TypeScript, lint, responsive views, reduced motion, fallback handling, production web export).

## Phase 1: Authentication & Navigation Shell
- [ ] Implement Auth Screens (Login, Register with avatar picker).
- [ ] Setup Persistent Auth Context / State with session tokens.
- [ ] Establish Bottom Tab Navigation (Home, Opportunities, Tournaments, Profile).

## Phase 2: Opportunities & Bug Reporting
- [ ] Game testing opportunities list and details view.
- [ ] Bug report submission modal with category selection and attachment upload (MinIO S3).

## Phase 3: Tournament Experience
- [ ] Tournament listings, filter by game/format.
- [ ] Tournament brackets, schedules, and team registration workflow.

## Phase 4: Developer / Host Tools & Polish
- [ ] Developer feedback & bug dashboard.
- [ ] Offline caching and push notification hooks.
- [ ] End-to-end mobile testing and production build verification via EAS.
