import React from "react";

export const TournamentShowcase: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#13183d]" id="tournaments">
      <div className="max-w-[1380px] mx-auto grid grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (42% / 5 cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> PILLAR TWO | TOURNAMENTS
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] uppercase font-bold tracking-tight leading-tight">
            YOUR GAME. YOUR RULES. YOUR CHAMPIONSHIP.
          </h2>
          <p className="font-body text-base text-[#c5c5da] leading-relaxed">
            Manage brackets, coordinate schedules, and host competitive esports or casual community
            tournaments with automated score validation.
          </p>

          {/* Event Metadata Chips */}
          <div className="flex flex-wrap gap-2 py-1">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#2c3258] font-headline text-xs text-[#dfe0ff] font-semibold border border-[#444557]/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#92ccff]">groups</span> 128
              Players
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#2c3258] font-headline text-xs text-[#dfe0ff] font-semibold border border-[#444557]/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#bcc2ff]">shield</span> 32
              Teams
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#2c3258] font-headline text-xs text-[#92ccff] font-semibold border border-[#92ccff]/30 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#92ccff]">emoji_events</span>{" "}
              ₹25,000 Prize Pool
            </div>
          </div>

          {/* 4 Quick Capabilities with Hover */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-3 rounded-lg bg-[#171c41]/60 font-body text-sm flex items-center gap-2 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:bg-[#171c41] transition-colors cursor-pointer text-[#dfe0ff]">
              <span className="material-symbols-outlined text-[#92ccff] text-sm">account_tree</span>
              Create Bracket
            </div>
            <div className="p-3 rounded-lg bg-[#171c41]/60 font-body text-sm flex items-center gap-2 border border-[#444557]/20 hover:border-[#bcc2ff]/50 hover:bg-[#171c41] transition-colors cursor-pointer text-[#dfe0ff]">
              <span className="material-symbols-outlined text-[#bcc2ff] text-sm">groups</span>
              Manage Squads
            </div>
            <div className="p-3 rounded-lg bg-[#171c41]/60 font-body text-sm flex items-center gap-2 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:bg-[#171c41] transition-colors cursor-pointer text-[#dfe0ff]">
              <span className="material-symbols-outlined text-[#92ccff] text-sm">swords</span>
              Run Live Matches
            </div>
            <div className="p-3 rounded-lg bg-[#171c41]/60 font-body text-sm flex items-center gap-2 border border-[#444557]/20 hover:border-[#bcc2ff]/50 hover:bg-[#171c41] transition-colors cursor-pointer text-[#dfe0ff]">
              <span className="material-symbols-outlined text-[#bcc2ff] text-sm">leaderboard</span>
              Track Standings
            </div>
          </div>

          <div className="pt-2">
            <a
              className="btn-shimmer px-6 py-3 rounded-xl bg-[#233dff] text-white font-headline text-sm font-bold hover:brightness-110 hover:shadow-[0_0_25px_rgba(35,61,255,0.6)] active:scale-95 shadow-md inline-flex items-center gap-2 transition-all"
              href="#tournaments"
            >
              Find Tournaments{" "}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Right Column (58% / 7 cols): High-Fidelity Tournament Bracket UI Mockup */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl bg-[#21274c]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 border border-[#444557]/30 hover:border-[#92ccff]/40 transition-all duration-300">
          {/* Bracket header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2c3258]/40">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#92ccff]"></span>
              </span>
              <span className="font-headline text-sm sm:text-base text-[#dfe0ff] font-bold">
                Valorant Community Cup: Grand Stage
              </span>
            </div>
            <span className="text-xs font-headline text-[#92ccff] bg-[#171c41] px-3 py-1 rounded-full uppercase tracking-wider border border-[#92ccff]/30">
              Match #28 In-Progress
            </span>
          </div>

          {/* High-fidelity bracket columns with Interactive Match Hover */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative">
            {/* Column 1: Quarter-Finals */}
            <div className="space-y-4">
              <span className="text-[11px] font-headline uppercase tracking-wider text-[#c5c5da] block text-center font-bold">
                Quarter-Finals
              </span>
              {/* Match 1 */}
              <div className="bracket-match rounded-xl bg-[#050930]/80 p-3 space-y-1.5 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:shadow-[0_0_15px_rgba(92,182,249,0.3)] transition-all cursor-pointer">
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded bg-[#92ccff]/10">
                  <span className="font-bold text-[#92ccff] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> Team Alpha
                  </span>
                  <span className="text-[#92ccff] font-bold">2</span>
                </div>
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded text-[#c5c5da]">
                  <span>Team Beta</span>
                  <span>0</span>
                </div>
              </div>
              {/* Match 2 */}
              <div className="bracket-match rounded-xl bg-[#050930]/80 p-3 space-y-1.5 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:shadow-[0_0_15px_rgba(92,182,249,0.3)] transition-all cursor-pointer">
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded bg-[#92ccff]/10">
                  <span className="font-bold text-[#92ccff] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> Team Phoenix
                  </span>
                  <span className="text-[#92ccff] font-bold">2</span>
                </div>
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded text-[#c5c5da]">
                  <span>Team Vortex</span>
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* Column 2: Semi-Finals */}
            <div className="space-y-4 sm:pt-6">
              <span className="text-[11px] font-headline uppercase tracking-wider text-[#92ccff] block text-center font-bold">
                Semi-Finals
              </span>
              <div className="bracket-match rounded-xl bg-[#050930]/90 p-3 space-y-1.5 shadow-md border border-[#92ccff]/40 hover:border-[#92ccff] hover:shadow-[0_0_20px_rgba(92,182,249,0.4)] transition-all cursor-pointer">
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded bg-[#92ccff]/15">
                  <span className="font-bold text-[#92ccff] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff] animate-pulse"></span>{" "}
                    Team Alpha
                  </span>
                  <span className="text-[#92ccff] font-bold">2</span>
                </div>
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded">
                  <span className="text-[#dfe0ff] font-semibold">Team Phoenix</span>
                  <span className="text-[#c5c5da] font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Column 3: Grand Finals */}
            <div className="space-y-4 sm:pt-12">
              <span className="text-[11px] font-headline uppercase tracking-wider text-[#bcc2ff] block text-center font-bold">
                Grand Finals
              </span>
              <div className="bracket-match rounded-xl bg-[#2c3258] p-3 space-y-1.5 shadow-xl border-2 border-[#233dff]/50 hover:border-[#92ccff] hover:shadow-[0_0_25px_rgba(92,182,249,0.5)] transition-all cursor-pointer">
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 rounded bg-[#3698d9]/20">
                  <span className="font-bold text-[#92ccff] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#92ccff]">crown</span>{" "}
                    Team Alpha
                  </span>
                  <span className="text-[#92ccff] font-bold text-sm">3</span>
                </div>
                <div className="team-row flex items-center justify-between text-xs px-2 py-1 text-[#c5c5da]">
                  <span>Shadow Clan</span>
                  <span>2</span>
                </div>
                <div className="text-[10px] text-center font-headline text-[#bcc2ff] uppercase pt-1 font-bold tracking-wider">
                  Champion Confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Live viewer & bracket footer */}
          <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-[#c5c5da] border-t border-[#2c3258]/40 gap-2">
            <span className="flex items-center gap-2 font-headline text-[#92ccff] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#92ccff]"></span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#92ccff]">visibility</span>{" "}
              2,420 Live Viewers
            </span>
            <a
              className="font-headline text-xs text-[#92ccff] hover:underline flex items-center gap-1 font-semibold"
              href="#tournaments"
            >
              Full Double Elimination Tree{" "}
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
