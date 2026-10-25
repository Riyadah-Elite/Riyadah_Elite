import React from 'react';

export function PlatformStats() {
  const pillars = [
    {
      code: 'SYS_01 // TELEMETRY',
      tag: 'DIRECT INGEST',
      title: 'Studio Telemetry & Crash Logs',
      desc: 'Ingests 60fps frame telemetry, reproduction traces, and device specs directly into studio queues.',
    },
    {
      code: 'SYS_02 // SYNC',
      tag: 'WORKFLOW SYNC',
      title: 'Automated Issue Pipeline',
      desc: 'Connects verified player exploit reports directly to studio Jira and GitHub development sprints.',
    },
    {
      code: 'SYS_03 // ESCROW',
      tag: 'BOUNTY VAULT',
      title: 'Structured Value Return',
      desc: 'Verified credit tokens, studio access passes, and pro peripherals awarded for confirmed testing bugs.',
    },
    {
      code: 'SYS_04 // ESPORTS',
      tag: 'TOURNAMENT ENGINE',
      title: 'Tiered Championship Cups',
      desc: 'Organized community tournament ladders, seasonal majors, and verified bracket recognition.',
    },
  ];

  return (
    <section id="stats" className="w-full py-16 px-6 md:px-12 bg-[#0F172A] text-white border-y border-cyan-900/40 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Telemetry live status header */}
        <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            [RIYADAH ELITE ARCHITECTURE: PRIMARY REGIONAL HUB]
          </div>
          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <span>PROTOCOL: TELEMETRY INGEST</span>
            <span>STACK: EXPO WEB & 3D</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
          {pillars.map((p, idx) => (
            <div key={idx} className="flex flex-col pt-4 sm:pt-0 sm:px-6 text-left">
              <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-widest mb-1">
                {p.code}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight mb-2">
                {p.tag}
              </span>
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wide mb-1">
                {p.title}
              </span>
              <span className="text-xs text-neutral-400 leading-relaxed">
                {p.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

