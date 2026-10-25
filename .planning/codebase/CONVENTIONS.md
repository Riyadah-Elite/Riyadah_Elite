# Coding Conventions & Standards

**Analysis Date:** 2026-10-25

## File Organization & Naming
- **Routes**: Kebab-case and underscored layouts inside `src/app/` (`_layout.tsx`, `index.tsx`).
- **Components**: PascalCase for React component files (`Navbar.tsx`, `HeroSection.web.tsx`, `About.tsx`, `HeroScene3D.web.tsx`).
- **Platform Variants**: Use React Native platform extensions:
  - `.web.tsx` for web-exclusive implementations (DOM APIs, window events, Three.js `<Canvas>`, GSAP context).
  - `.tsx` for universal / mobile-safe fallbacks.
- **Utilities & Hooks**: Kebab-case (`api-client.ts`, `cn.ts`, `use-color-scheme.ts`, `use-color-scheme.web.ts`).
- **Module Aliasing**: Use `@/*` pointing to `./src/*` configured in `tsconfig.json`.

## TypeScript & Type Safety
- Strict type-checking enabled (`"strict": true` in `tsconfig.json`).
- Centralized type contracts in `src/types/` (e.g., `auth.ts` defining `User`, `LoginInput`, `RegisterInput`, `AuthResponse`, `ApiErrorBody`).
- Type imports use `import type { ... }`.
- Functional components declare explicit prop interfaces (`interface HeroScene3DProps { scrollProgress?: number; isMobile?: boolean }`).

## Styling & Theme System
- **Utility Classes**: NativeWind v4 with Tailwind CSS utilities (`className="..."`).
- **Theme Tokens**: Standardized color palette defined in `tailwind.config.js` and `src/constants/theme.ts`:
  - `brand-bg`: `#F8FCFF`
  - `brand-text`: `#172B3A`
  - `brand-muted`: `#5B7083`
  - `brand-cyanAction`: `#0891B2`
  - `brand-cyanPale`: `#A5F3FC`
  - `brand-blueLight`: `#EFF6FF`
  - `brand-violet`: `#8B5CF6`
- **Class Merging**: `cn(...)` utility helper in `src/lib/cn.ts` wrapping `clsx` and `tailwind-merge`.

## 3D Graphics & Animation Conventions
- **Declarative Three.js**: Three.js meshes and groups wrapped in `@react-three/fiber` components.
- **Render Loop**: All per-frame calculations (camera lerp, model floating, rotations) executed inside `useFrame((state, delta) => { ... })` using frame delta to guarantee frame-rate independence.
- **Model Loading**: Always use `useGLTF` with corresponding top-level `useGLTF.preload('/models/...')` to prevent render stalls.
- **Reduced Motion**: Respect system motion preferences by checking `window.matchMedia('(prefers-reduced-motion: reduce)')` before initializing GSAP timelines.
- **Performance Constraints**: Statically verified GLB payloads (<14 MB combined hero bundle), clamped DPR `dpr={[1, 1.5]}`, and automatic mobile downscaling.
