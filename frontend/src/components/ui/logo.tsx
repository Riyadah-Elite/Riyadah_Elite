import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Fonts, Palette, Radius } from '@/constants/design';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showMark?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const MARK_SIZE = { sm: 30, md: 38, lg: 46 };
const TITLE_SIZE = { sm: 13, md: 15, lg: 18 };

export function Logo({
  size = 'md',
  showWordmark = true,
  showMark = true,
  onPress,
  style,
}: LogoProps) {
  const mark = MARK_SIZE[size];

  const content = (
    <View style={[styles.row, style]}>
      {showMark ? (
        <View
          style={[
            styles.mark,
            {
              width: mark,
              height: mark,
              borderRadius: mark * 0.3,
            },
          ]}>
          <LinearGradient
            colors={['#E47448', '#C64F28', '#9A3515']}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.95, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.markInner} />
          <Text style={[styles.markLetter, { fontSize: mark * 0.5 }]}>R</Text>
        </View>
      ) : null}

      {showWordmark ? (
        <View style={styles.wordmark}>
          <Text style={[styles.brand, { fontSize: TITLE_SIZE[size] }]}>RIYADAH</Text>
          <Text style={styles.elite}>ELITE</Text>
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityLabel="Riyadah Elite home"
        accessibilityRole="link"
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderRadius: Radius.md,
  },
  markLetter: {
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Palette.onPrimary,
    letterSpacing: -0.8,
    marginTop: -1,
  },
  wordmark: {
    gap: 0,
  },
  brand: {
    fontFamily: Fonts.display,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: Palette.text,
    lineHeight: 20,
  },
  elite: {
    fontFamily: Fonts.body,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 3.6,
    color: Palette.primary,
    lineHeight: 12,
  },
  pressed: {
    opacity: 0.72,
  },
});
