// Pure TS SEO graph utilities
import { INITIAL_GAMES, INITIAL_TOURNAMENTS } from '../../services/api.ts';

export interface AppMetadataConfig {
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly ogType: 'website' | 'article' | 'profile';
  readonly ogImage: string;
  readonly keywords: readonly string[];
}

export const DEFAULT_SITE_URL = 'https://riyadahelite.gg';

export const FAQ_ENTITIES: ReadonlyArray<{ readonly question: string; readonly answer: string }> = [
  {
    question: 'What is Riyadah Elite?',
    answer:
      'Riyadah Elite is a unified futuristic gaming, structured playtesting, bug bounty verification, and competitive esports tournament ecosystem connecting gamers, game studios, and tournament organizers.',
  },
  {
    question: 'Who can join the platform?',
    answer:
      'Any gamer, QA playtester, independent or AAA game developer, and esports tournament organizer across MENA, Europe, and global regions can create a verified Riyadah Elite account.',
  },
  {
    question: 'Is Riyadah Elite free to use?',
    answer:
      'Yes. Creating a tester and player account, enrolling in open playtest cohorts, submitting structured bug reports, and registering for open community tournaments are completely free.',
  },
  {
    question: 'How do I join a game playtest?',
    answer:
      'Navigate to the Game Listings section or the authenticated NEXUS Playtest Directory, select an active build cohort such as Eclipse Protocol or Valkyrie Drift: Zero, inspect the test objectives, and click Join Playtest.',
  },
  {
    question: 'How does bug reporting and verification work?',
    answer:
      'Testers submit structured telemetry reports specifying the target game build, severity tier (Low +40 PTS, Medium +85 PTS, High +150 PTS, Critical +250 PTS), reproduction steps, and expected vs actual behavior. Studio engineers verify reproductions to award reputation points.',
  },
  {
    question: 'How do I enter esports tournaments?',
    answer:
      'Browse the Tournament Listings section or NEXUS Tournament Brackets view, inspect live bracket seedings and slot availability, and click Register Squad before the registration deadline.',
  },
  {
    question: 'Can game developers publish builds for testing?',
    answer:
      'Yes. Game studios deploy pre-release builds to targeted tester cohorts, define custom telemetry objectives, and triage incoming bug reports directly with verified QA specialists.',
  },
  {
    question: 'How are dual-track leaderboard rankings calculated?',
    answer:
      'Riyadah Elite maintains two verified tracks: the Playtester & Bug Hunter track (ranked by verified bug reports, reproduction accuracy, and severity points) and the Competitive Tournament track (ranked by official bracket placements and match wins).',
  },
  {
    question: 'How can esports organizers host events on Riyadah Elite?',
    answer:
      'Esports organizations can configure custom tournament formats (Single/Double Elimination, Swiss Telemetry Sprints), manage squad registrations, and publish live verified brackets.',
  },
  {
    question: 'How are pre-release game builds kept secure?',
    answer:
      'All playtest cohorts enforce authenticated session tokens, build-watermarked telemetry logs, and role-based access controls between studios and verified testers.',
  },
];

export function buildOrganizationJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Riyadah Elite',
    alternateName: 'Riyadah Elite — NEXUS Gaming & Playtesting Ecosystem',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/assets/brand/logo/riyadah-elite-logo.svg`,
      width: 280,
      height: 56,
    },
    description:
      'Unified gaming, structured QA playtesting, bug bounty verification, and competitive esports tournament platform.',
    sameAs: [
      'https://x.com/riyadahelite',
      'https://discord.gg/riyadahelite',
      'https://twitch.tv/riyadahelite',
      'https://youtube.com/@riyadahelite',
      'https://github.com/riyadahelite',
    ],
  };
}

export function buildGamesItemListJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@type': 'ItemList',
    '@id': `${siteUrl}/#games-catalog`,
    name: 'Riyadah Elite Active Playtesting & Discovery Catalog',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: INITIAL_GAMES.length,
    itemListElement: INITIAL_GAMES.map((game, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': ['VideoGame', 'SoftwareApplication'],
        '@id': `${siteUrl}/games/${game.slug}`,
        name: game.title,
        applicationCategory: 'GameApplication',
        genre: game.category,
        operatingSystem: game.platforms.join(', '),
        softwareVersion: game.buildVersion,
        author: {
          '@type': 'Organization',
          name: game.studio,
        },
        description: game.description,
        image: `${siteUrl}${game.artworkUrl}`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: `${game.testingStatus} — ${game.bountyRewardPoints} PTS verified bug bounty`,
        },
      },
    })),
  };
}

export function buildTournamentsEventListJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@type': 'ItemList',
    '@id': `${siteUrl}/#tournaments-circuit`,
    name: 'Riyadah Elite Competitive Esports Tournament Circuit',
    numberOfItems: INITIAL_TOURNAMENTS.length,
    itemListElement: INITIAL_TOURNAMENTS.map((tourney, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'SportsEvent',
        '@id': `${siteUrl}/tournaments/${tourney.id}`,
        name: tourney.title,
        description: `${tourney.format} competitive ${tourney.gameTitle} tournament across ${tourney.region} with a ${tourney.prizePool} prize pool.`,
        startDate: '2026-11-18T18:00:00+03:00',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: {
          '@type': 'VirtualLocation',
          url: `${siteUrl}/tournaments/${tourney.id}`,
        },
        image: `${siteUrl}${tourney.bannerUrl}`,
        organizer: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    })),
  };
}

export function buildFaqPageJsonLd(siteUrl = DEFAULT_SITE_URL) {
  return {
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#faq`,
    mainEntity: FAQ_ENTITIES.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(
  siteUrl = DEFAULT_SITE_URL,
  activeContext: 'landing' | 'nexus' = 'landing',
  activeNexusRoute = 'dashboard'
) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Riyadah Elite Home',
      item: siteUrl,
    },
  ];

  if (activeContext === 'nexus') {
    items.push(
      {
        '@type': 'ListItem',
        position: 2,
        name: 'NEXUS Workspace',
        item: `${siteUrl}/nexus`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: activeNexusRoute.toUpperCase(),
        item: `${siteUrl}/nexus/${activeNexusRoute}`,
      }
    );
  }

  return {
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/#breadcrumbs`,
    itemListElement: items,
  };
}

export function buildCompleteEcosystemGraphJsonLd(
  siteUrl = DEFAULT_SITE_URL,
  activeContext: 'landing' | 'nexus' = 'landing',
  activeNexusRoute = 'dashboard'
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(siteUrl),
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Riyadah Elite — Play. Test. Win.',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en',
      },
      buildGamesItemListJsonLd(siteUrl),
      buildTournamentsEventListJsonLd(siteUrl),
      buildFaqPageJsonLd(siteUrl),
      buildBreadcrumbJsonLd(siteUrl, activeContext, activeNexusRoute),
    ],
  };
}

export function generatePageMetadata(options?: Partial<AppMetadataConfig>): AppMetadataConfig {
  return {
    title: options?.title ?? 'Riyadah Elite — Play. Test. Win. | Gaming & Playtesting Ecosystem',
    description:
      options?.description ??
      'Discover pre-release games, join structured QA playtests, report verified bugs for rewards, and compete in esports tournaments on Riyadah Elite.',
    canonicalUrl: options?.canonicalUrl ?? DEFAULT_SITE_URL,
    ogType: options?.ogType ?? 'website',
    ogImage: options?.ogImage ?? `${DEFAULT_SITE_URL}/assets/brand/og/riyadah-elite-og.svg`,
    keywords: options?.keywords ?? [
      'Riyadah Elite',
      'game playtesting platform',
      'bug bounty gaming',
      'MENA esports tournaments',
      'QA game verification',
      'NEXUS gaming workspace',
    ],
  };
}

export const StructuredData: any = () => null;


