import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { formatNumber, tierColor, titleCase } from '@/lib/format';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

import { Avatar } from '../ui/avatar';

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { hovered, hoverProps } = useHover();

  if (!user) return null;

  return (
    <>
      <Pressable
        {...hoverProps}
        accessibilityLabel="Open profile menu"
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          hovered && styles.triggerHover,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}>
        <Avatar name={user.username} ring size={38} uri={user.avatarUrl} />
      </Pressable>

      <ProfileModal onClose={() => setOpen(false)} visible={open} />
    </>
  );
}

function ProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const rank = user.testingRank ?? 'unranked';
  const points = user.testingPoints ?? 0;
  const color = tierColor(rank);
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await logout();
      onClose();
      showToast({
        title: 'Session terminated',
        message: 'Your access token has been revoked. See you in the arena.',
        variant: 'info',
      });
      router.replace('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close profile menu"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.scrim]}
        />

        <View
          style={[
            styles.panel,
            clayShadow,
            webBackdrop,
            isMobile
              ? { left: 12, right: 12, bottom: insets.bottom + 10 }
              : { right: Space.lg, top: insets.top + 82, width: 312 },
          ]}>
          <View style={styles.identity}>
            <Avatar name={user.username} online ring size={52} uri={user.avatarUrl} />
            <View style={styles.identityCopy}>
              <Text style={styles.username} numberOfLines={1}>
                {user.username}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
            <View style={styles.roleChip}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          <View style={styles.rankCard}>
            <View style={styles.rankTop}>
              <View style={styles.rankLabelRow}>
                <Ionicons name="shield-half" size={13} color={color} />
                <Text style={styles.rankLabel}>Testing tier</Text>
              </View>
              <Text style={[styles.rankTitle, { color }]}>{titleCase(rank)}</Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(progress, 2)}%`, backgroundColor: color },
                ]}
              />
            </View>

            <View style={styles.rankBottom}>
              <Text style={styles.points}>{formatNumber(points)} PTS</Text>
              <Text style={styles.pointsCap}>1,500 CAP</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <MenuAction
              icon="person-outline"
              label="Account settings"
              onPress={() => {
                onClose();
                showToast({
                  title: 'Account settings',
                  message: 'Profile controls are coming online soon.',
                  variant: 'info',
                });
              }}
            />
            <MenuAction
              icon="notifications-outline"
              label="Notification preferences"
              onPress={() => {
                onClose();
                showToast({
                  title: 'Notification preferences',
                  message: 'Channel controls are being wired to the arena core.',
                  variant: 'info',
                });
              }}
            />
            <MenuAction
              icon="help-circle-outline"
              label="Support channel"
              onPress={() => {
                onClose();
                showToast({
                  title: 'Support channel',
                  message: 'A support operative will be available shortly.',
                  variant: 'info',
                });
              }}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={signingOut}
            onPress={() => void handleSignOut()}
            style={({ pressed }) => [
              styles.signOut,
              pressed && { backgroundColor: 'rgba(178, 58, 58, 0.14)' },
            ]}>
            {signingOut ? (
              <ActivityIndicator color={Palette.danger} size="small" />
            ) : (
              <Ionicons name="log-out-outline" size={16} color={Palette.danger} />
            )}
            <Text style={styles.signOutText}>Sign out</Text>
            <Ionicons name="chevron-forward" size={13} color="rgba(178,58,58,0.55)" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function MenuAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        hovered && styles.actionHover,
        pressed && { opacity: 0.75 },
      ]}>
      <Ionicons name={icon} size={16} color={hovered ? Palette.primaryBright : Palette.textMuted} />
      <Text style={[styles.actionText, hovered && { color: Palette.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={13} color={Palette.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  triggerHover: {
    opacity: 0.88,
  },
  modalRoot: {
    flex: 1,
  },
  scrim: {
    backgroundColor: 'rgba(36, 28, 22, 0.34)',
  },
  panel: {
    position: 'absolute',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    backgroundColor: Palette.glassStrong,
    overflow: 'hidden',
    padding: Space.md,
    gap: Space.md,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: Space.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  identityCopy: {
    flex: 1,
    gap: 2,
  },
  username: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  email: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Palette.primaryWash,
  },
  roleText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.primaryBright,
  },
  rankCard: {
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceDim,
    padding: 12,
    gap: 10,
  },
  rankTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rankLabel: {
    ...Typography.labelTight,
    color: Palette.textMuted,
    fontSize: 9,
  },
  rankTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  progressTrack: {
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: Radius.pill,
  },
  rankBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  points: {
    ...Typography.numericSm,
    color: Palette.text,
  },
  pointsCap: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
  },
  actions: {
    gap: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
  },
  actionHover: {
    backgroundColor: Palette.primaryWash,
  },
  actionText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
    backgroundColor: Palette.dangerWash,
  },
  signOutText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.danger,
    letterSpacing: 0.2,
  },
});
