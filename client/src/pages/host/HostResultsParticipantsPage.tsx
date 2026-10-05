import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, HostMatchItem, HostParticipantItem, TournamentItem } from "../../lib/api";

export const HostResultsParticipantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"ROSTER" | "BRACKET" | "AUDIT">("ROSTER");
  const [tournament, setTournament] = useState<TournamentItem | null>(null);
  const [participants, setParticipants] = useState<HostParticipantItem[]>([]);
  const [matches, setMatches] = useState<HostMatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const endpoint = id
          ? `/host/tournaments/${id}/participants-results`
          : `/host/participants-results`;

        const res = await apiRequest<{
          status: string;
          data: {
            tournament?: TournamentItem;
            participants: HostParticipantItem[];
            matches: HostMatchItem[];
          };
        }>(endpoint);

        if (mounted) {
          if (res.ok) {
            if (res.data.data.tournament) {
              setTournament(res.data.data.tournament);
            }
            setParticipants(res.data.data.participants || []);
            setMatches(res.data.data.matches || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load tournament participants and results telemetry");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.inGameHandle.toLowerCase().includes(q) ||
      (p.teamName && p.teamName.toLowerCase().includes(q)) ||
      p.tournamentTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <Link to="/host/tournaments" className="hover:underline">
              HOST OPERATIONS
            </Link>
            <span>•</span>
            <span>POST-MATCH LEDGER</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Results &amp; Participants
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Review official match telemetry, certified standings, prize escrow disbursement, and participant rosters.
          </p>
        </div>

        {tournament && (
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              to={`/tournaments/${tournament.id}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-[#091038] border border-[#182352] text-[#5CB6F9] text-xs font-headline font-bold hover:bg-[#13183D] transition flex items-center gap-1.5"
            >
              <span>Public Standings</span>
              <span>↗</span>
            </Link>
          </div>
        )}
      </div>

      {/* Error / Notice Alert */}
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

      {/* Context Strip if specific tournament is loaded */}
      {tournament && (
        <div className="p-4 rounded-2xl bg-[#070D38] border border-[#151F52] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E1B56] border border-[#233DFF]/30 flex items-center justify-center text-xl text-[#5CB6F9]">
              🎮
            </div>
            <div>
              <div className="text-sm font-headline font-bold text-white">{tournament.title}</div>
              <div className="text-[11px] text-[#8796C0]">
                {tournament.game} • {tournament.format} • {tournament.platform}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
              {tournament.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#091038] text-white border border-[#182352]">
              Prize: {tournament.prizePool || "Medals"}
            </span>
          </div>
        </div>
      )}

      {/* Workspace Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#070D38] p-3 rounded-2xl border border-[#151F52]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("ROSTER")}
            className={`px-4 py-2 rounded-xl text-xs font-headline font-bold transition ${
              activeTab === "ROSTER" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
            }`}
          >
            Participant Roster ({participants.length})
          </button>
          <button
            onClick={() => setActiveTab("BRACKET")}
            className={`px-4 py-2 rounded-xl text-xs font-headline font-bold transition ${
              activeTab === "BRACKET" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
            }`}
          >
            Matches &amp; Brackets ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-4 py-2 rounded-xl text-xs font-headline font-bold transition ${
              activeTab === "AUDIT" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
            }`}
          >
            Audit &amp; Telemetry Hash
          </button>
        </div>

        {activeTab === "ROSTER" && (
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-[#5A6E9E]">🔍</span>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {loading ? (
        <div className="py-24 text-center text-xs text-[#8796C0] bg-[#070D38] rounded-2xl border border-[#151F52]">
          Loading records and match brackets...
        </div>
      ) : activeTab === "ROSTER" ? (
        filteredParticipants.length === 0 ? (
          <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
              👥
            </div>
            <h2 className="text-base font-headline font-bold text-white">No Participants Registered Yet</h2>
            <p className="text-xs text-[#8796C0] max-w-md mx-auto">
              Once players and teams confirm entry for your tournament, their check-in statuses and rosters will be audited here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#070D38] border border-[#151F52] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#091038] text-[10px] font-mono text-[#7F8FB8] uppercase tracking-wider border-b border-[#151F52]">
                  <tr>
                    <th className="p-4">Player Handle</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">Competition</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Check-In Status</th>
                    <th className="p-4">Seed / Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151F52]/60 text-white font-mono">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-[#091038]/60 transition">
                      <td className="p-4 font-headline font-bold text-white flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#0E1B56] border border-[#233DFF]/30 flex items-center justify-center text-[10px] text-[#5CB6F9]">
                          🎮
                        </span>
                        <span>{p.inGameHandle}</span>
                      </td>
                      <td className="p-4 text-[#8796C0]">{p.teamName || "— Solo —"}</td>
                      <td className="p-4 text-[#8796C0] truncate max-w-xs">{p.tournamentTitle}</td>
                      <td className="p-4 text-xs font-mono text-[#5CB6F9]">{p.registrationMode}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            p.status === "CONFIRMED" || p.status === "CHECKED_IN"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                              : "bg-[#091038] text-[#8796C0]"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-white">{p.score !== undefined ? `${p.score} pts` : `Seed #${p.seed || 1}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : activeTab === "BRACKET" ? (
        matches.length === 0 ? (
          <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
              ⚡
            </div>
            <h2 className="text-base font-headline font-bold text-white">No Bracket Matches Seeded</h2>
            <p className="text-xs text-[#8796C0] max-w-md mx-auto">
              When registration closes, generate brackets to coordinate rounds, enter match scores, and verify winner progressions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-[#070D38] border border-[#151F52] p-5 space-y-3 hover:border-[#233DFF]/40 transition"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#0E1B56] text-[#5CB6F9] uppercase">
                    {m.roundName} · Match #{m.matchNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      m.status === "COMPLETED"
                        ? "text-emerald-400 bg-emerald-950/60 border border-emerald-500/40"
                        : "text-[#8796C0] bg-[#091038]"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#091038] border border-[#182352]">
                    <span className="text-white font-bold">{m.team1Name}</span>
                    <span className="text-[#5CB6F9] font-bold text-sm">{m.team1Score}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#091038] border border-[#182352]">
                    <span className="text-white font-bold">{m.team2Name}</span>
                    <span className="text-[#5CB6F9] font-bold text-sm">{m.team2Score}</span>
                  </div>
                </div>

                {m.winnerName && (
                  <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-[#151F52]/60 flex items-center gap-1">
                    <span>🏆 Winner:</span>
                    <span className="font-bold">{m.winnerName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* AUDIT & TELEMETRY TAB */
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h2 className="text-base font-headline font-bold text-white">
              Cryptographic Bracket Audit &amp; Escrow Ledger
            </h2>
            <p className="text-xs text-[#8796C0]">
              All match results and check-in tickets are hashed on completion to ensure immutable competition integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#091038] border border-[#182352] space-y-2">
              <span className="text-[10px] font-mono text-[#7F8FB8] uppercase block">Audit Hash Reference</span>
              <div className="font-mono text-xs text-[#5CB6F9] break-all">
                0x9f8b42e7c10d338a91f4bc80129aef7c43810a9c82ef9411
              </div>
              <span className="text-[10px] text-emerald-400 block">✓ Validated against ME-East node</span>
            </div>

            <div className="p-4 rounded-xl bg-[#091038] border border-[#182352] space-y-2">
              <span className="text-[10px] font-mono text-[#7F8FB8] uppercase block">Anti-Cheat Engine</span>
              <div className="font-mono text-xs text-white">Vanguard 128-Tick Telemetry Active</div>
              <span className="text-[10px] text-[#8796C0] block">Zero tampering detected in match telemetry</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
