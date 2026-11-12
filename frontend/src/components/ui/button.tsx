import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  neoShadowPressed,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

type Variant = 'lime' | 'violet' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
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

  const paint = getPaint(variant, hovered, isDisabled);

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
          backgroundColor: paint.background,
          borderColor: paint.border,
        },
        paint.shadow ? ({ boxShadow: paint.shadow } as ViewStyle) : null,
        fullWidth && styles.fullWidth,
        hovered && !isDisabled ? paint.hoverShadow : null,
        pressed && !isDisabled
          ? [styles.pressed, neoShadowPressed, { backgroundColor: paint.pressedBackground }]
          : null,
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

function getPaint(variant: Variant, hovered: boolean, disabled: boolean) {
  if (disabled) {
    return {
      background: Palette.surfaceDim,
      border: Palette.border,
      text: Palette.textFaint,
      pressedBackground: Palette.surfaceDim,
      shadow: undefined,
      hoverShadow: undefined,
    };
  }

  switch (variant) {
    case 'violet':
      return {
        background: hovered ? '#34281F' : Palette.text,
        border: hovered ? '#34281F' : Palette.text,
        text: Palette.onPrimary,
        pressedBackground: '#1A1410',
        shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 18px rgba(36, 28, 22, 0.18)',
        hoverShadow: {
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 22px rgba(36,28,22,0.22)',
        },
      };
    case 'ghost':
      return {
        background: hovered ? Palette.primaryWash : 'transparent',
        border: hovered ? Palette.primary : Palette.borderStrong,
        text: hovered ? Palette.primaryBright : Palette.text,
        pressedBackground: Palette.primaryWashStrong,
        shadow: undefined,
        hoverShadow: undefined,
      };
    case 'dark':
      return {
        background: hovered ? Palette.elevated : Palette.surfaceDim,
        border: hovered ? Palette.borderStrong : 'transparent',
        text: Palette.text,
        pressedBackground: Palette.raised,
        shadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 4px 10px rgba(108,74,48,0.08)',
        hoverShadow: undefined,
      };
    case 'lime':
    default:
      return {
        background: hovered ? Palette.primaryBright : Palette.primary,
        border: hovered ? Palette.primaryBright : Palette.primary,
        text: Palette.onPrimary,
        pressedBackground: Palette.primaryDeep,
        shadow:
          'inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 10px 22px rgba(198, 79, 40, 0.22)',
        hoverShadow: {
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.24), 0 12px 26px rgba(198,79,40,0.28)',
        } as ViewStyle,
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
  pressed: {
    transform: [{ scale: 0.985 }],
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
