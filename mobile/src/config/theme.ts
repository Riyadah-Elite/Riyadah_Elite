export const Colors = {
  background: "#0b0e14",
  surface: "#141923",
  surfaceBorder: "#232b3b",
  card: "#18202e",
  
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  
  primary: "#10b981", // Emerald accent
  primaryGlow: "rgba(16, 185, 129, 0.2)",
  secondary: "#38bdf8", // Sky blue accent
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  heading: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: Colors.textMuted,
  },
};
