import React, { useEffect, useState } from "react";
import { apiRequest, AdminTrustSafetyItem } from "../../lib/api";

export const AdminTrustSafetyPage: React.FC = () => {
  const [reports, setReports] = useState<AdminTrustSafetyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B trust & safety queue
      const res = await apiRequest<{ reports: AdminTrustSafetyItem[] }>("/admin/trust-safety/reports");

      if (res.ok) {
        setReports(res.data.reports || []);
      } else {
        setError(res.error || "Trust & Safety Enclave currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedUser.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "ALL" || r.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              AUTHORITY L3 • TRUST &amp; SAFETY INTEGRITY DESK
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Trust &amp; Safety &amp; Community Integrity Command
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Safeguard platform fairness, arbitrate anti-cheat anomalies, review player conduct cases, and enforce zero-gambling charters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Sanctioning module pending Phase 5B moderation engine.")}
              className="px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(35,61,255,0.45)] flex items-center gap-2"
            >
              <span>🛡️</span>
              <span>Initiate Sanction Protocol</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading Integrity Enclave Queue...
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
              {error} — All moderation actions and heuristics review queues are configured to the T&amp;S interface spec.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-[#090F3B] border border-[#192359] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search cases, usernames, or flags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#F7FBFF] placeholder-[#8796C0] focus:outline-none focus:border-[#233DFF]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#8796C0]">🔍</span>
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical (P0)</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Trust & Safety Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Case #</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Reported Gamer</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Flagged At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Fetching case backlog..." : "No trust & safety cases currently open."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{r.caseNumber}</td>
                    <td className="py-3 px-4 font-bold text-white">{r.category}</td>
                    <td className="py-3 px-4 text-[#8796C0]">@{r.reportedUser}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        r.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400"
                          : r.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-[#5CB6F9]"
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{r.status}</td>
                    <td className="py-3 px-4 text-[#8796C0] font-mono text-[11px]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Review case ${r.caseNumber} pending Phase 5B T&S adjudication.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
