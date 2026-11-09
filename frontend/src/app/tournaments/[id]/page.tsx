import React from 'react';
import { INITIAL_TOURNAMENTS } from '../../../services/api';
import { generatePageMetadata, DEFAULT_SITE_URL } from '../../../components/seo/StructuredData';

export function generateStaticParams() {
  return INITIAL_TOURNAMENTS.map((tourney) => ({ id: tourney.id }));
}

export function generateMetadata({ params }: { readonly params: { readonly id: string } }) {
  const tourney = INITIAL_TOURNAMENTS.find((t) => t.id === params.id) ?? INITIAL_TOURNAMENTS[0];
  return generatePageMetadata({
    title: `${tourney.title} — ${tourney.prizePool} Esports Bracket | Riyadah Elite`,
    description: `Compete in ${tourney.title} (${tourney.gameTitle}). Format: ${tourney.format}, Region: ${tourney.region}, Prize Pool: ${tourney.prizePool}.`,
    canonicalUrl: `${DEFAULT_SITE_URL}/tournaments/${tourney.id}`,
    ogImage: `${DEFAULT_SITE_URL}${tourney.bannerUrl}`,
  });
}

export default function TournamentDetailPage({ params }: { readonly params: { readonly id: string } }) {
  const tourney = INITIAL_TOURNAMENTS.find((t) => t.id === params.id) ?? INITIAL_TOURNAMENTS[0];

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: tourney.title,
    description: `${tourney.format} competitive ${tourney.gameTitle} tournament with ${tourney.prizePool} prize pool.`,
    eventStatus: 'https://schema.org/EventScheduled',
    image: `${DEFAULT_SITE_URL}${tourney.bannerUrl}`,
  };

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#F8FAFC] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <article className="max-w-5xl mx-auto space-y-6">
        <p className="font-mono text-xs uppercase tracking-widest text-[#3B82F6]">
          {tourney.status} · {tourney.prizePool} PRIZE POOL
        </p>
        <h1 className="font-display text-4xl font-extrabold">{tourney.title}</h1>
        <p className="text-[#CBD5E1] text-base">
          {tourney.gameTitle} · {tourney.format} · {tourney.region}
        </p>
      </article>
    </main>
  );
}
