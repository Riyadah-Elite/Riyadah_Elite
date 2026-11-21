import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import {
  Palette,
  Radius,
  neoButtonHoverShadow,
  neoButtonPressedShadow,
  neoButtonShadow,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

export interface IconButtonProps {
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
 * Strict Neumorphic Icon Button.
 *
 * Laws satisfied:
 * - Extruded dual outer shadows in default and hover states.
 * - Inset pressed shadow state when pressed or active.
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
          backgroundColor: active
            ? Palette.primaryWash
            : pressed
              ? Palette.raised
              : hovered
                ? Palette.elevated
                : Palette.surface,
          borderColor: active ? Palette.primary : 'rgba(255,255,255,0.6)',
        },
        pressed || active
          ? neoButtonPressedShadow
          : hovered
            ? neoButtonHoverShadow
            : neoButtonShadow,
        pressed && styles.pressed,
        hovered && !pressed && styles.hovered,
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
    borderWidth: 1,
    overflow: 'visible',
  },
  hovered: {
    transform: [{ translateY: -1 }],
  },
  pressed: {
    transform: [{ scale: 0.97 }, { translateY: 1 }],
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.elevated,
  },
  badgeText: {
    color: Palette.onPrimary,
    fontSize: 9,
    fontWeight: '700',
  },
});
