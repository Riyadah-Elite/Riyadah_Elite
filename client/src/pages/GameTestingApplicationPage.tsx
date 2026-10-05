import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, GameOpportunityItem, PlayerProfileData, UserProfile } from "../lib/api";

export const GameTestingApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [opportunity, setOpportunity] = useState<GameOpportunityItem | null>(null);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [oppError, setOppError] = useState<string | null>(null);

  const [platform, setPlatform] = useState<string>("PC");
  const [playerPersona, setPlayerPersona] = useState("Competitive / Ranked");
  const [gpu, setGpu] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [monitorHz, setMonitorHz] = useState("144Hz+");
  const [availabilityHours, setAvailabilityHours] = useState("10-15 Hours/Wk");
  const [experienceNotes, setExperienceNotes] = useState("");
  const [agreedNda, setAgreedNda] = useState(false);
  const [agreedTelemetry, setAgreedTelemetry] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      if (!id) return;
      try {
        setLoadingOpp(true);
        setOppError(null);
        const oppRes = await apiRequest<{
          status: string;
          data: { opportunity: GameOpportunityItem };
        }>(`/player/opportunities/${id}`);

        if (isMounted) {
          if (!oppRes.ok) {
            setOppError(oppRes.error);
          } else {
            setOpportunity(oppRes.data.data.opportunity);
          }
        }

        // Try prefilling hardware from player's profile if authenticated
        try {
          const profRes = await apiRequest<{
            status: string;
            data: { user: UserProfile; profile: PlayerProfileData | null };
          }>("/player/profile");
          if (isMounted && profRes.ok && profRes.data.data.profile) {
            const p = profRes.data.data.profile;
            if (p.hardwareGpu) setGpu(p.hardwareGpu);
            if (p.hardwareCpu) setCpu(p.hardwareCpu);
            if (p.hardwareRam) setRam(p.hardwareRam);
          }
        } catch {
          // Unauthenticated or profile fetch fail is fine
        }
      } catch (err: unknown) {
        if (isMounted) {
          setOppError(err instanceof Error ? err.message : "Failed to load game opportunity");
        }
      } finally {
        if (isMounted) {
          setLoadingOpp(false);
        }
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedNda || !agreedTelemetry) {
      setSubmitError("You must accept both the Digital NDA and Telemetry Authorization to apply.");
      return;
    }
    if (!opportunity) return;

    try {
      setSubmitting(true);
      setSubmitError(null);
      const res = await apiRequest<{
        status: string;
        message: string;
        data: { application: { id: string } };
      }>("/player/applications", {
        method: "POST",
        body: JSON.stringify({
          opportunityId: opportunity.id,
          platform,
          primaryGames: [playerPersona],
          hardwareGpu: gpu.trim() || "Not specified",
          hardwareCpu: cpu.trim() || "Not specified",
          hardwareRam: ram.trim() || "Not specified",
          availabilityHours,
          experienceNotes: experienceNotes.trim() || undefined,
          agreedNda,
          agreedTelemetry,
        }),
      });

      if (!res.ok) {
        setSubmitError(res.error);
      } else {
        setSubmittedAppId(res.data.data.application.id);
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOpp) {
    return (
      <div className="w-full pb-20 px-6 max-w-[960px] mx-auto flex flex-col gap-8 animate-pulse">
        <div className="h-6 w-48 bg-[#13183d] rounded-lg border border-[#21274c]" />
        <div className="h-40 w-full bg-[#13183d] rounded-2xl border border-[#21274c]" />
      </div>
    );
  }

  if (oppError || !opportunity) {
    return (
      <div className="w-full pb-20 px-6 max-w-[960px] mx-auto flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#233dff]/15 text-[#5cb6f9] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h1 className="font-headline text-2xl font-bold text-white">Application Unavailable</h1>
        <p className="text-sm text-[#8f8fa3] max-w-md">
          {oppError || "The opportunity you are applying for cannot be found."}
        </p>
        <Link
          to="/games"
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#233dff] text-white text-xs font-headline font-bold hover:brightness-110 shadow-lg"
        >
          Return to Games
        </Link>
      </div>
    );
  }

  const applicationsCount = opportunity._count?.applications ?? 0;

  return (
    <div className="w-full pb-20 px-6 max-w-[960px] mx-auto flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
        <div className="flex items-center gap-2">
          <Link to="/games" className="text-[#92ccff] hover:underline">
            Games
          </Link>
          <span>/</span>
          <Link to={`/games/${opportunity.slug}`} className="text-[#92ccff] hover:underline">
            {opportunity.title}
          </Link>
          <span>/</span>
          <span className="text-[#dfe0ff]">Testing Application</span>
        </div>
        <div className="flex items-center gap-2 text-[#92ccff]">
          <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
          <span>
            Cohort Capacity: {applicationsCount} / {opportunity.capacity}
          </span>
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#233dff]/15 text-[#92ccff] text-xs font-headline font-semibold tracking-wider uppercase w-fit border border-[#233dff]/30">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          Verified Playtest Cohort
        </div>
        <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase">
          APPLY TO TEST: {opportunity.title}
        </h1>
        <p className="text-[#c5c5da] text-sm sm:text-base leading-relaxed">
          Provide your gaming background and hardware specs so {opportunity.studio} can assign you
          to the active playtest group.
        </p>
      </div>

      {submittedAppId ? (
        /* Submission Success State */
        <div className="p-8 sm:p-12 rounded-2xl bg-[#13183d] border border-[#92ccff]/40 shadow-2xl flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white">
            Application Submitted Successfully!
          </h2>
          <p className="text-sm text-[#c5c5da] max-w-md leading-relaxed">
            Your application for <strong className="text-white">{opportunity.title}</strong> has
            been received and recorded.
          </p>
          <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c] font-mono text-xs text-[#92ccff] text-left max-w-md w-full">
            <div>Application ID: #{submittedAppId.slice(0, 8).toUpperCase()}</div>
            <div>Cohort: {opportunity.title} ({opportunity.stage})</div>
            <div>Status: PENDING REVIEW</div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/player/dashboard"
              className="px-6 py-2.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white text-xs font-bold font-headline transition-colors shadow-lg"
            >
              Go to Player Workspace
            </Link>
            <Link
              to="/games"
              className="px-6 py-2.5 rounded-xl bg-[#21274c] hover:bg-[#2b3363] text-white text-xs font-bold font-headline transition-colors"
            >
              Browse Games
            </Link>
          </div>
        </div>
      ) : (
        /* Form Section */
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {submitError && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* SECTION 1: Gaming Persona & Platform */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                <span className="material-symbols-outlined text-[20px]">sports_esports</span>
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-white">
                  1. Gaming Persona & Platform
                </h2>
                <p className="text-xs text-[#8f8fa3]">
                  Select your primary platform and gaming experience tier.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-mono text-[#8f8fa3]">Primary Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["PC", "PlayStation 5", "Xbox Series", "Mobile"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      platform === p
                        ? "bg-[#233dff] text-white border-[#92ccff] shadow-md"
                        : "bg-[#050930] text-[#8f8fa3] border-[#21274c] hover:border-[#444557]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-mono text-[#8f8fa3]">Playstyle</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Casual Gamer", "Regular Player", "Competitive / Ranked", "Esports Professional"].map(
                  (tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setPlayerPersona(tier)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                        playerPersona === tier
                          ? "bg-[#233dff] text-white border-[#92ccff] shadow-md"
                          : "bg-[#050930] text-[#8f8fa3] border-[#21274c] hover:border-[#444557]"
                      }`}
                    >
                      {tier}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: Hardware Specifications */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                <span className="material-symbols-outlined text-[20px]">memory</span>
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-white">
                  2. Hardware Rig Specifications
                </h2>
                <p className="text-xs text-[#8f8fa3]">
                  Required for matchmaking to appropriate performance cohorts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">Graphics Card (GPU)</label>
                <input
                  type="text"
                  placeholder="e.g. RTX 4070 / RX 7800 XT"
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">Processor (CPU)</label>
                <input
                  type="text"
                  placeholder="e.g. Intel i7-13700K / Ryzen 7 7800X3D"
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">RAM</label>
                <input
                  type="text"
                  placeholder="e.g. 16GB / 32GB DDR5"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">Monitor Refresh Rate</label>
                <select
                  value={monitorHz}
                  onChange={(e) => setMonitorHz(e.target.value)}
                  className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                >
                  <option value="60Hz">60Hz</option>
                  <option value="120Hz">120Hz</option>
                  <option value="144Hz+">144Hz / 165Hz</option>
                  <option value="240Hz+">240Hz+</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-mono text-[#8f8fa3]">Weekly Availability</label>
                <select
                  value={availabilityHours}
                  onChange={(e) => setAvailabilityHours(e.target.value)}
                  className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
                >
                  <option value="5-10 Hours/Wk">5 – 10 Hours / Week</option>
                  <option value="10-15 Hours/Wk">10 – 15 Hours / Week</option>
                  <option value="15-20 Hours/Wk">15 – 20 Hours / Week</option>
                  <option value="20+ Hours">20+ Hours (Extensive)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs uppercase font-mono text-[#8f8fa3]">Experience Notes (Optional)</label>
              <textarea
                placeholder="Mention relevant past playtests, favorite competitive games, or bug hunting experience..."
                value={experienceNotes}
                onChange={(e) => setExperienceNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#050930] border border-[#21274c] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#92ccff]"
              />
            </div>
          </section>

          {/* SECTION 3: Legal & Testing Agreement */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#050A30] border border-[#21274c] shadow-lg flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#21274c] flex items-center justify-center text-[#92ccff]">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-white">
                  3. Legal & Testing Agreement
                </h2>
                <p className="text-xs text-[#8f8fa3]">
                  Confirmation required prior to playtest cohort enrollment.
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
                  I agree to the <strong className="text-white">Digital Non-Disclosure Agreement (NDA)</strong>.
                  I will not record, stream, or distribute unreleased game build executables without written authorization from {opportunity.studio}.
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
                  I authorize Riyadah Elite Telemetry Engine to capture crash logs, frame-timing histograms, and netcode latency metrics during active testing sessions.
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#21274c] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#8f8fa3]">
                Your application will be verified and queued for {opportunity.title}.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-shimmer w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 disabled:opacity-50 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </section>
        </form>
      )}
    </div>
  );
};

export default GameTestingApplicationPage;
