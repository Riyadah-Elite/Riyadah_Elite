# Project: Riyadah Elite (Game Testing & Tournament Platform)

## Overview
Riyadah Elite is an esports and gaming platform dedicated to connecting game developers and players through game testing opportunities, bug reporting, and tournament management.

## Current Milestone & Scope
- **Frontend App**: Expo SDK 58 React Native mobile app with NativeWind v4 styling and Expo Router navigation.
- **Backend Infrastructure**: Express REST API running on port 5000 with PostgreSQL 17 and MinIO object storage (`docker-compose.yml`).
- **Active Codebase Focus**: Mobile frontend client (`frontend/`) in active development under git sparse-checkout.

## Key Architecture & Core Directories
- `frontend/src/app/`: File-based routing navigation (Expo Router).
- `frontend/src/components/`: Modular UI component library styled with NativeWind.
- `frontend/src/services/`: API client modules for authentication, user profiles, and future features.
- `frontend/src/constants/`: Routing, theme colors, and API configurations.
