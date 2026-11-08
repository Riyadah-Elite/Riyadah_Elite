import React from 'react';
import { Search, Bell, Moon, Sun, Menu, X, ArrowLeft } from 'lucide-react';
import { View, Text, Pressable } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { TelemetryPill } from './TelemetryPill';
import surfaceStyles from '../../styles/SurfaceEffects.module.css';

export interface CommonHeaderProps {
  mode: ThemeMode;
  onToggleTheme?: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  user?: {
    handle: string;
    level?: number;
    avatarUrl?: string;
  };
  onReturnToLanding?: () => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<CommonHeaderProps> = ({
  mode,
  onToggleTheme,
  activePath = 'dashboard',
  onNavigate = () => {},
  onOpenNotifications = () => {},
  unreadNotificationsCount = 2,
  user = { handle: 'GhostRecon', level: 42 },
  onReturnToLanding,
  mobileMenuOpen = false,
  onToggleMobileMenu = () => {},
}) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0D12]/90 backdrop-blur-xl border-b border-[#181C26] shadow-[0_4px_20px_rgba(0,0,0,0.6)] ${surfaceStyles.glassNavHeader}`}
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand / Return to Landing & Breadcrumbs */}
        <div className="flex items-center gap-4 min-w-[200px]">
          {onReturnToLanding ? (
            <Pressable
              onPress={onReturnToLanding}
              testID="header-return-landing-btn"
              className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5CF6]" />
              <span className="hidden sm:inline">Landing</span>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => onNavigate('dashboard')}
            testID="header-brand-logo"
            className="flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_12px_#8B5CF6]" aria-hidden="true" />
            <Text className="font-display text-base font-extrabold tracking-tight text-[#F8FAFC]">
              RIYADAH ELITE
            </Text>
            <span className="font-mono text-[10px] text-[#22D3EE] font-bold px-1.5 py-0.5 rounded bg-[#22D3EE]/10 border border-[#22D3EE]/25 uppercase tracking-wider">
              NEXUS
            </span>
          </Pressable>
        </div>

        {/* Center: Search input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md">
          <div className="relative w-full flex items-center bg-[#11141C] border border-[#181C26] rounded-full px-3.5 py-1.5 shadow-inner">
            <Search className="w-4 h-4 text-[#64748B] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search titles, telemetry, crash hashes..."
              className="bg-transparent text-xs font-mono text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Live Telemetry Pill */}
          <div className="hidden md:block">
            <TelemetryPill variant="latency" value="12ms PRO" />
          </div>

          {/* Theme Toggle */}
          {onToggleTheme && (
            <Pressable
              onPress={onToggleTheme}
              testID="header-theme-toggle"
              aria-label="Toggle theme mode"
              className="p-2 rounded-xl bg-[#11141C] border border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
            </Pressable>
          )}

          {/* Notifications Bell */}
          <Pressable
            onPress={onOpenNotifications}
            testID="header-notifications-btn"
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-[#11141C] border border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#22D3EE] ring-2 ring-[#0B0D12] animate-pulse" />
            )}
          </Pressable>

          {/* User Profile Pill */}
          <Pressable
            onPress={() => onNavigate('profile')}
            testID="header-user-profile-btn"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#11141C] border border-[#181C26] hover:border-[#8B5CF6]/50 transition-colors shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user.handle.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-display text-xs font-semibold text-[#F8FAFC]">
                {user.handle}
              </span>
              <span className="font-mono text-[9px] font-bold text-[#22D3EE] tracking-wider uppercase">
                LEVEL {user.level || 42}
              </span>
            </div>
          </Pressable>

          {/* Mobile Menu Button */}
          <Pressable
            onPress={onToggleMobileMenu}
            testID="header-mobile-menu-btn"
            aria-label="Toggle Navigation Drawer"
            className="p-2 rounded-xl bg-[#11141C] border border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC] lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Pressable>
        </div>
      </div>
    </header>
  );
};

