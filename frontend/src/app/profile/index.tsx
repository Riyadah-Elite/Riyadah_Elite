import React from 'react';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopProfileScreen } from '../../desktop/screens/DesktopProfileScreen';
import { MobileProfileScreen } from '../../mobile/screens/MobileProfileScreen';

export default function ProfilePage() {
  return (
    <AppShell
      desktop={<DesktopProfileScreen />}
      mobile={<MobileProfileScreen />}
    />
  );
}

