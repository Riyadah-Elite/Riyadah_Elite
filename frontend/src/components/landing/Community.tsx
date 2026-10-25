import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function Community() {
  const channels = [
    { name: '#alpha-announcements', desc: 'Direct day-0 playtest drops & key distributions' },
    { name: '#bug-hunting-squads', desc: 'Collaborative exploit reproduction & frame telemetry' },
    { name: '#tournament-scrims', desc: 'Squad recruitment, bracket updates & scrim matches' },
  ];

  return (
    <section id="community" className="w-full py-24 px-6 md:px-12 bg-gradient-to-br from-[#EFF6FF] via-[#F8FCFF] to-[#D1FAE5]/30 border-t border-cyan-100 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/90 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <Ionicons name="people-outline" size={14} color="#0891B2" />
          COMMUNITY OF TESTERS, CREATORS & SQUADS
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight mb-6">
          Ready to Shape the Next Era of Gaming?
        </h2>

        <p className="text-base sm:text-lg text-[#5B7083] max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with game testers, independent studios, competitive squads, and digital creators collaborating across the region.
        </p>

        {/* Discord channels preview strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10 text-left">
          {channels.map((ch, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/90 border border-cyan-200/60 shadow-2xs backdrop-blur-sm">
              <span className="font-mono text-xs font-black text-[#0891B2] block mb-1">{ch.name}</span>
              <p className="text-[11px] text-[#5B7083] leading-relaxed">{ch.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#newsletter"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#0891B2] hover:bg-[#0E7490] text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Join Playtest Network</span>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </a>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#172B3A] border border-neutral-300 shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Ionicons name="logo-discord" size={18} color="#5865F2" />
            <span>Join Official Discord Squad</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-[#5B7083]">
          <div className="flex items-center gap-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <span>Instant Discord Role Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <span>Weekly Studio AMAs</span>
          </div>
          <div className="flex items-center gap-2">
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <span>Early Access Playtest Alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
