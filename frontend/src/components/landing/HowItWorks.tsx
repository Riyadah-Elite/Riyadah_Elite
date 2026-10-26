import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Discover Games & Opportunities',
      desc: 'Browse curated alpha builds, upcoming championship ladders, and studio testing requests across PC, mobile, and sim platforms.',
      icon: 'compass-outline' as const,
      tag: 'CATALOG EXPLORATION',
      accent: 'border-cyan-200 bg-cyan-50/60 text-[#08A8C8]',
    },
    {
      num: '02',
      title: 'Join Playtests or Tournaments',
      desc: 'Claim private alpha access keys or register your competitive squad for tiered tournament brackets with verified registration.',
      icon: 'trophy-outline' as const,
      tag: 'VERIFIED REGISTRATION',
      accent: 'border-violet-200 bg-violet-50/60 text-[#8057F5]',
    },
    {
      num: '03',
      title: 'Participate, Test & Compete',
      desc: 'Play matches, submit frame-rate telemetry and exploit reproductions, climb brackets, and earn recognized community credentials.',
      icon: 'sparkles-outline' as const,
      tag: 'TELEMETRY & HONORS',
      accent: 'border-emerald-200 bg-emerald-50/60 text-[#10B981]',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 px-6 md:px-12 bg-[#F4FAFE] border-t border-[#DCE8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-[#08A8C8] text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Ionicons name="hardware-chip-outline" size={13} color="#08A8C8" />
            PLATFORM ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#14283A] tracking-tight mb-3">
            How Riyadah Elite Works
          </h2>
          <p className="text-sm sm:text-base text-[#647B91] leading-relaxed">
            A streamlined three-step workflow connecting gamers, playtesters, and studios in one unified esports ecosystem.
          </p>
        </div>

        {/* 3-Step Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="p-7 rounded-3xl bg-white border border-[#DCE8F0] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-black text-[#14283A]">{s.num}</span>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${s.accent}`}>
                    <Ionicons name={s.icon} size={22} color="currentColor" />
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-[#647B91] uppercase tracking-wider block mb-1">
                  {s.tag}
                </span>
                <h3 className="font-black text-lg text-[#14283A] mb-2 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-xs text-[#647B91] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-[#DCE8F0]/70 flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#08A8C8]">
                <span>PHASE {s.num} READINESS</span>
                <Ionicons name="checkmark-circle" size={14} color="#08A8C8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
