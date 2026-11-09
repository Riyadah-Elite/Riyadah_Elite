import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Users,
  Shield,
  Star,
  CheckCircle2,
  Hourglass,
  Flag,
  ArrowRight,
  User,
} from 'lucide-react';
import { View, Text, Pressable } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { TesterRankingEntry, splitLeaderboardPodium } from '../../utils/ecosystemRules';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusLeaderboardProps {
  mode: ThemeMode;
  rankings?: TesterRankingEntry[];
  onStartTesting?: () => void;
}

export const NexusLeaderboardView: React.FC<NexusLeaderboardProps> = ({
  mode,
  rankings = [
    { rank: 1, id: 'r1', handle: 'KRONOS_99', roleTitle: 'Lead QA Specialist', tier: 'Apex Verifier', reputationPoints: 3490, verifiedBugs: 68, criticalBugs: 18, playtestsCompleted: 42, reproductionAccuracy: '99.4%' },
    { rank: 2, id: 'r2', handle: 'Vex_Nine', roleTitle: 'Senior Engine Analyst', tier: 'Senior Analyst', reputationPoints: 2840, verifiedBugs: 42, criticalBugs: 11, playtestsCompleted: 31, reproductionAccuracy: '98.5%' },
    { rank: 3, id: 'r3', handle: 'Neutron', roleTitle: 'Core Playtester', tier: 'Core Playtester', reputationPoints: 2610, verifiedBugs: 37, criticalBugs: 9, playtestsCompleted: 27, reproductionAccuracy: '97.8%' },
    { rank: 4, id: 'r4', handle: 'ZeroSignal', roleTitle: 'Core Playtester', tier: 'Core Playtester', reputationPoints: 2410, verifiedBugs: 32, criticalBugs: 7, playtestsCompleted: 24, reproductionAccuracy: '96.5%' },
    { rank: 5, id: 'r5', handle: 'EchoShift', roleTitle: 'Core Playtester', tier: 'Core Playtester', reputationPoints: 2180, verifiedBugs: 28, criticalBugs: 6, playtestsCompleted: 19, reproductionAccuracy: '95.2%' },
  ],
  onStartTesting,
}) => {
  const [track, setTrack] = useState<'qa' | 'esports'>('qa');
  const [leaderboardState, setLeaderboardState] = useState<'active' | 'empty'>('active');

  const { podium, remaining } = splitLeaderboardPodium(rankings);

  return (
    <div className="space-y-6" data-testid="nexus-leaderboard-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#8B5CF6] font-bold">LADDER TELEMETRY</span>
            <span>/</span>
            <span className="text-[#22D3EE]">RANK LEADERBOARD SPECTRUM</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">AUDITABLE NODES</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Global QA &amp; Competitive Match Standings
          </h1>
        </div>

        {/* State Toggle & Telemetry Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#11141C] p-1 rounded-xl border border-[#181C26]">
            <button
              type="button"
              onClick={() => setLeaderboardState('active')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                leaderboardState === 'active'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              STATE A: ACTIVE
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardState('empty')}
              className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                leaderboardState === 'empty'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              STATE B: EMPTY
            </button>
          </div>

          <TelemetryPill variant="netcode" value="AUDITED LIVE" />
          <TelemetryPill variant="escrow" value="WEEKLY PAYOUTS" />
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#11141C] border border-[#181C26] max-w-fit">
        <button
          type="button"
          onClick={() => setTrack('qa')}
          className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors ${
            track === 'qa'
              ? 'bg-[#8B5CF6] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          QA Defect Bounties
        </button>
        <button
          type="button"
          onClick={() => setTrack('esports')}
          className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors ${
            track === 'esports'
              ? 'bg-[#8B5CF6] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          Esports Match Circuit
        </button>
      </div>

      {leaderboardState === 'active' ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top-3 Podium Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
            {/* Rank 2 (Silver) */}
            {podium[1] && (
              <GlassCard className="p-6 text-center space-y-3 border-[#94A3B8]/40 md:order-1">
                <span className="w-8 h-8 rounded-full bg-[#94A3B8]/20 text-[#CBD5E1] font-mono text-xs font-bold mx-auto flex items-center justify-center">
                  #2 SILVER
                </span>
                <div className="w-12 h-12 rounded-full bg-[#181C26] mx-auto flex items-center justify-center font-display font-bold text-base text-[#F8FAFC]">
                  {podium[1].handle.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#F8FAFC]">{podium[1].handle}</h3>
                  <span className="font-mono text-xs text-[#22D3EE] font-semibold">{podium[1].tier}</span>
                </div>
                <div className="font-display text-xl font-bold text-[#F8FAFC]">
                  {podium[1].reputationPoints} <span className="font-mono text-xs text-[#94A3B8]">PTS</span>
                </div>
                <span className="font-mono text-[11px] text-[#10B981] block">
                  {podium[1].reproductionAccuracy} Accuracy · {podium[1].verifiedBugs} Bugs
                </span>
              </GlassCard>
            )}

            {/* Rank 1 (Gold - Elevated & Prominent) */}
            {podium[0] && (
              <GlassCard
                variant="glow"
                className="p-8 text-center space-y-3 border-[#F59E0B]/50 shadow-[0_0_32px_rgba(245,158,11,0.25)] md:order-2 md:-mt-4"
              >
                <div className="px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px] font-extrabold uppercase inline-block mx-auto border border-[#F59E0B]/40">
                  #1 GOLD · GRAND CHAMPION
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] p-0.5 mx-auto">
                  <div className="w-full h-full rounded-2xl bg-[#0B0D12] flex items-center justify-center text-[#F59E0B]">
                    <Trophy className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[#F8FAFC] mt-0.5">
                    {podium[0].handle}
                  </h3>
                  <span className="font-mono text-xs text-[#8B5CF6] font-semibold">
                    {podium[0].tier}
                  </span>
                </div>
                <div className="font-display text-3xl font-extrabold text-[#F8FAFC]">
                  {podium[0].reputationPoints} <span className="font-mono text-xs text-[#22D3EE]">PTS</span>
                </div>
                <span className="font-mono text-xs text-[#10B981] block font-semibold">
                  {podium[0].reproductionAccuracy} Accuracy · {podium[0].verifiedBugs} Bugs Verified
                </span>
              </GlassCard>
            )}

            {/* Rank 3 (Bronze) */}
            {podium[2] && (
              <GlassCard className="p-6 text-center space-y-3 border-[#B45309]/40 md:order-3">
                <span className="w-8 h-8 rounded-full bg-[#B45309]/20 text-[#F59E0B] font-mono text-xs font-bold mx-auto flex items-center justify-center">
                  #3 BRONZE
                </span>
                <div className="w-12 h-12 rounded-full bg-[#181C26] mx-auto flex items-center justify-center font-display font-bold text-base text-[#F8FAFC]">
                  {podium[2].handle.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[#F8FAFC]">{podium[2].handle}</h3>
                  <span className="font-mono text-xs text-[#22D3EE] font-semibold">{podium[2].tier}</span>
                </div>
                <div className="font-display text-xl font-bold text-[#F8FAFC]">
                  {podium[2].reputationPoints} <span className="font-mono text-xs text-[#94A3B8]">PTS</span>
                </div>
                <span className="font-mono text-[11px] text-[#10B981] block">
                  {podium[2].reproductionAccuracy} Accuracy · {podium[2].verifiedBugs} Bugs
                </span>
              </GlassCard>
            )}
          </div>

          {/* Remaining Leaderboard Rows Table */}
          {remaining.length > 0 && (
            <GlassCard className="overflow-hidden">
              <div className="p-4 bg-[#0B0D12] border-b border-[#181C26] font-mono text-xs text-[#94A3B8] grid grid-cols-12 gap-4">
                <span className="col-span-1">RANK</span>
                <span className="col-span-5">OPERATIVE</span>
                <span className="col-span-2 text-right">ACCURACY</span>
                <span className="col-span-2 text-right">VERIFIED BUGS</span>
                <span className="col-span-2 text-right">POINTS</span>
              </div>

              <div className="divide-y divide-[#181C26]">
                {remaining.map((row) => (
                  <div
                    key={row.handle}
                    className="p-4 font-mono text-xs text-[#CBD5E1] grid grid-cols-12 gap-4 items-center hover:bg-[#181C26]/40 transition-colors"
                  >
                    <span className="col-span-1 font-bold text-[#94A3B8]">#{row.rank}</span>
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="font-display text-xs font-semibold text-[#F8FAFC]">
                        {row.handle}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#181C26] text-[#8B5CF6]">
                        {row.tier}
                      </span>
                    </div>
                    <span className="col-span-2 text-right text-[#10B981]">
                      {row.reproductionAccuracy}
                    </span>
                    <span className="col-span-2 text-right">{row.verifiedBugs}</span>
                    <span className="col-span-2 text-right font-bold text-[#22D3EE]">
                      {row.reputationPoints} PTS
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      ) : (
        /* STATE B: EMPTY LEADERBOARD STATE (from Stitch dashboard-hub/code.html) */
        <GlassCard className="p-10 text-center space-y-6 animate-fade-in border-dashed border-[#181C26]">
          <div className="flex items-center justify-between border-b border-[#181C26] pb-3">
            <div className="flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-[#8B5CF6]" />
              <span className="font-display text-sm font-bold text-[#F8FAFC]">
                New Ladder Tier · Qualifiers Standby
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#94A3B8] uppercase">RESET CYCLE</span>
          </div>

          {/* Ghost Podium Illustration (3 faded silhouettes from Stitch) */}
          <div className="flex items-end justify-center gap-6 py-6 opacity-35">
            <div className="w-20 h-28 rounded-t-xl bg-[#181C26] flex flex-col items-center justify-center gap-2 border border-white/5">
              <User className="w-8 h-8 text-[#94A3B8]" />
              <span className="font-mono text-xs text-[#94A3B8] font-bold">#2</span>
            </div>
            <div className="w-24 h-36 rounded-t-xl bg-[#1F2433] flex flex-col items-center justify-center gap-2 border border-[#8B5CF6]/20">
              <Trophy className="w-10 h-10 text-[#8B5CF6]" />
              <span className="font-mono text-xs text-[#8B5CF6] font-bold">#1</span>
            </div>
            <div className="w-20 h-24 rounded-t-xl bg-[#181C26] flex flex-col items-center justify-center gap-2 border border-white/5">
              <User className="w-8 h-8 text-[#94A3B8]" />
              <span className="font-mono text-xs text-[#94A3B8] font-bold">#3</span>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
              No ranked players recorded yet
            </h3>
            <p className="font-mono text-xs text-[#94A3B8] leading-relaxed">
              Be the vanguard of this competitive testing circuit. Log your first bug or complete your first telemetry trial to claim Rank #1.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartTesting}
            className="px-6 py-3 rounded-xl bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] inline-flex items-center gap-2"
          >
            <Flag className="w-4 h-4" />
            <span>Start Telemetry Testing</span>
          </button>
        </GlassCard>
      )}
    </div>
  );
};
