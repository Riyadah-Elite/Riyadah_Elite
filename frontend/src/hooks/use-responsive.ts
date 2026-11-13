import { useWindowDimensions } from 'react-native';

import { Breakpoints } from '@/constants/design';

/** Shared breakpoint logic. The landing shell flips to tabs below 768px. */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < Breakpoints.mobile,
    isTablet: width >= Breakpoints.mobile && width < Breakpoints.wide,
    isDesktop: width >= Breakpoints.wide,
  };
}
