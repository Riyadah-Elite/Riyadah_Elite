import React from 'react';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopTournamentListScreen } from '../../desktop/screens/DesktopTournamentListScreen';
import { MobileTournamentListScreen } from '../../mobile/screens/MobileTournamentListScreen';

export default function TournamentsPage() {
  return (
    <AppShell
      desktop={<DesktopTournamentListScreen />}
      mobile={<MobileTournamentListScreen />}
    />
  );
}

