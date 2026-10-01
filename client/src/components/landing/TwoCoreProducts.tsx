import React from "react";

export const TwoCoreProducts: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#050930]" id="games">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#bcc2ff] font-bold flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#92ccff]"></span> DUAL ECOSYSTEM{" "}
            <span className="w-2 h-2 rounded-full bg-[#92ccff]"></span>
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            ONE PLATFORM. TWO WAYS TO GET IN THE GAME.
          </h2>
        </div>

        {/* 50/50 Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: 🧪 TEST GAMES */}
          <div className="group relative rounded-2xl bg-[#21274c]/70 backdrop-blur-xl p-8 sm:p-10 shadow-xl border border-[#444557]/30 hover:border-[#5CB6F9]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(5,10,48,0.8),0_0_25px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#233dff]/10 blur-3xl pointer-events-none group-hover:bg-[#233dff]/25 transition-all"></div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#233dff] ring-1 ring-[#bcc2ff]/30 group-hover:scale-110 group-hover:bg-[#233dff] group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[28px]">science</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2c3258] text-[#bcc2ff] font-headline text-xs uppercase tracking-wider font-semibold border border-[#bcc2ff]/20">
                  Developers &amp; Testers
                </span>
              </div>
              <div>
                <h3 className="font-headline text-2xl sm:text-3xl text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
                  TEST GAMES
                </h3>
                <p className="font-body text-base text-[#c5c5da] mt-2 leading-relaxed">
                  Shape pre-release titles before launch. Test gameplay, surface critical crash
                  data, and communicate directly with development studios.
                </p>
              </div>

              {/* Mini SaaS preview snippet */}
              <div className="rounded-xl bg-[#050930]/80 p-4 space-y-2 border border-[#444557]/30 group-hover:border-[#233dff]/40 transition-colors">
                <div className="flex items-center justify-between text-xs text-[#c5c5da] font-headline">
                  <span>Active Campaign Pipeline</span>
                  <span className="text-[#92ccff] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span> 48
                    Builds Running
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#2c3258] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#bcc2ff] to-[#92ccff] rounded-full w-[78%] transition-all duration-700 group-hover:w-[85%]"></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#c5c5da]/80">
                  <span>Telemetry Ingestion: Normal</span>
                  <span className="text-[#92ccff]">Crash Rate: 1.2%</span>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-2 pt-1 text-[#dfe0ff] font-body text-sm">
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Discover upcoming pre-release games</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Join targeted alpha and beta testing campaigns</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Play early builds and stress-test game loops</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Report bugs with reproducible steps &amp; telemetry</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Share actionable feedback directly to studio leads</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <a
                className="btn-shimmer inline-flex items-center gap-2 font-headline text-sm text-[#92ccff] hover:text-white px-4 py-2 rounded-lg hover:bg-[#233dff] transition-all duration-300 font-bold"
                href="#games"
              >
                Explore Games{" "}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 2: 🏆 PLAY TOURNAMENTS */}
          <div className="group relative rounded-2xl bg-[#21274c]/70 backdrop-blur-xl p-8 sm:p-10 shadow-xl border border-[#444557]/30 hover:border-[#5CB6F9]/50 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(5,10,48,0.8),0_0_25px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-[#3698d9]/10 blur-3xl pointer-events-none group-hover:bg-[#3698d9]/25 transition-all"></div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#3698d9]/20 flex items-center justify-center text-[#92ccff] ring-1 ring-[#92ccff]/30 group-hover:scale-110 group-hover:bg-[#3698d9] group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[28px]">trophy</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2c3258] text-[#92ccff] font-headline text-xs uppercase tracking-wider font-semibold border border-[#92ccff]/20">
                  Competitive Esports
                </span>
              </div>
              <div>
                <h3 className="font-headline text-2xl sm:text-3xl text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
                  PLAY TOURNAMENTS
                </h3>
                <p className="font-body text-base text-[#c5c5da] mt-2 leading-relaxed">
                  Automated brackets, verified match reporting, and secure payouts. Compete in
                  community showdowns or organize high-stakes cups.
                </p>
              </div>

              {/* Mini Bracket preview snippet */}
              <div className="rounded-xl bg-[#050930]/80 p-4 flex items-center justify-between border border-[#444557]/30 group-hover:border-[#92ccff]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-[#233dff]/30 flex items-center justify-center font-bold text-xs text-[#bcc2ff]">
                    A
                  </span>
                  <span className="font-headline text-sm text-[#dfe0ff] font-semibold">
                    Cloud9 Acad
                  </span>
                  <span className="text-[#92ccff] font-bold font-headline px-2 py-0.5 rounded bg-[#171c41]">
                    2
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#92ccff] px-2.5 py-1 bg-[#2c3258] rounded border border-[#92ccff]/30 animate-pulse">
                  Finals Live
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[#c5c5da] font-bold font-headline px-2 py-0.5 rounded bg-[#171c41]">
                    1
                  </span>
                  <span className="font-headline text-sm text-[#dfe0ff] font-semibold">
                    Sentinels Jr
                  </span>
                  <span className="w-8 h-8 rounded bg-[#171c41] flex items-center justify-center font-bold text-xs text-[#92ccff]">
                    S
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <ul className="space-y-2 pt-1 text-[#dfe0ff] font-body text-sm">
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Discover open esports &amp; casual tournaments daily</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Join individual or squad competitions seamlessly</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Create or join verified gaming teams with team rosters</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Play scheduled matches with automated bracket advancing</span>
                </li>
                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[#92ccff] text-sm">
                    check_circle
                  </span>
                  <span>Track personal stats, match wins, and claim platform prize pools</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <a
                className="btn-shimmer inline-flex items-center gap-2 font-headline text-sm text-[#92ccff] hover:text-white px-4 py-2 rounded-lg hover:bg-[#3698d9] transition-all duration-300 font-bold"
                href="#tournaments"
              >
                Find Tournaments{" "}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
