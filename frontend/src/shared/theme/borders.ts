export const borders = {
  radius: {
    none: 0,
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    round: 9999,
  },
  width: {
    none: 0,
    thin: 1,
    medium: 1.5,
    thick: 2,
  },
} as const;

export type Borders = typeof borders;

