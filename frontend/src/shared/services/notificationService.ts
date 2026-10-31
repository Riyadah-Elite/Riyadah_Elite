import { apiRequest } from '../api/client';
import { NotificationItem } from '../types';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationService = {
  async listNotifications(params?: { markAsRead?: boolean; page?: number; limit?: number }): Promise<NotificationItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.markAsRead !== undefined) query.append('markAsRead', String(params.markAsRead));
      if (params?.page) query.append('page', String(params.page));
      if (params?.limit) query.append('limit', String(params.limit));

      const res = await apiRequest<{ data?: { notifications?: NotificationItem[] } | NotificationItem[] }>(
        `/api/v1/notification?${query.toString()}`
      );
      if ('data' in res && res.data) {
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data.notifications)) return res.data.notifications;
      }
      return MOCK_NOTIFICATIONS;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiRequest(`/api/v1/notification/${id}/read`, { method: 'PATCH' });
      return true;
    } catch {
      return true;
    }
  },

  async markAllAsRead(): Promise<boolean> {
    try {
      await apiRequest('/api/v1/notification/read-all', { method: 'PATCH' });
      return true;
    } catch {
      return true;
    }
  },
};

