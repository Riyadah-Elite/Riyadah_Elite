# Tech Stack

**Analysis Date:** 2026-10-25

## Core Technologies & Frameworks
- **Framework**: React Native (`0.88.0`) with Expo SDK 58 (`~58.0.12`)
- **Navigation & Routing**: Expo Router (`~58.0.21`) featuring file-based routing (`src/app/`)
- **Runtime**: Node.js with React 19 (`19.3.0`) & React DOM (`19.3.0`)
- **Web Support**: React Native Web (`~0.21.4`) with platform-specific file extensions (`.web.tsx`)
- **Language**: TypeScript (`~6.0.3`) with strict compiler verification (`strict: true`)

## 3D Graphics & Animation Pipeline
- **3D Engine**: Three.js (`^0.174.0`)
- **React 3D Bindings**:
  - `@react-three/fiber` (`^9.8.2`) — Declarative Three.js scene graph for React
  - `@react-three/drei` (`^10.7.9`) — Helpers including `useGLTF`, `ContactShadows`, camera controls
- **Animation Engine**: GSAP (`^3.15.0`) — Entrance choreography, timeline management, and reduced-motion detection
- **Mobile Animation**:
  - `react-native-reanimated` (`4.7.1`)
  - `react-native-worklets` (`0.13.0`)
  - `react-native-gesture-handler` (`~3.3.0`)
  - `react-native-screens` (`~4.30.0`)

## Styling & Design System
- **Engine**: NativeWind (`^4.2.7`) with Tailwind CSS (`^3.4.19`)
- **Theme Philosophy**: Light-first esports aesthetic with high contrast text
  - Background: `#F8FCFF`
  - Deep Navy Text: `#172B3A`
  - Primary Cyan Action: `#0891B2`
  - Icy Blue Tint: `#EFF6FF`
  - Secondary Accents: Violet (`#8B5CF6`), Mint (`#D1FAE5`), Warm Orange (`#FFEDD5`)
- **UI Enhancements**:
  - `@expo/vector-icons` (`^15.0.2`) — Ionicons icon family
  - `expo-glass-effect` (`~58.0.4`) & `expo-image` (`~58.0.15`)
  - `expo-symbols` (`~58.0.4`) & `@expo/ui` (`~58.0.19`)

## Asset Processing & 3D Optimization Pipeline
- **Pipeline Scripts**: Headless pipeline located in `frontend/scripts/pipeline/`
  - `optimize-glb.js`: Node.js pipeline runner executing headless Blender and Khronos validation
  - `blender_optimize.py`: Blender 5.1 Python script performing aspect-preserved texture resizing (max 1024px)
  - `validate-gltf.js`: Khronos glTF 2.0 conformance validator inspecting binary header, chunk alignment, accessor bounds, and texture index integrity
- **Asset Savings**: 72.6% net payload reduction (102.7 MB down to 28.1 MB across all 5 models)

## Build, Tooling & Quality Assurance
- **Bundler**: Metro bundler configured with `withNativeWind` in `frontend/metro.config.js`
- **Compiler / Transpiler**: Babel with `babel-preset-expo` in `frontend/babel.config.js`
- **Linter**: ESLint 9 flat config (`frontend/eslint.config.js`) extending `eslint-config-expo`
- **Package Manager**: npm with lockfile v3 present in `frontend/package-lock.json`
