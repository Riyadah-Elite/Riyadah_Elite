import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NAV_ITEMS } from '@/constants/navigation';
import {
  Fonts,
  Layout,
  Palette,
  Radius,
  Space,
  Typography,
  clayShadow,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { formatNumber, titleCase } from '@/lib/format';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';

import { Button } from '../ui/button';
import { Logo } from '../ui/logo';
import { PulseDot } from '../ui/badge';

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const { openAuth } = useAuthModal();

  const points = user?.testingPoints ?? 0;
  const rank = user?.testingRank ?? 'bronze 3';
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  return (
    <View style={styles.root}>
      <View style={styles.brandRow}>
        <Logo onPress={() => router.replace('/')} showMark={false} size="md" />
      </View>

      <Text style={styles.sectionLabel}>Menu</Text>

      <ScrollView
        contentContainerStyle={styles.nav}
        showsVerticalScrollIndicator={false}
        style={styles.navScroll}>
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.key}
            active={pathname === item.href}
            item={item}
            onPress={() => router.replace(item.href)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={[styles.seasonCard, clayShadow]}>
          <View style={styles.seasonTop}>
            <Text style={styles.seasonLabel}>Season 04</Text>
            <View style={styles.seasonBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.seasonBadgeText}>Ranked</Text>
            </View>
          </View>

          {isAuthenticated && user ? (
            <>
              <View style={styles.tierRow}>
                <Text style={styles.tierName}>{titleCase(rank)}</Text>
                <Text style={styles.tierPoints}>{formatNumber(points)} PTS</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.max(progress, 2)}%` }]} />
              </View>
              <Text style={styles.seasonMeta}>1,500 point season cap</Text>
            </>
          ) : (
            <>
              <Text style={styles.seasonCopy}>
                Sign in to claim a tier, track points and enter the global ladder.
              </Text>
              <Button
                fullWidth
                label="Create account"
                onPress={() => openAuth('register')}
                size="sm"
                style={{ marginTop: 12 }}
              />
            </>
          )}
        </View>

        <View style={styles.statusRow}>
          <PulseDot color={Palette.tertiary} size={5} />
          <Text style={styles.statusText}>All systems operational</Text>
        </View>

        <Text style={styles.version}>RIYADAH ELITE · v1.0.0</Text>
      </View>
    </View>
  );
}

function SidebarLink({
  item,
  active,
  onPress,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onPress: () => void;
}) {
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="link"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        active && styles.linkActive,
        hovered && !active && styles.linkHover,
        pressed && styles.linkPressed,
      ]}>
      <Ionicons
        name={active ? item.activeIcon : item.icon}
        size={19}
        color={active ? Palette.primary : hovered ? Palette.text : Palette.textDim}
      />

      <Text style={[styles.linkLabel, active && styles.linkLabelActive, hovered && styles.linkLabelHover]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: Layout.sidebar,
    height: '100%',
    backgroundColor: Palette.surface,
    borderRightWidth: 1,
    borderRightColor: Palette.glassBorder,
    paddingHorizontal: 16,
    paddingTop: Space.lg,
    paddingBottom: Space.md,
    gap: Space.md,
  },
  brandRow: {
    paddingHorizontal: 6,
    paddingBottom: Space.sm,
  },
  sectionLabel: {
    ...Typography.labelTight,
    color: Palette.textFaint,
    letterSpacing: 1.4,
    paddingHorizontal: 12,
  },
  navScroll: {
    flex: 1,
  },
  nav: {
    gap: 2,
    paddingTop: 2,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  linkActive: {
    backgroundColor: Palette.primaryWash,
  },
  linkHover: {
    backgroundColor: 'rgba(36, 28, 22, 0.035)',
  },
  linkPressed: {
    opacity: 0.72,
  },
  linkLabel: {
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  linkLabelActive: {
    color: Palette.primaryBright,
    fontWeight: '600',
  },
  linkLabelHover: {
    color: Palette.text,
  },
  bottom: {
    gap: Space.sm,
  },
  seasonCard: {
    padding: Space.md,
    borderRadius: Radius.xl,
    backgroundColor: Palette.card,
    overflow: 'hidden',
  },
  seasonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seasonLabel: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
  },
  seasonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.tertiary,
  },
  seasonBadgeText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    fontWeight: '600',
    color: Palette.tertiary,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tierName: {
    fontFamily: Fonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.text,
  },
  tierPoints: {
    ...Typography.numericSm,
    color: Palette.textDim,
    fontSize: 10,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.surfaceDim,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.primary,
  },
  seasonMeta: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    marginTop: 8,
  },
  seasonCopy: {
    ...Typography.bodySm,
    fontSize: 11,
    lineHeight: 17,
    color: Palette.textDim,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
  },
  statusText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  version: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1,
    paddingHorizontal: 10,
  },
});
