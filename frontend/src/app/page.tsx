import React from 'react';
import App from '../App';
import { generatePageMetadata, DEFAULT_SITE_URL } from '../components/seo/StructuredData';

export function generateMetadata() {
  return generatePageMetadata({
    title: 'Riyadah Elite — Play. Test. Win. | Next-Gen Gaming & Playtesting Ecosystem',
    description:
      'Enter the Riyadah Elite ecosystem: discover pre-release games, enroll in structured QA playtesting cohorts, report verified bugs, and compete in tournaments.',
    canonicalUrl: DEFAULT_SITE_URL,
  });
}

export default function HomePage() {
  return <App />;
}
