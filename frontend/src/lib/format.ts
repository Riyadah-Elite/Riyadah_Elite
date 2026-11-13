import { Palette } from '@/constants/design';

export function initials(name: string): string {
  const parts = name.trim().split(/[\s_-]+/).filter(Boolean);

  if (parts.length === 0) return 'RE';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function relativeTime(iso: string): string {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return '';

  const seconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000));

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604_800) return `${Math.floor(seconds / 86_400)}d ago`;

  return formatJoined(iso);
}

export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

/** Tier family determines the accent used by rank chips and podiums. */
export function tierColor(rank: string | null | undefined): string {
  const tier = (rank ?? '').toLowerCase();

  if (tier.startsWith('diamond')) return Palette.diamond;
  if (tier.startsWith('platinum')) return Palette.platinum;
  if (tier.startsWith('gold')) return Palette.gold;
  if (tier.startsWith('silver')) return Palette.silver;
  if (tier.startsWith('bronze')) return Palette.bronze;

  return Palette.primaryBright;
}

export function positionColor(position: number): string {
  if (position === 1) return Palette.gold;
  if (position === 2) return Palette.silver;
  if (position === 3) return Palette.bronze;
  return Palette.textMuted;
}
