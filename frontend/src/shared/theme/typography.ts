import { TextStyle } from 'react-native';

export const typography = {
  fontFamily: {
    heading: 'System', // Space Grotesk / System Bold
    body: 'System', // Inter / System Regular
    mono: 'monospace', // JetBrains Mono / System Monospace
  },
  fontSize: {
    xxs: 10,
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 36,
    '5xl': 48,
    '6xl': 56,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
  fontWeight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
} as const;

export type Typography = typeof typography;

