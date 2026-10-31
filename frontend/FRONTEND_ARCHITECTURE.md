# Riyadah Elite — Frontend Architecture Specification

## 1. Executive Architecture Summary

The **Riyadah Elite** frontend is built with **Expo SDK 58 (Expo Router 58)**, **React 19**, and **React Native / React Native Web**. It delivers a zero-compromise responsive cross-platform application with specialized presentation layers for:
1. **Desktop / Wide Screens ($\ge 1024\text{px}$)**: Full desktop esports operating hub with collapsible sidebar (Expanded 240px $\leftrightarrow$ Minimized 72px rail), 128Hz telemetry status, wide grid matrices, tournament bracket visualization, and multi-column inspector panes.
2. **Mobile / Handheld Screens ($< 1024\text{px}$)**: Native-feeling mobile application with sticky app header, top slide-out drawer, persistent 5-tab bottom navigation rail, swipeable filter chips, stacked card views, and touch-optimized form inputs.

Both presentation layers share a unified core of design tokens, TypeScript types, context providers, and resilient backend API service adapters.

---

## 2. Directory Structure

```
frontend/
├── src/
│   ├── app/                               # Expo Router file-based route definitions
│   │   ├── _layout.tsx                    # Root layout with AuthProvider & SafeAreaProvider
│   │   ├── index.tsx                      # Page 01: Home Dashboard
│   │   ├── tournaments/
│   │   │   ├── index.tsx                  # Page 02: Tournament Listing
│   │   │   └── [id].tsx                   # Page 03: Tournament Details
│   │   ├── games/
│   │   │   ├── index.tsx                  # Page 04: Game Testing Discovery
│   │   │   └── [id].tsx                   # Page 05: Game Details
│   │   ├── bug-report/
│   │   │   └── index.tsx                  # Page 06: Defect Submission Console
│   │   ├── notifications/
│   │   │   └── index.tsx                  # Page 07: Notifications & Dispatch Alerts
│   │   └── profile/
│   │       └── index.tsx                  # Page 08: Commander Profile & Account Settings
│   │
│   ├── desktop/                           # Desktop-optimized presentation layer
│   │   ├── components/
│   │   │   ├── DesktopSidebar.tsx         # Collapsible 240px / 72px icon rail (Wireframe 2)
│   │   │   ├── DesktopHeader.tsx          # Search bar, 128Hz telemetry, notifications, profile
│   │   │   ├── DesktopFooter.tsx          # Full responsive desktop footer (Wireframe 2)
│   │   │   ├── DesktopHero.tsx            # Cinematic esports hero with live prize pools
│   │   │   ├── DesktopTournamentCard.tsx  # Esports tournament competition card
│   │   │   ├── DesktopGameCard.tsx        # Game testing QA card
│   │   │   └── DesktopLeaderboard.tsx     # Competitive ranking leaderboard
│   │   ├── layouts/
│   │   │   └── DesktopLayout.tsx          # Fluid container with sidebar & header
│   │   └── screens/
│   │       ├── DesktopHomeScreen.tsx
│   │       ├── DesktopTournamentListScreen.tsx
│   │       ├── DesktopTournamentDetailScreen.tsx
│   │       ├── DesktopGameListScreen.tsx
│   │       ├── DesktopGameDetailScreen.tsx
│   │       ├── DesktopBugReportScreen.tsx
│   │       ├── DesktopNotificationsScreen.tsx
│   │       └── DesktopProfileScreen.tsx
│   │
│   ├── mobile/                            # Mobile-optimized presentation layer
│   │   ├── components/
│   │   │   ├── MobileHeader.tsx           # Brand header, notifications dot, menu drawer
│   │   │   ├── MobileNavigation.tsx       # 5-tab persistent bottom navigation bar
│   │   │   ├── MobileFooter.tsx           # Compact mobile footer
│   │   │   ├── MobileHero.tsx             # Touch-friendly hero banner
│   │   │   ├── MobileTournamentCard.tsx   # Stacked tournament card
│   │   │   ├── MobileGameCard.tsx         # Stacked game testing card
│   │   │   └── MobileLeaderboard.tsx      # Vertical leaderboard ranking
│   │   ├── layouts/
│   │   │   └── MobileLayout.tsx           # Mobile scrollable wrapper with safe areas
│   │   └── screens/
│   │       ├── MobileHomeScreen.tsx
│   │       ├── MobileTournamentListScreen.tsx
│   │       ├── MobileTournamentDetailScreen.tsx
│   │       ├── MobileGameListScreen.tsx
│   │       ├── MobileGameDetailScreen.tsx
│   │       ├── MobileBugReportScreen.tsx
│   │       ├── MobileNotificationsScreen.tsx
│   │       └── MobileProfileScreen.tsx
│   │
│   └── shared/                            # Unified core shared by both layouts
│       ├── api/
│       │   └── client.ts                  # Fetch client with token headers & error handling
│       ├── components/
│       │   ├── AppShell.tsx               # Breakpoint-aware shell rendering desktop or mobile
│       │   ├── AuthModal.tsx              # Tabbed Sign In / Register dialog
│       │   ├── PrimaryButton.tsx          # Neon lime/violet CTA with icons & loading state
│       │   ├── SecondaryButton.tsx        # Dark frosted surface button
│       │   ├── SectionHeader.tsx          # Consistent section title & subtitle
│       │   └── StatusBadge.tsx            # Live, Upcoming, Completed, QA Open badges
│       ├── context/
│       │   └── AuthContext.tsx            # Global session, credentials, and modal manager
│       ├── hooks/
│       │   └── useResponsive.ts           # Screen width tracking (1024px desktop breakpoint)
│       ├── services/
│       │   ├── authService.ts             # Login, register, profile, bearer token cache
│       │   ├── tournamentService.ts       # Tournament lists, detail, slot enrollment
│       │   ├── gameService.ts             # Playtest lists, detail, tester registration
│       │   ├── bugService.ts              # Defect lists, defect creation
│       │   ├── notificationService.ts     # Real-time alerts, mark as read
│       │   └── mockData.ts                # Rich offline mock fallback dataset
│       ├── theme/
│       │   ├── borders.ts
│       │   ├── colors.ts
│       │   ├── index.ts
│       │   ├── shadows.ts
│       │   ├── spacing.ts
│       │   └── typography.ts
│       └── types/
│           └── index.ts                   # Strongly-typed models matching backend schemas
```

---

## 3. Resilient Backend Integration & Graceful Fallback

Every frontend service method (`tournamentService`, `gameService`, `bugService`, `notificationService`, `authService`) follows a resilient tiered pattern:
1. Performs `apiRequest('/api/v1/...')` against the backend server.
2. If the backend is running and responds with valid data, returns live data immediately.
3. If the backend is offline, unreachable, or in development sandbox, it transparently falls back to rich, realistic mock data (`mockData.ts`).
4. **Guarantees zero UI crashes or blank screens** under any network scenario.

