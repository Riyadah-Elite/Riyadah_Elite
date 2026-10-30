import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { notificationService } from '../../shared/services/notificationService';
import { NotificationItem } from '../../shared/types';
import { theme } from '../../shared/theme';

export const MobileNotificationsScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    notificationService.listNotifications().then(setNotifications);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemPress = (item: NotificationItem) => {
    setExpandedId(expandedId === item.id ? null : item.id);
    if (!item.isRead) {
      notificationService.markAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="notifications" size={12} color={theme.colors.brand.accent} />
          <Text style={styles.badgeTxt}>DISPATCH ALERTS</Text>
        </View>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {/* Control row */}
      <View style={styles.controlRow}>
        <View style={styles.filterGroup}>
          <TouchableOpacity
            style={[styles.chip, filter === 'all' && styles.chipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.chipTxt, filter === 'all' && styles.chipTxtActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, filter === 'unread' && styles.chipActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.chipTxt, filter === 'unread' && styles.chipTxtActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.markTxt}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications list */}
      <View style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="mail-open-outline" size={32} color={theme.colors.text.muted} />
            <Text style={styles.emptyTxt}>No notifications</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, !item.isRead && styles.cardUnread]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.content.includes('Tournament') ? 'trophy' : 'notifications'}
                      size={14}
                      color={item.content.includes('Tournament') ? theme.colors.brand.accent : theme.colors.brand.secondary}
                    />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={[styles.cardTxt, !item.isRead && styles.cardTxtBold]} numberOfLines={isExpanded ? undefined : 2}>
                      {item.content}
                    </Text>
                    <Text style={styles.dateTxt}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                    </Text>
                  </View>
                  {!item.isRead && <View style={styles.dot} />}
                </View>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedInfo}>
                      Alert delivered via Riyadah Elite real-time dispatch mesh.
                    </Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => router.push('/tournaments')}
                      >
                        <Text style={styles.actionBtnTxt}>View Arenas</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: theme.colors.background.elevated }]}
                        onPress={() => router.push('/games')}
                      >
                        <Text style={[styles.actionBtnTxt, { color: theme.colors.brand.accent }]}>
                          Playtest Hub
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeTxt: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  chipActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  chipTxt: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  chipTxtActive: {
    color: '#fff',
    fontWeight: '700',
  },
  markTxt: {
    fontSize: 12,
    color: theme.colors.brand.accent,
    fontWeight: '600',
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  cardUnread: {
    backgroundColor: theme.colors.background.elevated,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.brand.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerInfo: {
    flex: 1,
  },
  cardTxt: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  cardTxtBold: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  dateTxt: {
    fontSize: 10,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    gap: 10,
  },
  expandedInfo: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.brand.accent,
  },
  actionBtnTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyTxt: {
    color: theme.colors.text.muted,
    fontSize: 13,
  },
});

