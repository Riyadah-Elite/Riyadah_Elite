'use client';

import React, { useState } from 'react';
import {
  NexusDashboardWorkspace,
  NexusRoute,
} from '../../../components/NexusDashboardWorkspace';
import { StructuredData } from '../../../components/seo/StructuredData';

const VALID_NEXUS_VIEWS: readonly NexusRoute[] = [
  'dashboard',
  'games',
  'tournaments',
  'bracket-viewer',
  'bug-reports',
  'chat',
  'leaderboard',
  'notifications',
  'profile',
];

export default function NexusWorkspaceRoutePage({
  params,
}: {
  readonly params: { readonly view: string };
}) {
  const initialRoute: NexusRoute = VALID_NEXUS_VIEWS.includes(params.view as NexusRoute)
    ? (params.view as NexusRoute)
    : 'dashboard';
  const [activeRoute, setActiveRoute] = useState<NexusRoute>(initialRoute);
  const [, setRefreshCounter] = useState<number>(0);

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#F8FAFC]">
      <StructuredData activeContext="nexus" activeNexusRoute={activeRoute} />
      <NexusDashboardWorkspace
        mode="dark"
        activeRoute={activeRoute}
        onChangeRoute={setActiveRoute}
        onReturnToLanding={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }}
        currentUser={{
          handle: 'Nadia_Vanguard',
          email: 'nadia@riyadahelite.gg',
          role: 'Gamer & Playtester',
          tier: 'Apex Verifier',
        }}
        onDataMutated={() => setRefreshCounter((c) => c + 1)}
      />
    </main>
  );
}
