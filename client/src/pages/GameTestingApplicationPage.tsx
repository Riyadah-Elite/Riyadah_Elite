import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";

export const GameTestingApplicationPage: React.FC = () => {
  const [platform, setPlatform] = useState<string[]>(["pc"]);
  const [playerPersona, setPlayerPersona] = useState("competitive");
  const [selectedGames, setSelectedGames] = useState<string[]>(["valorant", "cs2", "apex"]);
  const [gpu, setGpu] = useState("RTX 3070");
  const [cpu, setCpu] = useState("Ryzen 7 5800X");
  const [ram, setRam] = useState("32GB");
  const [monitorHz, setMonitorHz] = useState("165Hz");
  const [availabilityHours, setAvailabilityHours] = useState("10-15");
  const [agreedNda, setAgreedNda] = useState(false);
  const [agreedTelemetry, setAgreedTelemetry] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const togglePlatform = (p: string) => {
    setPlatform((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const toggleGame = (g: string) => {
    setSelectedGames((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedNda || !agreedTelemetry) {
      alert("Please accept both the Testing Agreement and Telemetry Authorization to proceed.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] overflow-x-hidden">
      <Header />

      <main className="w-full pt-28 pb-20 px-6 max-w-[960px] mx-auto flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
          <div className="flex items-center gap-2">
            <Link to="/games" className="text-[#92ccff] hover:underline">
              Games
            </Link>
            <span>/</span>
            <Link to="/games/cyber-strike" className="text-[#92ccff] hover:underline">
              Cyber Strike
            </Link>
            <span>/</span>
            <span className="text-[#dfe0ff]">Testing Application</span>
          </div>
          <div className="flex items-center gap-2 text-[#92ccff]">
            <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
            <span>Cohort Slot Allocation: 74% Full</span>
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#233dff]/15 text-[#92ccff] text-xs font-headline font-semibold tracking-wider uppercase w-fit border border-[#233dff]/30">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Verified Closed Beta Session
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            APPLY TO TEST: CYBER STRIKE (BETA 0.8.4)
          </h1>
          <p className="text-[#c5c5da] text-sm sm:text-base leading-relaxed">
            Tell us a little about your hardware, ranked benchmark history, and playstyle so XYZ
            Studios can match you with the optimal competitive netcode and stress-testing cohort.
          </p>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
              01. Identity & Region
            </span>
            <span className="text-xs font-semibold text-[#92ccff] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Verified Profile
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
              02. Gaming Profile
            </span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#233dff]"></span>
              Proficiency Audit
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">03. Hardware Rig</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#8f8fa3]">memory</span>
              Specs & Telemetry
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
              04. Legal Agreement
            </span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#8f8fa3]">shield</span>
              Digital NDA
            </span>
          </div>
        </div>

        {submitted ? (
          /* Submission Success State */
          <div className="p-8 sm:p-12 rounded-2xl bg-[#13183d] border border-[#92ccff]/40 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white">
              You're in the Queue!
            </h2>
            <p className="text-sm text-[#c5c5da] max-w-md leading-relaxed">
              Your application for <strong className="text-white">Cyber Strike Beta 0.8.4</strong>{" "}
              has been registered with XYZ Studios. You will receive an automated notification and
              launcher token upon cohort matching.
            </p>
            <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c] font-mono text-xs text-[#92ccff] text-left max-w-md w-full">
              <div>Application ID: #APP-CS-84092</div>
              <div>Tester Identity: Rahul (REP 92/100)</div>
              <div>Assigned Rig Class: Tier-2 High Perf (144Hz+)</div>
              <div>Queue Position: #14 in Priority Cohort</div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/games"
                className="px-6 py-2.5 rounded-xl bg-[#21274c] hover:bg-[#2b3363] text-white text-xs font-bold font-headline transition-colors"
              >
                Browse More Games
              </Link>
              <Link
                to="/"
                className="px-6 py-2.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white text-xs font-bold font-headline transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        ) : (
          /* Form Section */
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* SECTION 1: Personal & Demographics */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-white">
                    1. Personal & Demographics
                  </h2>
                  <p className="text-xs text-[#8f8fa3]">
                    Confirm your testing region and identity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                    Tester Handle / Gamer ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Rahul (Verified REP 92)"
                    className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-[#92ccff] font-semibold cursor-not-allowed opacity-90"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                    Testing Region
                  </label>
                  <select className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]">
                    <option>Middle East / Gulf (Riyadh Node)</option>
                    <option>UAE / Dubai Node</option>
                    <option>Europe / Frankfurt Node</option>
                    <option>India / Mumbai Node</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: Gaming Profile & Genre Proficiency */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-white">
                    2. Gaming Profile & Genre Proficiency
                  </h2>
                  <p className="text-xs text-[#8f8fa3]">
                    Identify your mechanical skill tier and FPS experience level.
                  </p>
                </div>
              </div>

              {/* Primary Platform */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                  Primary Platform (Select all active)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: "pc", label: "PC Windows", icon: "desktop_windows" },
                    { id: "ps5", label: "PlayStation 5", icon: "sports_esports" },
                    { id: "xbox", label: "Xbox Series", icon: "gamepad" },
                    { id: "switch", label: "Nintendo", icon: "videogame_asset" },
                    { id: "mobile", label: "Mobile", icon: "smartphone" },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        platform.includes(p.id)
                          ? "bg-[#233dff] text-white border-[#92ccff] shadow-md"
                          : "bg-[#050930] text-[#8f8fa3] border-[#21274c] hover:border-[#444557]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] mb-1">{p.icon}</span>
                      <span className="text-xs font-semibold">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Persona */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">Player Persona</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#050930] p-1.5 rounded-xl border border-[#21274c]">
                  {[
                    { id: "casual", label: "Casual Gamer" },
                    { id: "regular", label: "Regular Player" },
                    { id: "competitive", label: "Competitive / Ranked" },
                    { id: "pro", label: "Pro Esports" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPlayerPersona(item.id)}
                      className={`py-2 rounded-lg text-xs font-headline font-semibold transition-all ${
                        playerPersona === item.id
                          ? "bg-[#233dff] text-white shadow"
                          : "text-[#8f8fa3] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequently Played Shooters */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                  Frequently Played Shooters
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "valorant", label: "Valorant (Immortal / Ascendant)" },
                    { id: "cs2", label: "Counter-Strike 2 (15k+ Rating)" },
                    { id: "apex", label: "Apex Legends (Diamond+)" },
                    { id: "overwatch", label: "Overwatch 2" },
                    { id: "cod", label: "Call of Duty: Warzone" },
                    { id: "rainbow6", label: "Rainbow Six Siege" },
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => toggleGame(g.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                        selectedGames.includes(g.id)
                          ? "bg-[#21274c] text-[#92ccff] border-[#92ccff]"
                          : "bg-[#050930] text-[#8f8fa3] border-[#21274c] hover:border-[#444557]"
                      }`}
                    >
                      {selectedGames.includes(g.id) && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: Testing Experience & Technical Rig */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[20px]">memory</span>
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-white">
                    3. Testing Experience & Technical Rig
                  </h2>
                  <p className="text-xs text-[#8f8fa3]">
                    Provide your PC hardware specifications for frame-pacing telemetry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                    Graphics Card (GPU)
                  </label>
                  <input
                    type="text"
                    value={gpu}
                    onChange={(e) => setGpu(e.target.value)}
                    className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                    Processor (CPU)
                  </label>
                  <input
                    type="text"
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                    className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">System RAM</label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                  >
                    <option>16GB DDR4</option>
                    <option>32GB DDR4/DDR5</option>
                    <option>64GB DDR5</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase font-mono text-[#8f8fa3]">
                    Monitor Refresh Rate
                  </label>
                  <select
                    value={monitorHz}
                    onChange={(e) => setMonitorHz(e.target.value)}
                    className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                  >
                    <option>60Hz</option>
                    <option>144Hz</option>
                    <option>165Hz</option>
                    <option>240Hz</option>
                    <option>360Hz+</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 4: Testing Availability & Commitment */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-white">
                    4. Testing Availability & Commitment
                  </h2>
                  <p className="text-xs text-[#8f8fa3]">
                    Estimate your weekly dedicated playtesting hours.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "5-10", label: "5 – 10 Hours/Wk" },
                  { id: "10-15", label: "10 – 15 Hours/Wk" },
                  { id: "15-20", label: "15 – 20 Hours/Wk" },
                  { id: "20+", label: "20+ Hours (Hardcore)" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setAvailabilityHours(item.id)}
                    className={`py-3 rounded-xl border text-xs font-semibold transition-all ${
                      availabilityHours === item.id
                        ? "bg-[#233dff] text-white border-[#92ccff] shadow"
                        : "bg-[#050930] text-[#8f8fa3] border-[#21274c] hover:border-[#444557]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {/* SECTION 5: Legal & Testing Agreement */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[#050A30] border border-[#21274c] shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <div>
                  <h2 className="font-headline text-lg font-bold text-white">
                    5. Legal & Testing Agreement
                  </h2>
                  <p className="text-xs text-[#8f8fa3]">
                    Cryptographic agreement required before receiving build token.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedNda}
                    onChange={(e) => setAgreedNda(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#233dff] bg-[#13183d] border-[#21274c] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#c5c5da] leading-relaxed">
                    I agree to the{" "}
                    <strong className="text-white">Digital Non-Disclosure Agreement (NDA)</strong>.
                    I will not stream, record, screenshot, or distribute any unreleased game assets
                    or build executables without explicit written approval from XYZ Studios.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTelemetry}
                    onChange={(e) => setAgreedTelemetry(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#233dff] bg-[#13183d] border-[#21274c] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#c5c5da] leading-relaxed">
                    I authorize the Riyadah Elite Telemetry Engine to capture crash logs,
                    frame-timing histograms, and netcode latency diagnostics solely during active
                    playtest sessions.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#21274c] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#8f8fa3]">
                  All bounty disbursements are automatically settled via smart escrow upon bug
                  verification.
                </div>
                <button
                  type="submit"
                  className="btn-shimmer w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Application</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </section>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GameTestingApplicationPage;
