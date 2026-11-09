import React from 'react';
import { buildCompleteEcosystemGraphJsonLd, DEFAULT_SITE_URL } from './StructuredData.ts';
export * from './StructuredData.ts';

export const StructuredData: React.FC<{
  activeContext?: 'landing' | 'nexus';
  activeNexusRoute?: string;
}> = ({ activeContext = 'landing', activeNexusRoute = 'dashboard' }) => {
  const jsonLdGraph = React.useMemo(
    () => buildCompleteEcosystemGraphJsonLd(DEFAULT_SITE_URL, activeContext, activeNexusRoute),
    [activeContext, activeNexusRoute]
  );

  return (
    <script
      type="application/ld+json"
      data-testid="seo-geo-aeo-jsonld"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
    />
  );
};
