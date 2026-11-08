/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Riyadah Elite — 14-Section Cinematic Public Landing Page
 * Sequenced in strict chronological order (01 through 14)
 */

import React from 'react';
import { ThemeMode } from '../theme/theme';
import { LandingSectionsTop } from '../components/LandingSectionsTop';
import { LandingSectionsDynamic } from '../components/LandingSectionsDynamic';
import { LandingSectionsBottom } from '../components/LandingSectionsBottom';

export interface PublicLandingPageProps {
  mode?: ThemeMode;
  onOpenNexusRoute?: (route: string, itemId?: string) => void;
  onExploreGames?: () => void;
  onJoinCommunity?: () => void;
  onCreateAccount?: () => void;
  refreshTrigger?: number;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  mode = 'dark',
  onOpenNexusRoute = () => {},
  onExploreGames,
  onJoinCommunity,
  onCreateAccount,
  refreshTrigger = 0,
}) => {
  const handleScrollToSection = (sectionId: string) => {
    if (typeof document !== 'undefined') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGamesExplore = onExploreGames || (() => handleScrollToSection('section-08-games'));
  const handleCommunityJoin = onJoinCommunity || (() => handleScrollToSection('section-11-community'));
  const handleAccountCreate = onCreateAccount || handleCommunityJoin;

  return (
    <div
      className="w-full relative selection:bg-accent-violet selection:text-white"
      data-testid="public-landing-page"
    >
      {/* =====================================================================
          PHASE 1: SECTIONS 01 - 05 (LandingSectionsTop)
          01 · Hero & Atmosphere
          02 · Mission & Ecosystem Manifesto
          03 · Platform Overview & Strategic Pillars
          04 · Playtesting Engine Architecture
          05 · Esports Tournaments & Arena System
      ====================================================================== */}
      <LandingSectionsTop
        mode={mode}
        onExploreGames={handleGamesExplore}
        onJoinCommunity={handleCommunityJoin}
        onOpenNexusRoute={onOpenNexusRoute}
      />

      {/* =====================================================================
          PHASE 2: SECTIONS 06 - 10 (LandingSectionsDynamic)
          06 · How It Works (4-Step Verification Pipeline)
          07 · Live Playtest Telemetry & Schedule
          08 · Games Library & Interactive Filtering Grid
          09 · Competitive Tournament Brackets & Matches
          10 · Global Rankings & Tester Leaderboard Podium
      ====================================================================== */}
      <LandingSectionsDynamic
        mode={mode}
        onOpenNexusRoute={onOpenNexusRoute}
        refreshTrigger={refreshTrigger}
      />

      {/* =====================================================================
          PHASE 3: SECTIONS 11 - 14 (LandingSectionsBottom)
          11 · Community Hub & Discord Integration
          12 · Knowledge Base & Interactive FAQ Accordion
          13 · Developer & Partner Call-to-Action Portal
          14 · Cinematic Footer & Ecosystem Metadata
      ====================================================================== */}
      <LandingSectionsBottom
        mode={mode}
        onCreateAccount={handleAccountCreate}
        onExploreGames={handleGamesExplore}
        onOpenNexusRoute={onOpenNexusRoute}
      />
    </div>
  );
};

export default PublicLandingPage;
