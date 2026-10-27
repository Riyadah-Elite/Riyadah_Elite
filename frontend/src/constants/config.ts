/**
 * Runtime configuration.
 *
 * Resolves the appropriate backend API base URL across local development,
 * preview environments, and production hosting on Render.
 */

export function resolveApiBaseUrl(): string {
  // 1. Explicit build-time or runtime environment override
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  // 2. Browser runtime detection
  if (typeof window !== "undefined" && window.location) {
    const { hostname, protocol } = window.location;

    // Production Render deployment or external HTTPS host
    if (
      hostname === "riyadah-elite-frontend.onrender.com" ||
      (protocol === "https:" && hostname !== "localhost" && hostname !== "127.0.0.1")
    ) {
      return "https://riyadah-elite-backend.onrender.com";
    }

    // Local development in browser
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }

  // 3. Static build / SSR default: use production backend in production mode, localhost in development
  if (process.env.NODE_ENV === "production") {
    return "https://riyadah-elite-backend.onrender.com";
  }

  return "http://localhost:5000";
}

export const API_BASE_URL = resolveApiBaseUrl();

/** API routes exposed by the backend, supporting both current and legacy endpoints. */
export const API_ROUTES = {
  health: "/api/v1/health",
  user: {
    register: "/api/v1/user/register",
    login: "/api/v1/user/login",
    profile: "/api/v1/user/profile",
    logout: "/api/v1/user/logout",
  },
  auth: {
    register: "/api/v1/auth/signup",
    login: "/api/v1/auth/login",
    profile: "/api/v1/auth/me",
    logout: "/api/v1/auth/logout",
  },
} as const;