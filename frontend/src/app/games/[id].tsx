import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { AppShell } from '../../shared/components/AppShell';
import { DesktopGameDetailScreen } from '../../desktop/screens/DesktopGameDetailScreen';
import { MobileGameDetailScreen } from '../../mobile/screens/MobileGameDetailScreen';

export default function GameDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : 'g1';

  return (
    <AppShell
      desktop={<DesktopGameDetailScreen id={gameId} />}
      mobile={<MobileGameDetailScreen id={gameId} />}
    />
  );
}

