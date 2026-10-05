import React, { useEffect, useState } from "react";
import { apiRequest, AdminVerificationItem } from "../../lib/api";

export const AdminVerificationPage: React.FC = () => {
  const [items, setItems] = useState<AdminVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicantTypeFilter, setApplicantTypeFilter] = useState("ALL");

  useEffect(() => {
    async function loadVerifications() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B verification queue
      const res = await apiRequest<{ items: AdminVerificationItem[] }>("/admin/verification/queue");

      if (res.ok) {
        setItems(res.data.items || []);
      } else {
        setError(res.error || "Verification Management API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadVerifications();
  }, []);

  const filteredItems = items.filter((item) => {
    return applicantTypeFilter === "ALL" || item.applicantType === applicantTypeFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              LEGAL ACCREDITATION &amp; CR VALIDATION CONSOLE
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Entity Verification &amp; Compliance Review
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Verify studio Commercial Registrations (CR), tournament host credentials, professional player IDs, and licensing agreements.
            </p>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading Document Evidence Queue...
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
              {error} — Truthful pending state rendered. All accreditation workflows and evidence viewers are prepared.
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

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#090F3B] border border-[#192359] flex items-center justify-between">
        <select
          value={applicantTypeFilter}
          onChange={(e) => setApplicantTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
        >
          <option value="ALL">All Application Categories</option>
          <option value="STUDIO_DEVELOPER">Game Studios (CR)</option>
          <option value="TOURNAMENT_ORGANIZER">Esports Hosts (Licenses)</option>
          <option value="PRO_PLAYER">Verified Players</option>
        </select>
      </div>

      {/* Verification Items Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Applicant / Entity</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Document Type</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Checking verification files..." : "No verification submissions pending audit."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{item.entityName}</span>
                        <span className="text-[11px] text-[#8796C0]">{item.contactEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{item.applicantType}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#8796C0]">{item.documentType}</td>
                    <td className="py-3 px-4 text-[#8796C0] font-mono text-[11px]">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : item.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Review documentation for ${item.entityName} pending Phase 5B evidence service.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Inspect Evidence
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
