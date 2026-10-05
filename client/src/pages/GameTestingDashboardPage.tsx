import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, GameOpportunityItem } from "../lib/api";

export const GameTestingDashboardPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<GameOpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePlatform, setActivePlatform] = useState("All");
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOpportunities = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (activePlatform !== "All") queryParams.append("platform", activePlatform);
    if (activeGenre !== "All") queryParams.append("genre", activeGenre);
    if (searchQuery.trim()) queryParams.append("search", searchQuery.trim());

    const result = await apiRequest<{
      status: string;
      data: { opportunities: GameOpportunityItem[] };
    }>(`/player/opportunities?${queryParams.toString()}`);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setOpportunities(result.data.data.opportunities);
  }, [activePlatform, activeGenre, searchQuery]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  return (
    <div className="p-6 md:p-10 max-w-[1380px] mx-auto w-full space-y-8">
      {/* HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091038] p-6 rounded-2xl border border-[#182352]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#5CB6F9]">
              GAME TESTING DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight">
            AVAILABLE PLAYTEST BUILDS
          </h1>
          <p className="text-xs text-[#8796C0] mt-1 font-body">
            Browse real playtesting opportunities published by verified game studios.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, studios..."
            className="h-10 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-xs text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5CB6F9]"
          />
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-[#233DFF] hover:bg-[#1B31D6] text-white font-headline text-xs font-bold uppercase transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#070D38] p-4 rounded-xl border border-[#151F52]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#7C8CB8] uppercase mr-2">Platform:</span>
          {["All", "PC Windows", "PlayStation 5", "Xbox"].map((plat) => (
            <button
              key={plat}
              onClick={() => setActivePlatform(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-semibold transition ${
                activePlatform === plat
                  ? "bg-[#233DFF] text-white"
                  : "bg-[#091038] text-[#8796C0] hover:text-white"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#7C8CB8] uppercase mr-2">Genre:</span>
          {["All", "FPS", "Tactical Shooter", "Action", "RPG"].map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-3 py-1.5 rounded-lg text-xs font-headline font-semibold transition ${
                activeGenre === genre
                  ? "bg-[#233DFF] text-white"
                  : "bg-[#091038] text-[#8796C0] hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-between gap-4 text-xs text-red-200">
          <div>
            <p className="font-bold text-red-300">Failed to load testing opportunities</p>
            <p className="mt-0.5 text-red-300/80">{error}</p>
          </div>
          <button
            onClick={fetchOpportunities}
            className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-mono text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-[#091038] border border-[#182352]"></div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && opportunities.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#091038] border border-[#182352] space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#050A30] border border-[#1A2560] flex items-center justify-center text-2xl text-[#5CB6F9]">
            🎮
          </div>
          <h2 className="text-lg font-bold text-white font-headline">No Matching Game Tests Found</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            There are currently no active testing cohorts matching your filters. Check back regularly as game developers schedule new closed alpha and beta sessions.
          </p>
          {(activePlatform !== "All" || activeGenre !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setActivePlatform("All");
                setActiveGenre("All");
                setSearchQuery("");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* OPPORTUNITY CARDS */}
      {!loading && opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-[#091038] border border-[#182352] rounded-2xl overflow-hidden hover:border-[#233DFF] transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5CB6F9] font-bold">
                    {opp.studio}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#1A2560] text-slate-300">
                    {opp.stage}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-headline text-white">{opp.title}</h3>
                  <p className="text-xs text-[#8796C0] mt-1 font-mono">
                    {opp.genre} • {opp.platform}
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-body">
                  {opp.description}
                </p>

                {opp.rewardText && (
                  <div className="p-3 rounded-xl bg-[#050A30] border border-emerald-500/30 text-xs font-mono text-emerald-300">
                    🏆 {opp.rewardText}
                  </div>
                )}
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  to={`/games/${opp.slug || opp.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#070D38] hover:bg-[#0D1545] border border-[#1A2560] text-slate-200 text-xs font-headline font-bold uppercase text-center transition"
                >
                  View Details
                </Link>
                <Link
                  to={`/games/${opp.slug || opp.id}/apply`}
                  className="flex-1 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1B31D6] text-white text-xs font-headline font-bold uppercase text-center transition shadow-[0_0_15px_rgba(35,61,255,0.4)]"
                >
                  Apply to Test →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
