import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";

export const GameTestingDiscoveryPage: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState("All");
  const [activeGenre, setActiveGenre] = useState("All");
  const [activeStage, setActiveStage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const campaigns = [
    {
      id: "cyber-strike",
      title: "Cyber Strike",
      version: "Build Candidate v0.8.4-RC2",
      studio: "XYZ Studios",
      genre: "Tactical FPS / 5v5",
      platform: "PC Windows",
      phase: "Open Beta",
      engine: "Unreal Engine 5.4.3",
      tickRate: "128Hz",
      ping: "18.4 ms",
      bountyPool: "₹120,000",
      joined: 1248,
      capacity: 2000,
      daysLeft: 4,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE",
      description:
        "Stress testing next-generation destructible cover systems and high-tickrate competitive hit registration on Middle East servers. Studio is directly rewarding bug reproductions with monetary bounties and tournament whitelisting.",
      modules: ["Gameplay Balance", "Multiplayer Netcode", "GPU Performance", "WASD Ergonomics"],
    },
    {
      id: "neon-racers-overdrive",
      title: "Neon Racers: Overdrive",
      version: "Alpha v0.4.1",
      studio: "Velocity Interactive",
      genre: "Anti-Gravity Racing",
      platform: "PC / PS5",
      phase: "Closed Alpha",
      engine: "Custom Physics Engine",
      tickRate: "144Hz",
      ping: "22.1 ms",
      bountyPool: "₹85,000",
      joined: 450,
      capacity: 600,
      daysLeft: 7,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjSV4FWcC-pidZRKLV02BpLXMzkkEH7ttNUws7xndD8k6hUV-oOfvl19xaOfNB8WWz-QQlv0MyPMhPqhtfTEpU2y_4fu0cBrLx8NR6CmplaZvDA4zaOJHc6S0pqel_Y38w1w3WNWwVS-GFnpYYUpOUnf59xDyALBPTsDJ872iTmL4zNhriqCwkHAWIjeiSSs70VXeblrdqwxWa5AoiruplQLEKoVpkJYr2yZS5bUW9VBCSjaIa1ms",
      description:
        "Testing ultra-high-speed hover collision buffers and multi-screen ultrawide display rendering. Rewarding telemetry on sudden collision frame drops.",
      modules: ["Collision Physics", "Audio Doppler", "VRAM Overhead", "Gamepad Deadzones"],
    },
    {
      id: "chronos-tactics",
      title: "Chronos Tactics",
      version: "Playtest v1.0.2",
      studio: "Aetherial Labs",
      genre: "Turn-based Strategy",
      platform: "PC Windows",
      phase: "Open Playtest",
      engine: "Unity 6",
      tickRate: "60Hz",
      ping: "35.0 ms",
      bountyPool: "₹45,000",
      joined: 820,
      capacity: 1000,
      daysLeft: 12,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4",
      description:
        "Balance pass on timeline-manipulation spells and memory leak stress testing across 4+ hour marathon sessions with deep combat logs.",
      modules: ["Combat Balance", "Memory Footprint", "UI Scaling 4K", "Turn Sync"],
    },
    {
      id: "shadow-protocol",
      title: "Shadow Protocol",
      version: "Technical Alpha v0.3",
      studio: "Darkworks Studio",
      genre: "Stealth Extraction",
      platform: "PC Windows",
      phase: "Invite Only",
      engine: "Unreal Engine 5.3",
      tickRate: "64Hz",
      ping: "24.5 ms",
      bountyPool: "₹150,000",
      joined: 310,
      capacity: 400,
      daysLeft: 2,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuByELoxqagKtTmLsfPcqDbxHEVtliF_h9hW_SbtaeE4khYAmiUGvkVh8ucAtB435tnZ5S38iQkbnZKnkMYQ6ln8WOWph6H8lZonTLet6CfOYSuULGu1IDSi13p2cqfkzhTtGwYZt7nAw5QnTXB3AwV84ONw3L9OIMFCOIbBiS8fn6vfW8RP07qQL7jy1dUqb7PFoEbG_29n4x98ZtjBIPdGFUrROUk6xFQmhlKAe8ctXgT7vyzFCuI",
      description:
        "Evaluating dynamic volumetric shadows and flashlight occlusion nets when multiple rogue squads extract under heavy weather conditions.",
      modules: ["Dynamic Shadows", "Voice Proximity", "Desync Logs", "Extraction Triggers"],
    },
    {
      id: "voxel-realms-online",
      title: "Voxel Realms Online",
      version: "Server Stress Test v0.9",
      studio: "Blockforge Games",
      genre: "Sandbox MMO",
      platform: "PC / Cross-Play",
      phase: "Open Beta",
      engine: "Custom Voxel Engine",
      tickRate: "45Hz",
      ping: "41.2 ms",
      bountyPool: "₹60,000",
      joined: 2890,
      capacity: 3500,
      daysLeft: 9,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAOHbKj6XuEtQ6gSxtz2Ibn8SZNAVseRAS1YOgyfJNyBVa_FfvqHTlaLyd7EJXrfciSCQm_KlJ4ARmoEib10ndk7pa1pid4TZAaleb4cle9am8OS7FmFKEoasICp3a0S0J_iUAFCaVyUJ7vWNIz4On6CV0s7VjcXmjd80T5GpbhpLFNMYAPac6ZpebaA5vMF7_-TnACjoT3Xv4Q57JbDmsAxhRkuLtrnErdgrYlokBKErWBHPUaGl4",
      description:
        "Gathering massive concurrent player telemetry on persistent structural destruction with 500+ players in a single server chunk.",
      modules: ["Chunk Streaming", "Server Load", "Voxel Sync", "Inventory Ledger"],
    },
    {
      id: "apex-strikers-mobile",
      title: "Apex Strikers Mobile",
      version: "Regional Soft Launch",
      studio: "Nebula Mobile",
      genre: "3v3 Arena Brawler",
      platform: "Mobile (iOS / Android)",
      phase: "Closed Beta",
      engine: "Unity Mobile 2023",
      tickRate: "60Hz",
      ping: "28.0 ms",
      bountyPool: "₹70,000",
      joined: 1820,
      capacity: 2500,
      daysLeft: 14,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE",
      description:
        "Testing touch control latency, gyro aiming responsiveness, and thermal throttling stability on flagship and mid-range devices.",
      modules: ["Touch Latency", "Thermal Throttling", "Battery Drain", "Network Handover"],
    },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    if (
      activePlatform !== "All" &&
      !c.platform.toLowerCase().includes(activePlatform.toLowerCase())
    )
      return false;
    if (activeGenre !== "All" && !c.genre.toLowerCase().includes(activeGenre.toLowerCase()))
      return false;
    if (activeStage !== "All" && !c.phase.toLowerCase().includes(activeStage.toLowerCase()))
      return false;
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.studio.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />

      <main className="w-full pt-28 pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-10">
        {/* Breadcrumb & Node Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[#92ccff] hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#dfe0ff]">Testing Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
              <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
              Pipeline Node: Riyadh-01 Active
            </span>
            <span className="hidden sm:inline text-[#8f8fa3]">Esports & Telemetry Hub</span>
          </div>
        </div>

        {/* 1. Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#21274c]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#233dff]/15 text-[#92ccff] text-xs font-headline font-semibold tracking-wider uppercase mb-3 border border-[#233dff]/30">
              <span className="material-symbols-outlined text-[16px]">sports_esports</span>
              Verified Studio Playtesting
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
              TEST GAMES
            </h1>
            <p className="text-[#c5c5da] text-base sm:text-lg leading-relaxed">
              Discover upcoming titles, access unreleased competitive builds, log performance
              metrics, and earn studio telemetry bounties.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Active Builds</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                28
              </div>
              <div className="text-[10px] text-[#92ccff]">Verified QA</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Testers Active</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                4,850
              </div>
              <div className="text-[10px] text-[#5cb6f9]">Live Sessions</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Pool Vault</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-[#cce5ff] mt-0.5">
                ₹1.2M
              </div>
              <div className="text-[10px] text-[#92ccff]">Smart Escrow</div>
            </div>
          </div>
        </div>

        {/* 2. Filter & Search Control Bar */}
        <section className="p-5 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f8fa3] text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search games, studios, engines, or campaign titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#050930] border border-[#21274c] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-[#8f8fa3] focus:outline-none focus:border-[#92ccff] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8fa3] hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activePlatform}
                onChange={(e) => setActivePlatform(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">Platform: All</option>
                <option value="PC">PC Windows</option>
                <option value="PS5">PlayStation 5</option>
                <option value="Mobile">Mobile</option>
              </select>

              <select
                value={activeGenre}
                onChange={(e) => setActiveGenre(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">Genre: All</option>
                <option value="FPS">Tactical FPS</option>
                <option value="Racing">Racing</option>
                <option value="Strategy">Strategy</option>
                <option value="Stealth">Stealth</option>
                <option value="MMO">Sandbox MMO</option>
              </select>

              <select
                value={activeStage}
                onChange={(e) => setActiveStage(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">Phase: All</option>
                <option value="Beta">Beta</option>
                <option value="Alpha">Alpha</option>
                <option value="Playtest">Playtest</option>
              </select>

              {/* View Switcher */}
              <div className="flex items-center bg-[#050930] p-1 rounded-xl border border-[#21274c]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#233dff] text-white"
                      : "text-[#8f8fa3] hover:text-white"
                  }`}
                  title="Grid View"
                >
                  <span className="material-symbols-outlined text-[18px] block">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-[#233dff] text-white"
                      : "text-[#8f8fa3] hover:text-white"
                  }`}
                  title="List View"
                >
                  <span className="material-symbols-outlined text-[18px] block">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active criteria counts */}
          <div className="flex items-center justify-between text-xs text-[#8f8fa3] pt-2 border-t border-[#21274c]/50">
            <div>
              Showing <span className="text-[#92ccff] font-bold">{filteredCampaigns.length}</span>{" "}
              of {campaigns.length} active campaigns
            </div>
            {(activePlatform !== "All" ||
              activeGenre !== "All" ||
              activeStage !== "All" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setActivePlatform("All");
                  setActiveGenre("All");
                  setActiveStage("All");
                  setSearchQuery("");
                }}
                className="text-[#92ccff] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* 3. HERO FEATURED GAME BANNER (Cyber Strike) */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-[#13183d] border border-[#21274c] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left Media Column */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
              <div
                className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.7] contrast-[1.1] transform hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/60 to-transparent -z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#13183d]/40 to-[#13183d] lg:block hidden -z-10" />

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(35,61,255,0.7)]">
                  <span className="w-2 h-2 rounded-full bg-[#cce5ff] animate-ping" />
                  Featured Test Campaign
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#92ccff] text-xs font-semibold">
                  OPEN BETA • PC EXCLUSIVE
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#ff99a8] text-xs font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Closes in 4 days
                </span>
              </div>

              {/* Bottom Gameplay Telemetry Graphic Overlay */}
              <div className="bg-[#050930]/90 backdrop-blur-xl p-4 rounded-xl border border-[#21274c] max-w-lg shadow-xl mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#92ccff] text-[18px]">
                      troubleshoot
                    </span>
                    <span className="text-xs uppercase tracking-wider text-white font-semibold">
                      Engine Telemetry: UE 5.4.3
                    </span>
                  </div>
                  <span className="text-xs text-[#92ccff] font-mono">TICK: 128Hz</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-[#13183d] p-2 rounded border border-[#21274c]/60">
                    <div className="text-[#8f8fa3] text-[9px] uppercase font-bold">Target FPS</div>
                    <div className="text-white text-xs font-bold mt-0.5">165 FPS</div>
                  </div>
                  <div className="bg-[#13183d] p-2 rounded border border-[#21274c]/60">
                    <div className="text-[#8f8fa3] text-[9px] uppercase font-bold">Avg Ping</div>
                    <div className="text-[#92ccff] text-xs font-bold mt-0.5">18.4 ms</div>
                  </div>
                  <div className="bg-[#13183d] p-2 rounded border border-[#21274c]/60">
                    <div className="text-[#8f8fa3] text-[9px] uppercase font-bold">Build Hash</div>
                    <div className="text-[#c5c5da] text-xs font-bold mt-0.5">#UE5-920A</div>
                  </div>
                  <div className="bg-[#13183d] p-2 rounded border border-[#21274c]/60">
                    <div className="text-[#8f8fa3] text-[9px] uppercase font-bold">Bounty Pool</div>
                    <div className="text-[#cce5ff] text-xs font-bold mt-0.5">₹120,000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Information & CTAs */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#13183d]/95 backdrop-blur-2xl">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-xs font-headline font-bold text-[#92ccff] uppercase tracking-wider mb-1">
                    XYZ Studios • Tactical FPS
                  </div>
                  <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Cyber Strike
                  </h2>
                  <div className="text-xs font-mono text-[#8f8fa3] mt-1">
                    Build Candidate v0.8.4-RC2
                  </div>
                </div>

                <p className="text-sm text-[#c5c5da] leading-relaxed">
                  Stress testing next-generation destructible cover systems and high-tickrate
                  competitive hit registration on Middle East servers. Studio is directly rewarding
                  bug reproductions with monetary bounties and tournament whitelisting.
                </p>

                {/* Capacity Progress Bar */}
                <div className="flex flex-col gap-1.5 bg-[#21274c]/40 p-3.5 rounded-xl border border-[#21274c]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#c5c5da] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        how_to_reg
                      </span>
                      Tester Roster Capacity
                    </span>
                    <span className="text-white font-bold">
                      1,248 <span className="text-[#8f8fa3] font-normal">/ 2,000 joined</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#050930] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#233dff] to-[#5cb6f9] rounded-full shadow-[0_0_8px_rgba(92,182,249,0.8)]"
                      style={{ width: "62.4%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8f8fa3]">
                    <span>62.4% Filled</span>
                    <span className="text-[#92ccff] font-semibold">752 Positions Open</span>
                  </div>
                </div>

                {/* 4 Active Test Modules */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-headline font-bold uppercase tracking-wider text-[#8f8fa3]">
                    Active Test Modules:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-[#21274c]/50 p-2.5 rounded-lg border border-[#21274c]/70">
                      <span className="material-symbols-outlined text-[#92ccff] text-[16px]">
                        balance
                      </span>
                      <span className="text-xs text-white font-medium truncate">
                        Gameplay Balance
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#21274c]/50 p-2.5 rounded-lg border border-[#21274c]/70">
                      <span className="material-symbols-outlined text-[#92ccff] text-[16px]">
                        lan
                      </span>
                      <span className="text-xs text-white font-medium truncate">
                        Multiplayer Netcode
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#21274c]/50 p-2.5 rounded-lg border border-[#21274c]/70">
                      <span className="material-symbols-outlined text-[#92ccff] text-[16px]">
                        speed
                      </span>
                      <span className="text-xs text-white font-medium truncate">
                        GPU Performance
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#21274c]/50 p-2.5 rounded-lg border border-[#21274c]/70">
                      <span className="material-symbols-outlined text-[#92ccff] text-[16px]">
                        keyboard
                      </span>
                      <span className="text-xs text-white font-medium truncate">
                        WASD Ergonomics
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 mt-6 border-t border-[#21274c]">
                <Link
                  to="/games/cyber-strike"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all"
                >
                  <span>View Game & Requirements</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  to="/games/cyber-strike/apply"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#21274c] hover:bg-[#2b3363] text-[#92ccff] font-headline text-sm font-semibold transition-all border border-[#92ccff]/20"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Quick Apply</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Open Verified Campaigns Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
              <h2 className="font-headline text-2xl font-bold text-white">
                Open Verified Campaigns
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8f8fa3]">Real-Time Telemetry Feed</span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredCampaigns.map((game) => (
              <article
                key={game.id}
                className="group relative flex flex-col justify-between bg-[#13183d] hover:bg-[#181f4a] rounded-2xl overflow-hidden border border-[#21274c] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(35,61,255,0.25)]"
              >
                <div>
                  {/* Card Media Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#21274c]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${game.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/40 to-transparent" />
                    {/* Phase Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#233dff]/90 text-white font-headline text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {game.phase}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#050930]/80 text-[#92ccff] font-mono text-[10px]">
                        {game.platform}
                      </span>
                    </div>
                    {/* Bounty Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#050930]/90 backdrop-blur-md text-[#cce5ff] border border-[#21274c] font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px] text-[#92ccff]">
                          payments
                        </span>
                        {game.bountyPool}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <div className="text-xs font-headline font-semibold text-[#92ccff] uppercase tracking-wider">
                        {game.studio}
                      </div>
                      <h3 className="font-headline text-xl font-bold text-white group-hover:text-[#92ccff] transition-colors mt-0.5">
                        {game.title}
                      </h3>
                      <div className="text-[11px] font-mono text-[#8f8fa3]">{game.version}</div>
                    </div>

                    <p className="text-xs text-[#c5c5da] line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1 bg-[#050930] p-2.5 rounded-xl border border-[#21274c]/50">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#8f8fa3]">Roster</span>
                        <span className="text-white font-semibold">
                          {game.joined} / {game.capacity}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#21274c] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5cb6f9] rounded-full"
                          style={{ width: `${(game.joined / game.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Test Modules */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {game.modules.slice(0, 3).map((mod, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#21274c] text-[#dfe0ff] text-[10px] font-mono"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <Link
                    to={game.id === "cyber-strike" ? "/games/cyber-strike" : `/games/${game.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-[#21274c] hover:bg-[#233dff] hover:text-white text-[#92ccff] font-headline text-xs font-bold transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    to={
                      game.id === "cyber-strike"
                        ? "/games/cyber-strike/apply"
                        : `/games/${game.id}/apply`
                    }
                    className="px-4 py-2.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    <span>Apply</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Bottom B2B / Tester Callout */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#050A30] via-[#13183d] to-[#050A30] border border-[#21274c] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs font-headline font-bold text-[#92ccff] uppercase tracking-wider">
              Earn Verified REP & Access High-Stakes Pro Testing
            </span>
            <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
              Looking for a specific game genre or studio?
            </h3>
            <p className="text-sm text-[#c5c5da]">
              Complete your testing passport profile to receive automated push invites for upcoming
              closed alphas matching your GPU, peripherals, and competitive ranks.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/games/cyber-strike/apply"
              className="btn-shimmer px-6 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-lg"
            >
              Update Tester Passport
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GameTestingDiscoveryPage;
