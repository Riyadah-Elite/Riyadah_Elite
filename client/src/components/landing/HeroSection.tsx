import React from "react";
import logoBadge from "../../../assets/logos/re_logo_badge.png";
import cyberDriftGame from "../../../assets/images/cyber_drift_game.png";

interface HeroProps {
  onExploreGames?: () => void;
  onFindTournaments?: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onExploreGames, onFindTournaments }) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#CAE8FF] text-[#002c47] py-16 md:py-20 px-6 min-h-[740px] flex items-center">
      {/* Ambient Grid Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#233DFF_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-[#3698d9]/40 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-[#233dff]/20 blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-[1380px] mx-auto grid grid-cols-12 gap-8 lg:gap-12 items-center w-full z-10">
        {/* Left Column (~46% / 5.5 cols) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col gap-5 z-10">
          {/* Top Live Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#050930]/15 w-fit backdrop-blur-md border border-[#233dff]/20 shadow-sm hover:border-[#233dff]/50 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#233dff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#233dff]"></span>
            </span>
            <span className="font-headline text-xs uppercase tracking-widest text-[#233dff] font-bold">
              THE TWO-SIDED GAMING PLATFORM
            </span>
          </div>

          {/* Giant Headline */}
          <h1 className="font-headline text-5xl sm:text-6xl xl:text-[76px] leading-[1.05] tracking-tight text-[#050A30] font-bold drop-shadow-sm">
            PLAY. TEST.
            <br />
            <span className="bg-gradient-to-r from-[#233dff] via-[#3698d9] to-[#2640ff] bg-clip-text text-transparent drop-shadow-sm">
              COMPETE.
            </span>
          </h1>

          {/* Supporting Subhead */}
          <p className="font-headline text-xl sm:text-2xl text-[#050A30] font-semibold leading-snug">
            One platform for gamers, game developers, and tournament communities.
          </p>

          {/* Body */}
          <p className="font-body text-base sm:text-lg text-[#002c47]/90 max-w-xl leading-relaxed">
            Discover upcoming games, help developers build better experiences, and compete in
            tournaments hosted by communities around the world.
          </p>

          {/* Dual CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              onClick={onExploreGames}
              className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm font-bold shadow-[0_8px_30px_rgba(35,61,255,0.4)] hover:shadow-[0_0_25px_rgba(35,61,255,0.7)] hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              href="#games"
            >
              <span className="material-symbols-outlined text-[20px]">explore</span>
              Explore Games
            </a>
            <a
              onClick={onFindTournaments}
              className="btn-shimmer px-8 py-3.5 rounded-xl bg-white/70 backdrop-blur-md text-[#233dff] font-headline text-sm font-bold border border-[#233dff]/20 shadow-md hover:bg-[#233dff] hover:text-white hover:shadow-[0_0_25px_rgba(35,61,255,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              href="#tournaments"
            >
              <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              Find Tournaments
            </a>
          </div>

          {/* Sub-links */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-[#050A30]/80 font-headline text-xs font-semibold">
            <a
              className="hover:text-[#233dff] hover:translate-x-1 flex items-center gap-1 transition-all"
              href="#developers"
            >
              Are you a developer? Test your game{" "}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
            <a
              className="hover:text-[#233dff] hover:translate-x-1 flex items-center gap-1 transition-all"
              href="#tournaments"
            >
              Want to host? Create a tournament{" "}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Right Column (~54% / 6.5 cols) Product HUD Visualization */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 relative flex items-center justify-center min-h-[540px] sm:min-h-[580px]">
          {/* Tech HUD Backplate & Controller Geometry */}
          <div className="absolute inset-2 sm:inset-4 rounded-3xl bg-gradient-to-br from-[#21274c]/95 to-[#050930]/95 backdrop-blur-2xl p-6 shadow-2xl border border-[#444557]/40 overflow-hidden flex flex-col justify-between">
            {/* Ambient Grid in HUD */}
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#233DFF_1px,transparent_1px),linear-gradient(to_bottom,#233DFF_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* HUD Top bar */}
            <div className="relative flex items-center justify-between z-10 text-[#c5c5da]">
              <div className="flex items-center gap-2.5">
                <img
                  alt="RE_Logo"
                  className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(92,182,249,0.8)]"
                  src={logoBadge}
                />
                <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
                  Riyadah Hub Node [ME-EAST-01]
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[#92ccff] bg-[#050930]/80 px-3 py-1 rounded-full text-xs border border-[#92ccff]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#92ccff]"></span>
                  </span>
                  <span className="font-headline text-xs font-semibold">24ms Ping Check OK</span>
                </div>
                <span className="material-symbols-outlined text-[#c5c5da] text-sm hover:rotate-90 transition-transform cursor-pointer">
                  tune
                </span>
              </div>
            </div>

            {/* Controller geometry watermark */}
            <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[280px] text-[#bcc2ff]">
                sports_esports
              </span>
            </div>

            {/* HUD Bottom live status ticker */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#c5c5da] pt-3 border-t border-[#2c3258]/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-headline">
                  <span className="material-symbols-outlined text-xs text-[#bcc2ff]">speed</span>{" "}
                  Engine Tick: 128Hz
                </span>
                <span className="flex items-center gap-1 font-headline">
                  <span className="material-symbols-outlined text-xs text-[#92ccff]">shield</span>{" "}
                  Anti-Tamper: Active
                </span>
              </div>
              <span className="font-headline text-xs tracking-wider uppercase text-[#bcc2ff] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bcc2ff] animate-pulse"></span> Live
                Telemetry Sync
              </span>
            </div>
          </div>

          {/* Floating Glass Card 1: Game Testing (Cyber Strike) */}
          <div className="animate-float-slow absolute -top-4 left-0 sm:left-2 xl:-left-6 w-[310px] sm:w-[350px] xl:w-[370px] rounded-2xl bg-[#21274c]/95 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(35,61,255,0.2)] border border-[#bcc2ff]/20 hover:border-[#92ccff]/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(5,10,48,0.9),0_0_30px_rgba(92,182,249,0.35)] transition-all duration-300 z-20 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#bcc2ff]/30 shrink-0 group-hover:ring-[#92ccff] transition-all bg-[#0a0f35]">
                  <img
                    alt="Cyber Strike"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={cyberDriftGame}
                  />
                </div>
                <div>
                  <h4 className="font-headline text-[16px] sm:text-[17px] text-[#dfe0ff] font-bold leading-tight group-hover:text-[#92ccff] transition-colors">
                    Cyber Strike: Reborn
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#233dff]/30 text-[#dfe0ff] font-semibold font-headline uppercase">
                      Open Beta
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#2c3258] text-[#c5c5da] font-headline uppercase">
                      v0.8 PC
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#92ccff] text-sm drop-shadow-[0_0_6px_rgba(92,182,249,0.8)]">
                verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 my-2 bg-[#050930]/70 rounded-lg px-3 border border-[#444557]/30">
              <div>
                <span className="text-[11px] text-[#c5c5da] font-headline block">
                  Active Testers
                </span>
                <span className="font-headline text-lg text-[#92ccff] font-bold">1,248</span>
              </div>
              <div>
                <span className="text-[11px] text-[#c5c5da] font-headline block">Bug Reports</span>
                <span className="font-headline text-lg text-[#dfe0ff] font-bold">387</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#233dff] ring-2 ring-[#0a0f35] flex items-center justify-center text-[10px] font-bold text-white">
                  RX
                </div>
                <div className="w-7 h-7 rounded-full bg-[#92ccff] ring-2 ring-[#0a0f35] flex items-center justify-center text-[10px] font-bold text-[#003351]">
                  KD
                </div>
                <div className="w-7 h-7 rounded-full bg-[#adcae1] ring-2 ring-[#0a0f35] flex items-center justify-center text-[10px] font-bold text-[#153345]">
                  VN
                </div>
              </div>
              <a
                className="btn-shimmer px-3.5 py-1.5 rounded-lg bg-[#233dff] text-white font-headline text-xs uppercase font-bold hover:brightness-110 hover:shadow-[0_0_15px_rgba(35,61,255,0.7)] active:scale-95 transition-all flex items-center gap-1"
                href="#games"
              >
                Start Testing
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Floating Glass Card 2: Tournament (Valorant Community Cup) */}
          <div className="animate-float-delayed absolute -bottom-6 right-0 sm:right-2 xl:-right-4 w-[310px] sm:w-[350px] xl:w-[380px] rounded-2xl bg-[#13183d]/95 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_20px_rgba(92,182,249,0.2)] border border-[#92ccff]/30 hover:border-[#92ccff] hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(5,10,48,0.9),0_0_30px_rgba(92,182,249,0.4)] transition-all duration-300 z-30 group">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#3698d9]/20 text-[#92ccff] font-bold font-headline uppercase tracking-wider flex items-center gap-1.5 border border-[#92ccff]/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#92ccff]"></span>
                </span>{" "}
                Registration Open
              </span>
              <span className="text-xs font-headline text-[#adcae1]">Bracket #1480</span>
            </div>
            <h4 className="font-headline text-[17px] sm:text-[18px] text-[#dfe0ff] font-bold mb-1.5 group-hover:text-[#92ccff] transition-colors">
              Valorant Community Cup
            </h4>
            <div className="grid grid-cols-3 gap-1 py-2 mb-3 bg-[#050930]/70 rounded-lg text-center border border-[#444557]/30">
              <div className="p-1">
                <div className="text-[10px] text-[#c5c5da] font-headline uppercase">Prize Pool</div>
                <div className="text-[#bcc2ff] font-bold font-headline text-sm sm:text-base">
                  ₹25,000
                </div>
              </div>
              <div className="p-1">
                <div className="text-[10px] text-[#c5c5da] font-headline uppercase">Teams</div>
                <div className="text-[#dfe0ff] font-bold font-headline text-sm sm:text-base">
                  32 / 32
                </div>
              </div>
              <div className="p-1">
                <div className="text-[10px] text-[#c5c5da] font-headline uppercase">Players</div>
                <div className="text-[#dfe0ff] font-bold font-headline text-sm sm:text-base">
                  128
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[#c5c5da]">
                <span className="material-symbols-outlined text-sm text-[#92ccff]">schedule</span>
                <span>Starts Tonight 20:00 IST</span>
              </div>
              <a
                className="btn-shimmer px-3.5 py-1.5 rounded-lg bg-[#3698d9] text-[#002c47] font-headline text-xs uppercase font-bold hover:brightness-110 hover:shadow-[0_0_15px_rgba(54,152,217,0.7)] active:scale-95 transition-all flex items-center gap-1"
                href="#tournaments"
              >
                Join Tournament
                <span className="material-symbols-outlined text-sm">sports_esports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
