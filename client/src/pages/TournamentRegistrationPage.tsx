import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  apiRequest,
  TournamentItem,
  PlayerOverviewResponse,
  TournamentRegistrationPayload,
} from "../lib/api";

export const TournamentRegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<TournamentItem | null>(null);
  const [currentUser, setCurrentUser] = useState<PlayerOverviewResponse["data"]["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  // Form State
  const [registrationMode, setRegistrationMode] = useState<"SOLO" | "EXISTING_TEAM" | "NEW_TEAM">("SOLO");
  const [inGameHandle, setInGameHandle] = useState("");
  const [teamName, setTeamName] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Flex"]);
  const [agreedRules, setAgreedRules] = useState(false);
  const [agreedAntiCheat, setAgreedAntiCheat] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // Check auth token
      const token = localStorage.getItem("riyadah_auth_token");
      if (!token) {
        navigate(`/login?redirect=/tournaments/${id}/register`);
        return;
      }

      // Fetch user profile & tournament concurrently
      const [userRes, tourneyRes] = await Promise.all([
        apiRequest<PlayerOverviewResponse>("/player/overview"),
        apiRequest<{ status: string; data: { tournament: TournamentItem } }>(`/tournaments/${id}`),
      ]);

      setLoading(false);

      if (!userRes.ok) {
        if (userRes.error.includes("Authentication") || userRes.error.includes("expired")) {
          navigate(`/login?redirect=/tournaments/${id}/register`);
          return;
        }
        setError(userRes.error);
        return;
      }

      if (!tourneyRes.ok) {
        setError(tourneyRes.error);
        return;
      }

      setCurrentUser(userRes.data.data.user);
      setTournament(tourneyRes.data.data.tournament);

      // Auto-populate default fields
      if (userRes.data.data.profile?.discordHandle) {
        setDiscordHandle(userRes.data.data.profile.discordHandle);
      }
      setInGameHandle(`${userRes.data.data.user.username}#KSA`);
    };

    loadData();
  }, [id, navigate]);

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament || submitting) return;

    setError(null);
    setFieldErrors({});

    if (!agreedRules || !agreedAntiCheat) {
      setError("Please accept the tournament rules and anti-cheat agreements to proceed.");
      return;
    }

    if (!inGameHandle.trim()) {
      setError("In-game handle is required for roster verification.");
      return;
    }

    setSubmitting(true);

    const payload: TournamentRegistrationPayload = {
      registrationMode,
      inGameHandle: inGameHandle.trim(),
      preferredRoles: selectedRoles,
      teamName: registrationMode !== "SOLO" ? teamName.trim() : null,
      discordHandle: discordHandle.trim() || null,
      agreedRules: true,
      agreedAntiCheat: true,
    };

    const res = await apiRequest<{ status: string; data: { registration: any } }>(
      `/tournaments/${tournament.slug || tournament.id}/register`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      if (res.errors) {
        setFieldErrors(res.errors);
      }
      return;
    }

    setConfirmedRegistration(res.data.data.registration);
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1380px] mx-auto p-6 md:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-[#091038] rounded-lg"></div>
          <div className="h-96 w-full bg-[#091038] rounded-2xl border border-[#182352]"></div>
        </div>
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div className="w-full max-w-[1380px] mx-auto p-6 md:p-10">
        <div className="p-8 rounded-2xl bg-[#091038] border border-red-500/30 text-center max-w-xl mx-auto space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold font-headline text-white">Registration Unavailable</h2>
          <p className="text-xs text-[#8796C0]">{error}</p>
          <div className="pt-2">
            <Link
              to="/tournaments"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase tracking-wider"
            >
              Back to Tournaments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament || !currentUser) return null;

  return (
    <div className="w-full pb-20 px-4 sm:px-6 max-w-[1380px] mx-auto flex flex-col gap-8 antialiased">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-[#92ccff] hover:underline">Home</Link>
          <span>/</span>
          <Link to="/tournaments" className="text-[#92ccff] hover:underline">Tournaments</Link>
          <span>/</span>
          <Link to={`/tournaments/${tournament.slug || tournament.id}`} className="text-[#92ccff] hover:underline">
            {tournament.title}
          </Link>
          <span>/</span>
          <span className="text-[#dfe0ff]">Registration</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Direct DB Integrity Pipeline
        </div>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {confirmedRegistration && (
        <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#091038] via-[#0D154B] to-[#091038] border border-emerald-500/40 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-widest">
                PERSISTED TOURNAMENT PASS CONFIRMED
              </span>
              <h2 className="text-2xl font-bold font-headline text-white">
                You are registered for {tournament.title}!
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-xl bg-[#050A30] border border-[#182352]">
            <div>
              <span className="text-[11px] font-mono text-[#8796C0] uppercase">Official Ticket Reference</span>
              <div className="text-base font-mono font-bold text-[#5CB6F9] mt-0.5">
                {confirmedRegistration.ticketCode || confirmedRegistration.id}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#8796C0] uppercase">In-Game Identifier</span>
              <div className="text-base font-mono font-bold text-white mt-0.5">
                {confirmedRegistration.inGameHandle}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#8796C0] uppercase">Status</span>
              <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                {confirmedRegistration.status}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/player/tournaments"
              className="px-6 py-3 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition"
            >
              Go to My Tournaments Hub →
            </Link>
            <Link
              to="/player/dashboard"
              className="px-6 py-3 rounded-xl bg-[#13183d] border border-[#21274c] text-[#CAE8FF] text-xs font-headline font-semibold hover:bg-[#1b2354] transition"
            >
              Player Dashboard
            </Link>
          </div>
        </section>
      )}

      {/* MAIN REGISTRATION FORM AND SUMMARY GRID */}
      {!confirmedRegistration && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Registration Steps */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* ERROR NOTIFICATION */}
            {error && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
                <p className="font-bold text-red-300">Registration Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            )}

            {/* SECTION 1: Player Identity Snapshot */}
            <section className="p-6 rounded-2xl bg-[#091038] border border-[#182352] flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#182352]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-full bg-[#5CB6F9]"></span>
                  <h2 className="font-headline text-lg font-bold text-white">1. Player Identity Snapshot</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050A30] text-[#5CB6F9] font-mono text-[11px] font-semibold border border-[#182352]">
                  Auto-Populated from Riyadah ID
                </span>
              </div>
              <p className="text-xs text-[#8796C0]">
                Roster credentials and competitive integrity logs are tied directly to your verified Riyadah passport.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#182352] flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8796C0] uppercase">Full Legal Name</span>
                  <span className="text-sm font-semibold text-white">{currentUser.fullName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#182352] flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8796C0] uppercase">Verified Account Email</span>
                  <span className="text-sm font-semibold text-white truncate">{currentUser.email}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#182352] flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8796C0] uppercase">Riyadah Gamer Tag</span>
                  <span className="text-sm font-semibold text-[#5CB6F9] font-mono">@{currentUser.username}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#182352] flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-[#8796C0] uppercase">Role Authorization</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">{currentUser.role}</span>
                </div>
              </div>
            </section>

            {/* SECTION 2: Registration Mode */}
            <section className="p-6 rounded-2xl bg-[#091038] border border-[#182352] flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#182352]">
                <span className="w-2.5 h-6 rounded-full bg-[#5CB6F9]"></span>
                <h2 className="font-headline text-lg font-bold text-white">2. Participation Mode</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {/* Solo / Free Agent */}
                <label
                  onClick={() => setRegistrationMode("SOLO")}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${
                    registrationMode === "SOLO"
                      ? "bg-[#233DFF]/15 border-[#5CB6F9] shadow-[0_0_15px_rgba(35,61,255,0.25)]"
                      : "bg-[#050A30] border-[#182352] hover:border-[#233DFF]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    checked={registrationMode === "SOLO"}
                    onChange={() => setRegistrationMode("SOLO")}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Free Agent / Solo Competitor</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                        Default
                      </span>
                    </div>
                    <p className="text-xs text-[#8796C0] mt-1">
                      Enter the tournament individually. Match organizers will assign you into a balanced squad or solo pool.
                    </p>
                  </div>
                </label>

                {/* Pre-made Squad */}
                <label
                  onClick={() => setRegistrationMode("EXISTING_TEAM")}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-4 ${
                    registrationMode === "EXISTING_TEAM"
                      ? "bg-[#233DFF]/15 border-[#5CB6F9] shadow-[0_0_15px_rgba(35,61,255,0.25)]"
                      : "bg-[#050A30] border-[#182352] hover:border-[#233DFF]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    checked={registrationMode === "EXISTING_TEAM"}
                    onChange={() => setRegistrationMode("EXISTING_TEAM")}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Register as Team Captain</span>
                    </div>
                    <p className="text-xs text-[#8796C0] mt-1">
                      Register your team roster name. You will be recorded as the squad contact for this entry.
                    </p>
                  </div>
                </label>
              </div>

              {registrationMode !== "SOLO" && (
                <div className="mt-2 space-y-1">
                  <label className="text-xs font-mono text-[#8796C0] uppercase">Squad / Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Falcons Vega or Dune Raiders"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050A30] border border-[#182352] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                  />
                  {fieldErrors.teamName && (
                    <span className="text-[11px] text-red-400">{fieldErrors.teamName[0]}</span>
                  )}
                </div>
              )}
            </section>

            {/* SECTION 3: In-Game Details & Roles */}
            <section className="p-6 rounded-2xl bg-[#091038] border border-[#182352] flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#182352]">
                <span className="w-2.5 h-6 rounded-full bg-[#5CB6F9]"></span>
                <h2 className="font-headline text-lg font-bold text-white">3. In-Game Credentials</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-[#8796C0] uppercase block mb-1">
                    In-Game Handle / Riot ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={inGameHandle}
                    onChange={(e) => setInGameHandle(e.target.value)}
                    placeholder="e.g. PlayerTag#KSA"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050A30] border border-[#182352] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                  />
                  {fieldErrors.inGameHandle && (
                    <span className="text-[11px] text-red-400">{fieldErrors.inGameHandle[0]}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-mono text-[#8796C0] uppercase block mb-2">
                    Primary Preferred Roles (Select 1 or more)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Duelist", "Initiator", "Controller", "Sentinel", "Flex"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`py-2 px-3 rounded-xl text-xs font-headline font-bold transition border ${
                          selectedRoles.includes(role)
                            ? "bg-[#233DFF] border-[#5CB6F9] text-white shadow-md"
                            : "bg-[#050A30] border-[#182352] text-[#8796C0] hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#8796C0] uppercase block mb-1">
                    Discord Tag (For match lobby communications)
                  </label>
                  <input
                    type="text"
                    value={discordHandle}
                    onChange={(e) => setDiscordHandle(e.target.value)}
                    placeholder="e.g. username#1234 or @username"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050A30] border border-[#182352] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 4: Integrity & Agreements */}
            <section className="p-6 rounded-2xl bg-[#091038] border border-[#182352] flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#182352]">
                <span className="w-2.5 h-6 rounded-full bg-[#5CB6F9]"></span>
                <h2 className="font-headline text-lg font-bold text-white">4. Fair Play & Integrity Charter</h2>
              </div>

              <div className="space-y-3 text-xs text-[#8796C0]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedRules}
                    onChange={(e) => setAgreedRules(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-300">
                    I agree to the official {tournament.title} rulebook, match schedule, and organizer guidelines.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedAntiCheat}
                    onChange={(e) => setAgreedAntiCheat(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-slate-300">
                    I acknowledge that active anti-cheat telemetry and hardware verification are enforced. Any unapproved modifications or third-party exploits will result in immediate disqualification.
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Summary Card */}
          <aside className="lg:col-span-4 w-full lg:sticky lg:top-24 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#091038] border border-[#182352] overflow-hidden shadow-xl flex flex-col">
              <div className="p-5 border-b border-[#182352]">
                <span className="text-[11px] font-mono text-[#5CB6F9] uppercase tracking-wider block mb-1">
                  Registration Manifest
                </span>
                <h3 className="text-lg font-bold font-headline text-white">{tournament.title}</h3>
                <p className="text-xs text-[#8796C0] mt-0.5">{tournament.game} • {tournament.format}</p>
              </div>

              <div className="p-5 space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[#8796C0]">Entry Fee:</span>
                  <span className="text-emerald-400 font-bold">{tournament.entryFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8796C0]">Current Capacity:</span>
                  <span className="text-white">
                    {tournament.participantCount ?? 0} / {tournament.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8796C0]">Participation:</span>
                  <span className="text-[#5CB6F9] font-semibold">{registrationMode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8796C0]">Prize Pool:</span>
                  <span className="text-white font-bold">{tournament.prizePool || "Ranked Honor"}</span>
                </div>
              </div>

              <div className="p-5 border-t border-[#182352] bg-[#050A30]">
                <button
                  type="submit"
                  disabled={submitting || !agreedRules || !agreedAntiCheat}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:brightness-110 disabled:opacity-50 text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                >
                  {submitting ? "Processing Transaction..." : "Complete Registration →"}
                </button>
                <p className="text-[10px] text-center text-[#8796C0] mt-2 font-mono">
                  Atomic DB transaction • Verified duplicate protection
                </p>
              </div>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
};

export default TournamentRegistrationPage;
