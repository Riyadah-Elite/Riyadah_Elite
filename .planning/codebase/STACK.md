# Tech Stack

## Core Technologies
- **Mobile Framework**: React Native (0.88.0) with Expo SDK 58 (~58.0.12)
- **Navigation & Routing**: Expo Router (~58.0.21) with file-based routing (`src/app/`)
- **Styling**: NativeWind (`^4.2.7`) with Tailwind CSS (`^3.4.19`)
- **Language**: TypeScript (`~6.0.3`) / Strict typechecking enabled
- **UI & Animation**:
  - React Native Reanimated (`4.7.1`)
  - React Native Gesture Handler (`~3.3.0`)
  - React Native Screens (`~4.30.0`)
  - Expo UI (`~58.0.19`) & Expo Symbols (`~58.0.4`)
  - Expo Glass Effect (`~58.0.4`) & Expo Image (`~58.0.15`)
- **Runtime**: Node.js with React 19 (`19.3.0`) & React DOM (`19.3.0`)

## Backend & Database Infrastructure (Repo Context)
- **Database**: PostgreSQL 17 Alpine (`docker-compose.yml`)
- **Object Storage**: MinIO S3-compatible object storage (`docker-compose.yml`)
- **API Target**: Node / Express backend expected at `http://localhost:5000` (`EXPO_PUBLIC_API_URL`)

## Build & Tooling
- **Build System**: Expo CLI (`expo start`), EAS (Expo Application Services) support
- **Package Manager**: npm (lockfile v3 present in `frontend/`)
- **Transpiler**: Babel with `babel-preset-expo` and `nativewind/babel`
- **Bundler**: Metro bundler configured with NativeWind (`withNativeWind`)
