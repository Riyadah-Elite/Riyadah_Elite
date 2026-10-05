import React, { useState } from "react";
import { Link } from "react-router-dom";

export const GameRightsOwnershipPage: React.FC = () => {
  const [authType, setAuthType] = useState<string>("company");
  const [agreement1, setAgreement1] = useState(true);
  const [agreement2, setAgreement2] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full text-[#dfe0ff]">
      <div className="w-full max-w-[1280px] mx-auto px-6 py-8">
        {/* Top Telemetry & Global Breadcrumbs Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2 font-headline text-xs text-[#8f8fa3] uppercase tracking-wider">
            <Link to="/for-developers" className="hover:text-[#5cb6f9] transition-colors">
              Developer Portal
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/games" className="hover:text-[#5cb6f9] transition-colors">
              My Games
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#5cb6f9] font-bold">Shadow Protocol</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-white">Rights &amp; Ownership</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13183d] border border-[#5cb6f9]/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5cb6f9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5cb6f9]"></span>
            </span>
            <span className="font-headline text-xs text-[#c5c5da] font-semibold">
              Riyadh Node 04 · <span className="text-[#5cb6f9]">99.9% Online</span> · IP Telemetry Active
            </span>
          </div>
        </div>

        {/* Master Grid (Sidebar + Main Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT DASHBOARD NAVIGATION SIDEBAR (3 cols on desktop) */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            {/* Studio Verified Operator Identity Pill */}
            <div className="p-5 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider">
                  Active Workspace
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#233dff]/30 text-[#5cb6f9] font-headline text-xs font-bold flex items-center gap-1 border border-[#5cb6f9]/30">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Tier-1
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#21274c] flex items-center justify-center text-[#5cb6f9] shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">terminal</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-sm text-white font-bold truncate">
                    CyberNova Studios
                  </span>
                  <span className="font-body text-xs text-[#c5c5da] truncate">@cybernovagames</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#21274c]/50 flex items-center justify-between font-mono text-xs text-[#8f8fa3]">
                <span>Cluster: Riyadh-04</span>
                <span className="text-[#5cb6f9]">ID: CN-9940</span>
              </div>
            </div>

            {/* Sidebar Navigation Tree */}
            <div className="p-5 rounded-2xl bg-[#13183d] border border-[#21274c] flex flex-col gap-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="px-2 font-headline text-xs text-[#8f8fa3] uppercase tracking-widest font-bold mb-1">
                  Main Console
                </span>
                <Link
                  to="/for-developers"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-headline text-xs text-[#c5c5da] hover:bg-[#21274c] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span> Overview
                </Link>
                <Link
                  to="/games"
                  className="flex items-center justify-between px-3 py-2 rounded-xl font-headline text-xs bg-[#233dff] text-white shadow-md font-bold"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">sports_esports</span> My Games
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#5cb6f9]"></span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-headline text-xs text-[#c5c5da] hover:bg-[#21274c] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">science</span> Testing Workflows
                </Link>
                <Link
                  to="/tournaments"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-headline text-xs text-[#c5c5da] hover:bg-[#21274c] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">emoji_events</span> Tournaments
                </Link>
              </div>

              <div className="pt-2 border-t border-[#21274c]/50 flex flex-col gap-1">
                <span className="px-2 font-headline text-xs text-[#8f8fa3] uppercase tracking-widest font-bold mb-1">
                  Legal &amp; Trust
                </span>
                <div className="flex items-center justify-between px-3 py-2 rounded-xl font-headline text-xs bg-[#21274c] text-[#5cb6f9] font-bold">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">gavel</span> Rights Declaration
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#050930]">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Game Selector Micro-Card */}
            <div className="p-5 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-sm flex flex-col gap-2">
              <span className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider">
                Targeted Game Title
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#21274c] overflow-hidden shrink-0 flex items-center justify-center text-[#5cb6f9]">
                  <span className="material-symbols-outlined text-[28px]">sports_esports</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline text-sm text-white font-bold truncate">
                    Shadow Protocol
                  </span>
                  <span className="font-mono text-xs text-[#5cb6f9] truncate">Build #1042 · RC-8</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#21274c]/50 flex items-center justify-between text-[#c5c5da] font-headline text-xs">
                <span>Stage: Pre-Alpha VIP</span>
                <span className="text-[#5cb6f9] font-bold">142 Testers</span>
              </div>
            </div>
          </aside>

          {/* RIGHT MASTER WORKSPACE (9 cols on desktop) */}
          <section className="lg:col-span-9 flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-headline text-3xl sm:text-4xl text-white font-bold tracking-tight">
                  Game Rights &amp; Ownership
                </h1>
                <p className="font-body text-sm text-[#c5c5da] max-w-2xl mt-1">
                  Confirm that you own or have explicit authorized permission to submit this game title for testing and live telemetry logging on Riyadah Elite.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/for-developers"
                  className="px-4 py-2.5 rounded-xl font-headline text-xs font-bold bg-[#13183d] border border-[#21274c] hover:bg-[#21274c] text-[#c5c5da] hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Developer Portal</span>
                </Link>
              </div>
            </div>

            {/* GAME IDENTIFICATION CARD */}
            <div className="p-6 rounded-3xl bg-[#13183d] border border-[#21274c] backdrop-blur-md shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#21274c] border border-[#5cb6f9]/30 flex items-center justify-center text-[#5cb6f9] shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[36px]">videogame_asset</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-headline text-xl text-white font-bold">Shadow Protocol</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#233dff]/20 text-[#5cb6f9] font-headline text-xs border border-[#5cb6f9]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5cb6f9] animate-pulse"></span> Under Review
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#c5c5da]">
                    CyberNova Studios (<span className="text-[#5cb6f9]">@cybernovagames</span>) · Version:{" "}
                    <span className="text-white font-mono font-semibold">v0.8.4-RC (Build #1042)</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-headline text-[#c5c5da] mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#5cb6f9]">devices</span> PC (Windows) · Unreal Engine 5.4
                    </span>
                    <span className="flex items-center gap-1 text-[#5cb6f9] font-bold">
                      <span className="material-symbols-outlined text-[15px]">security</span> $8,500 USD Telemetry Escrow Protected
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-[#050930]/80 p-3.5 rounded-2xl border border-[#21274c]">
                <span className="font-headline text-xs text-[#8f8fa3] uppercase tracking-wider">
                  Declaration Status
                </span>
                <span className="font-headline text-sm text-[#5cb6f9] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span> Rights Sealed (Stage 2/3)
                </span>
                <span className="text-[11px] text-[#8f8fa3]">Updated today at 14:22 UTC</span>
              </div>
            </div>

            {/* TWO-COLUMN WORKFLOW SECTION */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* MAIN CONTENT FORM COLUMN */}
              <div className="xl:col-span-8 flex flex-col gap-8">
                {submitted && (
                  <div className="p-4 rounded-2xl bg-[#233dff]/20 border border-[#5cb6f9] text-[#cae8ff] flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">task_alt</span>
                    <div>
                      <h4 className="font-headline text-sm font-bold text-white">Declaration Submitted Successfully</h4>
                      <p className="font-body text-xs mt-0.5">
                        Your rights attestation has been recorded into the platform verification pipeline. Platform Trust &amp; Safety will audit your submission within 12–24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* 1. AUTHORIZATION TYPE SELECTOR */}
                  <section className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#233dff] text-white font-headline text-xs flex items-center justify-center font-bold">
                          1
                        </span>
                        <h2 className="font-headline text-lg text-white font-bold">
                          How are you authorized to submit this game?
                        </h2>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#c5c5da] pl-8 mt-1">
                        Select the legal basis under which you are submitting this game for player testing and performance telemetry on Riyadah Elite.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 lg:pl-8">
                      {[
                        {
                          id: "solo",
                          icon: "person",
                          title: "I created and own the game",
                          desc: "Solo independent creator retaining full intellectual property ownership.",
                        },
                        {
                          id: "company",
                          icon: "corporate_fare",
                          title: "Company / Studio ownership",
                          desc: "Registered studio or corporate legal entity holds exclusive IP rights.",
                          rec: true,
                        },
                        {
                          id: "team_member",
                          icon: "groups",
                          title: "Development team member",
                          desc: "Authorized team lead or designated member submitting on behalf of group.",
                        },
                        {
                          id: "representative",
                          icon: "assignment_ind",
                          title: "Authorized representative",
                          desc: "Agent, publisher manager, or corporate proxy with verified delegation rights.",
                        },
                        {
                          id: "distributor",
                          icon: "handshake",
                          title: "Licensed distributor",
                          desc: "Publishing rights, distribution master license, or regional exclusivity grant.",
                        },
                        {
                          id: "academic_other",
                          icon: "school",
                          title: "Other authorized arrangement",
                          desc: "Academic game dev incubator, university lab, or collaborative consortium.",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          onClick={() => setAuthType(opt.id)}
                          className={`relative flex flex-col p-4 rounded-2xl cursor-pointer transition-all border ${
                            authType === opt.id
                              ? "bg-[#171c41] border-[#5cb6f9] shadow-[0_0_20px_rgba(35,61,255,0.4)]"
                              : "bg-[#13183d] border-[#21274c] hover:bg-[#171c41]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`material-symbols-outlined text-[22px] ${
                                authType === opt.id ? "text-[#5cb6f9]" : "text-[#8f8fa3]"
                              }`}
                            >
                              {opt.icon}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                authType === opt.id ? "bg-[#233dff]" : "bg-[#21274c]"
                              }`}
                            >
                              {authType === opt.id && (
                                <span className="material-symbols-outlined text-white text-[14px]">
                                  check
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`font-headline text-sm font-bold mb-1 ${
                              authType === opt.id ? "text-white" : "text-[#dfe0ff]"
                            }`}
                          >
                            {opt.title}
                          </span>
                          <span className="font-body text-xs text-[#c5c5da]">{opt.desc}</span>
                          {opt.rec && (
                            <span className="mt-2 self-start px-2 py-0.5 rounded-full bg-[#233dff]/30 text-[#5cb6f9] font-headline text-[10px] uppercase font-bold">
                              Recommended for Teams
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* 2. OWNERSHIP DETAILS */}
                  <section className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#233dff] text-white font-headline text-xs flex items-center justify-center font-bold">
                          2
                        </span>
                        <h2 className="font-headline text-lg text-white font-bold">
                          Studio &amp; Entity Ownership Details
                        </h2>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#c5c5da] pl-8 mt-1">
                        State the legal entity holding copyright and commercial telemetry distribution rights.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#13183d] border border-[#21274c] flex flex-col gap-4 ml-0 lg:ml-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-headline text-xs text-[#c5c5da] uppercase tracking-wider flex items-center justify-between">
                            <span>Legal Entity Name</span>
                            <span className="text-[#5cb6f9] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span> Verified
                            </span>
                          </label>
                          <input
                            defaultValue="CyberNova Studios LLC"
                            className="w-full bg-[#050930] px-4 py-2.5 rounded-xl font-body text-sm text-white border border-[#21274c] outline-none focus:border-[#5cb6f9]"
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-headline text-xs text-[#c5c5da] uppercase tracking-wider">
                            Commercial Registration / Entity ID
                          </label>
                          <input
                            defaultValue="CR-1010-849204 (Saudi Arabia)"
                            className="w-full bg-[#050930] px-4 py-2.5 rounded-xl font-body text-sm text-white border border-[#21274c] outline-none focus:border-[#5cb6f9]"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-headline text-xs text-[#c5c5da] uppercase tracking-wider">
                            Authorized Representative &amp; Signatory
                          </label>
                          <input
                            defaultValue="Khalid Al-Rashid (Lead Director)"
                            className="w-full bg-[#050930] px-4 py-2.5 rounded-xl font-body text-sm text-white border border-[#21274c] outline-none focus:border-[#5cb6f9]"
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-headline text-xs text-[#c5c5da] uppercase tracking-wider">
                            Relationship to Game Title
                          </label>
                          <select className="w-full bg-[#050930] px-4 py-2.5 rounded-xl font-body text-sm text-white border border-[#21274c] outline-none focus:border-[#5cb6f9]">
                            <option>Primary Creator &amp; Sole Rights Holder</option>
                            <option>Exclusive Global Publishing Licensee</option>
                            <option>Regional Publishing &amp; Localization Partner</option>
                            <option>Academic Team Lead &amp; IP Assignee</option>
                          </select>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#171c41] border border-[#21274c] flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#5cb6f9] text-[20px] shrink-0 mt-0.5">
                          verified_user
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-headline text-xs text-white font-bold">
                            IP Assignment &amp; Work-for-Hire Sealed
                          </span>
                          <p className="font-body text-xs text-[#c5c5da]">
                            All CyberNova team members, 3D rigging contractors, and telemetry developers have executed comprehensive IP assignment deeds in compliance with Saudi IP Authority (SAIP) standards.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 3. SUPPORTING EVIDENCE */}
                  <section className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#233dff] text-white font-headline text-xs flex items-center justify-center font-bold">
                          3
                        </span>
                        <h2 className="font-headline text-lg text-white font-bold">
                          Supporting Evidence (Optional / Conditional)
                        </h2>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#c5c5da] pl-8 mt-1">
                        A formal copyright registration certificate is{" "}
                        <strong className="text-white">NOT mandatory</strong>. You may provide any supporting documentation that demonstrates your authorization.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 ml-0 lg:ml-8">
                      <div className="p-4 rounded-2xl bg-[#13183d] border border-[#21274c] flex items-start gap-3">
                        <span className="material-symbols-outlined text-[#5cb6f9] text-[22px] shrink-0">info</span>
                        <p className="font-body text-xs sm:text-sm text-[#c5c5da] leading-relaxed">
                          Accepted documentation types include Developer Assignment Agreements, Git Repo Sign-off, Publisher Term Sheets, Incubator Letters, or SAIP / WIPO filings. For student teams, faculty endorsement letters are fully honored.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-[#13183d] border border-[#21274c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#21274c] flex items-center justify-center text-[#5cb6f9] shrink-0">
                            <span className="material-symbols-outlined text-[24px]">description</span>
                          </div>
                          <div>
                            <div className="font-headline text-sm text-white font-bold">
                              CyberNova_ShadowProtocol_IP_Declaration_2024.pdf
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-[#8f8fa3] mt-0.5">
                              <span>1.8 MB</span>
                              <span>•</span>
                              <span className="text-[#5cb6f9] font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">lock</span> SHA-256 Verified
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-3 py-1 rounded-lg bg-[#21274c] text-xs font-headline font-semibold text-[#cae8ff]">
                            Uploaded &amp; Sealed
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 4. THIRD-PARTY ASSETS CLEARANCE */}
                  <section className="flex flex-col gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#233dff] text-white font-headline text-xs flex items-center justify-center font-bold">
                          4
                        </span>
                        <h2 className="font-headline text-lg text-white font-bold">
                          Third-Party Assets &amp; Middleware Clearance
                        </h2>
                      </div>
                      <p className="font-body text-xs sm:text-sm text-[#c5c5da] pl-8 mt-1">
                        Confirm that all third-party libraries, sound tracks, and art assets utilized within this game build comply with commercial or testing distribution standards.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#13183d] border border-[#21274c] flex flex-col gap-3 ml-0 lg:ml-8">
                      {[
                        { title: "Audio & Music Scores", desc: "Original orchestral score composed in-house; ambient tracks licensed under Epidemic Sound Game Tier.", tag: "Licensed" },
                        { title: "Fonts & UI Typography", desc: "Custom studio wordmark + commercial desktop & runtime licenses secured for Space Grotesk and Plus Jakarta Sans.", tag: "Cleared" },
                        { title: "3D Meshes & Visual Art Assets", desc: "All hero characters and environment meshes created in-house; Unreal Marketplace background kit licensed.", tag: "Cleared" },
                        { title: "Plugins, Engine & Telemetry SDK", desc: "Unreal Engine 5.4 Chaos Physics, Riyadah Telemetry Native SDK v2.4 certified safe and compliant.", tag: "Verified SDK" },
                        { title: "Character IP & Likeness Restrictions", desc: "No unlicensed celebrity likenesses, registered trademarks, or external copyrighted game franchises are depicted.", tag: "Confirmed" },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#050930]/80 border border-[#21274c]/50"
                        >
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#5cb6f9] text-[18px] mt-0.5 shrink-0">
                              check_circle
                            </span>
                            <div>
                              <span className="font-headline text-xs sm:text-sm text-white font-bold">
                                {item.title}
                              </span>
                              <p className="font-body text-xs text-[#c5c5da] mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#21274c] text-[#5cb6f9] font-headline text-xs font-semibold">
                            {item.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 5. LEGAL RIGHTS DECLARATION & SUBMISSION */}
                  <section className="flex flex-col gap-4 ml-0 lg:ml-8">
                    <div className="p-6 rounded-3xl bg-[#171c41] border border-[#21274c] shadow-2xl flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5cb6f9] text-[24px]">gavel</span>
                        <h3 className="font-headline text-base text-white font-bold">
                          Binding Telemetry &amp; Rights Attestation
                        </h3>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreement1}
                            onChange={(e) => setAgreement1(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded bg-[#050930] text-[#233dff] accent-[#233dff] focus:ring-0"
                          />
                          <span className="font-body text-xs sm:text-sm text-[#dfe0ff] leading-relaxed">
                            I confirm and declare that CyberNova Studios LLC possesses the necessary intellectual property rights, licenses, or explicit authorization to submit this game build for player testing and telemetry campaigns on Riyadah Elite.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={agreement2}
                            onChange={(e) => setAgreement2(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded bg-[#050930] text-[#233dff] accent-[#233dff] focus:ring-0"
                          />
                          <span className="font-body text-xs sm:text-sm text-[#dfe0ff] leading-relaxed">
                            I understand that intentional misrepresentation of ownership or unauthorized submission will result in immediate suspension of all testing sessions, forfeiture of escrow bounties ($8,500 USD), and permanent de-verification under the Riyadah Competitive Charter.
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-[#21274c]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="submit"
                          disabled={!agreement1 || !agreement2}
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-headline text-sm bg-[#233dff] hover:bg-[#324bff] text-white font-bold shadow-[0_4px_24px_rgba(35,61,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>Submit Rights Information for Review</span>
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className="px-4 py-2.5 rounded-xl font-headline text-xs bg-[#21274c] hover:bg-[#31365d] text-[#c5c5da] hover:text-white transition-all font-semibold"
                          >
                            Save Draft
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* RIGHT RAIL SIDEBAR */}
              <aside className="xl:col-span-4 flex flex-col gap-6">
                {/* 1. RIGHTS STATUS & REVIEW PIPELINE CARD */}
                <div className="p-6 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-base text-white font-bold">Review Pipeline</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5cb6f9]/20 text-[#5cb6f9] font-headline text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5cb6f9] animate-pulse"></span> Under Review
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 relative">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#5cb6f9] text-[#050930] font-bold text-xs flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline text-xs text-white font-bold">Submission Received</span>
                        <span className="font-body text-[11px] text-[#8f8fa3]">Aug 18, 2024 · 14:22 UTC via Studio Portal</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#5cb6f9] text-[#050930] font-bold text-xs flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline text-xs text-white font-bold">Automated Hash &amp; SDK Scan</span>
                        <span className="font-body text-[11px] text-[#5cb6f9]">Passed · Zero flagged third-party binaries</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#233dff] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(35,61,255,0.8)]">
                        <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline text-xs text-white font-bold">Trust &amp; Safety Review</span>
                        <span className="font-body text-[11px] text-[#5cb6f9]">In Progress · Est. completion 12–24h</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 opacity-50">
                      <div className="w-7 h-7 rounded-full bg-[#21274c] text-[#8f8fa3] font-bold text-xs flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline text-xs text-white font-bold">Verification Seal Issued</span>
                        <span className="font-body text-[11px] text-[#8f8fa3]">Unlocks public VIP testing queues</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. NEED HELP UNDERSTANDING EVIDENCE? */}
                <div className="p-6 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-sm flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#5cb6f9] text-[22px]">help</span>
                    <span className="font-headline text-base text-white font-bold">Evidence Guidance</span>
                  </div>
                  <p className="font-body text-xs text-[#c5c5da] leading-relaxed">
                    Not sure what documents to provide? Whether you are a solo indie developer, university student project, or seasoned studio, our Developer Support team helps guide you through lightweight attestation.
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="p-3 rounded-xl bg-[#171c41] border border-[#21274c]/50">
                      <span className="font-headline text-xs text-white font-bold block mb-1">
                        Do I need a government trademark?
                      </span>
                      <p className="font-body text-[11px] text-[#c5c5da]">
                        No. Riyadah verification welcomes creation records, version control commit history, or creator assignment declarations.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#171c41] border border-[#21274c]/50">
                      <span className="font-headline text-xs text-white font-bold block mb-1">
                        What about open source assets?
                      </span>
                      <p className="font-body text-[11px] text-[#c5c5da]">
                        Permissive licenses (MIT, Apache 2.0, BSD, CC-BY) are fully permitted for player testing builds.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. ESCROW & COMMUNITY TRUST SAFEGUARD */}
                <div className="p-6 rounded-3xl bg-[#050930] border border-[#21274c] shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#5cb6f9]">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                    <span className="font-headline text-xs text-white font-bold uppercase tracking-wider">
                      Why We Verify Rights
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#c5c5da] leading-relaxed mt-1">
                    Riyadah Elite maintains a zero-tolerance policy against game asset flipping and unauthorized IP cloning. Rigorous verification ensures:
                  </p>
                  <ul className="space-y-2 text-xs font-body text-[#c5c5da] mt-2">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#5cb6f9] text-[16px] shrink-0 mt-0.5">lock</span>
                      <span>Developer builds &amp; telemetry remain strictly protected.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#5cb6f9] text-[16px] shrink-0 mt-0.5">payments</span>
                      <span>Guaranteed escrow bounty release ($8,500 USD reserved).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#5cb6f9] text-[16px] shrink-0 mt-0.5">military_tech</span>
                      <span>Players receive genuine competition telemetry credit.</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GameRightsOwnershipPage;
