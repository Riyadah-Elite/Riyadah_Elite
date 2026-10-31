import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borders } from './borders';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
} as const;

export type Theme = typeof theme;

export { colors, typography, spacing, borders, shadows };

