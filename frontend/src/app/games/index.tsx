import React from 'react';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopGameListScreen } from '../../desktop/screens/DesktopGameListScreen';
import { MobileGameListScreen } from '../../mobile/screens/MobileGameListScreen';

export default function GamesPage() {
  return (
    <AppShell
      desktop={<DesktopGameListScreen />}
      mobile={<MobileGameListScreen />}
    />
  );
}

