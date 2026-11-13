import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Palette, Radius, Typography } from '@/constants/design';

/** Pulsing live indicator used by LIVE / IN-MATCH status chips. */
export function PulseDot({ color = Palette.tertiary, size = 6 }: { color?: string; size?: number }) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={[styles.dotWrap, { width: size + 6, height: size + 6 }]}>
      <Animated.View
        style={[
          styles.dotGlow,
          {
            width: size + 6,
            height: size + 6,
            borderRadius: (size + 6) / 2,
            backgroundColor: color,
            opacity: opacity.interpolate({ inputRange: [0.25, 1], outputRange: [0.1, 0.22] }),
          },
        ]}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

interface StatusBadgeProps {
  label: string;
  color?: string;
  dot?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  subtle?: boolean;
}

export function StatusBadge({
  label,
  color = Palette.tertiary,
  dot = false,
  icon,
  subtle = false,
}: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: subtle ? Palette.surfaceDim : `${color}16`,
          borderColor: subtle ? 'transparent' : `${color}30`,
        },
      ]}>
      {dot ? <PulseDot color={color} size={5} /> : null}
      {icon ? <Ionicons name={icon} size={11} color={color} /> : null}
      <Text style={[styles.badgeText, { color: subtle ? Palette.textMuted : color }]}>{label}</Text>
    </View>
  );
}

/** Passive tag for card metadata (no status semantics). */
export function Chip({ label, icon }: { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.chip}>
      {icon ? <Ionicons name={icon} size={11} color={Palette.textDim} /> : null}
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotGlow: {
    position: 'absolute',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.labelTight,
    fontSize: 9,
    lineHeight: 12,
    letterSpacing: 0.8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Palette.surfaceDim,
  },
  chipText: {
    ...Typography.labelTight,
    color: Palette.textMuted,
    fontSize: 9,
    letterSpacing: 0.6,
  },
});
