import React from "react";
import { Link } from "react-router-dom";

export const HowItWorksPage: React.FC = () => {

  return (
    <div className="flex flex-col w-full text-[#dfe0ff]">
      {/* ================================================================= */}
      {/* SECTION 1 — HERO & ARCHITECTURAL DUAL-BRANCH TOPOLOGY             */}
      {/* ================================================================= */}
      <section className="relative w-full overflow-hidden pt-12 pb-16">
        {/* Atmospheric Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[450px] rounded-full bg-[#233dff]/15 blur-[130px]"></div>
        <div className="pointer-events-none absolute top-1/3 left-10 w-[380px] h-[380px] rounded-full bg-[#92ccff]/10 blur-[110px]"></div>
        <div className="pointer-events-none absolute top-1/2 right-10 w-[420px] h-[420px] rounded-full bg-[#bcc2ff]/10 blur-[120px]"></div>

        <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          {/* System Architecture Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#21274c]/80 border border-[#5cb6f9]/20 backdrop-blur-md shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5cb6f9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5cb6f9]"></span>
            </span>
            <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
              SYSTEM ARCHITECTURE &amp; USER LIFECYCLE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight max-w-4xl font-bold leading-tight">
            HOW RIYADAH ELITE <span className="text-[#5cb6f9]">WORKS</span>
          </h1>

          {/* Supporting Copy */}
          <p className="font-body text-base sm:text-lg text-[#c5c5da] max-w-2xl mt-4 mb-8 leading-relaxed">
            Discover new games, help developers build better experiences, and compete in tournaments with gamers around the world. One unified ecosystem engineered for play, testing, and esports.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm uppercase tracking-wider font-bold shadow-[0_4px_24px_rgba(35,61,255,0.45)] hover:scale-[1.02] hover:shadow-[0_4px_30px_rgba(92,182,249,0.6)] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">science</span>
              <span>Explore Games</span>
            </Link>
            <Link
              to="/tournaments"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#21274c]/80 border border-[#92ccff]/30 hover:bg-[#31365d] text-[#92ccff] hover:text-white font-headline text-sm uppercase tracking-wider font-bold shadow-sm transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              <span>Find Tournaments</span>
            </Link>
          </div>

          {/* Interactive Nexus Architecture Diagram Visual */}
          <div className="w-full bg-[#050930]/90 border border-[#21274c]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Live Topology Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#21274c]/60">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">hub</span>
                <span className="font-headline text-sm sm:text-base uppercase tracking-wider text-white font-bold">
                  Dual-Pipeline State Machine
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#21274c] text-[#5cb6f9] text-xs font-mono font-bold">
                  KERNEL v4.9 ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-6 text-[#c5c5da] font-headline text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5cb6f9]"></span> 14ms Dubai Subsea Node
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#5cb6f9]"></span> 100% Escrow Guard
                </span>
              </div>
            </div>

            {/* 3-Column Node Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-11 items-center gap-6 text-left">
              {/* LEFT BRANCH: Game Testing Pipeline */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-[#171c41]/80 border border-[#21274c] shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                      Telemetry Branch 01
                    </span>
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[20px]">bug_report</span>
                  </div>
                  <h4 className="font-headline text-lg text-white font-bold mb-1">Gamer Playtest Node</h4>
                  <p className="font-body text-xs sm:text-sm text-[#c5c5da] mb-4 leading-relaxed">
                    Pre-release binary streaming with kernel-level frametime crash logging and reproduction steps.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#cae8ff] text-xs font-mono">165 FPS Target</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#5cb6f9] text-xs font-mono">Ctrl+F9 Dump Log</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#bcc2ff] text-xs font-mono font-bold">+150 REP / Bug</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#21274c]/50 text-xs font-headline text-[#c5c5da]">
                  <span>Sync to Studio Linear / Jira backlogs</span>
                  <span className="text-[#5cb6f9] font-bold">➔</span>
                </div>
              </div>

              {/* CENTER NEXUS: Core Riyadah Engine */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#21274c]/90 border border-[#5cb6f9]/30 shadow-[0_0_40px_rgba(35,61,255,0.3)] relative">
                <div className="w-16 h-16 rounded-2xl bg-[#233dff] flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(35,61,255,0.7)]">
                  <span className="material-symbols-outlined text-white text-[34px]">developer_board</span>
                </div>
                <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] mb-1 font-bold">
                  Core Nexus Hub
                </span>
                <h3 className="font-headline text-xl text-white font-bold text-center">RIYADAH CORE</h3>
                <p className="font-body text-xs text-[#c5c5da] text-center mt-1 mb-4 leading-relaxed">
                  Realtime MMR arbitration, Zero-Knowledge Escrow, &amp; Gamer Passport telemetry.
                </p>
                <div className="w-full space-y-2 text-xs font-headline">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#050930] text-[#dfe0ff]">
                    <span>REP Registry</span>
                    <span className="text-[#5cb6f9] font-mono font-bold">SYNCED</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#050930] text-[#dfe0ff]">
                    <span>Escrow Vault</span>
                    <span className="text-[#5cb6f9] font-mono font-bold">100% LOCKED</span>
                  </div>
                </div>
              </div>

              {/* RIGHT BRANCH: Tournament Esports Pipeline */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="p-5 rounded-2xl bg-[#171c41]/80 border border-[#21274c] shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                      Competitive Branch 02
                    </span>
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[20px]">military_tech</span>
                  </div>
                  <h4 className="font-headline text-lg text-white font-bold mb-1">Escrow Bracket Node</h4>
                  <p className="font-body text-xs sm:text-sm text-[#c5c5da] mb-4 leading-relaxed">
                    128-tick private instance orchestration, auto-lobby seeding, and instant smart wallet disbursal.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#5cb6f9] text-xs font-mono font-bold">₹25,000 Verified</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#cae8ff] text-xs font-mono">128T Dedicated</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#21274c] text-[#bcc2ff] text-xs font-mono">Vanguard Clean</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#21274c]/50 text-xs font-headline text-[#c5c5da]">
                  <span>Auto Disbursed to Captains &lt; 120 Mins</span>
                  <span className="text-[#5cb6f9] font-bold">➔</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2 — TWO WAYS TO GET IN THE GAME (CARDS)                   */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
              CHOOSE YOUR PATHWAY
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase mt-2 mb-3 font-bold">
              ONE PLATFORM. TWO WAYS TO GET IN THE GAME.
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Whether you want to shape unreleased titles alongside game directors or dominate competitive brackets with your squad, your journey starts here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CARD 1: TEST GAMES */}
            <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#13183d]/90 border border-[#21274c] backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-[#5cb6f9]/50 transition-all duration-300">
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#233dff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#233dff]/20 transition-all"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3.5 py-1 rounded-full bg-[#21274c] text-[#5cb6f9] font-headline text-xs uppercase font-bold tracking-wider">
                    DEVELOPER COLLABORATION
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#21274c] flex items-center justify-center text-[#5cb6f9]">
                    <span className="material-symbols-outlined text-[24px]">science</span>
                  </div>
                </div>
                <h3 className="font-headline text-2xl text-white font-bold mb-3">
                  Test Games Before the World Does
                </h3>
                <p className="font-body text-sm text-[#c5c5da] mb-6 leading-relaxed">
                  Play upcoming titles and help indie teams and AAA studios polish mechanics, squelch critical netcode bugs, and optimize frametimes across diverse rigs.
                </p>

                {/* 5 Process Step Pills */}
                <div className="mb-6">
                  <span className="font-headline text-xs uppercase tracking-wider text-[#adcae1] block mb-2 font-bold">
                    Execution Pipeline
                  </span>
                  <div className="grid grid-cols-5 gap-2 text-center font-headline text-xs">
                    {["Discover", "Apply", "Play Beta", "Log Bugs", "Bounties"].map((st, i) => (
                      <div key={st} className="p-2.5 rounded-xl bg-[#050930] flex flex-col items-center border border-[#21274c]/40">
                        <span className="text-[#5cb6f9] font-mono font-bold">0{i + 1}</span>
                        <span className="text-[11px] text-[#c5c5da] mt-1 truncate w-full">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Verified Builds</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Crash Telemetry Daemon</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Direct Studio Sync</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Bounty Payouts</span>
                </div>
              </div>
              <Link
                to="/games"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#233dff] hover:bg-[#324bff] text-white font-headline text-sm uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <span>Explore Games</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* CARD 2: JOIN TOURNAMENTS */}
            <div className="flex flex-col justify-between p-8 rounded-3xl bg-[#13183d]/90 border border-[#21274c] backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-[#5cb6f9]/50 transition-all duration-300">
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#5cb6f9]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#5cb6f9]/20 transition-all"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3.5 py-1 rounded-full bg-[#21274c] text-[#5cb6f9] font-headline text-xs uppercase font-bold tracking-wider">
                    COMPETITIVE ESPORTS
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#21274c] flex items-center justify-center text-[#5cb6f9]">
                    <span className="material-symbols-outlined text-[24px]">emoji_events</span>
                  </div>
                </div>
                <h3 className="font-headline text-2xl text-white font-bold mb-3">
                  Compete in Automated Escrow Tournaments
                </h3>
                <p className="font-body text-sm text-[#c5c5da] mb-6 leading-relaxed">
                  Find open community cups, form MMR-balanced 5v5 stacks or join as a verified free agent, play on 128-tick private servers, and claim guaranteed prize pools.
                </p>

                {/* 5 Process Step Pills */}
                <div className="mb-6">
                  <span className="font-headline text-xs uppercase tracking-wider text-[#adcae1] block mb-2 font-bold">
                    Tournament Lifecycle
                  </span>
                  <div className="grid grid-cols-5 gap-2 text-center font-headline text-xs">
                    {["Discover", "Squad Up", "Check In", "Compete", "Payout"].map((st, i) => (
                      <div key={st} className="p-2.5 rounded-xl bg-[#050930] flex flex-col items-center border border-[#21274c]/40">
                        <span className="text-[#5cb6f9] font-mono font-bold">0{i + 1}</span>
                        <span className="text-[11px] text-[#c5c5da] mt-1 truncate w-full">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Smart Escrow Lock</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Automated Swiss / Elim</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Hardware Anti-Cheat</span>
                  <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#cae8ff] font-body text-xs">Instant Disbursal</span>
                </div>
              </div>
              <Link
                to="/tournaments"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#3698d9] hover:bg-[#5cb6f9] text-[#001e31] font-headline text-sm uppercase tracking-wider font-bold transition-all shadow-md"
              >
                <span>Find Tournaments</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3 — GAME TESTING 5-STEP PIPELINE                          */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/60">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
                PLAYTEST WORKFLOW
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold mt-1">
                THE GAME TESTING PIPELINE
              </h2>
              <p className="font-body text-sm sm:text-base text-[#c5c5da] max-w-xl mt-1">
                From closed beta discovery to direct developer influence in five high-fidelity steps.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-headline text-[#adcae1] bg-[#171c41] px-4 py-2 rounded-xl border border-[#21274c]">
              <span className="w-2 h-2 rounded-full bg-[#5cb6f9]"></span>
              <span>Avg Bounty Disbursal: 3.2 hrs post-audit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                icon: "manage_search",
                label: "Discover",
                title: "Browse Campaigns",
                desc: "Filter active campaigns by genre, engine (UE5/Unity), target hardware specs, and cash bounty rewards.",
                meta: "Cyber Strike v0.8.4",
                sub: "1,248 / 2,000 Testers",
              },
              {
                num: "02",
                icon: "visibility",
                label: "Audit",
                title: "Inspect Focus",
                desc: "Review testing requirements, specific focus vectors (128T Netcode, Ragdoll Physics, Frame Pacing), and hardware specs.",
                meta: "Rollback Reconciliation",
                sub: "1% Low Frametimes",
              },
              {
                num: "03",
                icon: "how_to_reg",
                label: "Apply",
                title: "1-Click Match",
                desc: "Submit your player profile. Riyadah auto-matches your hardware rig, FPS rank, and region with optimal test cohorts.",
                meta: "Cohort Match: 98%",
                sub: "Steam ID & Rig Verified",
              },
              {
                num: "04",
                icon: "videogame_asset",
                label: "Play & Capture",
                title: "Pre-Release Builds",
                desc: "Get instant Steam/Epic keys. Play scheduled stress tests and log live crash logs with Ctrl+F9 instant replay sync.",
                meta: "Daemon Latency: 14ms",
                sub: "0 Memory Leak Overhead",
              },
              {
                num: "05",
                icon: "redeem",
                label: "Bounties",
                title: "Earn REP & Cash",
                desc: "Submit structured bug tickets and balance reviews. Earn Verified Tester REP points, Steam vouchers, and priority beta passes.",
                meta: "+150 REP Points",
                sub: "₹1,500 Disbursed via Escrow",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] flex flex-col justify-between shadow-lg group hover:border-[#5cb6f9]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline text-2xl font-bold text-[#5cb6f9] font-mono">
                      {step.num}
                    </span>
                    <span className="material-symbols-outlined text-[#adcae1] text-[22px]">
                      {step.icon}
                    </span>
                  </div>
                  <span className="font-headline text-xs uppercase tracking-wider text-[#adcae1] font-bold block mb-1">
                    {step.label}
                  </span>
                  <h4 className="font-headline text-base text-white font-bold mb-2">
                    {step.title}
                  </h4>
                  <p className="font-body text-xs text-[#c5c5da] mb-6 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#050930] text-xs font-headline border border-[#21274c]/50">
                  <div className="text-[#5cb6f9] font-semibold truncate">{step.meta}</div>
                  <div className="text-[11px] text-[#8f8fa3] mt-0.5">{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4 — TOURNAMENT 5-STEP LIFECYCLE                           */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
                ESPORTS ARENA
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold mt-1">
                THE TOURNAMENT LIFECYCLE
              </h2>
              <p className="font-body text-sm sm:text-base text-[#c5c5da] max-w-xl mt-1">
                Fair, transparent, automated bracket competition with guaranteed smart escrow disbursement.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-headline text-[#adcae1] bg-[#171c41] px-4 py-2 rounded-xl border border-[#21274c]">
              <span className="w-2 h-2 rounded-full bg-[#5cb6f9]"></span>
              <span>Auto Check-in Window: 60 Minutes Before Match</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                num: "01",
                icon: "search",
                label: "Discover",
                title: "Find Your Arena",
                desc: "Explore cups across Valorant, CS2, Apex Legends, and Rocket League with verified prize pools and flexible entry modes.",
                meta: "Valorant Community Cup",
                sub: "Prize Pool: ₹25,000 INR",
              },
              {
                num: "02",
                icon: "policy",
                label: "Audit",
                title: "Rules & Schedule",
                desc: "Inspect match formats (5v5 Single Elim, Swiss, Double Elim), server locations, anti-cheat mandates, and strict check-in windows.",
                meta: "AWS Mumbai/Dubai 128T",
                sub: "Vanguard Anti-Cheat Mandate",
              },
              {
                num: "03",
                icon: "groups",
                label: "Join",
                title: "Squad or Free Agent",
                desc: "Register your 5-stack with team passcodes, or enter the Solo Free Agent draft pool to be paired with MMR-matched teammates.",
                meta: "Draft: Solo Free Agent",
                sub: "Role: Initiator / Flex",
              },
              {
                num: "04",
                icon: "sports_esports",
                label: "Compete",
                title: "Automated Rooms",
                desc: "60-minute mandatory check-in. Automated lobby keys, live referee monitoring, and screenshot score validation.",
                meta: "Lobby #04 Live",
                sub: "Alpha vs Delta (Ascent)",
              },
              {
                num: "05",
                icon: "payments",
                label: "Win & Payout",
                title: "Instant Escrow",
                desc: "Brackets automatically verify winner submissions. Escrowed funds instantly disburse to captain bank/UPI wallets within 120 minutes.",
                meta: "Team Alpha Won",
                sub: "₹15,000 Disbursed to Captain",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] flex flex-col justify-between shadow-lg group hover:border-[#5cb6f9]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline text-2xl font-bold text-[#5cb6f9] font-mono">
                      {step.num}
                    </span>
                    <span className="material-symbols-outlined text-[#adcae1] text-[22px]">
                      {step.icon}
                    </span>
                  </div>
                  <span className="font-headline text-xs uppercase tracking-wider text-[#adcae1] font-bold block mb-1">
                    {step.label}
                  </span>
                  <h4 className="font-headline text-base text-white font-bold mb-2">
                    {step.title}
                  </h4>
                  <p className="font-body text-xs text-[#c5c5da] mb-6 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#050930] text-xs font-headline border border-[#21274c]/50">
                  <div className="text-[#5cb6f9] font-semibold truncate">{step.meta}</div>
                  <div className="text-[11px] text-[#8f8fa3] mt-0.5">{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5 — UNIFIED GAMER PASSPORT IDENTITY                       */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/80">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
              UNIFIED PASSPORT ARCHITECTURE
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold mt-2 mb-3">
              BUILT AROUND YOUR GAMING JOURNEY
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Everything you do on Riyadah Elite — every bug squashed, every beta played, and every tournament won — compounds into your verified, portable gaming passport.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Cols: Rahul's Gamer Passport Card */}
            <div className="lg:col-span-6 p-8 rounded-3xl bg-[#171c41] border border-[#21274c] shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#233dff] flex items-center justify-center text-white ring-2 ring-[#5cb6f9]/50 shadow-lg shrink-0">
                    <span className="material-symbols-outlined text-[32px]">person</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline text-xl text-white font-bold">RahulX#IND</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">verified</span> VERIFIED
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-headline text-[#c5c5da] mt-1">
                      <span className="text-[#5cb6f9] font-semibold">Ascendant 2 (Valorant)</span>
                      <span>•</span>
                      <span>RTX 4070 Ti / i7-13700K Rig</span>
                    </div>
                  </div>
                </div>

                {/* 4 Core Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-[#13183d] flex flex-col">
                    <span className="font-headline text-xs text-[#8f8fa3] uppercase">Games Tested</span>
                    <span className="font-headline text-2xl text-white font-bold mt-1">37</span>
                    <span className="text-[11px] text-[#5cb6f9] mt-0.5">8 Alpha, 29 Beta</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#13183d] flex flex-col">
                    <span className="font-headline text-xs text-[#8f8fa3] uppercase">Tourneys</span>
                    <span className="font-headline text-2xl text-white font-bold mt-1">54</span>
                    <span className="text-[11px] text-[#5cb6f9] mt-0.5">38 Matches Won</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#13183d] flex flex-col">
                    <span className="font-headline text-xs text-[#8f8fa3] uppercase">Podiums</span>
                    <span className="font-headline text-2xl text-[#5cb6f9] font-bold mt-1">18</span>
                    <span className="text-[11px] text-[#5cb6f9] mt-0.5">₹142,500 Won</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#13183d] flex flex-col">
                    <span className="font-headline text-xs text-[#8f8fa3] uppercase">REP Score</span>
                    <span className="font-headline text-2xl text-[#bcc2ff] font-bold mt-1">
                      92<span className="text-xs font-normal text-[#8f8fa3]">/100</span>
                    </span>
                    <span className="text-[11px] text-[#bcc2ff] mt-0.5">Top 5% Cohort</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6">
                  <span className="font-headline text-xs uppercase tracking-wider text-[#adcae1] font-bold block mb-2">
                    Verified Credentials
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Tourney Champ S3", "Bug Hunter Lvl 3", "Escrow Trusted", "165Hz Rig Verified"].map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1.5 rounded-lg bg-[#21274c] text-white text-xs font-headline font-semibold flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">military_tech</span>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#21274c] flex items-center justify-between text-xs font-mono text-[#8f8fa3]">
                <span>Passport Hash: 0x9f4a...8b1c</span>
                <span className="text-[#5cb6f9]">IMMUTABLE PASSPORT</span>
              </div>
            </div>

            {/* Right 6 Cols: Live Activity Log */}
            <div className="lg:col-span-6 p-8 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline text-lg text-white font-bold">Live Passport Activity</h3>
                  <span className="px-2.5 py-0.5 rounded bg-[#21274c] text-[#5cb6f9] text-xs font-mono">
                    EVENT LOG
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#171c41] border border-[#21274c]/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#21274c] flex items-center justify-center text-[#5cb6f9] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm text-white font-bold truncate">
                          Bug Report Resolved #84921
                        </span>
                        <span className="font-headline text-xs text-[#bcc2ff] font-bold">+50 REP</span>
                      </div>
                      <p className="font-body text-xs text-[#c5c5da] mt-1">
                        Netcode rollback sync issue in <span className="text-[#5cb6f9] font-semibold">Cyber Strike</span> validated and patched by developer.
                      </p>
                      <span className="text-[11px] text-[#adcae1] font-mono mt-1 block">Bounty: ₹1,500 Disbursed • 2 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171c41] border border-[#21274c]/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#21274c] flex items-center justify-center text-[#5cb6f9] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm text-white font-bold truncate">
                          1st Place — Valorant Community Cup
                        </span>
                        <span className="font-headline text-xs text-[#5cb6f9] font-bold">₹15,000 SPLIT</span>
                      </div>
                      <p className="font-body text-xs text-[#c5c5da] mt-1">
                        Defeated Delta Esports (2-1). Earned Team Alpha Captain Tier-1 Circuit Pass.
                      </p>
                      <span className="text-[11px] text-[#adcae1] font-mono mt-1 block">Escrow Disbursed • Yesterday</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#171c41] border border-[#21274c]/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#21274c] flex items-center justify-center text-[#bcc2ff] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">key</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm text-white font-bold truncate">
                          Closed Alpha Pass Granted
                        </span>
                        <span className="font-headline text-xs text-[#adcae1]">VIP INVITE</span>
                      </div>
                      <p className="font-body text-xs text-[#c5c5da] mt-1">
                        Automatically invited to <span className="text-[#5cb6f9] font-semibold">Chronos Tactics</span> stress-test cohort due to 90+ REP rating.
                      </p>
                      <span className="text-[11px] text-[#adcae1] font-mono mt-1 block">Steam Key Activated • 3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#21274c] hover:bg-[#31365d] text-[#5cb6f9] hover:text-white font-headline text-xs uppercase tracking-wider font-bold transition-all"
                >
                  <span>Claim Your Gaming Passport</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6 — POWERS BOTH CREATORS AND ORGANIZERS                   */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
              B2B &amp; CREATOR INFRASTRUCTURE
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold mt-2 mb-3">
              POWERS BOTH CREATORS AND ORGANIZERS
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Engineered to give game studios precise telemetry and give esports tournament organizers hands-free bracket automation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Game Developers */}
            <div className="p-8 rounded-3xl bg-[#171c41] border border-[#21274c] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">terminal</span>
                  <span className="font-headline text-xs text-[#5cb6f9] font-bold uppercase tracking-wider">
                    Are You Building a Game?
                  </span>
                </div>
                <h3 className="font-headline text-2xl text-white font-bold mb-3">
                  FOR GAME DEVELOPERS
                </h3>
                <p className="font-body text-sm text-[#c5c5da] mb-6 leading-relaxed">
                  Connect directly with targeted hardware tiers and serious competitive players. Collect structured frame-by-frame telemetry, reproducible bug videos, and balance heatmaps.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { num: "01", title: "Launch Campaign & Set Cohorts", desc: "Define rig specs (RAM, GPU series, monitor refresh) and competitive rank requirements." },
                    { num: "02", title: "Telemetry Daemon Integration", desc: "Drop in lightweight SDK to capture minidump crash stacks without player privacy leakage." },
                    { num: "03", title: "Harvest Verified Feedback", desc: "Reproduction steps, video captures, and frametime traces flow straight into Jira / Linear." },
                    { num: "04", title: "Ship Confidently", desc: "Eliminate day-one netcode collapse and launch with high player retention." },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3 p-3 rounded-xl bg-[#050930]/80 border border-[#21274c]/40">
                      <span className="font-mono text-[#5cb6f9] font-bold text-xs mt-0.5">{step.num}</span>
                      <div>
                        <h5 className="font-headline text-sm text-white font-bold">{step.title}</h5>
                        <p className="font-body text-xs text-[#c5c5da] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/for-developers"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#233dff] hover:bg-[#324bff] text-white font-headline text-sm uppercase tracking-wider font-bold transition-all"
              >
                <span>Explore Developer Solutions</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            {/* For Tournament Hosts */}
            <div className="p-8 rounded-3xl bg-[#171c41] border border-[#21274c] shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">stadium</span>
                  <span className="font-headline text-xs text-[#5cb6f9] font-bold uppercase tracking-wider">
                    Want to Host a Tournament?
                  </span>
                </div>
                <h3 className="font-headline text-2xl text-white font-bold mb-3">
                  FOR TOURNAMENT HOSTS
                </h3>
                <p className="font-body text-sm text-[#c5c5da] mb-6 leading-relaxed">
                  From grassroots college scrims to enterprise esports cups, automate every bracket. Eliminate administrative dispute headaches with smart escrow and automated check-ins.
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { num: "01", title: "Configure Bracket & Escrow", desc: "Set single/double elimination or Swiss rounds, lock prize pool into audited escrow." },
                    { num: "02", title: "Distribute & Auto-Seed", desc: "Share one-click Discord registration links; Riyadah MMR algorithm auto-balances brackets." },
                    { num: "03", title: "Automated Match Flow", desc: "Discord bot auto-assigns match rooms, verifies score screenshots, and advances winners." },
                    { num: "04", title: "Instant Escrow Payout", desc: "Prize pools automatically disburse to winning captains' bank/UPI accounts without delay." },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3 p-3 rounded-xl bg-[#050930]/80 border border-[#21274c]/40">
                      <span className="font-mono text-[#5cb6f9] font-bold text-xs mt-0.5">{step.num}</span>
                      <div>
                        <h5 className="font-headline text-sm text-white font-bold">{step.title}</h5>
                        <p className="font-body text-xs text-[#c5c5da] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/tournaments"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#3698d9] hover:bg-[#5cb6f9] text-[#001e31] font-headline text-sm uppercase tracking-wider font-bold transition-all"
              >
                <span>Learn About Hosting</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7 — WHY RIYADAH ELITE (5 VALUE PILLARS)                   */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/70">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
              THE UNFAIR ADVANTAGE
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold mt-2 mb-3">
              WHY GAMERS &amp; STUDIOS CHOOSE RIYADAH ELITE
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Built from the ground up to solve the authenticity crisis in game testing and eliminate tournament organizer payout disputes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: "person_check",
                title: "REAL PLAYERS",
                desc: "No bot farms or low-effort generic survey clickers. Authenticated competitive gamers matched by exact mechanical rank, GPU telemetry, and ping threshold.",
                pill: "Rig & Rank Authenticated",
              },
              {
                num: "02",
                icon: "data_object",
                title: "REAL FEEDBACK",
                desc: "Structured video timestamps, memory crash dumps, and reproducible step logs directly compatible with studio JIRA/Linear software development lifecycles.",
                pill: "Jira / Linear Sync Ready",
              },
              {
                num: "03",
                icon: "format_image_left",
                title: "REAL COMPETITION",
                desc: "Kernel-level hardware anti-cheat compliance, 128-tick dedicated MENA/South Asia low-ping servers, and certified rank tiers prevent smurfing and exploits.",
                pill: "128-Tick Clean Matchmaking",
              },
              {
                num: "04",
                icon: "lock_clock",
                title: "INSTANT ESCROW",
                desc: "All prize pools and tester bounties are 100% pre-funded in audited escrow accounts and disbursed automatically to winners within 120 minutes of match closure.",
                pill: "Guaranteed Payout Timelines",
              },
              {
                num: "05",
                icon: "badge",
                title: "ONE UNIFIED IDENTITY",
                desc: "Your cross-game passport tracks both your bug hunting telemetry reputation and esports podium finishes in one portable profile. Studio developers scout top players directly from the platform, bypassing standard closed-beta waitlists.",
                pill: "Portable Cross-Game Telemetry",
                span2: true,
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className={`p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col justify-between ${
                  pillar.span2 ? "lg:col-span-2" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline text-2xl font-bold text-[#5cb6f9] font-mono">
                      {pillar.num}
                    </span>
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">
                      {pillar.icon}
                    </span>
                  </div>
                  <h4 className="font-headline text-lg text-white font-bold mb-2">
                    {pillar.title}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-[#c5c5da] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#21274c]/50 flex items-center gap-2 text-xs font-headline text-[#adcae1]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5cb6f9]"></span>
                  <span>{pillar.pill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 8 — DRAMATIC FINAL CTA                                    */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="w-full rounded-3xl bg-[#13183d] border border-[#21274c] relative overflow-hidden p-8 sm:p-14 shadow-2xl flex flex-col items-center text-center">
            <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#233dff]/25 rounded-full blur-[120px]"></div>
            <div className="relative z-10 max-w-3xl">
              <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
                GET STARTED IN 60 SECONDS
              </span>
              <h2 className="font-headline text-3xl sm:text-5xl text-white uppercase tracking-tight font-bold mt-2 mb-4">
                READY TO GET IN THE GAME?
              </h2>
              <p className="font-body text-base text-[#c5c5da] mb-8">
                Discover upcoming games. Test new experiences. Join tournaments. Build your gaming journey today on Riyadah Elite.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Link
                  to="/games"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm uppercase tracking-wider font-bold shadow-[0_4px_24px_rgba(35,61,255,0.5)] hover:scale-[1.02] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">science</span>
                  <span>Explore Games</span>
                </Link>
                <Link
                  to="/tournaments"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#21274c] hover:bg-[#31365d] text-[#5cb6f9] hover:text-white font-headline text-sm uppercase tracking-wider font-bold border border-[#5cb6f9]/30 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                  <span>Find Tournaments</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-headline">
                <Link
                  to="/for-developers"
                  className="text-[#c5c5da] hover:text-[#5cb6f9] flex items-center gap-1 transition-colors"
                >
                  <span>For Game Developers</span>
                  <span className="text-[#5cb6f9]">➔</span>
                  <span className="text-white font-bold underline decoration-[#5cb6f9]/50">
                    Test Your Game
                  </span>
                </Link>
                <span className="text-[#444557]">•</span>
                <Link
                  to="/game-rights-ownership"
                  className="text-[#c5c5da] hover:text-[#5cb6f9] flex items-center gap-1 transition-colors"
                >
                  <span>Studio Rights</span>
                  <span className="text-[#5cb6f9]">➔</span>
                  <span className="text-white font-bold underline decoration-[#5cb6f9]/50">
                    Verify Game Ownership
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
