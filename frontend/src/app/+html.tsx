import { type PropsWithChildren } from 'react';

/**
 * Custom Root HTML Template for Expo Router Web
 * Replaces default Expo ScrollViewStyleReset (which locks body with overflow: hidden)
 * Enforces dark futuristic canvas (#0B0D12) and unconstrained vertical scrolling across all 14 sections.
 */
export default function RootHtml({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>Riyadah Elite — Competitive Gaming & Playtesting Ecosystem</title>
        <meta name="theme-color" content="#0B0D12" />
        <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <style
          id="riyadah-elite-scroller-fix"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --bg-canvas: #0B0D12;
                --text-primary: #F8FAFC;
                color-scheme: dark;
              }
              html, body {
                background-color: #0B0D12 !important;
                color: #F8FAFC !important;
                min-height: 100% !important;
                height: auto !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              #root {
                display: block !important;
                min-height: 100vh !important;
                height: auto !important;
                background-color: #0B0D12 !important;
                color: #F8FAFC !important;
                overflow-y: visible !important;
                overflow-x: hidden !important;
              }
            `,
          }}
        />
      </head>
      <body style={{ backgroundColor: '#0B0D12', color: '#F8FAFC', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}

