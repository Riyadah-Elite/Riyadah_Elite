/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from 'expo-router';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#172B3A',
    background: '#F8FCFF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EFF6FF',
    textSecondary: '#5B7083',
    // Brand Tokens
    brandBg: '#F8FCFF',
    brandSurface: '#FFFFFF',
    brandCyanPale: '#A5F3FC',
    brandCyanAction: '#0891B2',
    brandCyanDark: '#0E7490',
    brandBlueLight: '#EFF6FF',
    brandViolet: '#8B5CF6',
    brandMint: '#D1FAE5',
    brandWarm: '#FFEDD5',
    brandBorder: '#E2E8F0',
    brandBorderCyan: '#CFFAFE',
    brandGold: '#F59E0B',
    brandGoldLight: '#FEF3C7',
    brandNavy: '#0F172A',
    brandNavyLight: '#1E293B',
    brandCrystal: '#3B82F6',
    brandCrystalLight: '#DBEAFE',
  },
  dark: {
    text: '#F8FCFF',
    background: '#0B131B',
    backgroundElement: '#131F2B',
    backgroundSelected: '#1C2C3D',
    textSecondary: '#94A3B8',
    // Brand Tokens
    brandBg: '#0B131B',
    brandSurface: '#131F2B',
    brandCyanPale: '#0891B2',
    brandCyanAction: '#06B6D4',
    brandCyanDark: '#22D3EE',
    brandBlueLight: '#1E293B',
    brandViolet: '#A78BFA',
    brandMint: '#10B981',
    brandWarm: '#F97316',
    brandBorder: '#334155',
    brandBorderCyan: '#164E63',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const RiyadahLightTheme: typeof NavDefaultTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    primary: Colors.light.brandCyanAction,
    background: Colors.light.background,
    card: Colors.light.backgroundElement,
    text: Colors.light.text,
    border: Colors.light.brandBorder,
    notification: Colors.light.brandViolet,
  },
};

export const RiyadahDarkTheme: typeof NavDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: Colors.dark.brandCyanAction,
    background: Colors.dark.background,
    card: Colors.dark.backgroundElement,
    text: Colors.dark.text,
    border: Colors.dark.brandBorder,
    notification: Colors.dark.brandViolet,
  },
};
