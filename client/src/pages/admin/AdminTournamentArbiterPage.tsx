import React, { useEffect, useState } from "react";
import { apiRequest, AdminTournamentArbiterItem } from "../../lib/api";

export const AdminTournamentArbiterPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<AdminTournamentArbiterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadTournaments() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B arbiter endpoint
      const res = await apiRequest<{ tournaments: AdminTournamentArbiterItem[] }>("/admin/tournaments/arbiter");

      if (res.ok) {
        setTournaments(res.data.tournaments || []);
      } else {
        setError(res.error || "Tournament Arbiter API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadTournaments();
  }, []);

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.game.toLowerCase().includes(search.toLowerCase()) ||
      t.organizerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              OPS • LVL 2 TOURNAMENT ARBITER DESK
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Tournament Operations &amp; Bracket Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Oversee sanctioned esports competitions, arbitrate bracket disputes, inspect live broadcasts, and enforce zero-gambling charters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Dispute triage workflow requires Phase 5B arbiter queue.")}
              className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center gap-2"
            >
              <span>⚖️</span>
              <span>Quick Dispute Triage</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Connecting to Tournament Arbiter Mesh...
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
              {error} — All arbiter controls, dispute queues, and sanction tools are initialized.
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

      {/* Filters Toolbar */}
      <div className="p-4 rounded-xl bg-[#090F3B] border border-[#192359] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search tournament, game, or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#F7FBFF] placeholder-[#8796C0] focus:outline-none focus:border-[#233DFF]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#8796C0]">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="SANCTIONED">Sanctioned</option>
          <option value="IN_PROGRESS">Live / In Progress</option>
          <option value="DISPUTED">Disputed</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Tournaments Arbiter Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Tournament</th>
                <th className="py-3.5 px-4">Game</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Prize Pool</th>
                <th className="py-3.5 px-4">Disputes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {filteredTournaments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Loading arbiter records..." : "No tournaments match the specified criteria."}
                  </td>
                </tr>
              ) : (
                filteredTournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{t.title}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{t.game}</td>
                    <td className="py-3 px-4 text-[#8796C0]">{t.organizerName}</td>
                    <td className="py-3 px-4 font-mono">{t.format}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{t.prizePoolSAR} SAR</td>
                    <td className="py-3 px-4">
                      {t.activeDisputesCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400">
                          {t.activeDisputesCount} Active
                        </span>
                      ) : (
                        <span className="text-[#8796C0] font-mono text-[11px]">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        t.status === "DISPUTED"
                          ? "bg-red-500/10 text-red-400"
                          : t.status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-[#5CB6F9]"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Arbitration interface for ${t.title} pending Phase 5B arbiter engine.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Arbitrate
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
