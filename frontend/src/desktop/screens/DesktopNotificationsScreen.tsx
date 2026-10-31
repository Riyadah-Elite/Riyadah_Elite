import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { notificationService } from '../../shared/services/notificationService';
import { NotificationItem } from '../../shared/types';
import { theme } from '../../shared/theme';

export const DesktopNotificationsScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'tournament' | 'system'>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  useEffect(() => {
    notificationService.listNotifications().then((list) => {
      setNotifications(list);
      if (list.length > 0) setSelectedNotification(list[0]);
    });
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelect = (item: NotificationItem) => {
    setSelectedNotification(item);
    if (!item.isRead) {
      notificationService.markAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'tournament') return n.content.toLowerCase().includes('tournament') || n.content.toLowerCase().includes('bracket');
    if (filter === 'system') return !n.content.toLowerCase().includes('tournament');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="notifications" size={14} color={theme.colors.brand.accent} />
          <Text style={styles.badgeText}>REAL-TIME NOTIFICATION DISPATCH</Text>
        </View>
        <Text style={styles.title}>System Alerts & Notifications</Text>
        <Text style={styles.desc}>
          Stay synchronized with your match schedules, verified bounty payouts, QA ticket progressions, and security announcements.
        </Text>
      </View>

      {/* Top Filter and Action Bar */}
      <View style={styles.controlsRow}>
        <View style={styles.filterPills}>
          <TouchableOpacity
            style={[styles.pill, filter === 'all' && styles.pillActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.pillText, filter === 'all' && styles.pillTextActive]}>
              All Notifications ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filter === 'unread' && styles.pillActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.pillText, filter === 'unread' && styles.pillTextActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filter === 'tournament' && styles.pillActive]}
            onPress={() => setFilter('tournament')}
          >
            <Text style={[styles.pillText, filter === 'tournament' && styles.pillTextActive]}>
              Tournaments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filter === 'system' && styles.pillActive]}
            onPress={() => setFilter('system')}
          >
            <Text style={[styles.pillText, filter === 'system' && styles.pillTextActive]}>
              QA & Bounties
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllRead}>
          <Ionicons name="checkmark-done" size={16} color={theme.colors.brand.accent} />
          <Text style={styles.markReadText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      {/* 2-Column Master-Detail Layout (Wireframe 1) */}
      <View style={styles.masterDetailLayout}>
        {/* Left Column: Notification List */}
        <View style={styles.listCol}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="mail-open-outline" size={36} color={theme.colors.text.muted} />
              <Text style={styles.emptyText}>No notifications found in this filter.</Text>
            </View>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedNotification?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    !item.isRead && styles.itemCardUnread,
                    isSelected && styles.itemCardSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons
                      name={
                        item.content.includes('Tournament') || item.content.includes('Championship')
                          ? 'trophy'
                          : item.content.includes('bounty') || item.content.includes('reward')
                          ? 'cash'
                          : 'notifications'
                      }
                      size={18}
                      color={
                        item.content.includes('Tournament')
                          ? theme.colors.brand.accent
                          : theme.colors.brand.secondary
                      }
                    />
                  </View>

                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemText, !item.isRead && styles.itemTextBold]} numberOfLines={2}>
                        {item.content}
                      </Text>
                      {!item.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.itemDate}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Right Column: Notification Detail Pane (Wireframe 1) */}
        <View style={styles.detailCol}>
          {selectedNotification ? (
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailTagRow}>
                  <Text style={styles.detailType}>SYSTEM TELEMETRY ALERT</Text>
                  <Text style={styles.detailDate}>
                    {selectedNotification.createdAt
                      ? new Date(selectedNotification.createdAt).toLocaleString()
                      : 'Real-time'}
                  </Text>
                </View>
                <Text style={styles.detailTitle}>{selectedNotification.content}</Text>
              </View>

              <View style={styles.detailBody}>
                <Text style={styles.detailBodyText}>
                  This alert has been automatically cataloged by the Riyadah Elite distributed notification broker.
                  All competitive timeframes and testing milestones are synchronized to your platform timezone.
                </Text>

                <View style={styles.detailMetadataBox}>
                  <View style={styles.detailMetaRow}>
                    <Text style={styles.metaKey}>Notification ID:</Text>
                    <Text style={styles.metaVal}>{selectedNotification.id}</Text>
                  </View>
                  <View style={styles.detailMetaRow}>
                    <Text style={styles.metaKey}>Delivery Status:</Text>
                    <Text style={[styles.metaVal, { color: theme.colors.brand.accent }]}>Delivered & Verified</Text>
                  </View>
                  <View style={styles.detailMetaRow}>
                    <Text style={styles.metaKey}>Channel:</Text>
                    <Text style={styles.metaVal}>Web Socket / Push</Text>
                  </View>
                </View>

                {/* Quick Action Navigation */}
                <View style={styles.detailActions}>
                  {selectedNotification.content.toLowerCase().includes('tournament') ? (
                    <TouchableOpacity
                      style={styles.actionPrimaryBtn}
                      onPress={() => router.push('/tournaments')}
                    >
                      <Ionicons name="trophy" size={16} color="#000" />
                      <Text style={styles.actionPrimaryText}>View Tournament Arenas</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.actionPrimaryBtn}
                      onPress={() => router.push('/games')}
                    >
                      <Ionicons name="game-controller" size={16} color="#000" />
                      <Text style={styles.actionPrimaryText}>Open Playtest Nexus</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.actionSecondaryBtn}
                    onPress={() => router.push('/bug-report')}
                  >
                    <Ionicons name="bug-outline" size={16} color={theme.colors.brand.accent} />
                    <Text style={styles.actionSecondaryText}>QA Console</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.detailPlaceholder}>
              <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.text.muted} />
              <Text style={styles.placeholderText}>Select a notification to view telemetry details.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borders.radius.full,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.heading,
  },
  desc: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    maxWidth: 800,
    lineHeight: 22,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  pillActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  pillText: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.background.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  markReadText: {
    color: theme.colors.brand.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  masterDetailLayout: {
    flexDirection: 'row',
    gap: 24,
  },
  listCol: {
    width: 480,
    gap: 10,
  },
  detailCol: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  itemCardUnread: {
    backgroundColor: theme.colors.background.elevated,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.brand.accent,
  },
  itemCardSelected: {
    borderColor: theme.colors.brand.secondary,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  itemText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  itemTextBold: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
    marginTop: 4,
  },
  itemDate: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 6,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: theme.colors.text.muted,
    fontSize: 14,
  },
  detailCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  detailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    paddingBottom: 16,
    marginBottom: 16,
  },
  detailTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailType: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  detailDate: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    lineHeight: 28,
  },
  detailBody: {
    gap: 16,
  },
  detailBodyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  detailMetadataBox: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 8,
  },
  detailMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaKey: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.md,
  },
  actionPrimaryText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
  actionSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.background.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  actionSecondaryText: {
    color: theme.colors.brand.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  detailPlaceholder: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 12,
  },
  placeholderText: {
    color: theme.colors.text.muted,
    fontSize: 14,
  },
});

