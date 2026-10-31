import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { theme } from '../../shared/theme';

export const MobileNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (route: string) => {
    if (route === '/') return pathname === '/' || pathname === '';
    return pathname.startsWith(route);
  };

  const navItems = [
    { key: 'home', label: 'Home', route: '/', icon: 'game-controller' as const },
    { key: 'tournaments', label: 'Tournaments', route: '/tournaments', icon: 'trophy' as const },
    { key: 'games', label: 'Testing', route: '/games', icon: 'flask' as const },
    { key: 'bug-report', label: 'Bugs', route: '/bug-report', icon: 'bug' as const },
    { key: 'profile', label: 'Profile', route: '/profile', icon: 'person' as const },
  ];

  return (
    <View style={styles.bar}>
      {navItems.map((item) => {
        const active = isRouteActive(item.route);
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tab}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={active ? theme.colors.brand.accent : theme.colors.text.muted}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: theme.spacing.layout.mobileNavHeight,
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 50,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.text.muted,
  },
  labelActive: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
});

