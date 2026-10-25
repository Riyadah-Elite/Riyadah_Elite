import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function FeaturedGames() {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Action RPG', 'Arena Combat', 'Sim Racing'];

  const games = [
    {
      id: 'cybernetic',
      title: 'Cybernetic: Aegis Protocol',
      category: 'Action RPG',
      genre: 'Action RPG / Cyberpunk',
      status: 'Alpha Wave 3',
      statusBadge: 'bg-cyan-100 text-cyan-900 border-cyan-200',
      desc: 'Explore an open neo-metropolis. Join testing squads to stress-test regional netcode, latency sync, and boss battle encounters.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      actionText: 'Request Playtest Key',
      focusArea: 'Netcode & Hitbox Fidelity',
      testScope: 'Netcode Wave Alpha',
      platform: 'PC / Steam Deck',
      badge: 'VERIFIED DEV BUILD',
    },
    {
      id: 'ascent',
      title: 'Ascent: Realm of Gods',
      category: 'Arena Combat',
      genre: 'Competitive 3v3 Arena',
      status: 'Closed Beta',
      statusBadge: 'bg-violet-100 text-violet-900 border-violet-200',
      desc: 'High-altitude 3v3 vertical combat. Help designers balance character abilities, kinetic physics, and competitive ladder systems.',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      actionText: 'Request Playtest Key',
      focusArea: 'Hero Balancing & MMR',
      testScope: 'Arena Closed Beta',
      platform: 'Cross-Platform',
      badge: 'ESPORTS READY',
    },
    {
      id: 'horizon',
      title: 'Apex Formula: Grand Prix',
      category: 'Sim Racing',
      genre: 'Sim Racing',
      status: 'Telemetry Demo',
      statusBadge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      desc: 'Physics-driven racing on Gulf coastal circuits. Validate vehicle suspension kinematics, tyre degradation curves, and force feedback.',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      actionText: 'Download Demo Build',
      focusArea: 'Tyre Physics & Wheel Force',
      testScope: 'Public Telemetry Demo',
      platform: 'PC & Sim Rig',
      badge: 'PHYSICS DEMO',
    },
  ];

  const filteredGames = activeFilter === 'All'
    ? games
    : games.filter((g) => g.category === activeFilter);

  return (
    <section id="explore" className="w-full py-24 px-6 md:px-12 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Ionicons name="game-controller" size={14} color="#0891B2" />
              CURATED STUDIO SHOWCASE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight">
              Featured Game Showcases
            </h2>
          </div>
          <p className="text-base text-[#5B7083] max-w-md mt-4 md:mt-0 leading-relaxed">
            Discover emerging indie projects and studio titles seeking direct playtester feedback before commercial release.
          </p>
        </div>

        {/* Filter Category Tabs (inspired by competition template) */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#172B3A] text-white shadow-sm'
                  : 'bg-[#F8FCFF] text-[#5B7083] border border-neutral-200 hover:border-cyan-300 hover:text-[#172B3A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group rounded-3xl border border-neutral-200/90 bg-white p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                {/* Visual Thumbnail Banner */}
                <div className="h-56 rounded-2xl mb-5 relative overflow-hidden shadow-sm bg-neutral-900">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172B3A]/90 via-[#172B3A]/30 to-transparent p-5 flex flex-col justify-between" />

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white/95 backdrop-blur-md text-[#172B3A] shadow-xs">
                      {game.genre}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {game.platform}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest block mb-0.5">
                      FOCUS TEST SCOPE
                    </span>
                    <p className="text-sm font-bold text-white tracking-tight">{game.focusArea}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${game.statusBadge}`}>
                    {game.status}
                  </span>
                  <span className="text-xs text-[#5B7083] font-semibold flex items-center gap-1 font-mono">
                    <Ionicons name="hardware-chip-outline" size={13} color="#0891B2" />
                    {game.testScope}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#172B3A] mb-2 tracking-tight">{game.title}</h3>
                <p className="text-sm text-[#5B7083] leading-relaxed mb-6">{game.desc}</p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
                <a
                  href="#community"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-[#0891B2] hover:bg-[#0E7490] text-white shadow-md shadow-cyan-600/20 hover:scale-[1.01]"
                >
                  <Ionicons name="key-outline" size={16} color="white" />
                  <span>{game.actionText}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
