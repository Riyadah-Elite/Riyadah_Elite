import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/context/AuthContext';

export interface TournamentItem {
  id: string;
  title: string;
  format: string;
  game: string;
  date: string;
  prizePool: string;
  prizeDetail: string;
  status: string;
  statusColor: string;
  badge: string;
  image: string;
  isOpen: boolean;
}

export function Tournaments() {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [registeredTournaments, setRegisteredTournaments] = useState<Record<string, boolean>>({});

  const tournaments: TournamentItem[] = [
    {
      id: 'apex-masters',
      title: 'Apex Masters Series — Seasonal Major',
      format: 'Double Elimination • 32 Squads',
      game: 'Tactical Shooter',
      date: 'Saturday, Nov 14 • 18:00 AST (UTC+3)',
      prizePool: 'Tier-1 Studio Pool',
      prizeDetail: 'Official Cash Pool & Hardware Trophies',
      status: 'Open Registration',
      statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'TIER 1 MAJOR',
      image: '/assets/tournaments/trophy_blue_3d.png',
      isOpen: true,
    },
    {
      id: 'regional-invitational',
      title: 'Riyadah Regional Invitational Cup',
      format: 'Group Stage into Single Elimination',
      game: 'Combat Arena',
      date: 'Friday, Nov 20 • 20:00 AST (UTC+3)',
      prizePool: 'Pro Gear & Medals',
      prizeDetail: 'Podium Honors & Hardware Peripherals',
      status: 'Squad Queues Open',
      statusColor: 'bg-cyan-50 text-[#08A8C8] border-cyan-200',
      badge: 'REGIONAL CUP',
      image: '/assets/gamification/trophy_3d.png',
      isOpen: true,
    },
    {
      id: 'nitro-drift',
      title: 'Nitro Drift Championship — Weekly Cup',
      format: 'Time Attack & 1v1 Tandem Runs',
      game: 'Sim Racing',
      date: 'Every Friday • 19:00 AST (UTC+3)',
      prizePool: 'Weekly Credits',
      prizeDetail: 'Playtest Credits & Seasonal Points',
      status: 'Open Ladder',
      statusColor: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'WEEKLY LADDER',
      image: '/assets/hardware/handheld_console.png',
      isOpen: true,
    },
  ];

  const handleRegisterClick = (t: TournamentItem) => {
    if (!t.isOpen) return;

    if (!isAuthenticated) {
      // Gate registration with authentication, preserving tournament context
      openAuthModal({
        mode: 'login',
        tournamentContext: t.title,
        onAuthenticated: () => {
          setRegisteredTournaments((prev) => ({ ...prev, [t.id]: true }));
        },
      });
    } else {
      // Authenticated user directly registers
      setRegisteredTournaments((prev) => ({ ...prev, [t.id]: true }));
    }
  };

  return (
    <section id="tournaments" className="w-full py-20 px-6 md:px-12 bg-white border-t border-[#DCE8F0] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-100/25 via-cyan-100/20 to-sky-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 border border-violet-200 text-[#8057F5] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Ionicons name="trophy-outline" size={14} color="#8057F5" />
              COMPETITIVE ESPORTS & SHOWCASES
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#14283A] tracking-tight">
              Upcoming Tournaments
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <p className="text-sm text-[#647B91] max-w-md leading-relaxed">
              Compete against elite community squads, showcase playtest mastery, and earn official podium honors with live coverage.
            </p>
            <a
              href="#tournaments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8057F5] hover:text-[#6A3FF0] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>View All Tournaments ({tournaments.length})</span>
              <Ionicons name="arrow-forward" size={14} color="#8057F5" />
            </a>
          </div>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tournaments.map((t) => {
            const isRegistered = registeredTournaments[t.id];

            return (
              <div
                key={t.id}
                className="rounded-3xl border border-[#DCE8F0] bg-gradient-to-b from-[#F4FAFE] to-white p-7 flex flex-col justify-between shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#DCE8F0] shadow-2xs shrink-0 bg-white">
                        <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#14283A] text-white">
                        {t.badge}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#14283A] mb-1 tracking-tight group-hover:text-[#08A8C8] transition-colors">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-[#08A8C8]">{t.game}</span>
                    <span className="text-[#DCE8F0]">•</span>
                    <span className="text-xs font-mono text-[#647B91]">{t.format}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#DCE8F0] mb-6 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs text-[#647B91]">
                      <Ionicons name="calendar-outline" size={15} color="#08A8C8" />
                      <span className="font-mono">{t.date}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-xs text-[#647B91] font-medium">Prize Category:</span>
                      <div className="text-right">
                        <span className="text-sm font-mono font-black text-[#14283A] block">{t.prizePool}</span>
                        <span className="text-[10px] text-[#647B91] font-semibold">{t.prizeDetail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {isRegistered ? (
                    <div className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2 shadow-xs">
                      <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                      <span>Roster Registered ({user?.username || 'You'})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRegisterClick(t)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#14283A] hover:bg-[#08A8C8] text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer shadow-md shadow-neutral-900/10"
                    >
                      <Ionicons name="trophy-outline" size={15} color="white" />
                      <span>{isAuthenticated ? 'Register Squad Roster' : 'Sign In to Register'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
