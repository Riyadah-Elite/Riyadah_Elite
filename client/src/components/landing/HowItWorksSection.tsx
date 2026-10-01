import React, { useState } from "react";

interface StepDetail {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
}

const STEP_DATA: StepDetail[] = [
  {
    icon: "radar",
    eyebrow: "PHASE 01 • INTELLIGENT DISCOVERY",
    title: "Discover Pre-Release Playtests & Community Brackets",
    description:
      "Smart matchmaking pairs your machine specs, favorite game genres, and competitive rank with curated alpha builds and daily tournaments.",
    cta: "Explore Feed",
  },
  {
    icon: "how_to_reg",
    eyebrow: "PHASE 02 • INSTANT ONBOARDING",
    title: "Fast-Track NDA Approval & Squad Registration",
    description:
      "Sign instant digital NDAs, link your Steam and Discord handles, or assemble your 5-man tournament roster with one click.",
    cta: "Register Team",
  },
  {
    icon: "sports_esports",
    eyebrow: "PHASE 03 • COMPETE & RUN BUILDS",
    title: "Live Telemetry Ingestion & Automated Match Scoring",
    description:
      "Our background agent measures real-time frame rates and ping ticks while automated bracket bots parse match end-screens immediately.",
    cta: "View Live Tourneys",
  },
  {
    icon: "military_tech",
    eyebrow: "PHASE 04 • REPUTATION & REWARDS",
    title: "Earn Proof-of-Skill Badges & Instant Prize Escrows",
    description:
      "Verified match victories feed your global gamer passport. Prize funds disburse into verified gamer wallets within minutes of referee sign-off.",
    cta: "View Leaderboards",
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const detail = STEP_DATA[activeStep];

  return (
    <section className="w-full py-20 px-6 bg-[#13183d] relative" id="how-it-works">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
            SIMPLE 4-STEP LOOP
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            HOW RIYADAH ELITE WORKS
          </h2>
          <p className="font-body text-sm text-[#c5c5da] mt-2">
            Click any phase below to inspect the real-time workflow pipeline.
          </p>
        </div>

        {/* 4 Interactive Connected Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Interconnected Glowing Line */}
          <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#233dff] via-[#92ccff] to-[#233dff] shadow-[0_0_12px_rgba(92,182,249,0.8)] z-0"></div>

          {/* Step 1 */}
          <div
            onClick={() => setActiveStep(0)}
            className={`cursor-pointer relative z-10 flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 ${
              activeStep === 0
                ? "bg-[#21274c]/90 border-2 border-[#92ccff] shadow-[0_0_25px_rgba(92,182,249,0.3)] scale-[1.02]"
                : "bg-[#21274c]/40 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 shadow-lg"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2c3258] shadow-lg flex items-center justify-center text-[#bcc2ff] font-headline text-2xl font-bold mb-4 ring-2 ring-[#bcc2ff]/40">
              01
            </div>
            <h4 className="font-headline text-xl text-[#dfe0ff] uppercase mb-2 font-bold">
              DISCOVER
            </h4>
            <p className="font-body text-sm text-[#c5c5da] max-w-xs">
              Find pre-release builds or open community tournaments tailored to your platform.
            </p>
            <div
              className={`mt-4 px-2.5 py-1 rounded text-[11px] font-headline flex items-center gap-1 ${
                activeStep === 0
                  ? "bg-[#92ccff]/10 border border-[#92ccff]/30 text-[#92ccff]"
                  : "bg-[#171c41] border border-[#444557]/40 text-[#c5c5da]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeStep === 0 ? "bg-[#92ccff]" : "bg-[#8f8fa3]"
                }`}
              ></span>{" "}
              Auto-Filtered Feeds
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer relative z-10 flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 ${
              activeStep === 1
                ? "bg-[#21274c]/90 border-2 border-[#92ccff] shadow-[0_0_25px_rgba(92,182,249,0.3)] scale-[1.02]"
                : "bg-[#21274c]/40 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 shadow-lg"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2c3258] shadow-lg flex items-center justify-center text-[#92ccff] font-headline text-2xl font-bold mb-4 ring-1 ring-[#92ccff]/30">
              02
            </div>
            <h4 className="font-headline text-xl text-[#dfe0ff] uppercase mb-2 font-bold">JOIN</h4>
            <p className="font-body text-sm text-[#c5c5da] max-w-xs">
              Apply to active testing campaigns or register your team into open brackets in seconds.
            </p>
            <div
              className={`mt-4 px-2.5 py-1 rounded text-[11px] font-headline flex items-center gap-1 ${
                activeStep === 1
                  ? "bg-[#92ccff]/10 border border-[#92ccff]/30 text-[#92ccff]"
                  : "bg-[#171c41] border border-[#444557]/40 text-[#c5c5da]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeStep === 1 ? "bg-[#92ccff]" : "bg-[#8f8fa3]"
                }`}
              ></span>{" "}
              1-Click Verification
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer relative z-10 flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 ${
              activeStep === 2
                ? "bg-[#21274c]/90 border-2 border-[#92ccff] shadow-[0_0_25px_rgba(92,182,249,0.3)] scale-[1.02]"
                : "bg-[#21274c]/40 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 shadow-lg"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2c3258] shadow-lg flex items-center justify-center text-[#233dff] font-headline text-2xl font-bold mb-4 ring-1 ring-[#233dff]/30">
              03
            </div>
            <h4 className="font-headline text-xl text-[#dfe0ff] uppercase mb-2 font-bold">PLAY</h4>
            <p className="font-body text-sm text-[#c5c5da] max-w-xs">
              Test builds, file structured bug reports, or play tournament rounds with real-time
              match tracking.
            </p>
            <div
              className={`mt-4 px-2.5 py-1 rounded text-[11px] font-headline flex items-center gap-1 ${
                activeStep === 2
                  ? "bg-[#92ccff]/10 border border-[#92ccff]/30 text-[#92ccff]"
                  : "bg-[#171c41] border border-[#444557]/40 text-[#c5c5da]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeStep === 2 ? "bg-[#92ccff]" : "bg-[#8f8fa3]"
                }`}
              ></span>{" "}
              Telemetry Sync
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => setActiveStep(3)}
            className={`cursor-pointer relative z-10 flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 ${
              activeStep === 3
                ? "bg-[#21274c]/90 border-2 border-[#92ccff] shadow-[0_0_25px_rgba(92,182,249,0.3)] scale-[1.02]"
                : "bg-[#21274c]/40 border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-1 shadow-lg"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2c3258] shadow-lg flex items-center justify-center text-[#92ccff] font-headline text-2xl font-bold mb-4 ring-1 ring-[#92ccff]/30">
              04
            </div>
            <h4 className="font-headline text-xl text-[#dfe0ff] uppercase mb-2 font-bold">BUILD</h4>
            <p className="font-body text-sm text-[#c5c5da] max-w-xs">
              Build your verified gaming reputation, unlock tester milestones, and earn your place
              on leaderboards.
            </p>
            <div
              className={`mt-4 px-2.5 py-1 rounded text-[11px] font-headline flex items-center gap-1 ${
                activeStep === 3
                  ? "bg-[#92ccff]/10 border border-[#92ccff]/30 text-[#92ccff]"
                  : "bg-[#171c41] border border-[#444557]/40 text-[#c5c5da]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeStep === 3 ? "bg-[#92ccff]" : "bg-[#8f8fa3]"
                }`}
              ></span>{" "}
              Permanent Badges
            </div>
          </div>
        </div>

        {/* Interactive Detail Box for Selected Step */}
        <div className="rounded-2xl bg-[#21274c]/90 border border-[#92ccff]/40 p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-[#3698d9]/20 flex items-center justify-center text-[#92ccff] text-2xl font-bold shrink-0">
              <span className="material-symbols-outlined text-3xl">{detail.icon}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#92ccff] font-bold font-headline">
                {detail.eyebrow}
              </span>
              <h3 className="font-headline text-xl sm:text-2xl text-[#dfe0ff] font-bold mt-0.5">
                {detail.title}
              </h3>
              <p className="font-body text-sm text-[#c5c5da] max-w-2xl mt-1.5 leading-relaxed">
                {detail.description}
              </p>
            </div>
          </div>
          <a
            className="btn-shimmer px-6 py-3 rounded-lg bg-[#233dff] text-white font-headline text-xs uppercase font-bold hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(35,61,255,0.4)] whitespace-nowrap transition-all"
            href="#signup"
          >
            {detail.cta}
          </a>
        </div>
      </div>
    </section>
  );
};
