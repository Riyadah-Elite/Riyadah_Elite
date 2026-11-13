import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  neoButtonHoverShadow,
  neoButtonPressedShadow,
  neoButtonShadow,
  neoPrimaryHoverShadow,
  neoPrimaryPressedShadow,
  neoPrimaryShadow,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

type Variant = 'lime' | 'violet' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const SIZES: Record<Size, { paddingH: number; height: number; fontSize: number }> = {
  sm: { paddingH: 15, height: 38, fontSize: 12 },
  md: { paddingH: 20, height: 46, fontSize: 13 },
  lg: { paddingH: 24, height: 52, fontSize: 14 },
};

/**
 * Strict Neumorphic Button.
 *
 * Laws satisfied:
 * - Extruded dual outer shadows in default & hover states.
 * - Inset pressed shadow state when active/pressed.
 * - Tactile elevation across Web and Native.
 */
export function Button({
  label,
  onPress,
  variant = 'lime',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { hovered, hoverProps } = useHover();
  const isDisabled = disabled || loading;
  const metrics = SIZES[size];

  const paint = getPaint(variant, isDisabled);

  return (
    <Pressable
      {...hoverProps}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: metrics.height,
          paddingHorizontal: metrics.paddingH,
          backgroundColor:
            pressed && !isDisabled
              ? paint.pressedBackground
              : hovered && !isDisabled
                ? paint.hoverBackground
                : paint.background,
          borderColor: paint.border,
        },
        fullWidth && styles.fullWidth,
        // Neumorphic shadow states
        isDisabled
          ? null
          : pressed
            ? [styles.pressed, paint.pressedShadow]
            : hovered
              ? [styles.hovered, paint.hoverShadow]
              : paint.defaultShadow,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={paint.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' ? (
            <Ionicons name={icon} size={15} color={paint.text} />
          ) : null}

          <Text style={[Typography.button, { color: paint.text, fontSize: metrics.fontSize }]}>
            {label}
          </Text>

          {icon && iconPosition === 'right' ? (
            <Ionicons name={icon} size={15} color={paint.text} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

function getPaint(variant: Variant, disabled: boolean) {
  if (disabled) {
    return {
      background: Palette.surfaceDim,
      hoverBackground: Palette.surfaceDim,
      pressedBackground: Palette.surfaceDim,
      border: Palette.border,
      text: Palette.textFaint,
      defaultShadow: null,
      hoverShadow: null,
      pressedShadow: null,
    };
  }

  switch (variant) {
    case 'violet':
      return {
        background: Palette.text,
        hoverBackground: '#34281F',
        pressedBackground: '#1A1410',
        border: 'transparent',
        text: Palette.onPrimary,
        defaultShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              '4px 4px 10px rgba(0, 0, 0, 0.32), -3px -3px 8px rgba(255, 255, 255, 0.22)',
          },
          default: {
            shadowColor: '#000000',
            shadowOffset: { width: 3, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 6,
            elevation: 5,
          },
        }),
        hoverShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              '5px 5px 14px rgba(0, 0, 0, 0.40), -4px -4px 11px rgba(255, 255, 255, 0.30)',
          },
          default: {
            shadowColor: '#000000',
            shadowOffset: { width: 4, height: 6 },
            shadowOpacity: 0.34,
            shadowRadius: 8,
            elevation: 7,
          },
        }),
        pressedShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              'inset 3px 3px 7px rgba(0, 0, 0, 0.65), inset -3px -3px 7px rgba(255, 255, 255, 0.12)',
          },
          default: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          },
        }),
      };

    case 'ghost':
      return {
        background: 'transparent',
        hoverBackground: Palette.primaryWash,
        pressedBackground: Palette.primaryWashStrong,
        border: Palette.borderStrong,
        text: Palette.text,
        defaultShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              '2px 2px 6px rgba(136, 104, 74, 0.12), -2px -2px 6px rgba(255, 255, 255, 0.70)',
          },
          default: {
            shadowColor: '#7A5A3E',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.10,
            shadowRadius: 4,
            elevation: 2,
          },
        }),
        hoverShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              '3px 3px 9px rgba(136, 104, 74, 0.18), -3px -3px 8px rgba(255, 255, 255, 0.85)',
          },
          default: {
            shadowColor: '#7A5A3E',
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.14,
            shadowRadius: 6,
            elevation: 4,
          },
        }),
        pressedShadow: Platform.select<ViewStyle>({
          web: {
            boxShadow:
              'inset 2px 2px 5px rgba(136, 104, 74, 0.20), inset -2px -2px 5px rgba(255, 255, 255, 0.75)',
          },
          default: {
            elevation: 0,
          },
        }),
      };

    case 'dark':
      return {
        background: Palette.surfaceDim,
        hoverBackground: Palette.elevated,
        pressedBackground: Palette.raised,
        border: 'rgba(255,255,255,0.4)',
        text: Palette.text,
        defaultShadow: neoButtonShadow,
        hoverShadow: neoButtonHoverShadow,
        pressedShadow: neoButtonPressedShadow,
      };

    case 'lime':
    default:
      return {
        background: Palette.primary,
        hoverBackground: Palette.primaryBright,
        pressedBackground: Palette.primaryDeep,
        border: 'rgba(255, 255, 255, 0.25)',
        text: Palette.onPrimary,
        defaultShadow: neoPrimaryShadow,
        hoverShadow: neoPrimaryHoverShadow,
        pressedShadow: neoPrimaryPressedShadow,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
  },
  hovered: {
    transform: [{ translateY: -1 }],
  },
  pressed: {
    transform: [{ scale: 0.985 }, { translateY: 1 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

/** Shared by the header/auth screens for text-only links. */
export const buttonText = StyleSheet.create({
  base: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
