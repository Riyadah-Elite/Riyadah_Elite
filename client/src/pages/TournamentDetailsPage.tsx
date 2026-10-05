import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, TournamentItem } from "../lib/api";

export const TournamentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<TournamentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "schedule">("overview");

  const fetchTournament = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const res = await apiRequest<{ status: string; data: { tournament: TournamentItem } }>(
      `/tournaments/${id}`
    );
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setTournament(res.data.data.tournament);
  };

  useEffect(() => {
    fetchTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-[1380px] mx-auto p-6 md:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-48 bg-[#091038] rounded-lg"></div>
          <div className="h-96 w-full bg-[#091038] rounded-2xl border border-[#182352]"></div>
          <div className="h-40 w-full bg-[#091038] rounded-2xl border border-[#182352]"></div>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="w-full max-w-[1380px] mx-auto p-6 md:p-10">
        <div className="p-8 rounded-2xl bg-[#091038] border border-red-500/30 text-center max-w-xl mx-auto space-y-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold font-headline text-white">Tournament Unavailable</h2>
          <p className="text-xs text-[#8796C0]">
            {error || "The requested tournament does not exist or has not been published."}
          </p>
          <div className="pt-2">
            <Link
              to="/tournaments"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold uppercase tracking-wider"
            >
              Back to Tournaments Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isRegistrationOpen = tournament.status === "REGISTRATION_OPEN" && !tournament.isFull;
  const participantCount = tournament.participantCount ?? 0;
  const capacityPercent = Math.min(100, Math.round((participantCount / tournament.maxParticipants) * 100));

  return (
    <div className="w-full pb-20 px-4 sm:px-6 max-w-[1380px] mx-auto flex flex-col gap-8 antialiased">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8f8fa3]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-[#92ccff] hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link to="/tournaments" className="text-[#92ccff] hover:underline">
            Tournaments
          </Link>
          <span>/</span>
          <span className="text-[#dfe0ff] truncate max-w-xs">{tournament.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#13183d] text-[#92ccff] border border-[#21274c]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Official Competition • Verified Integrity
          </span>
        </div>
      </div>

      {/* HERO TOURNAMENT BANNER */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#13183d] border border-[#21274c] shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
          {/* Visual Media Canvas */}
          <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[440px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
            <div
              className="absolute inset-0 bg-cover bg-center -z-10 brightness-[0.7] contrast-[1.1]"
              style={{
                backgroundImage: tournament.bannerUrl
                  ? `url('${tournament.bannerUrl}')`
                  : `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsjTtvoMxjnaYV2Fz8g5kx58UUWOQylqytcSeo5qLFTY79kON8PWlaMGD8iD_PhyXtOuHKskAdD2vZ0psID-bfPdjDNkSWxIIPAbgROoRtmfHn5T6H4fxxZv5oiBWv6e1i2CNbrVY4gzf321xnxj6kF6PNLzD5fc17Pct7jMRyMhpFdrQ1f3fSL1O_vC7CYYP4udP7huSsDU9o1D81hcRdQxHFmhkGRLdH8Oub06ZnleRdc0eMGX4')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13183d] via-[#13183d]/60 to-transparent -z-10" />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#233dff] text-white font-headline text-xs font-bold uppercase tracking-wider shadow-lg">
                {tournament.game}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#92ccff] text-xs font-semibold">
                {tournament.format}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#050930]/80 backdrop-blur-md text-[#cce5ff] text-xs font-semibold">
                {tournament.region}
              </span>
            </div>

            {/* Bottom Organizer Tag */}
            <div className="bg-[#050930]/90 backdrop-blur-xl p-4 rounded-xl border border-[#21274c] max-w-md shadow-xl mt-auto">
              <div className="text-xs uppercase font-headline tracking-wider text-[#92ccff] font-semibold mb-1">
                Organized by {tournament.organizer}
              </div>
              <div className="text-xs text-[#c5c5da] line-clamp-2">
                {tournament.description}
              </div>
            </div>
          </div>

          {/* Right Information & Registration Callout */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#13183d]/95 backdrop-blur-2xl">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#92ccff] uppercase tracking-wider">
                  Status: {tournament.status.replace("_", " ")}
                </span>
                <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  {tournament.title}
                </h1>
                <div className="text-xs font-mono text-[#8f8fa3] mt-1">
                  {tournament.platform} • Team Size: {tournament.teamSize} Players
                </div>
              </div>

              {/* Live Metric Cards */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#050930] border border-[#21274c]">
                <div>
                  <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
                    Prize Pool
                  </span>
                  <div className="font-headline text-xl sm:text-2xl font-bold text-[#cce5ff] mt-0.5">
                    {tournament.prizePool || "Ranked Honor"}
                  </div>
                  <span className="text-[10px] text-[#92ccff]">Standard Payout</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#8f8fa3] uppercase">
                    Registered Rosters
                  </span>
                  <div className="font-headline text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {participantCount} / {tournament.maxParticipants}
                  </div>
                  <span className="text-[10px] text-[#92ccff] font-mono">
                    {capacityPercent}% Filled
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#050930] rounded-full h-2 overflow-hidden border border-[#21274c]">
                <div
                  className="bg-gradient-to-r from-[#233dff] to-[#5cb6f9] h-full transition-all duration-300"
                  style={{ width: `${capacityPercent}%` }}
                ></div>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-[#c5c5da]">
                <div className="flex items-center justify-between">
                  <span className="text-[#8f8fa3]">Entry Fee:</span>
                  <span className="font-semibold text-emerald-400">{tournament.entryFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8f8fa3]">Tournament Start:</span>
                  <span className="font-semibold text-white">
                    {new Date(tournament.startDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {tournament.registrationDeadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f8fa3]">Registration Deadline:</span>
                    <span className="font-semibold text-[#ff99a8]">
                      {new Date(tournament.registrationDeadline).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Action Buttons */}
            <div className="pt-6 mt-6 border-t border-[#21274c] flex flex-col gap-3">
              {isRegistrationOpen ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/tournaments/${tournament.slug || tournament.id}/register`}
                    className="flex-1 text-center py-3.5 rounded-xl bg-[#233dff] hover:brightness-110 text-white font-headline text-sm font-bold shadow-[0_4px_22px_rgba(35,61,255,0.5)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Register for Tournament →</span>
                  </Link>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#050930] border border-[#21274c] text-center">
                  <div className="text-xs font-headline font-bold text-[#8f8fa3]">
                    {tournament.isFull
                      ? "Tournament is Full (Max Participants Reached)"
                      : `Registration Closed (${tournament.status.replace("_", " ")})`}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-[#8f8fa3]">
                <span className="text-[#92ccff]">🛡️</span>
                <span>Anti-Cheat & Competitive Integrity Verification Enforced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAB CONTROLS */}
      <div className="flex items-center gap-2 border-b border-[#21274c] pb-2 overflow-x-auto">
        {[
          { id: "overview" as const, label: "Tournament Overview" },
          { id: "rules" as const, label: "Rules & Guidelines" },
          { id: "schedule" as const, label: "Schedule" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-headline font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#233dff] text-white shadow"
                : "text-[#8f8fa3] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-8">
          <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-4">
            <h2 className="font-headline text-xl font-bold text-white">About This Tournament</h2>
            <p className="text-sm text-[#c5c5da] leading-relaxed max-w-4xl">
              {tournament.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#21274c]/60">
              <div className="p-4 rounded-xl bg-[#21274c]/30">
                <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                  Format
                </div>
                <div className="text-xs text-[#c5c5da]">
                  {tournament.format} ({tournament.bracketType || "Single Elimination"})
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#21274c]/30">
                <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                  Region &amp; Platform
                </div>
                <div className="text-xs text-[#c5c5da]">
                  {tournament.region} • {tournament.platform}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#21274c]/30">
                <div className="text-xs text-[#92ccff] font-semibold uppercase mb-1">
                  Organizer
                </div>
                <div className="text-xs text-[#c5c5da]">
                  {tournament.organizer}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: RULES */}
      {activeTab === "rules" && (
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
          <h2 className="font-headline text-xl font-bold text-white">Official Rules & Conduct</h2>
          {tournament.rules && tournament.rules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#c5c5da]">
              {tournament.rules.map((rule, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#050930] border border-[#21274c] flex items-start gap-3">
                  <span className="font-mono text-[#92ccff] font-bold">#{idx + 1}</span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8796C0]">Official tournament rules are published by the organizer.</p>
          )}
        </section>
      )}

      {/* TAB 3: SCHEDULE */}
      {activeTab === "schedule" && (
        <section className="p-6 sm:p-8 rounded-2xl bg-[#13183d] border border-[#21274c] shadow-lg flex flex-col gap-6">
          <h2 className="font-headline text-xl font-bold text-white">Timeline & Milestones</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c] flex items-center justify-between text-xs">
              <span className="font-mono text-[#92ccff]">Start Date</span>
              <span className="font-bold text-white">{new Date(tournament.startDate).toLocaleString()}</span>
            </div>
            {tournament.endDate && (
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c] flex items-center justify-between text-xs">
                <span className="font-mono text-[#92ccff]">End Date</span>
                <span className="font-bold text-white">{new Date(tournament.endDate).toLocaleString()}</span>
              </div>
            )}
            {tournament.registrationDeadline && (
              <div className="p-4 rounded-xl bg-[#050930] border border-[#21274c] flex items-center justify-between text-xs">
                <span className="font-mono text-[#ff99a8]">Registration Cutoff</span>
                <span className="font-bold text-white">{new Date(tournament.registrationDeadline).toLocaleString()}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TournamentDetailsPage;
