import React, { useEffect, useState } from "react";
import { apiRequest, AdminFounderOverviewData } from "../../lib/api";

export const AdminFounderCommandPage: React.FC = () => {
  const [data, setData] = useState<AdminFounderOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezeActionLoading, setFreezeActionLoading] = useState(false);
  const [freezeFeedback, setFreezeFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadFounderOverview() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B admin overview contract
      const res = await apiRequest<AdminFounderOverviewData>("/admin/founder/overview");

      if (res.ok) {
        setData(res.data);
      } else {
        // Truthful backend unavailable state
        setError(res.error || "Founder Executive API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadFounderOverview();
  }, []);

  const handleTriggerFreeze = async () => {
    setFreezeActionLoading(true);
    // Real API call attempt to execute emergency lockdown
    const res = await apiRequest<{ status: string; message: string }>("/admin/founder/lockdown", {
      method: "POST",
    });

    if (res.ok) {
      setFreezeFeedback("Emergency lockdown protocol transmitted successfully.");
    } else {
      setFreezeFeedback(`Execution blocked: ${res.error}`);
    }
    setFreezeActionLoading(false);
    setIsFreezeModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* 1. Executive Top Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#233DFF]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              ROOT COMMAND AUTHORIZATION LEVEL 5 • FOUNDER EXECUTIVE
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Founder Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Platform-wide operations, cryptographic authority keys, real-time escrow security vectors, and zero-gambling ecosystem governance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsFreezeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>Emergency Freeze</span>
            </button>
            <button
              onClick={() => alert("Audit export requires active Phase 5B reporting engine.")}
              className="px-4 py-2.5 rounded-xl bg-[#13183D] hover:bg-[#1A2255] border border-[#21274C] text-[#CAE8FF] font-headline text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <span>📄</span>
              <span>Export Compliance Audit</span>
            </button>
          </div>
        </div>

        {freezeFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-[#13183D] border border-amber-500/40 text-xs font-mono text-amber-300 flex items-center justify-between">
            <span>{freezeFeedback}</span>
            <button onClick={() => setFreezeFeedback(null)} className="text-[#8796C0] hover:text-white">✕</button>
          </div>
        )}
      </section>

      {/* 2. State Indicators (Loading / Error / Data) */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Connecting to Level 5 Security Enclave...
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>⚠️</span>
              <span>Backend Contract Pending (Phase 5B)</span>
            </div>
            <p className="text-xs text-[#8796C0]">
              {error} — All UI sections and controls below reflect the verified Level 5 Founder design schema.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Enclave Sync
          </button>
        </div>
      )}

      {/* 3. 12-Bento Ecosystem Metrics Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg font-bold text-white tracking-wide">
            Ecosystem Health &amp; Escrow Telemetry
          </h2>
          <span className="text-[11px] font-mono text-[#5CB6F9]">NODE: RUH-ROOT-01</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Registered Gamers", val: data?.systemMetrics?.totalRegisteredUsers ?? "—", icon: "👥" },
            { label: "Active Playtests", val: data?.systemMetrics?.activePlaytestSessions ?? "—", icon: "🎮" },
            { label: "Live Tournaments", val: data?.systemMetrics?.liveTournamentsCount ?? "—", icon: "🏆" },
            { label: "Escrow Secured", val: data ? `${data.systemMetrics.escrowSecuredSAR.toLocaleString()} SAR` : "—", icon: "🛡️" },
            { label: "Open T&S Reports", val: data?.systemMetrics?.openReportsQueue ?? "—", icon: "🚩" },
            { label: "Health Index", val: data ? `${data.systemMetrics.systemHealthScore}%` : "—", icon: "⚡" },
          ].map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#090F3B] border border-[#192359] flex flex-col justify-between gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-[#8796C0]">
                <span className="text-[10px] font-mono uppercase tracking-wider">{m.label}</span>
                <span className="text-sm">{m.icon}</span>
              </div>
              <span className="font-headline text-lg font-bold text-white tracking-tight">{m.val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Critical Escrow Locks & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Escrow Locks */}
        <div className="p-6 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#151F52] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <h3 className="font-headline text-sm font-bold text-white tracking-wide uppercase">
                Critical Escrow Locks &amp; Freezes
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8796C0]">
              {data?.criticalEscrowLocks.length ?? 0} Active
            </span>
          </div>

          {!data || data.criticalEscrowLocks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8796C0] font-mono">
              No active escrow locks detected or pending review.
            </div>
          ) : (
            <div className="space-y-3">
              {data.criticalEscrowLocks.map((lock) => (
                <div key={lock.id} className="p-3.5 rounded-xl bg-[#13183D] border border-red-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{lock.title}</span>
                    <span className="text-xs font-mono font-bold text-red-400">{lock.amountSAR} SAR</span>
                  </div>
                  <p className="text-xs text-[#8796C0]">{lock.reason}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#21274C] text-[10px] font-mono text-[#5CB6F9]">
                    <span>REF: {lock.refCode}</span>
                    <span>{new Date(lock.flaggedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Founder Authorizations */}
        <div className="p-6 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#151F52] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h3 className="font-headline text-sm font-bold text-white tracking-wide uppercase">
                Pending Founder Authorizations
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8796C0]">
              {data?.pendingFounderAuthorizations.length ?? 0} Pending
            </span>
          </div>

          {!data || data.pendingFounderAuthorizations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8796C0] font-mono">
              No high-risk operations currently awaiting Level 5 signature.
            </div>
          ) : (
            <div className="space-y-3">
              {data.pendingFounderAuthorizations.map((auth) => (
                <div key={auth.id} className="p-3.5 rounded-xl bg-[#13183D] border border-amber-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{auth.category}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                      {auth.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-[#8796C0]">{auth.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#21274C] text-[10px] font-mono text-[#8796C0]">
                    <span>Req by: {auth.requestedBy}</span>
                    <button
                      onClick={() => alert("Multi-sig approval requires Phase 5B auth service.")}
                      className="px-2 py-1 rounded bg-[#233DFF] text-white hover:bg-blue-600 transition-colors"
                    >
                      Authorize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Emergency Freeze Confirmation Modal */}
      {isFreezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#0B1347] border border-red-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-headline text-lg font-bold">Initiate Platform Freeze?</h3>
            </div>
            <p className="text-xs text-[#8796C0] leading-relaxed">
              This will broadcast a Level 5 emergency signal across all nodes. Match matchmaking, automated escrow disbursements, and wallet withdraw requests will be temporarily halted until manually cleared.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsFreezeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8796C0] hover:text-white"
              >
                Cancel
              </button>
              <button
                disabled={freezeActionLoading}
                onClick={handleTriggerFreeze}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-headline shadow-lg disabled:opacity-50"
              >
                {freezeActionLoading ? "Broadcasting..." : "Confirm Emergency Freeze"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
