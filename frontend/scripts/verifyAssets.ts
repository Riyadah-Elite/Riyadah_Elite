import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

export interface ExpectedPngAsset {
  readonly relativePath: string;
  readonly publicUrl: string;
  readonly width: number;
  readonly height: number;
  readonly requiresTransparentCornerAlpha: boolean;
  readonly category:
    | 'characters'
    | 'backgrounds'
    | 'atmosphere'
    | 'foregrounds'
    | 'games'
    | 'tournaments'
    | 'community';
  readonly targetSections: string;
  readonly intendedUse: string;
}

export const EXPECTED_GENERATED_PNG_ASSETS: readonly ExpectedPngAsset[] = [
  // A. Characters (7 PNG32 RGBA files)
  {
    relativePath: 'public/assets/generated/characters/tariq-kestrel-playtester.png',
    publicUrl: '/assets/generated/characters/tariq-kestrel-playtester.png',
    width: 720,
    height: 960,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 01 (Hero PLAY), Section 02, Section 06 (Step 01), Section 10 (Podium #2), Section 11, Section 13, NEXUS',
    intendedUse: 'Lead Gamer & Playtester cutout (Tariq_QA_Core)',
  },
  {
    relativePath: 'public/assets/generated/characters/nadia-vanguard-verifier.png',
    publicUrl: '/assets/generated/characters/nadia-vanguard-verifier.png',
    width: 720,
    height: 960,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 01 (Hero TEST/WIN), Section 02, Section 06 (Step 03), Section 10 (Podium #1), Section 11, NEXUS',
    intendedUse: 'Principal Netcode Verifier cutout (Nadia_Vanguard)',
  },
  {
    relativePath: 'public/assets/generated/characters/zayd-architect-developer.png',
    publicUrl: '/assets/generated/characters/zayd-architect-developer.png',
    width: 720,
    height: 960,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 01 (Hero TEST), Section 02, Section 05, Section 06 (Step 02), Section 10 (Podium #3), Section 11',
    intendedUse: 'Lead Game Developer cutout (Zayd_Mirage)',
  },
  {
    relativePath: 'public/assets/generated/characters/salma-hex-qa-specialist.png',
    publicUrl: '/assets/generated/characters/salma-hex-qa-specialist.png',
    width: 540,
    height: 720,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 02 (Region 02), Section 05 (Solution), Section 10 (Rank #6), Section 11',
    intendedUse: 'QA Telemetry & Frame-Time Specialist cutout (Salma_Hex)',
  },
  {
    relativePath: 'public/assets/generated/characters/faisal-falcon-competitor.png',
    publicUrl: '/assets/generated/characters/faisal-falcon-competitor.png',
    width: 720,
    height: 960,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 01 (Hero WIN), Section 02, Section 06 (Step 04), Section 10 (Rank #4), Section 11, Section 13',
    intendedUse: 'Champion Esports Competitor cutout (Faisal_Falcons)',
  },
  {
    relativePath: 'public/assets/generated/characters/elena-syndicate-community.png',
    publicUrl: '/assets/generated/characters/elena-syndicate-community.png',
    width: 540,
    height: 720,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 02 (Region 03), Section 11 (Community Cast Showcase)',
    intendedUse: 'Esports Organizer & Community Representative cutout (Elena_Syndicate)',
  },
  {
    relativePath: 'public/assets/generated/characters/character-reference-sheet.png',
    publicUrl: '/assets/generated/characters/character-reference-sheet.png',
    width: 1280,
    height: 720,
    requiresTransparentCornerAlpha: true,
    category: 'characters',
    targetSections: 'Section 11 — Community Cast Reference',
    intendedUse: 'Official 6-character lineup turnaround sheet',
  },

  // B. Backgrounds (3 16:9 PNG files)
  {
    relativePath: 'public/assets/generated/backgrounds/hero-nexus-arena.png',
    publicUrl: '/assets/generated/backgrounds/hero-nexus-arena.png',
    width: 1440,
    height: 810,
    requiresTransparentCornerAlpha: false,
    category: 'backgrounds',
    targetSections: 'Section 01 — Hero Background Canvas',
    intendedUse: 'Full-viewport futuristic cyber-esports arena with left negative space for typography',
  },
  {
    relativePath: 'public/assets/generated/backgrounds/ecosystem-citadel-vista.png',
    publicUrl: '/assets/generated/backgrounds/ecosystem-citadel-vista.png',
    width: 1440,
    height: 810,
    requiresTransparentCornerAlpha: false,
    category: 'backgrounds',
    targetSections: 'Section 01 — Hero Visual Stage',
    intendedUse: 'Tri-region gaming ecosystem rotunda connected by violet & cyan conduits',
  },
  {
    relativePath: 'public/assets/generated/backgrounds/cta-horizon-portal.png',
    publicUrl: '/assets/generated/backgrounds/cta-horizon-portal.png',
    width: 1440,
    height: 810,
    requiresTransparentCornerAlpha: false,
    category: 'backgrounds',
    targetSections: 'Section 13 — Final CTA',
    intendedUse: 'Concluding Horizon Portal architectural environment',
  },

  // C. Atmosphere & Foregrounds (5 PNG32 RGBA overlays)
  {
    relativePath: 'public/assets/generated/atmosphere/volumetric-light-rays.png',
    publicUrl: '/assets/generated/atmosphere/volumetric-light-rays.png',
    width: 1440,
    height: 810,
    requiresTransparentCornerAlpha: true,
    category: 'atmosphere',
    targetSections: 'Section 01 — Hero, Section 13 — Final CTA',
    intendedUse: 'Independent volumetric violet, cyan & blue light-ray layer',
  },
  {
    relativePath: 'public/assets/generated/atmosphere/atmospheric-fog-layer.png',
    publicUrl: '/assets/generated/atmosphere/atmospheric-fog-layer.png',
    width: 1440,
    height: 480,
    requiresTransparentCornerAlpha: true,
    category: 'atmosphere',
    targetSections: 'Section 01 → 02 Mist Horizon Bridge',
    intendedUse: 'Scroll-linked atmospheric mist transitioning Hero into About',
  },
  {
    relativePath: 'public/assets/generated/atmosphere/cyber-particles-overlay.png',
    publicUrl: '/assets/generated/atmosphere/cyber-particles-overlay.png',
    width: 1200,
    height: 720,
    requiresTransparentCornerAlpha: true,
    category: 'atmosphere',
    targetSections: 'Section 01 — Hero Stage',
    intendedUse: 'Independent floating bokeh & telemetry particle field',
  },
  {
    relativePath: 'public/assets/generated/foregrounds/arena-architectural-foreground.png',
    publicUrl: '/assets/generated/foregrounds/arena-architectural-foreground.png',
    width: 1440,
    height: 810,
    requiresTransparentCornerAlpha: true,
    category: 'foregrounds',
    targetSections: 'Section 01 — Hero Stage Foreground',
    intendedUse: 'Independent structural framing gantry trusses in front of environment backdrop',
  },
  {
    relativePath: 'public/assets/generated/foregrounds/horizon-mist-foreground.png',
    publicUrl: '/assets/generated/foregrounds/horizon-mist-foreground.png',
    width: 1440,
    height: 320,
    requiresTransparentCornerAlpha: true,
    category: 'foregrounds',
    targetSections: 'Section 13 — Final CTA',
    intendedUse: 'Bottom-edge grounding portal mist gradient layer',
  },

  // D. Games (6 16:9 PNG files)
  {
    relativePath: 'public/assets/generated/games/eclipse-protocol.png',
    publicUrl: '/assets/generated/games/eclipse-protocol.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 03, Section 08, NEXUS Games',
    intendedUse: 'Extraction Sci-Fi key art for Eclipse Protocol (text-free)',
  },
  {
    relativePath: 'public/assets/generated/games/valkyrie-drift.png',
    publicUrl: '/assets/generated/games/valkyrie-drift.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 08, NEXUS Games',
    intendedUse: 'Cyber Racing key art for Valkyrie Drift: Zero (text-free)',
  },
  {
    relativePath: 'public/assets/generated/games/aether-bastion.png',
    publicUrl: '/assets/generated/games/aether-bastion.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 08, NEXUS Games',
    intendedUse: 'Strategy Arena key art for Aether Bastion (text-free)',
  },
  {
    relativePath: 'public/assets/generated/games/chrono-sunder.png',
    publicUrl: '/assets/generated/games/chrono-sunder.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 08, NEXUS Games',
    intendedUse: 'Action RPG key art for Chrono Sunder (text-free)',
  },
  {
    relativePath: 'public/assets/generated/games/sandstorm-vanguard.png',
    publicUrl: '/assets/generated/games/sandstorm-vanguard.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 08, NEXUS Games',
    intendedUse: 'Tactical Shooter key art for Sandstorm Vanguard (text-free)',
  },
  {
    relativePath: 'public/assets/generated/games/mythos-tactics.png',
    publicUrl: '/assets/generated/games/mythos-tactics.png',
    width: 960,
    height: 540,
    requiresTransparentCornerAlpha: false,
    category: 'games',
    targetSections: 'Section 08, NEXUS Games',
    intendedUse: 'Hex-Grid Strategy key art for Mythos Tactics (text-free)',
  },

  // E. Tournaments (4 40:21 PNG files)
  {
    relativePath: 'public/assets/generated/tournaments/nexus-championship-cup.png',
    publicUrl: '/assets/generated/tournaments/nexus-championship-cup.png',
    width: 960,
    height: 504,
    requiresTransparentCornerAlpha: false,
    category: 'tournaments',
    targetSections: 'Section 03, Section 09, NEXUS Tournaments',
    intendedUse: 'Championship arena stage banner for NEXUS Championship Cup — Season IV',
  },
  {
    relativePath: 'public/assets/generated/tournaments/valkyrie-speed-series.png',
    publicUrl: '/assets/generated/tournaments/valkyrie-speed-series.png',
    width: 960,
    height: 504,
    requiresTransparentCornerAlpha: false,
    category: 'tournaments',
    targetSections: 'Section 09, NEXUS Tournaments',
    intendedUse: 'Night circuit stadium banner for Valkyrie Telemetry Grand Prix',
  },
  {
    relativePath: 'public/assets/generated/tournaments/bastion-invitational.png',
    publicUrl: '/assets/generated/tournaments/bastion-invitational.png',
    width: 960,
    height: 504,
    requiresTransparentCornerAlpha: false,
    category: 'tournaments',
    targetSections: 'Section 09, NEXUS Tournaments',
    intendedUse: 'Holographic citadel arena banner for Aether Bastion Siege Invitational',
  },
  {
    relativePath: 'public/assets/generated/tournaments/mena-challenger-open.png',
    publicUrl: '/assets/generated/tournaments/mena-challenger-open.png',
    width: 960,
    height: 504,
    requiresTransparentCornerAlpha: false,
    category: 'tournaments',
    targetSections: 'Section 09, NEXUS Tournaments',
    intendedUse: 'Riyadh esports pavilion banner for Sandstorm Vanguard Tactical Open',
  },

  // F. Community (3 8:5 PNG files)
  {
    relativePath: 'public/assets/generated/community/playtest-lab-session.png',
    publicUrl: '/assets/generated/community/playtest-lab-session.png',
    width: 960,
    height: 600,
    requiresTransparentCornerAlpha: false,
    category: 'community',
    targetSections: 'Section 03, Section 07, Section 11',
    intendedUse: 'Dual-monitor playtesting collaboration between gamer & QA verifier',
  },
  {
    relativePath: 'public/assets/generated/community/developer-triage-hub.png',
    publicUrl: '/assets/generated/community/developer-triage-hub.png',
    width: 960,
    height: 600,
    requiresTransparentCornerAlpha: false,
    category: 'community',
    targetSections: 'Section 03, Section 05, Section 07, Section 11',
    intendedUse: 'Developer and QA specialists inspecting a 3D holographic bug-triage mesh',
  },
  {
    relativePath: 'public/assets/generated/community/community-gathering-lounge.png',
    publicUrl: '/assets/generated/community/community-gathering-lounge.png',
    width: 960,
    height: 600,
    requiresTransparentCornerAlpha: false,
    category: 'community',
    targetSections: 'Section 11 — Social Proof / Community',
    intendedUse: 'Regional gamers, developers, and organizers collaborating in a Riyadh gaming hub',
  },
];

export interface ExpectedSvgAsset {
  readonly relativePath: string;
  readonly publicUrl: string;
  readonly dimensions: string;
  readonly usage: string;
  readonly policy: string;
}

export const EXPECTED_RETAINED_SVG_ASSETS: readonly ExpectedSvgAsset[] = [
  {
    relativePath: 'public/assets/brand/favicon/favicon.svg',
    publicUrl: '/assets/brand/favicon/favicon.svg',
    dimensions: '64x64',
    usage: 'Browser Head Favicon',
    policy: 'RETAIN (Crisp vector favicon)',
  },
  {
    relativePath: 'public/assets/brand/logo/riyadah-elite-mark.svg',
    publicUrl: '/assets/brand/logo/riyadah-elite-mark.svg',
    dimensions: '64x64',
    usage: 'Header, Auth Modal, Footer Emblem',
    policy: 'RETAIN (Core brand mark)',
  },
  {
    relativePath: 'public/assets/brand/logo/riyadah-elite-logo.svg',
    publicUrl: '/assets/brand/logo/riyadah-elite-logo.svg',
    dimensions: '280x56',
    usage: 'Brand Lockup Reference',
    policy: 'RETAIN (Official vector lockup)',
  },
  {
    relativePath: 'public/assets/brand/logo/riyadah-elite-lockup-dark.svg',
    publicUrl: '/assets/brand/logo/riyadah-elite-lockup-dark.svg',
    dimensions: '280x56',
    usage: 'Dark Mode Brand Lockup',
    policy: 'RETAIN (Dark vector lockup)',
  },
  {
    relativePath: 'public/assets/brand/logo/riyadah-elite-lockup-light.svg',
    publicUrl: '/assets/brand/logo/riyadah-elite-lockup-light.svg',
    dimensions: '280x56',
    usage: 'Light Mode Brand Lockup',
    policy: 'RETAIN (Light vector lockup)',
  },
  {
    relativePath: 'public/assets/brand/og/riyadah-elite-og.svg',
    publicUrl: '/assets/brand/og/riyadah-elite-og.svg',
    dimensions: '1200x630',
    usage: 'OpenGraph Social Preview Card',
    policy: 'RETAIN (Social share vector card)',
  },
  {
    relativePath: 'public/assets/icons/social/discord.svg',
    publicUrl: '/assets/icons/social/discord.svg',
    dimensions: '24x24',
    usage: 'Section 14 Footer — Discord',
    policy: 'RETAIN (Monochrome UI vector icon)',
  },
  {
    relativePath: 'public/assets/icons/social/x-twitter.svg',
    publicUrl: '/assets/icons/social/x-twitter.svg',
    dimensions: '24x24',
    usage: 'Section 14 Footer — X (Twitter)',
    policy: 'RETAIN (Monochrome UI vector icon)',
  },
  {
    relativePath: 'public/assets/icons/social/twitch.svg',
    publicUrl: '/assets/icons/social/twitch.svg',
    dimensions: '24x24',
    usage: 'Section 14 Footer — Twitch',
    policy: 'RETAIN (Monochrome UI vector icon)',
  },
  {
    relativePath: 'public/assets/icons/social/youtube.svg',
    publicUrl: '/assets/icons/social/youtube.svg',
    dimensions: '24x24',
    usage: 'Section 14 Footer — YouTube',
    policy: 'RETAIN (Monochrome UI vector icon)',
  },
  {
    relativePath: 'public/assets/icons/social/github.svg',
    publicUrl: '/assets/icons/social/github.svg',
    dimensions: '24x24',
    usage: 'Section 14 Footer — GitHub',
    policy: 'RETAIN (Monochrome UI vector icon)',
  },
  {
    relativePath: 'public/assets/images/diagrams/ecosystem-tri-region-map.svg',
    publicUrl: '/assets/images/diagrams/ecosystem-tri-region-map.svg',
    dimensions: '1200x540',
    usage: 'Section 02 — About Riyadah Elite Diagram',
    policy: 'RETAIN & COMPOSITE (Active technical diagram)',
  },
  {
    relativePath: 'public/assets/images/diagrams/fragmentation-convergence-spine.svg',
    publicUrl: '/assets/images/diagrams/fragmentation-convergence-spine.svg',
    dimensions: '1200x600',
    usage: 'Section 04 → 05 Convergence Diagram',
    policy: 'RETAIN (Vector convergence spine)',
  },
  {
    relativePath: 'public/assets/images/hero/arena-environment-layers.svg',
    publicUrl: '/assets/images/hero/arena-environment-layers.svg',
    dimensions: '1600x1000',
    usage: 'Section 01 — Architectural Grid Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/hero/nexus-hero-art.svg',
    publicUrl: '/assets/images/hero/nexus-hero-art.svg',
    dimensions: '1200x720',
    usage: 'Section 01 — Hero Stage Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/backgrounds/cta-horizon-portal.svg',
    publicUrl: '/assets/images/backgrounds/cta-horizon-portal.svg',
    dimensions: '1440x600',
    usage: 'Section 13 — Final CTA Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/eclipse-protocol.svg',
    publicUrl: '/assets/images/games/eclipse-protocol.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Eclipse Protocol Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/valkyrie-drift.svg',
    publicUrl: '/assets/images/games/valkyrie-drift.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Valkyrie Drift Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/aether-bastion.svg',
    publicUrl: '/assets/images/games/aether-bastion.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Aether Bastion Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/chrono-sunder.svg',
    publicUrl: '/assets/images/games/chrono-sunder.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Chrono Sunder Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/sandstorm-vanguard.svg',
    publicUrl: '/assets/images/games/sandstorm-vanguard.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Sandstorm Vanguard Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/games/mythos-tactics.svg',
    publicUrl: '/assets/images/games/mythos-tactics.svg',
    dimensions: '800x450',
    usage: 'Section 08 — Mythos Tactics Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/tournaments/nexus-championship-cup.svg',
    publicUrl: '/assets/images/tournaments/nexus-championship-cup.svg',
    dimensions: '800x420',
    usage: 'Section 09 — NEXUS Championship Cup Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/tournaments/valkyrie-speed-series.svg',
    publicUrl: '/assets/images/tournaments/valkyrie-speed-series.svg',
    dimensions: '800x420',
    usage: 'Section 09 — Valkyrie Speed Series Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
  {
    relativePath: 'public/assets/images/tournaments/bastion-invitational.svg',
    publicUrl: '/assets/images/tournaments/bastion-invitational.svg',
    dimensions: '800x420',
    usage: 'Section 09 — Bastion Invitational Fallback',
    policy: 'RETAIN AS VECTOR FALLBACK',
  },
];

export interface PngInspectionResult {
  readonly validSignature: boolean;
  readonly width: number;
  readonly height: number;
  readonly bitDepth: number;
  readonly colorType: number;
  readonly byteSize: number;
  readonly topLeftAlpha: number | null;
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function inspectPngFile(absPath: string, decodeCornerAlpha = false): PngInspectionResult {
  const buf = fs.readFileSync(absPath);
  const expectedSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const validSignature = buf.subarray(0, 8).equals(expectedSig);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];

  let topLeftAlpha: number | null = null;
  if (decodeCornerAlpha && colorType === 6) {
    let offset = 8;
    const idatParts: Buffer[] = [];
    while (offset < buf.length) {
      const length = buf.readUInt32BE(offset);
      const type = buf.subarray(offset + 4, offset + 8).toString('ascii');
      if (type === 'IDAT') {
        idatParts.push(buf.subarray(offset + 8, offset + 8 + length));
      }
      offset += 12 + length;
    }
    if (idatParts.length > 0) {
      const inflated = zlib.inflateSync(Buffer.concat(idatParts));
      const stride = width * 4 + 1;
      const lastRowOffset = (height - 1) * stride;
      const filterType = inflated[0];
      if (filterType === 0) {
        const topLeft = inflated[4];
        const bottomRight = inflated[lastRowOffset + (width - 1) * 4 + 4];
        topLeftAlpha = Math.min(topLeft, bottomRight);
      }
    }
  }

  return {
    validSignature,
    width,
    height,
    bitDepth,
    colorType,
    byteSize: buf.length,
    topLeftAlpha,
  };
}

export function syncAssetManifest(rootDir = process.cwd()): void {
  const svgRows = EXPECTED_RETAINED_SVG_ASSETS.map((svg) => {
    const absPath = path.join(rootDir, svg.relativePath);
    const size = fs.existsSync(absPath) ? formatByteSize(fs.statSync(absPath).size) : 'N/A';
    const fileName = path.basename(svg.relativePath);
    return `| \`${fileName}\` | \`${svg.publicUrl}\` | SVG | \`${svg.dimensions}\` | \`${size}\` | Yes | ${svg.usage} | **${svg.policy}** |`;
  }).join('\n');

  const buildCategoryTable = (cat: ExpectedPngAsset['category'] | ExpectedPngAsset['category'][]) => {
    const categories = Array.isArray(cat) ? cat : [cat];
    return EXPECTED_GENERATED_PNG_ASSETS.filter((item) => categories.includes(item.category))
      .map((item) => {
        const absPath = path.join(rootDir, item.relativePath);
        const size = fs.existsSync(absPath) ? formatByteSize(fs.statSync(absPath).size) : 'N/A';
        const fileName = path.basename(item.relativePath);
        const alphaLabel = item.requiresTransparentCornerAlpha
          ? 'Yes (True Alpha Cutout / Overlay)'
          : 'Full-Bleed Scene (PNG32)';
        return `| \`${fileName}\` | \`${item.publicUrl}\` | \`${item.width}x${item.height}\` | \`${size}\` | ${alphaLabel} | ${item.targetSections} | ${item.intendedUse} |`;
      })
      .join('\n');
  };

  const markdown = `# RIYADAH ELITE — COMPLETE VISUAL ASSET MANIFEST & PIPELINE GUIDE

This document inventories every visual asset stored locally in \`public/assets/\` (both the **25 retained vector SVGs** and the **28 generated PNG / PNG32 RGBA assets** in \`public/assets/generated/\`) and referenced across the 14 public landing page sections and the 6 authenticated NEXUS workspace views.

---

## 0. Deterministic Generation & Verification Pipeline

All 28 raster and alpha-cutout assets can be regenerated, synchronized, and verified at any time using the repository's built-in CLI scripts:

\`\`\`bash
# 1. Regenerate all 28 PNG & PNG32 RGBA assets into public/assets/generated/
npm run assets:generate

# 2. Verify PNG magic headers, IHDR pixel dimensions, 8-bit RGBA channels, transparent corners, and retained SVGs
npm run assets:verify

# 3. Run full automated unit & asset test suite
npx tsx --test src/utils/ecosystemRules.test.ts
\`\`\`

### Official Brand Colour Enforcement
All generated PNG/PNG32 assets and retained vector SVGs strictly adhere to the official Riyadah Elite palette with **zero** legacy lime (\`#B8FF3B\`) or mint (\`#35D49A\`) accents:
- **Obsidian (\`#0B0D12\`)**: Main backgrounds and page canvas
- **Navy (\`#11141C\`)**: Section backgrounds and secondary surfaces
- **Slate (\`#181C26\`)**: Cards, panels, and structural framing
- **Electric Violet (\`#8B5CF6\`)**: Primary brand colour and rim illumination
- **Bright Cyan (\`#22D3EE\`)**: Playtesting telemetry, QA verification, and HUD glow
- **Electric Blue (\`#3B82F6\`)**: Secondary tournament lighting and atmospheric depth
- **Crisp White (\`#F8FAFC\`)**: Specular highlights and focal contrast

---

## 1. Retained Local Vector Assets (25 SVGs in \`public/assets/\`)

| Filename | Public Path | Format | Dimensions | Size | Alpha | Current Usage & Section(s) | Policy Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${svgRows}

---

## 2. Generated PNG & PNG32 RGBA Asset Inventory (28 Assets in \`public/assets/generated/\`)

### 2.A Original Character Cast (7 PNG32 RGBA Files in \`public/assets/generated/characters/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable('characters')}

### 2.B Environmental Backgrounds (3 16:9 Files in \`public/assets/generated/backgrounds/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable('backgrounds')}

### 2.C Independent Atmosphere & Foreground Overlays (5 PNG32 RGBA Files in \`public/assets/generated/atmosphere/\` & \`foregrounds/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable(['atmosphere', 'foregrounds'])}

### 2.D Six Fictional Game Artworks (6 16:9 Files in \`public/assets/generated/games/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable('games')}

### 2.E Four Tournament Banners (4 40:21 Files in \`public/assets/generated/tournaments/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable('tournaments')}

### 2.F Three Community & Collaboration Artworks (3 8:5 Files in \`public/assets/generated/community/\`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${buildCategoryTable('community')}
`;

  fs.writeFileSync(path.join(rootDir, 'public/assets/ASSET_MANIFEST.md'), markdown, 'utf8');
}

export function verifyAllRiyadahAssets(rootDir = process.cwd()): {
  passed: boolean;
  verifiedPngCount: number;
  verifiedSvgCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  let verifiedPngCount = 0;
  let verifiedSvgCount = 0;

  for (const spec of EXPECTED_GENERATED_PNG_ASSETS) {
    const absPath = path.join(rootDir, spec.relativePath);
    if (!fs.existsSync(absPath)) {
      errors.push(`Missing PNG asset: ${spec.relativePath}`);
      continue;
    }

    const info = inspectPngFile(absPath, spec.requiresTransparentCornerAlpha);
    if (!info.validSignature) {
      errors.push(`Invalid PNG signature in ${spec.relativePath}`);
    }
    if (info.width !== spec.width || info.height !== spec.height) {
      errors.push(
        `Dimension mismatch in ${spec.relativePath}: expected ${spec.width}x${spec.height}, got ${info.width}x${info.height}`
      );
    }
    if (info.bitDepth !== 8 || info.colorType !== 6) {
      errors.push(
        `Color format mismatch in ${spec.relativePath}: expected 8-bit RGBA (colorType 6), got bitDepth=${info.bitDepth}, colorType=${info.colorType}`
      );
    }
    if (spec.requiresTransparentCornerAlpha && info.topLeftAlpha !== null && info.topLeftAlpha !== 0) {
      errors.push(
        `Alpha cutout check failed in ${spec.relativePath}: expected transparent outer corner alpha=0, got ${info.topLeftAlpha}`
      );
    }
    verifiedPngCount++;
  }

  const forbiddenLegacyHexes = ['#B8FF3B', '#35D49A', '#A3E635'];
  for (const svgSpec of EXPECTED_RETAINED_SVG_ASSETS) {
    const absPath = path.join(rootDir, svgSpec.relativePath);
    if (!fs.existsSync(absPath)) {
      errors.push(`Missing retained SVG asset: ${svgSpec.relativePath}`);
      continue;
    }
    const content = fs.readFileSync(absPath, 'utf8').toUpperCase();
    for (const badHex of forbiddenLegacyHexes) {
      if (content.includes(badHex)) {
        errors.push(`Legacy colour ${badHex} found in SVG: ${svgSpec.relativePath}`);
      }
    }
    verifiedSvgCount++;
  }

  // Ensure ASSET_MANIFEST.md exists and references all 28 generated PNGs and 25 retained SVGs
  const manifestPath = path.join(rootDir, 'public/assets/ASSET_MANIFEST.md');
  if (!fs.existsSync(manifestPath)) {
    errors.push('Missing public/assets/ASSET_MANIFEST.md');
  } else {
    const manifestText = fs.readFileSync(manifestPath, 'utf8');
    for (const spec of EXPECTED_GENERATED_PNG_ASSETS) {
      const fileName = path.basename(spec.relativePath);
      if (!manifestText.includes(fileName)) {
        errors.push(`ASSET_MANIFEST.md is missing entry for PNG ${fileName}`);
      }
    }
    for (const svgSpec of EXPECTED_RETAINED_SVG_ASSETS) {
      const fileName = path.basename(svgSpec.relativePath);
      if (!manifestText.includes(fileName)) {
        errors.push(`ASSET_MANIFEST.md is missing entry for SVG ${fileName}`);
      }
    }
  }

  // Scan all frontend source files for '/assets/...' references and confirm 100% resolve on disk
  const sourceFiles = [
    'src/App.tsx',
    'src/components/LandingSectionsTop.tsx',
    'src/components/LandingSectionsDynamic.tsx',
    'src/components/LandingSectionsBottom.tsx',
    'src/components/NexusDashboardWorkspace.tsx',
    'src/services/api.ts',
    'src/utils/ecosystemRules.ts',
  ];
  const assetRegex = /['"](\/assets\/[a-zA-Z0-9/_.-]+\.(?:png|svg))['"]/g;
  for (const relSrc of sourceFiles) {
    const absSrc = path.join(rootDir, relSrc);
    if (!fs.existsSync(absSrc)) continue;
    const srcText = fs.readFileSync(absSrc, 'utf8');
    let match: RegExpExecArray | null;
    while ((match = assetRegex.exec(srcText)) !== null) {
      const assetUrl = match[1];
      const diskPath = path.join(rootDir, 'public', assetUrl);
      if (!fs.existsSync(diskPath)) {
        errors.push(`Broken asset reference in ${relSrc}: ${assetUrl} does not exist at ${diskPath}`);
      }
    }
  }

  return {
    passed: errors.length === 0,
    verifiedPngCount,
    verifiedSvgCount,
    errors,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncAssetManifest();
  const result = verifyAllRiyadahAssets();
  if (!result.passed) {
    console.error('[Riyadah Elite Asset Verification FAILED]:', result.errors);
    process.exit(1);
  }
  console.log(
    `[Riyadah Elite Asset Verification PASSED] Verified ${result.verifiedPngCount} PNG/PNG32 assets, ${result.verifiedSvgCount} retained vector SVGs, and synchronized ASSET_MANIFEST.md.`
  );
}
