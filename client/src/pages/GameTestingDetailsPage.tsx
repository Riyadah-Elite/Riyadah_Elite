import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";

export const GameTestingDetailsPage: React.FC = () => {
  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />

      <main className="w-full pt-28 pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-10">
        {/* Breadcrumb & Telemetry Node */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-[#92ccff] hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link to="/games" className="text-[#92ccff] hover:underline">
              Games
            </Link>
            <span>/</span>
            <span className="text-[#dfe0ff]">Cyber Strike (Beta 0.8)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
              <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
              Telemetry Node // 128T Live
            </span>
            <span className="hidden sm:inline text-[#8f8fa3]">Build Hash: #UE5-920A</span>
          </div>
        </div>

        {/* HERO GAME BANNER */}
        <section className="relative w-full rounded-2xl overflow-hidden bg-[#13183d] border border-[#21274c] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Visual Screen with Gameplay Art */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
              <div
                className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.75] contrast-[1.1]"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5UkOmCr6CINEP78z7ZGUHfeYbJq7QHuLOTr74SgTwOk5HBq6FQcYOL8BOUcXI4ogLvzQ73-jWYPLKpqFjaXYMVWtfh9rCWAQY8dWdaw7IbnqN2l_raus0FLcwpFahKHdiAP5PBSGBSPvkaEJS0LkMQOQfKXXMFQCGH3vAwooFAG4_OP8wd52tf8V7jMJ_BKDH-W5bYO1IBgJBOJ438iEqSu1wdq7uBN3GBM9rzTwlm5MX5ST0qKE')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/50 to-transparent -z-10" />

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg">
                  VERIFIED CLOSED BETA
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#92ccff] text-xs font-semibold">
                  UNREAL ENGINE 5.4
                </span>
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#cce5ff] text-xs font-semibold">
                  128 TICK ROLLBACK
                </span>
              </div>

              {/* Bottom Quick Spec Card */}
              <div className="bg-[#050930]/90 backdrop-blur-xl p-4 rounded-xl border border-[#21274c] max-w-md shadow-xl mt-auto">
                <div className="text-xs uppercase font-headline tracking-wider text-[#92ccff] font-semibold mb-2">
                  Session Schedule
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#8f8fa3] block text-[11px]">Testing Window:</span>
                    <span className="text-white font-semibold">Sep 26 – Oct 04, 2026</span>
                  </div>
                  <div>
                    <span className="text-[#8f8fa3] block text-[11px]">Daily Server Windows:</span>
                    <span className="text-white font-semibold">18:00 – 23:00 AST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign Summary & Apply Box */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#13183d]/95 backdrop-blur-2xl">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-headline font-bold text-[#92ccff] uppercase tracking-wider mb-1">
                    <span>XYZ Studios</span>
                    <span>•</span>
                    <span className="text-[#8f8fa3]">12 Published Games</span>
                  </div>
                  <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Cyber Strike
                  </h1>
                  <div className="text-xs font-mono text-[#8f8fa3] mt-1">
                    Playtest Cohort Candidate v0.8.4
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#21274c] text-xs text-[#dfe0ff] font-medium">
                    Tactical FPS
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#21274c] text-xs text-[#dfe0ff] font-medium">
                    5v5 Ranked
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#21274c] text-xs text-[#dfe0ff] font-medium">
                    Middle East Servers
                  </span>
                </div>

                {/* Bounty & Roster Callout */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#050930] border border-[#21274c]">
                  <div>
                    <span className="text-[11px] font-mono text-[#8f8fa3] uppercase">
                      Bounty Allocation
                    </span>
                    <div className="font-headline text-xl font-bold text-[#cce5ff] mt-0.5">
                      ₹120,000
                    </div>
                    <span className="text-[10px] text-[#92ccff]">Instant Escrow</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-[#8f8fa3] uppercase">
                      Roster Capacity
                    </span>
                    <div className="font-headline text-xl font-bold text-white mt-0.5">
                      1,248 / 2,000
                    </div>
                    <span className="text-[10px] text-[#92ccff]">752 Slots Open</span>
                  </div>
                </div>

                <p className="text-xs text-[#c5c5da] leading-relaxed">
                  Join XYZ Studios in stress testing next-gen ballistic hitboxes, network
                  interpolation curves, and destructible cover mechanics under competitive
                  high-stakes ping conditions.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#21274c] flex flex-col gap-3">
                <Link
                  to="/games/cyber-strike/apply"
                  className="btn-shimmer w-full text-center py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply for Testing Slot</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <div className="flex items-center justify-center gap-2 text-xs text-[#8f8fa3]">
                  <span className="material-symbols-outlined text-[16px] text-[#92ccff]">
                    verified_user
                  </span>
                  <span>Requires Verified Gamer Identity & NDA Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION A: ABOUT THE GAME */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
            <h2 className="font-headline text-2xl font-bold text-white">About The Game</h2>
          </div>
          <p className="text-sm text-[#c5c5da] leading-relaxed max-w-4xl">
            Cyber Strike is a fast-paced, high-fidelity 5v5 tactical first-person shooter engineered
            in Unreal Engine 5.4. Featuring modular weapon loadouts, zero-delay rollback netcode on
            128-tick servers, and fully server-authoritative destructible barrier kinetics, the game
            is built from the ground up for competitive esports tournaments across the MENA region
            and worldwide.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#21274c]/60">
            <div>
              <span className="text-xs text-[#8f8fa3] block">Engine</span>
              <span className="text-sm text-white font-semibold">Unreal Engine 5.4.3</span>
            </div>
            <div>
              <span className="text-xs text-[#8f8fa3] block">Anti-Cheat</span>
              <span className="text-sm text-white font-semibold">Vanguard Ring-0 Compatible</span>
            </div>
            <div>
              <span className="text-xs text-[#8f8fa3] block">Server Locations</span>
              <span className="text-sm text-white font-semibold">Riyadh, Dubai, Frankfurt</span>
            </div>
            <div>
              <span className="text-xs text-[#8f8fa3] block">NDA Requirement</span>
              <span className="text-sm text-white font-semibold">Level 1 Digital NDA</span>
            </div>
          </div>
        </section>

        {/* SECTION B: WHAT WE'RE TESTING */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#233dff]" />
              <h2 className="font-headline text-2xl font-bold text-white">What We're Testing</h2>
            </div>
            <span className="text-xs font-mono text-[#8f8fa3]">5 Active Audit Focus Tracks</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[24px]">target</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white">
                    Core Gunplay & Movement
                  </h3>
                  <span className="text-xs text-[#8f8fa3]">Kinematics & Weapon Recoil</span>
                </div>
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Evaluating first-shot reset timers, horizontal spray divergence curves on pulse
                rifles, sliding trajectory velocity decay, and air-strafe input friction.
              </p>
              <div className="mt-auto pt-3 border-t border-[#21274c]/60 flex items-center justify-between text-xs text-[#92ccff] font-mono">
                <span>Priority: Critical</span>
                <span>Target: 600 Match Logs</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[24px]">swap_calls</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white">
                    Multiplayer & 128T Netcode
                  </h3>
                  <span className="text-xs text-[#8f8fa3]">Rollback & Packet Integrity</span>
                </div>
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Subjecting the game to simulated 80-140ms cross-regional latency packets. Validating
                rewind extrapolation buffers and competitive tick synchronization.
              </p>
              <div className="mt-auto pt-3 border-t border-[#21274c]/60 flex items-center justify-between text-xs text-[#92ccff] font-mono">
                <span>Priority: Urgent</span>
                <span>Target: Packet Loss &lt; 0.2%</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[24px]">bug_report</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white">
                    Geometry & Ragdoll Bugs
                  </h3>
                  <span className="text-xs text-[#8f8fa3]">Mesh Collision & Clipping</span>
                </div>
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Isolating corner ledge-mantle desyncs, ragdoll physics clipping through blast door
                airlocks, and anomalous crouch-slide geometry catches.
              </p>
              <div className="mt-auto pt-3 border-t border-[#21274c]/60 flex items-center justify-between text-xs text-[#92ccff] font-mono">
                <span>Priority: High</span>
                <span>Active Bug Escrow Active</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[24px]">speed</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white">
                    Mid-Range Hardware Profiling
                  </h3>
                  <span className="text-xs text-[#8f8fa3]">RTX 3060 & RX 6600 Frametimes</span>
                </div>
              </div>
              <p className="text-xs text-[#c5c5da] leading-relaxed">
                Assessing 1% low frame stutter during multi-ult teamfights, VRAM paging spikes on
                8GB configurations, and background shader compilation load.
              </p>
              <div className="mt-auto pt-3 border-t border-[#21274c]/60 flex items-center justify-between text-xs text-[#92ccff] font-mono">
                <span>Priority: Standard</span>
                <span>Target: Sustained 144 FPS</span>
              </div>
            </div>

            {/* Card 5 (Full Width) */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#233dff]/20 flex items-center justify-center text-[#92ccff] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">headphones</span>
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-white">
                    Spatial Audio Cues & Tactical HUD
                  </h3>
                  <p className="text-xs text-[#c5c5da] max-w-xl mt-0.5">
                    Verification of 3D vertical sound localization (footsteps above/below steel
                    grates) and HUD retina readability in chaotic flash-grenade scenarios.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#21274c] px-4 py-2 rounded-xl shrink-0">
                <span className="material-symbols-outlined text-[#92ccff] text-[18px]">
                  equalizer
                </span>
                <span className="text-xs text-white font-semibold">Binaural HRTF Engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION C: TESTER REQUIREMENTS */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5cb6f9]" />
              <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-tight">
                Tester Requirements
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8f8fa3] uppercase">
              Riyadah Compliance Check
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#21274c]/40 border border-[#21274c]">
              <div className="w-6 h-6 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Hardware Minimum</div>
                <div className="text-xs text-[#c5c5da] mt-0.5">
                  Intel i5-10400 / Ryzen 5 3600, 16GB RAM, RTX 2060 / RX 5600 XT or higher.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#21274c]/40 border border-[#21274c]">
              <div className="w-6 h-6 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Network Stability</div>
                <div className="text-xs text-[#c5c5da] mt-0.5">
                  Broadband fiber connection, wired ethernet preferred, ping to Riyadh server &lt;
                  65ms.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#21274c]/40 border border-[#21274c]">
              <div className="w-6 h-6 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Session Commitment</div>
                <div className="text-xs text-[#c5c5da] mt-0.5">
                  Minimum 4 logged competitive matches and 1 structured bug report submission.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#21274c]/40 border border-[#21274c]">
              <div className="w-6 h-6 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Non-Disclosure Agreement</div>
                <div className="text-xs text-[#c5c5da] mt-0.5">
                  Must accept Digital NDA prior to receiving cryptographic build download link.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D: 5-STEP TESTING WORKFLOW */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#050A30] border border-[#21274c] shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
            <h2 className="font-headline text-2xl font-bold text-white">5-Step Testing Workflow</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 01</span>
              <h3 className="font-headline text-sm font-bold text-white">Apply & Profile Rig</h3>
              <p className="text-xs text-[#8f8fa3]">
                Submit hardware rig and gaming ranked history for cohort match.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 02</span>
              <h3 className="font-headline text-sm font-bold text-white">Sign Digital NDA</h3>
              <p className="text-xs text-[#8f8fa3]">
                One-click cryptographic agreement via your Gamer Passport.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 03</span>
              <h3 className="font-headline text-sm font-bold text-white">Download Build</h3>
              <p className="text-xs text-[#8f8fa3]">
                Access secure watermarked build launcher through Steam/Epic token.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 04</span>
              <h3 className="font-headline text-sm font-bold text-white">Log Telemetry</h3>
              <p className="text-xs text-[#8f8fa3]">
                Play designated sessions with automatic crash and FPS telemetry logging.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 05</span>
              <h3 className="font-headline text-sm font-bold text-white">Claim Escrow</h3>
              <p className="text-xs text-[#8f8fa3]">
                Receive bug bounties and Soulbound REP directly to your account.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#8f8fa3]">
              Ready to test Cyber Strike? Over 1,248 testers currently enrolled in this phase.
            </div>
            <Link
              to="/games/cyber-strike/apply"
              className="btn-shimmer px-6 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-lg"
            >
              Start Application
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GameTestingDetailsPage;
