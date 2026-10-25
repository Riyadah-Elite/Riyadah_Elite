import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function GameTesting() {
  const liveOpportunities = [
    {
      id: 'aegis-netcode',
      gameTitle: 'Cybernetic: Aegis Protocol',
      focusArea: 'Boss Netcode Synchronization & Frame Stability',
      platform: 'PC / Steam Deck',
      phase: 'Wave Alpha 3',
      badgeColor: 'bg-cyan-50 text-[#08A8C8] border-cyan-200',
      actionText: 'Join Test Wave',
    },
    {
      id: 'apex-physics',
      gameTitle: 'Apex Formula: Grand Prix',
      focusArea: 'Tyre Degradation Curves & Wheel Force Feedback',
      platform: 'PC / Sim Rig',
      phase: 'Physics Demo',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actionText: 'Download Demo Build',
    },
    {
      id: 'ascent-balancing',
      gameTitle: 'Ascent: Realm of Gods',
      focusArea: '3v3 Ability Cooldowns & Vertical Knockback',
      platform: 'Cross-Platform',
      phase: 'Closed Beta',
      badgeColor: 'bg-violet-50 text-[#8057F5] border-violet-200',
      actionText: 'Apply for Beta Access',
    },
  ];

  return (
    <section id="testing" className="w-full py-20 px-6 md:px-12 bg-[#F4FAFE] border-t border-[#DCE8F0]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-[#08A8C8] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Ionicons name="shield-checkmark-outline" size={14} color="#08A8C8" />
              QUALITY ASSURANCE PIPELINE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#14283A] tracking-tight">
              Active Playtest & QA Waves
            </h2>
          </div>
          <p className="text-sm text-[#647B91] max-w-md leading-relaxed">
            Directly connect with independent game developers and studios. Stress-test pre-release builds, capture reproduction logs, and shape game balance.
          </p>
        </div>

        {/* Playtest Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {liveOpportunities.map((op) => (
            <div
              key={op.id}
              className="p-6 rounded-3xl bg-white border border-[#DCE8F0] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#647B91] uppercase tracking-wide">
                    {op.platform}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${op.badgeColor}`}>
                    {op.phase}
                  </span>
                </div>

                <h3 className="font-black text-lg text-[#14283A] mb-2 tracking-tight">
                  {op.gameTitle}
                </h3>

                <div className="p-3.5 rounded-2xl bg-[#F4FAFE] border border-[#DCE8F0] mb-6">
                  <span className="text-[10px] font-mono font-bold text-[#08A8C8] uppercase tracking-wider block mb-1">
                    TARGET FOCUS AREA
                  </span>
                  <p className="text-xs text-[#14283A] font-semibold leading-relaxed">
                    {op.focusArea}
                  </p>
                </div>
              </div>

              <a
                href="#games"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-white hover:bg-neutral-50 text-[#14283A] border border-[#DCE8F0] hover:border-cyan-300 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>{op.actionText}</span>
                <Ionicons name="arrow-forward" size={14} color="#08A8C8" />
              </a>
            </div>
          ))}
        </div>

        {/* Concise Telemetry Pipeline Strip */}
        <div className="rounded-3xl bg-white border border-[#DCE8F0] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#08A8C8] flex items-center justify-center shrink-0 mt-1">
              <Ionicons name="git-pull-request-outline" size={24} color="#08A8C8" />
            </div>
            <div>
              <h4 className="font-black text-lg text-[#14283A] mb-1">
                Direct Telemetry & Studio Defect Triage
              </h4>
              <p className="text-xs text-[#647B91] max-w-xl leading-relaxed">
                Playtesters record reproduction traces, frame drops, and crash logs that convert directly into actionable engineering tickets for studio development teams.
              </p>
            </div>
          </div>

          <a
            href="#community"
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#08A8C8] hover:bg-[#068EA9] text-white shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Join Playtest Network</span>
            <Ionicons name="arrow-forward" size={15} color="white" />
          </a>
        </div>
      </div>
    </section>
  );
}
