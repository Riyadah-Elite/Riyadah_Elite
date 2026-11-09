import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, ArrowUp, ArrowRight, Users, GitMerge, ShieldCheck } from 'lucide-react';
import { View, Text, Pressable, Image } from './primitives';
import { theme, ThemeMode } from '../theme/theme';
import { RIYADAH_CHARACTER_CAST } from '../utils/ecosystemRules';
import {
  ScrollReveal,
  BauhausSectionBadge,
  SplitTextReveal,
  DirectionalSlide,
  RadialExpansion,
  MosaicReveal,
  AccordionExpand,
  StructuralLineDraw,
  MagneticButton,
  ImageZoomFrame,
} from './ScrollReveal';
import cinematicStyles from '../styles/CinematicStage.module.css';
import surfaceStyles from '../styles/SurfaceEffects.module.css';
import mediaStyles from '../styles/MediaPresentation.module.css';

interface BottomSectionsProps {
  mode: ThemeMode;
  onCreateAccount: () => void;
  onExploreGames: () => void;
  onOpenNexusRoute: (route: string) => void;
}

const FAQ_ITEMS = [
  {
    q: 'What is Riyadah Elite?',
    a: 'Riyadah Elite is an integrated gaming and playtesting ecosystem that connects gamers, verified QA playtesters, game developers, and esports organizations through game discovery, structured playtesting, reproducible bug reporting, tournaments, and dual-track player progression.',
  },
  {
    q: 'Who can join?',
    a: 'Any gamer, community playtester, independent or studio game developer, and esports tournament organizer can join Riyadah Elite and configure their account role.',
  },
  {
    q: 'How does game testing work?',
    a: 'Developers publish upcoming or live game builds with specific test objectives. Players enroll in an Open Playtest, Closed Beta, or Bug Bounty cohort, test the build on their supported platform, and submit structured feedback.',
  },
  {
    q: 'How do I report bugs?',
    a: 'Inside the Bug Reporting module, select the target game build, classify the issue severity (Critical, High, Medium, or Low), and fill in the structured reproduction steps, expected behavior, and actual behavior.',
  },
  {
    q: 'Can developers publish games?',
    a: 'Yes. Verified studios and independent developers can list game builds, define playtesting missions, triage incoming community bug reports, and coordinate launch tournaments.',
  },
  {
    q: 'How do tournaments work?',
    a: 'Organizations and studios schedule tournaments with transparent slot capacities, registration deadlines, prize structures, and live Single Elimination, Double Elimination, or Swiss brackets.',
  },
  {
    q: 'How are tester rankings calculated?',
    a: 'Tester Rankings are calculated strictly from verified QA contributions—including the severity of confirmed bug reports, reproduction accuracy rate, and completed playtest builds—kept completely separate from tournament match standings.',
  },
  {
    q: 'Is registration free?',
    a: 'Yes. Creating a Riyadah Elite player and playtester account, enrolling in open playtests, submitting bug reports, and entering community tournaments are free.',
  },
  {
    q: 'How can organizations join?',
    a: 'Esports organizations and community hosts can register an organizer profile or contact our partnership desk to host verified tournaments and scout top regional players and playtesters.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach the Riyadah Elite support and triage operations team directly through the Support Desk modal in the footer or via your authenticated NEXUS workspace notifications panel.',
  },
];

export const LandingSectionsBottom: React.FC<BottomSectionsProps> = ({
  mode,
  onCreateAccount,
  onExploreGames,
  onOpenNexusRoute,
}) => {
  const t = theme[mode];
  const isDark = mode === 'dark';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [infoModal, setInfoModal] = useState<{ title: string; body: string } | null>(null);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* =====================================================================
          SECTION 11 — SOCIAL PROOF / COMMUNITY (PRIMARY: 4-TILE MOSAIC IMAGE REVEAL + COUNTER-DIRECTIONAL COPY)
      ====================================================================== */}
      <View
        as="section"
        id="section-11-community"
        testID="section-11-community"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.surface}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <DirectionalSlide direction="left">
            <View className="max-w-3xl space-y-4 mb-12">
              <BauhausSectionBadge
                index="11"
                label="COLLABORATIVE ECOSYSTEM CULTURE"
                accent="violet"
                mode={mode}
              />
              <Text
                as="h2"
                className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
              >
                BUILT AROUND THE GAMING COMMUNITY.
              </Text>
              <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                Riyadah Elite is designed around transparent collaboration between players who test
                and compete, engineers who iterate on builds, and organizers who run structured
                events.
              </Text>
            </View>
          </DirectionalSlide>

          <View className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Community Visual Showcase — Assembles via 4-Quadrant Mosaic Reveal */}
            <div className="lg:col-span-6">
              <View
                className={`h-full rounded-xl overflow-hidden flex flex-col justify-between ${surfaceStyles.bauhausCard} ${t.styles.bauhaus.architecturalCard}`}
              >
                <MosaicReveal
                  delay={0.08}
                  className={mediaStyles.communityShowcaseFrame}
                >
                  <Image
                    source="/assets/generated/community/playtest-lab-session.png"
                    alt="Riyadah Elite Community Playtesting Workstation Collaboration"
                    className="w-full h-full object-cover"
                  />
                </MosaicReveal>

                <DirectionalSlide direction="left" delay={0.22} distance={18} className="p-6 space-y-2">
                  <Text as="p" className={`font-mono text-xs ${t.classes.cyanAccentText}`}>
                    PLAYTEST COHORTS & TELEMETRY LABS
                  </Text>
                  <Text as="h3" className={`font-display text-xl font-bold ${t.classes.textPrimary}`}>
                    Direct Player-to-Studio Feedback Loops
                  </Text>
                  <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                    Instead of losing feedback in noisy chat streams, community testers collaborate
                    on versioned builds where every reproduction step is tracked and credited to the
                    contributor profile.
                  </Text>
                </DirectionalSlide>
              </View>
            </div>

            {/* Right Community Pillars — Enter from Opposite Vector + Secondary Visuals */}
            <View className="lg:col-span-6 flex flex-col justify-between gap-4">
              {[
                {
                  icon: Users,
                  iconColor: 'text-accent-violet',
                  title: 'Dedicated Playtesting Guilds',
                  desc: 'Players organize around specific genres—from high-tickrate tactical shooters to physics-heavy racing sims—helping developers validate edge cases before launch.',
                  image: '/assets/generated/community/community-gathering-lounge.png',
                },
                {
                  icon: GitMerge,
                  iconColor: t.classes.cyanAccentText,
                  title: 'Transparent Patch Verification',
                  desc: 'When studios deploy a release candidate fix, original bug reporters are notified to confirm resolution and earn verification bonuses.',
                  image: '/assets/generated/community/developer-triage-hub.png',
                },
                {
                  icon: ShieldCheck,
                  iconColor: t.classes.blueAccentText,
                  title: 'Grassroots to Premier Tournaments',
                  desc: 'Community organizers host weekly scrims and seasonal championships directly linked to the games the community has helped test and refine.',
                  image: '/assets/generated/tournaments/nexus-championship-cup.png',
                },
              ].map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <DirectionalSlide
                    key={pillar.title}
                    direction="right"
                    delay={0.14 + idx * 0.1}
                    distance={32}
                  >
                    <View
                      className={`rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors hover:border-accent-violet ${surfaceStyles.bauhausCard} ${surfaceStyles.bauhausCardInteractive} ${t.styles.bauhaus.architecturalCard}`}
                    >
                      <ImageZoomFrame className="w-full sm:w-32 h-24 shrink-0 rounded-lg overflow-hidden border border-border-subtle">
                        <Image
                          source={pillar.image}
                          alt={pillar.title}
                          className="w-full h-full object-cover"
                        />
                      </ImageZoomFrame>
                      <View className="space-y-1.5">
                        <View className="flex items-center gap-2.5">
                          <IconComp className={`w-4 h-4 ${pillar.iconColor}`} />
                          <Text as="h3" className={`font-display text-base font-bold ${t.classes.textPrimary}`}>
                            {pillar.title}
                          </Text>
                        </View>
                        <Text as="p" className={`text-xs sm:text-sm leading-relaxed ${t.classes.textSecondary}`}>
                          {pillar.desc}
                        </Text>
                      </View>
                    </View>
                  </DirectionalSlide>
                );
              })}
            </View>
          </View>

          {/* RIYADAH ELITE ORIGINAL CHARACTER CAST SHOWCASE */}
          <View
            testID="community-character-cast-showcase"
            className="mt-12 pt-10 border-t border-border-subtle/80 space-y-6"
          >
            <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <View className="space-y-2">
                <Text as="p" className={`font-mono text-xs font-semibold ${t.classes.cyanAccentText}`}>
                  ORIGINAL RIYADAH ELITE CAST · SIX ECOSYSTEM ARCHETYPES
                </Text>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Meet the Faces of the NEXUS Ecosystem
                </Text>
              </View>
              <Text as="p" className={`text-xs font-mono ${t.classes.textMuted}`}>
                Consistent Character Design System · Isolated RGBA Cutouts & Turnaround Sheet
              </Text>
            </View>

            {/* Character Cast Roster Grid */}
            <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RIYADAH_CHARACTER_CAST.map((char, idx) => (
                <DirectionalSlide
                  key={char.id}
                  direction="bottom"
                  delay={0.05 * idx}
                  distance={16}
                >
                  <View
                    testID={`character-card-${char.id}`}
                    className={`h-full rounded-xl p-5 flex items-center gap-4 border border-border-subtle hover:border-accent-violet transition-colors ${mediaStyles.characterCastCard} ${t.styles.bauhaus.architecturalCard}`}
                  >
                    <div className="w-20 h-28 shrink-0 flex items-end justify-center">
                      <Image
                        source={char.cutoutUrl}
                        alt={`${char.name} (${char.handle}) — ${char.archetype}`}
                        className={`max-h-28 w-auto object-contain ${mediaStyles.transparentCutoutStage}`}
                      />
                    </div>
                    <View className="min-w-0 space-y-1">
                      <Text as="span" className={`font-mono text-[11px] font-bold ${t.classes.cyanAccentText}`}>
                        {char.archetype.toUpperCase()}
                      </Text>
                      <Text as="h4" className={`font-display text-base font-bold truncate ${t.classes.textPrimary}`}>
                        {char.name}
                      </Text>
                      <Text as="p" className={`font-mono text-xs ${t.classes.violetAccentText}`}>
                        @{char.handle} · {char.region}
                      </Text>
                      <Text as="p" className={`text-xs leading-snug pt-1 ${t.classes.textSecondary}`}>
                        {char.specialty}
                      </Text>
                    </View>
                  </View>
                </DirectionalSlide>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* =====================================================================
          SECTION 12 — FAQ (PRIMARY: SMOOTH HEIGHT ACCORDION EXPANSION + GEOMETRIC INDICATOR MORPH)
      ====================================================================== */}
      <View
        as="section"
        id="section-12-faq"
        testID="section-12-faq"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.canvas}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <ScrollReveal variant="quiet-settle">
            <View className="max-w-3xl space-y-4 mb-12">
              <BauhausSectionBadge
                index="12"
                label="PLATFORM POLICIES & ANSWERS"
                accent="cyan"
                mode={mode}
              />
              <Text
                as="h2"
                className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
              >
                GOT QUESTIONS? WE HAVE ANSWERS.
              </Text>
              <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                Clear answers on how Riyadah Elite handles account registration, playtesting, bug
                verification, tournament brackets, and studio onboarding.
              </Text>
            </View>
          </ScrollReveal>

          <ScrollReveal variant="quiet-settle" delay={0.08}>
            <View className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `faq-panel-${idx}`;
                const btnId = `faq-btn-${idx}`;
                return (
                  <View
                    key={item.q}
                    className={`rounded-xl transition-colors ${
                      isOpen ? 'border-accent-violet' : ''
                    } ${surfaceStyles.bauhausCard} ${t.styles.bauhaus.architecturalCard}`}
                  >
                    <Pressable
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onPress={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <Text
                        as="span"
                        className={`font-display text-base font-bold ${t.classes.textPrimary}`}
                      >
                        {item.q}
                      </Text>

                      {/* Bauhaus Geometric Plus/Minus & Chevron Indicator */}
                      <span
                        aria-hidden="true"
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'bg-accent-violet text-white rotate-180'
                            : `${t.styles.glass.iconBadge}`
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </Pressable>

                    <AccordionExpand
                      isOpen={isOpen}
                      id={panelId}
                      labelledBy={btnId}
                      className={`px-5 pb-5 pt-2 border-t ${t.classes.borderSubtle}`}
                    >
                      <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                        {item.a}
                      </Text>
                    </AccordionExpand>
                  </View>
                );
              })}
            </View>
          </ScrollReveal>
        </View>
      </View>

      {/* =====================================================================
          SECTION 13 — FINAL CTA (PRIMARY: HORIZON PORTAL GEOMETRIC EXPANSION + SPLIT TEXT + MAGNETIC CTAS)
      ====================================================================== */}
      <View
        as="section"
        id="section-13-final-cta"
        testID="section-13-final-cta"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} bg-card`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <View className={`${cinematicStyles.horizonPortalStage} border-2 border-[#8B5CF6]/55 p-8 sm:p-12 lg:p-16 text-white`}>
            {/* Concluding Act IV Horizon Portal Multi-Layered PNG Vista */}
            <Image
              source="/assets/generated/backgrounds/cta-horizon-portal.png"
              alt="Riyadah Elite Horizon Portal"
              className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-65"
            />
            <Image
              source="/assets/generated/atmosphere/volumetric-light-rays.png"
              alt=""
              aria-hidden="true"
              className={cinematicStyles.volumetricRaysOverlay}
            />
            <Image
              source="/assets/generated/foregrounds/horizon-mist-foreground.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 object-cover opacity-55 z-[4]"
            />

            {/* Top Animated Bauhaus Spectrum Line */}
            <StructuralLineDraw
              orientation="horizontal"
              className={`absolute top-0 left-0 right-0 h-2 ${surfaceStyles.bauhausSpectrumBar} z-20`}
            />

            {/* Outward Expanding Concentric Bauhaus Geometric Composition + Lead Character Cutouts */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <RadialExpansion
                delay={0.05}
                className="absolute -right-16 -top-16 w-80 h-80 flex items-center justify-center"
              >
                <div className="w-full h-full rounded-full border-4 border-[#22D3EE]/35 flex items-center justify-center">
                  <div className="w-52 h-52 rounded-full border-2 border-[#8B5CF6]/45 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#3B82F6]/25" />
                  </div>
                </div>
              </RadialExpansion>

              <div className="hidden lg:flex items-end justify-end absolute right-8 bottom-0 z-[5] gap-1">
                <Image
                  source="/assets/generated/characters/nadia-vanguard-verifier.png"
                  alt=""
                  className={`h-64 w-auto object-contain -mr-6 ${mediaStyles.characterStageFigure}`}
                />
                <Image
                  source="/assets/generated/characters/faisal-falcon-competitor.png"
                  alt=""
                  className={`h-72 w-auto object-contain relative z-10 ${mediaStyles.characterStageFigure}`}
                />
              </div>
            </div>

            {/* Directional Readability Scrim for High-Contrast Editorial Headline Over Portal */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0D12]/92 via-[#0B0D12]/72 to-[#0B0D12]/25 z-[3]"
            />

            <View className="relative z-10 max-w-2xl space-y-6">
              <DirectionalSlide direction="left" delay={0.06} distance={18}>
                <View className="inline-flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#22D3EE] text-[#0B0D12] font-mono text-xs font-extrabold inline-flex items-center justify-center">
                    13
                  </span>
                  <Text
                    as="p"
                    className="font-mono text-xs font-semibold tracking-wider text-[#22D3EE]"
                  >
                    JOIN THE RIYADAH ELITE ECOSYSTEM
                  </Text>
                </View>
              </DirectionalSlide>

              {/* Main Climax Heading Revealed via Split-Text Masks */}
              <SplitTextReveal
                as="h2"
                baseDelay={0.04}
                stagger={0.04}
                className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(11,13,18,0.9)]"
                words={[
                  { text: 'YOUR' },
                  { text: 'NEXT' },
                  { text: 'GAMING', className: 'text-[#22D3EE]' },
                  { text: 'EXPERIENCE' },
                  { text: 'STARTS' },
                  { text: 'HERE.', className: 'text-[#A78BFA]' },
                ]}
              />

              <DirectionalSlide direction="bottom" delay={0.12} distance={14}>
                <Text as="p" className="text-base sm:text-lg text-[#CBD5E1] max-w-2xl leading-relaxed">
                  Create your free player and tester profile today to unlock active game playtests,
                  submit verified bug reports, and compete in seasonal NEXUS tournaments.
                </Text>
              </DirectionalSlide>

              {/* Staggered Magnetic Climax CTA Buttons */}
              <View className="flex flex-wrap items-center gap-4 pt-2">
                <DirectionalSlide direction="bottom" delay={0.16} distance={12}>
                  <MagneticButton>
                    <Pressable
                      onPress={onCreateAccount}
                      testID="final-cta-create-account-btn"
                      className="px-6 py-3.5 rounded-xl font-display font-bold text-sm bg-[#8B5CF6] hover:bg-[#7C3AED] text-white whitespace-nowrap shrink-0 inline-flex items-center gap-2 shadow-[0_8px_22px_-6px_rgba(139,92,246,0.55)]"
                    >
                      <span>Create Your Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </Pressable>
                  </MagneticButton>
                </DirectionalSlide>

                <DirectionalSlide direction="bottom" delay={0.22} distance={12}>
                  <MagneticButton>
                    <Pressable
                      onPress={onExploreGames}
                      testID="final-cta-explore-games-btn"
                      className="px-6 py-3.5 rounded-xl font-display font-semibold text-sm bg-[#181C26]/90 hover:bg-[#1F2432] backdrop-blur-md border border-[#22D3EE]/40 text-[#F8FAFC] whitespace-nowrap shrink-0"
                    >
                      Explore Games
                    </Pressable>
                  </MagneticButton>
                </DirectionalSlide>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* =====================================================================
          SECTION 14 — FOOTER (PRIMARY: QUIET CLOSING SCENE & RESTRAINED COLUMN SETTLE)
      ====================================================================== */}
      <View
        as="footer"
        id="section-14-footer"
        testID="section-14-footer"
        className={`py-10 md:py-12 ${isDark ? 'bg-canvas' : 'bg-surface'} ${t.classes.textPrimary}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border-subtle/70">
            {/* Brand & Mission Column */}
            <ScrollReveal variant="quiet-settle" delay={0.02} className="lg:col-span-4 space-y-4">
              <View className="flex items-center gap-3">
                <Image
                  source="/assets/brand/logo/riyadah-elite-mark.svg"
                  alt="Riyadah Elite Emblem"
                  className="w-9 h-9"
                />
                <Text as="span" className="font-display text-lg font-extrabold tracking-tight">
                  RIYADAH <span className="text-accent-violet">ELITE</span>
                </Text>
              </View>
              <Text as="p" className={`text-sm leading-relaxed max-w-sm ${t.classes.textSecondary}`}>
                The complete gaming ecosystem connecting players, verified QA playtesters,
                developers, and tournament organizers.
              </Text>

              {/* Local Social Media SVGs with Glassmorphic Hover Treatment */}
              <View className="flex items-center gap-3 pt-2">
                {[
                  { name: 'Discord', icon: '/assets/icons/social/discord.svg', href: '#section-11-community' },
                  { name: 'X (Twitter)', icon: '/assets/icons/social/x-twitter.svg', href: '#section-01-hero' },
                  { name: 'Twitch', icon: '/assets/icons/social/twitch.svg', href: '#section-09-tournaments' },
                  { name: 'YouTube', icon: '/assets/icons/social/youtube.svg', href: '#section-08-games' },
                  { name: 'GitHub', icon: '/assets/icons/social/github.svg', href: '#section-05-solution' },
                ].map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    aria-label={`Riyadah Elite on ${soc.name}`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-150 hover:-translate-y-0.5 hover:border-accent-violet ${surfaceStyles.glassPillControl} ${t.styles.glass.pillControl}`}
                  >
                    <Image
                      source={soc.icon}
                      alt={soc.name}
                      className={`w-4 h-4 ${isDark ? 'invert' : ''}`}
                    />
                  </a>
                ))}
              </View>
            </ScrollReveal>

            {/* Platform Navigation */}
            <ScrollReveal variant="quiet-settle" delay={0.08} className="lg:col-span-2 space-y-3">
              <Text as="h3" className="font-mono text-xs font-bold uppercase tracking-wider text-accent-violet">
                Platform
              </Text>
              <ul className={`space-y-2 text-sm ${t.classes.textSecondary}`}>
                <li>
                  <a href="#section-08-games" className="hover:underline">
                    Game Discovery
                  </a>
                </li>
                <li>
                  <a href="#section-09-tournaments" className="hover:underline">
                    Tournaments
                  </a>
                </li>
                <li>
                  <a href="#section-10-rankings" className="hover:underline">
                    Rankings & Standings
                  </a>
                </li>
                <li>
                  <Pressable
                    onPress={() => onOpenNexusRoute('bug-reports')}
                    className="hover:underline text-left"
                  >
                    Bug Reporting Hub
                  </Pressable>
                </li>
              </ul>
            </ScrollReveal>

            {/* Company Links */}
            <ScrollReveal variant="quiet-settle" delay={0.14} className="lg:col-span-2 space-y-3">
              <Text as="h3" className="font-mono text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                Ecosystem
              </Text>
              <ul className={`space-y-2 text-sm ${t.classes.textSecondary}`}>
                <li>
                  <a href="#section-02-about" className="hover:underline">
                    About Riyadah Elite
                  </a>
                </li>
                <li>
                  <a href="#section-03-platform-overview" className="hover:underline">
                    Four Core Pillars
                  </a>
                </li>
                <li>
                  <a href="#section-06-how-it-works" className="hover:underline">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#section-11-community" className="hover:underline">
                    Community Labs
                  </a>
                </li>
              </ul>
            </ScrollReveal>

            {/* Support Links */}
            <ScrollReveal variant="quiet-settle" delay={0.2} className="lg:col-span-2 space-y-3">
              <Text as="h3" className="font-mono text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                Support
              </Text>
              <ul className={`space-y-2 text-sm ${t.classes.textSecondary}`}>
                <li>
                  <a href="#section-12-faq" className="hover:underline">
                    FAQ & Policies
                  </a>
                </li>
                <li>
                  <Pressable
                    onPress={() =>
                      setInfoModal({
                        title: 'Riyadah Elite Support & Triage Desk',
                        body: 'For playtest build access issues, tournament bracket disputes, or studio onboarding inquiries, submit a ticket through your NEXUS Workspace or reach our regional operations desk at support@riyadahelite.gg.',
                      })
                    }
                    className="hover:underline text-left"
                  >
                    Contact Support
                  </Pressable>
                </li>
                <li>
                  <Pressable
                    onPress={() => onOpenNexusRoute('notifications')}
                    className="hover:underline text-left"
                  >
                    System Notifications
                  </Pressable>
                </li>
              </ul>
            </ScrollReveal>

            {/* Legal Links */}
            <ScrollReveal variant="quiet-settle" delay={0.26} className="lg:col-span-2 space-y-3">
              <Text as="h3" className="font-mono text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
                Legal
              </Text>
              <ul className={`space-y-2 text-sm ${t.classes.textSecondary}`}>
                <li>
                  <Pressable
                    onPress={() =>
                      setInfoModal({
                        title: 'Terms of Playtesting & Competition',
                        body: 'All participants agree to respect non-disclosure boundaries on Closed Beta builds, submit truthful bug reproduction data, and abide by NEXUS fair-play tournament codes.',
                      })
                    }
                    className="hover:underline text-left"
                  >
                    Terms of Service
                  </Pressable>
                </li>
                <li>
                  <Pressable
                    onPress={() =>
                      setInfoModal({
                        title: 'Privacy & Telemetry Policy',
                        body: 'Riyadah Elite collects only the hardware specifications and reproduction logs explicitly attached to your bug reports and tournament registrations.',
                      })
                    }
                    className="hover:underline text-left"
                  >
                    Privacy Policy
                  </Pressable>
                </li>
                <li>
                  <Pressable
                    onPress={() =>
                      setInfoModal({
                        title: 'Local Asset Library Verification',
                        body: 'All 25 static brand, layered arena, diagram, game, tournament, community, and social media SVG assets are stored locally inside /public/assets/ and documented in ASSET_MANIFEST.md.',
                      })
                    }
                    className="hover:underline text-left"
                  >
                    Asset Manifest
                  </Pressable>
                </li>
              </ul>
            </ScrollReveal>
          </View>

          <View className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Text as="p" className={`text-xs ${t.classes.textMuted}`}>
              © {new Date().getFullYear()} Riyadah Elite Gaming Ecosystem. All rights reserved.
            </Text>

            <Pressable
              onPress={handleBackToTop}
              testID="back-to-top-btn"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold inline-flex items-center gap-2 ${t.classes.secondaryBtn}`}
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </Pressable>
          </View>
        </View>
      </View>

      {infoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={infoModal.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <View className={`w-full max-w-md p-6 space-y-4 ${t.styles.clay.card}`}>
            <Text as="h3" className={`font-display text-lg font-bold ${t.classes.textPrimary}`}>
              {infoModal.title}
            </Text>
            <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
              {infoModal.body}
            </Text>
            <View className="flex justify-end">
              <Pressable
                onPress={() => setInfoModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.classes.primaryBtn}`}
              >
                Close
              </Pressable>
            </View>
          </View>
        </div>
      )}
    </>
  );
};
