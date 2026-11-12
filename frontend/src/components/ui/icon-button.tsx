import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import {
  Palette,
  Radius,
  Typography,
  neoShadow,
  neoShadowPressed,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  badge?: number;
  active?: boolean;
  label: string;
  round?: boolean;
  tone?: 'default' | 'violet' | 'lime';
  style?: ViewStyle;
}

/**
 * Borderless neomorphic icon shell. The control reads as part of the warm
 * surface through paired light and shadow, not through a visible outline.
 */
export function IconButton({
  name,
  onPress,
  size = 44,
  iconSize = 19,
  badge,
  active = false,
  label,
  round = false,
  tone = 'default',
  style,
}: IconButtonProps) {
  const { hovered, hoverProps } = useHover();
  const accent =
    tone === 'lime' ? Palette.secondary : tone === 'violet' ? Palette.primary : Palette.text;

  return (
    <Pressable
      {...hoverProps}
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: round ? size / 2 : Radius.md,
          backgroundColor: active ? Palette.primaryWash : Palette.surface,
        },
        pressed || active ? neoShadowPressed : neoShadow,
        pressed && styles.pressed,
        hovered && styles.hovered,
        style,
      ]}>
      <Ionicons
        name={name}
        size={iconSize}
        color={active ? Palette.primary : hovered ? accent : Palette.textMuted}
      />

      {badge !== undefined && badge > 0 ? (
        <View style={[styles.badge, webBackdrop]}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  hovered: {
    backgroundColor: Palette.elevated,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primary,
    borderWidth: 2,
    borderColor: Palette.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...Typography.labelTight,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0,
    color: Palette.onPrimary,
  },
});
