import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  GitBranch,
  FileText,
  X,
  Share2,
  Filter,
} from 'lucide-react';
import { View, Text, Pressable, TextInput, Image } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { TournamentItem } from '../../utils/ecosystemRules';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusTournamentListingProps {
  mode: ThemeMode;
  tournaments: TournamentItem[];
  registeredIds: string[];
  onRegister: (id: string) => void;
  onViewBracket: (id: string) => void;
}

export const NexusTournamentListingView: React.FC<NexusTournamentListingProps> = ({
  mode,
  tournaments,
  registeredIds,
  onRegister,
  onViewBracket,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedGame, setSelectedGame] = useState<string>('All Titles');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeringTournament, setRegisteringTournament] = useState<TournamentItem | null>(null);
  const [rulebookTournament, setRulebookTournament] = useState<TournamentItem | null>(null);
  const [squadName, setSquadName] = useState('');
  const [regionNode, setRegionNode] = useState('Riyadh Node (Middle East)');

  const filterTabs = [
    { id: 'all', label: 'All', count: tournaments.length },
    { id: 'open', label: 'Open', count: tournaments.filter((t) => t.status === 'Registration Open').length },
    { id: 'live', label: 'Live Bracket', count: tournaments.filter((t) => t.status === 'Live Bracket').length },
    { id: 'completed', label: 'Completed', count: tournaments.filter((t) => t.status === 'Completed').length },
  ];

  const filteredTournaments = tournaments.filter((item) => {
    if (activeFilter === 'open' && item.status !== 'Registration Open') return false;
    if (activeFilter === 'live' && item.status !== 'Live Bracket') return false;
    if (activeFilter === 'completed' && item.status !== 'Completed') return false;
    if (selectedRegion !== 'All Regions' && !item.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
      return false;
    }
    if (selectedGame !== 'All Titles' && !item.gameTitle.toLowerCase().includes(selectedGame.toLowerCase())) {
      return false;
    }
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.gameTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleConfirmRegistration = () => {
    if (registeringTournament) {
      onRegister(registeringTournament.id);
      setRegisteringTournament(null);
      setSquadName('');
    }
  };

  return (
    <div className="space-y-6" data-testid="nexus-tournament-listing-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#8B5CF6] font-bold">SCREEN 07</span>
            <span>/</span>
            <span className="text-[#22D3EE]">ESPORTS CIRCUIT</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">SANCTIONED ARENAS</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Tournament Discovery &amp; Sanctioned Pro Grid
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="live" value="LIVE QUARTERFINALS" />
          <TelemetryPill variant="escrow" value="$50,000 ESCROW" />
        </div>
      </div>

      {/* Primary Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-[#11141C] border border-[#181C26]">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] ${activeFilter === tab.id ? 'text-white' : 'text-[#64748B]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tournament or title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Secondary Specs Filter Strip (from Stitch tournament-listing-code.html) */}
      <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[#64748B] uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Filter Specs:</span>
          </span>

          {/* Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#0B0D12] text-[#CBD5E1] px-3 py-1.5 rounded-lg border border-[#181C26] focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="All Regions">Region: All Global Servers</option>
            <option value="Riyadh">Region: Middle East (Riyadh)</option>
            <option value="Frankfurt">Region: EU Central (Frankfurt)</option>
            <option value="Virginia">Region: NA East (Virginia)</option>
          </select>

          {/* Game Dropdown */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-[#0B0D12] text-[#CBD5E1] px-3 py-1.5 rounded-lg border border-[#181C26] focus:outline-none focus:border-[#22D3EE]"
          >
            <option value="All Titles">Game: All Titles</option>
            <option value="CyberPulse">Game: CyberPulse: Zero</option>
            <option value="Eclipse">Game: Eclipse Protocol</option>
            <option value="Chrono">Game: Chrono Strike</option>
          </select>
        </div>

        <span className="text-[#94A3B8] text-[11px]">
          Showing: <strong className="text-[#F8FAFC]">{filteredTournaments.length}</strong> Sanctioned Competitions
        </span>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTournaments.map((t) => {
          const isRegistered = registeredIds.includes(t.id);
          const isLive = t.status === 'Live Bracket';

          return (
            <GlassCard key={t.id} variant="elevated" className="overflow-hidden flex flex-col justify-between">
              <div>
                {/* Card Banner Image & Overlay Badges */}
                <div className="relative h-44 w-full bg-[#181C26] overflow-hidden">
                  <Image
                    source={t.bannerUrl || '/assets/generated/tournaments/nexus-championship-cup.png'}
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11141C] via-[#11141C]/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge
                      status={isLive ? 'live' : t.status === 'Registration Open' ? 'open' : 'neutral'}
                      label={t.status}
                    />
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-[#F59E0B]/40 font-mono text-xs font-bold text-[#F59E0B]">
                    {t.prizePool}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                      {t.title}
                    </h3>
                    <p className="font-mono text-xs text-[#22D3EE] mt-0.5">
                      {t.gameTitle} · {t.region}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-[11px]">
                    <div>
                      <span className="text-[#64748B] block">FORMAT</span>
                      <span className="text-[#CBD5E1] font-semibold">{t.format || '5v5 Double Elim'}</span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">SLOTS</span>
                      <span className="text-[#22D3EE] font-bold">
                        {t.slotsFilled} / {t.slotsTotal} Teams
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRulebookTournament(t)}
                    className="text-[11px] font-mono text-[#94A3B8] hover:text-[#8B5CF6] flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Rulebook &amp; Payout Matrix</span>
                  </button>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewBracket(t.id)}
                  className="flex-1 py-2.5 rounded-xl font-mono text-xs font-semibold bg-[#11141C] border border-[#181C26] hover:border-[#8B5CF6]/50 text-[#CBD5E1] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Bracket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegisteringTournament(t)}
                  disabled={isRegistered || t.status === 'Completed'}
                  className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isRegistered
                      ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                      : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Squad Registered</span>
                    </>
                  ) : (
                    <span>Register Squad</span>
                  )}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Squad Registration Modal Dialog */}
      {registeringTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0B0D12] border border-[#181C26] p-6 space-y-5">
            <div>
              <span className="font-mono text-xs text-[#22D3EE] font-bold">SQUAD REGISTRATION</span>
              <h3 className="font-display text-lg font-bold text-[#F8FAFC] mt-1">
                {registeringTournament.title}
              </h3>
              <p className="font-mono text-xs text-[#94A3B8]">
                Prize Pool: {registeringTournament.prizePool} · 128Hz Netcode Server
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-mono text-xs text-[#94A3B8]">SQUAD / ROSTER NAME</label>
                <TextInput
                  value={squadName}
                  onChangeText={setSquadName}
                  placeholder="e.g. Apex Predators KSA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-xs text-[#94A3B8]">SERVER REGION</label>
                <select
                  value={regionNode}
                  onChange={(e) => setRegionNode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] focus:outline-none"
                >
                  <option>Riyadh Node (Middle East)</option>
                  <option>Dubai Node (Middle East)</option>
                  <option>Frankfurt Node (Europe)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRegisteringTournament(null)}
                className="px-4 py-2 rounded-xl font-mono text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRegistration}
                className="px-5 py-2 rounded-xl font-display font-bold text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rulebook & Payouts Modal */}
      {rulebookTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0B0D12] border border-[#181C26] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#181C26] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                  Sanctioned Circuit Rulebook
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRulebookTournament(null)}
                className="text-[#64748B] hover:text-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-[#CBD5E1]">
              <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] space-y-1">
                <span className="text-[#22D3EE] font-bold block">PRIZE POOL DISTRIBUTION</span>
                <div className="flex justify-between">
                  <span>1st Place (Champion)</span>
                  <span className="text-[#F59E0B] font-bold">50% ($25,000 USD)</span>
                </div>
                <div className="flex justify-between">
                  <span>2nd Place (Runner-up)</span>
                  <span className="text-[#F8FAFC]">30% ($15,000 USD)</span>
                </div>
                <div className="flex justify-between">
                  <span>3rd &amp; 4th Place</span>
                  <span className="text-[#94A3B8]">10% each ($5,000 USD)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#11141C] border border-[#181C26] space-y-1">
                <span className="text-[#8B5CF6] font-bold block">INTEGRITY &amp; NETCODE RULES</span>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  All matches are hosted on 128Hz UDP encrypted regional nodes with zero-frame rollback verification. Hardware spoofing or client telemetry tampering triggers immediate disqualification and escrow forfeiture.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setRulebookTournament(null)}
                className="px-5 py-2 rounded-xl font-bold font-mono text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Close Rulebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
