# RIYADAH ELITE — COMPLETE VISUAL ASSET MANIFEST & PIPELINE GUIDE

This document inventories every visual asset stored locally in `public/assets/` (both the **25 retained vector SVGs** and the **28 generated PNG / PNG32 RGBA assets** in `public/assets/generated/`) and referenced across the 14 public landing page sections and the 6 authenticated NEXUS workspace views.

---

## 0. Deterministic Generation & Verification Pipeline

All 28 raster and alpha-cutout assets can be regenerated, synchronized, and verified at any time using the repository's built-in CLI scripts:

```bash
# 1. Regenerate all 28 PNG & PNG32 RGBA assets into public/assets/generated/
npm run assets:generate

# 2. Verify PNG magic headers, IHDR pixel dimensions, 8-bit RGBA channels, transparent corners, and retained SVGs
npm run assets:verify

# 3. Run full automated unit & asset test suite
npx tsx --test src/utils/ecosystemRules.test.ts
```

### Official Brand Colour Enforcement
All generated PNG/PNG32 assets and retained vector SVGs strictly adhere to the official Riyadah Elite palette with **zero** legacy lime (`#B8FF3B`) or mint (`#35D49A`) accents:
- **Obsidian (`#0B0D12`)**: Main backgrounds and page canvas
- **Navy (`#11141C`)**: Section backgrounds and secondary surfaces
- **Slate (`#181C26`)**: Cards, panels, and structural framing
- **Electric Violet (`#8B5CF6`)**: Primary brand colour and rim illumination
- **Bright Cyan (`#22D3EE`)**: Playtesting telemetry, QA verification, and HUD glow
- **Electric Blue (`#3B82F6`)**: Secondary tournament lighting and atmospheric depth
- **Crisp White (`#F8FAFC`)**: Specular highlights and focal contrast

---

## 1. Retained Local Vector Assets (25 SVGs in `public/assets/`)

| Filename | Public Path | Format | Dimensions | Size | Alpha | Current Usage & Section(s) | Policy Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `favicon.svg` | `/assets/brand/favicon/favicon.svg` | SVG | `64x64` | `1.0 KB` | Yes | Browser Head Favicon | **RETAIN (Crisp vector favicon)** |
| `riyadah-elite-mark.svg` | `/assets/brand/logo/riyadah-elite-mark.svg` | SVG | `64x64` | `831 B` | Yes | Header, Auth Modal, Footer Emblem | **RETAIN (Core brand mark)** |
| `riyadah-elite-logo.svg` | `/assets/brand/logo/riyadah-elite-logo.svg` | SVG | `280x56` | `1.2 KB` | Yes | Brand Lockup Reference | **RETAIN (Official vector lockup)** |
| `riyadah-elite-lockup-dark.svg` | `/assets/brand/logo/riyadah-elite-lockup-dark.svg` | SVG | `280x56` | `1.2 KB` | Yes | Dark Mode Brand Lockup | **RETAIN (Dark vector lockup)** |
| `riyadah-elite-lockup-light.svg` | `/assets/brand/logo/riyadah-elite-lockup-light.svg` | SVG | `280x56` | `1.2 KB` | Yes | Light Mode Brand Lockup | **RETAIN (Light vector lockup)** |
| `riyadah-elite-og.svg` | `/assets/brand/og/riyadah-elite-og.svg` | SVG | `1200x630` | `1.3 KB` | Yes | OpenGraph Social Preview Card | **RETAIN (Social share vector card)** |
| `discord.svg` | `/assets/icons/social/discord.svg` | SVG | `24x24` | `1.4 KB` | Yes | Section 14 Footer — Discord | **RETAIN (Monochrome UI vector icon)** |
| `x-twitter.svg` | `/assets/icons/social/x-twitter.svg` | SVG | `24x24` | `282 B` | Yes | Section 14 Footer — X (Twitter) | **RETAIN (Monochrome UI vector icon)** |
| `twitch.svg` | `/assets/icons/social/twitch.svg` | SVG | `24x24` | `309 B` | Yes | Section 14 Footer — Twitch | **RETAIN (Monochrome UI vector icon)** |
| `youtube.svg` | `/assets/icons/social/youtube.svg` | SVG | `24x24` | `475 B` | Yes | Section 14 Footer — YouTube | **RETAIN (Monochrome UI vector icon)** |
| `github.svg` | `/assets/icons/social/github.svg` | SVG | `24x24` | `839 B` | Yes | Section 14 Footer — GitHub | **RETAIN (Monochrome UI vector icon)** |
| `ecosystem-tri-region-map.svg` | `/assets/images/diagrams/ecosystem-tri-region-map.svg` | SVG | `1200x540` | `3.9 KB` | Yes | Section 02 — About Riyadah Elite Diagram | **RETAIN & COMPOSITE (Active technical diagram)** |
| `fragmentation-convergence-spine.svg` | `/assets/images/diagrams/fragmentation-convergence-spine.svg` | SVG | `1200x600` | `998 B` | Yes | Section 04 → 05 Convergence Diagram | **RETAIN (Vector convergence spine)** |
| `arena-environment-layers.svg` | `/assets/images/hero/arena-environment-layers.svg` | SVG | `1600x1000` | `5.7 KB` | Yes | Section 01 — Architectural Grid Fallback | **RETAIN AS VECTOR FALLBACK** |
| `nexus-hero-art.svg` | `/assets/images/hero/nexus-hero-art.svg` | SVG | `1200x720` | `4.2 KB` | Yes | Section 01 — Hero Stage Fallback | **RETAIN AS VECTOR FALLBACK** |
| `cta-horizon-portal.svg` | `/assets/images/backgrounds/cta-horizon-portal.svg` | SVG | `1440x600` | `994 B` | Yes | Section 13 — Final CTA Fallback | **RETAIN AS VECTOR FALLBACK** |
| `eclipse-protocol.svg` | `/assets/images/games/eclipse-protocol.svg` | SVG | `800x450` | `1.3 KB` | Yes | Section 08 — Eclipse Protocol Fallback | **RETAIN AS VECTOR FALLBACK** |
| `valkyrie-drift.svg` | `/assets/images/games/valkyrie-drift.svg` | SVG | `800x450` | `1.4 KB` | Yes | Section 08 — Valkyrie Drift Fallback | **RETAIN AS VECTOR FALLBACK** |
| `aether-bastion.svg` | `/assets/images/games/aether-bastion.svg` | SVG | `800x450` | `1.0 KB` | Yes | Section 08 — Aether Bastion Fallback | **RETAIN AS VECTOR FALLBACK** |
| `chrono-sunder.svg` | `/assets/images/games/chrono-sunder.svg` | SVG | `800x450` | `995 B` | Yes | Section 08 — Chrono Sunder Fallback | **RETAIN AS VECTOR FALLBACK** |
| `sandstorm-vanguard.svg` | `/assets/images/games/sandstorm-vanguard.svg` | SVG | `800x450` | `1.0 KB` | Yes | Section 08 — Sandstorm Vanguard Fallback | **RETAIN AS VECTOR FALLBACK** |
| `mythos-tactics.svg` | `/assets/images/games/mythos-tactics.svg` | SVG | `800x450` | `1012 B` | Yes | Section 08 — Mythos Tactics Fallback | **RETAIN AS VECTOR FALLBACK** |
| `nexus-championship-cup.svg` | `/assets/images/tournaments/nexus-championship-cup.svg` | SVG | `800x420` | `1.3 KB` | Yes | Section 09 — NEXUS Championship Cup Fallback | **RETAIN AS VECTOR FALLBACK** |
| `valkyrie-speed-series.svg` | `/assets/images/tournaments/valkyrie-speed-series.svg` | SVG | `800x420` | `815 B` | Yes | Section 09 — Valkyrie Speed Series Fallback | **RETAIN AS VECTOR FALLBACK** |
| `bastion-invitational.svg` | `/assets/images/tournaments/bastion-invitational.svg` | SVG | `800x420` | `872 B` | Yes | Section 09 — Bastion Invitational Fallback | **RETAIN AS VECTOR FALLBACK** |

---

## 2. Generated PNG & PNG32 RGBA Asset Inventory (28 Assets in `public/assets/generated/`)

### 2.A Original Character Cast (7 PNG32 RGBA Files in `public/assets/generated/characters/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `tariq-kestrel-playtester.png` | `/assets/generated/characters/tariq-kestrel-playtester.png` | `720x960` | `46.6 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 (Hero PLAY), Section 02, Section 06 (Step 01), Section 10 (Podium #2), Section 11, Section 13, NEXUS | Lead Gamer & Playtester cutout (Tariq_QA_Core) |
| `nadia-vanguard-verifier.png` | `/assets/generated/characters/nadia-vanguard-verifier.png` | `720x960` | `46.7 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 (Hero TEST/WIN), Section 02, Section 06 (Step 03), Section 10 (Podium #1), Section 11, NEXUS | Principal Netcode Verifier cutout (Nadia_Vanguard) |
| `zayd-architect-developer.png` | `/assets/generated/characters/zayd-architect-developer.png` | `720x960` | `44.4 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 (Hero TEST), Section 02, Section 05, Section 06 (Step 02), Section 10 (Podium #3), Section 11 | Lead Game Developer cutout (Zayd_Mirage) |
| `salma-hex-qa-specialist.png` | `/assets/generated/characters/salma-hex-qa-specialist.png` | `540x720` | `45.6 KB` | Yes (True Alpha Cutout / Overlay) | Section 02 (Region 02), Section 05 (Solution), Section 10 (Rank #6), Section 11 | QA Telemetry & Frame-Time Specialist cutout (Salma_Hex) |
| `faisal-falcon-competitor.png` | `/assets/generated/characters/faisal-falcon-competitor.png` | `720x960` | `48.2 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 (Hero WIN), Section 02, Section 06 (Step 04), Section 10 (Rank #4), Section 11, Section 13 | Champion Esports Competitor cutout (Faisal_Falcons) |
| `elena-syndicate-community.png` | `/assets/generated/characters/elena-syndicate-community.png` | `540x720` | `44.3 KB` | Yes (True Alpha Cutout / Overlay) | Section 02 (Region 03), Section 11 (Community Cast Showcase) | Esports Organizer & Community Representative cutout (Elena_Syndicate) |
| `character-reference-sheet.png` | `/assets/generated/characters/character-reference-sheet.png` | `1280x720` | `203.1 KB` | Yes (True Alpha Cutout / Overlay) | Section 11 — Community Cast Reference | Official 6-character lineup turnaround sheet |

### 2.B Environmental Backgrounds (3 16:9 Files in `public/assets/generated/backgrounds/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `hero-nexus-arena.png` | `/assets/generated/backgrounds/hero-nexus-arena.png` | `1440x810` | `401.3 KB` | Full-Bleed Scene (PNG32) | Section 01 — Hero Background Canvas | Full-viewport futuristic cyber-esports arena with left negative space for typography |
| `ecosystem-citadel-vista.png` | `/assets/generated/backgrounds/ecosystem-citadel-vista.png` | `1440x810` | `402.2 KB` | Full-Bleed Scene (PNG32) | Section 01 — Hero Visual Stage | Tri-region gaming ecosystem rotunda connected by violet & cyan conduits |
| `cta-horizon-portal.png` | `/assets/generated/backgrounds/cta-horizon-portal.png` | `1440x810` | `408.5 KB` | Full-Bleed Scene (PNG32) | Section 13 — Final CTA | Concluding Horizon Portal architectural environment |

### 2.C Independent Atmosphere & Foreground Overlays (5 PNG32 RGBA Files in `public/assets/generated/atmosphere/` & `foregrounds/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `volumetric-light-rays.png` | `/assets/generated/atmosphere/volumetric-light-rays.png` | `1440x810` | `25.9 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 — Hero, Section 13 — Final CTA | Independent volumetric violet, cyan & blue light-ray layer |
| `atmospheric-fog-layer.png` | `/assets/generated/atmosphere/atmospheric-fog-layer.png` | `1440x480` | `602.6 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 → 02 Mist Horizon Bridge | Scroll-linked atmospheric mist transitioning Hero into About |
| `cyber-particles-overlay.png` | `/assets/generated/atmosphere/cyber-particles-overlay.png` | `1200x720` | `76.1 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 — Hero Stage | Independent floating bokeh & telemetry particle field |
| `arena-architectural-foreground.png` | `/assets/generated/foregrounds/arena-architectural-foreground.png` | `1440x810` | `9.7 KB` | Yes (True Alpha Cutout / Overlay) | Section 01 — Hero Stage Foreground | Independent structural framing gantry trusses in front of environment backdrop |
| `horizon-mist-foreground.png` | `/assets/generated/foregrounds/horizon-mist-foreground.png` | `1440x320` | `123.7 KB` | Yes (True Alpha Cutout / Overlay) | Section 13 — Final CTA | Bottom-edge grounding portal mist gradient layer |

### 2.D Six Fictional Game Artworks (6 16:9 Files in `public/assets/generated/games/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `eclipse-protocol.png` | `/assets/generated/games/eclipse-protocol.png` | `960x540` | `223.0 KB` | Full-Bleed Scene (PNG32) | Section 03, Section 08, NEXUS Games | Extraction Sci-Fi key art for Eclipse Protocol (text-free) |
| `valkyrie-drift.png` | `/assets/generated/games/valkyrie-drift.png` | `960x540` | `188.6 KB` | Full-Bleed Scene (PNG32) | Section 08, NEXUS Games | Cyber Racing key art for Valkyrie Drift: Zero (text-free) |
| `aether-bastion.png` | `/assets/generated/games/aether-bastion.png` | `960x540` | `198.3 KB` | Full-Bleed Scene (PNG32) | Section 08, NEXUS Games | Strategy Arena key art for Aether Bastion (text-free) |
| `chrono-sunder.png` | `/assets/generated/games/chrono-sunder.png` | `960x540` | `217.3 KB` | Full-Bleed Scene (PNG32) | Section 08, NEXUS Games | Action RPG key art for Chrono Sunder (text-free) |
| `sandstorm-vanguard.png` | `/assets/generated/games/sandstorm-vanguard.png` | `960x540` | `201.6 KB` | Full-Bleed Scene (PNG32) | Section 08, NEXUS Games | Tactical Shooter key art for Sandstorm Vanguard (text-free) |
| `mythos-tactics.png` | `/assets/generated/games/mythos-tactics.png` | `960x540` | `211.5 KB` | Full-Bleed Scene (PNG32) | Section 08, NEXUS Games | Hex-Grid Strategy key art for Mythos Tactics (text-free) |

### 2.E Four Tournament Banners (4 40:21 Files in `public/assets/generated/tournaments/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `nexus-championship-cup.png` | `/assets/generated/tournaments/nexus-championship-cup.png` | `960x504` | `298.6 KB` | Full-Bleed Scene (PNG32) | Section 03, Section 09, NEXUS Tournaments | Championship arena stage banner for NEXUS Championship Cup — Season IV |
| `valkyrie-speed-series.png` | `/assets/generated/tournaments/valkyrie-speed-series.png` | `960x504` | `268.6 KB` | Full-Bleed Scene (PNG32) | Section 09, NEXUS Tournaments | Night circuit stadium banner for Valkyrie Telemetry Grand Prix |
| `bastion-invitational.png` | `/assets/generated/tournaments/bastion-invitational.png` | `960x504` | `255.0 KB` | Full-Bleed Scene (PNG32) | Section 09, NEXUS Tournaments | Holographic citadel arena banner for Aether Bastion Siege Invitational |
| `mena-challenger-open.png` | `/assets/generated/tournaments/mena-challenger-open.png` | `960x504` | `283.9 KB` | Full-Bleed Scene (PNG32) | Section 09, NEXUS Tournaments | Riyadh esports pavilion banner for Sandstorm Vanguard Tactical Open |

### 2.F Three Community & Collaboration Artworks (3 8:5 Files in `public/assets/generated/community/`)

| Asset Name | Public Path | Dimensions | Size | Alpha Status | Target Section(s) | Intended Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `playtest-lab-session.png` | `/assets/generated/community/playtest-lab-session.png` | `960x600` | `183.3 KB` | Full-Bleed Scene (PNG32) | Section 03, Section 07, Section 11 | Dual-monitor playtesting collaboration between gamer & QA verifier |
| `developer-triage-hub.png` | `/assets/generated/community/developer-triage-hub.png` | `960x600` | `222.6 KB` | Full-Bleed Scene (PNG32) | Section 03, Section 05, Section 07, Section 11 | Developer and QA specialists inspecting a 3D holographic bug-triage mesh |
| `community-gathering-lounge.png` | `/assets/generated/community/community-gathering-lounge.png` | `960x600` | `175.6 KB` | Full-Bleed Scene (PNG32) | Section 11 — Social Proof / Community | Regional gamers, developers, and organizers collaborating in a Riyadh gaming hub |
