import { Platform, type TextStyle, type ViewStyle } from 'react-native';

/**
 * Play Point design tokens.
 *
 * "Arena Paper": warm porcelain surfaces, ink typography and a burnt-orange
 * signal. The palette is light-first so claymorphic cards, milky glass panels
 * and neomorphic controls can all share the same warm material instead of
 * fighting a black canvas.
 */
export const Palette = {
  canvas: '#EAF4F9',
  surface: '#F0F8FC',
  surfaceDim: '#DCEEF5',
  card: '#FFFFFF',
  elevated: '#FFFFFF',
  raised: '#E4F3FA',
  border: '#C2E3F0',
  borderStrong: '#1769FF',

  primary: '#1769FF',
  primaryBright: '#367EFF',
  primaryDeep: '#0F53D1',
  onPrimary: '#FFFFFF',
  primaryWash: 'rgba(23, 105, 255, 0.10)',
  primaryWashStrong: 'rgba(23, 105, 255, 0.18)',
  primaryGlow: 'rgba(23, 105, 255, 0.28)',

  secondary: '#A6DCEF',
  secondaryDim: '#8ECFE6',
  onSecondary: '#0B2447',

  tertiary: '#0E55DA',
  tertiaryDeep: '#0B48A8',
  onTertiary: '#FFFFFF',
  warning: '#D97706',
  danger: '#DC2626',
  dangerWash: 'rgba(220, 38, 38, 0.10)',

  text: '#0B2447',
  textMuted: '#3B577D',
  textDim: '#4A6B94',
  textFaint: '#6F8CAE',

  glass: 'rgba(255, 255, 255, 0.85)',
  glassStrong: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(166, 220, 239, 0.45)',
  glassHighlight: 'rgba(255, 255, 255, 0.90)',
  overlay: 'rgba(11, 36, 71, 0.55)',
  white: '#FFFFFF',

  bronze: '#96602F',
  silver: '#6F665C',
  gold: '#8A5F08',
  platinum: '#0F53D1',
  diamond: '#1769FF',
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 26,
  clay: 28,
  pill: 999,
} as const;

export const Space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  huge: 96,
} as const;

export const Fonts = {
  display: 'Sora',
  body: 'Geist',
} as const;

export const Breakpoints = {
  mobile: 768,
  wide: 1200,
} as const;

export const Layout = {
  sidebar: 260,
  sidebarCompact: 92,
  maxContent: 1160,
  headerHeight: 72,
  tabBarHeight: 68,
} as const;

export const Typography = {
  displayXl: {
    fontFamily: Fonts.display,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: '700',
    letterSpacing: -1.8,
    color: Palette.text,
  } satisfies TextStyle,
  displayLg: {
    fontFamily: Fonts.display,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '700',
    letterSpacing: -1.3,
    color: Palette.text,
  } satisfies TextStyle,
  displayMobile: {
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.9,
    color: Palette.text,
  } satisfies TextStyle,
  headline: {
    fontFamily: Fonts.display,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.5,
    color: Palette.text,
  } satisfies TextStyle,
  headlineMobile: {
    fontFamily: Fonts.display,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: Palette.text,
  } satisfies TextStyle,
  title: {
    fontFamily: Fonts.display,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: Palette.text,
  } satisfies TextStyle,
  bodyLg: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    letterSpacing: -0.15,
    color: Palette.textMuted,
  } satisfies TextStyle,
  body: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.05,
    color: Palette.textMuted,
  } satisfies TextStyle,
  bodySm: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: Palette.textMuted,
  } satisfies TextStyle,
  label: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: Palette.textMuted,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  labelTight: {
    fontFamily: Fonts.body,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: Palette.textMuted,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  button: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.1,
  } satisfies TextStyle,
  numeric: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
    color: Palette.text,
  } satisfies TextStyle,
  numericSm: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: Palette.textMuted,
  } satisfies TextStyle,
} as const;

/** Soft top light + arctic lower shadow: the neomorphic control shell. */
export const neoShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '4px 4px 10px rgba(11, 36, 71, 0.08), -5px -5px 12px rgba(255, 255, 255, 0.95)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
});

/** Pressed state: the shell is pushed into the surface. */
export const neoShadowPressed = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      'inset 3px 3px 7px rgba(11, 36, 71, 0.14), inset -3px -3px 7px rgba(255, 255, 255, 0.90)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

/** Strict Neumorphic Button: Dual extruded outer shadows for standard buttons. */
export const neoButtonShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '4px 4px 10px rgba(11, 36, 71, 0.10), -4px -4px 10px rgba(255, 255, 255, 0.95)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
});

export const neoButtonHoverShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '5px 5px 14px rgba(11, 36, 71, 0.15), -5px -5px 13px rgba(255, 255, 255, 0.98)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 7,
  },
});

export const neoButtonPressedShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      'inset 3px 3px 7px rgba(11, 36, 71, 0.18), inset -3px -3px 7px rgba(255, 255, 255, 0.90)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

/** Strict Neumorphic Button: Dual outer shadows for Primary (Electric Blue) buttons. */
export const neoPrimaryShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '4px 4px 12px rgba(23, 105, 255, 0.35), -4px -4px 10px rgba(255, 255, 255, 0.85)',
  },
  default: {
    shadowColor: '#0F53D1',
    shadowOffset: { width: 4, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
});

export const neoPrimaryHoverShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '5px 5px 16px rgba(23, 105, 255, 0.45), -5px -5px 12px rgba(255, 255, 255, 0.92)',
  },
  default: {
    shadowColor: '#0F53D1',
    shadowOffset: { width: 5, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});

export const neoPrimaryPressedShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      'inset 3px 3px 7px rgba(15, 83, 209, 0.50), inset -3px -3px 7px rgba(166, 220, 239, 0.35)',
  },
  default: {
    shadowColor: '#0F53D1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});

/** Cards float above the canvas on an ice plume of shadow with dual inner highlight/shade. */
export const clayShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '0 20px 40px rgba(11, 36, 71, 0.08), 0 4px 10px rgba(11, 36, 71, 0.04), inset 2px 2px 4px rgba(255, 255, 255, 0.95), inset -3px -3px 6px rgba(166, 220, 239, 0.15)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 12,
  },
});

/**
 * Strict Claymorphism for Popups & Modals:
 * 28px border-radius, matte inflated surface, dual inner shadows
 * (top-left light highlight + bottom-right deep shade) + soft outer drop shadow.
 */
export const modalShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '0 28px 60px rgba(11, 36, 71, 0.18), 0 8px 18px rgba(11, 36, 71, 0.08), inset 2px 2px 5px rgba(255, 255, 255, 0.95), inset -3px -3px 7px rgba(166, 220, 239, 0.20)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 20,
  },
});

export const clayModalShadow = modalShadow;

/** Strict Glassmorphism: Frosted floating toast elevation. */
export const glassToastShadow = Platform.select<ViewStyle>({
  web: {
    boxShadow:
      '0 16px 36px rgba(11, 36, 71, 0.12), 0 4px 10px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.90)',
  },
  default: {
    shadowColor: '#0B2447',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
});

/** Focus/hover emission used on tournament and live-match surfaces. */
export const accentGlow = '0 0 18px rgba(23, 105, 255, 0.35)';

export const webBackdrop = Platform.select<ViewStyle>({
  web: {
    backdropFilter: 'blur(16px) saturate(180%)',
    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  } as ViewStyle,
  default: {},
});

/** React Native shadow props are a no-op on web, boxShadow is a no-op on native. */
export function neoSurface(pressed = false): ViewStyle {
  return pressed ? (neoShadowPressed ?? {}) : (neoShadow ?? {});
}
