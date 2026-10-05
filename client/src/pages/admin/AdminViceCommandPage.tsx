import React, { useEffect, useState } from "react";
import { apiRequest, AdminViceOverviewData } from "../../lib/api";

export const AdminViceCommandPage: React.FC = () => {
  const [data, setData] = useState<AdminViceOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadViceOverview() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B vice-command overview contract
      const res = await apiRequest<AdminViceOverviewData>("/admin/vice/overview");

      if (res.ok) {
        setData(res.data);
      } else {
        setError(res.error || "Vice Admin Operations API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadViceOverview();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              OPERATIONAL AUTHORITY LEVEL 4 • CO-FOUNDER CONSOLE
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Operations Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Cross-department operational workflows, daily dispute triage, escalation queues, and telemetry audit trail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Delegated review queue requires Phase 5B dispatching service.")}
              className="px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(35,61,255,0.45)] flex items-center gap-2"
            >
              <span>🛡️</span>
              <span>Review Escalations ({data?.urgentAttentionItems.length ?? 0})</span>
            </button>
            <button
              onClick={() => alert("Report generation pending Phase 5B analytics engine.")}
              className="px-4 py-2.5 rounded-xl bg-[#13183D] hover:bg-[#1A2255] border border-[#21274C] text-[#CAE8FF] font-headline text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <span>📋</span>
              <span>Export Daily Ops Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. States */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading Operations Command Telemetry...
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
              {error} — All UI modules reflect the Level 4 Vice-Admin command specifications.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Ops Sync
          </button>
        </div>
      )}

      {/* 3. Department SLA Status Cards */}
      <section className="space-y-3">
        <h2 className="font-headline text-lg font-bold text-white tracking-wide">
          Departmental SLA Health &amp; Inboxes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { dept: "Trust & Safety Desk", count: data?.departmentQueues?.[0]?.pendingCount ?? 0, sla: "HEALTHY", icon: "🛡️" },
            { dept: "Tournament Arbitration", count: data?.departmentQueues?.[1]?.pendingCount ?? 0, sla: "HEALTHY", icon: "⚖️" },
            { dept: "Verification Queue", count: data?.departmentQueues?.[2]?.pendingCount ?? 0, sla: "HEALTHY", icon: "📜" },
            { dept: "Finance & Escrow", count: data?.departmentQueues?.[3]?.pendingCount ?? 0, sla: "HEALTHY", icon: "💳" },
          ].map((d, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xl">{d.icon}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {d.sla}
                </span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold text-white">{d.dept}</h3>
                <span className="text-xs text-[#8796C0] font-mono">{d.count} pending tickets</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Urgent Attention & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#151F52] pb-3">
            <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
              Urgent Attention Queue
            </h3>
            <span className="text-xs font-mono text-[#8796C0]">
              {data?.urgentAttentionItems.length ?? 0} Items
            </span>
          </div>

          {!data || data.urgentAttentionItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8796C0] font-mono">
              No urgent operational cases currently flagged.
            </div>
          ) : (
            <div className="space-y-3">
              {data.urgentAttentionItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#13183D] border border-[#21274C] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#5CB6F9]">{item.refCode}</span>
                  </div>
                  <p className="text-xs text-[#8796C0]">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#151F52] pb-3">
            <h3 className="font-headline text-sm font-bold text-white uppercase tracking-wider">
              Recent Ops Audit Stream
            </h3>
            <span className="text-xs font-mono text-[#5CB6F9]">LIVE TELEMETRY</span>
          </div>

          {!data || data.recentAuditStream.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8796C0] font-mono">
              Audit stream will populate with verified staff actions.
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentAuditStream.map((audit) => (
                <div key={audit.id} className="p-3.5 rounded-xl bg-[#13183D] border border-[#21274C] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{audit.actor}</span>
                    <span className="text-[#8796C0]"> — {audit.detail}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8796C0]">{audit.timeAgo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
