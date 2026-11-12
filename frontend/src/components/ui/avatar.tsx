import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { initials } from '@/lib/format';

interface AvatarProps {
  name: string;
  uri?: string | null;
  size?: number;
  ring?: boolean;
  online?: boolean;
}

export function Avatar({ name, uri, size = 40, ring = false, online = false }: AvatarProps) {
  return (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: ring ? Palette.primary : Palette.border,
          borderWidth: ring ? 2 : 1,
        },
      ]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          contentFit="cover"
          transition={160}
          accessibilityLabel={`${name} avatar`}
        />
      ) : (
        <LinearGradient
          colors={['#E06A3E', '#C64F28']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}>
          <Text style={[styles.initials, { fontSize: Math.max(10, size * 0.32) }]}>
            {initials(name)}
          </Text>
        </LinearGradient>
      )}

      {online ? (
        <View
          style={[
            styles.online,
            {
              width: Math.max(9, size * 0.24),
              height: Math.max(9, size * 0.24),
              borderRadius: size,
              borderWidth: Math.max(1, size * 0.04),
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: Palette.raised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Palette.onPrimary,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  online: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Palette.tertiary,
    borderColor: Palette.surface,
  },
});
