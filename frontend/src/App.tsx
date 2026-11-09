/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, LayoutDashboard, UserPlus } from 'lucide-react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  SafeAreaView,
  useResponsiveLayout,
} from './components/primitives';
import { theme, ThemeMode } from './theme/theme';
import { resolveInitialTheme } from './utils/ecosystemRules';
import { useScrollProgress } from './components/ScrollReveal';
import { PublicLandingPage } from './landing/PublicLandingPage';
import { NexusDashboardWorkspace, NexusRoute } from './components/NexusDashboardWorkspace';
import { AuthModal } from './components/common/AuthModal';
import { StructuredData } from './components/seo/StructuredData';
import surfaceStyles from './styles/SurfaceEffects.module.css';
import './index.css';

export default function App({
  initialContext = 'landing',
  initialNexusRoute = 'dashboard',
}: {
  initialContext?: 'landing' | 'nexus';
  initialNexusRoute?: NexusRoute;
} = {}) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(theme.storageKey);
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      return resolveInitialTheme(saved, prefersDark);
    } catch {
      return theme.defaultMode;
    }
  });

  const [viewContext, setViewContext] = useState<'landing' | 'nexus'>(initialContext);
  const [nexusRoute, setNexusRoute] = useState<NexusRoute>(initialNexusRoute);
  const [preselectedGameId, setPreselectedGameId] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [refreshCounter, setRefreshCounter] = useState<number>(0);

  // Responsive Multi-Screen Layout Engine (Mobile, Tablet, Desktop)
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();

  // Desktop Scroll Progress Indicator
  const { progress } = useScrollProgress();

  // Auto-close mobile drawer when switching to desktop monitor viewport
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Global Keyboard Shortcuts (Escape closes modals and mobile drawers)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (authModalOpen) setAuthModalOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, mobileMenuOpen]);

  // User Identity State
  const [currentUser, setCurrentUser] = useState<{
    handle: string;
    email: string;
    role: 'Gamer & Playtester' | 'Game Developer' | 'Esports Organizer';
    tier: string;
  }>({
    handle: 'Nadia_Vanguard',
    email: 'nadia@riyadahelite.gg',
    role: 'Gamer & Playtester',
    tier: 'Apex Verifier',
  });

  // Sync theme mode with <html> and <body> classes and localStorage
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = theme.dark.backgrounds.canvas;
      document.body.style.color = theme.dark.text.primary;
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = theme.light.backgrounds.canvas;
      document.body.style.color = theme.light.text.primary;
    }
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'hidden';
    root.style.overflowY = 'auto';
    root.style.overflowX = 'hidden';
    try {
      localStorage.setItem(theme.storageKey, mode);
    } catch {
      // ignore storage errors
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = theme[mode];
  const isDark = mode === 'dark';

  const handleOpenNexusRoute = (route: string, itemId?: string) => {
    const validRoutes: NexusRoute[] = [
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
    const targetRoute = validRoutes.includes(route as NexusRoute)
      ? (route as NexusRoute)
      : 'dashboard';
    if (itemId) {
      setPreselectedGameId(itemId);
    }
    setNexusRoute(targetRoute);
    setViewContext('nexus');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (sectionId: string) => {
    if (viewContext !== 'landing') {
      setViewContext('landing');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <SafeAreaView className={`min-h-screen transition-colors duration-150 ${t.classes.canvas}`}>
      <StructuredData activeContext={viewContext} activeNexusRoute={nexusRoute} />
      {/* =====================================================================
          GLASSMORPHIC STICKY TOP BAR + DESKTOP SCROLL PROGRESS INDICATOR
      ====================================================================== */}
      <header className={`sticky top-0 z-40 ${surfaceStyles.glassNavHeader} ${t.styles.glass.navHeader}`}>
        {/* Desktop Scroll-Progress Bar */}
        {viewContext === 'landing' && (
          <div
            aria-hidden="true"
            data-testid="desktop-scroll-progress"
            className="hidden md:block h-[3px] w-full bg-transparent overflow-hidden"
          >
            <div
              style={{ transform: `scaleX(${ Math.max(0.03, progress) })` }}
              className={`h-full w-full origin-left transition-transform duration-100 ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar}`}
            />
          </div>
        )}

        <div
          className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX} ${surfaceStyles.headerThreeZone}`}
        >
          {/* Zone 1: Left Zone (Logo / Wordmark) */}
          <div className={surfaceStyles.headerZoneLeft}>
            <a
              href="#section-01-hero"
              onClick={(e) => {
                e.preventDefault();
                setViewContext('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-display text-lg font-extrabold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2.5 ${t.classes.textPrimary}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_12px_#8B5CF6]" aria-hidden="true" />
              <span>Riyadah Elite</span>
            </a>
          </div>

          {/* Zone 2: Center Zone (Floating Navigation Pill with 4 Links) */}
          <nav
            aria-label="Primary Navigation"
            className={surfaceStyles.headerZoneCenter}
          >
            <div className={surfaceStyles.centerNavPill}>
              <a
                href="#section-03-platform-overview"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('section-03-platform-overview');
                }}
                className={surfaceStyles.centerNavPillLink}
              >
                Ecosystem
              </a>
              <a
                href="#section-08-games"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('section-08-games');
                }}
                className={surfaceStyles.centerNavPillLink}
              >
                Games
              </a>
              <a
                href="#section-09-tournaments"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('section-09-tournaments');
                }}
                className={surfaceStyles.centerNavPillLink}
              >
                Tournaments
              </a>
              <a
                href="#section-10-rankings"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollToSection('section-10-rankings');
                }}
                className={surfaceStyles.centerNavPillLink}
              >
                Rankings
              </a>
            </div>
          </nav>

          {/* Zone 3: Right Zone (Log In & Sign Up Actions on Desktop + Mobile Drawer Button) */}
          <div className={surfaceStyles.headerZoneRight}>
            <Pressable
              onPress={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              testID="header-login-btn"
              className={`px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap shrink-0 ${t.classes.secondaryBtn}`}
            >
              Log In
            </Pressable>

            <Pressable
              onPress={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              testID="header-signup-btn"
              className={`px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap shrink-0 ${t.classes.primaryBtn}`}
            >
              Sign Up
            </Pressable>

            <Pressable
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              testID="mobile-menu-toggle-btn"
              onPress={() => setMobileMenuOpen((prev) => !prev)}
              className={`md:hidden p-2 rounded-xl ${t.styles.glass.pillControl}`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Pressable>
          </div>
        </div>
      </header>

      {/* Secondary Utility Strip Below Header (Glassmorphic Theme Toggle + Quick Access) */}
      <View
        className={`border-b ${t.classes.borderSubtle} bg-surface/90 py-2 backdrop-blur-md`}
      >
        <View
          className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX} flex flex-wrap items-center justify-between gap-3 text-xs`}
        >
          <View className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Pressable
              onPress={() => handleOpenNexusRoute('bug-reports')}
              testID="utility-bug-report-btn"
              className={`font-mono font-medium hover:underline whitespace-nowrap shrink-0 ${t.classes.cyanAccentText}`}
            >
              Submit Bug Report
            </Pressable>
            <Text aria-hidden="true" className={t.classes.textMuted}>
              ·
            </Text>
            <Pressable
              onPress={() => handleOpenNexusRoute('notifications')}
              testID="utility-notifications-btn"
              className={`font-mono font-medium hover:underline whitespace-nowrap shrink-0 ${t.classes.violetAccentText}`}
            >
              Notifications
            </Pressable>
            <Text aria-hidden="true" className={t.classes.textMuted}>
              ·
            </Text>
            <Pressable
              onPress={() => {
                setAuthMode('register');
                setAuthModalOpen(true);
              }}
              testID="utility-auth-modal-btn"
              className={`font-mono font-medium hover:underline whitespace-nowrap shrink-0 ${t.classes.textSecondary}`}
            >
              Account<span className="hidden sm:inline"> ({currentUser.handle})</span>
            </Pressable>
          </View>

          <View className="flex items-center gap-3">
            <Pressable
              onPress={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
              testID="theme-toggle-btn"
              className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${surfaceStyles.glassPillControl} ${t.styles.glass.pillControl}`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-accent-violet" />
                  <span>Dark Mode</span>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Glassmorphic Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <View
          as="nav"
          aria-label="Mobile Navigation Drawer"
          testID="mobile-nav-drawer"
          className={`md:hidden p-4 space-y-3 ${surfaceStyles.glassMobileDrawer} ${t.styles.glass.mobileDrawer}`}
        >
          <View className="grid grid-cols-2 gap-2">
            {[
              { label: '01 · Hero', id: 'section-01-hero' },
              { label: '02 · About', id: 'section-02-about' },
              { label: '03 · Ecosystem', id: 'section-03-platform-overview' },
              { label: '06 · How It Works', id: 'section-06-how-it-works' },
              { label: '08 · Games', id: 'section-08-games' },
              { label: '09 · Tournaments', id: 'section-09-tournaments' },
              { label: '10 · Rankings', id: 'section-10-rankings' },
              { label: '13 · Join Portal', id: 'section-13-cta-horizon' },
            ].map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleScrollToSection(item.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-display font-semibold text-left ${t.styles.glass.pillControl}`}
              >
                {item.label}
              </Pressable>
            ))}
          </View>
          <View className="pt-2 flex items-center gap-2">
            <Pressable
              onPress={() => handleOpenNexusRoute('dashboard')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 ${t.classes.primaryBtn}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>NEXUS Dashboard</span>
            </Pressable>
            <Pressable
              onPress={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 ${t.classes.secondaryBtn}`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </Pressable>
          </View>
        </View>
      )}

      {/* =====================================================================
          MAIN VIEWPORT: PUBLIC LANDING PAGE (14 SECTIONS) OR NEXUS WORKSPACE
      ====================================================================== */}
      <View as="main">
        {viewContext === 'landing' ? (
          <PublicLandingPage
            mode={mode}
            onOpenNexusRoute={handleOpenNexusRoute}
            onExploreGames={() => handleScrollToSection('section-08-games')}
            onJoinCommunity={() => {
              setAuthMode('register');
              setAuthModalOpen(true);
            }}
            onCreateAccount={() => {
              setAuthMode('register');
              setAuthModalOpen(true);
            }}
            refreshTrigger={refreshCounter}
          />
        ) : (
          <NexusDashboardWorkspace
            mode={mode}
            activeRoute={nexusRoute}
            preselectedGameId={preselectedGameId}
            currentUser={currentUser}
            onChangeRoute={(r) => setNexusRoute(r)}
            onReturnToLanding={() => setViewContext('landing')}
            onDataMutated={() => setRefreshCounter((c) => c + 1)}
          />
        )}
      </View>

      {/* =====================================================================
          CLAYMORPHIC AUTHENTICATION MODAL (STITCH SCREEN 06)
      ====================================================================== */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={mode}
        initialTab={authMode}
        onSuccess={(user) => {
          setCurrentUser({
            handle: user.handle,
            email: user.email,
            role: (user.role as any) || 'Gamer & Playtester',
            tier: 'Diamond I · Level 42',
          });
          setViewContext('nexus');
        }}
      />
    </SafeAreaView>
  );
}
