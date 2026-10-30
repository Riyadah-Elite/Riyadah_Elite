import { Platform, ViewStyle } from 'react-native';

export const shadows = {
  sm: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    } as unknown as ViewStyle,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
  }) || {},

  md: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.55)',
    } as unknown as ViewStyle,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.45,
      shadowRadius: 8,
      elevation: 4,
    },
  }) || {},

  lg: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75)',
    } as unknown as ViewStyle,
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  }) || {},

  neonGlow: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 0 20px rgba(57, 230, 0, 0.35)',
    } as unknown as ViewStyle,
    default: {
      shadowColor: '#39E600',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 6,
    },
  }) || {},

  violetGlow: Platform.select<ViewStyle>({
    web: {
      boxShadow: '0 0 24px rgba(112, 41, 245, 0.4)',
    } as unknown as ViewStyle,
    default: {
      shadowColor: '#7029F5',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 12,
      elevation: 6,
    },
  }) || {},
};

export type Shadows = typeof shadows;

