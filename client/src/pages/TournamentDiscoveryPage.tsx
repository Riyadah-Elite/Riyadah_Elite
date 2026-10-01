import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";

export const TournamentDiscoveryPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const tournaments = [
    {
      id: "valorant-community-cup",
      title: "VALORANT COMMUNITY CUP",
      season: "SEASON 4",
      game: "Valorant",
      organizer: "Riyadah Gaming Community",
      format: "5v5 Tactical",
      bracket: "Single Elimination",
      platform: "PC Windows",
      region: "MENA North (DXB / BAH)",
      prizePool: "₹25,000",
      entryFee: "Free Entry",
      teamsJoined: 54,
      maxTeams: 64,
      status: "Registration Open",
      startsIn: "2 days",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4",
    },
    {
      id: "cs2-weekend-clash",
      title: "CS2 WEEKEND CLASH",
      season: "WEEK 12",
      game: "Counter-Strike 2",
      organizer: "Arab Esports League",
      format: "5v5 Competitive",
      bracket: "Double Elimination",
      platform: "PC Windows",
      region: "Middle East (Riyadh 128T)",
      prizePool: "₹50,000",
      entryFee: "₹99 / Team",
      teamsJoined: 30,
      maxTeams: 32,
      status: "Closing Soon",
      startsIn: "18 hours",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE",
    },
    {
      id: "apex-legends-trios-arena",
      title: "APEX LEGENDS TRIOS ARENA",
      season: "SEASON 20 CUP",
      game: "Apex Legends",
      organizer: "GCC Apex Hub",
      format: "3v3 Trios Battle Royale",
      bracket: "Custom Lobby Points",
      platform: "Cross-Play",
      region: "Bahrain GCE",
      prizePool: "₹35,000",
      entryFee: "Free Entry",
      teamsJoined: 18,
      maxTeams: 20,
      status: "Registration Open",
      startsIn: "4 days",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCjSV4FWcC-pidZRKLV02BpLXMzkkEH7ttNUws7xndD8k6hUV-oOfvl19xaOfNB8WWz-QQlv0MyPMhPqhtfTEpU2y_4fu0cBrLx8NR6CmplaZvDA4zaOJHc6S0pqel_Y38w1w3WNWwVS-GFnpYYUpOUnf59xDyALBPTsDJ872iTmL4zNhriqCwkHAWIjeiSSs70VXeblrdqwxWa5AoiruplQLEKoVpkJYr2yZS5bUW9VBCSjaIa1ms",
    },
    {
      id: "rocket-league-duo-showdown",
      title: "ROCKET LEAGUE DUO SHOWDOWN",
      season: "CHAMPIONSHIP SERIES",
      game: "Rocket League",
      organizer: "Velocity Esports",
      format: "2v2 Soccar",
      bracket: "Single Elimination",
      platform: "Cross-Play",
      region: "MENA West",
      prizePool: "₹18,000",
      entryFee: "Free Entry",
      teamsJoined: 60,
      maxTeams: 64,
      status: "Almost Full",
      startsIn: "3 days",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuByELoxqagKtTmLsfPcqDbxHEVtliF_h9hW_SbtaeE4khYAmiUGvkVh8ucAtB435tnZ5S38iQkbnZKnkMYQ6ln8WOWph6H8lZonTLet6CfOYSuULGu1IDSi13p2cqfkzhTtGwYZt7nAw5QnTXB3AwV84ONw3L9OIMFCOIbBiS8fn6vfW8RP07qQL7jy1dUqb7PFoEbG_29n4x98ZtjBIPdGFUrROUk6xFQmhlKAe8ctXgT7vyzFCuI",
    },
    {
      id: "tekken-8-iron-fist-open",
      title: "TEKKEN 8 IRON FIST OPEN",
      season: "PRO CIRCUIT #3",
      game: "Tekken 8",
      organizer: "FGC Arabia",
      format: "1v1 Fight",
      bracket: "Double Elimination",
      platform: "PS5 / PC",
      region: "Riyadh Local LAN & Online",
      prizePool: "₹30,000",
      entryFee: "Free Entry",
      teamsJoined: 112,
      maxTeams: 128,
      status: "Registration Open",
      startsIn: "5 days",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAOHbKj6XuEtQ6gSxtz2Ibn8SZNAVseRAS1YOgyfJNyBVa_FfvqHTlaLyd7EJXrfciSCQm_KlJ4ARmoEib10ndk7pa1pid4TZAaleb4cle9am8OS7FmFKEoasICp3a0S0J_iUAFCaVyUJ7vWNIz4On6CV0s7VjcXmjd80T5GpbhpLFNMYAPac6ZpebaA5vMF7_-TnACjoT3Xv4Q57JbDmsAxhRkuLtrnErdgrYlokBKErWBHPUaGl4",
    },
    {
      id: "overwatch-2-flashpoint-cup",
      title: "OVERWATCH 2 FLASHPOINT CUP",
      season: "COMMUNITY INVITATIONAL",
      game: "Overwatch 2",
      organizer: "Shield Guard League",
      format: "5v5 Role Queue",
      bracket: "Single Elimination",
      platform: "PC Windows",
      region: "Middle East Central",
      prizePool: "₹20,000",
      entryFee: "Free Entry",
      teamsJoined: 24,
      maxTeams: 32,
      status: "Registration Open",
      startsIn: "6 days",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE",
    },
  ];

  const filteredTournaments = tournaments.filter((t) => {
    if (selectedGame !== "All" && !t.game.toLowerCase().includes(selectedGame.toLowerCase()))
      return false;
    if (selectedFormat !== "All" && !t.format.toLowerCase().includes(selectedFormat.toLowerCase()))
      return false;
    if (selectedEntry !== "All" && !t.entryFee.toLowerCase().includes(selectedEntry.toLowerCase()))
      return false;
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.game.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />

      <main className="w-full pt-28 pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-10">
        {/* Breadcrumb & Live Ticker */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[#92ccff] hover:underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#dfe0ff]">Tournaments</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
              <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
              Regional Qualifiers • Season 4
            </span>
            <span className="hidden sm:inline text-[#8f8fa3]">Updated 4m ago</span>
          </div>
        </div>

        {/* 1. Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#21274c]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#233dff]/15 text-[#92ccff] text-xs font-headline font-semibold tracking-wider uppercase mb-3 border border-[#233dff]/30">
              <span className="material-symbols-outlined text-[16px]">emoji_events</span>
              Tournament Discovery & Competition Hub
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3">
              FIND YOUR NEXT TOURNAMENT
            </h1>
            <p className="text-[#c5c5da] text-base sm:text-lg leading-relaxed">
              Discover competitions, join verified teams, and compete for verified prize pools
              across community cups and pro qualifiers with automated escrow payouts.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Live Cups</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                12
              </div>
              <div className="text-[10px] text-[#92ccff]">Today</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Competitors</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                8.9K
              </div>
              <div className="text-[10px] text-[#5cb6f9]">Active Rosters</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#13183d] border border-[#21274c] text-center">
              <div className="text-[11px] font-mono text-[#8f8fa3] uppercase">Prize Vault</div>
              <div className="font-headline text-xl sm:text-2xl font-bold text-[#cce5ff] mt-0.5">
                ₹2.8M
              </div>
              <div className="text-[10px] text-[#92ccff]">Guaranteed</div>
            </div>
          </div>
        </div>

        {/* 2. Filter & Search Controls */}
        <section className="p-5 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f8fa3] text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search tournaments, games, organizers, or formats..."
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

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">All Games</option>
                <option value="Valorant">Valorant</option>
                <option value="Counter-Strike">Counter-Strike 2</option>
                <option value="Apex">Apex Legends</option>
                <option value="Rocket">Rocket League</option>
                <option value="Tekken">Tekken 8</option>
                <option value="Overwatch">Overwatch 2</option>
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">All Formats</option>
                <option value="5v5">5v5 Squads</option>
                <option value="3v3">3v3 Trios</option>
                <option value="2v2">2v2 Duos</option>
                <option value="1v1">1v1 Solo</option>
              </select>

              <select
                value={selectedEntry}
                onChange={(e) => setSelectedEntry(e.target.value)}
                className="bg-[#21274c] text-[#dfe0ff] text-xs font-semibold px-3 py-2 rounded-xl border border-[#444557]/40 focus:outline-none cursor-pointer"
              >
                <option value="All">All Entry Fees</option>
                <option value="Free">Free Entry</option>
                <option value="₹">Paid Entry</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8f8fa3] pt-2 border-t border-[#21274c]/50">
            <div>
              Showing <span className="text-[#92ccff] font-bold">{filteredTournaments.length}</span>{" "}
              of {tournaments.length} available brackets
            </div>
            {(selectedGame !== "All" ||
              selectedFormat !== "All" ||
              selectedEntry !== "All" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGame("All");
                  setSelectedFormat("All");
                  setSelectedEntry("All");
                  setSearchQuery("");
                }}
                className="text-[#92ccff] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </section>

        {/* 3. High-Impact Featured Tournament Showcase Card */}
        <section className="relative w-full rounded-2xl bg-[#13183d] border border-[#21274c] overflow-hidden shadow-2xl">
          {/* Top Status Ticker Accent */}
          <div className="w-full bg-[#233dff] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#cce5ff] animate-pulse"></span>
              <span className="font-headline text-xs uppercase tracking-widest text-white font-bold">
                FEATURED TOURNAMENT • REGISTRATION CLOSING IN 2 DAYS • 5v5 TACTICAL
              </span>
            </div>
            <span className="text-xs text-[#cce5ff] font-mono">
              Server: MENA North (Bahrain / DXB)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Media */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden bg-[#050930]">
              <div
                className="w-full h-full bg-cover bg-center min-h-[320px]"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#13183d]/90 via-[#13183d]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#050930]/90 backdrop-blur-md text-xs font-headline font-bold text-[#92ccff] uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                    verified
                  </span>
                  OFFICIAL RIYADAH MAJOR
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold text-[#92ccff] uppercase tracking-wider">
                    Riyadah Gaming Community • Valorant
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#233dff]/20 text-[#92ccff] font-mono text-xs border border-[#233dff]/40">
                    Registration Open • 10 Slots Left
                  </span>
                </div>

                <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  VALORANT COMMUNITY CUP — SEASON 4
                </h2>

                <p className="text-sm text-[#c5c5da] leading-relaxed">
                  The premiere 5v5 regional tactical showdown. Verified single-elimination bracket
                  with live broadcasted semi-finals and grand finals on Twitch and YouTube.
                  Guaranteed automated escrow prize disbursement.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#050930] border border-[#21274c] text-center font-mono">
                  <div>
                    <div className="text-[10px] text-[#8f8fa3] uppercase">Prize Pool</div>
                    <div className="text-lg font-bold text-[#cce5ff] mt-0.5">₹25,000</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8f8fa3] uppercase">Format</div>
                    <div className="text-sm font-semibold text-white mt-0.5">5v5 Tactical</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8f8fa3] uppercase">Entry Fee</div>
                    <div className="text-sm font-semibold text-[#92ccff] mt-0.5">Free Entry</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8f8fa3] uppercase">Registered</div>
                    <div className="text-sm font-semibold text-white mt-0.5">54 / 64 Teams</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#21274c] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#8f8fa3]">
                  <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                    shield
                  </span>
                  <span>Vanguard Anti-Cheat Certified • Instant Smart Escrow</span>
                </div>
                <Link
                  to="/tournaments/valorant-community-cup"
                  className="btn-shimmer w-full sm:w-auto px-6 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>View Bracket & Register</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Available Tournaments Cards Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
              <h2 className="font-headline text-2xl font-bold text-white">
                AVAILABLE TOURNAMENTS ({filteredTournaments.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8f8fa3]">Verified Brackets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTournaments.map((tourney) => (
              <article
                key={tourney.id}
                className="group relative flex flex-col justify-between bg-[#13183d] hover:bg-[#181f4a] rounded-2xl overflow-hidden border border-[#21274c] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(35,61,255,0.25)]"
              >
                <div>
                  {/* Media Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#21274c]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${tourney.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/40 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#233dff] text-white font-headline text-[10px] font-bold uppercase tracking-wider shadow">
                        {tourney.game}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#050930]/80 text-[#92ccff] font-mono text-[10px]">
                        {tourney.format}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#050930]/90 backdrop-blur-md text-[#cce5ff] border border-[#21274c] font-mono text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#92ccff]">
                          emoji_events
                        </span>
                        {tourney.prizePool}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <div className="text-xs font-headline font-semibold text-[#92ccff] uppercase tracking-wider">
                        {tourney.season} • {tourney.organizer}
                      </div>
                      <h3 className="font-headline text-xl font-bold text-white group-hover:text-[#92ccff] transition-colors mt-0.5">
                        {tourney.title}
                      </h3>
                      <div className="text-[11px] font-mono text-[#8f8fa3] mt-1">
                        Region: {tourney.region}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-1 bg-[#050930] p-2.5 rounded-xl border border-[#21274c]/50">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#8f8fa3]">Slots</span>
                        <span className="text-white font-semibold">
                          {tourney.teamsJoined} / {tourney.maxTeams} Teams
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#21274c] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5cb6f9] rounded-full"
                          style={{ width: `${(tourney.teamsJoined / tourney.maxTeams) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8f8fa3] pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#92ccff]">
                          schedule
                        </span>
                        Starts in {tourney.startsIn}
                      </span>
                      <span className="font-semibold text-white">{tourney.entryFee}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="p-5 pt-0">
                  <Link
                    to={
                      tourney.id === "valorant-community-cup"
                        ? "/tournaments/valorant-community-cup"
                        : `/tournaments/${tourney.id}`
                    }
                    className="w-full block text-center py-2.5 rounded-xl bg-[#21274c] hover:bg-[#233dff] hover:text-white text-[#92ccff] font-headline text-xs font-bold transition-all"
                  >
                    View Tournament & Bracket
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Bottom Organizer Callout */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-[#050A30] via-[#13183d] to-[#050A30] border border-[#21274c] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs font-headline font-bold text-[#92ccff] uppercase tracking-wider">
              FAIR PLAY TELEMETRY & INSTANT PRIZE DISBURSEMENT
            </span>
            <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
              Looking for a custom scrim or closed college bracket?
            </h3>
            <p className="text-sm text-[#c5c5da]">
              Create and host automated brackets, manage anti-cheat verifications, and disburse
              prize pools directly through our Smart Escrow engine in minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/#tournaments"
              className="btn-shimmer px-6 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-lg"
            >
              Host a Tournament
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TournamentDiscoveryPage;
