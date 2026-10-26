import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export function FeatureCards() {
  const features = [
    {
      sysId: "SYS_01 // QA_ENGINE",
      id: "testing",
      title: "Game Testing & QA",
      desc: "Access exclusive alpha and beta releases. Reproduce exploits, log stack traces, and report bugs directly to studio engineering squads.",
      icon: "bug-outline" as const,
      color: "bg-cyan-500",
      badge: "Active Testing Hub",
      badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-200",
      border: "border-cyan-200/80",
      metric: "Stack Trace Capture",
      link: "#testing",
      action: "Explore Queues",
    },
    {
      sysId: "SYS_02 // BRACKETS",
      id: "tournaments",
      title: "Championship Esports",
      desc: "Compete in community showdowns, climb tiered double-elimination brackets, and claim verified tournament honors with live coverage.",
      icon: "trophy-outline" as const,
      color: "bg-violet-500",
      badge: "Community Majors",
      badgeColor: "bg-violet-100 text-violet-900 border-violet-200",
      border: "border-violet-200/80",
      metric: "Double-Elimination Formats",
      link: "#tournaments",
      action: "View Brackets",
    },
    {
      sysId: "SYS_03 // TELEMETRY",
      id: "achievements",
      title: "Verified Playtest Credentials",
      desc: "Build an immutable portfolio of verified QA bug contributions, stress-test participation, and competitive tournament trophies.",
      icon: "ribbon-outline" as const,
      color: "bg-emerald-500",
      badge: "Ranked Credentials",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
      border: "border-emerald-200/80",
      metric: "Immutable Contributor Log",
      link: "#rewards",
      action: "View Perks",
    },
    {
      sysId: "SYS_04 // VAULT",
      id: "rewards",
      title: "Studio Bounty Vault",
      desc: "Earn tester credits, early access keys, hardware peripherals, and rewards provided by participating regional and global studio partners.",
      icon: "gift-outline" as const,
      color: "bg-amber-500",
      badge: "Verified Payouts",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
      border: "border-amber-200/80",
      metric: "Direct Studio Escrow",
      link: "#rewards",
      action: "Claim Rewards",
    },
  ];

  return (
    <section className="w-full py-24 px-6 md:px-12 bg-white border-t border-neutral-100 relative overflow-hidden">
      {/* Background geometric accents inspired by minimal-technology template */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Ionicons name="hardware-chip-outline" size={13} color="#0891B2" />
            CORE ARCHITECTURAL PILLARS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#172B3A] tracking-tight mt-1 mb-4">
            Engineered for Creators & Competitors
          </h2>
          <p className="text-base text-[#5B7083] leading-relaxed">
            Everything gamers and development studios need to stress-test mechanics, run tournaments, and reward authentic feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.id}
              className={`rounded-3xl border ${f.border} bg-[#F8FCFF] p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group relative`}
            >
              <div>
                {/* Monospace telemetry tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] font-bold text-neutral-400 tracking-wider">
                    {f.sysId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center text-white shadow-md shadow-neutral-300/50 group-hover:scale-105 transition-transform`}>
                    <Ionicons name={f.icon} size={24} color="white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#172B3A] tracking-tight">{f.title}</h3>
                    <span className="text-[11px] font-mono font-bold text-[#0891B2] block">
                      {f.metric}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#5B7083] leading-relaxed mb-6">{f.desc}</p>
              </div>

              <a
                href={f.link}
                className="inline-flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0891B2] group-hover:text-[#0E7490] transition-colors pt-4 border-t border-neutral-200/60"
              >
                <span>{f.action}</span>
                <Ionicons name="arrow-forward" size={14} color="#0891B2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
