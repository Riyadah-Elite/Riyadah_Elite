import { Platform } from 'react-native';

/**
 * Where the Express API lives.
 *
<<<<<<< HEAD
 * Set EXPO_PUBLIC_API_URL for device builds (a LAN IP or hosted API). The
 * Android emulator cannot reach the host through localhost, so it gets the
 * standard 10.0.2.2 bridge address.
 */
const fallback = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? fallback).replace(/\/+$/, '');
=======
 * Supports:
 * - Explicit EXPO_PUBLIC_API_URL (safely stripping trailing /api/v1 if included)
 * - Render cloud deployments (matching riyadah-elite-backend.onrender.com)
 * - Android emulator 10.0.2.2 loopback bridge
 * - Localhost development (http://localhost:5000)
 */
function resolveDefaultApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '');
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('onrender.com')) {
      return 'https://riyadah-elite-backend.onrender.com';
    }
  }

  return Platform.select({
    android: 'http://10.0.2.2:5000',
    default: 'http://localhost:5000',
  });
}

export const API_URL = resolveDefaultApiUrl();
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
