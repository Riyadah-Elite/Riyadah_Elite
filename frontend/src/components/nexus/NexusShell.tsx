import React, { useState } from 'react';
import { ThemeMode } from '../../theme/theme';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';

export interface NexusShellProps {
  mode: ThemeMode;
  activeRoute: string;
  onChangeRoute: (route: string) => void;
  onReturnToLanding?: () => void;
  currentUser?: {
    handle: string;
    email: string;
    role: string;
    tier?: string;
  };
  children: React.ReactNode;
}

export const NexusShell: React.FC<NexusShellProps> = ({
  mode,
  activeRoute,
  onChangeRoute,
  onReturnToLanding,
  currentUser = {
    handle: 'GhostRecon',
    email: 'tester@riyadahelite.gg',
    role: 'Lead QA Specialist & Esports Competitor',
    tier: 'Diamond I · Level 42',
  },
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F8FAFC] antialiased selection:bg-[#8B5CF6] selection:text-white">
      {/* Top Header */}
      <Header
        mode={mode}
        activePath={activeRoute}
        onNavigate={onChangeRoute}
        onOpenNotifications={() => onChangeRoute('notifications')}
        user={{ handle: currentUser.handle, level: 42 }}
        onReturnToLanding={onReturnToLanding}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((p) => !p)}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={onChangeRoute}
        isOpenOnMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main View Container */}
      <div className="lg:pl-64 pt-16 min-h-screen flex flex-col justify-between">
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {children}
        </main>

        {/* Workspace Mini Footer */}
        <footer className="w-full border-t border-[#181C26] bg-[#0B0D12] py-4 px-6 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-[#64748B]">
            <span>RIYADAH ELITE OPERATING PLATFORM · NEXUS v4.2</span>
            <span>ENCRYPTED TELEMETRY STREAM // 128Hz TICK RATE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

