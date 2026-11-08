import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Trophy,
  Bug,
  MessageSquare,
  ArrowRight,
  Activity,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Lock,
  DollarSign,
  Radar,
  Rocket,
  Flame,
} from 'lucide-react';
import { View, Text, Pressable, Image } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { GameItem, TournamentItem, BugReportItem, TesterRankingEntry } from '../../utils/ecosystemRules';
import { TelemetryPill } from '../common/TelemetryPill';
import { StatusBadge } from '../common/StatusBadge';
import { GlassCard } from '../common/GlassCard';
import surfaceStyles from '../../styles/SurfaceEffects.module.css';

export interface NexusDashboardViewProps {
  mode: ThemeMode;
  user: {
    handle: string;
    email: string;
    role: string;
    tier: string;
  };
  games: GameItem[];
  tournaments: TournamentItem[];
  bugReports: BugReportItem[];
  testerRankings: TesterRankingEntry[];
  enrolledGameIds: string[];
  registeredTournamentIds: string[];
  onNavigate: (route: string) => void;
  onEnrollGame: (id: string) => void;
}

export const NexusDashboardView: React.FC<NexusDashboardViewProps> = ({
  mode,
  user,
  games,
  tournaments,
  bugReports,
  testerRankings,
  enrolledGameIds,
  registeredTournamentIds,
  onNavigate,
  onEnrollGame,
}) => {
  const spotlightGame = games[0] || {
    id: 'game-eclipse-protocol',
    slug: 'eclipse-protocol',
    title: 'Eclipse Protocol',
    studio: 'Vanguard Interactive',
    category: 'Extraction Sci-Fi',
    platforms: ['PC', 'PS5'],
    description: 'Squad-based tactical extraction shooter',
    testingStatus: 'Bug Bounty Active',
    buildVersion: 'v0.9.4-RC2',
    activeTesters: 428,
    verifiedBugsResolved: 164,
    bountyRewardPoints: 250,
    artworkUrl: '/assets/generated/games/eclipse-protocol.png',
    testObjectives: [],
  };

  const activeTournament = tournaments[0] || {
    id: 'nexus-championship-cup',
    title: 'Apex Winter Invitational 2025',
    gameTitle: 'CyberPulse: Zero',
    date: '2026-11-20',
    registrationDeadline: '2026-11-18',
    prizePool: '$50,000 USD',
    slotsFilled: 16,
    slotsTotal: 16,
    format: '5v5 Double Elimination',
    region: 'Middle East (Riyadh Node 09)',
    status: 'Live Bracket' as const,
    bannerUrl: '/assets/generated/tournaments/nexus-championship-cup.png',
    bracket: [],
  };

  const isEnrolled = enrolledGameIds.includes(spotlightGame.id);

  return (
    <div className="space-y-8" data-testid="nexus-dashboard-view">
      {/* SECTION 1: HIGH-VOLTAGE HERO BAND ("Play. Test. Win." from Stitch dashboard-hub/code.html) */}
      <GlassCard variant="glow" className="p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#22D3EE]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181C26] border border-[#22D3EE]/30">
              <Zap className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span className="font-mono text-[11px] font-bold text-[#22D3EE] tracking-widest uppercase">
                NEXT-GEN ESPORTS &amp; QA TELEMETRY
              </span>
            </div>

            {/* Display H1 */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight uppercase leading-none">
              Play. <span className="text-[#8B5CF6]">Test.</span> <span className="text-[#22D3EE]">Win.</span>
            </h1>

            <p className="font-mono text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Join sanctioned tournaments, test unreleased AAA competitive game builds, stress-test 128Hz netcodes, and claim real-time escrow bounty rewards.
            </p>

            {/* Dual High-Voltage CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('games')}
                className="px-6 py-3 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(34,211,238,0.35)] flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Start Testing</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('tournaments')}
                className="px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Browse Tournaments</span>
              </button>
            </div>
          </div>

          {/* Quick-Profile Interactive Preview Card (Stitch Claymorphic Pill) */}
          <div className="w-full lg:w-72 bg-[#0B0D12]/90 border border-[#181C26] p-5 rounded-3xl shadow-[inset_-4px_-4px_12px_rgba(0,0,0,0.5),inset_4px_4px_12px_rgba(255,255,255,0.04),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider">
                Active Operative Node
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold">
                ONLINE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-0.5 shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#0B0D12] flex items-center justify-center font-display font-bold text-white text-base">
                  {user.handle.charAt(0)}
                </div>
              </div>
              <div className="truncate">
                <span className="font-display text-sm font-bold text-[#F8FAFC] block truncate">
                  {user.handle}
                </span>
                <span className="font-mono text-[10px] text-[#22D3EE] font-bold">
                  TIER 1 PRO APEX
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#181C26] space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">BOUNTY WALLET</span>
                <span className="text-[#F59E0B] font-bold">$4,850 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">REPUTATION</span>
                <span className="text-[#10B981] font-bold">99.2% PRO</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS TICKER BAR (From Stitch dashboard-hub/code.html lines 135-165) */}
        <div className="mt-8 pt-6 border-t border-[#181C26] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0B0D12]/70 border border-[#181C26]">
            <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/15 text-[#22D3EE] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-[#F8FAFC] block leading-tight">
                $142,500
              </span>
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                Distributed Bounties
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0B0D12]/70 border border-[#181C26]">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-[#F8FAFC] block leading-tight">
                2,480
              </span>
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                Active Testers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-[#0B0D12]/70 border border-[#181C26]">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center shrink-0">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-[#F8FAFC] block leading-tight">
                38
              </span>
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                Live Game Builds
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: FEATURED 3D GAME KEY ART ROW (Stake-style 3D Tiles from Stitch dashboard-hub/code.html) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#8B5CF6]" />
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              Featured Test Arenas
            </h2>
          </div>
          <Pressable
            onPress={() => onNavigate('games')}
            className="font-mono text-xs text-[#22D3EE] hover:underline flex items-center gap-1"
          >
            <span>View All 38 Builds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Pressable>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tile 1: CYBERPULSE: ZERO */}
          <GlassCard variant="elevated" className="overflow-hidden group flex flex-col justify-between">
            <div className="relative h-52 w-full bg-[#181C26] overflow-hidden">
              <Image
                source="/assets/images/games/cyberpulse.png"
                alt="CyberPulse: Zero"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11141C] via-[#11141C]/30 to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#22D3EE] text-[#0B0D12] font-mono text-[10px] font-extrabold uppercase shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                Test Build
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md font-mono text-[9px] text-[#8B5CF6] tracking-widest font-bold">
                ART // 3D RENDER
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#22D3EE] uppercase font-bold tracking-wider">
                    FPS / Tactical Arena
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#F8FAFC] leading-none">
                    CYBERPULSE: ZERO
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px]">PRIZE POOL</span>
                  <span className="text-[#F59E0B] font-bold">$25,000 USD</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">TELEMETRY LOGS</span>
                  <span className="text-[#22D3EE] font-bold">14 Bugs Logged</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-[#94A3B8]">
                  v0.8.4 Alpha · Unreal Engine 5.4.2
                </span>
                <button
                  type="button"
                  onClick={() => onEnrollGame('game-cyberpulse-zero')}
                  className="px-4 py-2 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12] font-display font-bold text-xs"
                >
                  Test Build
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Tile 2: VOID RUNNER 2099 */}
          <GlassCard variant="elevated" className="overflow-hidden group flex flex-col justify-between">
            <div className="relative h-52 w-full bg-[#181C26] overflow-hidden">
              <Image
                source="/assets/images/games/void-runner.png"
                alt="Void Runner 2099"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11141C] via-[#11141C]/30 to-transparent" />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#8B5CF6] text-white font-mono text-[10px] font-extrabold uppercase shadow-[0_0_12px_rgba(139,92,246,0.5)]">
                Join Arena
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md font-mono text-[9px] text-[#22D3EE] tracking-widest font-bold">
                ART // 3D RENDER
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#8B5CF6] uppercase font-bold tracking-wider">
                    Speedrun Platformer
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-[#F8FAFC] leading-none">
                    VOID RUNNER 2099
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px]">PRIZE POOL</span>
                  <span className="text-[#F59E0B] font-bold">$12,500 USD</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px]">OPEN TESTING QUESTS</span>
                  <span className="text-[#8B5CF6] font-bold">8 Open Tasks</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[11px] text-[#94A3B8]">
                  Tickrate: 128Hz · Crossplay Test
                </span>
                <button
                  type="button"
                  onClick={() => onEnrollGame('game-void-runner')}
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-display font-bold text-xs"
                >
                  Join Arena
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* SECTION 3: SPOTLIGHT COHORT & LIVE TOURNAMENT ARENA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Spotlight Game Cohort Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#22D3EE]" />
              <span>Active Playtesting Cohort</span>
            </h2>
            <Pressable
              onPress={() => onNavigate('games')}
              className="text-xs font-mono text-[#22D3EE] hover:underline"
            >
              View All Builds →
            </Pressable>
          </div>

          <GlassCard variant="elevated" className="overflow-hidden">
            <div className="relative h-48 sm:h-56 w-full bg-[#181C26] overflow-hidden">
              <Image
                source={spotlightGame.artworkUrl}
                alt={spotlightGame.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11141C] via-[#11141C]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <StatusBadge status="verified" label={spotlightGame.testingStatus} />
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md font-mono text-xs text-[#CBD5E1] border border-white/10">
                  {spotlightGame.buildVersion}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC]">
                    {spotlightGame.title}
                  </h3>
                  <p className="font-mono text-xs text-[#94A3B8]">
                    {spotlightGame.category} · {spotlightGame.studio}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs text-[#94A3B8] block">QA BOUNTY REWARD</span>
                  <span className="font-mono text-sm font-bold text-[#22D3EE]">
                    +{spotlightGame.bountyRewardPoints} PTS
                  </span>
                </div>
              </div>

              {/* Progress bar of active testers */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs text-[#94A3B8]">
                  <span>Active Testers</span>
                  <span className="text-[#F8FAFC] font-semibold">
                    {spotlightGame.activeTesters} Active
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0B0D12] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]"
                    style={{
                      width: `${Math.min(100, (spotlightGame.activeTesters / 500) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Pressable
                  onPress={() => onNavigate('bug-reports')}
                  className="text-xs font-mono text-[#A78BFA] hover:underline flex items-center gap-1.5"
                >
                  <Bug className="w-4 h-4" />
                  <span>Report Cohort Defect</span>
                </Pressable>

                <Pressable
                  onPress={() => onEnrollGame(spotlightGame.id)}
                  testID="dashboard-enroll-game-btn"
                  className={`px-5 py-2.5 rounded-xl font-display font-semibold text-xs transition-colors flex items-center gap-2 ${
                    isEnrolled
                      ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                      : 'bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12]'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Enrolled in Cohort</span>
                    </>
                  ) : (
                    <>
                      <span>Join Playtest</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Pressable>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Live Tournament & Quick Shortcuts Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Tournament Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#8B5CF6]" />
                <span>Featured Tournament</span>
              </h2>
              <Pressable
                onPress={() => onNavigate('tournaments')}
                className="text-xs font-mono text-[#8B5CF6] hover:underline"
              >
                Brackets →
              </Pressable>
            </div>

            <GlassCard variant="elevated" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <StatusBadge status="live" label="QUARTERFINALS LIVE" />
                <span className="font-mono text-xs font-bold text-[#F59E0B]">
                  {activeTournament.prizePool}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  {activeTournament.title}
                </h3>
                <p className="font-mono text-xs text-[#94A3B8] mt-0.5">
                  {activeTournament.gameTitle} · {activeTournament.format}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#181C26] flex items-center justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Registered Teams</span>
                <span className="text-[#22D3EE] font-bold">
                  {activeTournament.slotsFilled} / {activeTournament.slotsTotal} Teams
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Pressable
                  onPress={() => onNavigate('bracket-viewer')}
                  testID="dashboard-bracket-btn"
                  className="flex-1 py-2.5 rounded-xl font-display font-semibold text-xs text-center bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm"
                >
                  Interactive Bracket
                </Pressable>

                <Pressable
                  onPress={() => onNavigate('chat')}
                  testID="dashboard-chat-btn"
                  className="px-3.5 py-2.5 rounded-xl font-mono text-xs border border-[#181C26] hover:border-[#8B5CF6]/40 text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-[#22D3EE]" />
                  <span>Dev Chat</span>
                </Pressable>
              </div>
            </GlassCard>
          </div>

          {/* Quick Action Dock */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
              OPERATIVE SHORTCUTS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Pressable
                onPress={() => onNavigate('bug-reports')}
                className="p-3.5 rounded-xl bg-[#11141C] border border-[#181C26] hover:border-[#22D3EE]/50 transition-colors flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-[#22D3EE]/15 text-[#22D3EE]">
                  <Bug className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-display text-xs font-semibold text-[#F8FAFC] block">
                    Submit Defect
                  </span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">Crash Logs</span>
                </div>
              </Pressable>

              <Pressable
                onPress={() => onNavigate('chat')}
                className="p-3.5 rounded-xl bg-[#11141C] border border-[#181C26] hover:border-[#8B5CF6]/50 transition-colors flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-display text-xs font-semibold text-[#F8FAFC] block">
                    Live Desync Replay
                  </span>
                  <span className="font-mono text-[10px] text-[#94A3B8]">128Hz Netcode</span>
                </div>
              </Pressable>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
