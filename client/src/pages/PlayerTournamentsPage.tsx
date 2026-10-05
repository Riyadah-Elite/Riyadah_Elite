import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, PlayerTournamentsResponse, TournamentRegistrationItem } from "../lib/api";

export const PlayerTournamentsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<TournamentRegistrationItem[]>([]);
  const [metrics, setMetrics] = useState<PlayerTournamentsResponse["data"]["metrics"]>({
    total: 0,
    upcoming: 0,
    active: 0,
    completed: 0,
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "ACTIVE" | "COMPLETED">("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (statusFilter !== "ALL") queryParams.append("status", statusFilter);
    if (search.trim()) queryParams.append("search", search.trim());

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const res = await apiRequest<PlayerTournamentsResponse>(`/player/tournaments${queryString}`);

    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setRegistrations(res.data.data.registrations);
    setMetrics(res.data.data.metrics);
  };

  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTournaments();
  };

  // Find next upcoming tournament
  const nextTournamentReg = registrations.find(
    (r) => r.tournament?.status === "REGISTRATION_OPEN" || r.tournament?.status === "REGISTRATION_CLOSED"
  );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-[1380px] mx-auto w-full space-y-8 antialiased">
      {/* HEADER / INTRO */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091038] p-5 sm:p-6 rounded-2xl border border-[#182352]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-white tracking-tight uppercase">
              TOURNAMENTS WORKSPACE
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#233DFF]/20 text-[#5CB6F9] border border-[#233DFF]/40 font-semibold tracking-wide uppercase">
              Player Division
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8796C0] mt-1 font-body">
            Manage your registered championships, competitive matches, and verifiable bracket passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:brightness-110 shadow-[0_0_20px_rgba(35,61,255,0.4)] transition uppercase tracking-wider font-headline"
          >
            <span>Browse Open Cups →</span>
          </Link>
        </div>
      </section>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between gap-4 text-xs text-red-200">
          <div>
            <p className="font-bold text-red-300">Unable to load tournaments</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchTournaments}
            className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-mono text-xs transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 1: STATISTICS ROW (Matches Stitch Design) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#8796C0] mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              Total Registrations
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#233DFF]/20 text-[#5CB6F9] flex items-center justify-center font-bold text-sm">
              🏆
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-headline">
            {metrics.total}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#5CB6F9] font-mono">
            <span>{metrics.upcoming} upcoming tournaments</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#8796C0] mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              Active / In Progress
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              ⚔️
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-headline">
            {metrics.active}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono">
            <span>{metrics.active > 0 ? "Live match fixtures active" : "No ongoing matches"}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#8796C0] mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              Upcoming Cups
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#0F174A] text-[#5CB6F9] flex items-center justify-center font-bold text-sm">
              📅
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-headline">
            {metrics.upcoming}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300 font-mono">
            <span>Seeding / Check-In Queue</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#091038] border border-[#182352] rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#8796C0] mb-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              Finished / Past
            </span>
            <span className="w-8 h-8 rounded-lg bg-[#0F174A] text-slate-400 flex items-center justify-center font-bold text-sm">
              🏁
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-headline">
            {metrics.completed}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-mono">
            <span>Archived records</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: NEXT UPCOMING TOURNAMENT BANNER */}
      {nextTournamentReg && nextTournamentReg.tournament && (
        <section className="bg-[#091038] border border-[#182352] rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
          <div className="md:w-5/12 relative h-52 md:h-auto overflow-hidden bg-slate-900 shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: nextTournamentReg.tournament.bannerUrl
                  ? `url('${nextTournamentReg.tournament.bannerUrl}')`
                  : `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#091038]/60 to-[#091038]"></div>
            <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#233DFF] text-white">
                NEXT TOURNAMENT
              </span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {nextTournamentReg.status}
              </span>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5CB6F9] uppercase tracking-wider font-mono">
                  {nextTournamentReg.tournament.game} • {nextTournamentReg.tournament.format}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {nextTournamentReg.tournament.prizePool || "Ranked Trophy"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1 uppercase font-headline">
                {nextTournamentReg.tournament.title}
              </h3>
              <p className="text-xs text-[#8796C0] mt-2 font-mono">
                Kickoff: {new Date(nextTournamentReg.tournament.startDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded bg-[#050A30] border border-[#182352]">
                  Handle: {nextTournamentReg.inGameHandle}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#050A30] border border-[#182352]">
                  Mode: {nextTournamentReg.registrationMode}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#050A30] border border-[#182352] text-[#5CB6F9]">
                  Ticket: {nextTournamentReg.ticketCode}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/tournaments/${nextTournamentReg.tournament.slug || nextTournamentReg.tournament.id}`}
                className="inline-block py-2.5 px-5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white text-xs font-headline font-bold uppercase tracking-wider transition"
              >
                View Tournament Page →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: FILTER & SEARCH CONTROLS */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL" as const, label: "All Registrations" },
            { id: "UPCOMING" as const, label: "Upcoming" },
            { id: "ACTIVE" as const, label: "Live Active" },
            { id: "COMPLETED" as const, label: "Completed" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-headline font-bold uppercase transition whitespace-nowrap ${
                statusFilter === pill.id
                  ? "bg-[#233DFF] text-white shadow-md"
                  : "bg-[#091038] text-[#8796C0] border border-[#182352] hover:text-white"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by game, cup, host..."
            className="w-full bg-[#091038] text-xs text-white placeholder-[#8796C0] border border-[#182352] rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#5CB6F9] transition"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#8796C0]">🔍</span>
        </form>
      </section>

      {/* SECTION 4: PARTICIPATION LIST OR HONEST EMPTY STATE */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8796C0] font-mono animate-pulse">
          Loading player tournament records...
        </div>
      ) : registrations.length === 0 ? (
        <div className="bg-[#091038] border-2 border-dashed border-[#182352] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#050A30] border border-[#182352] flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <h3 className="text-base font-bold font-headline text-white uppercase">
              NO TOURNAMENTS FOUND
            </h3>
            <p className="text-xs text-[#8796C0] max-w-sm mt-1">
              {statusFilter !== "ALL" || search
                ? "No tournament records matched the active filter or search query."
                : "You have not registered for any competitive esports tournaments yet. Explore open cups and join bracket qualifiers."}
            </p>
          </div>
          <Link
            to="/tournaments"
            className="px-5 py-2.5 text-xs font-headline font-bold rounded-xl bg-[#233DFF] text-white uppercase tracking-wider hover:brightness-110 transition shadow-lg"
          >
            Browse Tournaments Catalog →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => {
            const t = reg.tournament;
            if (!t) return null;

            return (
              <div
                key={reg.id}
                className="bg-[#091038] border border-[#182352] rounded-2xl overflow-hidden flex flex-col hover:border-[#233DFF] transition duration-300 shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[#050A30]">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: t.bannerUrl
                        ? `url('${t.bannerUrl}')`
                        : `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091038] via-transparent to-black/40"></div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-bold">
                      {t.game}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full ${
                        reg.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white font-headline">{t.title}</h4>
                    <p className="text-xs text-[#8796C0] mt-1 font-mono">
                      {new Date(t.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-[#182352] text-slate-300 font-mono">
                      <span>Handle: {reg.inGameHandle}</span>
                      <span className="text-emerald-400 font-bold">{t.prizePool || "Ranked"}</span>
                    </div>

                    <div className="text-[11px] font-mono text-[#8796C0] mt-1">
                      Ticket Ref: <span className="text-[#5CB6F9]">{reg.ticketCode}</span>
                    </div>
                  </div>

                  <Link
                    to={`/tournaments/${t.slug || t.id}`}
                    className="w-full text-center py-2.5 px-3 rounded-xl bg-[#233DFF] hover:brightness-110 text-white text-xs font-headline font-bold uppercase tracking-wider transition"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayerTournamentsPage;
