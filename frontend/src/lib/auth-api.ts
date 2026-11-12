import { api } from './api';
import { buildRegistrationFormData, type RegistrationPayload } from './media';
import type { ApiEnvelope, ApiUser, AuthResponse, LeaderboardPage, NotificationPage } from './types';

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>('/api/v1/user/login', {
    email: email.trim().toLowerCase(),
    password,
  });

  return response.data.data;
}

export async function registerRequest(payload: RegistrationPayload): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope<AuthResponse>>(
    '/api/v1/user/register',
    buildRegistrationFormData(payload),
  );

  return response.data.data;
}

export async function profileRequest(): Promise<ApiUser> {
  const response = await api.get<ApiEnvelope<{ user: ApiUser }>>('/api/v1/user/profile');

  return response.data.data.user;
}

export async function logoutRequest(): Promise<void> {
  await api.get<ApiEnvelope<{ message: string }>>('/api/v1/user/logout');
}

export async function leaderboardRequest(limit = 10): Promise<LeaderboardPage> {
  const response = await api.get<ApiEnvelope<LeaderboardPage>>('/api/v1/user/leaderboard', {
    params: { limit },
  });

  return response.data.data;
}

export async function notificationsRequest(limit = 20): Promise<NotificationPage> {
  const response = await api.get<ApiEnvelope<NotificationPage>>('/api/v1/notification', {
    params: { page: 1, limit },
  });

  return response.data.data;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await api.patch(`/api/v1/notification/${notificationId}/read`);
}

export async function deleteNotificationRequest(notificationId: string): Promise<void> {
  await api.delete(`/api/v1/notification/${notificationId}`);
}
