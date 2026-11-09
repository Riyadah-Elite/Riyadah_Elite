import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Compass,
  Bug,
  Trophy,
  Award,
  Users,
  Code2,
  Building2,
  CheckCircle2,
  Layers,
  Bell,
  UserCheck,
  GitPullRequest,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { View, Text, Pressable, Image } from './primitives';
import { theme, ThemeMode } from '../theme/theme';
import {
  resolveHeroScrollStage,
  resolveFragmentationConvergenceState,
  RIYADAH_CHARACTER_CAST,
} from '../utils/ecosystemRules';
import {
  BauhausSectionBadge,
  useSequenceProgress,
  useStepProgressInView,
  BlurToSharp,
  ScaleDepth,
  DirectionalSlide,
  RadialExpansion,
  ShapeMorph,
  StructuralLineDraw,
  ImageZoomFrame,
  AnimatedMetricValue,
  MagneticButton,
} from './ScrollReveal';
import cinematicStyles from '../styles/CinematicStage.module.css';
import surfaceStyles from '../styles/SurfaceEffects.module.css';
import mediaStyles from '../styles/MediaPresentation.module.css';
import { NexusArenaCanvas } from './three/NexusArenaCanvas';

interface TopSectionsProps {
  mode: ThemeMode;
  onExploreGames: () => void;
  onJoinCommunity: () => void;
  onOpenNexusRoute: (route: string) => void;
}

export const LandingSectionsTop: React.FC<TopSectionsProps> = ({
  mode,
  onExploreGames,
  onJoinCommunity,
  onOpenNexusRoute,
}) => {
  const t = theme[mode];
  const isDark = mode === 'dark';
  const prefersReducedMotion = Boolean(useReducedMotion());

  // Sequence A1: Hero Sticky Scroll Stage (Optimized 140vh runway for stable 3-phase scrub, zero dead space)
  const {
    containerRef: heroStageRef,
    progress: heroScrollProgress,
    motionProfile,
  } = useSequenceProgress('sticky', 64);
  const [manualHeroStage, setManualHeroStage] = useState<number | null>(null);

  useEffect(() => {
    if (manualHeroStage === null || typeof window === 'undefined') return;
    const releaseManual = () => setManualHeroStage(null);
    window.addEventListener('wheel', releaseManual, { passive: true, once: true });
    window.addEventListener('touchmove', releaseManual, { passive: true, once: true });
    return () => {
      window.removeEventListener('wheel', releaseManual);
      window.removeEventListener('touchmove', releaseManual);
    };
  }, [manualHeroStage]);

  const effectiveHeroProgress =
    manualHeroStage !== null ? manualHeroStage : heroScrollProgress;
  const heroState = resolveHeroScrollStage(effectiveHeroProgress, motionProfile);

  // Sequence A2: About Ecosystem Map Traversal
  const { containerRef: aboutStageRef, progress: aboutProgress } =
    useSequenceProgress('traverse');

  // Sequence A3: Platform Overview 4-Pillar Circuit Traversal
  const { containerRef: overviewStageRef, progress: overviewProgress } =
    useSequenceProgress('traverse');

  // Sequence B: Continuous Problem-to-Solution Fragmentation & Convergence
  const { containerRef: fragConvRef, progress: fragConvProgress } =
    useSequenceProgress('traverse');
  const fragState = resolveFragmentationConvergenceState(
    fragConvProgress,
    motionProfile
  );

  // Section 06: Guided 4-Step Spatial Progression
  const {
    containerRef: stepsContainerRef,
    activeStep,
    lineProgress,
  } = useStepProgressInView(4);

  const isDesktopScene = motionProfile === 'desktop' || motionProfile === 'tablet';

  return (
    <>
      {/* =====================================================================
          SEQUENCE A (ACT I) — ENTER THE RIYADAH ELITE WORLD
          SECTION 01 — HERO: FULL-VIEWPORT SCROLL-CONTROLLED ARENA (PLAY. -> TEST. -> WIN.)
      ====================================================================== */}
      <View
        as="section"
        id="section-01-hero"
        testID="section-01-hero"
        className={`relative ${cinematicStyles.heroArenaAtmosphere} ${t.classes.canvas}`}
      >
        <div
          ref={heroStageRef}
          className={
            motionProfile === 'desktop'
              ? 'relative h-[140vh]'
              : 'relative py-8 md:py-12'
          }
        >
          <div
            className={
              motionProfile === 'desktop'
                ? 'sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden pt-4 pb-0'
                : 'relative overflow-hidden'
            }
          >
            {/* LAYER 1: Clean, Minimalist Ambient Hero Backdrop */}
            <div
              aria-hidden="true"
              data-testid="hero-environment-canvas"
              className="pointer-events-none absolute inset-0 overflow-hidden origin-center"
            >
              <div
                className={`absolute inset-0 ${cinematicStyles.architecturalGridBackdrop} ${
                  isDark ? 'opacity-35' : 'opacity-20'
                }`}
              />
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0B0D12]/90 via-[#0B0D12]/75 to-[#0B0D12]'
                    : 'bg-gradient-to-b from-[#F8FAFC]/95 via-[#FFFFFF]/90 to-[#F1F5F9]'
                }`}
              />
            </div>

            {/* LAYER 2: Foreground Content & Central Arena Stage */}
            <View
              className={`relative z-10 my-auto ${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX} w-full`}
            >
              <View className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* LEFT COLUMN (6 Cols): Scroll-Controlled Headline (PLAY. -> TEST. -> WIN.) & CTAs */}
                <View className="lg:col-span-6 space-y-6">
                  <BlurToSharp triggerOnMount delay={0.05}>
                    <View className="inline-flex items-center gap-3">
                      <span
                        className="w-3 h-3 bg-accent-violet inline-block shrink-0"
                        aria-hidden="true"
                      />
                      <Text
                        as="p"
                        className={`font-mono text-xs sm:text-sm font-semibold tracking-wider ${t.classes.cyanAccentText}`}
                      >
                        NEXT-GEN GAMING & PLAYTESTING ECOSYSTEM
                      </Text>
                    </View>
                  </BlurToSharp>

                  {/* Scroll-Controlled Headline: PLAY. transitions to TEST. then WIN. */}
                  <div className="space-y-3">
                    <h1
                      aria-label="PLAY. TEST. WIN."
                      className="font-display font-extrabold tracking-tight leading-[1.04] flex flex-wrap items-baseline gap-x-4 gap-y-1"
                      style={{ fontSize: theme.typography.fontSizes.hero }}
                    >
                      {[
                        {
                          word: 'PLAY.',
                          phaseIndex: 0,
                          activeClass: 'text-primary-fg',
                          inactiveClass: 'text-primary-fg/40',
                        },
                        {
                          word: 'TEST.',
                          phaseIndex: 1,
                          activeClass: 'text-accent-cyan',
                          inactiveClass: 'text-accent-cyan/40',
                        },
                        {
                          word: 'WIN.',
                          phaseIndex: 2,
                          activeClass: 'text-accent-blue',
                          inactiveClass: 'text-accent-blue/40',
                        },
                      ].map((item) => {
                        const isHighlighted =
                          motionProfile === 'reduced' ||
                          motionProfile === 'mobile' ||
                          heroState.activeWordIndex >= item.phaseIndex;
                        const isCurrentFocus =
                          heroState.activeWordIndex === item.phaseIndex;
                        return (
                          <span
                            key={item.word}
                            data-testid={`hero-word-${item.word.replace('.', '').toLowerCase()}`}
                            className={`inline-block transition-all duration-300 ${
                              isHighlighted ? item.activeClass : item.inactiveClass
                            } ${
                              isCurrentFocus && motionProfile === 'desktop'
                                ? 'scale-[1.03]'
                                : 'scale-100'
                            }`}
                          >
                            {item.word}
                            {item.word === 'WIN.' && (
                              <span
                                className={`block h-1.5 w-full mt-1 rounded-full transition-transform duration-300 origin-left ${
                                  surfaceStyles.bauhausSpectrumBar
                                } ${t.styles.bauhaus.geoAccentBar} ${
                                  isHighlighted ? 'scale-x-100' : 'scale-x-35'
                                }`}
                              />
                            )}
                          </span>
                        );
                      })}
                    </h1>

                    {/* Interactive / Scroll Stage Narrative Indicator */}
                    <div
                      role="group"
                      aria-label="Hero Scroll Stage Selector"
                      className="flex flex-wrap items-center gap-2 pt-1"
                    >
                      {[
                        {
                          id: 'PLAY',
                          label: '01 · Discover & Play',
                          targetProgress: 0.15,
                        },
                        {
                          id: 'TEST',
                          label: '02 · Test & Report Bugs',
                          targetProgress: 0.5,
                        },
                        {
                          id: 'WIN',
                          label: '03 · Compete & Win',
                          targetProgress: 0.85,
                        },
                      ].map((stage, idx) => {
                        const active = heroState.activeWordIndex === idx;
                        return (
                          <button
                            key={stage.id}
                            type="button"
                            onClick={() => {
                              setManualHeroStage(stage.targetProgress);
                              if (heroStageRef.current && typeof window !== 'undefined') {
                                const rect = heroStageRef.current.getBoundingClientRect();
                                const vh = window.innerHeight || 900;
                                const stickyOffset = 64;
                                const totalStickyScroll = Math.max(1, rect.height - (vh - stickyOffset));
                                const targetScrollY =
                                  window.scrollY + (rect.top - stickyOffset) + stage.targetProgress * totalStickyScroll;
                                window.scrollTo({ top: Math.max(0, targetScrollY), behavior: 'smooth' });
                              }
                            }}
                            data-testid={`hero-stage-btn-${stage.id.toLowerCase()}`}
                            className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                              active
                                ? 'bg-accent-violet text-white font-semibold shadow-sm'
                                : 'bg-card/85 text-muted-fg hover:text-primary-fg border border-border-subtle'
                            }`}
                          >
                            {stage.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Stage Narrative Description */}
                  <Text
                    as="p"
                    data-testid="hero-stage-description"
                    className={`text-base sm:text-lg leading-relaxed max-w-xl ${t.classes.textSecondary}`}
                  >
                    {heroState.activePhase === 'PLAY' &&
                      'Enter a unified gaming arena where players discover upcoming builds, join active studio playtests, and prepare for seasonal tournaments.'}
                    {heroState.activePhase === 'TEST' &&
                      'Step inside live studio testing cohorts: stress-test pre-release builds, submit reproducible bug reports, and help engineers ship cleaner games.'}
                    {heroState.activePhase === 'WIN' &&
                      'Turn every verified bug report and tournament victory into auditable reputation points across dual-track community leaderboards.'}
                  </Text>

                  {/* Primary & Secondary Functional CTAs */}
                  <View className="flex flex-wrap items-center gap-4 pt-1">
                    <MagneticButton>
                      <Pressable
                        onPress={onExploreGames}
                        testID="hero-explore-games-btn"
                        className={`px-6 py-3.5 rounded-xl font-display font-bold text-sm whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${t.classes.primaryBtn}`}
                      >
                        <span>Explore Games</span>
                        <ArrowRight className="w-4 h-4" />
                      </Pressable>
                    </MagneticButton>

                    <MagneticButton>
                      <Pressable
                        onPress={onJoinCommunity}
                        testID="hero-join-community-btn"
                        className={`px-6 py-3.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap shrink-0 ${t.classes.secondaryBtn}`}
                      >
                        Join the Community
                      </Pressable>
                    </MagneticButton>
                  </View>

                  {/* Unboxed Verified Ecosystem Telemetry Strip */}
                  <View
                    className={`pt-5 border-t ${t.classes.borderSubtle} grid grid-cols-3 gap-4 text-left`}
                  >
                    <View>
                      <Text
                        as="div"
                        className={`font-mono text-base sm:text-xl font-bold tabular-nums whitespace-nowrap ${t.classes.textPrimary}`}
                      >
                        <AnimatedMetricValue value={6} suffix=" Builds" />
                      </Text>
                      <Text as="p" className={`text-xs mt-0.5 ${t.classes.textMuted}`}>
                        Active QA Cohorts
                      </Text>
                    </View>
                    <View>
                      <Text
                        as="div"
                        className={`font-mono text-base sm:text-xl font-bold tabular-nums whitespace-nowrap ${t.classes.blueAccentText}`}
                      >
                        <AnimatedMetricValue value={4} suffix=" Arenas" />
                      </Text>
                      <Text as="p" className={`text-xs mt-0.5 ${t.classes.textMuted}`}>
                        Open & Live Brackets
                      </Text>
                    </View>
                    <View>
                      <Text
                        as="div"
                        className={`font-mono text-base sm:text-xl font-bold tabular-nums whitespace-nowrap ${t.classes.cyanAccentText}`}
                      >
                        Dual-Track
                      </Text>
                      <Text as="p" className={`text-xs mt-0.5 ${t.classes.textMuted}`}>
                        QA & Match Ranks
                      </Text>
                    </View>
                  </View>
                </View>

                {/* RIGHT COLUMN (6 Cols): Central Futuristic NEXUS Arena & Scroll-Activated Scene Layers */}
                <View className="lg:col-span-6">
                  <View
                    testID="hero-visual-stage"
                    className={`${cinematicStyles.heroVisualStageFrame} border border-accent-violet/45 min-h-[380px] sm:min-h-[450px] flex flex-col justify-between`}
                  >
                    {/* Top Bauhaus Spectrum Line */}
                    <div
                      className={`h-1.5 w-full ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar} relative z-20`}
                    />

                    {/* Layer A: Clean 3D Arena Stage without background man / character cutout */}
                    <div className="absolute inset-0 w-full h-full origin-center bg-[#0B0D12]">
                      <NexusArenaCanvas
                        activePhase={heroState.activePhase}
                        progress={effectiveHeroProgress}
                      />
                    </div>

                    {/* Top Scene Telemetry Header */}
                    <View className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 via-black/35 to-transparent">
                      <div className="font-mono text-xs text-[#CBD5E1] flex items-center gap-2">
                        <span className="text-[#22D3EE] font-bold">
                          STAGE 0{heroState.activeWordIndex + 1} / 03
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {heroState.activePhase === 'PLAY'
                            ? 'DISCOVER & PLAY'
                            : heroState.activePhase === 'TEST'
                            ? 'STRUCTURED QA PLAYTESTING'
                            : 'TOURNAMENTS & LEADERBOARDS'}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#3B82F6]">
                        NEXUS ARENA
                      </span>
                    </View>

                    {/* Compact Bottom Scene Telemetry Strip (Leaves upper 72% of stage clear for Arena & Characters) */}
                    <View className="relative z-10 p-3.5 sm:p-4 mt-auto bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/92 to-transparent grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Testing Wing Telemetry */}
                      <div
                        data-testid="hero-scene-testing-wing"
                        style={{
                          opacity: Math.max(0.55, heroState.testingOverlayOpacity),
                          transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className={`${surfaceStyles.glassFloatingHud} ${t.styles.glass.floatingCard} rounded-xl p-3 ${
                          heroState.activePhase === 'TEST' ? 'border-[#22D3EE]/60' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 text-[11px] font-mono">
                          <span className="text-[#A78BFA] font-semibold truncate">
                            PLAYTEST · Eclipse Protocol
                          </span>
                          <span className="text-[#22D3EE] shrink-0">+250 PTS</span>
                        </div>
                        <p className="text-[11px] text-[#CBD5E1] mt-1 line-clamp-2">
                          428 playtesters validating zero-G airlock physics (v0.9.4-RC2).
                        </p>
                      </div>

                      {/* Competitive & Reputation Core */}
                      <div
                        data-testid="hero-scene-winning-spire"
                        style={{
                          opacity: Math.max(0.55, heroState.winningOverlayOpacity),
                          transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        className={`${surfaceStyles.glassFloatingHud} ${t.styles.glass.floatingCard} rounded-xl p-3 ${
                          heroState.activePhase === 'WIN' ? 'border-[#8B5CF6]/65' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 text-[11px] font-mono">
                          <span className="text-[#22D3EE] font-semibold truncate">
                            #1 · Nadia_Vanguard
                          </span>
                          <span className="text-[#F8FAFC] shrink-0">4,850 PTS</span>
                        </div>
                        <p className="text-[11px] text-[#CBD5E1] mt-1 line-clamp-2">
                          99.2% QA accuracy · NEXUS Cup IV $25,000 Bracket (58/64 slots).
                        </p>
                      </div>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* LAYER 3: Clean Horizon Divider Bridging Hero -> About */}
            <div
              aria-hidden="true"
              data-testid="hero-to-about-mist-bridge"
              style={{ opacity: Math.max(0.4, heroState.mistOpacity) }}
              className={`${cinematicStyles.mistHorizonBridge} w-full pt-3 pb-2 transition-opacity duration-300 relative overflow-hidden`}
            >
              <div
                className={`relative z-10 ${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX} flex items-center justify-between text-[11px] font-mono ${t.classes.textMuted}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse inline-block" />
                  CONTINUOUS ECOSYSTEM HORIZON
                </span>
                <span>02 · ABOUT RIYADAH ELITE</span>
              </div>
            </div>
          </div>
        </div>
      </View>

      {/* =====================================================================
          SECTION 02 — ABOUT RIYADAH ELITE
          CONTINUATION OF HERO SCENE: CAMERA PULLS BACK INTO 3 CONNECTED ECOSYSTEM REGIONS
      ====================================================================== */}
      <View
        as="section"
        id="section-02-about"
        testID="section-02-about"
        className={`pt-2 pb-10 md:pb-14 relative overflow-hidden bg-gradient-to-b from-canvas via-surface to-card border-t border-border-subtle/50`}
      >
        <div
          ref={aboutStageRef}
          className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}
        >
          {/* Continuous Vertical Conduit descending from the Hero Arena */}
          <div className="flex flex-col items-center mb-4" aria-hidden="true">
            <div className={`w-px h-5 ${surfaceStyles.bauhausSpectrumBar}`} />
            <span className="px-3 py-0.5 rounded-full font-mono text-[11px] border border-accent-violet/40 text-accent-violet-soft bg-surface/90 shadow-xs mt-1">
              ECOSYSTEM PERSPECTIVE · THREE CONNECTED AUDIENCES
            </span>
          </div>

          <View className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <BauhausSectionBadge
              index="02"
              label="ECOSYSTEM IDENTITY"
              accent="violet"
              mode={mode}
            />
            <Text
              as="h2"
              className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
            >
              MORE THAN GAMING. A COMPLETE GAMING ECOSYSTEM.
            </Text>
            <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
              As the arena perspective widens, three distinct regions emerge around the central
              Riyadah Elite core—connecting players who test and compete, studios that refine builds,
              and organizations that run structured championships.
            </Text>
          </View>

          {/* Panoramic Tri-Region Ecosystem Visual Map + Live Scroll-Drawn Conduits */}
          <RadialExpansion delay={0.05} className="mb-10">
            <div
              data-testid="about-radial-hub"
              className={`relative rounded-2xl overflow-hidden ${surfaceStyles.bauhausCard} ${t.styles.bauhaus.architecturalCard} p-4 sm:p-6`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className={`${mediaStyles.pillarPreviewFrame} lg:col-span-7 rounded-xl`}>
                  <Image
                    source="/assets/images/diagrams/ecosystem-tri-region-map.png"
                    alt="Riyadah Elite Tri-Region Ecosystem Map connecting Gamers, Studios, and Esports Organizations"
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>

                {/* Live Scroll-Controlled Conduit Telemetry */}
                <div className="lg:col-span-5 space-y-4">
                  <svg
                    viewBox="0 0 360 150"
                    className="w-full h-36 overflow-visible"
                    role="img"
                    aria-label="Live Conduit Progression linking Gamers, Studios, and Organizers"
                  >
                    <circle
                      cx="180"
                      cy="75"
                      r="56"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeOpacity="0.35"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <motion.line
                      x1="180"
                      y1="75"
                      x2="52"
                      y2="36"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0.2 }}
                      animate={{
                        pathLength: prefersReducedMotion
                          ? 1
                          : Math.min(1, Math.max(0.3, aboutProgress * 1.35)),
                      }}
                    />
                    <motion.line
                      x1="180"
                      y1="75"
                      x2="180"
                      y2="138"
                      stroke="#22D3EE"
                      strokeWidth="2.5"
                      initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0.2 }}
                      animate={{
                        pathLength: prefersReducedMotion
                          ? 1
                          : Math.min(1, Math.max(0.3, aboutProgress * 1.35)),
                      }}
                    />
                    <motion.line
                      x1="180"
                      y1="75"
                      x2="308"
                      y2="36"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0.2 }}
                      animate={{
                        pathLength: prefersReducedMotion
                          ? 1
                          : Math.min(1, Math.max(0.3, aboutProgress * 1.35)),
                      }}
                    />
                    <circle cx="180" cy="75" r="24" fill="#8B5CF6" />
                    <text
                      x="180"
                      y="79"
                      textAnchor="middle"
                      className="fill-white font-mono text-[10px] font-bold"
                    >
                      NEXUS
                    </text>
                    <circle cx="48" cy="34" r="9" fill="#8B5CF6" />
                    <text
                      x="54"
                      y="60"
                      textAnchor="middle"
                      className="fill-accent-violet-soft font-mono text-[10px] font-semibold"
                    >
                      GAMERS & QA
                    </text>
                    <rect x="171" y="130" width="18" height="14" fill="#22D3EE" />
                    <polygon points="308,22 320,42 296,42" fill="#3B82F6" />
                    <text
                      x="304"
                      y="60"
                      textAnchor="middle"
                      className="fill-accent-blue font-mono text-[10px] font-semibold"
                    >
                      ESPORTS ORGS
                    </text>
                  </svg>

                  <p className={`text-xs font-mono leading-relaxed ${t.classes.textSecondary}`}>
                    All three regions share one verified identity graph: playtest contributions
                    directly inform studio patches and qualify players for premier competitive events.
                  </p>
                </div>
              </div>
            </div>
          </RadialExpansion>

          {/* Three Connected Audience Regions with Original Riyadah Elite Character Cutouts */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Region 01: Gamers & Playtesters (Tariq & Nadia) */}
            <DirectionalSlide direction="left" delay={0.06} className="h-full">
              <View
                className={`h-full rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:border-[#8B5CF6] ${t.styles.bauhaus.architecturalCard}`}
              >
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.styles.glass.iconBadge}`}
                    >
                      <Users className="w-5 h-5" />
                    </View>
                    <Text as="span" className={`font-mono text-xs font-bold ${t.classes.violetAccentText}`}>
                      REGION 01 · PLAYERS
                    </Text>
                  </View>
                  <Text as="h3" className={`font-display text-xl font-bold ${t.classes.textPrimary}`}>
                    For Gamers & Playtesters
                  </Text>
                  <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                    Gain early access to unreleased builds, follow structured playtesting missions,
                    submit verified bug reports, and compete in organized brackets to build an
                    auditable gaming and QA reputation profile.
                  </Text>

                  {/* Character Representatives for Region 01 */}
                  <div className="flex items-center gap-3 pt-2">
                    {[RIYADAH_CHARACTER_CAST[0], RIYADAH_CHARACTER_CAST[1]].map((char) => (
                      <div
                        key={char.id}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-surface/90 border border-border-subtle"
                      >
                        <div className={`w-9 h-9 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                          <Image
                            source={char.cutoutUrl}
                            alt={char.name}
                            className="w-full h-full object-contain object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-mono text-[11px] font-bold truncate ${t.classes.textPrimary}`}>
                            {char.handle}
                          </p>
                          <p className={`text-[10px] truncate ${t.classes.textMuted}`}>
                            {char.archetype}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </View>
                <View className={`mt-6 pt-4 border-t ${t.classes.borderSubtle}`}>
                  <Text as="p" className={`font-mono text-xs ${t.classes.cyanAccentText}`}>
                    Early Build Access · Verified Bug Bounties · Bracket Play
                  </Text>
                </View>
              </View>
            </DirectionalSlide>

            {/* Region 02: Game Developers & Studios (Zayd & Salma) */}
            <ScaleDepth delay={0.12} className="h-full">
              <View
                className={`h-full rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:border-[#22D3EE] ${t.styles.bauhaus.architecturalCard}`}
              >
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View className="w-10 h-10 rounded-xl bg-[#22D3EE]/15 border border-[#22D3EE]/35 flex items-center justify-center text-[#0891B2] dark:text-[#22D3EE]">
                      <Code2 className="w-5 h-5" />
                    </View>
                    <Text as="span" className={`font-mono text-xs font-bold ${t.classes.cyanAccentText}`}>
                      REGION 02 · STUDIOS
                    </Text>
                  </View>
                  <Text as="h3" className={`font-display text-xl font-bold ${t.classes.textPrimary}`}>
                    For Game Developers & Studios
                  </Text>
                  <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                    Recruit targeted playtesting cohorts, define build-specific test objectives, and
                    receive clean, reproducible bug reports with severity classification, system
                    specs, and step-by-step reproduction logs.
                  </Text>

                  {/* Character Representatives for Region 02 */}
                  <div className="flex items-center gap-3 pt-2">
                    {[RIYADAH_CHARACTER_CAST[2], RIYADAH_CHARACTER_CAST[3]].map((char) => (
                      <div
                        key={char.id}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-surface/90 border border-border-subtle"
                      >
                        <div className={`w-9 h-9 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                          <Image
                            source={char.cutoutUrl}
                            alt={char.name}
                            className="w-full h-full object-contain object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-mono text-[11px] font-bold truncate ${t.classes.textPrimary}`}>
                            {char.handle}
                          </p>
                          <p className={`text-[10px] truncate ${t.classes.textMuted}`}>
                            {char.archetype}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </View>
                <View className={`mt-6 pt-4 border-t ${t.classes.borderSubtle}`}>
                  <Text as="p" className={`font-mono text-xs ${t.classes.violetAccentText}`}>
                    Structured QA Cohorts · Reproducible Triage · Build Telemetry
                  </Text>
                </View>
              </View>
            </ScaleDepth>

            {/* Region 03: Esports Organizations (Faisal & Elena) */}
            <DirectionalSlide direction="right" delay={0.18} className="h-full">
              <View
                className={`h-full rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-colors hover:border-[#3B82F6] ${t.styles.bauhaus.architecturalCard}`}
              >
                <View className="space-y-4">
                  <View className="flex items-center justify-between">
                    <View className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/40 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
                      <Building2 className="w-5 h-5" />
                    </View>
                    <Text as="span" className={`font-mono text-xs font-bold ${t.classes.blueAccentText}`}>
                      REGION 03 · ORGANIZERS
                    </Text>
                  </View>
                  <Text as="h3" className={`font-display text-xl font-bold ${t.classes.textPrimary}`}>
                    For Esports Organizations
                  </Text>
                  <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                    Host community and championship tournaments with automated registration slots,
                    live bracket progression, transparent standings, and direct discovery of
                    high-rank competitive talent and verified playtesters.
                  </Text>

                  {/* Character Representatives for Region 03 */}
                  <div className="flex items-center gap-3 pt-2">
                    {[RIYADAH_CHARACTER_CAST[4], RIYADAH_CHARACTER_CAST[5]].map((char) => (
                      <div
                        key={char.id}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-surface/90 border border-border-subtle"
                      >
                        <div className={`w-9 h-9 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                          <Image
                            source={char.cutoutUrl}
                            alt={char.name}
                            className="w-full h-full object-contain object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-mono text-[11px] font-bold truncate ${t.classes.textPrimary}`}>
                            {char.handle}
                          </p>
                          <p className={`text-[10px] truncate ${t.classes.textMuted}`}>
                            {char.archetype}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </View>
                <View className={`mt-6 pt-4 border-t ${t.classes.borderSubtle}`}>
                  <Text as="p" className={`font-mono text-xs ${t.classes.blueAccentText}`}>
                    Managed Brackets · Roster Scouting · Community Events
                  </Text>
                </View>
              </View>
            </DirectionalSlide>
          </View>
        </div>
      </View>

      {/* =====================================================================
          SECTION 03 — PLATFORM OVERVIEW
          CONNECTED ARCHITECTURAL CIRCUIT OF THE 4 PLATFORM PILLARS
      ====================================================================== */}
      <View
        as="section"
        id="section-03-platform-overview"
        testID="section-03-platform-overview"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.surface}`}
      >
        <div
          ref={overviewStageRef}
          className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}
        >
          <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <View className="max-w-3xl space-y-4">
              <BauhausSectionBadge
                index="03"
                label="FOUR CONNECTED PILLARS"
                accent="cyan"
                mode={mode}
              />
              <Text
                as="h2"
                className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
              >
                EVERYTHING YOU NEED IN ONE PLACE.
              </Text>
              <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                Instead of isolated tools, Riyadah Elite links game discovery, structured QA testing,
                reproducible bug reporting, and tournament brackets along one continuous platform
                circuit.
              </Text>
            </View>

            <div className={`font-mono text-xs ${t.classes.cyanAccentText}`}>
              CIRCUIT FLOW · 01 DISCOVERY → 02 TESTING → 03 REPORTING → 04 TOURNAMENTS
            </div>
          </View>

          {/* Continuous SVG Bus Conduit Linking All 4 Pillars */}
          <div className="hidden lg:block mb-6" data-testid="platform-overview-circuit">
            <svg viewBox="0 0 1200 36" className="w-full h-9 overflow-visible" aria-hidden="true">
              <line
                x1="40"
                y1="18"
                x2="1160"
                y2="18"
                stroke={isDark ? '#252B3B' : '#CBD5E1'}
                strokeWidth="3"
              />
              <motion.line
                x1="40"
                y1="18"
                x2="1160"
                y2="18"
                stroke="#22D3EE"
                strokeWidth="3"
                initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0.2 }}
                animate={{
                  pathLength: prefersReducedMotion
                    ? 1
                    : Math.min(1, Math.max(0.25, overviewProgress * 1.25)),
                }}
              />
              {[
                { cx: 150, color: '#8B5CF6' },
                { cx: 450, color: '#22D3EE' },
                { cx: 750, color: '#F59E0B' },
                { cx: 1050, color: '#3B82F6' },
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.cx} cy={18} r="8" fill={node.color} />
                </g>
              ))}
            </svg>
          </div>

          {/* 4 Connected Architectural Pillars */}
          <View className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pillar 01: Game Discovery */}
            <View
              className={`lg:col-span-7 rounded-xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-3">
                <View className="flex items-center justify-between">
                  <Text as="span" className={`font-mono text-xs font-bold ${t.classes.violetAccentText}`}>
                    01 · GAME DISCOVERY
                  </Text>
                  <Compass className="w-5 h-5 text-accent-violet" />
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Game Discovery
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Browse curated regional and global titles across Tactical Shooters, Cyber Racing,
                  Action RPGs, and Strategy Arenas. Filter immediately by active playtest windows,
                  supported platforms, and current build versions.
                </Text>
              </View>
              <ImageZoomFrame className={`mt-6 ${mediaStyles.pillarPreviewFrame} h-44`}>
                <Image
                  source="/assets/generated/games/eclipse-protocol.png"
                  alt="Game Discovery Catalog Showcase — Eclipse Protocol"
                  className="w-full h-full object-cover"
                />
              </ImageZoomFrame>
            </View>

            {/* Pillar 02: Game Testing */}
            <View
              className={`lg:col-span-5 rounded-xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-3">
                <View className="flex items-center justify-between">
                  <Text as="span" className={`font-mono text-xs font-bold ${t.classes.cyanAccentText}`}>
                    02 · GAME TESTING
                  </Text>
                  <Layers className={`w-5 h-5 ${t.classes.cyanAccentText}`} />
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Structured Playtesting
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Join developer-defined testing cohorts with explicit build objectives, versioned
                  release candidates, and direct studio telemetry channels.
                </Text>
              </View>
              <ImageZoomFrame className={`mt-5 ${mediaStyles.pillarPreviewFrame} h-28`}>
                <Image
                  source="/assets/generated/community/playtest-lab-session.png"
                  alt="Structured Playtesting Lab Session"
                  className="w-full h-full object-cover"
                />
              </ImageZoomFrame>
              <View className={`mt-4 pt-4 border-t ${t.classes.borderSubtle} space-y-2 font-mono text-xs`}>
                <View className="flex items-center justify-between">
                  <Text className={t.classes.textSecondary}>Active Playtest Cohorts</Text>
                  <Text className={`font-bold ${t.classes.cyanAccentText}`}>6 Verified Builds</Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className={t.classes.textSecondary}>Supported Environments</Text>
                  <Text className={t.classes.textPrimary}>PC · PS5 · Xbox Series X</Text>
                </View>
              </View>
            </View>

            {/* Pillar 03: Bug Reporting */}
            <View
              className={`lg:col-span-5 rounded-xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-3">
                <View className="flex items-center justify-between">
                  <Text as="span" className="font-mono text-xs font-bold text-status-warning">
                    03 · BUG REPORTING
                  </Text>
                  <Bug className="w-5 h-5 text-status-warning" />
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Structured Bug Reporting
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Submit standardized reproduction steps, expected vs. actual outcomes, and severity
                  classifications that engineers can verify immediately.
                </Text>
              </View>
              <ImageZoomFrame className={`mt-5 ${mediaStyles.pillarPreviewFrame} h-28`}>
                <Image
                  source="/assets/generated/community/developer-triage-hub.png"
                  alt="Developer Bug Triage Hub"
                  className="w-full h-full object-cover"
                />
              </ImageZoomFrame>
              <View className={`mt-4 pt-4 border-t ${t.classes.borderSubtle} space-y-2 font-mono text-xs`}>
                <View className="flex items-center justify-between">
                  <Text className={t.classes.textSecondary}>Critical Crash / Desync</Text>
                  <Text className={`font-bold ${t.classes.cyanAccentText}`}>+250 PTS</Text>
                </View>
                <View className="flex items-center justify-between">
                  <Text className={t.classes.textSecondary}>High Frame-Time Regression</Text>
                  <Text className={`font-bold ${t.classes.blueAccentText}`}>+150 PTS</Text>
                </View>
              </View>
            </View>

            {/* Pillar 04: Tournaments & Community */}
            <View
              className={`lg:col-span-7 rounded-xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-3">
                <View className="flex items-center justify-between">
                  <Text as="span" className={`font-mono text-xs font-bold ${t.classes.blueAccentText}`}>
                    04 · TOURNAMENTS & COMMUNITY
                  </Text>
                  <Trophy className={`w-5 h-5 ${t.classes.blueAccentText}`} />
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Tournaments & Dual-Track Progression
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Compete in Single Elimination, Double Elimination, and Swiss brackets while earning
                  dedicated standing on both the Verified Tester Leaderboard and Tournament Standings.
                </Text>
              </View>
              <ImageZoomFrame className={`mt-6 ${mediaStyles.pillarPreviewFrame} h-44`}>
                <Image
                  source="/assets/generated/tournaments/nexus-championship-cup.png"
                  alt="Competitive Tournament Bracket Showcase — NEXUS Championship Cup"
                  className="w-full h-full object-cover"
                />
              </ImageZoomFrame>
            </View>
          </View>
        </div>
      </View>

      {/* =====================================================================
          SEQUENCE B (ACT II) — FROM FRAGMENTATION TO ONE ECOSYSTEM
          SHARED SCROLL CONTAINER FOR SECTION 04 (PROBLEM) -> SECTION 05 (SOLUTION)
      ====================================================================== */}
      <div ref={fragConvRef} className="relative">
        {/* SECTION 04 — THE PROBLEM (SCROLL-CONTROLLED FRAGMENTATION SEQUENCE) */}
        <View
          as="section"
          id="section-04-problem"
          testID="section-04-problem"
          className={`pt-8 md:pt-12 pb-4 ${t.styles.bauhaus.sectionFrame} ${t.classes.canvas}`}
        >
          <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
            <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <View className="max-w-3xl space-y-4">
                <BauhausSectionBadge
                  index="04"
                  label="INDUSTRY FRICTION"
                  accent="crimson"
                  mode={mode}
                />
                <Text
                  as="h2"
                  className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
                >
                  THE GAMING ECOSYSTEM HAS A PROBLEM.
                </Text>
                <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                  Without a unified ecosystem, game testing, bug reporting, studio communication, and
                  competitive play drift into disconnected silos where critical feedback and player
                  progression are lost.
                </Text>
              </View>

              <div
                aria-hidden="true"
                className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl border border-dashed border-[#EF4444]/40 font-mono text-xs text-[#EF4444]"
              >
                <span>SCROLL STAGE · FRAGMENTATION DRIFT</span>
              </div>
            </View>

            {/* 5 Disconnected Workflow Fragments (Drift apart on scroll as driftMultiplier increases) */}
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  index: '01',
                  dx: -16,
                  dy: -8,
                  rot: -1.4,
                  title: 'Disconnected Testing Workflows',
                  description:
                    'Dedicated players struggle to discover legitimate pre-release playtests or understand which specific build mechanics a studio needs validated.',
                },
                {
                  index: '02',
                  dx: 0,
                  dy: -12,
                  rot: 1.1,
                  title: 'Scattered Bug Reports',
                  description:
                    'Players lack standardized templates for reproduction steps, build versions, and expected vs. actual behavior, leaving engineers with incomplete reports.',
                },
                {
                  index: '03',
                  dx: 16,
                  dy: -8,
                  rot: 1.5,
                  title: 'Fragmented Communication',
                  description:
                    'Studios spend valuable engineering hours manually distributing keys, chasing follow-up logs, and verifying whether reported bugs persist in newer patches.',
                },
                {
                  index: '04',
                  dx: -14,
                  dy: 10,
                  rot: -1.2,
                  title: 'Disconnected Competitive Opportunities',
                  description:
                    'Tournament brackets, game pages, and tester contributions live on separate platforms, preventing players from carrying their reputation across the ecosystem.',
                },
                {
                  index: '05',
                  dx: 14,
                  dy: 10,
                  rot: 1.2,
                  title: 'Unstructured Feedback',
                  description:
                    'Valuable playtester impressions get buried across noisy chat streams, forum threads, and social posts where studio engineers cannot track or credit them.',
                },
              ].map((item) => {
                const driftScale =
                  motionProfile === 'desktop'
                    ? fragState.driftMultiplier
                    : motionProfile === 'tablet'
                    ? fragState.driftMultiplier * 0.45
                    : 0;
                const offsetX = Number((item.dx * driftScale).toFixed(1));
                const offsetY = Number((item.dy * driftScale).toFixed(1));
                const rotateDeg = Number((item.rot * driftScale).toFixed(2));

                return (
                  <div
                    key={item.index}
                    style={{
                      transform: `translate3d(${offsetX}px, ${offsetY}px, 0) rotate(${rotateDeg}deg)`,
                      transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <View
                      className={`h-full rounded-xl border border-dashed border-[#EF4444]/40 p-6 space-y-3 ${t.classes.card}`}
                    >
                      <View className="flex items-center justify-between">
                        <Text as="span" className="font-mono text-xs font-bold text-[#EF4444]">
                          DISCONNECTED WORKFLOW {item.index}
                        </Text>
                        <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                      </View>
                      <Text
                        as="h3"
                        className={`font-display text-lg font-bold ${t.classes.textPrimary}`}
                      >
                        {item.title}
                      </Text>
                      <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                        {item.description}
                      </Text>
                    </View>
                  </div>
                );
              })}
            </View>

            {/* CONTINUOUS VISUAL BRIDGE: 5 Broken Paths Converging Into One Central Riyadah Elite Core */}
            <div
              data-testid="problem-to-solution-bridge"
              className="mt-12 pt-4 flex flex-col items-center"
            >
              <div className="font-mono text-xs uppercase tracking-wider text-[#A78BFA] mb-2 text-center">
                5 Disconnected Workflows Converging Into One Unified Ecosystem
              </div>
              <svg
                viewBox="0 0 800 140"
                className="w-full max-w-4xl h-32 overflow-visible"
                aria-hidden="true"
              >
                {/* Background Broken Guide Paths */}
                {[
                  'M 60 12 C 60 78, 400 56, 400 132',
                  'M 230 12 C 230 72, 400 62, 400 132',
                  'M 400 12 L 400 132',
                  'M 570 12 C 570 72, 400 62, 400 132',
                  'M 740 12 C 740 78, 400 56, 400 132',
                ].map((d, idx) => (
                  <path
                    key={`bg-${idx}`}
                    d={d}
                    fill="none"
                    stroke={isDark ? '#252B3B' : '#CBD5E1'}
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                ))}

                {/* Scroll-Controlled Convergence Paths */}
                {[
                  { d: 'M 60 12 C 60 78, 400 56, 400 132', color: '#EF4444' },
                  { d: 'M 230 12 C 230 72, 400 62, 400 132', color: '#F59E0B' },
                  { d: 'M 400 12 L 400 132', color: '#8B5CF6' },
                  { d: 'M 570 12 C 570 72, 400 62, 400 132', color: '#3B82F6' },
                  { d: 'M 740 12 C 740 78, 400 56, 400 132', color: '#22D3EE' },
                ].map((p, i) => (
                  <g key={i}>
                    <motion.path
                      d={p.d}
                      fill="none"
                      stroke={p.color}
                      strokeWidth="2.8"
                      initial={
                        prefersReducedMotion
                          ? { pathLength: 1 }
                          : { pathLength: 0.2 }
                      }
                      animate={{
                        pathLength: prefersReducedMotion
                          ? 1
                          : fragState.convergencePathLength,
                      }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    />
                    <circle cx={60 + i * 170} cy={12} r="6" fill={p.color} />
                  </g>
                ))}

                {/* Central Convergence Node on the Section 04 / 05 Border */}
                <circle
                  cx="400"
                  cy="128"
                  r="14"
                  fill={isDark ? '#181C26' : '#FFFFFF'}
                  stroke="#22D3EE"
                  strokeWidth="3"
                />
                <circle cx="400" cy="128" r="6" fill="#8B5CF6" />
              </svg>
            </div>
          </View>
        </View>

        {/* SECTION 05 — THE SOLUTION (CONTINUOUS CONVERGENCE INTO UNIFIED ECOSYSTEM) */}
        <View
          as="section"
          id="section-05-solution"
          testID="section-05-solution"
          className={`pt-4 pb-8 md:pb-12 ${t.styles.bauhaus.sectionFrame} bg-gradient-to-b from-surface via-card to-surface`}
        >
          <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
            {/* Unified Convergence Core Header (Receives the 5 Paths Directly) */}
            <div
              data-testid="solution-convergence-nexus"
              style={{
                transform:
                  motionProfile === 'desktop'
                    ? `scale(${(0.96 + 0.04 * fragState.unifiedLockProgress).toFixed(3)})`
                    : undefined,
                transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`mb-12 rounded-xl border border-accent-violet/55 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 bg-accent-violet inline-block" aria-hidden="true" />
                <span className="w-3.5 h-3.5 rounded-full bg-accent-blue inline-block" aria-hidden="true" />
                <span className="w-3.5 h-3.5 bg-accent-cyan inline-block" aria-hidden="true" />
                <Text as="span" className={`font-mono text-xs font-bold ${t.classes.textPrimary}`}>
                  ECOSYSTEM CONVERGENCE LOCKED · 5 Workflows Unified Into 1 Platform
                </Text>
              </View>
              <StructuralLineDraw
                orientation="horizontal"
                delay={0.1}
                className={`h-2 flex-1 max-w-xs rounded-full ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar}`}
              />
            </div>

            <View className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Central Solution Hub */}
              <BlurToSharp delay={0.08} className="lg:col-span-5 space-y-5">
                <BauhausSectionBadge
                  index="05"
                  label="UNIFIED ARCHITECTURE"
                  accent="cyan"
                  mode={mode}
                />
                <Text
                  as="h2"
                  className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
                >
                  ONE PLATFORM. MULTIPLE POSSIBILITIES.
                </Text>
                <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                  Riyadah Elite converges playtesting, bug reporting, developer triage, and
                  tournament competition into one structured environment where every contribution is
                  tracked and rewarded.
                </Text>
                <ImageZoomFrame className={`${mediaStyles.pillarPreviewFrame} rounded-xl border-accent-violet/45`}>
                  <Image
                    source="/assets/generated/community/developer-triage-hub.png"
                    alt="Riyadah Elite Centralized Bug Triage and Solution Workflow"
                    className="w-full h-56 object-cover"
                  />
                </ImageZoomFrame>

                {/* Studio Architect + QA Specialist Collaboration Strip */}
                <div className="p-3.5 rounded-xl bg-surface/90 border border-border-subtle flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                      <Image
                        source={RIYADAH_CHARACTER_CAST[2].cutoutUrl}
                        alt={RIYADAH_CHARACTER_CAST[2].name}
                        className="w-full h-full object-contain object-top"
                      />
                    </div>
                    <div className={`w-11 h-11 shrink-0 -ml-3 ${mediaStyles.characterCutoutBadge}`}>
                      <Image
                        source={RIYADAH_CHARACTER_CAST[3].cutoutUrl}
                        alt={RIYADAH_CHARACTER_CAST[3].name}
                        className="w-full h-full object-contain object-top"
                      />
                    </div>
                    <div>
                      <p className={`font-mono text-xs font-bold ${t.classes.textPrimary}`}>
                        Zayd_Mirage ↔ Salma_Hex
                      </p>
                      <p className={`text-xs ${t.classes.textSecondary}`}>
                        Direct Studio-to-Verifier Triage Pipeline
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono text-[11px] font-semibold ${t.classes.cyanAccentText}`}>
                    LIVE SYNC
                  </span>
                </div>
              </BlurToSharp>

              {/* 5 Aligned Solution Pillars */}
              <View className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    index: '01',
                    title: 'Structured Game Testing',
                    desc: 'Studios publish versioned builds with clear test checklists so playtesters focus on high-priority mechanics.',
                  },
                  {
                    index: '02',
                    title: 'Centralized Bug Reporting',
                    desc: 'Standardized severity levels, reproduction steps, and expected vs. actual fields streamline engineering triage.',
                  },
                  {
                    index: '03',
                    title: 'Developer Collaboration',
                    desc: 'Direct status transitions from In Triage to Verified and Resolved keep testers informed when their reports ship in a patch.',
                  },
                  {
                    index: '04',
                    title: 'Tournament Discovery',
                    desc: 'Players move seamlessly from testing a title to competing in official launch cups and regional brackets.',
                  },
                  {
                    index: '05',
                    title: 'Tester Progression',
                    desc: 'Verified bug reports award reputation points and unlock higher-tier playtest cohorts and recognition badges.',
                  },
                ].map((sol, idx) => (
                  <ShapeMorph key={sol.index} delay={0.08 + idx * 0.06}>
                    <View
                      className={`h-full rounded-xl p-5 space-y-2.5 border border-[#22D3EE]/35 ${t.styles.bauhaus.architecturalCard}`}
                    >
                      <View className="flex items-center justify-between">
                        <Text as="span" className={`font-mono text-xs font-bold ${t.classes.cyanAccentText}`}>
                          SOLUTION {sol.index}
                        </Text>
                        <CheckCircle2 className={`w-4 h-4 ${t.classes.cyanAccentText}`} />
                      </View>
                      <Text as="h3" className={`font-display text-base font-bold ${t.classes.textPrimary}`}>
                        {sol.title}
                      </Text>
                      <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                        {sol.desc}
                      </Text>
                    </View>
                  </ShapeMorph>
                ))}
              </View>
            </View>
          </View>
        </View>
      </div>

      {/* =====================================================================
          SECTION 06 — HOW IT WORKS (GUIDED 4-STATION SPATIAL PROGRESSION)
      ====================================================================== */}
      <View
        as="section"
        id="section-06-how-it-works"
        testID="section-06-how-it-works"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.canvas}`}
      >
        <div
          ref={stepsContainerRef}
          className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}
        >
          <DirectionalSlide direction="left">
            <View className="max-w-3xl space-y-4 mb-10">
              <BauhausSectionBadge
                index="06"
                label="GUIDED USER JOURNEY"
                accent="violet"
                mode={mode}
              />
              <Text
                as="h2"
                className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
              >
                GET STARTED IN FOUR SIMPLE STEPS.
              </Text>
              <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                Follow the guided progression path from creating your identity to testing pre-release
                builds and climbing the verified rankings.
              </Text>
            </View>
          </DirectionalSlide>

          {/* Desktop Progressive SVG Draw-On Horizontal Timeline */}
          <div className="hidden lg:block mb-8" data-testid="how-it-works-desktop-timeline">
            <svg viewBox="0 0 1000 32" className="w-full h-8 overflow-visible" aria-hidden="true">
              <line
                x1="20"
                y1="16"
                x2="980"
                y2="16"
                stroke={isDark ? '#252B3B' : '#CBD5E1'}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.line
                x1="20"
                y1="16"
                x2="980"
                y2="16"
                stroke="#8B5CF6"
                strokeWidth="4"
                strokeLinecap="round"
                initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0.25 }}
                animate={{ pathLength: prefersReducedMotion ? 1 : lineProgress }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
              {[20, 340, 660, 980].map((cx, idx) => {
                const reached = idx + 1 <= activeStep;
                return (
                  <g key={cx}>
                    <circle
                      cx={cx}
                      cy={16}
                      r={reached ? 9 : 6}
                      fill={reached ? '#22D3EE' : isDark ? '#181C26' : '#E2E8F0'}
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </svg>
            <div className="grid grid-cols-4 gap-6 mt-2 font-mono text-xs">
              {[
                'STEP 01 · ACCOUNT',
                'STEP 02 · DISCOVER',
                'STEP 03 · PARTICIPATE',
                'STEP 04 · REPUTATION',
              ].map((label, idx) => (
                <span
                  key={label}
                  className={
                    idx + 1 <= activeStep ? t.classes.cyanAccentText : t.classes.textMuted
                  }
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Workflow Stations (with Mobile Vertical Spine on <lg) */}
          <View className="relative pl-6 lg:pl-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-1.5 top-2 bottom-2 w-1 rounded-full bg-border-subtle/50 overflow-hidden"
            >
              <div
                style={{ height: `${(activeStep / 4) * 100}%` }}
                className={`w-full transition-all duration-300 ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar}`}
              />
            </div>

            {[
              {
                step: '01',
                title: 'Create Your Account',
                desc: 'Register your free Riyadah Elite identity and configure your preferred gaming platforms and testing specialties.',
                actionLabel: 'Open Registration',
                onClick: onJoinCommunity,
                character: RIYADAH_CHARACTER_CAST[0],
              },
              {
                step: '02',
                title: 'Discover Games & Opportunities',
                desc: 'Explore upcoming titles in Open Playtest, Closed Beta, or active Bug Bounty windows alongside live tournaments.',
                actionLabel: 'Browse Catalog',
                onClick: onExploreGames,
                character: RIYADAH_CHARACTER_CAST[2],
              },
              {
                step: '03',
                title: 'Participate & Report Bugs',
                desc: 'Run structured test missions, submit reproducible bug reports, or compete in scheduled tournament brackets.',
                actionLabel: 'Open Bug Reporter',
                onClick: () => onOpenNexusRoute('bug-reports'),
                character: RIYADAH_CHARACTER_CAST[1],
              },
              {
                step: '04',
                title: 'Build Experience & Reputation',
                desc: 'Earn verified tester reputation points and competitive standings on the dual-track Riyadah Elite leaderboards.',
                actionLabel: 'Inspect Rankings',
                onClick: () => {
                  document
                    .getElementById('section-10-rankings')
                    ?.scrollIntoView({ behavior: 'smooth' });
                },
                character: RIYADAH_CHARACTER_CAST[4],
              },
            ].map((item, idx) => {
              const isStepReached = idx + 1 <= activeStep;
              return (
                <View
                  key={item.step}
                  className={`h-full rounded-xl p-6 flex flex-col justify-between transition-all duration-300 ${
                    t.styles.bauhaus.architecturalCard
                  } ${isStepReached ? 'border-accent-violet' : ''}`}
                >
                  <View className="space-y-4">
                    <View className="flex items-center justify-between">
                      <Text
                        as="div"
                        className={`font-mono text-2xl font-extrabold tabular-nums ${
                          isStepReached
                            ? t.classes.cyanAccentText
                            : t.classes.textMuted
                        }`}
                      >
                        {item.step}.
                      </Text>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${mediaStyles.characterCutoutBadge}`}>
                          <Image
                            source={item.character.cutoutUrl}
                            alt={item.character.name}
                            className="w-full h-full object-contain object-top"
                          />
                        </div>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            isStepReached ? 'bg-accent-cyan' : 'bg-border-subtle'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </View>
                    <Text as="h3" className={`font-display text-lg font-bold ${t.classes.textPrimary}`}>
                      {item.title}
                    </Text>
                    <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                      {item.desc}
                    </Text>
                  </View>
                  <View className={`mt-6 pt-4 border-t ${t.classes.borderSubtle}`}>
                    <Pressable
                      onPress={item.onClick}
                      className={`text-xs font-mono font-semibold inline-flex items-center gap-1.5 ${t.classes.violetAccentText} hover:underline`}
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </div>
      </View>

      {/* =====================================================================
          SECTION 07 — CORE FEATURES (ORGANISED TWO-TIER ECOSYSTEM ARCHITECTURE)
      ====================================================================== */}
      <View
        as="section"
        id="section-07-features"
        testID="section-07-features"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.surface}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <View className="max-w-3xl space-y-4 mb-12">
            <BauhausSectionBadge
              index="07"
              label="ORGANISED ECOSYSTEM CAPABILITIES"
              accent="blue"
              mode={mode}
            />
            <Text
              as="h2"
              className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
            >
              BUILT FOR GAMERS. POWERED BY COMMUNITY.
            </Text>
            <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
              Eight integrated capabilities operate as one organised architecture—combining deep
              playtesting workflows with competitive tournament infrastructure.
            </Text>
          </View>

          {/* TIER 1: Two Large Architectural Anchor Showcases (Static Readable Copy + Editorial PNG Visuals) */}
          <View className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Anchor 1: Game Discovery & Structured Playtesting */}
            <View
              className={`lg:col-span-6 rounded-2xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-4">
                <View className="flex items-center justify-between font-mono text-xs">
                  <span className={t.classes.violetAccentText}>
                    CORE ENGINE A · DISCOVERY & PLAYTEST ACCESS
                  </span>
                  <span className={t.classes.textMuted}>01 — 02</span>
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Game Discovery & Structured Playtesting
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Filter upcoming and live games by genre, platform compatibility, and playtest
                  readiness, then enroll directly into versioned studio builds with explicit testing
                  missions.
                </Text>
                <ImageZoomFrame className={`${mediaStyles.editorialSplitFrame} h-44`}>
                  <Image
                    source="/assets/generated/community/playtest-lab-session.png"
                    alt="Playtest Cohort Lab Session"
                    className="w-full h-full object-cover"
                  />
                </ImageZoomFrame>
              </View>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-border-subtle/70">
                <div>
                  <div className="flex items-center gap-2 font-display text-sm font-bold">
                    <Compass className="w-4 h-4 text-accent-violet" />
                    <span>Game Discovery</span>
                  </div>
                  <p className={`text-xs mt-1 ${t.classes.textSecondary}`}>
                    Genre, platform, and build-status filtering across active cohorts.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-display text-sm font-bold">
                    <Layers className={`w-4 h-4 ${t.classes.cyanAccentText}`} />
                    <span>Game Testing</span>
                  </div>
                  <p className={`text-xs mt-1 ${t.classes.textSecondary}`}>
                    Versioned release candidates with studio test checklists.
                  </p>
                </div>
              </div>
            </View>

            {/* Anchor 2: Structured Bug Reporting & Developer Collaboration */}
            <View
              className={`lg:col-span-6 rounded-2xl p-6 sm:p-8 flex flex-col justify-between ${t.styles.bauhaus.architecturalCard}`}
            >
              <View className="space-y-4">
                <View className="flex items-center justify-between font-mono text-xs">
                  <span className={t.classes.cyanAccentText}>
                    CORE ENGINE B · QA TRIAGE & STUDIO LOOP
                  </span>
                  <span className={t.classes.textMuted}>03 — 04</span>
                </View>
                <Text as="h3" className={`font-display text-xl sm:text-2xl font-bold ${t.classes.textPrimary}`}>
                  Bug Reporting & Developer Collaboration
                </Text>
                <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                  Submit structured defect reports with severity classification, reproduction steps,
                  and expected vs. actual outcomes that link directly to studio engineering triage.
                </Text>
                <ImageZoomFrame className={`${mediaStyles.editorialSplitFrame} h-44`}>
                  <Image
                    source="/assets/generated/community/developer-triage-hub.png"
                    alt="Studio Developer Triage Collaboration Hub"
                    className="w-full h-full object-cover"
                  />
                </ImageZoomFrame>
              </View>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-border-subtle/70">
                <div>
                  <div className="flex items-center gap-2 font-display text-sm font-bold">
                    <Bug className="w-4 h-4 text-status-warning" />
                    <span>Bug Reporting</span>
                  </div>
                  <p className={`text-xs mt-1 ${t.classes.textSecondary}`}>
                    Reproducible templates with automatic severity bounty calculation.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-display text-sm font-bold">
                    <GitPullRequest className={`w-4 h-4 ${t.classes.cyanAccentText}`} />
                    <span>Developer Collaboration</span>
                  </div>
                  <p className={`text-xs mt-1 ${t.classes.textSecondary}`}>
                    Direct status tracking from In Triage to Verified and Resolved.
                  </p>
                </div>
              </div>
            </View>
          </View>

          {/* TIER 2: Four Connected Competitive & Identity Modules */}
          <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Tournaments',
                desc: 'Register for organized competitive brackets with transparent slot counts, rules, and prize pools.',
                icon: Trophy,
                route: 'tournaments',
              },
              {
                title: 'Leaderboards',
                desc: 'Track verified tester reputation points separately from competitive tournament match standings.',
                icon: Award,
                route: 'dashboard',
              },
              {
                title: 'Profiles',
                desc: 'Showcase your playtesting accuracy rate, verified bug history, tier badges, and tournament record.',
                icon: UserCheck,
                route: 'profile',
              },
              {
                title: 'Notifications',
                desc: 'Receive real-time alerts when a developer verifies your bug report, deploys a new build, or starts a bracket round.',
                icon: Bell,
                route: 'notifications',
              },
            ].map((feat) => {
              const IconComponent = feat.icon;
              return (
                <View
                  key={feat.title}
                  className={`h-full rounded-xl p-6 flex flex-col justify-between transition-colors hover:border-[#8B5CF6] ${t.styles.bauhaus.architecturalCard}`}
                >
                  <View className="space-y-3">
                    <View
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.styles.glass.iconBadge}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </View>
                    <Text as="h3" className={`font-display text-lg font-bold ${t.classes.textPrimary}`}>
                      {feat.title}
                    </Text>
                    <Text as="p" className={`text-sm leading-relaxed ${t.classes.textSecondary}`}>
                      {feat.desc}
                    </Text>
                  </View>
                  <View className={`mt-5 pt-3 border-t ${t.classes.borderSubtle}`}>
                    <Pressable
                      onPress={() => onOpenNexusRoute(feat.route)}
                      className={`text-xs font-mono font-medium inline-flex items-center gap-1.5 ${t.classes.violetAccentText} hover:underline`}
                    >
                      <span>Open in NEXUS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
};
