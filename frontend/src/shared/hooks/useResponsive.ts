import { useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const isMobile = width < 1024;

  const breakpoint: 'mobile' | 'tablet' | 'desktop' = isDesktop
    ? 'desktop'
    : isTablet
    ? 'tablet'
    : 'mobile';

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
  };
}

