import React from 'react';
import { AppShell } from '../shared/components/AppShell';
import { DesktopHomeScreen } from '../desktop/screens/DesktopHomeScreen';
import { MobileHomeScreen } from '../mobile/screens/MobileHomeScreen';

export default function HomeScreen() {
  return (
    <AppShell
      desktop={<DesktopHomeScreen />}
      mobile={<MobileHomeScreen />}
    />
  );
}
