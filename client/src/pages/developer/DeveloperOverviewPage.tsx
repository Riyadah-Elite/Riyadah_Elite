import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, DeveloperOverviewResponse } from "../../lib/api";

export const DeveloperOverviewPage: React.FC = () => {
  const [data, setData] = useState<DeveloperOverviewResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<DeveloperOverviewResponse>("/developer/overview");
        if (mounted) {
          if (res.ok) {
            setData(res.data.data);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          // Record truthful error or unavailable state
          setError(err.message || "Failed to load developer overview data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* SECTION 1: VERIFICATION & STUDIO STATUS BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070D38] to-[#0A1348] border border-[#182352] p-6 lg:p-8 shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#233DFF]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30 shadow-[0_0_24px_rgba(92,182,249,0.2)] text-2xl">
              🛡️
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-headline text-xl lg:text-2xl font-bold text-white">
                  Developer Verification: {data ? `${data.studioName} (${data.tier})` : "Studio Verification Node"}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E1B56] border border-[#233DFF]/30 px-3 py-1 text-xs font-mono text-[#5CB6F9]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  {data?.verificationStatus || "TIER-1 REGISTERED"}
                </span>
              </div>
              <p className="text-xs text-[#8796C0] max-w-2xl">
                Commercial Entity &amp; Sandbox QA Environment Approved · Riyadh Tech Ecosystem Node #SA-DEV-402
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#091038] border border-[#182352] px-4 py-2.5 rounded-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7F8FB8] block">
                Escrow Allocated
              </span>
              <span className="text-lg font-headline font-bold text-[#5CB6F9]">
                {data ? data.escrowBalance : "0.00 SAR"}
              </span>
            </div>
            <Link
              to="/developer/verification"
              className="inline-flex items-center gap-2 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] px-4 py-2.5 text-xs font-headline font-bold text-white transition shadow-lg"
            >
              <span>Verification Details</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ERROR / UNAVAILABLE NOTIFICATION (Truthful state) */}
      {error && (
        <div className="rounded-xl bg-[#1F122B] border border-amber-500/30 p-4 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base">⚠️</span>
            <div>
              <strong className="block font-semibold">Backend Telemetry Notice (Phase 3B):</strong>
              <span>
                {error}. Showing current verified workspace interface and local session telemetry.
              </span>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 rounded bg-[#2D1B40] hover:bg-[#3D2556] text-amber-300 font-mono text-[11px] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 2: 6 TELEMETRY METRIC CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Games",
            val: data?.metrics?.totalGames ?? 0,
            sub: "Registered Titles",
            icon: "🎮",
            trend: "+0 this month",
          },
          {
            label: "Active Campaigns",
            val: data?.metrics?.activeCampaigns ?? 0,
            sub: "Testing Sprints",
            icon: "🚀",
            trend: "Ready to launch",
          },
          {
            label: "Testers Engaged",
            val: data?.metrics?.activeTesters ?? 0,
            sub: "Verified Players",
            icon: "👥",
            trend: "Escrow Protected",
          },
          {
            label: "Pending Reports",
            val: data?.metrics?.pendingReports ?? 0,
            sub: "Feedback Queue",
            icon: "📝",
            trend: "0 Critical",
          },
          {
            label: "Quality Rating",
            val: data?.metrics?.avgRating ? `${data.metrics.avgRating}/5.0` : "N/A",
            sub: "Player Satisfaction",
            icon: "⭐",
            trend: "Verified QA",
          },
          {
            label: "Earned (SAR)",
            val: data?.metrics?.totalEarningsSAR ? `${data.metrics.totalEarningsSAR.toLocaleString()} SAR` : "0.00 SAR",
            sub: "Legitimate Balance",
            icon: "💳",
            trend: "Direct Settlement",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-xl bg-[#070D38] border border-[#151F52] p-4 flex flex-col justify-between hover:border-[#233DFF]/50 transition shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-[#7F8FB8]">
              <span className="font-mono uppercase text-[10px]">{m.label}</span>
              <span className="text-base">{m.icon}</span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-headline font-bold text-white tracking-tight">
                {loading ? "..." : m.val}
              </span>
              <span className="text-[11px] text-[#8796C0] block mt-0.5">{m.sub}</span>
            </div>
            <div className="text-[10px] font-mono text-[#5CB6F9] pt-2 border-t border-[#151F52]/60">
              {m.trend}
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 3: RECENT CAMPAIGNS & SUBMISSIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Games & Pipeline */}
        <section className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#151F52]">
            <h2 className="text-base font-headline font-bold text-white flex items-center gap-2">
              <span>🎮</span>
              <span>Game Fleet &amp; Builds</span>
            </h2>
            <Link
              to="/developer/games"
              className="text-xs text-[#5CB6F9] hover:text-[#CAE8FF] transition font-headline"
            >
              View All ({data?.games?.length ?? 0}) →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#8796C0]">Loading game submissions...</div>
          ) : !data?.games || data.games.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-xl text-[#5CB6F9]">
                🎮
              </div>
              <div className="text-xs text-[#8796C0]">
                No game submissions registered yet. Submit your title to begin certified player testing.
              </div>
              <Link
                to="/developer/games/new"
                className="inline-block px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-bold font-headline"
              >
                + Submit First Game
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {data.games.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-xl bg-[#091038] border border-[#182352] flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-headline font-bold text-white">{g.title}</h3>
                    <span className="text-[11px] text-[#8796C0] font-mono">
                      {g.genre} · {g.platform} · {g.stage}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30">
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live Testing Campaigns */}
        <section className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#151F52]">
            <h2 className="text-base font-headline font-bold text-white flex items-center gap-2">
              <span>🚀</span>
              <span>Testing Campaigns</span>
            </h2>
            <Link
              to="/developer/campaigns"
              className="text-xs text-[#5CB6F9] hover:text-[#CAE8FF] transition font-headline"
            >
              All Campaigns →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#8796C0]">Loading active campaigns...</div>
          ) : !data?.recentCampaigns || data.recentCampaigns.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-xl text-[#5CB6F9]">
                🚀
              </div>
              <div className="text-xs text-[#8796C0]">
                No testing campaigns active currently. Launch a testing cycle once your game build is approved.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentCampaigns.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#091038] border border-[#182352] flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xs font-headline font-bold text-white">{c.title}</h3>
                    <span className="text-[11px] text-[#8796C0] font-mono">
                      {c.gameTitle} · {c.enrolledTesters}/{c.targetTesters} Testers
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
