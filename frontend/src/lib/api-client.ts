import { API_BASE_URL } from "@/constants/config";
import type { ApiErrorBody } from "@/types/auth";

/** Error thrown for any non-2xx response or network failure. */
export class ApiError extends Error {
  readonly status: number;
  readonly isNetworkError: boolean;

  constructor(message: string, status: number, isNetworkError = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Robust fetch wrapper around the backend.
 *
 * `credentials: "include"` is required because the backend authenticates with
 * an httpOnly cookie, which fetch will not send across origins otherwise.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${base}${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(options.body && !(typeof FormData !== "undefined" && options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    throw new ApiError(
      `Network connection failed: unable to reach API at ${url}. ${rawMessage}`,
      0,
      true,
    );
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    const msg =
      body?.message ??
      (body?.errors ? Object.values(body.errors).flat().join(", ") : null);

    throw new ApiError(
      msg ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  return (await response.json()) as T;
}