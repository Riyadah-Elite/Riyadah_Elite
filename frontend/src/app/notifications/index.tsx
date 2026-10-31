import React from 'react';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopNotificationsScreen } from '../../desktop/screens/DesktopNotificationsScreen';
import { MobileNotificationsScreen } from '../../mobile/screens/MobileNotificationsScreen';

export default function NotificationsPage() {
  return (
    <AppShell
      desktop={<DesktopNotificationsScreen />}
      mobile={<MobileNotificationsScreen />}
    />
  );
}

