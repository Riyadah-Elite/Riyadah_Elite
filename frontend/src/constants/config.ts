/**
 * Runtime configuration.
 *
 * EXPO_PUBLIC_* variables are inlined into the bundle by Metro, so anything
 * here is public. Never put a secret in this file.
 */

/**
 * Base URL of the Express backend.
 *
 * On a physical device localhost points at the phone, not your machine - use
 * your LAN IP (for example http://192.168.1.10:5000) or the deployed host.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

/** API routes exposed by the backend, typed in one place. */
export const API_ROUTES = {
  health: "/api/v1/health",
  user: {
    register: "/api/v1/user/register",
    login: "/api/v1/user/login",
    profile: "/api/v1/user/profile",
    logout: "/api/v1/user/logout",
  },
} as const;