import React from 'react';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopBugReportScreen } from '../../desktop/screens/DesktopBugReportScreen';
import { MobileBugReportScreen } from '../../mobile/screens/MobileBugReportScreen';

export default function BugReportPage() {
  return (
    <AppShell
      desktop={<DesktopBugReportScreen />}
      mobile={<MobileBugReportScreen />}
    />
  );
}

