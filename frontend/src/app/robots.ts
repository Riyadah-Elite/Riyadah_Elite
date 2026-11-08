import { DEFAULT_SITE_URL } from '../components/seo/StructuredData.ts';

export interface RobotsConfig {
  readonly rules: ReadonlyArray<{
    readonly userAgent: string | readonly string[];
    readonly allow: string | readonly string[];
    readonly disallow?: string | readonly string[];
  }>;
  readonly sitemap: string;
  readonly host: string;
}

export default function robots(): RobotsConfig {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/games/', '/tournaments/'],
        disallow: ['/api/private/'],
      },
      {
        // Explicit GEO / AI Answer Engine Crawler Allowlist
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Googlebot'],
        allow: ['/'],
      },
    ],
    sitemap: `${DEFAULT_SITE_URL}/sitemap.xml`,
    host: DEFAULT_SITE_URL,
  };
}
