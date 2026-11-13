import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NAV_ITEMS } from '@/constants/navigation';
import { Fonts, Layout, Palette, Space, webBackdrop } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

export function MobileTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        webBackdrop,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}>
      <View style={styles.row}>
        {NAV_ITEMS.map((item) => (
          <TabItem
            key={item.key}
            active={pathname === item.href}
            item={item}
            onPress={() => router.replace(item.href)}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({
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
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && { transform: [{ scale: 0.96 }] }]}>
      <Ionicons
        name={active ? item.activeIcon : item.icon}
        size={22}
        color={active ? Palette.primary : hovered ? Palette.text : Palette.textDim}
      />

      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {item.shortLabel}
      </Text>

    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: Layout.tabBarHeight,
    backgroundColor: Palette.glassStrong,
    borderTopWidth: 1,
    borderTopColor: Palette.glassBorder,
    zIndex: 200,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 9,
    paddingHorizontal: Space.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 9,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: Palette.textFaint,
  },
  labelActive: {
    color: Palette.primaryBright,
    fontWeight: '600',
  },
});
