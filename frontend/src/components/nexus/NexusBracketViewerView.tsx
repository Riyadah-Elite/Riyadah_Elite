import React, { useState } from 'react';
import {
  GitBranch,
  Trophy,
  Users,
  Play,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
  Tv,
  ChevronRight,
} from 'lucide-react';
import { View, Text, Pressable, Image } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface MatchNode {
  id: string;
  round: 'Ro16' | 'Quarterfinals' | 'Semifinals' | 'Grand Finals';
  team1: { name: string; score: number; seed: number; winner?: boolean; logo?: string };
  team2: { name: string; score: number; seed: number; winner?: boolean; logo?: string };
  status: 'LIVE' | 'FINAL' | 'SCHEDULED';
  liveGame?: number;
  mapsPlayed?: string[];
  mvp?: string;
  netcodeServer?: string;
}

export interface NexusBracketViewerProps {
  mode: ThemeMode;
  tournamentId?: string;
  onBackToTournaments?: () => void;
}

export const NexusBracketViewerView: React.FC<NexusBracketViewerProps> = ({
  mode,
  tournamentId = 'apex-winter-invitational',
  onBackToTournaments,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchNode | null>(null);
  const [spectating, setSpectating] = useState(false);

  const bracketData: Record<string, MatchNode[]> = {
    Ro16: [
      {
        id: 'r16-1',
        round: 'Ro16',
        team1: { name: 'Vanguard_Prime', score: 2, seed: 1, winner: true },
        team2: { name: 'Solaris_Gaming', score: 0, seed: 16 },
        status: 'FINAL',
        mapsPlayed: ['Ascent (13-5)', 'Bind (13-7)'],
        mvp: 'GhostRecon',
        netcodeServer: 'Frankfurt Node 04 (128Hz)',
      },
      {
        id: 'r16-2',
        round: 'Ro16',
        team1: { name: 'Desert_Falcons', score: 2, seed: 8, winner: true },
        team2: { name: 'Titan_Forge', score: 1, seed: 9 },
        status: 'FINAL',
        mapsPlayed: ['Sunset (13-11)', 'Split (9-13)', 'Lotus (13-8)'],
        mvp: 'Falcon_Lead',
        netcodeServer: 'Riyadh Node 09 (128Hz)',
      },
    ],
    Quarterfinals: [
      {
        id: 'qf-1',
        round: 'Quarterfinals',
        team1: { name: 'Vanguard_Prime', score: 2, seed: 1, winner: true },
        team2: { name: 'Desert_Falcons', score: 1, seed: 8 },
        status: 'FINAL',
        mapsPlayed: ['Ascent (13-9)', 'Haven (11-13)', 'Bind (13-7)'],
        mvp: 'Nadia_Vanguard (K/D 1.84)',
        netcodeServer: 'Riyadh Node 09 (128Hz)',
      },
      {
        id: 'qf-2',
        round: 'Quarterfinals',
        team1: { name: 'Cyber_Knights', score: 1, seed: 4 },
        team2: { name: 'Neon_Spectres', score: 1, seed: 5 },
        status: 'LIVE',
        liveGame: 3,
        mapsPlayed: ['Split (13-10)', 'Sunset (8-13)', 'Lotus (In Progress 9-9)'],
        netcodeServer: 'Frankfurt Node 04 (128Hz)',
      },
    ],
    Semifinals: [
      {
        id: 'sf-1',
        round: 'Semifinals',
        team1: { name: 'Vanguard_Prime', score: 0, seed: 1 },
        team2: { name: 'TBD (Winner QF2)', score: 0, seed: 0 },
        status: 'SCHEDULED',
        netcodeServer: 'Riyadh Node 09 (128Hz)',
      },
      {
        id: 'sf-2',
        round: 'Semifinals',
        team1: { name: 'Apex_Dynasty', score: 0, seed: 2 },
        team2: { name: 'Iron_Sentinels', score: 0, seed: 3 },
        status: 'SCHEDULED',
        netcodeServer: 'Frankfurt Node 04 (128Hz)',
      },
    ],
    GrandFinals: [
      {
        id: 'gf-1',
        round: 'Grand Finals',
        team1: { name: 'TBD (Finalist A)', score: 0, seed: 0 },
        team2: { name: 'TBD (Finalist B)', score: 0, seed: 0 },
        status: 'SCHEDULED',
        netcodeServer: 'Riyadh Node 09 (128Hz)',
      },
    ],
  };

  return (
    <div className="space-y-6" data-testid="nexus-bracket-viewer-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            {onBackToTournaments ? (
              <button
                type="button"
                onClick={onBackToTournaments}
                className="text-[#94A3B8] hover:text-[#F8FAFC] underline"
              >
                Tournaments
              </button>
            ) : (
              <span>Tournaments</span>
            )}
            <span>/</span>
            <span className="text-[#8B5CF6] font-bold">SCREEN 02</span>
            <span>/</span>
            <span className="text-[#22D3EE]">BRACKET ENGINE 128Hz</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Apex Winter Invitational 2025 · Multi-Stage Bracket Viewer
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="live" value="QF LIVE MATCH #84" />
          <TelemetryPill variant="escrow" value="$25,000 USD ESCROW" />
        </div>
      </div>

      {/* Bracket Stage Container (4-Columns: Ro16 -> QF -> SF -> Finals) */}
      <GlassCard variant="elevated" className="p-6 sm:p-8 overflow-x-auto min-w-[900px]">
        <div className="grid grid-cols-4 gap-6 items-center">
          {/* Column 1: Round of 16 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8] border-b border-[#181C26] pb-2">
              <span className="font-bold text-[#F8FAFC]">ROUND OF 16</span>
              <span className="text-[#64748B]">BO3</span>
            </div>

            <div className="space-y-3">
              {bracketData.Ro16.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] cursor-pointer hover:border-[#8B5CF6]/50 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#64748B] mb-1.5">
                    <span>{match.id.toUpperCase()}</span>
                    <span className="text-[#10B981] font-bold">FINAL</span>
                  </div>

                  <div
                    className={`flex items-center justify-between p-1.5 rounded font-mono text-xs ${
                      match.team1.winner ? 'bg-[#8B5CF6]/20 text-[#F8FAFC] font-bold' : 'text-[#94A3B8]'
                    }`}
                  >
                    <span className="truncate pr-1">#{match.team1.seed} {match.team1.name}</span>
                    <span>{match.team1.score}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-1.5 rounded font-mono text-xs mt-1 ${
                      match.team2.winner ? 'bg-[#8B5CF6]/20 text-[#F8FAFC] font-bold' : 'text-[#94A3B8]'
                    }`}
                  >
                    <span className="truncate pr-1">#{match.team2.seed} {match.team2.name}</span>
                    <span>{match.team2.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Quarterfinals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8] border-b border-[#181C26] pb-2">
              <span className="font-bold text-[#F8FAFC]">QUARTERFINALS</span>
              <span className="text-[#22D3EE] font-bold">BO3 LIVE</span>
            </div>

            <div className="space-y-3">
              {bracketData.Quarterfinals.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-3 rounded-xl bg-[#0B0D12] border cursor-pointer transition-all hover:scale-[1.01] ${
                    match.status === 'LIVE'
                      ? 'border-[#EF4444] shadow-[0_0_16px_rgba(239,68,68,0.3)]'
                      : 'border-[#181C26] hover:border-[#8B5CF6]/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#64748B] mb-1.5">
                    <span>{match.id.toUpperCase()}</span>
                    {match.status === 'LIVE' ? (
                      <span className="text-[#EF4444] font-bold animate-pulse">
                        LIVE · GAME {match.liveGame}
                      </span>
                    ) : (
                      <span className="text-[#10B981] font-bold">FINAL</span>
                    )}
                  </div>

                  <div
                    className={`flex items-center justify-between p-1.5 rounded font-mono text-xs ${
                      match.team1.winner ? 'bg-[#8B5CF6]/20 text-[#F8FAFC] font-bold' : 'text-[#94A3B8]'
                    }`}
                  >
                    <span className="truncate pr-1">#{match.team1.seed} {match.team1.name}</span>
                    <span>{match.team1.score}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between p-1.5 rounded font-mono text-xs mt-1 ${
                      match.team2.winner ? 'bg-[#8B5CF6]/20 text-[#F8FAFC] font-bold' : 'text-[#94A3B8]'
                    }`}
                  >
                    <span className="truncate pr-1">#{match.team2.seed} {match.team2.name}</span>
                    <span>{match.team2.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Semifinals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8] border-b border-[#181C26] pb-2">
              <span className="font-bold text-[#F8FAFC]">SEMIFINALS</span>
              <span className="text-[#8B5CF6]">BO3</span>
            </div>

            <div className="space-y-3">
              {bracketData.Semifinals.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] cursor-pointer hover:border-[#8B5CF6]/50 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between font-mono text-[9px] text-[#64748B] mb-1.5">
                    <span>{match.id.toUpperCase()}</span>
                    <span className="text-[#94A3B8]">SCHEDULED 18:00</span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded font-mono text-xs text-[#CBD5E1]">
                    <span className="truncate pr-1">{match.team1.name}</span>
                    <span>{match.team1.score}</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded font-mono text-xs text-[#64748B] mt-1">
                    <span className="truncate pr-1">{match.team2.name}</span>
                    <span>{match.team2.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Grand Finals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#F59E0B] border-b border-[#181C26] pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>GRAND FINALS</span>
              </span>
              <span>BO5</span>
            </div>

            <div className="space-y-3">
              {bracketData.GrandFinals.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="p-4 rounded-xl bg-[#0B0D12] border border-[#F59E0B]/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#F59E0B] mb-2">
                    <span>CHAMPIONSHIP ARENA</span>
                    <span className="font-bold">$15,000 1ST</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg font-mono text-xs text-[#CBD5E1]">
                    <span>{match.team1.name}</span>
                    <span>{match.team1.score}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg font-mono text-xs text-[#CBD5E1] mt-1">
                    <span>{match.team2.name}</span>
                    <span>{match.team2.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Match Details Drawer Dialog */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B0D12] border border-[#181C26] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#181C26] pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-[#8B5CF6] font-bold">{selectedMatch.round}</span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#22D3EE] font-bold">MATCH {selectedMatch.id.toUpperCase()}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMatch(null);
                  setSpectating(false);
                }}
                className="text-[#64748B] hover:text-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard */}
            <div className="p-4 rounded-xl bg-[#11141C] border border-[#181C26] grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="font-mono text-xs text-[#94A3B8] block">#{selectedMatch.team1.seed}</span>
                <h4 className="font-display text-base font-bold text-[#F8FAFC]">{selectedMatch.team1.name}</h4>
                <span className="font-display text-3xl font-bold text-[#8B5CF6] mt-1 block">{selectedMatch.team1.score}</span>
              </div>

              <div>
                <span className="font-mono text-xs text-[#94A3B8] block">#{selectedMatch.team2.seed}</span>
                <h4 className="font-display text-base font-bold text-[#F8FAFC]">{selectedMatch.team2.name}</h4>
                <span className="font-display text-3xl font-bold text-[#22D3EE] mt-1 block">{selectedMatch.team2.score}</span>
              </div>
            </div>

            {/* Maps breakdown */}
            {selectedMatch.mapsPlayed && (
              <div className="space-y-2">
                <span className="font-mono text-xs text-[#94A3B8] uppercase">MAP RESULTS</span>
                <div className="space-y-1">
                  {selectedMatch.mapsPlayed.map((map, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#11141C] font-mono text-xs text-[#CBD5E1] flex justify-between">
                      <span>Map {idx + 1}</span>
                      <span className="font-semibold text-[#F8FAFC]">{map}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Netcode Node & MVP */}
            <div className="space-y-2">
              {selectedMatch.mvp && (
                <div className="p-3 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-between font-mono text-xs">
                  <span className="text-[#C4B5FD] font-bold">MATCH MVP</span>
                  <span className="text-[#F8FAFC] font-semibold">{selectedMatch.mvp}</span>
                </div>
              )}
              {selectedMatch.netcodeServer && (
                <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#94A3B8]">NETCODE SERVER</span>
                  <span className="text-[#22D3EE] font-bold">{selectedMatch.netcodeServer}</span>
                </div>
              )}
            </div>

            {/* Spectate Simulation */}
            {selectedMatch.status === 'LIVE' && (
              <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#EF4444] animate-pulse" />
                  <span className="font-mono text-xs text-[#EF4444] font-bold">
                    {spectating ? 'Spectating Live Feed (128Hz)' : 'Live Match In Progress'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpectating((s) => !s)}
                  className="px-3 py-1 rounded-lg bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono text-xs font-bold transition-colors"
                >
                  {spectating ? 'Stop Feed' : 'Spectate Live'}
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedMatch(null);
                  setSpectating(false);
                }}
                className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Close Match View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
