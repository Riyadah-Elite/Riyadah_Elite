import React, { useState, useEffect } from "react";
import cyberDriftImg from "../../../assets/images/cyber_drift_game.png";

export const GameTestingShowcase: React.FC = () => {
  const [latency, setLatency] = useState(16);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(14 + Math.floor(Math.random() * 5));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 px-6 bg-[#0a0f35]">
      <div className="max-w-[1380px] mx-auto grid grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (58% / 7 cols): Realistic SaaS Game Testing Dashboard Mockup */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl bg-[#21274c]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 border border-[#444557]/30 hover:border-[#92ccff]/40 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2c3258]/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-[#bcc2ff]/40 shrink-0 bg-[#050930]">
                <img
                  alt="Cyber Strike: Reborn"
                  className="w-full h-full object-cover"
                  src={cyberDriftImg}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-bold">
                    Cyber Strike: Reborn
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-[#3698d9]/20 text-[#92ccff] font-bold border border-[#92ccff]/30">
                    PC Exclusive
                  </span>
                </div>
                <span className="text-xs text-[#c5c5da] font-headline">
                  Build v0.8.4-rc2 • Unreal Engine 5.3
                </span>
              </div>
            </div>
            <span className="px-4 py-1 rounded-full bg-[#171c41] text-[#92ccff] font-headline text-xs font-semibold flex items-center gap-1.5 border border-[#92ccff]/20">
              <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-ping"></span>
              Status: Active Sprint
            </span>
          </div>

          {/* Live Testing Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#92ccff]/40 transition-colors">
              <span className="text-xs text-[#c5c5da] font-headline block">Testers Active</span>
              <span className="font-headline text-xl sm:text-2xl text-[#92ccff] font-bold">
                1,248
              </span>
              <span className="text-[11px] text-[#bcc2ff] flex items-center gap-0.5 mt-1 font-semibold">
                +142 this week
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#92ccff]/40 transition-colors">
              <span className="text-xs text-[#c5c5da] font-headline block">Feedback Reports</span>
              <span className="font-headline text-xl sm:text-2xl text-[#dfe0ff] font-bold">
                387
              </span>
              <span className="text-[11px] text-[#92ccff] flex items-center gap-0.5 mt-1 font-semibold">
                94% resolution
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-[#050930]/70 border border-[#444557]/20 hover:border-[#92ccff]/40 transition-colors">
              <span className="text-xs text-[#c5c5da] font-headline block">Crash-free Rate</span>
              <span className="font-headline text-xl sm:text-2xl text-[#bcc2ff] font-bold">
                98.4%
              </span>
              <span className="text-[11px] text-[#92ccff] flex items-center gap-0.5 mt-1 font-semibold">
                Target: &gt;97.5%
              </span>
            </div>
          </div>

          {/* Active Focus Areas */}
          <div className="space-y-2 pt-1">
            <span className="font-headline text-xs uppercase tracking-wider text-[#c5c5da]">
              Active Testing Focus Areas
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#233dff]/20 text-[#dfe0ff] text-xs font-headline flex items-center gap-1 border border-[#233dff]/20 hover:bg-[#233dff]/30 cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bcc2ff]"></span> Gameplay Balance
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#3698d9]/20 text-[#92ccff] text-xs font-headline flex items-center gap-1 border border-[#3698d9]/20 hover:bg-[#3698d9]/30 cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> Multiplayer Netcode
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#446073]/30 text-[#adcae1] text-xs font-headline flex items-center gap-1 border border-[#adcae1]/20 hover:bg-[#446073]/40 cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#adcae1]"></span> GPU Performance
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#171c41] text-[#c5c5da] text-xs font-headline flex items-center gap-1 border border-[#444557]/30 hover:text-white cursor-pointer transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8f8fa3]"></span> WASD Controls &amp;
                Sensitivity
              </span>
            </div>
          </div>

          {/* Inline Telemetry Graphic with Live Animation */}
          <div className="rounded-xl bg-[#050930]/90 p-4 space-y-2 border border-[#444557]/30">
            <div className="flex items-center justify-between text-xs text-[#c5c5da] font-headline">
              <span>Client FPS Telemetry Distribution (Avg 142 FPS)</span>
              <span className="text-[#92ccff] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff] animate-pulse"></span> Tick
                Latency: <span>{latency}</span>ms
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16 pt-2">
              <div
                className="w-1/12 bg-[#233dff]/30 h-[20%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="120 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/40 h-[35%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="125 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/50 h-[50%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="130 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/70 h-[75%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="138 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#92ccff] h-[95%] rounded-t shadow-[0_0_12px_rgba(92,182,249,0.7)] hover:brightness-125 transition-all cursor-pointer duration-300"
                title="142 FPS (Peak Mode)"
              ></div>
              <div
                className="w-1/12 bg-[#233dff] h-[85%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="144 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/70 h-[60%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="150 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/50 h-[45%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="155 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/40 h-[30%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="160 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/30 h-[15%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="165 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/20 h-[10%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="170 FPS"
              ></div>
              <div
                className="w-1/12 bg-[#233dff]/10 h-[5%] rounded-t hover:bg-[#92ccff] transition-all cursor-pointer duration-300"
                title="175 FPS"
              ></div>
            </div>
          </div>

          {/* CTA Inside Mockup */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs text-[#c5c5da] font-headline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-[#92ccff]">
                verified_user
              </span>{" "}
              NDA Status: Standard Playtest Agreement
            </span>
            <button className="btn-shimmer px-5 py-2 rounded-lg bg-[#233dff] text-white font-headline text-xs font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(35,61,255,0.6)] active:scale-95 transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">download</span>
              Join Testing Campaign
            </button>
          </div>
        </div>

        {/* Right Column (42% / 5 cols): Narrative + Feature Blocks */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-5">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> PILLAR ONE | GAME
            TESTING
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] uppercase font-bold tracking-tight leading-tight">
            PLAY GAMES BEFORE THE WORLD DOES.
          </h2>
          <p className="font-body text-base text-[#c5c5da] leading-relaxed">
            Developers need real players. Your feedback can directly shape the next great game
            release. Jump into restricted playtests and test with impact.
          </p>

          {/* 4 Feature Blocks with Hover Lift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#21274c]/60 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-1 text-[#dfe0ff] font-headline text-sm font-bold group-hover:text-[#92ccff] transition-colors">
                <span className="material-symbols-outlined text-[#92ccff] text-[20px]">
                  bug_report
                </span>
                Report Bugs
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Log repro steps, attach telemetry, and tag crash logs directly to studio JIRA
                pipelines.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#21274c]/60 backdrop-blur-md border border-[#444557]/30 hover:border-[#bcc2ff]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-1 text-[#dfe0ff] font-headline text-sm font-bold group-hover:text-[#bcc2ff] transition-colors">
                <span className="material-symbols-outlined text-[#bcc2ff] text-[20px]">forum</span>
                Give Feedback
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Voice your impressions on weapon balance, progression curves, and game feel.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#21274c]/60 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-1 text-[#dfe0ff] font-headline text-sm font-bold group-hover:text-[#92ccff] transition-colors">
                <span className="material-symbols-outlined text-[#92ccff] text-[20px]">
                  star_rate
                </span>
                Rate Experience
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Grade performance, frame pacing, and fun factor to refine pre-launch polish.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#21274c]/60 backdrop-blur-md border border-[#444557]/30 hover:border-[#bcc2ff]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-1 text-[#dfe0ff] font-headline text-sm font-bold group-hover:text-[#bcc2ff] transition-colors">
                <span className="material-symbols-outlined text-[#bcc2ff] text-[20px]">
                  sports_esports
                </span>
                Play Early Builds
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Access closed alphas, private betas, and exclusive builds months ahead of launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
