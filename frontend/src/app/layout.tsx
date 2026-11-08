import React from 'react';
import {
  StructuredData,
  generatePageMetadata,
  DEFAULT_SITE_URL,
} from '../components/seo/StructuredData';
import '../index.css';

export const metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default: 'Riyadah Elite — Competitive Gaming & Playtesting Ecosystem',
    template: '%s | Riyadah Elite',
  },
  description:
    'Discover pre-release games, join structured QA playtests, submit verified bug reports for rewards, and compete in esports tournaments on Riyadah Elite.',
  keywords: [
    'Riyadah Elite',
    'game playtesting platform',
    'bug bounty gaming',
    'esports tournaments MENA',
    'QA game verification',
    'NEXUS gaming workspace',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Riyadah Elite',
    title: 'Riyadah Elite — Competitive Gaming & Playtesting Ecosystem',
    description:
      'More than gaming. A complete gaming ecosystem connecting gamers, playtesters, game studios, and esports organizations.',
    url: DEFAULT_SITE_URL,
    images: [
      {
        url: '/assets/brand/og/riyadah-elite-og.svg',
        width: 1200,
        height: 630,
        alt: 'Riyadah Elite — Play. Test. Win.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Riyadah Elite — Competitive Gaming & Playtesting Ecosystem',
    description:
      'Discover pre-release games, join structured QA playtests, and compete in esports tournaments on Riyadah Elite.',
    images: ['/assets/brand/og/riyadah-elite-og.svg'],
  },
};

export function generateMetadata() {
  return generatePageMetadata();
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <StructuredData activeContext="landing" />
      </head>
      <body className="bg-[#0B0D12] text-[#F8FAFC] antialiased selection:bg-[#8B5CF6]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
