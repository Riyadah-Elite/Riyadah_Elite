import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopTournamentDetailScreen } from '../../desktop/screens/DesktopTournamentDetailScreen';
import { MobileTournamentDetailScreen } from '../../mobile/screens/MobileTournamentDetailScreen';

export default function TournamentDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tournamentId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : 't1';

  return (
    <AppShell
      desktop={<DesktopTournamentDetailScreen id={tournamentId} />}
      mobile={<MobileTournamentDetailScreen id={tournamentId} />}
    />
  );
}

