import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

<<<<<<< HEAD
import { deleteNotificationRequest, markNotificationRead, notificationsRequest } from '@/lib/auth-api';
=======
import {
  deleteNotificationRequest,
  markNotificationRead,
  notificationsRequest,
  updateNotificationPreferenceRequest,
} from '@/lib/auth-api';
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
import type { AppNotification } from '@/lib/types';

import { useAuth } from './auth-provider';
import { useToast } from './toast-provider';

interface NotificationContextValue {
  items: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
<<<<<<< HEAD
=======
  isAllowed: boolean;
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  refresh: (announce?: boolean) => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (notificationId: string) => Promise<void>;
<<<<<<< HEAD
=======
  enableNotifications: () => Promise<void>;
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
<<<<<<< HEAD
  const { isAuthenticated, user } = useAuth();
=======
  const { isAuthenticated, user, refreshProfile } = useAuth();
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
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
=======
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

>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
        // A failed poll is silent: the badge simply keeps its last value.
      }
    },
    [currentUserId, showToast],
=======
        // A failed poll is silent
        setLoading(false);
      }
    },
    [currentUserId, isAllowed, showToast],
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  );

  const refresh = useCallback(
    async (announce = false) => {
<<<<<<< HEAD
      if (!isAuthenticated) return;

      setRefreshing(true);

=======
      if (!isAuthenticated || !isAllowed) return;

      setRefreshing(true);
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      try {
        await load(announce);
      } finally {
        setRefreshing(false);
      }
    },
<<<<<<< HEAD
    [isAuthenticated, load],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    // Deferred a microtask so the first poll never sets state during the
    // effect's synchronous pass.
=======
    [isAuthenticated, isAllowed, load],
  );

  useEffect(() => {
    if (!isAuthenticated || !isAllowed) {
      setLoading(false);
      return;
    }

>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a

  const markAllRead = useCallback(async () => {
    const unread = items.filter((item) => !item.markAsRead);
    if (unread.length === 0) return;

    setItems((current) => current.map((item) => ({ ...item, markAsRead: true })));
    setUnreadCount(0);

<<<<<<< HEAD
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
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
