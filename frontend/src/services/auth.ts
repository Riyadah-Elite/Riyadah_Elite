import { API_ROUTES } from "@/constants/config";
import { apiRequest, ApiError } from "@/lib/api-client";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types/auth";

interface BackendProfileEnvelope {
  user?: User;
  data?: { user?: User } | User;
}

interface BackendAuthEnvelope {
  user?: User;
  token?: string;
  data?: { user?: User; token?: string } | User;
}

function extractUser(data: BackendProfileEnvelope | BackendAuthEnvelope | null | undefined): User | null {
  if (!data) return null;
  if ('user' in data && data.user) return data.user;
  if ('data' in data && data.data) {
    if (typeof data.data === 'object' && 'user' in data.data && data.data.user) {
      return data.data.user;
    }
    return data.data as User;
  }
  return null;
}

function extractToken(data: BackendAuthEnvelope | null | undefined): string {
  if (!data) return "";
  if (data.token) return data.token;
  if (data.data && typeof data.data === 'object' && 'token' in data.data && data.data.token) {
    return data.data.token;
  }
  return "";
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  try {
    const res = await apiRequest<BackendAuthEnvelope>(API_ROUTES.user.login, {
      method: "POST",
      body: JSON.stringify(input),
    });
    const user = extractUser(res);
    if (!user) throw new Error("Invalid response from login endpoint");
    return { user, token: extractToken(res) };
  } catch (err) {
    // If /api/v1/user/login returned 404, fallback to /api/v1/auth/login
    if (err instanceof ApiError && err.status === 404) {
      const res = await apiRequest<BackendAuthEnvelope>(API_ROUTES.auth.login, {
        method: "POST",
        body: JSON.stringify(input),
      });
      const user = extractUser(res);
      if (!user) throw new Error("Invalid response from login endpoint");
      return { user, token: extractToken(res) };
    }
    throw err;
  }
}

/** `avatarPath` / `avatarMimeType` come from the multipart avatar upload. */
export async function register(
  input: RegisterInput,
  avatar: { uri: string; name: string; type: string },
): Promise<AuthResponse> {
  const form = new FormData();
  form.append("username", input.username);
  form.append("email", input.email);
  form.append("password", input.password);
  form.append("avatar", avatar as unknown as Blob);

  try {
    const res = await apiRequest<BackendAuthEnvelope>(API_ROUTES.user.register, {
      method: "POST",
      body: form,
    });
    const user = extractUser(res);
    if (!user) throw new Error("Invalid response from registration endpoint");
    return { user, token: extractToken(res) };
  } catch (err) {
    // Fallback to /api/v1/auth/signup if /api/v1/user/register returned 404
    if (err instanceof ApiError && err.status === 404) {
      const jsonBody = {
        fullName: input.username,
        username: input.username,
        email: input.email,
        password: input.password,
        confirmPassword: input.password,
      };
      const res = await apiRequest<BackendAuthEnvelope>(API_ROUTES.auth.register, {
        method: "POST",
        body: JSON.stringify(jsonBody),
      });
      const user = extractUser(res);
      if (!user) throw new Error("Invalid response from registration endpoint");
      return { user, token: extractToken(res) };
    }
    throw err;
  }
}

export async function fetchProfile(): Promise<{ user: User | null }> {
  try {
    const res = await apiRequest<BackendProfileEnvelope>(API_ROUTES.user.profile);
    return { user: extractUser(res) };
  } catch (err) {
    // Fallback to /api/v1/auth/me if /api/v1/user/profile returned 404
    if (err instanceof ApiError && err.status === 404) {
      const res = await apiRequest<BackendProfileEnvelope>(API_ROUTES.auth.profile);
      return { user: extractUser(res) };
    }
    throw err;
  }
}

export async function logout(): Promise<unknown> {
  try {
    return await apiRequest<unknown>(API_ROUTES.user.logout);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return await apiRequest<unknown>(API_ROUTES.auth.logout, { method: "POST" });
    }
    throw err;
  }
}