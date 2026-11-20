import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
=======
import { LinearGradient } from 'expo-linear-gradient';
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
<<<<<<< HEAD
=======
  Platform,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
  clayShadow,
  webBackdrop,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useHover } from '@/hooks/use-hover';
=======
  clayModalShadow,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
import { relativeTime } from '@/lib/format';
import type { AppNotification } from '@/lib/types';
import { useNotifications } from '@/providers/notification-provider';

<<<<<<< HEAD
import { IconButton } from '../ui/icon-button';

const TYPE_META = {
  system: { icon: 'shield-checkmark' as const, color: Palette.primaryBright },
  event: { icon: 'flash' as const, color: Palette.tertiary },
  promotion: { icon: 'megaphone' as const, color: Palette.warning },
=======
import { StatusBadge } from '../ui/badge';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Tooltip } from '../ui/tooltip';

const TYPE_META = {
  system: { icon: 'shield-checkmark' as const, color: Palette.primaryBright, label: 'System' },
  event: { icon: 'flash' as const, color: Palette.tertiary, label: 'Event' },
  promotion: { icon: 'megaphone' as const, color: Palette.secondary, label: 'Transmission' },
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
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
=======
  const { unreadCount, isAllowed } = useNotifications();

  const tooltipLabel = !isAllowed
    ? 'Notifications (Paused)'
    : unreadCount > 0
      ? `${unreadCount} unread transmission${unreadCount === 1 ? '' : 's'}`
      : 'Transmissions & alerts';

  return (
    <>
      <Tooltip content={tooltipLabel} position="bottom">
        <IconButton
          active={open}
          badge={isAllowed && unreadCount > 0 ? unreadCount : undefined}
          iconSize={18}
          label="Notifications"
          name={open ? 'notifications' : 'notifications-outline'}
          onPress={() => setOpen(true)}
        />
      </Tooltip>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      <NotificationModal onClose={() => setOpen(false)} visible={open} />
    </>
  );
}

function NotificationModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
<<<<<<< HEAD
  const { items, unreadCount, loading, refreshing, refresh, markRead, markAllRead, remove } =
    useNotifications();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close notifications"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.scrim]}
=======
  const {
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
  } = useNotifications();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={[styles.modalRoot, isMobile && styles.modalRootMobile]}>
        <Pressable
          accessibilityLabel="Close notifications dialog"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.scrim, webBackdrop]}
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
        />

        <View
          style={[
            styles.panel,
<<<<<<< HEAD
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
=======
            clayModalShadow,
            isMobile
              ? styles.panelMobile
              : [styles.panelWeb, { top: insets.top + 76, right: Space.lg }],
          ]}>
          {/* Top-left inner highlight for Claymorphism */}
          <LinearGradient
            colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 0.6 }}
            style={styles.panelTopHighlight}
            pointerEvents="none"
          />

          {/* Bottom-right inner deep shade for Claymorphism */}
          <LinearGradient
            colors={['rgba(136,104,74,0)', 'rgba(136,104,74,0.08)', 'rgba(136,104,74,0.18)']}
            start={{ x: 0.4, y: 0.4 }}
            end={{ x: 1, y: 1 }}
            style={styles.panelBottomShade}
            pointerEvents="none"
          />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <View style={styles.headerIcon}>
                <Ionicons name="radio" size={15} color={Palette.primary} />
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.headerEyebrow}>Telemetry Dispatch</Text>
                <View style={styles.headerRow}>
                  <Text style={styles.headerLabel}>Transmissions</Text>
                  {isAllowed && unreadCount > 0 ? (
                    <StatusBadge color={Palette.primary} label={`${unreadCount} new`} />
                  ) : null}
                </View>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
              </View>
            </View>

            <View style={styles.headerActions}>
<<<<<<< HEAD
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
=======
              {isAllowed ? (
                refreshing ? (
                  <ActivityIndicator color={Palette.primary} size="small" />
                ) : (
                  <Tooltip content="Refresh feed" position="bottom">
                    <IconButton
                      iconSize={15}
                      label="Refresh transmissions"
                      name="refresh"
                      onPress={() => void refresh(false)}
                      size={34}
                    />
                  </Tooltip>
                )
              ) : null}

              <Tooltip content="Close popup" position="bottom">
                <IconButton
                  iconSize={16}
                  label="Close notification panel"
                  name="close"
                  onPress={onClose}
                  size={34}
                />
              </Tooltip>
            </View>
          </View>

          {/* Mark all read button */}
          {isAllowed && unreadCount > 0 ? (
            <View style={styles.subHeaderBar}>
              <Text style={styles.subHeaderCount}>
                {unreadCount} unread transmission{unreadCount === 1 ? '' : 's'}
              </Text>

              <Button
                accessibilityLabel="Mark all transmissions as read"
                icon="checkmark-done"
                iconPosition="left"
                label="Mark all read"
                onPress={() => void markAllRead()}
                size="sm"
                variant="dark"
              />
            </View>
          ) : null}

          {/* Content Area */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}>
            {!isAllowed ? (
              /* Prompt when isNotificationAllowed === false */
              <View style={styles.promptState}>
                <View style={styles.promptIconWrap}>
                  <Ionicons name="notifications-off-outline" size={32} color={Palette.primary} />
                </View>

                <Text style={styles.promptTitle}>Alerts are currently paused</Text>

                <Text style={styles.promptCopy}>
                  Turn on telemetry notifications to receive instant dispatches on new tournament brackets, game testing assignments, and bug triage updates.
                </Text>

                <Button
                  fullWidth
                  icon="notifications"
                  label="Enable Notifications"
                  onPress={() => void enableNotifications()}
                  size="md"
                  variant="lime"
                />
              </View>
            ) : loading && items.length === 0 ? (
              <View style={styles.emptyState}>
                <ActivityIndicator color={Palette.primary} size="large" />
                <Text style={styles.emptyTitle}>Syncing transmission feed…</Text>
              </View>
            ) : items.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={26} color={Palette.tertiary} />
                </View>
                <Text style={styles.emptyTitle}>All channels clear</Text>
                <Text style={styles.emptyCopy}>
                  No active transmissions right now. Match alerts, QA build drops, and ladder notifications will arrive here.
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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

<<<<<<< HEAD
          <View style={styles.footer}>
            <Ionicons name="lock-closed" size={11} color={Palette.textFaint} />
            <Text style={styles.footerText}>End-to-end session channel · Riyadah Core</Text>
=======
          {/* Footer */}
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={11} color={Palette.textFaint} />
            <Text style={styles.footerText}>Secured transmission channel · Riyadah Core</Text>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
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
=======
    <View
      {...hoverProps}
      style={[
        styles.row,
        !item.markAsRead && styles.rowUnread,
        hovered && styles.rowHover,
      ]}>
      <View
        style={[
          styles.rowIcon,
          { borderColor: `${meta.color}44`, backgroundColor: `${meta.color}14` },
        ]}>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
        <Ionicons name={meta.icon} size={15} color={meta.color} />
      </View>

      <View style={styles.rowCopy}>
        <View style={styles.rowTop}>
<<<<<<< HEAD
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
=======
          <Text style={[styles.rowType, { color: meta.color }]}>{meta.label}</Text>
          <Text style={styles.rowTime}>{relativeTime(item.createdAt)}</Text>
        </View>

        <Text style={[styles.rowMessage, !item.markAsRead && styles.rowMessageUnread]}>
          {item.message}
        </Text>

        <View style={styles.rowActionRow}>
          {!item.markAsRead ? (
            <Button
              accessibilityLabel="Mark transmission as read"
              icon="checkmark"
              iconPosition="left"
              label="Mark read"
              onPress={onRead}
              size="sm"
              style={styles.actionBtn}
              variant="ghost"
            />
          ) : null}

          <Button
            accessibilityLabel="Delete transmission"
            icon="trash-outline"
            iconPosition="left"
            label="Delete"
            onPress={onDelete}
            size="sm"
            style={styles.actionBtn}
            variant="dark"
          />
        </View>
      </View>

      {!item.markAsRead ? <View style={styles.unreadDot} /> : null}
    </View>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
<<<<<<< HEAD
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
=======
  modalRootMobile: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.md,
  },
  scrim: {
    backgroundColor: Palette.overlay,
  },
  panel: {
    backgroundColor: Palette.elevated, // Matte inflated claymorphic surface
    borderRadius: Radius.clay, // Strict 28px border-radius
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    overflow: 'hidden',
    position: 'absolute',
  },
  panelWeb: {
    width: 410,
    maxHeight: 580,
  },
  panelMobile: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '82%',
    position: 'relative',
  },
  panelTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    borderTopLeftRadius: Radius.clay,
    borderTopRightRadius: Radius.clay,
    zIndex: 1,
  },
  panelBottomShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    borderBottomLeftRadius: Radius.clay,
    borderBottomRightRadius: Radius.clay,
    zIndex: 1,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
=======
    zIndex: 2,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
<<<<<<< HEAD
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
=======
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    marginTop: 1,
  },
  rowCopy: {
    flex: 1,
    gap: 3,
=======
    backgroundColor: Palette.primaryWash,
  },
  headerCopy: {
    gap: 1,
  },
  headerEyebrow: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.primary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    fontFamily: Fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: Palette.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: Space.xs + 2,
    backgroundColor: Palette.surfaceDim,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    zIndex: 2,
  },
  subHeaderCount: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textMuted,
    fontWeight: '600',
  },
  scroll: {
    flexGrow: 0,
    zIndex: 2,
  },
  scrollContent: {
    padding: Space.sm,
    gap: Space.xs + 4,
  },
  promptState: {
    alignItems: 'center',
    padding: Space.lg,
    gap: Space.sm,
  },
  promptIconWrap: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Space.xs,
  },
  promptTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
    textAlign: 'center',
  },
  promptCopy: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
    textAlign: 'center',
    marginBottom: Space.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: Space.xl,
    gap: Space.sm,
  },
  emptyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.text,
  },
  emptyCopy: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textFaint,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.sm,
    padding: Space.sm + 2,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    position: 'relative',
  },
  rowUnread: {
    backgroundColor: Palette.card,
    borderColor: `${Palette.primary}33`,
  },
  rowHover: {
    borderColor: Palette.primaryWashStrong,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowType: {
    ...Typography.labelTight,
<<<<<<< HEAD
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1,
  },
  rowTime: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    fontVariant: ['tabular-nums'],
=======
    fontSize: 9,
    fontWeight: '700',
  },
  rowTime: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textFaint,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  rowMessage: {
    fontFamily: Fonts.body,
    fontSize: 12,
<<<<<<< HEAD
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
=======
    lineHeight: 17,
    color: Palette.textDim,
  },
  rowMessageUnread: {
    color: Palette.text,
    fontWeight: '500',
  },
  rowActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs + 2,
    marginTop: Space.xs,
  },
  actionBtn: {
    paddingHorizontal: 8,
    minHeight: 28,
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primary,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
<<<<<<< HEAD
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surfaceDim,
=======
    paddingVertical: Space.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surfaceDim,
    zIndex: 2,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  footerText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 0.8,
  },
<<<<<<< HEAD
  pressed: {
    opacity: 0.65,
  },
=======
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
});
