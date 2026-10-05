import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, GameOpportunityItem } from "../lib/api";

export const GameTestingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<GameOpportunityItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchOpportunity() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const result = await apiRequest<{
          status: string;
          data: { opportunity: GameOpportunityItem };
        }>(`/player/opportunities/${id}`);

        if (isMounted) {
          if (!result.ok) {
            setError(result.error);
          } else {
            setOpportunity(result.data.data.opportunity);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load game details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchOpportunity();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="w-full pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-8 animate-pulse">
        <div className="h-6 w-48 bg-[#13183d] rounded-lg border border-[#21274c]" />
        <div className="h-96 w-full bg-[#13183d] rounded-2xl border border-[#21274c]" />
        <div className="h-48 w-full bg-[#13183d] rounded-2xl border border-[#21274c]" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="w-full pb-20 px-6 max-w-[1380px] mx-auto flex flex-col items-center justify-center min-h-[450px] text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#233dff]/15 text-[#5cb6f9] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">sports_esports</span>
        </div>
        <h1 className="font-headline text-2xl font-bold text-white">Testing Opportunity Not Found</h1>
        <p className="text-sm text-[#8f8fa3] max-w-md">
          {error || "The requested game opportunity does not exist or has been concluded."}
        </p>
        <Link
          to="/games"
          className="mt-2 px-6 py-2.5 rounded-xl bg-[#233dff] text-white text-xs font-headline font-bold hover:brightness-110 transition-all shadow-lg"
        >
          Return to Games Catalog
        </Link>
      </div>
    );
  }

  const applicationsCount = opportunity._count?.applications ?? 0;
  const remainingSlots = Math.max(0, opportunity.capacity - applicationsCount);

  return (
    <div className="w-full pb-20 px-6 max-w-[1380px] mx-auto flex flex-col gap-10">
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
          <span className="text-[#dfe0ff]">{opportunity.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
            <span className="w-2 h-2 rounded-full bg-[#92ccff] animate-pulse"></span>
            Telemetry Node // {opportunity.stage}
          </span>
          <span className="hidden sm:inline text-[#8f8fa3]">Status: {opportunity.status}</span>
        </div>
      </div>

      {/* HERO GAME BANNER */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#13183d] border border-[#21274c] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
          {/* Visual Screen */}
          <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
            {opportunity.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.75] contrast-[1.1]"
                style={{ backgroundImage: `url('${opportunity.imageUrl}')` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#050a30] to-[#13183d] -z-10" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/50 to-transparent -z-10" />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg">
                {opportunity.stage}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#cce5ff] text-xs font-semibold">
                {opportunity.platform}
              </span>
              {opportunity.version && (
                <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#92ccff] text-xs font-semibold">
                  v{opportunity.version}
                </span>
              )}
            </div>

            {/* Bottom Quick Spec Card */}
            <div className="bg-[#050930]/90 backdrop-blur-xl p-4 rounded-xl border border-[#21274c] max-w-md shadow-xl mt-auto">
              <div className="text-xs uppercase font-headline tracking-wider text-[#92ccff] font-semibold mb-2">
                Session Window
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8f8fa3] block text-[11px]">Testing Window:</span>
                  <span className="text-white font-semibold">
                    {opportunity.startDate ? new Date(opportunity.startDate).toLocaleDateString() : "Immediate"} –{" "}
                    {opportunity.endDate ? new Date(opportunity.endDate).toLocaleDateString() : "Open"}
                  </span>
                </div>
                <div>
                  <span className="text-[#8f8fa3] block text-[11px]">Target Platform:</span>
                  <span className="text-white font-semibold">{opportunity.platform}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Summary & Apply Box */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#13183d]/95 backdrop-blur-2xl">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-headline font-bold text-[#92ccff] uppercase tracking-wider mb-1">
                  <span>{opportunity.studio}</span>
                  <span>•</span>
                  <span className="text-[#8f8fa3]">Verified Studio</span>
                </div>
                <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {opportunity.title}
                </h1>
                <div className="text-xs font-mono text-[#8f8fa3] mt-1">
                  Playtest Cohort // {opportunity.genre}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#21274c] text-xs text-[#dfe0ff] font-medium">
                  {opportunity.genre}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#21274c] text-xs text-[#dfe0ff] font-medium">
                  {opportunity.platform}
                </span>
              </div>

              {/* Bounty & Roster Callout */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#050930] border border-[#21274c]">
                <div>
                  <span className="text-[11px] font-mono text-[#8f8fa3] uppercase">
                    Bounty Pool
                  </span>
                  <div className="font-headline text-xl font-bold text-[#cce5ff] mt-0.5">
                    {opportunity.rewardText || "Community Testing"}
                  </div>
                  <span className="text-[10px] text-[#92ccff]">Verified Reward</span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-[#8f8fa3] uppercase">
                    Cohort Capacity
                  </span>
                  <div className="font-headline text-xl font-bold text-white mt-0.5">
                    {applicationsCount} / {opportunity.capacity}
                  </div>
                  <span className="text-[10px] text-[#92ccff]">
                    {remainingSlots} Slots Open
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#c5c5da] leading-relaxed">
                {opportunity.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#21274c] flex flex-col gap-3">
              {opportunity.status === "ACTIVE" ? (
                <Link
                  to={`/games/${opportunity.slug}/apply`}
                  className="btn-shimmer w-full text-center py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply for Testing Slot</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full text-center py-3.5 rounded-xl bg-[#21274c] text-[#8f8fa3] font-headline text-sm font-bold cursor-not-allowed"
                >
                  Cohort Closed
                </button>
              )}
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
          {opportunity.description}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#21274c]/60">
          <div>
            <span className="text-xs text-[#8f8fa3] block">Stage</span>
            <span className="text-sm text-white font-semibold">{opportunity.stage}</span>
          </div>
          <div>
            <span className="text-xs text-[#8f8fa3] block">Platform</span>
            <span className="text-sm text-white font-semibold">{opportunity.platform}</span>
          </div>
          <div>
            <span className="text-xs text-[#8f8fa3] block">Studio</span>
            <span className="text-sm text-white font-semibold">{opportunity.studio}</span>
          </div>
          <div>
            <span className="text-xs text-[#8f8fa3] block">NDA Requirement</span>
            <span className="text-sm text-white font-semibold">Standard Playtest NDA</span>
          </div>
        </div>
      </section>

      {/* SECTION B: FOCUS TRACKS & REQUIREMENTS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5cb6f9]" />
            <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-tight">
              Testing Objectives & Requirements
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
              <div className="text-sm font-semibold text-white">Focus Areas</div>
              <div className="text-xs text-[#c5c5da] mt-1 space-y-1">
                {opportunity.focusAreas && opportunity.focusAreas.length > 0 ? (
                  opportunity.focusAreas.map((fa, idx) => (
                    <div key={idx}>• {fa}</div>
                  ))
                ) : (
                  <div>General gameplay stability, mechanics balance, and server stress testing.</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#21274c]/40 border border-[#21274c]">
            <div className="w-6 h-6 rounded-full bg-[#233dff]/20 text-[#92ccff] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Requirements</div>
              <div className="text-xs text-[#c5c5da] mt-1 space-y-1">
                {opportunity.requirements && opportunity.requirements.length > 0 ? (
                  opportunity.requirements.map((req, idx) => (
                    <div key={idx}>• {req}</div>
                  ))
                ) : (
                  <div>Stable broadband connection, meeting recommended platform requirements.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: 5-STEP TESTING WORKFLOW */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#050A30] border border-[#21274c] shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#92ccff]" />
          <h2 className="font-headline text-2xl font-bold text-white">Testing Workflow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 01</span>
            <h3 className="font-headline text-sm font-bold text-white">Submit Rig Application</h3>
            <p className="text-xs text-[#8f8fa3]">
              Verify your hardware rig and ranked gaming experience.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 02</span>
            <h3 className="font-headline text-sm font-bold text-white">Digital NDA & Agreement</h3>
            <p className="text-xs text-[#8f8fa3]">
              Accept confidentiality and telemetry disclosure.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 03</span>
            <h3 className="font-headline text-sm font-bold text-white">Execute Test Sessions</h3>
            <p className="text-xs text-[#8f8fa3]">
              Participate in scheduled match sessions and log performance.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#13183d] border border-[#21274c] flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#92ccff]">STEP 04</span>
            <h3 className="font-headline text-sm font-bold text-white">Receive Bounties & REP</h3>
            <p className="text-xs text-[#8f8fa3]">
              Verified bug reports and feedback earn tester reputation and rewards.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#8f8fa3]">
            Cohort spots: {applicationsCount} of {opportunity.capacity} registered.
          </div>
          {opportunity.status === "ACTIVE" && (
            <Link
              to={`/games/${opportunity.slug}/apply`}
              className="btn-shimmer px-6 py-3 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-lg"
            >
              Start Application
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default GameTestingDetailsPage;
