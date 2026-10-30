import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { DesktopLayout } from '../../desktop/layouts/DesktopLayout';
import { MobileLayout } from '../../mobile/layouts/MobileLayout';

interface AppShellProps {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ desktop, mobile }) => {
  const { isDesktop } = useResponsive();

  if (isDesktop) {
    return <DesktopLayout>{desktop}</DesktopLayout>;
  }

  return <MobileLayout>{mobile}</MobileLayout>;
};

