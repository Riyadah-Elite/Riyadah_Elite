import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import {
  Palette,
  Radius,
  Space,
  clayShadow,
  neoShadow,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

interface ClayCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  interactive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  glass?: boolean;
}

/**
 * The primary claymorphic surface.
 *
 * Native cannot draw inset shadows, so the top highlight is a real 1px
 * gradient strip; on web the full inset/ambient plume is painted with CSS.
 */
export function ClayCard({
  children,
  style,
  padded = true,
  interactive = false,
  onPress,
  accessibilityLabel,
  glass = false,
}: ClayCardProps) {
  const { hovered, hoverProps } = useHover();

  const content = (
    <>
      <LinearGradient
        colors={['rgba(255,255,255,0.55)', 'rgba(198,79,40,0.05)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topEdge}
      />

      {glass ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)', 'rgba(198,79,40,0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}

      <View style={padded ? styles.padded : undefined}>{children}</View>
    </>
  );

  if (interactive) {
    return (
      <Pressable
        {...hoverProps}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          glass && styles.glassCard,
          clayShadow,
          hovered && styles.hovered,
          hovered && { transform: [{ translateY: -3 }] },
          pressed && styles.pressed,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, glass && styles.glassCard, clayShadow, style]}>{content}</View>;
}

/**
 * Lighter surface for dense data rows and tables. The inset rim reads as part
 * of the panel rather than a floating card.
 */
export function Panel({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}) {
  return (
    <View style={[styles.panel, panelShadow, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
        style={styles.panelEdge}
      />
      <View style={padded ? styles.padded : undefined}>{children}</View>
    </View>
  );
}

const panelShadow = neoShadow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  glassCard: {
    backgroundColor: Palette.glass,
    borderColor: Palette.glassBorder,
    ...webBackdrop,
  },
  hovered: {
    borderColor: Palette.primaryWashStrong,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  padded: {
    padding: Space.lg,
  },
  panel: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  panelEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
