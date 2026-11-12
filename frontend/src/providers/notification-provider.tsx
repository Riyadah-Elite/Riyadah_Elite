import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { deleteNotificationRequest, markNotificationRead, notificationsRequest } from '@/lib/auth-api';
import type { AppNotification } from '@/lib/types';

import { useAuth } from './auth-provider';
import { useToast } from './toast-provider';

interface NotificationContextValue {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  refresh: (announce?: boolean) => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
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
  const sessionActive = isAuthenticated && sessionId === currentUserId;

  // State is tagged with the account it belongs to. Logging out therefore
  // empties the visible feed without a reset effect, and a different account
  // can never flash the previous operative's transmissions.
  const items = useMemo(() => (sessionActive ? storedItems : []), [sessionActive, storedItems]);
  const unreadCount = sessionActive ? storedUnreadCount : 0;
  const loading = sessionActive ? storedLoading : true;
  const refreshing = sessionActive ? storedRefreshing : false;

  // Deliberately free of synchronous state updates so effects can call it
  // directly without cascading renders.
  const load = useCallback(
    async (announce: boolean) => {
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
        // A failed poll is silent: the badge simply keeps its last value.
      }
    },
    [currentUserId, showToast],
  );

  const refresh = useCallback(
    async (announce = false) => {
      if (!isAuthenticated) return;

      setRefreshing(true);

      try {
        await load(announce);
      } finally {
        setRefreshing(false);
      }
    },
    [isAuthenticated, load],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    // Deferred a microtask so the first poll never sets state during the
    // effect's synchronous pass.
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
  }, [isAuthenticated, load, refresh, user?.id]);

  const markRead = useCallback(async (notificationId: string) => {
    const target = items.find((item) => item.id === notificationId);
    if (!target || target.markAsRead) return;

    setItems((current) =>
      current.map((item) => (item.id === notificationId ? { ...item, markAsRead: true } : item)),
    );
    setUnreadCount((current) => Math.max(0, current - 1));

    try {
      await markNotificationRead(notificationId);
    } catch {
      // Re-sync on the next poll instead of showing a failure for a read receipt.
    }
  }, [items]);

  const markAllRead = useCallback(async () => {
    const unread = items.filter((item) => !item.markAsRead);
    if (unread.length === 0) return;

    setItems((current) => current.map((item) => ({ ...item, markAsRead: true })));
    setUnreadCount(0);

    await Promise.allSettled(unread.map((item) => markNotificationRead(item.id)));
  }, [items]);

  const remove = useCallback(async (notificationId: string) => {
    const target = items.find((item) => item.id === notificationId);

    setItems((current) => current.filter((item) => item.id !== notificationId));
    if (target && !target.markAsRead) {
      setUnreadCount((current) => Math.max(0, current - 1));
    }

    try {
      await deleteNotificationRequest(notificationId);
    } catch {
      // The next poll restores the record if the server rejected the delete.
    }
  }, [items]);

  const value = useMemo<NotificationContextValue>(
    () => ({ items, unreadCount, loading, refreshing, refresh, markRead, markAllRead, remove }),
    [items, loading, markAllRead, markRead, refresh, refreshing, remove, unreadCount],
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
