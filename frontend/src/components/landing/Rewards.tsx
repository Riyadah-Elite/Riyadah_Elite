import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


export function Rewards() {
  const tiers = [
    {
      title: 'Playtester Gold Coins',
      token: '🪙 250 Coins / Bug',
      desc: 'Earn verified credit tokens for approved bug reports and stress-testing milestones.',
      image: '/assets/gamification/card_coin_token.png',
      badge: 'TOKEN REWARD',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      perk: 'Convertible to store credits',
    },
    {
      title: 'Studio Alpha Crystal Keys',
      token: '💎 Priority Access',
      desc: 'Exclusive access keys to private alphas before games are publicly announced.',
      image: '/assets/gamification/card_gem_token.png',
      badge: 'EARLY PASS',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      perk: 'Day-0 studio builds',
    },
    {
      title: 'Championship Trophies',
      token: '🏆 Podium Honors',
      desc: 'Profile trophy badges, podium certificates, and seasonal leaderboard recognition.',
      image: '/assets/tournaments/trophy_blue_3d.png',
      badge: 'COMPETITIVE',
      badgeColor: 'bg-violet-100 text-violet-900 border-violet-200',
      perk: 'Official bracket medals',
    },
    {
      title: 'Lightning Hardware Perks',
      token: '⚡ Pro Peripherals',
      desc: 'Physical gaming peripherals and partner swag awarded to top monthly contributors.',
      image: '/assets/gamification/card_energy_token.png',
      badge: 'PHYSICAL GEAR',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      perk: 'Shipped to your doorstep',
    },
  ];

  return (
    <section id="rewards" className="w-full py-24 px-6 md:px-12 bg-gradient-to-b from-white to-[#F8FCFF] border-t border-neutral-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Ionicons name="gift-outline" size={14} color="#D97706" />
            TRANSPARENT VALUE RETURN
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight mb-4">
            Rewarding Every Valid Contribution
          </h2>
          <p className="text-base text-[#5B7083] leading-relaxed">
            Developers build better games through your commitment. Riyadah Elite ensures your time, bugs discovered, and tournament victories are genuinely acknowledged.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-50 overflow-hidden flex items-center justify-center border border-neutral-200/80 shadow-xs">
                    <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </div>

                <span className="font-mono text-xs font-bold text-[#0891B2] block mb-1">
                  {t.token}
                </span>
                <h3 className="font-black text-lg text-[#172B3A] mb-2 tracking-tight">{t.title}</h3>
                <p className="text-xs text-[#5B7083] leading-relaxed mb-6">{t.desc}</p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-[#5B7083]">
                <span>{t.perk}</span>
                <a href="#community" className="text-[#0891B2] font-bold hover:underline">Claim →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

