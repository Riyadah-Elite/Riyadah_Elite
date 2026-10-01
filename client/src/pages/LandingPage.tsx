import React from "react";
import { Header } from "../components/landing/Header";
import { HeroShader } from "../components/landing/HeroShader";
import { HeroSection } from "../components/landing/HeroSection";
import { TwoCoreProducts } from "../components/landing/TwoCoreProducts";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { GameTestingShowcase } from "../components/landing/GameTestingShowcase";
import { DeveloperB2BSection } from "../components/landing/DeveloperB2BSection";
import { TournamentShowcase } from "../components/landing/TournamentShowcase";
import { TournamentHostCTA } from "../components/landing/TournamentHostCTA";
import { GamerIdentitySection } from "../components/landing/GamerIdentitySection";
import { CommunityRolesSection } from "../components/landing/CommunityRolesSection";
import { TrustAndSafetySection } from "../components/landing/TrustAndSafetySection";
import { PlatformStatisticsSection } from "../components/landing/PlatformStatisticsSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { Footer } from "../components/landing/Footer";

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />
      <main className="w-full pt-20 bg-[#0a0f35] overflow-x-hidden">
        <div className="flex flex-col w-full text-[#dfe0ff] overflow-x-hidden">
          {/* SECTION 1: HERO WITH WEBGL SHADER */}
          <div className="relative">
            <HeroShader />
            <HeroSection />
          </div>

          {/* SECTION 2: TWO CORE PRODUCTS (TEST GAMES & PLAY TOURNAMENTS) */}
          <TwoCoreProducts />

          {/* SECTION 3: HOW RIYADAH ELITE WORKS (INTERACTIVE 4-STEP LOOP) */}
          <HowItWorksSection />

          {/* SECTION 4: GAME TESTING SHOWCASE WITH LIVE TELEMETRY MOCKUP */}
          <GameTestingShowcase />

          {/* SECTION 5: FOR GAME DEVELOPERS & STUDIOS B2B PIPELINE */}
          <DeveloperB2BSection />

          {/* SECTION 6: TOURNAMENT SHOWCASE WITH INTERACTIVE BRACKETS */}
          <TournamentShowcase />

          {/* SECTION 7: TOURNAMENT HOST CTA */}
          <TournamentHostCTA />

          {/* SECTION 8: GAMER IDENTITY & REPUTATION DASHBOARD */}
          <GamerIdentitySection />

          {/* SECTION 9: BUILT FOR PLAYERS, CREATORS & COMMUNITIES */}
          <CommunityRolesSection />

          {/* SECTION 10: TRUST & SAFETY / BUILT FOR FAIR PLAY */}
          <TrustAndSafetySection />

          {/* SECTION 11: PLATFORM STATISTICS WITH ANIMATED COUNTERS */}
          <PlatformStatisticsSection />

          {/* SECTION 12: DRAMATIC FINAL CTA */}
          <FinalCTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
