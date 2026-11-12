import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette, Space, Typography, webBackdrop } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuth } from '@/providers/auth-provider';

import { StatusBadge } from '../ui/badge';
import { Logo } from '../ui/logo';
import { NotificationBell } from './notification-center';
import { ProfileMenu } from './profile-menu';

interface TopBarProps {
  title: string;
  eyebrow?: string;
}

/**
 * Authenticated navigation bar. The landing page deliberately renders no top
 * bar for guests - the sidebar / tab bar is the navigation surface until a
 * session exists.
 */
export function TopBar({ title, eyebrow }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
  const { user } = useAuth();

  return (
    <View
      style={[
        styles.root,
        webBackdrop,
        {
          paddingTop: isMobile ? insets.top + 8 : 0,
          minHeight: isMobile ? insets.top + 60 : 76,
        },
      ]}>
      <View style={styles.left}>
        {isMobile ? (
          <View style={styles.mobileBrand}>
            <Logo onPress={() => router.replace('/')} showWordmark={false} size="sm" />
          </View>
        ) : null}

        <View style={styles.titleGroup}>
          <Text style={styles.eyebrow}>{eyebrow ?? 'Riyadah Elite'}</Text>
          <Text numberOfLines={1} style={[styles.title, isMobile && styles.titleMobile]}>
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {!isMobile ? (
          <>
            <StatusBadge subtle dot label="Online" />
            <View style={styles.separator} />
          </>
        ) : null}

        <NotificationBell />
        <ProfileMenu />
      </View>

      {isMobile && user ? <View pointerEvents="none" style={styles.bottomHairline} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    paddingHorizontal: Space.lg,
    paddingBottom: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.glassBorder,
    backgroundColor: Palette.glass,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    flex: 1,
  },
  mobileBrand: {
    marginRight: 4,
  },
  titleGroup: {
    gap: 2,
    flexShrink: 1,
  },
  eyebrow: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.3,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Palette.text,
    letterSpacing: -0.3,
  },
  titleMobile: {
    fontSize: 15,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  separator: {
    width: 1,
    height: 22,
    backgroundColor: Palette.border,
  },
  bottomHairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 1,
    backgroundColor: Palette.primaryWash,
  },
});
