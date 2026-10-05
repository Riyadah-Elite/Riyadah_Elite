import React, { useEffect, useState } from "react";
import { apiRequest, AdminContentItem } from "../../lib/api";

export const AdminContentManagementPage: React.FC = () => {
  const [contentItems, setContentItems] = useState<AdminContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placementFilter, setPlacementFilter] = useState("ALL");

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B content registry endpoint
      const res = await apiRequest<{ items: AdminContentItem[] }>("/admin/content/items");

      if (res.ok) {
        setContentItems(res.data.items || []);
      } else {
        setError(res.error || "Content Operations API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadContent();
  }, []);

  const filteredItems = contentItems.filter((item) => {
    return placementFilter === "ALL" || item.targetPlacement === placementFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              PUBLIC EXPERIENCE &amp; DISCOVERY CMS COMMAND CENTER
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Public Experience &amp; Discovery CMS Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Curate public-facing hero banners, featured game testing titles, sanctioned tournament spotlights, announcements, and platform taxonomy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Edge cache invalidation pending Phase 5B CDN integration.")}
              className="px-4 py-2.5 rounded-xl bg-[#13183D] hover:bg-[#1A2255] border border-[#21274C] text-[#CAE8FF] font-headline text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <span>⚡</span>
              <span>Purge Edge Cache (RUH-DC1)</span>
            </button>
            <button
              onClick={() => alert("Content authoring interface pending Phase 5B editor engine.")}
              className="px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(35,61,255,0.45)] flex items-center gap-2"
            >
              <span>➕</span>
              <span>Create New Content</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading Content Registry...
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
              {error} — All editorial controls, scheduling slots, and target placement selectors are configured to the CMS interface spec.
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
          value={placementFilter}
          onChange={(e) => setPlacementFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
        >
          <option value="ALL">All Target Placements</option>
          <option value="HOMEPAGE">Homepage Hero &amp; Banners</option>
          <option value="GAMES_DISCOVERY">Games Catalog Feature</option>
          <option value="TOURNAMENTS_HUB">Tournaments Spotlight</option>
        </select>
      </div>

      {/* Content Items Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Title / Asset</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Placement</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Fetching editorial assets..." : "No CMS items currently staged or published."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{item.title}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{item.contentType}</td>
                    <td className="py-3 px-4 text-[#8796C0]">{item.targetPlacement}</td>
                    <td className="py-3 px-4 text-[#8796C0]">{item.authorName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : item.status === "SCHEDULED"
                          ? "bg-blue-500/10 text-[#5CB6F9]"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Content editor for ${item.title} pending Phase 5B publishing engine.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Edit
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
