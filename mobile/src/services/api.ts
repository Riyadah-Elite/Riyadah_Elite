import { ENV } from "../config/env";
import { ApiResponse } from "../types";

class ApiClient {
  private token: string | null = null;

  public setToken(token: string | null) {
    this.token = token;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${ENV.API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          status: "error",
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors,
        };
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      return {
        status: "error",
        message: err.message || "Network request failed. Ensure backend API is accessible.",
      };
    }
  }

  public get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
