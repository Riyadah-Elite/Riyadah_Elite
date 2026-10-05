import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, DeveloperGameItem } from "../../lib/api";

export const DeveloperMyGamesPage: React.FC = () => {
  const [games, setGames] = useState<DeveloperGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function loadGames() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{ status: string; data: { games: DeveloperGameItem[] } }>(
          "/developer/games"
        );
        if (mounted) {
          if (res.ok) {
            setGames(res.data.data.games || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Unable to fetch games from server");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadGames();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredGames = games.filter((g) => {
    const matchesStatus = statusFilter === "ALL" || g.status === statusFilter;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>FLEET TELEMETRY</span>
            <span>•</span>
            <span>NODE 04 · RIYADH DC</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            My Games
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Manage your submitted titles, build pipelines, and configure continuous telemetry streams for certified elite player testing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/developer/games/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold shadow-[0_4px_16px_rgba(35,61,255,0.4)] transition"
          >
            <span>+ Add / Submit Game</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#070D38] p-4 rounded-xl border border-[#151F52]">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ACTIVE", "DRAFT", "PAUSED", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-medium transition whitespace-nowrap ${
                statusFilter === s
                  ? "bg-[#233DFF] text-white"
                  : "bg-[#091038] text-[#8796C0] hover:text-[#CAE8FF]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, genre..."
            className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
          />
          <span className="absolute left-2.5 top-2.5 text-xs text-[#5A6E9E]">🔍</span>
        </div>
      </div>

      {/* Backend Gaps Notice if API is pending Phase 3B */}
      {error && (
        <div className="rounded-xl bg-[#1F122B] border border-amber-500/30 p-4 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>
              Developer Game Catalog API response: {error}. Ready for full Phase 3B database integration.
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#2D1B40] text-amber-300 font-mono text-[10px]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Game Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading developer game catalog...</div>
      ) : filteredGames.length === 0 ? (
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
            🎮
          </div>
          <h2 className="text-base font-headline font-bold text-white">No Game Titles Found</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            {searchQuery || statusFilter !== "ALL"
              ? "No games match the selected filters. Try resetting the search or status."
              : "You have not submitted any games yet. Submit your title to recruit certified testers."}
          </p>
          <Link
            to="/developer/games/new"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold"
          >
            + Submit New Game
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="rounded-2xl bg-[#070D38] border border-[#151F52] overflow-hidden flex flex-col justify-between hover:border-[#233DFF]/50 transition group shadow-lg"
            >
              <div>
                <div className="h-40 bg-[#091038] relative overflow-hidden flex items-center justify-center">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <span className="text-4xl text-[#5CB6F9]/30">🎮</span>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#050A30]/80 backdrop-blur text-[#5CB6F9] border border-[#233DFF]/40">
                      {game.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9]">
                    <span>{game.platform}</span>
                    <span>•</span>
                    <span>{game.stage}</span>
                  </div>
                  <h2 className="font-headline text-base font-bold text-white group-hover:text-[#5CB6F9] transition">
                    {game.title}
                  </h2>
                  <p className="text-xs text-[#8796C0] line-clamp-2">{game.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#151F52]/60 mt-4 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#7F8FB8]">
                  Cap: {game.capacity} Testers
                </span>
                <Link
                  to={`/developer/games/${game.id}`}
                  className="text-xs font-headline font-bold text-[#5CB6F9] hover:text-white transition flex items-center gap-1"
                >
                  <span>Telemetry &amp; Details</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
