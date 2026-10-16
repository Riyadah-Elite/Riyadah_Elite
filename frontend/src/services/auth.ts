import { API_ROUTES } from "@/constants/config";
import { apiRequest } from "@/lib/api-client";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types/auth";

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(API_ROUTES.user.login, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** `avatarPath` / `avatarMimeType` come from the multipart avatar upload. */
export function register(
  input: RegisterInput,
  avatar: { uri: string; name: string; type: string },
): Promise<AuthResponse> {
  const form = new FormData();

  form.append("username", input.username);
  form.append("email", input.email);
  form.append("password", input.password);
  form.append("avatar", avatar as unknown as Blob);

  return apiRequest<AuthResponse>(API_ROUTES.user.register, {
    method: "POST",
    body: form,
  });
}

export function fetchProfile(): Promise<{ user: User }> {
  return apiRequest<{ user: User }>(API_ROUTES.user.profile);
}

export function logout(): Promise<unknown> {
  return apiRequest<unknown>(API_ROUTES.user.logout);
}