import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForDevelopersPage: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<"pc" | "console">("pc");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Riyadah Elite protect our game from leaks?",
      a: "Every playtester signs a legally binding NDA with biometric or verified digital signature verification. Furthermore, game sessions can be launched via our watermarked wrapper which injects invisible, unique steganographic identifiers into the render pipeline to trace unauthorized screenshots or video captures back to the specific tester.",
    },
    {
      q: "Do we need to integrate an SDK into our codebase?",
      a: "SDK integration is completely optional. You can distribute standalone private builds or issue Steam Beta keys. However, dropping our lightweight C++ / Blueprint SDK into Unreal Engine or Unity package into Unity provides automated frame-time hooks, heatmaps, and crash dumps without requiring manual log uploads.",
    },
    {
      q: "How are playtesters compensated and motivated?",
      a: "Testers are rewarded through our escrowed bounty framework and platform reputation progression. High-quality bug reports with verified reproduction steps earn developer-backed cash bounties, exclusive profile credentials, and early access to marquee tournament titles.",
    },
    {
      q: "Can we test custom regional routing and latency?",
      a: "Yes. You can isolate testers by ping threshold, specific ISP, and geographical regions including MENA, South Asia, Europe, and North America to evaluate tickrate stability and server mesh handshakes under real-world internet routing conditions.",
    },
    {
      q: "How quickly can we launch a playtest campaign?",
      a: "Once your developer organization is verified (typically under 2 hours), you can configure your cohort criteria, upload the build, and notify matching gamers in under 15 minutes.",
    },
    {
      q: "Can we export bug reports directly into Jira or GitHub?",
      a: "Yes. Riyadah Elite provides native webhook integrations with Jira, Linear, GitHub Issues, and Discord so that incoming bug reports, video replays, and crash dumps populate directly into your sprint backlog.",
    },
  ];

  return (
    <div className="flex flex-col w-full text-[#dfe0ff]">
      {/* ================================================================= */}
      {/* SECTION 1: HERO SECTION                                           */}
      {/* ================================================================= */}
      <section className="relative w-full py-16 overflow-hidden">
        {/* Atmospheric Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#233dff]/20 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#3698d9]/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Content Left */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#21274c]/80 border border-[#5cb6f9]/20 backdrop-blur-md mb-6">
                <span className="material-symbols-outlined text-[#5cb6f9] text-[18px]">bolt</span>
                <span className="font-headline text-xs tracking-widest text-[#5cb6f9] uppercase font-bold">
                  B2B GAME TESTING &amp; TELEMETRY NETWORK
                </span>
              </div>

              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-tight font-bold mb-4">
                Put your game in front of{" "}
                <span className="text-[#5cb6f9] drop-shadow-[0_0_24px_rgba(146,204,255,0.35)]">
                  real players.
                </span>
              </h1>

              <p className="font-headline text-lg sm:text-xl text-[#adcae1] font-semibold mb-4">
                Recruit verified playtesters, collect frame-by-frame telemetry, and eliminate bugs before your commercial launch.
              </p>

              <p className="font-body text-sm sm:text-base text-[#c5c5da] max-w-xl mb-8 leading-relaxed">
                Riyadah Elite connects indie creators and AAA studios directly with targeted gamer cohorts across specific GPUs, netcode environments, and competitive tiers.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
                <a
                  href="#campaign-builder"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm tracking-wider uppercase font-bold shadow-[0_4px_24px_rgba(35,61,255,0.5)] hover:shadow-[0_0_32px_rgba(54,152,217,0.7)] hover:scale-[1.02] transition-all"
                >
                  [ Test Your Game → ]
                </a>
                <Link
                  to="/game-rights-ownership"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#21274c]/80 border border-[#5cb6f9]/30 text-[#92ccff] hover:text-white font-headline text-sm tracking-wider uppercase font-bold hover:bg-[#31365d] transition-all"
                >
                  [ Rights &amp; Ownership ]
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-headline text-[#c5c5da]">
                <span className="inline-flex items-center gap-1.5 text-[#dfe0ff]">
                  <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">verified</span> Zero bot farms
                </span>
                <span className="text-[#444557]">•</span>
                <span className="inline-flex items-center gap-1.5 text-[#dfe0ff]">
                  <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">memory</span> Kernel telemetry
                </span>
                <span className="text-[#444557]">•</span>
                <span className="inline-flex items-center gap-1.5 text-[#dfe0ff]">
                  <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">lock</span> Custom NDA protected
                </span>
              </div>
            </div>

            {/* Hero Telemetry Console Right */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl bg-[#050930]/90 border border-[#21274c] backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(5,9,48,0.7)]">
                {/* Console Window Header */}
                <div className="flex items-center justify-between pb-4 mb-4 bg-[#13183d]/60 px-4 py-2.5 rounded-xl border border-[#21274c]/50">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#5cb6f9] animate-pulse"></span>
                    <span className="font-headline text-sm text-white font-bold">Cyber Strike (Beta 0.8)</span>
                    <span className="text-[#8f8fa3] text-xs font-mono">— UE5 Campaign</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#233dff]/30 text-[#5cb6f9] font-headline text-xs font-bold tracking-widest uppercase border border-[#5cb6f9]/30">
                    LIVE SESSION
                  </span>
                </div>

                {/* Dashboard Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-[#13183d]/70 border border-[#21274c]/40">
                    <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-1">Active Testers</div>
                    <div className="font-headline text-xl text-white font-bold">
                      1,248 <span className="text-[#8f8fa3] font-normal text-xs">/ 2,000</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#2c3258] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#5cb6f9] rounded-full" style={{ width: "62.4%" }}></div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#13183d]/70 border border-[#21274c]/40">
                    <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-1">Feedback Reports</div>
                    <div className="font-headline text-xl text-[#5cb6f9] font-bold">387</div>
                    <span className="text-[11px] text-[#92ccff] font-headline">98% Verified</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#13183d]/70 border border-[#21274c]/40">
                    <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-1">Bug Reports</div>
                    <div className="font-headline text-xl text-white font-bold">
                      94 <span className="text-[#ffb4ab] text-xs">(4 P0)</span>
                    </div>
                    <span className="text-[11px] text-[#ffb4ab] font-headline">P0 Crash Triage</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#13183d]/70 border border-[#21274c]/40">
                    <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-1">Overall Rating</div>
                    <div className="font-headline text-xl text-white font-bold flex items-center gap-1">
                      4.6 <span className="material-symbols-outlined text-[#5cb6f9] text-[18px]">star</span>
                    </div>
                    <span className="text-[11px] text-[#8f8fa3]">Across 1,248 Sessions</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#13183d]/70 border border-[#21274c]/40 col-span-1 sm:col-span-2">
                    <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-1">Mean Playtime</div>
                    <div className="font-headline text-xl text-white font-bold">
                      48.2 mins <span className="text-[#5cb6f9] text-xs font-normal">+14% vs target</span>
                    </div>
                    <span className="text-[11px] text-[#8f8fa3]">Median completion: 3.4 rounds</span>
                  </div>
                </div>

                {/* Mini Live Event Ticker */}
                <div className="space-y-2 pt-2">
                  <div className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider px-1">
                    Live Telemetry Ingestion
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#13183d]/60 text-xs">
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[18px]">sports_esports</span>
                    <span className="text-[#c5c5da] truncate">
                      <strong className="text-white">Rahul Sharma (RTX 4070)</strong> logged netcode tickrate spike at 14:22
                    </span>
                    <span className="ml-auto text-[#8f8fa3] whitespace-nowrap">just now</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#13183d]/60 text-xs">
                    <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">bug_report</span>
                    <span className="text-[#c5c5da] truncate">
                      <strong className="text-[#ffb4ab]">Critical Bug #041:</strong> Ledge mantle collision drop verified
                    </span>
                    <span className="ml-auto text-[#8f8fa3] whitespace-nowrap">2m ago</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#13183d]/60 text-xs">
                    <span className="material-symbols-outlined text-[#92ccff] text-[18px]">rate_review</span>
                    <span className="text-[#c5c5da] truncate">
                      <strong className="text-white">Feedback:</strong> Weapon spray feels responsive, recoil balanced
                    </span>
                    <span className="ml-auto text-[#8f8fa3] whitespace-nowrap">4m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: THE PROBLEM                                            */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/60">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/30 mb-3">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[16px]">warning</span>
              <span className="font-headline text-xs text-[#ffb4ab] uppercase font-bold tracking-wider">
                The QA Bottleneck
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight mb-2">
              Building a game is only half the battle.
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Internal QA and developer friends will never expose what happens when 5,000 real players load your netcode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: "01 / Scarcity",
                icon: "group_off",
                title: "Not Enough Testers",
                desc: "Finding qualified gamers across targeted PC rigs, specialized displays, and regional server nodes is slow, expensive, and manual.",
              },
              {
                num: "02 / Bias",
                icon: "psychology_alt",
                title: "Limited & Biased Feedback",
                desc: "Friends and studio colleagues suffer from familiarity bias and cannot mirror your diverse, highly critical commercial audience.",
              },
              {
                num: "03 / Edge Cases",
                icon: "radar",
                title: "Bugs Hide in Real Play",
                desc: "Corner cases, micro-stutters, and desync anomalies only emerge under authentic multiplayer stress and high-concurrency matches.",
              },
              {
                num: "04 / Day 1 Risk",
                icon: "thumb_down",
                title: "Launch Uncertainty",
                desc: "Going live on Steam or Epic without large-scale telemetry validation risks devastating 'Mostly Negative' Day-1 player reviews.",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="p-6 rounded-2xl bg-[#171c41]/80 border border-[#21274c] backdrop-blur-md transition-all hover:bg-[#21274c]/80"
              >
                <div className="w-12 h-12 rounded-xl bg-[#21274c] flex items-center justify-center text-[#5cb6f9] mb-4 shadow-md">
                  <span className="material-symbols-outlined text-[26px]">{p.icon}</span>
                </div>
                <div className="font-headline text-xs text-[#5cb6f9] font-bold tracking-widest uppercase mb-1">
                  {p.num}
                </div>
                <h3 className="font-headline text-lg text-white font-bold mb-2">{p.title}</h3>
                <p className="font-body text-xs sm:text-sm text-[#c5c5da] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: THE 6-STEP DEVELOPER PIPELINE                          */}
      {/* ================================================================= */}
      <section className="w-full py-16" id="how-it-works">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21274c] mb-2">
                <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">linear_scale</span>
                <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                  End-to-End Workflow
                </span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight">
                The developer testing pipeline.
              </h2>
            </div>
            <p className="font-body text-sm sm:text-base text-[#c5c5da] max-w-md">
              From build upload to verified launch readiness in six streamlined phases engineered for technical leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "01",
                title: "Create Your Test",
                desc: "Upload your private encrypted executable, issue Steam beta keys, or drop our lightweight telemetry SDK into Unreal Engine or Unity in under 10 minutes.",
                tag: "SDK v4.8.2 Ready",
              },
              {
                num: "02",
                title: "Define Target Cohort",
                desc: "Filter testers by GPU (e.g. RTX 3060 vs 4080), system memory, input device, competitive skill rank, and server routing region.",
                tag: "Granular Hardware Selectors",
              },
              {
                num: "03",
                title: "Recruit Verified Players",
                desc: "Automate invitations to our pre-vetted gamer pool with guaranteed play histories, verified reputations, and legally enforceable NDAs.",
                tag: "100% KYC & Screened",
              },
              {
                num: "04",
                title: "Run Scheduled Stress Tests",
                desc: "Execute synchronized 90-minute stress tests to overload matchmaking servers, weekend competitive lobbies, or 24/7 continuous test cycles.",
                tag: "High Concurrency Ingestion",
              },
              {
                num: "05",
                title: "Collect Structured Feedback",
                desc: "Review timestamped 60fps video clips, automated minidumps, DXDiag reports, and rubric-rated gameplay surveys straight from the client.",
                tag: "Frame Telemetry Logs",
              },
              {
                num: "06",
                title: "Iterate & Polish",
                desc: "Push hotfix patches to the same cohort, track issue resolution rates, and verify community consensus before your public debut.",
                tag: "Regression Confirmation",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#171c41]/80 border border-[#21274c] flex flex-col justify-between"
              >
                <div>
                  <span className="font-headline text-3xl text-[#bcc2ff]/40 font-bold block mb-2 font-mono">
                    {step.num}
                  </span>
                  <h3 className="font-headline text-lg text-white font-bold mb-2">{step.title}</h3>
                  <p className="font-body text-xs sm:text-sm text-[#c5c5da] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#21274c]/50 flex items-center gap-2 text-[#5cb6f9] font-headline text-xs">
                  <span className="material-symbols-outlined text-[16px]">done</span>
                  <span>{step.tag}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="#campaign-builder"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm tracking-wider uppercase font-bold shadow-[0_4px_24px_rgba(35,61,255,0.4)] hover:shadow-[0_0_32px_rgba(54,152,217,0.6)] hover:scale-[1.02] transition-all"
            >
              [ Start Your First Test → ]
            </a>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: INTERACTIVE CAMPAIGN BUILDER PREVIEW                   */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/80" id="campaign-builder">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3698d9]/20 border border-[#5cb6f9]/30 mb-3">
              <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">dashboard_customize</span>
              <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                Mission Configurator
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight mb-2">
              Build a testing campaign that fits your game.
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Configure your playtest parameters in under 5 minutes with fine-grained studio controls.
            </p>
          </div>

          {/* Interactive Form Simulator */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                  Game Title
                </label>
                <div className="flex items-center px-4 py-3 rounded-xl bg-[#050930] text-white font-headline text-sm font-semibold border border-[#21274c]">
                  <span className="material-symbols-outlined text-[#5cb6f9] mr-2 text-[20px]">videogame_asset</span>
                  Cyber Strike
                </div>
              </div>
              <div>
                <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                  Engine &amp; Build Version
                </label>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#050930] text-white font-headline text-sm font-semibold border border-[#21274c]">
                  <span>Unreal Engine 5.4</span>
                  <span className="px-2 py-0.5 rounded bg-[#21274c] text-[#5cb6f9] text-xs font-mono">v0.8.4-RC2</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                  Target Platform
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPlatform("pc")}
                    className={`flex-1 py-2.5 rounded-xl font-headline text-xs font-bold uppercase transition-all ${
                      selectedPlatform === "pc"
                        ? "bg-[#233dff] text-white shadow-md"
                        : "bg-[#21274c] text-[#c5c5da] hover:text-white"
                    }`}
                  >
                    PC (Windows)
                  </button>
                  <button
                    onClick={() => setSelectedPlatform("console")}
                    className={`flex-1 py-2.5 rounded-xl font-headline text-xs font-bold uppercase transition-all ${
                      selectedPlatform === "console"
                        ? "bg-[#233dff] text-white shadow-md"
                        : "bg-[#21274c] text-[#c5c5da] hover:text-white"
                    }`}
                  >
                    Console
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                  Testing Protocol
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-[#050930] text-[#5cb6f9] font-headline text-xs font-semibold flex items-center justify-between border border-[#21274c]">
                  <span>Closed Beta (NDA Protected)</span>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                  Capacity &amp; Window
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-[#050930] text-[#dfe0ff] font-headline text-xs flex items-center justify-between border border-[#21274c]">
                  <span className="font-bold">2,000 Testers</span>
                  <span className="text-[#8f8fa3]">14 Days Run</span>
                </div>
              </div>
            </div>

            {/* Selected Focus Vectors */}
            <div className="mb-6">
              <label className="block font-headline text-xs text-[#8f8fa3] uppercase tracking-wider mb-2">
                Selected Telemetry Vectors
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Netcode & Hitreg", "GPU Frametimes", "Collision Physics", "Onboarding UX"].map((vec) => (
                  <div
                    key={vec}
                    className="p-3 rounded-xl bg-[#233dff]/15 border border-[#5cb6f9]/30 flex items-center gap-2 text-[#5cb6f9] font-headline text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{vec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bounty Allocation & Action */}
            <div className="p-4 rounded-2xl bg-[#171c41] border border-[#21274c] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3698d9]/20 flex items-center justify-center text-[#5cb6f9]">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <div>
                  <div className="font-headline text-xs text-[#8f8fa3] uppercase">Tester Incentives &amp; Escrow</div>
                  <div className="font-headline text-base text-white font-bold">
                    ₹120,000 Prize Pool + Verified Badges
                  </div>
                </div>
              </div>
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#233dff] hover:bg-[#324bff] text-white font-headline text-xs tracking-wider uppercase font-bold transition-all shadow-md text-center"
              >
                Deploy Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: ENTERPRISE TRUST & COMPLIANCE                          */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21274c] mb-3">
              <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">lock</span>
              <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                Studio IP Security
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight mb-2">
              Built for secure, responsible game testing.
            </h2>
            <p className="font-body text-base text-[#c5c5da]">
              Your unreleased intellectual property, proprietary assets, and lore are safeguarded by enterprise-grade protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: "history_edu", title: "Enforced NDAs", desc: "Legally binding, timestamped agreements signed per campaign." },
              { icon: "enhanced_encryption", title: "Encrypted Builds", desc: "AES-256 encrypted binaries with hardware token revocation." },
              { icon: "water_drop", title: "Watermarked Streams", desc: "Dynamic player ID steganography to trace unapproved leaks." },
              { icon: "fingerprint", title: "Hardware Locks", desc: "Single-machine locks preventing key sharing or virtualization." },
              { icon: "security", title: "Anti-Cheat Guard", desc: "Fully compatible with Vanguard, Easy Anti-Cheat, and BattlEye." },
            ].map((sec) => (
              <div
                key={sec.title}
                className="p-5 rounded-2xl bg-[#171c41] border border-[#21274c] text-center flex flex-col items-center"
              >
                <span className="material-symbols-outlined text-[#5cb6f9] text-[30px] mb-3">
                  {sec.icon}
                </span>
                <h3 className="font-headline text-sm text-white font-bold uppercase mb-1">{sec.title}</h3>
                <p className="font-body text-xs text-[#c5c5da]">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: FAQ ACCORDION                                          */}
      {/* ================================================================= */}
      <section className="w-full py-16 bg-[#050930]/70">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21274c] mb-3">
              <span className="material-symbols-outlined text-[#5cb6f9] text-[16px]">help</span>
              <span className="font-headline text-xs text-[#5cb6f9] uppercase font-bold tracking-wider">
                Frequently Asked Questions
              </span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl text-white uppercase font-bold tracking-tight">
              Developer inquiries answered.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-[#171c41] border border-[#21274c] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-headline text-sm sm:text-base text-white font-bold select-none focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-[#5cb6f9] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-[#21274c]/50 font-body text-xs sm:text-sm text-[#c5c5da] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7: FINAL HIGH-IMPACT STUDIO BANNER                        */}
      {/* ================================================================= */}
      <section className="w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="p-8 sm:p-14 rounded-3xl bg-[#13183d] border border-[#21274c] relative overflow-hidden shadow-2xl text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#233dff]/20 via-transparent to-[#5cb6f9]/15"></div>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <span className="material-symbols-outlined text-[#5cb6f9] text-[48px] mb-3">
                rocket_launch
              </span>
              <h2 className="font-headline text-3xl sm:text-5xl text-white uppercase tracking-tight font-bold mb-3">
                Your game deserves real players.
              </h2>
              <p className="font-body text-base text-[#c5c5da] mb-8">
                Launch your first testing campaign today. Onboard your engineering team in under 15 minutes and secure your launch.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm tracking-wider uppercase font-bold shadow-[0_4px_24px_rgba(35,61,255,0.5)] hover:shadow-[0_0_32px_rgba(54,152,217,0.7)] hover:scale-[1.02] transition-all"
                >
                  [ Test Your Game Now ]
                </Link>
                <Link
                  to="/game-rights-ownership"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#21274c] border border-[#5cb6f9]/30 text-[#92ccff] hover:text-white font-headline text-sm tracking-wider uppercase font-bold hover:bg-[#31365d] transition-all"
                >
                  [ Ownership Verification ]
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForDevelopersPage;
