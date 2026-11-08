/**
 * Consolidated Single Theme Object for Riyadah Elite
 * Strictly ONE exported theme object containing Dark & Light palettes, Typography, Spacing,
 * Radii, Shadows, Motion tokens, and the Four Design Styles:
 * 1. Bauhaus (Public Landing Page geometric architecture & colour blocking)
 * 2. Glassmorphism (Navigation, selected buttons, floating hero cards)
 * 3. Neumorphism (Authenticated NEXUS Notifications tactile raised/inset surfaces)
 * 4. Claymorphism (Game/Tournament listing cards, Leaderboard tables & Bug Report UI)
 *
 * Synchronized with Tailwind CSS v4 @theme inline tokens in src/index.css and
 * scoped CSS Modules in src/styles/*.module.css.
 */

export type ThemeMode = 'dark' | 'light';

export const theme = {
  defaultMode: 'dark' as ThemeMode,
  storageKey: 'riyadah_elite_theme_mode',

  dark: {
    mode: 'dark' as const,
    backgrounds: {
      canvas: '#0B0D12',
      surface: '#11141C',
      card: '#181C26',
      elevated: '#1F2432',
      overlay: 'rgba(11, 13, 18, 0.86)',
    },
    colors: {
      primary: '#8B5CF6',
      primaryHover: '#7C3AED',
      secondary: '#22D3EE',
      accent: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      inverse: '#0B0D12',
      accentViolet: '#A78BFA',
      accentCyan: '#22D3EE',
      accentBlue: '#3B82F6',
    },
    borders: {
      subtle: '#252B3B',
      strong: '#333C52',
      focus: '#8B5CF6',
      highlight: 'rgba(34, 211, 238, 0.35)',
    },
    gradients: {
      brand: 'linear-gradient(100deg, #8B5CF6 0%, #3B82F6 50%, #22D3EE 100%)',
      brandClass: 'bg-gradient-to-r from-accent-violet via-accent-blue to-accent-cyan',
    },
    classes: {
      canvas: 'bg-canvas text-primary-fg',
      surface: 'bg-surface text-primary-fg border-border-subtle',
      card: 'bg-card text-primary-fg border-border-subtle',
      elevated: 'bg-elevated text-primary-fg border-border-strong',
      textPrimary: 'text-primary-fg',
      textSecondary: 'text-secondary-fg',
      textMuted: 'text-muted-fg',
      borderSubtle: 'border-border-subtle',
      primaryBtn:
        'bg-accent-violet/95 hover:bg-accent-violet-hover text-white backdrop-blur-md border border-accent-violet-soft/40 shadow-[0_8px_20px_-6px_rgba(139,92,246,0.55)]',
      secondaryBtn:
        'bg-card/85 hover:bg-elevated text-primary-fg backdrop-blur-md border border-accent-blue/35 shadow-[0_4px_14px_rgba(0,0,0,0.35)]',
      cyanAccentText: 'text-accent-cyan',
      blueAccentText: 'text-accent-blue',
      violetAccentText: 'text-accent-violet-soft',
    },
    styles: {
      bauhaus: {
        sectionFrame: 'relative overflow-hidden border-b border-border-subtle',
        gridLine: 'border-border-subtle/80',
        geoVioletBlock: 'bg-accent-violet text-white',
        geoCyanBlock: 'bg-accent-cyan text-inverse-fg',
        geoBlueBlock: 'bg-accent-blue text-white',
        geoOutlineCircle: 'border-2 border-accent-violet/45 rounded-full',
        geoAccentBar: 'bg-gradient-to-r from-accent-violet via-accent-blue to-accent-cyan',
        architecturalCard:
          'bg-card border border-border-subtle shadow-bauhaus',
      },
      glass: {
        navHeader:
          'bg-canvas/85 backdrop-blur-xl border-b border-accent-violet/25 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.65)]',
        mobileDrawer:
          'bg-surface/94 backdrop-blur-xl border-b border-accent-violet/30 shadow-[0_16px_36px_rgba(0,0,0,0.75)]',
        floatingCard:
          'bg-[#11141C]/86 backdrop-blur-md border border-[#22D3EE]/30 shadow-[0_12px_28px_-8px_rgba(59,130,246,0.22),inset_0_1px_0_0_rgba(255,255,255,0.12)]',
        pillControl:
          'bg-card/80 backdrop-blur-md border border-accent-blue/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
        iconBadge:
          'bg-accent-violet/18 backdrop-blur-sm border border-accent-violet/35 text-accent-violet-soft',
      },
      neumorphic: {
        shell:
          'bg-[#11141C] border border-[#222838] rounded-2xl shadow-neu-shell',
        unreadRaised:
          'bg-card border border-accent-cyan/35 rounded-xl shadow-neu-raised',
        readInset:
          'bg-[#0E1118] border border-[#1E2330] rounded-xl shadow-neu-inset',
        iconWell:
          'bg-surface border border-[#23293A] rounded-xl shadow-neu-well',
        tactileBtn:
          'bg-card hover:bg-elevated active:shadow-neu-well border border-[#262E42] rounded-xl shadow-neu-btn',
      },
      clay: {
        card:
          'bg-card text-primary-fg border border-border-subtle rounded-2xl shadow-clay-card',
        tableContainer:
          'bg-surface text-primary-fg border border-border-subtle rounded-2xl shadow-clay-table',
        podiumCard:
          'bg-gradient-to-b from-card to-surface text-primary-fg border border-accent-violet/40 rounded-2xl shadow-clay-podium',
        input:
          'bg-surface text-primary-fg border border-border-subtle rounded-xl shadow-clay-input focus:border-accent-violet',
        filterBar:
          'bg-surface border border-border-subtle rounded-2xl shadow-clay-filter',
        statusTag:
          'bg-card border border-accent-cyan/35 rounded-lg px-2.5 py-1 shadow-[inset_0_1px_1px_rgba(34,211,238,0.12)]',
      },
    },
  },

  light: {
    mode: 'light' as const,
    backgrounds: {
      canvas: '#F8FAFC',
      surface: '#FFFFFF',
      card: '#F1F5F9',
      elevated: '#E2E8F0',
      overlay: 'rgba(248, 250, 252, 0.90)',
    },
    colors: {
      primary: '#6D28D9',
      primaryHover: '#5B21B6',
      secondary: '#0891B2',
      accent: '#2563EB',
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB',
    },
    text: {
      primary: '#0F172A',
      secondary: '#334155',
      muted: '#64748B',
      inverse: '#FFFFFF',
      accentViolet: '#6D28D9',
      accentCyan: '#0891B2',
      accentBlue: '#2563EB',
    },
    borders: {
      subtle: '#CBD5E1',
      strong: '#94A3B8',
      focus: '#6D28D9',
      highlight: 'rgba(8, 145, 178, 0.28)',
    },
    gradients: {
      brand: 'linear-gradient(100deg, #6D28D9 0%, #2563EB 50%, #0891B2 100%)',
      brandClass: 'bg-gradient-to-r from-accent-violet via-accent-blue to-accent-cyan',
    },
    classes: {
      canvas: 'bg-canvas text-primary-fg',
      surface: 'bg-surface text-primary-fg border-border-subtle',
      card: 'bg-card text-primary-fg border-border-subtle',
      elevated: 'bg-elevated text-primary-fg border-border-subtle',
      textPrimary: 'text-primary-fg',
      textSecondary: 'text-secondary-fg',
      textMuted: 'text-muted-fg',
      borderSubtle: 'border-border-subtle',
      primaryBtn:
        'bg-accent-violet/95 hover:bg-accent-violet-hover text-white backdrop-blur-md border border-accent-violet/40 shadow-[0_8px_18px_-6px_rgba(109,40,217,0.4)]',
      secondaryBtn:
        'bg-surface/90 hover:bg-card text-primary-fg backdrop-blur-md border border-accent-blue/25 shadow-[0_4px_12px_rgba(15,23,42,0.06)]',
      cyanAccentText: 'text-accent-cyan',
      blueAccentText: 'text-accent-blue',
      violetAccentText: 'text-accent-violet',
    },
    styles: {
      bauhaus: {
        sectionFrame: 'relative overflow-hidden border-b border-border-subtle',
        gridLine: 'border-border-subtle',
        geoVioletBlock: 'bg-accent-violet text-white',
        geoCyanBlock: 'bg-accent-cyan text-white',
        geoBlueBlock: 'bg-accent-blue text-white',
        geoOutlineCircle: 'border-2 border-accent-violet/35 rounded-full',
        geoAccentBar: 'bg-gradient-to-r from-accent-violet via-accent-blue to-accent-cyan',
        architecturalCard:
          'bg-surface border border-border-subtle shadow-bauhaus',
      },
      glass: {
        navHeader:
          'bg-surface/85 backdrop-blur-xl border-b border-accent-violet/20 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]',
        mobileDrawer:
          'bg-surface/94 backdrop-blur-xl border-b border-accent-violet/25 shadow-[0_14px_30px_rgba(15,23,42,0.12)]',
        floatingCard:
          'bg-[#11141C]/88 backdrop-blur-md border border-[#22D3EE]/35 shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45),inset_0_1px_0_0_rgba(255,255,255,0.16)]',
        pillControl:
          'bg-surface/88 backdrop-blur-md border border-accent-blue/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)]',
        iconBadge:
          'bg-accent-violet/12 backdrop-blur-sm border border-accent-violet/25 text-accent-violet',
      },
      neumorphic: {
        shell:
          'bg-[#EEF2F7] border border-[#DCE4EE] rounded-2xl shadow-neu-shell',
        unreadRaised:
          'bg-[#F4F7FB] border border-accent-cyan/35 rounded-xl shadow-neu-raised',
        readInset:
          'bg-[#E8EEF5] border border-[#D5DFEC] rounded-xl shadow-neu-inset',
        iconWell:
          'bg-[#EBF0F7] border border-[#D8E2EE] rounded-xl shadow-neu-well',
        tactileBtn:
          'bg-[#F4F7FB] hover:bg-surface active:shadow-neu-well border border-[#D5DFEC] rounded-xl shadow-neu-btn',
      },
      clay: {
        card:
          'bg-surface text-primary-fg border border-border-subtle rounded-2xl shadow-clay-card',
        tableContainer:
          'bg-surface text-primary-fg border border-border-subtle rounded-2xl shadow-clay-table',
        podiumCard:
          'bg-gradient-to-b from-surface to-card text-primary-fg border border-accent-violet/35 rounded-2xl shadow-clay-podium',
        input:
          'bg-canvas text-primary-fg border border-border-subtle rounded-xl shadow-clay-input focus:border-accent-violet',
        filterBar:
          'bg-surface border border-border-subtle rounded-2xl shadow-clay-filter',
        statusTag:
          'bg-card border border-accent-cyan/35 rounded-lg px-2.5 py-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]',
      },
    },
  },

  typography: {
    fontFamilies: {
      display: "'Sora', system-ui, -apple-system, sans-serif",
      body: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      hero: 'clamp(2.35rem, 4.3vw, 4rem)',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.12,
      snug: 1.3,
      relaxed: 1.6,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    sectionPaddingY: 'py-8 md:py-12',
    containerPaddingX: 'px-4 sm:px-6 lg:px-8',
    maxContainerWidth: 'max-w-7xl mx-auto',
  },

  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },

  shadows: {
    cardDark: '0 10px 30px -10px rgba(0, 0, 0, 0.55)',
    cardLight: '0 8px 24px -8px rgba(15, 23, 42, 0.06)',
    violetGlow: '0 0 28px -6px rgba(139, 92, 246, 0.45)',
    cyanGlow: '0 0 24px -6px rgba(34, 211, 238, 0.40)',
    blueGlow: '0 0 28px -6px rgba(59, 130, 246, 0.40)',
  },

  motion: {
    durations: {
      micro: 0.18,
      fast: 0.34,
      entrance: 0.54,
      section: 0.66,
      maskWipe: 0.68,
      radial: 0.74,
      counter: 0.85,
      stagger: 0.09,
    },
    easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
    easeOutCubic: [0.22, 1, 0.36, 1] as [number, number, number, number],
    easeInOutSine: [0.37, 0, 0.63, 1] as [number, number, number, number],
    parallaxRatios: {
      heroBackground: 0.06,
      heroArtwork: -0.03,
      heroTelemetry: -0.07,
    },
  },

  breakpoints: {
    mobileSmall: 360,
    mobileStandard: 390,
    mobileLarge: 430,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
    desktopWide: 1440,
    ultraWide: 1920,
  },
} as const;
