import { create, isAxiosError, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

import { API_URL } from './env';
import { getStoredToken } from './token-store';

/**
 * One axios instance for the whole app.
 *
 * Web authenticates with the HttpOnly cookie (`withCredentials`), native
 * authenticates with the keychain token attached as a Bearer header. Both are
 * supported by the same backend middleware, so callers never branch on
 * platform.
 */
export const api = create({
  baseURL: API_URL,
  timeout: 30_000,
  withCredentials: Platform.OS === 'web',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getStoredToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

interface ApiErrorBody {
  message?: unknown;
  success?: unknown;
}

export class ApiRequestError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

/** Turns axios's many failure shapes into one sentence a human can act on. */
export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorBody>;

  if (isAxiosError(axiosError)) {
    const body = axiosError.response?.data;
    const status = axiosError.response?.status ?? null;

    if (body && typeof body.message === 'string' && body.message.trim()) {
      return body.message;
    }

    if (axiosError.code === 'ECONNABORTED') {
      return 'The request timed out. Check your connection and try again.';
    }

    if (!axiosError.response) {
      return 'Cannot reach the Riyadah servers. Make sure the API is running and try again.';
    }

    if (status === 401) return 'Your session has expired. Please sign in again.';
    if (status === 403) return 'You do not have access to that action.';
    if (status === 404) return 'That record could not be found.';
    if (status && status >= 500) return 'The arena servers hit an error. Please try again.';
  }

  if (error instanceof Error) return error.message;

  return 'Something went wrong. Please try again.';
}

export function toApiRequestError(error: unknown): ApiRequestError {
  const axiosError = error as AxiosError;
  const status = isAxiosError(axiosError) ? (axiosError.response?.status ?? null) : null;

  return new ApiRequestError(getApiErrorMessage(error), status);
}
