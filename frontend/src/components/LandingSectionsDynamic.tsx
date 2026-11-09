import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Trophy,
  Award,
  Check,
  SlidersHorizontal,
  Crown,
} from 'lucide-react';
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from './primitives';
import { theme, ThemeMode } from '../theme/theme';
import {
  GameItem,
  TournamentItem,
  TesterRankingEntry,
  TournamentStandingEntry,
  filterGames,
  filterTournaments,
  splitLeaderboardPodium,
  resolveCharacterByHandle,
} from '../utils/ecosystemRules';
import {
  gameService,
  tournamentService,
  leaderboardService,
  setSimulatedApiFailure,
} from '../services/api';
import {
  ScrollReveal,
  BauhausSectionBadge,
  MaskReveal,
  ClipPathWipe,
  DirectionalSlide,
  PerspectiveTiltCard,
  PodiumRise,
  ImageZoomFrame,
  AnimatedMetricValue,
} from './ScrollReveal';
import surfaceStyles from '../styles/SurfaceEffects.module.css';
import mediaStyles from '../styles/MediaPresentation.module.css';

interface DynamicSectionsProps {
  mode: ThemeMode;
  onOpenNexusRoute: (route: string, itemId?: string) => void;
  refreshTrigger?: number;
}

export const LandingSectionsDynamic: React.FC<DynamicSectionsProps> = ({
  mode,
  onOpenNexusRoute,
  refreshTrigger = 0,
}) => {
  const t = theme[mode];
  const isDark = mode === 'dark';
  const prefersReducedMotion = Boolean(useReducedMotion());

  // --- Section 08: Games State ---
  const [games, setGames] = useState<GameItem[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [gamesLoading, setGamesLoading] = useState<boolean>(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [gameStatusFilter, setGameStatusFilter] = useState<string>('All');
  const [gameCategoryFilter, setGameCategoryFilter] = useState<string>('All');
  const [gameSearch, setGameSearch] = useState<string>('');
  const [selectedGameModal, setSelectedGameModal] = useState<GameItem | null>(null);

  // --- Section 09: Tournaments State ---
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [registeredTourneyIds, setRegisteredTourneyIds] = useState<string[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState<boolean>(true);
  const [tournamentsError, setTournamentsError] = useState<string | null>(null);
  const [tourneyStatusFilter, setTourneyStatusFilter] = useState<string>('All');
  const [tourneySearch, setTourneySearch] = useState<string>('');
  const [selectedBracketModal, setSelectedBracketModal] = useState<TournamentItem | null>(null);

  // --- Section 10: Leaderboard State ---
  const [testerRankings, setTesterRankings] = useState<TesterRankingEntry[]>([]);
  const [tournamentStandings, setTournamentStandings] = useState<TournamentStandingEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'testers' | 'tournaments'>(
    'testers'
  );

  const loadGames = useCallback(async () => {
    setGamesLoading(true);
    setGamesError(null);
    try {
      const data = await gameService.getGames();
      setGames(data.items || []);
      setEnrolledIds(data.enrolledIds || []);
    } catch (err) {
      setGamesError(err instanceof Error ? err.message : 'Unable to load games catalog.');
    } finally {
      setGamesLoading(false);
    }
  }, []);

  const loadTournaments = useCallback(async () => {
    setTournamentsLoading(true);
    setTournamentsError(null);
    try {
      const data = await tournamentService.getTournaments();
      setTournaments(data.items || []);
      setRegisteredTourneyIds(data.registeredIds || []);
    } catch (err) {
      setTournamentsError(
        err instanceof Error ? err.message : 'Unable to load tournament schedule.'
      );
    } finally {
      setTournamentsLoading(false);
    }
  }, []);

  const loadLeaderboards = useCallback(async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const data = await leaderboardService.getLeaderboards();
      setTesterRankings(data.testerRankings || []);
      setTournamentStandings(data.tournamentStandings || []);
    } catch (err) {
      setLeaderboardError(err instanceof Error ? err.message : 'Unable to load rankings.');
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
    loadTournaments();
    loadLeaderboards();
  }, [loadGames, loadTournaments, loadLeaderboards, refreshTrigger]);

  const handleTogglePlaytest = async (gameId: string) => {
    try {
      const res = await gameService.togglePlaytestEnrollment(gameId);
      setEnrolledIds(res.enrolledIds);
    } catch {
      // handled gracefully
    }
  };

  const handleToggleTournamentReg = async (tournamentId: string) => {
    try {
      const res = await tournamentService.toggleTournamentRegistration(tournamentId);
      setRegisteredTourneyIds(res.registeredIds);
    } catch {
      // handled gracefully
    }
  };

  const triggerSimulatedGamesError = () => {
    setSimulatedApiFailure('/games');
    loadGames();
  };

  const recoverGamesFromError = () => {
    setSimulatedApiFailure(null);
    loadGames();
  };

  const filteredGames = filterGames(games, gameStatusFilter, gameCategoryFilter, gameSearch);
  const filteredTournaments = filterTournaments(tournaments, tourneyStatusFilter, tourneySearch);

  const { podium: testerPodium } = splitLeaderboardPodium(testerRankings);
  const { podium: tourneyPodium } = splitLeaderboardPodium(tournamentStandings);

  return (
    <>
      {/* =====================================================================
          SECTION 08 — GAME LISTINGS (PRIMARY: ARTWORK MASK REVEAL + IMAGE ZOOM + 3D PERSPECTIVE TILT)
      ====================================================================== */}
      <View
        as="section"
        id="section-08-games"
        testID="section-08-games"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.canvas}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <DirectionalSlide direction="left">
            <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <View className="max-w-2xl space-y-4">
                <BauhausSectionBadge
                  index="08"
                  label="LIVE PLAYTESTING & DISCOVERY CATALOG"
                  accent="violet"
                  mode={mode}
                />
                <Text
                  as="h2"
                  className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
                >
                  DISCOVER YOUR NEXT GAME.
                </Text>
                <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                  Explore real builds currently open for community playtesting, structured bug
                  bounties, and competitive launch tournaments.
                </Text>
              </View>

              <View className="flex flex-wrap items-center gap-3">
                <Pressable
                  onPress={gamesError ? recoverGamesFromError : triggerSimulatedGamesError}
                  testID="toggle-games-error-sim-btn"
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap shrink-0 ${t.classes.secondaryBtn}`}
                >
                  {gamesError ? 'Restore API Connection' : 'Test API Error State'}
                </Pressable>

                <Pressable
                  onPress={() => onOpenNexusRoute('games')}
                  testID="explore-all-games-btn"
                  className={`px-5 py-2.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${t.classes.primaryBtn}`}
                >
                  <span>Explore All Games</span>
                  <ArrowRight className="w-4 h-4" />
                </Pressable>
              </View>
            </View>
          </DirectionalSlide>

          {/* Claymorphic Interactive Filter & Search Bar */}
          <DirectionalSlide direction="bottom" delay={0.06} distance={18}>
            <View
              className={`p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${surfaceStyles.clayFilterBar} ${t.styles.clay.filterBar}`}
            >
              {/* Status Segmented Control */}
              <View className="flex flex-wrap items-center gap-1.5">
                {['All', 'Bug Bounty Active', 'Open Playtest', 'Closed Beta', 'Live Release'].map(
                  (status) => {
                    const isActive = gameStatusFilter === status;
                    return (
                      <Pressable
                        key={status}
                        onPress={() => setGameStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-accent-violet text-white shadow-sm'
                            : `${t.classes.textSecondary} hover:opacity-80`
                        }`}
                      >
                        {status}
                      </Pressable>
                    );
                  }
                )}
              </View>

              {/* Category + Claymorphic Search Input */}
              <View className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <View className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent-violet shrink-0" />
                  <select
                    aria-label="Filter games by category"
                    value={gameCategoryFilter}
                    onChange={(e) => setGameCategoryFilter(e.target.value)}
                    className={`px-3 py-2 text-xs font-medium ${surfaceStyles.clayInputField} ${t.styles.clay.input}`}
                  >
                    <option value="All">All Genres</option>
                    <option value="Extraction Sci-Fi">Extraction Sci-Fi</option>
                    <option value="Cyber Racing">Cyber Racing</option>
                    <option value="Strategy Arena">Strategy Arena</option>
                    <option value="Action RPG">Action RPG</option>
                    <option value="Tactical Shooter">Tactical Shooter</option>
                  </select>
                </View>

                <View className="relative flex-1 sm:w-60">
                  <Search className="w-4 h-4 text-muted-fg absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <TextInput
                    aria-label="Search games by title or studio"
                    placeholder="Search title or studio..."
                    value={gameSearch}
                    onChangeText={setGameSearch}
                    testID="games-search-input"
                    className={`w-full pl-9 pr-3 py-2 text-xs ${surfaceStyles.clayInputField} ${t.styles.clay.input}`}
                  />
                </View>
              </View>
            </View>
          </DirectionalSlide>

          {/* Loading / Error / Empty / Populated States */}
          {gamesLoading ? (
            <View className="py-16 flex flex-col items-center justify-center gap-4">
              <ActivityIndicator size="lg" label="Fetching active playtest catalog..." />
            </View>
          ) : gamesError ? (
            <View
              testID="games-error-state"
              className={`p-8 text-center max-w-lg mx-auto space-y-4 ${surfaceStyles.clayCard} ${t.styles.clay.card}`}
            >
              <AlertTriangle className="w-8 h-8 text-status-danger mx-auto" />
              <Text as="h3" className={`font-display text-lg font-bold ${t.classes.textPrimary}`}>
                Unable to Load Game Listings
              </Text>
              <Text as="p" className={`text-sm ${t.classes.textSecondary}`}>
                {gamesError}
              </Text>
              <Pressable
                onPress={recoverGamesFromError}
                testID="games-retry-btn"
                className={`px-5 py-2.5 rounded-xl font-display font-semibold text-xs inline-flex items-center gap-2 ${t.classes.primaryBtn}`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredGames}
              keyExtractor={(item) => item.id}
              testID="games-grid-list"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              ListEmptyComponent={
                <View
                  testID="games-empty-state"
                  className={`p-10 text-center max-w-lg mx-auto space-y-4 ${t.styles.clay.card}`}
                >
                  <Text as="h3" className={`font-display text-lg font-bold ${t.classes.textPrimary}`}>
                    No Games Match Your Active Filter
                  </Text>
                  <Text as="p" className={`text-sm ${t.classes.textSecondary}`}>
                    Try clearing your search query or switching the playtest status filter back to
                    All.
                  </Text>
                  <Pressable
                    onPress={() => {
                      setGameStatusFilter('All');
                      setGameCategoryFilter('All');
                      setGameSearch('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.classes.primaryBtn}`}
                  >
                    Reset Game Filters
                  </Pressable>
                </View>
              }
              renderItem={({ item, index }) => {
                const isEnrolled = enrolledIds.includes(item.id);
                const cardDelay = (index % 3) * 0.09;
                return (
                  <PerspectiveTiltCard className="h-full">
                    <View
                      as="article"
                      className={`group h-full overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-accent-violet/60 ${surfaceStyles.clayCard} ${t.styles.clay.card}`}
                    >
                      <View>
                        {/* Stage 1: Artwork Mask Reveal + Contained Image Zoom */}
                        <MaskReveal
                          direction="bottom-up"
                          delay={cardDelay}
                          className={mediaStyles.gameArtworkFrame}
                        >
                          <ImageZoomFrame className="w-full h-full">
                            <Image
                              source={item.artworkUrl}
                              alt={`${item.title} cover artwork`}
                              className="w-full h-full object-cover"
                            />
                          </ImageZoomFrame>
                        </MaskReveal>

                        {/* Stage 2 (+0.12s after artwork): Status Labels & Testing Details */}
                        <DirectionalSlide
                          direction="bottom"
                          delay={cardDelay + 0.12}
                          distance={14}
                          className="p-6 space-y-3"
                        >
                          <View className={`flex flex-wrap items-center gap-1.5 font-mono text-xs ${t.classes.textMuted}`}>
                            <Text className={t.classes.cyanAccentText}>{item.testingStatus}</Text>
                            <Text aria-hidden="true">·</Text>
                            <Text>{item.category}</Text>
                            <Text aria-hidden="true">·</Text>
                            <Text className="tabular-nums">{item.buildVersion}</Text>
                          </View>

                          <Text
                            as="h3"
                            className={`font-display text-xl font-bold ${t.classes.textPrimary}`}
                          >
                            {item.title}
                          </Text>

                          <Text
                            as="p"
                            className={`text-xs font-medium ${t.classes.textMuted}`}
                          >
                            {item.studio} · Platforms: {item.platforms.join(', ')}
                          </Text>

                          <Text
                            as="p"
                            className={`text-sm leading-relaxed ${t.classes.textSecondary}`}
                          >
                            {item.description}
                          </Text>
                        </DirectionalSlide>
                      </View>

                      <DirectionalSlide
                        direction="bottom"
                        delay={cardDelay + 0.18}
                        distance={10}
                        className={`px-6 pb-6 pt-4 border-t ${t.classes.borderSubtle} space-y-4`}
                      >
                        <View className="flex items-center justify-between text-xs font-mono tabular-nums">
                          <Text className={t.classes.textMuted}>
                            Active Testers:{' '}
                            <strong className={t.classes.textPrimary}>{item.activeTesters}</strong>
                          </Text>
                          <Text className={t.classes.cyanAccentText}>
                            Up to +{item.bountyRewardPoints} PTS / Bug
                          </Text>
                        </View>

                        <View className="flex items-center gap-2.5">
                          <Pressable
                            onPress={() => handleTogglePlaytest(item.id)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 ${
                              isEnrolled ? t.classes.secondaryBtn : t.classes.primaryBtn
                            }`}
                          >
                            {isEnrolled ? (
                              <>
                                <Check className={`w-3.5 h-3.5 ${t.classes.cyanAccentText}`} />
                                <span>Enrolled in Playtest</span>
                              </>
                            ) : (
                              <span>Join Playtest Cohort</span>
                            )}
                          </Pressable>

                          <Pressable
                            onPress={() => setSelectedGameModal(item)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 ${t.classes.secondaryBtn}`}
                          >
                            Test Brief
                          </Pressable>
                        </View>
                      </DirectionalSlide>
                    </View>
                  </PerspectiveTiltCard>
                );
              }}
            />
          )}
        </View>
      </View>

      {/* =====================================================================
          SECTION 09 — TOURNAMENT LISTINGS (PRIMARY: DIRECTIONAL HORIZONTAL ENTRANCE + BANNER WIPE + SLOT METER)
      ====================================================================== */}
      <View
        as="section"
        id="section-09-tournaments"
        testID="section-09-tournaments"
        className={`relative overflow-hidden ${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.surface}`}
      >
        {/* Subtle Competitive Arena Bracket Geometry Backdrop (Sequence C Transition) */}
        <svg
          viewBox="0 0 1200 420"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 w-full h-80 opacity-20"
        >
          <path
            d="M 80 60 H 260 V 180 H 440 M 80 300 H 260 V 180 M 1120 60 H 940 V 180 H 760 M 1120 300 H 940 V 180"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <circle cx="440" cy="180" r="4" fill="#22D3EE" />
          <circle cx="760" cy="180" r="4" fill="#3B82F6" />
        </svg>

        <View className={`relative z-10 ${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <DirectionalSlide direction="right">
            <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <View className="max-w-2xl space-y-4">
                <BauhausSectionBadge
                  index="09"
                  label="COMPETITIVE ARENA & BRACKETS"
                  accent="blue"
                  mode={mode}
                />
                <Text
                  as="h2"
                  className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
                >
                  COMPETE. CHALLENGE. CONQUER.
                </Text>
                <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                  Enter verified regional and international tournaments with transparent registration
                  deadlines, slot capacities, and live bracket tracking.
                </Text>
              </View>

              <Pressable
                onPress={() => onOpenNexusRoute('tournaments')}
                testID="explore-all-tournaments-btn"
                className={`px-5 py-2.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${t.classes.primaryBtn}`}
              >
                <span>Explore All Tournaments</span>
                <ArrowRight className="w-4 h-4" />
              </Pressable>
            </View>
          </DirectionalSlide>

          {/* Claymorphic Tournament Filter Bar */}
          <DirectionalSlide direction="left" delay={0.06} distance={20}>
            <View
              className={`p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${surfaceStyles.clayFilterBar} ${t.styles.clay.filterBar}`}
            >
              <View className="flex flex-wrap items-center gap-1.5">
                {['All', 'Registration Open', 'Live Bracket', 'Completed'].map((status) => {
                  const isActive = tourneyStatusFilter === status;
                  return (
                    <Pressable
                      key={status}
                      onPress={() => setTourneyStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-accent-violet text-white'
                          : `${t.classes.textSecondary} hover:opacity-80`
                      }`}
                    >
                      {status}
                    </Pressable>
                  );
                })}
              </View>

              <View className="relative sm:w-64">
                <Search className="w-4 h-4 text-muted-fg absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <TextInput
                  aria-label="Search tournaments"
                  placeholder="Search tournament or game..."
                  value={tourneySearch}
                  onChangeText={setTourneySearch}
                  className={`w-full pl-9 pr-3 py-2 text-xs ${surfaceStyles.clayInputField} ${t.styles.clay.input}`}
                />
              </View>
            </View>
          </DirectionalSlide>

          {tournamentsLoading ? (
            <View className="py-16 flex flex-col items-center justify-center">
              <ActivityIndicator size="lg" label="Loading competitive brackets..." />
            </View>
          ) : tournamentsError ? (
            <View className={`p-8 text-center max-w-lg mx-auto space-y-4 ${t.styles.clay.card}`}>
              <AlertTriangle className="w-8 h-8 text-[#EF4444] mx-auto" />
              <Text as="p" className={`text-sm ${t.classes.textSecondary}`}>
                {tournamentsError}
              </Text>
              <Pressable
                onPress={loadTournaments}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.classes.primaryBtn}`}
              >
                Retry
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filteredTournaments}
              keyExtractor={(item) => item.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              ListEmptyComponent={
                <View className={`p-8 text-center ${t.styles.clay.card}`}>
                  <Text as="p" className={`text-sm ${t.classes.textSecondary}`}>
                    No tournaments match this filter.
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => {
                const isRegistered = registeredTourneyIds.includes(item.id);
                const isEven = index % 2 === 0;
                const slotPercent = Math.min(
                  100,
                  Math.round((item.slotsFilled / Math.max(1, item.slotsTotal)) * 100)
                );
                return (
                  <DirectionalSlide
                    direction={isEven ? 'left' : 'right'}
                    delay={index * 0.09}
                    distance={38}
                    className="h-full"
                  >
                    <View
                      as="article"
                      className={`group h-full overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${surfaceStyles.clayCard} ${t.styles.clay.card}`}
                    >
                      <View>
                        {/* Stage 1: Horizontal Clip-Path Wipe on Tournament Banner */}
                        <ClipPathWipe
                          direction={isEven ? 'horizontal-left' : 'horizontal-right'}
                          delay={index * 0.09 + 0.05}
                          className={mediaStyles.tournamentBannerFrame}
                        >
                          <ImageZoomFrame className="w-full h-full">
                            <Image
                              source={item.bannerUrl}
                              alt={`${item.title} banner`}
                              className="w-full h-full object-cover"
                            />
                          </ImageZoomFrame>
                        </ClipPathWipe>

                        {/* Stage 2: Tournament Header & Staged Details Reveal */}
                        <View className="p-6 space-y-3">
                          <View className={`flex flex-wrap items-center gap-1.5 font-mono text-xs ${t.classes.textMuted}`}>
                            <Text
                              className={
                                item.status === 'Registration Open'
                                  ? t.classes.cyanAccentText
                                  : item.status === 'Live Bracket'
                                  ? t.classes.blueAccentText
                                  : t.classes.textMuted
                              }
                            >
                              {item.status}
                            </Text>
                            <Text aria-hidden="true">·</Text>
                            <Text>{item.gameTitle}</Text>
                            <Text aria-hidden="true">·</Text>
                            <Text>{item.region}</Text>
                          </View>

                          <Text
                            as="h3"
                            className={`font-display text-xl font-bold ${t.classes.textPrimary}`}
                          >
                            {item.title}
                          </Text>

                          {/* Stage 3: Prize, Registration & Deadline Reveal after Main Card */}
                          <DirectionalSlide
                            direction="bottom"
                            delay={index * 0.09 + 0.16}
                            distance={12}
                            className="space-y-3 pt-2"
                          >
                            <View className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs tabular-nums">
                              <View>
                                <Text as="p" className={t.classes.textMuted}>
                                  Event Date
                                </Text>
                                <Text as="p" className={`font-semibold mt-0.5 ${t.classes.textPrimary}`}>
                                  {item.date}
                                </Text>
                              </View>
                              <View>
                                <Text as="p" className={t.classes.textMuted}>
                                  Deadline
                                </Text>
                                <Text as="p" className={`font-semibold mt-0.5 ${t.classes.textPrimary}`}>
                                  {item.registrationDeadline}
                                </Text>
                              </View>
                              <View>
                                <Text as="p" className={t.classes.textMuted}>
                                  Slots Filled
                                </Text>
                                <Text as="p" className={`font-semibold mt-0.5 ${t.classes.textPrimary}`}>
                                  {item.slotsFilled} / {item.slotsTotal}
                                </Text>
                              </View>
                              <View>
                                <Text as="p" className={t.classes.textMuted}>
                                  Prize Pool
                                </Text>
                                <Text as="p" className={`font-bold mt-0.5 ${t.classes.cyanAccentText}`}>
                                  {item.prizePool}
                                </Text>
                              </View>
                            </View>

                            {/* Real API Data Slot Capacity Progress Bar */}
                            <div className="h-1.5 w-full rounded-full bg-border-subtle/50 overflow-hidden">
                              <motion.div
                                initial={prefersReducedMotion ? { width: `${slotPercent}%` } : { width: '0%' }}
                                whileInView={{ width: `${slotPercent}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.65, delay: index * 0.09 + 0.22, ease: theme.motion.easeOutExpo }}
                                className={`h-full rounded-full ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar}`}
                              />
                            </div>
                          </DirectionalSlide>
                        </View>
                      </View>

                      <View
                        className={`px-6 pb-6 pt-4 border-t ${t.classes.borderSubtle} flex flex-wrap items-center justify-between gap-3`}
                      >
                        <Text as="span" className={`text-xs ${t.classes.textMuted}`}>
                          Format: {item.format}
                        </Text>

                        <View className="flex items-center gap-2.5">
                          {item.bracket.length > 0 && (
                            <Pressable
                              onPress={() => setSelectedBracketModal(item)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 ${t.classes.secondaryBtn}`}
                            >
                              Inspect Bracket
                            </Pressable>
                          )}
                          <Pressable
                            onPress={() => handleToggleTournamentReg(item.id)}
                            disabled={item.status === 'Completed'}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 ${
                              item.status === 'Completed'
                                ? 'opacity-50 cursor-not-allowed bg-elevated text-muted-fg'
                                : isRegistered
                                ? t.classes.secondaryBtn
                                : t.classes.primaryBtn
                            }`}
                          >
                            {item.status === 'Completed'
                              ? 'Event Concluded'
                              : isRegistered
                              ? 'Registered ✓'
                              : 'Register Roster'}
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </DirectionalSlide>
                );
              }}
            />
          )}
        </View>
      </View>

      {/* =====================================================================
          SECTION 10 — RANKINGS / LEADERBOARD (PRIMARY: INDEPENDENT PODIUM RISE + REAL NUMBER TRANSITION)
      ====================================================================== */}
      <View
        as="section"
        id="section-10-rankings"
        testID="section-10-rankings"
        className={`${theme.spacing.sectionPaddingY} ${t.styles.bauhaus.sectionFrame} ${t.classes.canvas}`}
      >
        <View className={`${theme.spacing.maxContainerWidth} ${theme.spacing.containerPaddingX}`}>
          <DirectionalSlide direction="bottom" distance={22}>
            <View className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <View className="max-w-2xl space-y-4">
                <BauhausSectionBadge
                  index="10"
                  label="VERIFIED PROGRESSION & STANDINGS"
                  accent="cyan"
                  mode={mode}
                />
                <Text
                  as="h2"
                  className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${t.classes.textPrimary}`}
                >
                  RISE THROUGH THE RANKS.
                </Text>
                <Text as="p" className={`text-base leading-relaxed ${t.classes.textSecondary}`}>
                  Riyadah Elite maintains two distinct progression ladders: Verified Tester Rankings
                  based on reproducible bug reports and QA accuracy, and Tournament Standings based
                  on bracket match performance.
                </Text>
              </View>

              <Pressable
                onPress={() => onOpenNexusRoute('dashboard')}
                testID="view-full-leaderboard-btn"
                className={`px-5 py-2.5 rounded-xl font-display font-semibold text-sm whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${t.classes.primaryBtn}`}
              >
                <span>View Full Leaderboard</span>
                <ArrowRight className="w-4 h-4" />
              </Pressable>
            </View>
          </DirectionalSlide>

          {/* Dual-Track Leaderboard Switcher */}
          <DirectionalSlide direction="bottom" delay={0.05} distance={14}>
            <View className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <View
                className={`inline-flex p-1.5 ${surfaceStyles.clayFilterBar} ${t.styles.clay.filterBar}`}
                role="tablist"
                aria-label="Leaderboard Track Selector"
              >
                <Pressable
                  role="tab"
                  aria-selected={activeLeaderboardTab === 'testers'}
                  testID="tab-tester-rankings"
                  onPress={() => setActiveLeaderboardTab('testers')}
                  className={`px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                    activeLeaderboardTab === 'testers'
                      ? 'bg-accent-violet text-white shadow-sm'
                      : `${t.classes.textSecondary}`
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Verified Tester Rankings (QA Reputation)</span>
                </Pressable>

                <Pressable
                  role="tab"
                  aria-selected={activeLeaderboardTab === 'tournaments'}
                  testID="tab-tournament-standings"
                  onPress={() => setActiveLeaderboardTab('tournaments')}
                  className={`px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
                    activeLeaderboardTab === 'tournaments'
                      ? 'bg-accent-violet text-white shadow-sm'
                      : `${t.classes.textSecondary}`
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Tournament Standings (Competitive Play)</span>
                </Pressable>
              </View>

              <Text as="p" className={`font-mono text-xs ${t.classes.textMuted}`}>
                {activeLeaderboardTab === 'testers'
                  ? 'Calculated from verified bug severity, reproduction clarity & completed test builds'
                  : 'Calculated from official NEXUS bracket placements, series wins & match win rate'}
              </Text>
            </View>
          </DirectionalSlide>

          {leaderboardLoading ? (
            <View className="py-12 flex justify-center">
              <ActivityIndicator label="Loading rankings..." />
            </View>
          ) : leaderboardError ? (
            <View className={`p-6 text-center ${surfaceStyles.clayCard} ${t.styles.clay.card}`}>
              <Text as="p" className="text-sm text-status-danger">
                {leaderboardError}
              </Text>
            </View>
          ) : activeLeaderboardTab === 'testers' ? (
            <View key="testers-ladder" className="space-y-8">
              {/* Top-3 Tester Podium (Independent #1 -> #2 -> #3 Rise + Character Cutout Portraits) */}
              <View
                testID="leaderboard-tester-podium"
                className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end"
              >
                {testerPodium.map((p) => {
                  const charProfile = resolveCharacterByHandle(p.handle);
                  return (
                    <PodiumRise key={p.id} rank={p.rank} className="h-full">
                      <View
                        className={`h-full p-6 flex flex-col justify-between relative overflow-hidden ${
                          p.rank === 1 ? 'md:py-8 border-2 border-accent-cyan/65' : ''
                        } ${surfaceStyles.clayPodiumCard} ${t.styles.clay.podiumCard}`}
                      >
                        <View className="space-y-3 relative z-10">
                          <View className="flex items-center justify-between">
                            <span
                              className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-md ${
                                p.rank === 1
                                  ? 'bg-accent-cyan text-inverse-fg'
                                  : p.rank === 2
                                  ? 'bg-accent-violet text-white'
                                  : 'bg-accent-blue text-white'
                              }`}
                            >
                              PODIUM #{p.rank}
                            </span>
                            <Crown
                              className={`w-5 h-5 ${
                                p.rank === 1
                                  ? t.classes.cyanAccentText
                                  : 'text-accent-violet'
                              }`}
                            />
                          </View>

                          <div className="flex items-center gap-3.5 pt-1">
                            <div className={`w-14 h-16 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                              <Image
                                source={charProfile.cutoutUrl}
                                alt={p.handle}
                                className="w-full h-full object-contain object-top"
                              />
                            </div>
                            <div className="min-w-0">
                              <Text as="h3" className={`font-display text-lg font-bold truncate ${t.classes.textPrimary}`}>
                                {p.handle}
                              </Text>
                              <Text as="p" className={`text-xs ${t.classes.textSecondary}`}>
                                {p.tier} · {p.roleTitle}
                              </Text>
                            </div>
                          </div>
                        </View>
                        <View
                          className={`mt-5 pt-4 border-t ${t.classes.borderSubtle} space-y-2.5 font-mono text-xs tabular-nums relative z-10`}
                        >
                          <View className="flex items-center justify-between">
                            <Text className={t.classes.textMuted}>
                              <AnimatedMetricValue value={p.verifiedBugs} suffix=" Verified" /> ·{' '}
                              {p.reproductionAccuracy}
                            </Text>
                            <Text className={`text-sm font-extrabold ${t.classes.cyanAccentText}`}>
                              <AnimatedMetricValue value={p.reputationPoints} suffix=" PTS" />
                            </Text>
                          </View>
                          <div className="h-1 w-full rounded-full bg-border-subtle/50 overflow-hidden">
                            <div
                              style={{ width: p.reproductionAccuracy }}
                              className={`h-full rounded-full ${surfaceStyles.bauhausSpectrumBar} ${t.styles.bauhaus.geoAccentBar}`}
                            />
                          </div>
                        </View>
                      </View>
                    </PodiumRise>
                  );
                })}
              </View>

              {/* Full Claymorphic Tester Rankings Table */}
              <ScrollReveal variant="fade-up" delay={0.34}>
                <View className={`overflow-hidden ${surfaceStyles.clayTableContainer} ${t.styles.clay.tableContainer}`}>
                  <View className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className={`border-b ${t.classes.borderSubtle} font-mono text-xs ${t.classes.textMuted}`}
                        >
                          <th className="py-4 px-5">Rank</th>
                          <th className="py-4 px-5">Tester Handle</th>
                          <th className="py-4 px-5">Specialty & Tier</th>
                          <th className="py-4 px-5 text-right">Verified Bugs</th>
                          <th className="py-4 px-5 text-right">Critical Bugs</th>
                          <th className="py-4 px-5 text-right">Accuracy</th>
                          <th className="py-4 px-5 text-right">Reputation Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle/60 text-sm">
                        {testerRankings.map((row) => (
                          <tr key={row.id} className="hover:bg-accent-violet/8 transition-colors">
                            <td className="py-3.5 px-5 font-mono font-bold tabular-nums">
                              #{row.rank}
                            </td>
                            <td className="py-3.5 px-5 font-display font-semibold">
                              {row.handle}
                            </td>
                            <td className={`py-3.5 px-5 text-xs ${t.classes.textSecondary}`}>
                              {row.tier} · {row.roleTitle}
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono tabular-nums">
                              {row.verifiedBugs}
                            </td>
                            <td className={`py-3.5 px-5 text-right font-mono tabular-nums ${t.classes.cyanAccentText}`}>
                              {row.criticalBugs}
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono tabular-nums">
                              {row.reproductionAccuracy}
                            </td>
                            <td
                              className={`py-3.5 px-5 text-right font-mono font-bold tabular-nums ${t.classes.cyanAccentText}`}
                            >
                              {row.reputationPoints.toLocaleString()} PTS
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </View>
                </View>
              </ScrollReveal>
            </View>
          ) : (
            <View key="tournaments-ladder" className="space-y-8">
              {/* Top-3 Tournament Standings Podium (Independent #1 -> #2 -> #3 Rise + Competitor Cutouts) */}
              <View
                testID="leaderboard-tournament-podium"
                className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end"
              >
                {tourneyPodium.map((p) => {
                  const charProfile = resolveCharacterByHandle(p.handle);
                  return (
                    <PodiumRise key={p.id} rank={p.rank} className="h-full">
                      <View
                        className={`h-full p-6 flex flex-col justify-between ${
                          p.rank === 1 ? 'md:py-8 border-2 border-accent-blue/65' : ''
                        } ${surfaceStyles.clayPodiumCard} ${t.styles.clay.podiumCard}`}
                      >
                        <View className="space-y-3">
                          <View className="flex items-center justify-between">
                            <span
                              className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-md ${
                                p.rank === 1
                                  ? 'bg-accent-cyan text-inverse-fg'
                                  : p.rank === 2
                                  ? 'bg-accent-violet text-white'
                                  : 'bg-accent-blue text-white'
                              }`}
                            >
                              STANDING #{p.rank}
                            </span>
                            <Trophy className="w-5 h-5 text-accent-violet" />
                          </View>
                          <div className="flex items-center gap-3.5 pt-1">
                            <div className={`w-14 h-16 shrink-0 ${mediaStyles.characterCutoutBadge}`}>
                              <Image
                                source={charProfile.cutoutUrl}
                                alt={p.handle}
                                className="w-full h-full object-contain object-top"
                              />
                            </div>
                            <div className="min-w-0">
                              <Text as="h3" className={`font-display text-lg font-bold truncate ${t.classes.textPrimary}`}>
                                {p.handle}
                              </Text>
                              <Text as="p" className={`text-xs ${t.classes.textSecondary}`}>
                                {p.teamName} · {p.region}
                              </Text>
                            </div>
                          </div>
                        </View>
                        <View
                          className={`mt-5 pt-4 border-t ${t.classes.borderSubtle} flex items-center justify-between font-mono text-xs tabular-nums`}
                        >
                          <Text className={t.classes.textMuted}>
                            <AnimatedMetricValue value={p.tournamentsWon} suffix=" Titles" /> · {p.winRate} Win Rate
                          </Text>
                          <Text className={`text-sm font-extrabold ${t.classes.violetAccentText}`}>
                            <AnimatedMetricValue value={p.tournamentPoints} suffix=" RP" />
                          </Text>
                        </View>
                      </View>
                    </PodiumRise>
                  );
                })}
              </View>

              {/* Full Claymorphic Tournament Standings Table */}
              <ScrollReveal variant="fade-up" delay={0.34}>
                <View className={`overflow-hidden ${surfaceStyles.clayTableContainer} ${t.styles.clay.tableContainer}`}>
                  <View className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className={`border-b ${t.classes.borderSubtle} font-mono text-xs ${t.classes.textMuted}`}
                        >
                          <th className="py-4 px-5">Standing</th>
                          <th className="py-4 px-5">Competitor</th>
                          <th className="py-4 px-5">Team / Org & Region</th>
                          <th className="py-4 px-5 text-right">Titles Won</th>
                          <th className="py-4 px-5 text-right">Matches Won</th>
                          <th className="py-4 px-5 text-right">Win Rate</th>
                          <th className="py-4 px-5 text-right">Circuit Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle/60 text-sm">
                        {tournamentStandings.map((row) => (
                          <tr key={row.id} className="hover:bg-accent-violet/8 transition-colors">
                            <td className="py-3.5 px-5 font-mono font-bold tabular-nums">
                              #{row.rank}
                            </td>
                            <td className="py-3.5 px-5 font-display font-semibold">
                              {row.handle}
                            </td>
                            <td className={`py-3.5 px-5 text-xs ${t.classes.textSecondary}`}>
                              {row.teamName} · {row.region}
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono tabular-nums">
                              {row.tournamentsWon}
                            </td>
                            <td className="py-3.5 px-5 text-right font-mono tabular-nums">
                              {row.matchesWon}
                            </td>
                            <td className={`py-3.5 px-5 text-right font-mono tabular-nums ${t.classes.cyanAccentText}`}>
                              {row.winRate}
                            </td>
                            <td
                              className={`py-3.5 px-5 text-right font-mono font-bold tabular-nums ${t.classes.violetAccentText}`}
                            >
                              {row.tournamentPoints.toLocaleString()} RP
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </View>
                </View>
              </ScrollReveal>
            </View>
          )}
        </View>
      </View>

      {/* Playtest Objectives Modal */}
      {selectedGameModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedGameModal.title} Playtest Brief`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <View className={`w-full max-w-lg p-6 space-y-4 ${t.styles.clay.card}`}>
            <View className="flex items-start justify-between gap-4">
              <View>
                <Text as="p" className={`font-mono text-xs ${t.classes.cyanAccentText}`}>
                  PLAYTEST MISSION BRIEF · {selectedGameModal.buildVersion}
                </Text>
                <Text as="h3" className={`font-display text-xl font-bold mt-1 ${t.classes.textPrimary}`}>
                  {selectedGameModal.title}
                </Text>
              </View>
              <Pressable
                onPress={() => setSelectedGameModal(null)}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${t.classes.secondaryBtn}`}
              >
                Close
              </Pressable>
            </View>

            <Text as="p" className={`text-sm ${t.classes.textSecondary}`}>
              {selectedGameModal.description}
            </Text>

            <View className="space-y-2">
              <Text as="h4" className={`font-mono text-xs font-semibold ${t.classes.textPrimary}`}>
                PRIORITY STUDIO TEST OBJECTIVES:
              </Text>
              <ul className={`space-y-1.5 text-xs ${t.classes.textSecondary} list-disc pl-5`}>
                {selectedGameModal.testObjectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </View>

            <View className="flex justify-end gap-3 pt-3">
              <Pressable
                onPress={() => {
                  const gId = selectedGameModal.id;
                  setSelectedGameModal(null);
                  onOpenNexusRoute('bug-reports', gId);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${t.classes.primaryBtn}`}
              >
                Submit Bug Report for Build
              </Pressable>
            </View>
          </View>
        </div>
      )}

      {/* Tournament Bracket Quick-Inspect Modal */}
      {selectedBracketModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedBracketModal.title} Live Bracket`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <View className={`w-full max-w-xl p-6 space-y-4 ${surfaceStyles.clayCard} ${t.styles.clay.card}`}>
            <View className="flex items-start justify-between gap-4">
              <View>
                <Text as="p" className={`font-mono text-xs ${t.classes.blueAccentText}`}>
                  NEXUS TOURNAMENT BRACKET · {selectedBracketModal.format}
                </Text>
                <Text as="h3" className={`font-display text-xl font-bold mt-1 ${t.classes.textPrimary}`}>
                  {selectedBracketModal.title}
                </Text>
              </View>
              <Pressable
                onPress={() => setSelectedBracketModal(null)}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${t.classes.secondaryBtn}`}
              >
                Close
              </Pressable>
            </View>

            <View className="space-y-3">
              {selectedBracketModal.bracket.map((match) => (
                <View
                  key={match.id}
                  className={`rounded-xl border p-3.5 flex items-center justify-between ${t.classes.surface}`}
                >
                  <View>
                    <Text as="p" className={`font-mono text-[11px] ${t.classes.textMuted}`}>
                      {match.round} · {match.status}
                    </Text>
                    <Text as="p" className={`text-sm font-semibold mt-0.5 ${t.classes.textPrimary}`}>
                      {match.teamA} vs {match.teamB}
                    </Text>
                  </View>
                  <Text as="span" className="font-mono text-sm font-bold tabular-nums text-accent-violet">
                    {match.scoreA} : {match.scoreB}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </div>
      )}
    </>
  );
};
