# Testing Strategy

## Current Testing Setup
- **Type Checking**: Run `npx tsc --noEmit` within `frontend/` to validate full project typings against TypeScript 6.0+.
- **Linting**: Run `npx expo lint` for ESLint verification.
- **Dependency Diagnostics**: Run `npx expo-doctor` to ensure native dependencies and configuration flags match Expo SDK 58 standards.

## Testing Roadmap & Guidelines
- **Unit & Component Testing**: Setup Jest / React Native Testing Library for critical UI components and hooks (`themed-text`, custom hooks, button interactions).
- **Service Integration Tests**: Mock `fetch` / `apiRequest` to test authentication flows, error parsing, and serialization.
- **End-to-End (E2E) Testing**: Plan for Maestro or Detox for mobile workflow regression testing (e.g., login, onboarding, tournament browsing).
