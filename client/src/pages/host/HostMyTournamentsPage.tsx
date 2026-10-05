import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, TournamentItem } from "../../lib/api";

export const HostMyTournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadTournaments() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{ status: string; data: { tournaments: TournamentItem[] } }>(
          "/host/tournaments"
        );
        if (mounted) {
          if (res.ok) {
            setTournaments(res.data.data.tournaments || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load host tournaments");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadTournaments();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = tournaments.filter((t) => {
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.game.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>TOURNAMENT OPERATIONS</span>
            <span>•</span>
            <span>TIER 1 VERIFIED HOST</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            My Tournaments
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Create, manage, and track all your tournaments across formats and competitive seasons.
          </p>
        </div>

        <Link
          to="/host/tournaments/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg self-start md:self-auto"
        >
          <span>+</span>
          <span>Create Tournament</span>
        </Link>
      </div>

      {/* Error / Notice Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <span>ℹ️ Notice: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#2D1B40] text-amber-300 font-mono text-[10px]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#070D38] p-3 rounded-2xl border border-[#151F52]">
        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "REGISTRATION_OPEN", "ONGOING", "COMPLETED", "DRAFT"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? "bg-[#233DFF] text-white shadow"
                  : "text-[#8796C0] hover:text-[#CAE8FF]"
              }`}
            >
              {st === "REGISTRATION_OPEN" ? "Open" : st === "ONGOING" ? "Live" : st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-[#5A6E9E]">🔍</span>
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#8796C0] bg-[#070D38] rounded-2xl border border-[#151F52]">
          Loading tournaments...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
            🏆
          </div>
          <h2 className="text-base font-headline font-bold text-white">No Tournaments Match Your Filter</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            {tournaments.length === 0
              ? "You haven't published any tournaments yet. Launch a new competition to start collecting player registrations."
              : "Try adjusting your search query or status filter to view other events."}
          </p>
          {tournaments.length === 0 && (
            <Link
              to="/host/tournaments/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg"
            >
              <span>+ Create First Tournament</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl bg-[#070D38] border border-[#151F52] p-5 space-y-4 hover:border-[#233DFF]/40 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30 uppercase font-bold">
                    {t.game}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
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
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#8796C0]">
                  <div>
                    <span className="text-[#5A6E9E] block">Format:</span>
                    <span className="text-white font-medium">{t.format}</span>
                  </div>
                  <div>
                    <span className="text-[#5A6E9E] block">Capacity:</span>
                    <span className="text-white font-medium">{t.maxParticipants} Max</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
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
                    Results
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
