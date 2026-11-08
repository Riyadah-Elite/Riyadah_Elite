import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { Surface, PALETTE, type RGBA } from './generateAssets.ts';

/**
 * RIYADAH ELITE — DIAGRAM & RASTER ASSET GENERATOR
 * Generates crisp, high-resolution PNG raster assets for diagrams and syncs
 * games, tournaments, and community raster assets into `assets/images/` and `public/assets/images/`.
 */

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveSurface(surface: Surface, targetRelPaths: string[]) {
  const pngBuffer = surface.encodePNG();
  for (const rel of targetRelPaths) {
    const fullPath = path.resolve(process.cwd(), rel);
    ensureDir(fullPath);
    fs.writeFileSync(fullPath, pngBuffer);
    console.log(`[Raster Generator] Wrote ${surface.width}x${surface.height} -> ${rel}`);
  }
}

// 1. Ecosystem Tri-Region Map (1200 x 540)
export function createEcosystemTriRegionMap(): Surface {
  const s = new Surface(1200, 540, PALETTE.obsidian);
  s.fillVerticalGradient(PALETTE.obsidian, PALETTE.slate);
  s.addRadialGlow(600, 250, 420, PALETTE.violet, 110);
  s.addRadialGlow(600, 250, 260, PALETTE.cyan, 90);

  // Perspective Horizon Grid
  s.drawPerspectiveGrid(320, PALETTE.violet, PALETTE.cyan);

  // Concentric Orbit Rings
  s.strokeCircle(600, 250, 210, 2, PALETTE.violet, 100);
  s.strokeCircle(600, 250, 140, 2, PALETTE.cyan, 140);
  s.strokeCircle(600, 250, 60, 3, PALETTE.blue, 200);

  // Central Core Nexus Hub
  s.fillRect(560, 210, 80, 80, PALETTE.elevated, 255);
  s.strokeRect(560, 210, 80, 80, 2.5, PALETTE.cyan, 240);
  s.fillCircle(600, 250, 24, PALETTE.violet, 255);
  s.strokeCircle(600, 250, 24, 2, PALETTE.cyan, 255);

  // Connecting Conduits
  s.drawLine(520, 220, 280, 155, 3, PALETTE.violet, 230);
  s.drawLine(600, 290, 600, 410, 3, PALETTE.cyan, 240);
  s.drawLine(680, 220, 920, 155, 3, PALETTE.blue, 230);

  // Region 01: Gamers & Playtesters (Left Node)
  s.fillRect(100, 95, 270, 125, PALETTE.navy, 240);
  s.strokeRect(100, 95, 270, 125, 2.5, PALETTE.violet, 240);
  s.fillCircle(145, 155, 24, PALETTE.violet, 200);
  s.strokeCircle(145, 155, 24, 2, PALETTE.cyan, 255);
  s.fillRect(190, 130, 150, 14, PALETTE.violet, 220);
  s.fillRect(190, 155, 130, 10, PALETTE.cyan, 200);
  s.fillRect(190, 175, 110, 8, PALETTE.silver, 160);

  // Region 02: Studios & Developers (Bottom Node)
  s.fillRect(465, 385, 270, 125, PALETTE.navy, 240);
  s.strokeRect(465, 385, 270, 125, 2.5, PALETTE.cyan, 240);
  s.fillRect(495, 425, 42, 42, PALETTE.cyan, 200);
  s.strokeRect(495, 425, 42, 42, 2, PALETTE.violet, 255);
  s.fillRect(555, 420, 150, 14, PALETTE.cyan, 220);
  s.fillRect(555, 445, 130, 10, PALETTE.violet, 200);
  s.fillRect(555, 465, 110, 8, PALETTE.silver, 160);

  // Region 03: Esports Organizations (Right Node)
  s.fillRect(830, 95, 270, 125, PALETTE.navy, 240);
  s.strokeRect(830, 95, 270, 125, 2.5, PALETTE.blue, 240);
  s.fillCircle(875, 155, 24, PALETTE.blue, 200);
  s.strokeCircle(875, 155, 24, 2, PALETTE.amber, 255);
  s.fillRect(920, 130, 150, 14, PALETTE.blue, 220);
  s.fillRect(920, 155, 130, 10, PALETTE.amber, 200);
  s.fillRect(920, 175, 110, 8, PALETTE.silver, 160);

  return s;
}

// 2. Fragmentation Convergence Spine (1200 x 600)
export function createFragmentationConvergenceSpine(): Surface {
  const s = new Surface(1200, 600, PALETTE.obsidian);
  s.fillVerticalGradient(PALETTE.obsidian, PALETTE.slate);
  s.addRadialGlow(600, 300, 320, PALETTE.violet, 140);
  s.addRadialGlow(600, 300, 180, PALETTE.cyan, 180);

  // Upper Fragmented Ray Lines
  const upperStarts = [120, 360, 600, 840, 1080];
  for (const x of upperStarts) {
    s.drawLine(x, 40, 600, 300, 2, [239, 68, 68, 140]);
  }

  // Lower Unified Convergence Grid
  const lowerEnds = [200, 400, 600, 800, 1000];
  for (const x of lowerEnds) {
    s.drawLine(600, 300, x, 560, 2.5, PALETTE.blue, 210);
  }

  // Central Convergence Core
  s.fillCircle(600, 300, 48, PALETTE.slate, 255);
  s.strokeCircle(600, 300, 48, 3.5, PALETTE.violet, 255);
  s.fillCircle(600, 300, 20, PALETTE.cyan, 255);
  s.strokeCircle(600, 300, 72, 1.5, PALETTE.cyan, 160);

  return s;
}

export function syncAllRasterAssets() {
  console.log('[Raster Pipeline] Generating diagram PNG assets...');
  
  // Diagrams
  const triRegionMap = createEcosystemTriRegionMap();
  saveSurface(triRegionMap, [
    'public/assets/images/diagrams/ecosystem-tri-region-map.png',
    'assets/images/diagrams/ecosystem-tri-region-map.png',
    'images/diagrams/ecosystem-tri-region-map.png',
  ]);

  const convergenceSpine = createFragmentationConvergenceSpine();
  saveSurface(convergenceSpine, [
    'public/assets/images/diagrams/fragmentation-convergence-spine.png',
    'assets/images/diagrams/fragmentation-convergence-spine.png',
    'images/diagrams/fragmentation-convergence-spine.png',
  ]);

  // Synchronize generated games into images/games
  const gameFiles = [
    'aether-bastion.png',
    'chrono-sunder.png',
    'eclipse-protocol.png',
    'mythos-tactics.png',
    'sandstorm-vanguard.png',
    'valkyrie-drift.png',
  ];

  for (const gf of gameFiles) {
    const src = path.resolve(process.cwd(), 'public/assets/generated/games', gf);
    if (fs.existsSync(src)) {
      const buf = fs.readFileSync(src);
      const dest1 = path.resolve(process.cwd(), 'public/assets/images/games', gf);
      const dest2 = path.resolve(process.cwd(), 'assets/images/games', gf);
      const dest3 = path.resolve(process.cwd(), 'images/games', gf);
      ensureDir(dest1); fs.writeFileSync(dest1, buf);
      ensureDir(dest2); fs.writeFileSync(dest2, buf);
      ensureDir(dest3); fs.writeFileSync(dest3, buf);
    }
  }

  // Synchronize generated tournaments into images/tournaments
  const tournamentFiles = [
    'bastion-invitational.png',
    'mena-challenger-open.png',
    'nexus-championship-cup.png',
    'valkyrie-speed-series.png',
  ];

  for (const tf of tournamentFiles) {
    const src = path.resolve(process.cwd(), 'public/assets/generated/tournaments', tf);
    if (fs.existsSync(src)) {
      const buf = fs.readFileSync(src);
      const dest1 = path.resolve(process.cwd(), 'public/assets/images/tournaments', tf);
      const dest2 = path.resolve(process.cwd(), 'assets/images/tournaments', tf);
      const dest3 = path.resolve(process.cwd(), 'images/tournaments', tf);
      ensureDir(dest1); fs.writeFileSync(dest1, buf);
      ensureDir(dest2); fs.writeFileSync(dest2, buf);
      ensureDir(dest3); fs.writeFileSync(dest3, buf);
    }
  }

  // Synchronize generated community into images/community
  const communityFiles = [
    'developer-triage-hub.png',
    'playtest-lab-session.png',
    'community-gathering-lounge.png',
  ];

  for (const cf of communityFiles) {
    const src = path.resolve(process.cwd(), 'public/assets/generated/community', cf);
    if (fs.existsSync(src)) {
      const buf = fs.readFileSync(src);
      const dest1 = path.resolve(process.cwd(), 'public/assets/images/community', cf);
      const dest2 = path.resolve(process.cwd(), 'assets/images/community', cf);
      const dest3 = path.resolve(process.cwd(), 'images/community', cf);
      ensureDir(dest1); fs.writeFileSync(dest1, buf);
      ensureDir(dest2); fs.writeFileSync(dest2, buf);
      ensureDir(dest3); fs.writeFileSync(dest3, buf);
    }
  }

  // Synchronize generated backgrounds into images/backgrounds & hero
  const bgFiles = [
    { src: 'cta-horizon-portal.png', destFolder: 'backgrounds' },
    { src: 'ecosystem-citadel-vista.png', destFolder: 'backgrounds' },
    { src: 'hero-nexus-arena.png', destFolder: 'hero' },
  ];

  for (const bg of bgFiles) {
    const src = path.resolve(process.cwd(), 'public/assets/generated/backgrounds', bg.src);
    if (fs.existsSync(src)) {
      const buf = fs.readFileSync(src);
      const dest1 = path.resolve(process.cwd(), `public/assets/images/${bg.destFolder}`, bg.src);
      const dest2 = path.resolve(process.cwd(), `assets/images/${bg.destFolder}`, bg.src);
      const dest3 = path.resolve(process.cwd(), `images/${bg.destFolder}`, bg.src);
      ensureDir(dest1); fs.writeFileSync(dest1, buf);
      ensureDir(dest2); fs.writeFileSync(dest2, buf);
      ensureDir(dest3); fs.writeFileSync(dest3, buf);
    }
  }

  console.log('[Raster Pipeline] All diagrams, games, tournaments, community, and hero images converted to high-resolution PNGs.');
}

syncAllRasterAssets();
