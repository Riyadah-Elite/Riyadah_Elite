import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


export function GameTesting() {
  const [selectedCategory, setSelectedCategory] = useState('Collision & Physics');

  const steps = [
    {
      num: '01',
      title: 'Enroll & Download',
      desc: 'Join verified test waves, sign NDA access keys, and install private development builds.',
      icon: 'cloud-download-outline' as const,
    },
    {
      num: '02',
      title: 'Stress-Test & Log',
      desc: 'Execute scripted testing routines. Capture frame latency, reproduction steps, and system logs.',
      icon: 'pulse-outline' as const,
    },
    {
      num: '03',
      title: 'Claim QA Bounties',
      desc: 'Validated reports earn verified credits, alpha keys, hardware perks, and cash bounties.',
      icon: 'sparkles-outline' as const,
    },
  ];

  const liveOpportunities = [
    {
      title: 'Aegis Protocol — Boss Netcode Synchronization',
      platform: 'PC / Steam',
      payout: 'Studio Bounty + QA Decal',
      slots: 'Active Test Wave',
      status: 'Active Wave',
      rewardToken: '🪙 +250 Coins',
    },
    {
      title: 'Apex Formula — Steering Force Feedback',
      platform: 'PC / Sim Rig',
      payout: 'Exclusive Prototype Decal',
      slots: 'Open Registration',
      status: 'Immediate',
      rewardToken: '💎 +5 Crystals',
    },
    {
      title: 'Ascent — 3v3 Ability Cooldown Telemetry',
      platform: 'Cross-Platform',
      payout: 'Bug Bounty + Role',
      slots: 'Upcoming Batch',
      status: 'Pending Batch',
      rewardToken: '⚡ +150 Energy',
    },
  ];

  return (
    <section id="testing" className="w-full py-24 px-6 md:px-12 bg-[#F8FCFF] border-t border-cyan-100/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Ionicons name="shield-checkmark-outline" size={14} color="#0891B2" />
            RIGOROUS QUALITY ASSURANCE PIPELINE
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight leading-[1.12] mb-4">
            Earn Recognition & Rewards Through Structured Bug Reporting
          </h2>

          <p className="text-base sm:text-lg text-[#5B7083] leading-relaxed">
            Directly bridge the gap between game studios and passionate players. Reproduce exploits, capture frame telemetry, and submit structured feedback directly to production engineering squads.
          </p>
        </div>

        {/* 3-Step Lifecycle Pipeline (inspired by minimal-technology template) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-[#0891B2]">{st.num}</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0891B2] flex items-center justify-center">
                  <Ionicons name={st.icon} size={20} color="#0891B2" />
                </div>
              </div>
              <h3 className="font-black text-lg text-[#172B3A] mb-2">{st.title}</h3>
              <p className="text-xs text-[#5B7083] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Verified QA Bounty Token Multipliers from Template 404 */}
        <div className="mb-12 p-6 rounded-3xl bg-white border border-cyan-100/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#0891B2] uppercase tracking-widest block mb-1">
              VERIFIED BUG REWARD VAULT
            </span>
            <h4 className="font-black text-xl text-[#172B3A]">Automated Studio Bounty Payouts</h4>
            <p className="text-xs text-[#5B7083] max-w-md mt-1">
              Every verified bug reproduction, frame-drop telemetry report, or netcode log unlocks instant reward tokens credited directly to your profile.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-20 h-24 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:scale-105 transition-transform">
              <img src="/assets/gamification/card_coin_token.png" alt="Coin Token" className="w-full h-full object-cover" />
            </div>
            <div className="w-20 h-24 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:scale-105 transition-transform">
              <img src="/assets/gamification/card_gem_token.png" alt="Gem Token" className="w-full h-full object-cover" />
            </div>
            <div className="w-20 h-24 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:scale-105 transition-transform">
              <img src="/assets/gamification/card_energy_token.png" alt="Energy Token" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Content Split: Feature Highlights vs. Live Queue Card */}
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Left: Highlights & CTAs */}
          <div className="lg:w-1/2 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0891B2] flex items-center justify-center font-bold shrink-0">
                  <Ionicons name="videocam-outline" size={20} color="#0891B2" />
                </div>
                <div>
                  <h4 className="font-black text-[#172B3A] text-base mb-1">Direct Telemetry & Log Ingestion</h4>
                  <p className="text-xs text-[#5B7083] leading-relaxed">
                    Attach 60fps MP4 video captures, crash logs, and hardware device specs directly into the studio review queue.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#8B5CF6] flex items-center justify-center font-bold shrink-0">
                  <Ionicons name="git-network-outline" size={20} color="#8B5CF6" />
                </div>
                <div>
                  <h4 className="font-black text-[#172B3A] text-base mb-1">Studio Jira & GitHub Sync</h4>
                  <p className="text-xs text-[#5B7083] leading-relaxed">
                    Verified bug submissions convert directly into engineering issue tickets with automated status update pings.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#explore"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#0891B2] hover:bg-[#0E7490] text-white shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Apply as Verified QA Tester</span>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </a>
            </div>
          </div>

          {/* Right: Live Queue Card */}
          <div className="lg:w-1/2 w-full">
            <div className="rounded-3xl border border-cyan-200/80 bg-white p-8 shadow-xl shadow-cyan-500/5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-6">
                <div>
                  <h3 className="font-black text-xl text-[#172B3A]">Active Playtest Queues</h3>
                  <p className="text-xs text-[#5B7083]">Real-time opportunities synced with verified game creators</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-800 animate-pulse">
                  LIVE NOW
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {liveOpportunities.map((op, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F8FCFF] border border-cyan-100 hover:border-cyan-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-[#0891B2] uppercase">{op.platform}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {op.slots}
                      </span>
                    </div>
                    <h4 className="font-black text-base text-[#172B3A] mb-1">{op.title}</h4>
                    <div className="flex items-center justify-between text-xs text-[#5B7083] mt-3 pt-3 border-t border-cyan-100/60">
                      <span className="font-semibold">
                        Reward: <strong className="text-[#172B3A]">{op.payout}</strong>{' '}
                        <span className="text-[#0891B2] text-[11px] font-mono font-bold ml-1">{op.rewardToken}</span>
                      </span>
                      <a
                        href="#community"
                        className="font-bold text-xs uppercase tracking-wider text-[#0891B2] hover:underline cursor-pointer"
                      >
                        Join Queue →
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick QA Category Simulator */}
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest block mb-3">
                  QA FOCUS CATEGORIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Collision & Physics', 'Audio Stuttering', 'UI Clipping', 'Netcode Desync', 'Memory Leak'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#0891B2] text-white shadow-xs'
                          : 'bg-neutral-100 text-[#5B7083] hover:bg-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
