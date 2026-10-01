import React from "react";

export const FinalCTASection: React.FC = () => {
  return (
    <section className="w-full py-24 px-6 bg-[#050A30] relative overflow-hidden text-center">
      {/* Glowing Radial Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#233dff]/25 blur-[160px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#21274c]/80 border border-[#92ccff]/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#92ccff]"></span>
          </span>
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
            Riyadah Elite Platform 2025
          </span>
        </div>

        <h2 className="font-headline text-4xl sm:text-5xl xl:text-[64px] leading-tight text-[#dfe0ff] font-bold uppercase drop-shadow-md">
          READY TO ENTER THE GAME?
        </h2>

        <p className="font-headline text-lg sm:text-xl text-[#c5c5da] max-w-2xl font-normal leading-relaxed">
          Test the next great game. Find your next tournament. Start playing today.
        </p>

        {/* Dual Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm font-bold shadow-[0_8px_30px_rgba(35,61,255,0.5)] hover:shadow-[0_0_30px_rgba(35,61,255,0.8)] hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2"
            href="#games"
          >
            <span className="material-symbols-outlined text-lg">explore</span>
            Explore Games
          </a>
          <a
            className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#21274c] border border-[#444557]/40 text-[#92ccff] font-headline text-sm font-bold hover:bg-[#2c3258] hover:border-[#92ccff] hover:shadow-[0_0_20px_rgba(92,182,249,0.4)] active:scale-95 transition-all duration-300 flex items-center gap-2"
            href="#tournaments"
          >
            <span className="material-symbols-outlined text-lg">emoji_events</span>
            Find Tournaments
          </a>
        </div>

        {/* Sub-links */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[#c5c5da] text-xs sm:text-sm font-headline">
          <a
            className="hover:text-[#92ccff] flex items-center gap-1 transition-colors"
            href="#developers"
          >
            For Developers → Test Your Game
          </a>
          <span className="opacity-30">|</span>
          <a
            className="hover:text-[#92ccff] flex items-center gap-1 transition-colors"
            href="#tournaments"
          >
            For Hosts → Create a Tournament
          </a>
        </div>
      </div>
    </section>
  );
};
