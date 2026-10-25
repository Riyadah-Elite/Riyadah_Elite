import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


export function About() {
  const pillars = [
    {
      code: 'PILLAR_01 // CONNECTIVITY',
      title: 'Our Mission',
      desc: 'To establish a transparent, competitive, and technically rigorous ecosystem connecting regional game creators with dedicated playtesters and esports competitors.',
      icon: 'compass-outline' as const,
      color: 'bg-cyan-500',
    },
    {
      code: 'PILLAR_02 // TELEMETRY',
      title: 'Our Vision',
      desc: 'Positioning Saudi Arabia and the MENA region at the global forefront of gaming innovation, quality assurance, and community-driven tournament excellence.',
      icon: 'eye-outline' as const,
      color: 'bg-violet-500',
    },
    {
      code: 'PILLAR_03 // QA_DEV',
      title: 'Studio Partnership',
      desc: 'Delivering direct telemetry, authentic bug reporting, and actionable player feedback to indie developers and established studios prior to commercial rollout.',
      icon: 'hardware-chip-outline' as const,
      color: 'bg-emerald-500',
    },
    {
      code: 'PILLAR_04 // INTEGRITY',
      title: 'Community Integrity',
      desc: 'Ensuring fair play, verified tournament rankings, and meaningful rewards for gamers who invest their passion and expertise into testing.',
      icon: 'shield-checkmark-outline' as const,
      color: 'bg-amber-500',
    },
  ];

  const milestones = [
    { number: '01', title: 'Connect', detail: 'Onboard studios and verified playtesters onto unified testing channels with standardized telemetry reporting.' },
    { number: '02', title: 'Evaluate', detail: 'Execute rigorous stress-testing phases covering multiplayer netcode, hitbox fidelity, and frame-rate stability.' },
    { number: '03', title: 'Compete', detail: 'Organize high-stakes regional championships and weekly cups with verified brackets and cash prize pools.' },
    { number: '04', title: 'Empower', detail: 'Distribute transparent contributor rewards, studio credits, and career pathway credentials across the ecosystem.' },
  ];

  return (
    <section id="about" className="w-full py-24 px-6 md:px-12 bg-white border-t border-neutral-100 relative overflow-hidden">
      {/* Background soft ambient gradient */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/30 via-sky-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Ionicons name="information-circle-outline" size={15} color="#0891B2" />
              THE RIYADAH STORY & VISION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight">
              Pioneering Gaming Excellence & Studio Telemetry
            </h2>
          </div>
          <p className="text-base text-[#5B7083] max-w-md mt-4 md:mt-0 leading-relaxed">
            Riyadah Elite was founded in Riyadh to bridge the gap between game studios striving for technical perfection and players seeking authentic competitive growth.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#F8FCFF] border border-cyan-100/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-neutral-400 block mb-4">
                  {p.code}
                </span>
                <div className={`w-12 h-12 rounded-2xl ${p.color} text-white flex items-center justify-center mb-6 shadow-md shadow-neutral-200`}>
                  <Ionicons name={p.icon} size={24} color="white" />
                </div>
                <h3 className="font-black text-xl text-[#172B3A] mb-3 tracking-tight">{p.title}</h3>
                <p className="text-sm text-[#5B7083] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial Milestone Strip (inspired by minimal-technology template) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#EFF6FF] via-[#F8FCFF] to-[#EFF6FF] border border-cyan-200/60 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0891B2] block mb-2">
              ECOSYSTEM LIFECYCLE ARCHITECTURE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#172B3A] tracking-tight">
              The Four Phases of Riyadah Platform Telemetry
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m) => (
              <div key={m.number} className="flex flex-col border-t-2 border-[#0891B2] pt-4">
                <span className="font-mono text-2xl font-black text-[#0891B2] mb-2">{m.number}</span>
                <h4 className="text-base font-black text-[#172B3A] mb-2">{m.title}</h4>
                <p className="text-xs text-[#5B7083] leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hardware & SDK Support Banner (from minimal-technology & game-night templates) */}
        <div className="mt-12 rounded-3xl bg-white border border-neutral-200/90 p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-[#0891B2] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <Ionicons name="hardware-chip-outline" size={13} color="#0891B2" />
              UNIVERSAL PLATFORM & HARDWARE COMPATIBILITY
            </div>
            <h4 className="text-xl font-black text-[#172B3A] mb-2">
              Testing Across PC, Mobile, Handhelds, and Spatial VR
            </h4>
            <p className="text-xs text-[#5B7083] leading-relaxed">
              Whether your studio targets low-latency PC setups, mobile competitive touchpads, Linux-based handheld consoles, or immersive 6DoF spatial VR environments, Riyadah Elite provides standardized telemetry capture pipelines.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:scale-105 transition-transform bg-[#021526]">
              <img src="/assets/hardware/vr_headset_hardware.png" alt="Spatial VR Headset" className="w-full h-full object-cover" />
            </div>
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:scale-105 transition-transform bg-[#021526]">
              <img src="/assets/hardware/handheld_console.png" alt="Handheld Gaming Console" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
