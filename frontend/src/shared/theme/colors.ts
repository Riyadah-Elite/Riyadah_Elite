/**
 * Riyadah Elite - Obsidian Kinetic & Cyber-Esports Color System
 * Strictly aligned with approved design tokens and Google Stitch specifications.
 */

export const colors = {
  // Backgrounds
  background: {
    primary: '#09090D', // Deep Obsidian canvas
    secondary: '#111119', // Tactical panel background
    surface: '#151520', // Card surface
    elevated: '#1A1A28', // Elevated card / plinth
    hover: '#222234', // Hover state surface
    subtle: '#26263C', // Deep contrast chip
    glass: 'rgba(17, 17, 25, 0.85)', // Frosted glass command layer
  },

  // Brand Accents
  brand: {
    primary: '#7029F5', // Core Royal Electric Violet
    secondary: '#8B5CF6', // Luminous Violet highlight
    accent: '#39E600', // Kinetic Electric Lime / Neon Green
    accentGlow: 'rgba(57, 230, 0, 0.25)',
    violetGlow: 'rgba(112, 41, 245, 0.35)',
    gold: '#F59E0B', // Tournament Prize Gold
    goldGlow: 'rgba(245, 158, 11, 0.25)',
    cyan: '#06B6D4', // Tech Telemetry Cyan
  },

  // Typography
  text: {
    primary: '#FFFFFF', // High-contrast headers & primary labels
    secondary: '#A1A1AA', // Body copy & telemetry subtexts
    muted: '#71717A', // Form placeholders, footer disclaimers, time tags
    accent: '#39E600', // Active metric highlights
    violet: '#8B5CF6',
    inverse: '#09090D',
  },

  // Borders & Dividers
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.14)',
    active: '#7029F5',
    neon: '#39E600',
    highlight: 'rgba(139, 92, 246, 0.5)',
  },

  // Semantic Status
  status: {
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.15)',
    open: '#39E600',
    inprogress: '#8B5CF6',
    resolved: '#10B981',
    closed: '#71717A',
  },
} as const;

export type Colors = typeof colors;

