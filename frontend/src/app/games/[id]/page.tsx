import React from 'react';
import { INITIAL_GAMES } from '../../../services/api';
import { generatePageMetadata, DEFAULT_SITE_URL } from '../../../components/seo/StructuredData';

export function generateStaticParams() {
  return INITIAL_GAMES.map((game) => ({ id: game.slug }));
}

export function generateMetadata({ params }: { readonly params: { readonly id: string } }) {
  const game = INITIAL_GAMES.find((g) => g.slug === params.id || g.id === params.id) ?? INITIAL_GAMES[0];
  return generatePageMetadata({
    title: `${game.title} (${game.buildVersion}) — Playtest & Bug Bounty | Riyadah Elite`,
    description: `${game.description} Studio: ${game.studio}. Status: ${game.testingStatus} (+${game.bountyRewardPoints} PTS verified bug bounty).`,
    canonicalUrl: `${DEFAULT_SITE_URL}/games/${game.slug}`,
    ogImage: `${DEFAULT_SITE_URL}${game.artworkUrl}`,
  });
}

export default function GameDetailPage({ params }: { readonly params: { readonly id: string } }) {
  const game = INITIAL_GAMES.find((g) => g.slug === params.id || g.id === params.id) ?? INITIAL_GAMES[0];

  const videoGameJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['VideoGame', 'SoftwareApplication'],
    name: game.title,
    genre: game.category,
    applicationCategory: 'GameApplication',
    operatingSystem: game.platforms.join(', '),
    softwareVersion: game.buildVersion,
    author: { '@type': 'Organization', name: game.studio },
    description: game.description,
    image: `${DEFAULT_SITE_URL}${game.artworkUrl}`,
  };

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#F8FAFC] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />
      <article className="max-w-5xl mx-auto space-y-6">
        <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE]">
          {game.testingStatus} · {game.buildVersion}
        </p>
        <h1 className="font-display text-4xl font-extrabold">{game.title}</h1>
        <p className="text-[#CBD5E1] text-base max-w-2xl">{game.description}</p>
      </article>
    </main>
  );
}
