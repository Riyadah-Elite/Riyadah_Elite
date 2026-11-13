import { Platform } from 'react-native';

/**
 * Where the Express API lives.
 *
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
