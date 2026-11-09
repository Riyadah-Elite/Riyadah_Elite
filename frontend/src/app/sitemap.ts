import { INITIAL_GAMES, INITIAL_TOURNAMENTS } from '../services/api.ts';
import { DEFAULT_SITE_URL } from '../components/seo/StructuredData.ts';

export interface SitemapEntry {
  readonly url: string;
  readonly lastModified: string;
  readonly changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  readonly priority: number;
}

export default function sitemap(): SitemapEntry[] {
  const nowIso = '2026-11-06T08:00:00.000Z';

  const coreRoutes: SitemapEntry[] = [
    {
      url: `${DEFAULT_SITE_URL}/`,
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${DEFAULT_SITE_URL}/nexus/dashboard`,
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${DEFAULT_SITE_URL}/nexus/games`,
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${DEFAULT_SITE_URL}/nexus/tournaments`,
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${DEFAULT_SITE_URL}/nexus/bug-reports`,
      lastModified: nowIso,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const gameRoutes: SitemapEntry[] = INITIAL_GAMES.map((game) => ({
    url: `${DEFAULT_SITE_URL}/games/${game.slug}`,
    lastModified: nowIso,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const tournamentRoutes: SitemapEntry[] = INITIAL_TOURNAMENTS.map((tourney) => ({
    url: `${DEFAULT_SITE_URL}/tournaments/${tourney.id}`,
    lastModified: nowIso,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...coreRoutes, ...gameRoutes, ...tournamentRoutes];
}
