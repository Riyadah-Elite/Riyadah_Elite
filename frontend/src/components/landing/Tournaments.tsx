import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function Tournaments() {
  const tournaments = [
    {
      title: 'Apex Masters Series — Seasonal Major',
      format: 'Double Elimination • 32 Squads',
      game: 'Tactical Shooter',
      date: 'Saturday, Nov 14 • 18:00 AST (UTC+3)',
      prize: 'Tier-1 Studio Pool',
      prizeDetail: 'Official Cash Pool & Hardware Trophies',
      status: 'Open Registration',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badge: 'TIER 1 MAJOR',
      image: '/assets/tournaments/trophy_blue_3d.png',
    },
    {
      title: 'Riyadah Regional Invitational Cup',
      format: 'Group Stage into Single Elimination',
      game: 'Combat Arena',
      date: 'Friday, Nov 20 • 20:00 AST (UTC+3)',
      prize: 'Pro Gear & Medals',
      prizeDetail: 'Podium Honors & Hardware Peripherals',
      status: 'Squad Queues',
      statusColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      badge: 'REGIONAL CUP',
      image: '/assets/gamification/trophy_3d.png',
    },
    {
      title: 'Nitro Drift Championship — Weekly Cup',
      format: 'Time Attack & 1v1 Tandem Runs',
      game: 'Sim Racing',
      date: 'Every Friday • 19:00 AST (UTC+3)',
      prize: 'Weekly Credits',
      prizeDetail: 'Playtest Credits & Seasonal Points',
      status: 'Open Ladder',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: 'WEEKLY LADDER',
      image: '/assets/hardware/handheld_console.png',
    },
  ];

  return (
    <section id="tournaments" className="w-full py-24 px-6 md:px-12 bg-white border-t border-neutral-100 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-100/30 via-cyan-100/20 to-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-900 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Ionicons name="trophy-outline" size={14} color="#8B5CF6" />
            COMPETITIVE ESPORTS & SHOWCASES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight mb-4">
            Riyadah Elite Championship Tournaments
          </h2>
          <p className="text-base sm:text-lg text-[#5B7083] leading-relaxed">
            Compete against elite community squads, showcase playtest mastery, and earn official podium status with live broadcasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tournaments.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-neutral-200/90 bg-gradient-to-b from-[#F8FCFF] to-white p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 shadow-2xs shrink-0">
                      <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#172B3A] text-white">
                      {t.badge}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${t.statusColor}`}>
                    {t.status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#172B3A] mb-2 tracking-tight group-hover:text-[#0891B2] transition-colors">
                  {t.title}
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-400 block mb-4">{t.format}</span>

                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 mb-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#5B7083]">
                    <Ionicons name="calendar-outline" size={15} color="#0891B2" />
                    <span className="font-mono">{t.date}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-xs text-[#5B7083] font-medium">Prize Pool:</span>
                    <div className="text-right">
                      <span className="text-base font-mono font-black text-[#D97706] block">{t.prize}</span>
                      <span className="text-[10px] text-neutral-400 font-semibold">{t.prizeDetail}</span>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#community"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#172B3A] hover:bg-[#0891B2] text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Register Squad via Discord</span>
                <Ionicons name="arrow-forward" size={14} color="white" />
              </a>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
