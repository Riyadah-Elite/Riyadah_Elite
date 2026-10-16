# Coding Conventions & Standards

## Code Style & Formatting
- **File Naming**: Kebab-case for utility, hooks, and component files (e.g., `api-client.ts`, `themed-text.tsx`, `use-color-scheme.ts`).
- **Module Aliasing**: Use `@/*` pointing to `./src/*` configured in `tsconfig.json`. Avoid deep relative paths like `../../components/`.
- **TypeScript Conventions**:
  - Strict type checking enabled (`strict: true` in `tsconfig.json`).
  - Interface and type definitions partitioned inside `src/types/`.
  - Type-only imports used when applicable (`import type { ... } from '@/types/auth'`).

## Styling Standards
- **NativeWind & Tailwind CSS**: Utility-first styling via `className` props.
- **Theme Support**: Dynamic theme handling supporting light/dark color schemes using `useColorScheme` and conditional utility classes (`dark:...`).
- **Class Merging**: Use `cn(...)` utility helper (`clsx` + `tailwind-merge`) when composing conditional styling classes.

## Expo & React Native Best Practices
- Keep route files in `src/app/` strictly focused on page presentation and screen parameters.
- Business logic, network requests, and data transformations should live in `src/services/` or custom hooks.
- Follow Expo SDK 58 conventions; use Continuous Native Generation (do not manually modify `ios/` or `android/` folders).
