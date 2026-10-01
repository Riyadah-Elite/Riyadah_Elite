import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";

export const TournamentDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "bracket" | "schedule" | "rules">(
    "overview",
  );
  const [registered, setRegistered] = useState(false);

  const bracketRounds = [
    {
      name: "Quarterfinals",
      matches: [
        { team1: "Falcons Vega", score1: "2", team2: "Oryx Esports", score2: "0", winner: 1 },
        { team1: "Riyadah Sandstorm", score1: "2", team2: "Cyber Daggers", score2: "1", winner: 1 },
        { team1: "Apex Phoenix", score1: "1", team2: "Dune Raiders", score2: "2", winner: 2 },
        { team1: "Twisted Titans", score1: "2", team2: "Neon Horizon", score2: "0", winner: 1 },
      ],
    },
    {
      name: "Semifinals",
      matches: [
        { team1: "Falcons Vega", score1: "2", team2: "Riyadah Sandstorm", score2: "1", winner: 1 },
        { team1: "Dune Raiders", score1: "0", team2: "Twisted Titans", score2: "2", winner: 2 },
      ],
    },
    {
      name: "Grand Finals",
      matches: [
        {
          team1: "Falcons Vega",
          score1: "LIVE",
          team2: "Twisted Titans",
          score2: "LIVE",
          winner: 0,
        },
      ],
    },
  ];

  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />

      <main className="w-full pt-28 pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-10">
        {/* Breadcrumb & Escrow Guarantee */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[#92ccff] hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link to="/tournaments" className="text-[#92ccff] hover:underline">
              Tournaments
            </Link>
            <span>/</span>
            <span className="text-[#dfe0ff]">Valorant Community Cup (Season 4)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Verified Competition • ₹25,000 Escrow Guaranteed
            </span>
          </div>
        </div>

        {/* HERO TOURNAMENT BANNER */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-[#13183d] border border-[#21274c] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Visual Media Canvas */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
              <div
                className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.7] contrast-[1.1]"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/50 to-transparent -z-10" />

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg">
                  SEASON 04 MAJOR
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#92ccff] text-xs font-semibold">
                  VALORANT 5v5
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#cce5ff] text-xs font-semibold">
                  SINGLE ELIMINATION
                </span>
              </div>

              {/* Bottom Quick Host Tag */}
              <div className="bg-[#050930]/90 backdrop-blur-xl p-4 rounded-xl border border-[#21274c] max-w-md shadow-xl mt-auto">
                <div className="text-xs uppercase font-headline tracking-wider text-[#92ccff] font-semibold mb-1">
                  Hosted by Riyadah Gaming Community
                </div>
                <div className="text-xs text-[#c5c5da]">
                  Official community partner cup with anti-cheat telemetry and dedicated Discord
                  arbitration stewards.
                </div>
              </div>
            </div>

            {/* Right Information & Registration Callout */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#13183d]/95 backdrop-blur-2xl">
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#92ccff] uppercase tracking-wider">
                    Registration Open • 10 Slots Remaining
                  </span>
                  <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                    Valorant Community Cup
                  </h1>
                  <div className="text-xs font-mono text-[#8f8fa3] mt-1">
                    Season 04 • MENA North Regional Qualifier
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#050930] border border-[#21274c]">
                  <div>
                    <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
                      Prize Pool Vault
                    </span>
                    <div className="font-headline text-2xl font-bold text-[#cce5ff] mt-0.5">
                      ₹25,000
                    </div>
                    <span className="text-[10px] text-[#92ccff]">Instant Escrow</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
                      Bracket Roster
                    </span>
                    <div className="font-headline text-2xl font-bold text-white mt-0.5">
                      54 / 64 Teams
                    </div>
                    <span className="text-[10px] text-[#92ccff]">84% Filled</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-[#c5c5da]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f8fa3]">Entry Fee:</span>
                    <span className="font-semibold text-white">Free Entry</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f8fa3]">Platform:</span>
                    <span className="font-semibold text-white">PC Windows</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f8fa3]">Match Server:</span>
                    <span className="font-semibold text-white">Bahrain / DXB (Low Latency)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f8fa3]">Check-In Closes:</span>
                    <span className="font-semibold text-[#ff99a8]">Oct 02, 17:30 AST</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#21274c] flex flex-col gap-3">
                {registered ? (
                  <div className="p-3.5 rounded-xl bg-[#050930] border border-[#92ccff]/40 text-center">
                    <div className="text-xs font-headline font-bold text-[#92ccff] flex items-center justify-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Team Registered Successfully
                    </div>
                    <div className="text-[11px] text-[#8f8fa3] mt-0.5">
                      Check your Discord for bracket seeding confirmation.
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setRegistered(true)}
                      className="btn-shimmer flex-1 text-center py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">group_add</span>
                      <span>Register Pre-Made Team</span>
                    </button>
                    <button
                      onClick={() => setRegistered(true)}
                      className="px-4 py-3.5 rounded-xl bg-[#21274c] hover:bg-[#2b3363] text-[#92ccff] font-headline text-xs font-semibold transition-all border border-[#92ccff]/20"
                    >
                      Join Free Agent Pool
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 text-xs text-[#8f8fa3]">
                  <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                    shield
                  </span>
                  <span>Riot Vanguard Anti-Cheat Verification Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAB CONTROLS */}
        <div className="flex items-center gap-2 border-b border-[#21274c] pb-2 overflow-x-auto">
          {[
            { id: "overview" as const, label: "Tournament Overview" },
            { id: "bracket" as const, label: "Bracket & Matches" },
            { id: "schedule" as const, label: "Timeline & Schedule" },
            { id: "rules" as const, label: "Rules & Fair Play" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#233dff] text-white shadow"
                  : "text-[#8f8fa3] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & PRIZE POOL */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-10">
            {/* About Section */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
                <h2 className="font-headline text-2xl font-bold text-white">
                  About This Tournament
                </h2>
              </div>
              <p className="text-sm text-[#c5c5da] leading-relaxed max-w-4xl">
                The Valorant Community Cup Season 4 is a premier tactical 5v5 tournament organized
                to showcase competitive esports talent in the Gulf and MENA region. All matches are
                managed under official Riyadah Elite tournament rules with automated bracket
                progression and Smart Escrow payout disbursement directly to team captains upon
                match validation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#21274c]/60">
                <div className="p-4 rounded-xl bg-[#21274c]/30">
                  <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                    Match Stewards
                  </div>
                  <div className="text-xs text-[#c5c5da]">
                    Dedicated Discord lobby stewards assigned to resolve disputes in under 4
                    minutes.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#21274c]/30">
                  <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                    Live Broadcasts
                  </div>
                  <div className="text-xs text-[#c5c5da]">
                    Semi-Finals & Grand Finals cast in English and Arabic on YouTube and Twitch.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#21274c]/30">
                  <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                    Telemetry Proof
                  </div>
                  <div className="text-xs text-[#c5c5da]">
                    Automated match screenshot verification and Riot API kill-matrix logging.
                  </div>
                </div>
              </div>
            </section>

            {/* Prize Pool Distribution & Escrow */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff]">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#92ccff] uppercase">
                      Guaranteed Vault
                    </span>
                    <h2 className="font-headline text-2xl font-bold text-white">
                      Prize Pool Distribution & Escrow
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#050930] border border-[#21274c] text-xs font-mono text-[#92ccff]">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  <span>₹25,000 Locked in Smart Contract</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1st Place */}
                <div className="relative p-6 rounded-2xl bg-gradient-to-b from-[#21274c] to-[#13183d] border border-[#92ccff]/40 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded bg-[#233dff] text-white text-[11px] font-bold uppercase tracking-wider font-headline">
                        1st Place
                      </span>
                      <span className="material-symbols-outlined text-[#92ccff] text-[24px]">
                        trophy
                      </span>
                    </div>
                    <div className="font-headline text-3xl font-bold text-white mb-1">₹15,000</div>
                    <p className="text-xs text-[#92ccff] font-semibold">60% of Grand Pool</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#21274c] flex flex-col gap-1.5 text-xs text-[#c5c5da]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>5x Verified Champion Badges</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>+100 Tournament REP Score</span>
                    </div>
                  </div>
                </div>

                {/* 2nd Place */}
                <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded bg-[#21274c] text-[#92ccff] text-[11px] font-bold uppercase tracking-wider font-headline">
                        2nd Place
                      </span>
                      <span className="material-symbols-outlined text-[#8f8fa3] text-[24px]">
                        military_tech
                      </span>
                    </div>
                    <div className="font-headline text-3xl font-bold text-white mb-1">₹7,000</div>
                    <p className="text-xs text-[#92ccff] font-semibold">28% of Grand Pool</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#21274c] flex flex-col gap-1.5 text-xs text-[#c5c5da]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>5x Grand Finalist Badges</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>+50 Tournament REP Score</span>
                    </div>
                  </div>
                </div>

                {/* 3rd & 4th Place */}
                <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded bg-[#21274c] text-[#8f8fa3] text-[11px] font-bold uppercase tracking-wider font-headline">
                        3rd & 4th Place
                      </span>
                      <span className="material-symbols-outlined text-[#8f8fa3] text-[24px]">
                        workspace_premium
                      </span>
                    </div>
                    <div className="font-headline text-3xl font-bold text-white mb-1">
                      ₹1,500 <span className="text-sm font-normal text-[#8f8fa3]">each</span>
                    </div>
                    <p className="text-xs text-[#92ccff] font-semibold">12% Combined Split</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#21274c] flex flex-col gap-1.5 text-xs text-[#c5c5da]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>Semi-Finalist Profile Flair</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                        check_circle
                      </span>
                      <span>+25 Tournament REP Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: BRACKET & MATCHES */}
        {activeTab === "bracket" && (
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#233dff]" />
                <h2 className="font-headline text-2xl font-bold text-white">
                  Live Tournament Bracket
                </h2>
              </div>
              <span className="text-xs font-mono text-[#92ccff]">Best of 3 (Grand Finals Bo5)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bracketRounds.map((round, rIdx) => (
                <div key={rIdx} className="flex flex-col gap-4">
                  <div className="text-xs font-headline font-bold uppercase tracking-wider text-[#92ccff] pb-2 border-b border-[#21274c]">
                    {round.name}
                  </div>
                  <div className="flex flex-col gap-4 justify-around h-full">
                    {round.matches.map((match, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3.5 rounded-xl bg-[#050930] border border-[#21274c] flex flex-col gap-2 shadow"
                      >
                        <div
                          className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${
                            match.winner === 1
                              ? "bg-[#233dff]/20 text-white font-bold"
                              : "text-[#c5c5da]"
                          }`}
                        >
                          <span className="truncate">{match.team1}</span>
                          <span className="font-mono text-[#92ccff]">{match.score1}</span>
                        </div>
                        <div
                          className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${
                            match.winner === 2
                              ? "bg-[#233dff]/20 text-white font-bold"
                              : "text-[#c5c5da]"
                          }`}
                        >
                          <span className="truncate">{match.team2}</span>
                          <span className="font-mono text-[#92ccff]">{match.score2}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: SCHEDULE */}
        {activeTab === "schedule" && (
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
              <h2 className="font-headline text-2xl font-bold text-white">
                Tournament Schedule & Timeline
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  time: "Oct 02, 17:30 AST",
                  title: "Registration Closes",
                  desc: "All 64 rosters finalized and checked-in on Discord.",
                },
                {
                  time: "Oct 02, 18:00 AST",
                  title: "Bracket Generation & Seeding",
                  desc: "Automated seeds generated based on regional team MMR.",
                },
                {
                  time: "Oct 02, 18:30 AST",
                  title: "Round of 64 & Round of 32 Kick-off",
                  desc: "Best-of-1 simultaneous elimination matches across 16 lobbies.",
                },
                {
                  time: "Oct 03, 19:00 AST",
                  title: "Quarterfinals & Semifinals",
                  desc: "Best-of-3 series casted on official channel.",
                },
                {
                  time: "Oct 04, 20:00 AST",
                  title: "Grand Finals & Escrow Settlement",
                  desc: "Best-of-5 championship match with instant prize disbursement.",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#050930] border border-[#21274c]"
                >
                  <span className="text-xs font-mono text-[#92ccff] shrink-0 w-36">
                    {step.time}
                  </span>
                  <div>
                    <h3 className="font-headline text-sm font-bold text-white">{step.title}</h3>
                    <p className="text-xs text-[#c5c5da] mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: RULES */}
        {activeTab === "rules" && (
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
              <h2 className="font-headline text-2xl font-bold text-white">
                Rules & Fair Play Requirements
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#c5c5da]">
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c]">
                <h3 className="font-headline text-sm font-bold text-white mb-1">
                  Riot Vanguard Mandatory
                </h3>
                <p>
                  All players must have Vanguard running with clean integrity logs. Virtual machines
                  and emulators are strictly prohibited.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c]">
                <h3 className="font-headline text-sm font-bold text-white mb-1">
                  Server Latency Cap
                </h3>
                <p>
                  Matches are played on Bahrain or DXB servers. Ping differentials over 85ms will
                  trigger manual steward arbitration.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c]">
                <h3 className="font-headline text-sm font-bold text-white mb-1">
                  Pause & Technical Timeout
                </h3>
                <p>
                  Each team is allotted up to 10 minutes of technical timeout per match for
                  disconnects or hardware crashes.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c]">
                <h3 className="font-headline text-sm font-bold text-white mb-1">
                  Toxicity & Exploits
                </h3>
                <p>
                  Map geometry clipping or chat abuse results in immediate match forfeit and
                  temporary REP score penalty.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TournamentDetailsPage;
