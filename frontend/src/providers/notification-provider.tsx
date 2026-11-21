import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  deleteNotificationRequest,
  markNotificationRead,
  notificationsRequest,
  updateNotificationPreferenceRequest,
} from '@/lib/auth-api';
import type { AppNotification } from '@/lib/types';

import { useAuth } from './auth-provider';
import { useToast } from './toast-provider';

interface NotificationContextValue {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  isAllowed: boolean;
  refresh: (announce?: boolean) => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (notificationId: string) => Promise<void>;
  enableNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [storedItems, setItems] = useState<AppNotification[]>([]);
  const [storedUnreadCount, setUnreadCount] = useState(0);
  const [storedLoading, setLoading] = useState(true);
  const [storedRefreshing, setRefreshing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const knownIds = useRef<Set<string>>(new Set());
  const hasBaseline = useRef(false);
  const sessionRef = useRef<string | null>(null);

  const currentUserId = user?.id ?? null;
  const isAllowed = Boolean(user?.isNotificationAllowed);
  const sessionActive = isAuthenticated && sessionId === currentUserId;

  const items = useMemo(() => (sessionActive ? storedItems : []), [sessionActive, storedItems]);
  const unreadCount = sessionActive && isAllowed ? storedUnreadCount : 0;
  const loading = sessionActive ? storedLoading : true;
  const refreshing = sessionActive ? storedRefreshing : false;

  const load = useCallback(
    async (announce: boolean) => {
      if (!isAllowed) {
        setLoading(false);
        return;
      }

      try {
        const page = await notificationsRequest();
        const nextItems = page.items;
        const switched = sessionRef.current !== currentUserId;

        if (announce && !switched && hasBaseline.current) {
          const fresh = nextItems.filter((item) => !knownIds.current.has(item.id));

          if (fresh.length > 0) {
            showToast({
              title: 'Transmission received',
              message: fresh[0].message,
              variant: fresh[0].type === 'promotion' ? 'warning' : 'info',
            });
          }
        }

        sessionRef.current = currentUserId;
        knownIds.current = new Set(nextItems.map((item) => item.id));
        hasBaseline.current = true;
        setSessionId(currentUserId);
        setItems(nextItems);
        setUnreadCount(page.unreadCount);
        setLoading(false);
      } catch {
        // A failed poll is silent
        setLoading(false);
      }
    },
    [currentUserId, isAllowed, showToast],
  );

  const refresh = useCallback(
    async (announce = false) => {
      if (!isAuthenticated || !isAllowed) return;

      setRefreshing(true);
      try {
        await load(announce);
      } finally {
        setRefreshing(false);
      }
    },
    [isAuthenticated, isAllowed, load],
  );

  useEffect(() => {
    if (!isAuthenticated || !isAllowed) {
      setLoading(false);
      return;
    }

    let active = true;
    void Promise.resolve().then(() => {
      if (active) void load(false);
    });

    const interval = setInterval(() => {
      void refresh(true);
    }, 60_000);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh(true);
    });

    return () => {
      active = false;
      clearInterval(interval);
      subscription.remove();
    };
  }, [isAuthenticated, isAllowed, load, refresh, user?.id]);

  const markRead = useCallback(
    async (notificationId: string) => {
      const target = items.find((item) => item.id === notificationId);
      if (!target || target.markAsRead) return;

      setItems((current) =>
        current.map((item) => (item.id === notificationId ? { ...item, markAsRead: true } : item)),
      );
      setUnreadCount((current) => Math.max(0, current - 1));

      showToast({
        variant: 'info',
        title: 'Transmission read',
        message: 'Marked as read.',
      });

      try {
        await markNotificationRead(notificationId);
      } catch {
        // Recover on next poll if failed
      }
    },
    [items, showToast],
  );

  const markAllRead = useCallback(async () => {
    const unread = items.filter((item) => !item.markAsRead);
    if (unread.length === 0) return;

    setItems((current) => current.map((item) => ({ ...item, markAsRead: true })));
    setUnreadCount(0);

    showToast({
      variant: 'success',
      title: 'Transmissions cleared',
      message: 'All notifications marked as read.',
    });

    await Promise.allSettled(unread.map((item) => markNotificationRead(item.id)));
  }, [items, showToast]);

  const remove = useCallback(
    async (notificationId: string) => {
      const target = items.find((item) => item.id === notificationId);

      setItems((current) => current.filter((item) => item.id !== notificationId));
      if (target && !target.markAsRead) {
        setUnreadCount((current) => Math.max(0, current - 1));
      }

      showToast({
        variant: 'info',
        title: 'Transmission dismissed',
        message: 'Notification removed from your feed.',
      });

      try {
        await deleteNotificationRequest(notificationId);
      } catch {
        // Recover on next poll if rejected
      }
    },
    [items, showToast],
  );

  const enableNotifications = useCallback(async () => {
    if (!currentUserId) return;

    try {
      await updateNotificationPreferenceRequest(currentUserId, true);
      await refreshProfile();
      await load(false);

      showToast({
        variant: 'success',
        title: 'Notifications enabled',
        message: 'Live transmission feed activated for tournaments, builds, and bugs.',
      });
    } catch {
      showToast({
        variant: 'error',
        title: 'Action failed',
        message: 'Could not enable notification alerts. Please retry.',
      });
    }
  }, [currentUserId, load, refreshProfile, showToast]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      items,
      unreadCount,
      loading,
      refreshing,
      isAllowed,
      refresh,
      markRead,
      markAllRead,
      remove,
      enableNotifications,
    }),
    [
      items,
      unreadCount,
      loading,
      refreshing,
      isAllowed,
      refresh,
      markRead,
      markAllRead,
      remove,
      enableNotifications,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }

  return context;
}
