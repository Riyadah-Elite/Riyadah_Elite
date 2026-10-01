import React from "react";
import rahulAvatar from "../../../assets/images/rahul_avatar.png";

export const GamerIdentitySection: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#0a0f35]">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
            VERIFIED REPUTATION
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            YOUR GAMING JOURNEY, IN ONE PLACE.
          </h2>
          <p className="font-body text-base text-[#c5c5da] mt-1.5 leading-relaxed">
            Carry your achievements, test credibility, and trophies everywhere.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Card: Profile Card for Rahul (5 cols) */}
          <div className="col-span-12 lg:col-span-5 rounded-2xl bg-[#21274c]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6 border border-[#444557]/30 hover:border-[#92ccff]/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden ring-2 ring-[#92ccff]/60 shrink-0 shadow-lg bg-[#050930]">
                <img alt="Rahul Avatar" className="w-full h-full object-cover" src={rahulAvatar} />
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#92ccff] ring-2 ring-[#0a0f35]"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-xl text-[#dfe0ff] font-bold">Rahul</h3>
                  <span
                    className="material-symbols-outlined text-[#92ccff] text-sm drop-shadow-[0_0_8px_rgba(92,182,249,0.8)]"
                    title="Verified Player"
                  >
                    verified
                  </span>
                </div>
                <span className="text-xs text-[#c5c5da] font-headline">
                  Competitive FPS &amp; RPG Beta Specialist
                </span>
              </div>
            </div>

            {/* Stats 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
              <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#92ccff]/40 transition-colors">
                <span className="text-xs text-[#c5c5da] font-headline block">
                  Testing Reputation
                </span>
                <span className="font-headline text-2xl text-[#92ccff] font-bold">92 / 100</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#bcc2ff]/40 transition-colors">
                <span className="text-xs text-[#c5c5da] font-headline block">Tournament Wins</span>
                <span className="font-headline text-2xl text-[#bcc2ff] font-bold">18</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#92ccff]/40 transition-colors">
                <span className="text-xs text-[#c5c5da] font-headline block">Games Tested</span>
                <span className="font-headline text-2xl text-[#dfe0ff] font-bold">37</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#bcc2ff]/40 transition-colors">
                <span className="text-xs text-[#c5c5da] font-headline block">Cups Played</span>
                <span className="font-headline text-2xl text-[#dfe0ff] font-bold">54</span>
              </div>
            </div>

            {/* Verified Badges */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-headline uppercase tracking-wider text-[#c5c5da]">
                Verified Badges
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#233dff]/20 text-[#dfe0ff] text-xs font-semibold flex items-center gap-1.5 border border-[#233dff]/30 hover:scale-105 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-sm text-[#92ccff]">
                    verified_user
                  </span>{" "}
                  Beta Tester Elite
                </span>
                <span className="px-3 py-1 rounded-full bg-[#3698d9]/20 text-[#92ccff] text-xs font-semibold flex items-center gap-1.5 border border-[#3698d9]/30 hover:scale-105 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-sm text-[#92ccff]">trophy</span>{" "}
                  Tournament Champion
                </span>
                <span className="px-3 py-1 rounded-full bg-[#446073]/30 text-[#adcae1] text-xs font-semibold flex items-center gap-1.5 border border-[#adcae1]/30 hover:scale-105 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-sm text-[#adcae1]">
                    bug_report
                  </span>{" "}
                  Bug Hunter Level 3
                </span>
              </div>
            </div>
          </div>

          {/* Right Card: Live Activity Log (7 cols) */}
          <div className="col-span-12 lg:col-span-7 rounded-2xl bg-[#21274c]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-5 border border-[#444557]/30 hover:border-[#92ccff]/50 transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#2c3258]/40">
              <h3 className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-bold">
                Live Activity Log
              </h3>
              <span className="font-headline text-xs text-[#92ccff] flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span> Real-Time
                Validation
              </span>
            </div>

            <div className="space-y-3">
              {/* Activity Item 1 */}
              <div className="p-3.5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#233dff]/50 hover:translate-x-1 flex items-center justify-between gap-4 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#233dff]/30 flex items-center justify-center text-[#bcc2ff] shrink-0">
                    <span className="material-symbols-outlined text-lg">sports_esports</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">
                      Joined "Project Chronos" Closed Beta
                    </h4>
                    <span className="text-xs text-[#c5c5da]">
                      Telemetry Session: 4.5 hrs logged • GPU Profiler active
                    </span>
                  </div>
                </div>
                <span className="text-xs font-headline text-[#c5c5da] whitespace-nowrap">
                  2 hrs ago
                </span>
              </div>

              {/* Activity Item 2 */}
              <div className="p-3.5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:translate-x-1 flex items-center justify-between gap-4 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#3698d9]/30 flex items-center justify-center text-[#92ccff] shrink-0">
                    <span className="material-symbols-outlined text-lg">emoji_events</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">
                      1st Place — Apex Community Showdown
                    </h4>
                    <span className="text-xs text-[#c5c5da]">
                      Earned ₹7,500 split • Squad: Valkyrie Kings
                    </span>
                  </div>
                </div>
                <span className="text-xs font-headline text-[#c5c5da] whitespace-nowrap">
                  Yesterday
                </span>
              </div>

              {/* Activity Item 3 */}
              <div className="p-3.5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#adcae1]/50 hover:translate-x-1 flex items-center justify-between gap-4 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#446073]/30 flex items-center justify-center text-[#adcae1] shrink-0">
                    <span className="material-symbols-outlined text-lg">task_alt</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">
                      Bug Report Accepted &amp; Resolved #8491
                    </h4>
                    <span className="text-xs text-[#c5c5da]">
                      Netcode rollback sync issue in Cyber Strike: Reborn
                    </span>
                  </div>
                </div>
                <span className="text-xs font-headline text-[#c5c5da] whitespace-nowrap">
                  3 days ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
