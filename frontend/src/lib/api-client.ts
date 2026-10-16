import { API_BASE_URL } from "@/constants/config";
import type { ApiErrorBody } from "@/types/auth";

/** Error thrown for any non-2xx response, carrying the status and body. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Thin fetch wrapper around the backend.
 *
 * `credentials: "include"` is required because the backend authenticates with
 * an httpOnly cookie, which fetch will not send otherwise.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;

    throw new ApiError(body?.message ?? `Request failed (${response.status})`, response.status);
  }

  return (await response.json()) as T;
}