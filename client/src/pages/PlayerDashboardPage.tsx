import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, PlayerOverviewResponse } from "../lib/api";

export const PlayerDashboardPage: React.FC = () => {
  const [data, setData] = useState<PlayerOverviewResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<PlayerOverviewResponse>("/player/overview");
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setData(result.data.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const activeApp = data?.applications.find((a) => a.status === "ACCEPTED");

  return (
    <div className="p-6 md:p-10 max-w-[1380px] mx-auto w-full space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091038] p-6 rounded-2xl border border-[#182352]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#5CB6F9]">
              PLAYER COMMAND CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight">
            {data ? `WELCOME BACK, ${data.user.fullName.toUpperCase()}` : "WELCOME BACK"}
          </h1>
          <p className="text-xs text-[#8796C0] mt-1 font-body">
            Track your real game testing telemetry pipelines, application reviews, and competitive status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/player/game-testing"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:from-blue-600 hover:to-[#5CB6F9] text-white font-headline text-xs font-bold tracking-wider uppercase transition shadow-[0_0_20px_rgba(35,61,255,0.4)]"
          >
            Explore Tests →
          </Link>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between gap-4 text-xs text-red-200">
          <div>
            <p className="font-bold text-red-300">Unable to load live dashboard</p>
            <p className="mt-0.5 text-red-300/80">{error}</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-mono text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#091038] border border-[#182352]"></div>
          ))}
        </div>
      )}

      {/* SECTION 1: REAL METRICS */}
      {data && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-[#8796C0] uppercase tracking-wider block mb-2">
              ACTIVE TESTS
            </span>
            <div className="text-3xl font-extrabold text-white font-headline">
              {data.metrics.activeTests}
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
              {data.metrics.activeTests > 0 ? "Currently provisioned" : "No active builds"}
            </span>
          </div>

          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-[#8796C0] uppercase tracking-wider block mb-2">
              APPLICATIONS
            </span>
            <div className="text-3xl font-extrabold text-white font-headline">
              {data.metrics.pendingApplications}
            </div>
            <span className="text-[11px] font-mono text-amber-300 mt-2 block">
              In review queue
            </span>
          </div>

          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-[#8796C0] uppercase tracking-wider block mb-2">
              COMPLETED TESTS
            </span>
            <div className="text-3xl font-extrabold text-white font-headline">
              {data.metrics.completedTests}
            </div>
            <span className="text-[11px] font-mono text-[#5CB6F9] mt-2 block">
              Verified test logs
            </span>
          </div>

          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-[#8796C0] uppercase tracking-wider block mb-2">
              MY TOURNAMENTS
            </span>
            <div className="text-3xl font-extrabold text-[#5CB6F9] font-headline">
              {data.metrics.registeredTournaments ?? (data.tournamentRegistrations?.length || 0)}
            </div>
            <span className="text-[11px] font-mono text-[#CAE8FF] mt-2 block">
              {(data.metrics.upcomingTournaments ?? 0) > 0
                ? `${data.metrics.upcomingTournaments} upcoming cup(s)`
                : "Active registrations"}
            </span>
          </div>

          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden">
            <span className="text-xs font-mono font-bold text-[#8796C0] uppercase tracking-wider block mb-2">
              TESTER SCORE
            </span>
            <div className="text-3xl font-extrabold text-white font-headline">
              {data.metrics.testerScore}
              <span className="text-sm text-[#8796C0] font-normal"> / 100</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
              Verified QA Rating
            </span>
          </div>
        </section>
      )}

      {/* SECTION 2: ACTIVE PROTOCOL BANNER & QUICK OVERVIEW */}
      {data && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#091038] border border-[#182352] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-[#5CB6F9]">
                  CURRENT ACTIVE PROTOCOL
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#233DFF]/20 text-[#5CB6F9] border border-[#233DFF]/40">
                  {activeApp ? "ONLINE" : "STANDBY"}
                </span>
              </div>

              {activeApp && activeApp.opportunity ? (
                <div className="p-4 rounded-xl bg-[#050A30] border border-[#151F52] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white font-headline">
                        {activeApp.opportunity.title}
                      </h3>
                      <p className="text-xs text-[#8796C0]">
                        {activeApp.opportunity.studio} • {activeApp.opportunity.stage} ({activeApp.opportunity.version || "Current"})
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Platform: <span className="text-[#5CB6F9]">{activeApp.platform}</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-[#050A30] border border-[#151F52] text-center space-y-2">
                  <p className="text-sm font-semibold text-white">No Active Playtests Assigned</p>
                  <p className="text-xs text-[#8796C0] max-w-sm mx-auto">
                    Apply to open game testing cohorts in the catalog to get assigned verified telemetry credentials.
                  </p>
                  <Link
                    to="/games"
                    className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase"
                  >
                    Browse Open Tests
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#091038] border border-[#182352] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase text-[#5CB6F9]">
                  PLAYER IDENTITY TELEMETRY
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  @{data.user.username}
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#050A30] border border-[#151F52] flex justify-between items-center">
                  <span className="text-[#8796C0]">Full Name:</span>
                  <span className="text-white font-bold">{data.user.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050A30] border border-[#151F52] flex justify-between items-center">
                  <span className="text-[#8796C0]">Email:</span>
                  <span className="text-white font-bold">{data.user.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#050A30] border border-[#151F52] flex justify-between items-center">
                  <span className="text-[#8796C0]">Primary Rig:</span>
                  <span className="text-[#5CB6F9] font-bold">
                    {data.profile?.hardwareGpu || "Not specified in settings"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#182352] flex justify-end">
              <Link
                to="/player/profile"
                className="text-xs text-[#5CB6F9] hover:text-white transition font-mono"
              >
                Edit Profile Rig &amp; Hardware →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: RECENT APPLICATION SUBMISSIONS */}
      {data && (
        <section className="bg-[#091038] border border-[#182352] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#182352]">
            <div>
              <h2 className="text-base font-bold text-white font-headline">
                Submitted Playtest Applications
              </h2>
              <p className="text-xs text-[#8796C0]">
                Live review states for your submitted developer invitations.
              </p>
            </div>
            <span className="text-xs font-mono text-[#5CB6F9]">
              {data.applications.length} Total Applications
            </span>
          </div>

          {data.applications.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-semibold text-white">No Applications Submitted Yet</p>
              <p className="text-xs text-[#8796C0]">
                Browse the game testing catalog to submit hardware benchmarks and join testing cohorts.
              </p>
              <Link
                to="/games"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase"
              >
                Browse Game Testing Catalog
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="text-[#7C8CB8] border-b border-[#182352] font-mono text-[11px] uppercase">
                    <th className="py-3 px-4 font-semibold">Game Title</th>
                    <th className="py-3 px-3 font-semibold">Platform</th>
                    <th className="py-3 px-3 font-semibold">Date Submitted</th>
                    <th className="py-3 px-3 font-semibold">Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182352]/60 text-slate-300">
                  {data.applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#050A30] transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {app.opportunity?.title || "Testing Opportunity"}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#8796C0]">
                        {app.platform}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#8796C0]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                            app.status === "ACCEPTED"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : app.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              app.status === "ACCEPTED"
                                ? "bg-emerald-400"
                                : app.status === "PENDING"
                                ? "bg-amber-400"
                                : "bg-slate-400"
                            }`}
                          ></span>
                          {app.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* SECTION 4: MY REGISTERED TOURNAMENTS */}
      {data && (
        <section className="bg-[#091038] border border-[#182352] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#182352]">
            <div>
              <h2 className="text-base font-bold text-white font-headline">
                Registered Esports Tournaments
              </h2>
              <p className="text-xs text-[#8796C0]">
                Active confirmations and brackets for official platform tournaments.
              </p>
            </div>
            <Link
              to="/player/tournaments"
              className="text-xs font-mono text-[#5CB6F9] hover:underline"
            >
              View All Tournaments →
            </Link>
          </div>

          {!data.tournamentRegistrations || data.tournamentRegistrations.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-semibold text-white">No Tournament Registrations</p>
              <p className="text-xs text-[#8796C0]">
                You have not registered for any competitive esports tournaments yet.
              </p>
              <Link
                to="/tournaments"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase"
              >
                Browse Open Tournaments
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="text-[#7C8CB8] border-b border-[#182352] font-mono text-[11px] uppercase">
                    <th className="py-3 px-4 font-semibold">Tournament Title</th>
                    <th className="py-3 px-3 font-semibold">Game</th>
                    <th className="py-3 px-3 font-semibold">In-Game Handle</th>
                    <th className="py-3 px-3 font-semibold">Status</th>
                    <th className="py-3 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182352]/60 text-slate-300">
                  {data.tournamentRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#050A30] transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {reg.tournament?.title || "Tournament"}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#5CB6F9]">
                        {reg.tournament?.game || "Competitive"}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#8796C0]">
                        {reg.inGameHandle}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold ${
                            reg.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              reg.status === "CONFIRMED" ? "bg-emerald-400" : "bg-blue-400"
                            }`}
                          ></span>
                          {reg.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <Link
                          to={reg.tournament?.slug ? `/tournaments/${reg.tournament.slug}` : `/player/tournaments`}
                          className="text-[#5CB6F9] hover:underline font-mono text-xs font-semibold"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
