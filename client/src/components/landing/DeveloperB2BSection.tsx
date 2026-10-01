import React from "react";

export const DeveloperB2BSection: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#050A30] relative overflow-hidden" id="developers">
      {/* Subtle Grid & Radial Glow */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#233DFF_1px,transparent_1px),linear-gradient(to_bottom,#233DFF_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#233dff]/15 blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-[1380px] mx-auto flex flex-col gap-12 z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span> FOR GAME DEVELOPERS
            &amp; STUDIOS <span className="w-1.5 h-1.5 rounded-full bg-[#92ccff]"></span>
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            BUILDING A GAME? <span className="text-[#92ccff]">Get Real Players Testing It.</span>
          </h2>
          <p className="font-body text-base text-[#c5c5da] mt-2 leading-relaxed">
            Replace noisy public discord betas with structured telemetry pipelines, vetted gamer
            demographics, and organized feedback loops.
          </p>
        </div>

        {/* Horizontal 4-step Pipeline with Hover Glows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="font-headline text-xs text-[#92ccff] font-bold uppercase tracking-widest block mb-2">
                STEP 01
              </span>
              <h4 className="font-headline text-xl text-[#dfe0ff] mb-2 font-bold group-hover:text-[#92ccff] transition-colors">
                Create Testing Campaign
              </h4>
              <p className="font-body text-sm text-[#c5c5da] leading-relaxed">
                Define target hardware tiers, geographic regions, and gameplay focus goals.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#233dff] text-3xl mt-6 group-hover:scale-110 group-hover:text-[#92ccff] transition-all">
              tune
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="font-headline text-xs text-[#92ccff] font-bold uppercase tracking-widest block mb-2">
                STEP 02
              </span>
              <h4 className="font-headline text-xl text-[#dfe0ff] mb-2 font-bold group-hover:text-[#92ccff] transition-colors">
                Find Verified Players
              </h4>
              <p className="font-body text-sm text-[#c5c5da] leading-relaxed">
                Riyadah matches verified playtesters filtered by genre experience and hardware
                specs.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#92ccff] text-3xl mt-6 group-hover:scale-110 group-hover:text-white transition-all">
              group_add
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="font-headline text-xs text-[#92ccff] font-bold uppercase tracking-widest block mb-2">
                STEP 03
              </span>
              <h4 className="font-headline text-xl text-[#dfe0ff] mb-2 font-bold group-hover:text-[#92ccff] transition-colors">
                Collect Structured Telemetry
              </h4>
              <p className="font-body text-sm text-[#c5c5da] leading-relaxed">
                Receive automated crash logs, video repro captures, and standardized bug tickets.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#bcc2ff] text-3xl mt-6 group-hover:scale-110 group-hover:text-[#92ccff] transition-all">
              query_stats
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/30 hover:border-[#92ccff]/60 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="font-headline text-xs text-[#92ccff] font-bold uppercase tracking-widest block mb-2">
                STEP 04
              </span>
              <h4 className="font-headline text-xl text-[#dfe0ff] mb-2 font-bold group-hover:text-[#92ccff] transition-colors">
                Polish Before Launch
              </h4>
              <p className="font-body text-sm text-[#c5c5da] leading-relaxed">
                Benchmark gameplay iterations, validate netcode resilience, and launch with
                confidence.
              </p>
            </div>
            <span className="material-symbols-outlined text-[#3698d9] text-3xl mt-6 group-hover:scale-110 group-hover:text-[#92ccff] transition-all">
              rocket_launch
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm font-bold shadow-[0_4px_24px_rgba(35,61,255,0.4)] hover:shadow-[0_0_25px_rgba(35,61,255,0.6)] hover:brightness-110 active:scale-95 transition-all duration-300 flex items-center gap-2"
            href="#signup"
          >
            Start Testing Your Game{" "}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
          <a
            className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#21274c] border border-[#444557]/40 text-[#92ccff] font-headline text-sm font-bold hover:bg-[#2c3258] hover:border-[#92ccff] active:scale-95 transition-all duration-300 flex items-center gap-2"
            href="#contact"
          >
            Learn More About Developer Tools{" "}
            <span className="material-symbols-outlined text-lg">terminal</span>
          </a>
        </div>
      </div>
    </section>
  );
};
