# Riyadah Elite — Mobile Frontend

This is the cross-platform mobile frontend for **Riyadah Elite** (Game Testing & Tournaments), built with **React Native 0.88**, **Expo SDK 58**, **Expo Router**, and **NativeWind (Tailwind CSS v4)**.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [npm](https://www.npmjs.com/) (or `bun` / `pnpm` / `yarn`)
- (Optional for mobile preview) [Expo Go](https://expo.dev/go) app installed on your physical device (iOS or Android), or an Android Studio Emulator / iOS Simulator (macOS only).

---

## Quick Start / How to Run

### 1. Install Dependencies

Navigate into the `frontend` folder and install packages:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables (Optional)

By default, the app looks for the backend API at `http://localhost:5000`.

To change this (e.g. when testing on a physical phone using your machine's local Wi-Fi IP):
Create a `.env` file inside `frontend/`:

```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000
```

> **Note:** On a physical phone, `localhost` refers to the mobile device itself. Use your machine's LAN IP address (e.g. `http://192.168.1.50:5000`).

### 3. Start the Development Server

You can run any of the following commands:

```bash
# Start dev server (Expo Metro bundler)
npm run dev
# or
npm start
# or
npx expo start
```

### 4. Open the App

Once the development server starts, a QR code and interactive menu will appear in your terminal:

- **Web Browser**: Press <kbd>w</kbd> (or run `npm run web`) to launch in your browser.
- **Android Device / Emulator**: Press <kbd>a</kbd> (or run `npm run android`).
- **iOS Simulator**: Press <kbd>i</kbd> (or run `npm run ios`).
- **Physical Phone with Expo Go**: Scan the QR code shown in the terminal using the Expo Go app (Android) or the Camera app (iOS).

---

## Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Expo dev server (Metro bundler) |
| `npm start` | Alias to start the Expo dev server |
| `npm run web` | Starts the app directly in the web browser |
| `npm run android` | Starts the app and opens the Android emulator |
| `npm run ios` | Starts the app and opens the iOS simulator |
| `npm run lint` | Runs `expo lint` for code quality checks |
| `npx tsc --noEmit` | Runs TypeScript type checking |

---

## Project Architecture & Routing

- **Routing (`src/app/`)**: File-based routing powered by [Expo Router](https://docs.expo.dev/router/introduction).
  - `src/app/_layout.tsx`: Root layout provider, theme container, and stack navigation.
  - `src/app/index.tsx`: Initial entry screen.
- **Components (`src/components/`)**: Reusable UI components styled with NativeWind.
- **Services (`src/services/`)**: API integration modules (e.g., `auth.ts`).
- **Constants (`src/constants/`)**: API route endpoints and color definitions.
- **Lib (`src/lib/`)**: Shared utilities like `api-client.ts` and `cn.ts`.

---

## Troubleshooting

- **Clear Metro Bundler Cache**:
  ```bash
  npx expo start -c
  ```
- **Diagnose Dependency Issues**:
  ```bash
  npx expo-doctor
  ```
