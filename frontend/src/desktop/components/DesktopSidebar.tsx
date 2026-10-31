import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { theme } from '../../shared/theme';

interface DesktopSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  key: string;
  label: string;
  route: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home Nexus', route: '/', icon: 'game-controller' },
  { key: 'tournaments', label: 'Tournaments', route: '/tournaments', icon: 'trophy' },
  { key: 'games', label: 'Game Testing', route: '/games', icon: 'flask' },
  { key: 'bug-report', label: 'Bug Reports', route: '/bug-report', icon: 'bug' },
  { key: 'notifications', label: 'Alerts & Telemetry', route: '/notifications', icon: 'notifications' },
  { key: 'profile', label: 'Commander Profile', route: '/profile', icon: 'person' },
];

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    if (route === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(route);
  };

  return (
    <View style={[styles.container, collapsed ? styles.collapsed : styles.expanded]}>
      {/* Brand Logo & Title */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>R</Text>
        </View>
        {!collapsed && (
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>
              RIYADAH <Text style={{ color: theme.colors.brand.secondary }}>ELITE</Text>
            </Text>
            <Text style={styles.brandSubtitle}>ESPORTS & QA NEXUS</Text>
          </View>
        )}
      </View>

      {/* Nav List */}
      <View style={styles.navSection}>
        {NAV_ITEMS.map((item) => {
          const active = isRouteActive(item.route);
          return (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.navItem,
                active && styles.navItemActive,
                collapsed && styles.navItemCollapsed,
              ]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? theme.colors.brand.accent : theme.colors.text.muted}
              />
              {!collapsed && (
                <Text style={[styles.navText, active && styles.navTextActive]}>
                  {item.label}
                </Text>
              )}
              {active && !collapsed && <View style={styles.activeBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Rail / Collapse Toggle */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.collapseButton}
          onPress={onToggleCollapse}
          activeOpacity={0.7}
        >
          <Ionicons
            name={collapsed ? 'chevron-forward' : 'chevron-back'}
            size={18}
            color={theme.colors.text.muted}
          />
          {!collapsed && <Text style={styles.collapseText}>Collapse Sidebar</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.subtle,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    zIndex: 40,
  },
  expanded: {
    width: theme.spacing.layout.sidebarExpanded,
    paddingHorizontal: 16,
  },
  collapsed: {
    width: theme.spacing.layout.sidebarCollapsed,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.lg,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.violetGlow,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
  },
  brandTextCol: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.brand.accent,
    letterSpacing: 1.2,
  },
  navSection: {
    flex: 1,
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.borders.radius.md,
    gap: 12,
    position: 'relative',
  },
  navItemCollapsed: {
    paddingHorizontal: 0,
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  navItemActive: {
    backgroundColor: 'rgba(112, 41, 245, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(112, 41, 245, 0.3)',
  },
  navText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  navTextActive: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
  activeBar: {
    position: 'absolute',
    right: 0,
    width: 3,
    height: 20,
    borderRadius: 2,
    backgroundColor: theme.colors.brand.accent,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    paddingTop: 16,
  },
  collapseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  collapseText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
});

