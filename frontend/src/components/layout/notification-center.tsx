import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  clayShadow,
  webBackdrop,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useHover } from '@/hooks/use-hover';
import { relativeTime } from '@/lib/format';
import type { AppNotification } from '@/lib/types';
import { useNotifications } from '@/providers/notification-provider';

import { IconButton } from '../ui/icon-button';

const TYPE_META = {
  system: { icon: 'shield-checkmark' as const, color: Palette.primaryBright },
  event: { icon: 'flash' as const, color: Palette.tertiary },
  promotion: { icon: 'megaphone' as const, color: Palette.warning },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <IconButton
        active={open}
        badge={unreadCount}
        iconSize={18}
        label="Notifications"
        name={open ? 'notifications' : 'notifications-outline'}
        onPress={() => setOpen(true)}
      />
      <NotificationModal onClose={() => setOpen(false)} visible={open} />
    </>
  );
}

function NotificationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
  const { items, unreadCount, loading, refreshing, refresh, markRead, markAllRead, remove } =
    useNotifications();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close notifications"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.scrim]}
        />

        <View
          style={[
            styles.panel,
            clayShadow,
            webBackdrop,
            isMobile
              ? { left: Space.sm + 4, right: Space.sm + 4, bottom: insets.bottom + Space.sm }
              : { right: Space.lg, top: insets.top + 82, width: 384 },
          ]}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <View style={styles.headerIcon}>
                <Ionicons name="radio" size={14} color={Palette.primaryBright} />
              </View>
              <View>
                <Text style={styles.headerLabel}>Transmissions</Text>
                <Text style={styles.headerMeta}>
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All channels clear'}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              {refreshing ? (
                <ActivityIndicator color={Palette.textMuted} size="small" />
              ) : (
                <Pressable
                  accessibilityLabel="Refresh notifications"
                  hitSlop={8}
                  onPress={() => void refresh(false)}
                  style={({ pressed }) => pressed && styles.pressed}>
                  <Ionicons name="refresh" size={15} color={Palette.textDim} />
                </Pressable>
              )}

              <Pressable
                accessibilityLabel="Close notifications"
                hitSlop={8}
                onPress={onClose}
                style={({ pressed }) => pressed && styles.pressed}>
                <Ionicons name="close" size={18} color={Palette.textMuted} />
              </Pressable>
            </View>
          </View>

          {unreadCount > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => void markAllRead()}
              style={({ pressed }) => [styles.markAll, pressed && styles.pressed]}>
              <Ionicons name="checkmark-done" size={13} color={Palette.secondary} />
              <Text style={styles.markAllText}>Mark all read</Text>
            </Pressable>
          ) : null}

          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            style={styles.scroll}>
            {loading && items.length === 0 ? (
              <View style={styles.empty}>
                <ActivityIndicator color={Palette.primaryBright} />
                <Text style={styles.emptyTitle}>Syncing channel…</Text>
              </View>
            ) : items.length === 0 ? (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="notifications-off-outline" size={22} color={Palette.textDim} />
                </View>
                <Text style={styles.emptyTitle}>No transmissions yet</Text>
                <Text style={styles.emptyCopy}>
                  Match alerts, rank updates and tournament invites will land here.
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onDelete={() => void remove(item.id)}
                  onRead={() => void markRead(item.id)}
                />
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Ionicons name="lock-closed" size={11} color={Palette.textFaint} />
            <Text style={styles.footerText}>End-to-end session channel · Riyadah Core</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function NotificationRow({
  item,
  onRead,
  onDelete,
}: {
  item: AppNotification;
  onRead: () => void;
  onDelete: () => void;
}) {
  const meta = TYPE_META[item.type] ?? TYPE_META.system;
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="button"
      onPress={onRead}
      style={({ pressed }) => [
        styles.row,
        !item.markAsRead && styles.rowUnread,
        hovered && styles.rowHover,
        pressed && styles.pressed,
      ]}>
      <View style={[styles.rowIcon, { borderColor: `${meta.color}44`, backgroundColor: `${meta.color}14` }]}>
        <Ionicons name={meta.icon} size={15} color={meta.color} />
      </View>

      <View style={styles.rowCopy}>
        <View style={styles.rowTop}>
          <Text style={styles.rowType}>{item.type}</Text>
          <Text style={styles.rowTime}>{relativeTime(item.createdAt)}</Text>
        </View>
        <Text style={[styles.rowMessage, !item.markAsRead && { color: Palette.text }]}>
          {item.message}
        </Text>
      </View>

      <Pressable
        accessibilityLabel="Delete notification"
        hitSlop={8}
        onPress={onDelete}
        style={({ pressed }) => [styles.delete, pressed && styles.pressed]}>
        <Ionicons name="close" size={14} color={Palette.textFaint} />
      </Pressable>

      {!item.markAsRead ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  scrim: {
    backgroundColor: 'rgba(36, 28, 22, 0.34)',
  },
  panel: {
    position: 'absolute',
    maxHeight: '76%',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    backgroundColor: Palette.glassStrong,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingTop: Space.md,
    paddingBottom: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primaryWash,
  },
  headerLabel: {
    ...Typography.labelTight,
    color: Palette.text,
    letterSpacing: 1.4,
  },
  headerMeta: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  markAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Space.md,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  markAllText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primaryBright,
  },
  scroll: {
    maxHeight: 390,
  },
  list: {
    padding: Space.sm,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  rowUnread: {
    backgroundColor: Palette.primaryWash,
  },
  rowHover: {
    backgroundColor: 'rgba(36, 28, 22, 0.035)',
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  rowCopy: {
    flex: 1,
    gap: 3,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowType: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1,
  },
  rowTime: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    fontVariant: ['tabular-nums'],
  },
  rowMessage: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textMuted,
  },
  delete: {
    padding: 2,
    marginTop: 2,
  },
  unreadDot: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 2,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: Palette.primary,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: Space.xl,
    paddingHorizontal: Space.lg,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceDim,
  },
  emptyTitle: {
    ...Typography.title,
    color: Palette.textMuted,
    fontSize: 13,
  },
  emptyCopy: {
    ...Typography.bodySm,
    color: Palette.textFaint,
    textAlign: 'center',
    maxWidth: 250,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surfaceDim,
  },
  footerText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 0.8,
  },
  pressed: {
    opacity: 0.65,
  },
});
