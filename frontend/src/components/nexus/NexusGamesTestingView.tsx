import React, { useState } from 'react';
import {
  Compass,
  Search,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Bug,
} from 'lucide-react';
import { View, Text, Pressable, TextInput, Image } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { GameItem } from '../../utils/ecosystemRules';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusGamesTestingProps {
  mode: ThemeMode;
  games: GameItem[];
  enrolledIds: string[];
  onEnrollGame: (id: string) => void;
  onReportBug: (gameId: string) => void;
}

export const NexusGamesTestingView: React.FC<NexusGamesTestingProps> = ({
  mode,
  games,
  enrolledIds,
  onEnrollGame,
  onReportBug,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Builds' },
    { id: 'Tactical Shooter', label: 'Tactical Shooter' },
    { id: 'Extraction Sci-Fi', label: 'Extraction Sci-Fi' },
    { id: 'Cyber Racing', label: 'Cyber Racing' },
    { id: 'Strategy Arena', label: 'Strategy Arena' },
  ];

  const filteredGames = games.filter((g) => {
    if (activeCategory !== 'all' && g.category !== activeCategory) return false;
    if (
      searchQuery &&
      !g.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !g.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6" data-testid="nexus-games-testing-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#22D3EE] font-bold">QA PIPELINE</span>
            <span>/</span>
            <span className="text-[#8B5CF6]">STUDIO BUILDS</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">ACTIVE COHORTS</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Games Library &amp; Studio Playtest Cohorts
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="netcode" value="6 BUILDS ONLINE" />
          <TelemetryPill variant="escrow" value="BOUNTIES ACTIVE" />
        </div>
      </div>

      {/* Filter Categories & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-[#11141C] border border-[#181C26]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search game or genre..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const isEnrolled = enrolledIds.includes(game.id);

          return (
            <GlassCard key={game.id} variant="elevated" className="overflow-hidden flex flex-col justify-between">
              <div>
                {/* Thumbnail & Badges */}
                <div className="relative h-44 w-full bg-[#181C26] overflow-hidden">
                  <Image
                    source={game.artworkUrl || '/assets/generated/games/eclipse-protocol.png'}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11141C] via-[#11141C]/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status="verified" label={game.testingStatus} />
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md font-mono text-[11px] text-[#CBD5E1]">
                      {game.buildVersion}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 font-mono text-xs font-bold text-[#22D3EE]">
                    +{game.bountyRewardPoints} PTS
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                      {game.title}
                    </h3>
                    <p className="font-mono text-xs text-[#94A3B8] mt-0.5">
                      {game.category} · {game.studio}
                    </p>
                  </div>

                  {/* Active Testers */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-[#94A3B8]">
                      <span>Active QA Cohort</span>
                      <span className="text-[#22D3EE] font-bold">
                        {game.activeTesters} Operatives
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#0B0D12] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]"
                        style={{
                          width: `${Math.min(100, (game.activeTesters / 500) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReportBug(game.id)}
                  className="p-2.5 rounded-xl font-mono text-xs bg-[#11141C] border border-[#181C26] hover:border-[#8B5CF6]/50 text-[#CBD5E1] hover:text-white transition-colors"
                  title="Report Defect for this Build"
                >
                  <Bug className="w-4 h-4 text-[#22D3EE]" />
                </button>

                <button
                  type="button"
                  onClick={() => onEnrollGame(game.id)}
                  className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isEnrolled
                      ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                      : 'bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12]'
                  }`}
                >
                  {isEnrolled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled in Cohort</span>
                    </>
                  ) : (
                    <span>Join Playtest</span>
                  )}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
