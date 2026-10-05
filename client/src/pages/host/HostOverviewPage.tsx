import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, HostOverviewResponse, TournamentItem } from "../../lib/api";

export const HostOverviewPage: React.FC = () => {
  const [data, setData] = useState<HostOverviewResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<HostOverviewResponse>("/host/overview");
        if (mounted) {
          if (res.ok) {
            setData(res.data.data);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load host overview data");
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
      {/* SECTION 1: HEADER & STATUS BADGES */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070D38] to-[#0A1348] border border-[#182352] p-6 lg:p-8 shadow-xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#233DFF]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30 shadow-[0_0_24px_rgba(92,182,249,0.2)] text-2xl">
              🏆
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-headline text-xl lg:text-2xl font-bold text-white">
                  Tournament Host Overview: {data ? `${data.organizationName} (${data.tier})` : "Organizer Operations"}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E1B56] border border-[#233DFF]/30 px-3 py-1 text-xs font-mono text-[#5CB6F9]">
                  <span className={`h-2 w-2 rounded-full ${data?.verificationStatus === "VERIFIED" ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
                  {data?.verificationStatus ? (data.verificationStatus === "VERIFIED" ? "VERIFIED HOST" : "PENDING HOST") : "HOST PORTAL"}
                </span>
              </div>
              <p className="text-xs text-[#8796C0] max-w-2xl">
                Manage competitive operations, telemetry brackets, participant check-ins, and verified tournament prize pools.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/tournaments"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0E1B56] hover:bg-[#13226E] border border-[#233DFF]/40 px-4 py-2.5 text-xs font-headline font-bold text-[#CAE8FF] transition shadow"
            >
              <span>Public Catalog</span>
              <span className="text-sm">↗</span>
            </Link>
            <Link
              to="/host/tournaments/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] px-4 py-2.5 text-xs font-headline font-bold text-white transition shadow-lg"
            >
              <span>+ Create Tournament</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Backend / Unavailable Alert Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              <strong>Host Operations Notice:</strong> {error}
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 rounded bg-[#2D1B40] text-amber-300 font-mono text-xs hover:bg-[#3D2555]"
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 2: 6 KEY SUMMARY METRIC CARDS */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            label: "Total Tournaments",
            value: data ? data.metrics.totalTournaments : "0",
            icon: "🏆",
            sub: "Lifecycle Events",
          },
          {
            label: "Active Events",
            value: data ? data.metrics.activeTournaments : "0",
            icon: "⚡",
            sub: "Live In Progress",
          },
          {
            label: "Registered Players",
            value: data ? data.metrics.totalParticipants : "0",
            icon: "👥",
            sub: "Verified Rosters",
          },
          {
            label: "Completed",
            value: data ? data.metrics.completedTournaments : "0",
            icon: "✅",
            sub: "Audited Brackets",
          },
          {
            label: "Pending Check-Ins",
            value: data ? data.metrics.pendingCheckIns : "0",
            icon: "⏱️",
            sub: "Lobby Confirmations",
          },
          {
            label: "Escrow Disbursed",
            value: data ? `${data.metrics.escrowDisbursedSAR.toLocaleString()} SAR` : "0.00 SAR",
            icon: "💳",
            sub: "Prize Settlements",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#070D38] border border-[#151F52] p-4 flex flex-col justify-between hover:border-[#233DFF]/40 transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#7F8FB8] uppercase tracking-wider">{card.label}</span>
              <span className="text-base">{card.icon}</span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-headline font-bold text-white group-hover:text-[#5CB6F9] transition">
                {loading ? "..." : card.value}
              </div>
              <div className="text-[10px] text-[#8796C0] mt-0.5">{card.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 3: RECENT & UPCOMING TOURNAMENTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#151F52] pb-3">
          <div>
            <h2 className="text-base font-headline font-bold text-white tracking-wide">
              Active &amp; Recent Competitions
            </h2>
            <p className="text-xs text-[#8796C0]">Direct link to telemetry controls and bracket progress</p>
          </div>
          <Link
            to="/host/tournaments"
            className="text-xs font-mono text-[#5CB6F9] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-[#8796C0] bg-[#070D38] rounded-2xl border border-[#151F52]">
            Loading tournament telemetry...
          </div>
        ) : !data || data.recentTournaments.length === 0 ? (
          <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-3xl text-[#5CB6F9]">
              🎮
            </div>
            <h3 className="text-base font-headline font-bold text-white">No Tournaments Hosted Yet</h3>
            <p className="text-xs text-[#8796C0] max-w-md mx-auto leading-relaxed">
              Create your first esports competition. Set up brackets, verify team rosters, and disburse official Riyadah Elite prize pools.
            </p>
            <Link
              to="/host/tournaments/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg"
            >
              <span>+ Create First Tournament</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentTournaments.map((t: TournamentItem) => (
              <div
                key={t.id}
                className="rounded-2xl bg-[#070D38] border border-[#151F52] p-5 space-y-4 hover:border-[#233DFF]/40 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30 uppercase">
                      {t.game}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        t.status === "ONGOING"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                          : t.status === "REGISTRATION_OPEN"
                          ? "bg-blue-950/60 text-blue-300 border border-blue-500/40"
                          : "bg-[#0E1B56] text-[#8796C0]"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h3 className="text-base font-headline font-bold text-white leading-snug">{t.title}</h3>
                  <p className="text-xs text-[#8796C0] line-clamp-2 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-[#151F52]/60 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#7F8FB8]">Format: {t.format}</span>
                    <span className="text-white font-bold">{t.prizePool || "Medals & Points"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/host/tournaments/${t.id}/manage`}
                      className="flex-1 py-2 rounded-xl bg-[#0E1B56] hover:bg-[#13226E] text-center text-xs font-headline font-bold text-[#5CB6F9] transition"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/host/tournaments/${t.id}/results`}
                      className="flex-1 py-2 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-center text-xs font-headline font-bold text-white transition shadow"
                    >
                      Brackets &amp; Results
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
