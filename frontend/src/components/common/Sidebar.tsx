import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Trophy,
  GitBranch,
  Bug,
  MessageSquare,
  Award,
  Bell,
  User,
  Activity,
  Shield,
  Layers,
} from 'lucide-react';
import { View, Text, Pressable } from '../primitives';
import { TelemetryPill } from './TelemetryPill';

export interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  isOpenOnMobile = false,
  onCloseMobile = () => {},
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home Nexus', icon: LayoutDashboard },
    { id: 'games', label: 'Games Library', icon: Compass },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'bracket-viewer', label: 'Bracket Engine', icon: GitBranch },
    { id: 'bug-reports', label: 'Defect Reporting', icon: Bug },
    { id: 'chat', label: 'Dev ↔ QA Bridge', icon: MessageSquare, badge: 'LIVE' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 2 },
    { id: 'profile', label: 'Player Dossier', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#0B0D12] border-r border-[#181C26] flex flex-col justify-between py-4 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-transform duration-300 lg:translate-x-0 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4 px-3">
          {/* Telemetry Node Header */}
          <div className="px-3 py-1 flex items-center justify-between text-[#64748B] font-mono text-[11px] uppercase tracking-wider border-b border-[#181C26] pb-2">
            <span className="flex items-center gap-1.5 text-[#22D3EE] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
              TELEMETRY NODE
            </span>
            <span className="text-[#94A3B8]">v4.2</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeRoute === item.id ||
                (item.id === 'tournaments' && activeRoute === 'tournament-detail') ||
                (item.id === 'games' && activeRoute === 'testing');

              return (
                <Pressable
                  key={item.id}
                  testID={`sidebar-link-${item.id}`}
                  onPress={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[#8B5CF6]/15 text-[#F8FAFC] border border-[#8B5CF6]/40 font-semibold shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                      : 'text-[#94A3B8] hover:bg-[#11141C] hover:text-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#8B5CF6]' : 'text-[#64748B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                      {item.badge}
                    </span>
                  )}

                  {item.count && (
                    <span className="w-4 h-4 rounded-full text-[10px] font-mono font-bold bg-[#22D3EE] text-[#0B0D12] flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </Pressable>
              );
            })}
          </nav>
        </div>

        {/* Bottom Telemetry & Status Node */}
        <div className="px-3 flex flex-col gap-2 pt-3 border-t border-[#181C26]">
          <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#94A3B8]">NETCODE</span>
                <span className="font-mono text-xs font-bold text-[#F8FAFC]">128Hz TICK</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#22D3EE]/15 text-[#22D3EE] border border-[#22D3EE]/30">
              OPTIMAL
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span className="font-mono text-xs text-[#CBD5E1]">LATENCY 12ms</span>
            </div>
            <span className="font-mono text-xs font-bold text-[#8B5CF6]">PRO</span>
          </div>
        </div>
      </aside>
    </>
  );
};

