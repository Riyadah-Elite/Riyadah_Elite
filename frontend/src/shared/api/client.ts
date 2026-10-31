import { Platform } from 'react-native';

export function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    if (
      hostname === 'riyadah-elite-frontend.onrender.com' ||
      (protocol === 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1')
    ) {
      return 'https://riyadah-elite-backend.onrender.com';
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  return 'http://localhost:5000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  readonly status: number;
  readonly isNetworkError: boolean;

  constructor(message: string, status: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${base}${cleanPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(options.body && !(typeof FormData !== 'undefined' && options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const msg =
        body?.message ??
        (body?.errors ? Object.values(body.errors).flat().join(', ') : null);

      throw new ApiError(msg ?? `Request failed (${response.status})`, response.status);
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new ApiError(`Network connection failed at ${url}: ${msg}`, 0, true);
  }
}

