import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest, TournamentItem } from "../../lib/api";

export const HostTournamentManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    game: "Valorant",
    platform: "PC Windows",
    format: "5v5 Single Elimination",
    bracketType: "SINGLE_ELIMINATION",
    maxParticipants: 32,
    teamSize: 5,
    entryFee: "Free",
    prizePool: "5,000 SAR",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    description: "",
    rulesText: "Standard Riot Ruleset, Anti-Cheat Required, No Toxicity.",
    status: "REGISTRATION_OPEN" as TournamentItem["status"],
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (isEditMode && id) {
      async function loadTournament() {
        try {
          setLoading(true);
          setError(null);
          const res = await apiRequest<{ status: string; data: { tournament: TournamentItem } }>(
            `/host/tournaments/${id}`
          );
          if (mounted) {
            if (res.ok) {
              const t = res.data.data.tournament;
              setFormData({
                title: t.title,
                game: t.game,
                platform: t.platform,
                format: t.format,
                bracketType: t.bracketType || "SINGLE_ELIMINATION",
                maxParticipants: t.maxParticipants,
                teamSize: t.teamSize,
                entryFee: t.entryFee || "Free",
                prizePool: t.prizePool || "",
                startDate: t.startDate ? t.startDate.slice(0, 16) : "",
                endDate: t.endDate ? t.endDate.slice(0, 16) : "",
                registrationDeadline: t.registrationDeadline ? t.registrationDeadline.slice(0, 16) : "",
                description: t.description,
                rulesText: t.rules?.join("\n") || "",
                status: t.status,
              });
            } else {
              setError(res.error);
            }
          }
        } catch (err: any) {
          if (mounted) {
            setError(err.message || "Failed to load tournament data for editing");
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
      loadTournament();
    }
    return () => {
      mounted = false;
    };
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxParticipants" || name === "teamSize" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.title.trim()) {
      setError("Please provide a tournament title.");
      return;
    }
    if (!formData.startDate) {
      setError("Please set a tournament start date.");
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = isEditMode ? `/host/tournaments/${id}` : "/host/tournaments";
      const method = isEditMode ? "PUT" : "POST";

      const payload = {
        ...formData,
        rules: formData.rulesText.split("\n").filter((r) => r.trim().length > 0),
      };

      const res = await apiRequest<{ status: string; data: { tournament: TournamentItem } }>(
        endpoint,
        {
          method,
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setSuccessMsg(
          isEditMode
            ? "Tournament configuration saved successfully."
            : "Tournament published! Redirecting to tournament catalog..."
        );
        setTimeout(() => {
          navigate("/host/tournaments");
        }, 1200);
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || "Submission failed. Please check form parameters.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#8796C0] bg-[#070D38] rounded-2xl border border-[#151F52] max-w-4xl mx-auto">
        Loading tournament editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <Link to="/host/tournaments" className="hover:underline">
              MY TOURNAMENTS
            </Link>
            <span>•</span>
            <span>{isEditMode ? "EDIT MODE" : "CREATION PIPELINE"}</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            {isEditMode ? "Tournament Management & Configuration" : "Create New Tournament"}
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Configure bracket mechanics, registration windows, certified anti-cheat prerequisites, and prize pools.
          </p>
        </div>

        <Link
          to="/host/tournaments"
          className="px-3.5 py-2 rounded-xl bg-[#091038] border border-[#182352] text-[#8796C0] hover:text-white text-xs font-headline font-bold transition self-start md:self-auto"
        >
          Cancel &amp; Back
        </Link>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 font-mono text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        {/* Section 1: Core Metadata */}
        <div className="space-y-4">
          <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
            1. Competition Identity &amp; Game Title
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Tournament Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Riyadah Community Valorant Cup"
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Esports Game Title *</label>
              <select
                name="game"
                value={formData.game}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              >
                <option value="Valorant">Valorant</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Rocket League">Rocket League</option>
                <option value="Apex Legends">Apex Legends</option>
                <option value="Overwatch 2">Overwatch 2</option>
                <option value="Tekken 8">Tekken 8</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Target Platform</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Format Structure</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              >
                <option value="5v5 Single Elimination">5v5 Single Elimination</option>
                <option value="5v5 Double Elimination">5v5 Double Elimination</option>
                <option value="3v3 Round Robin">3v3 Round Robin</option>
                <option value="1v1 Swiss Bracket">1v1 Swiss Bracket</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Bracket Engine</label>
              <select
                name="bracketType"
                value={formData.bracketType}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              >
                <option value="SINGLE_ELIMINATION">Single Elimination</option>
                <option value="DOUBLE_ELIMINATION">Double Elimination</option>
                <option value="ROUND_ROBIN">Round Robin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Description &amp; Overview</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe competitive stakes, stage schedules, and stream broadcast details..."
              className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>
        </div>

        {/* Section 2: Capacity, Dates & Schedule */}
        <div className="space-y-4">
          <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
            2. Schedule, Capacity &amp; Prize Pool
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Max Participants / Teams</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min={4}
                max={512}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Team Roster Size</label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min={1}
                max={10}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Prize Pool (Explicit SAR) *</label>
              <input
                type="text"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                placeholder="e.g. 10,000 SAR"
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Lifecycle Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              >
                <option value="DRAFT">Draft</option>
                <option value="REGISTRATION_OPEN">Registration Open</option>
                <option value="REGISTRATION_CLOSED">Registration Closed</option>
                <option value="ONGOING">Live Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Tournament Start Time *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Registration Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Rules & Fair Play */}
        <div className="space-y-4">
          <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
            3. Fair Play, Anti-Cheat &amp; Rules
          </h2>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Tournament Rules (One per line)</label>
            <textarea
              name="rulesText"
              rows={4}
              value={formData.rulesText}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#091038] border border-[#182352] text-[11px] text-[#8796C0] leading-relaxed">
            <span className="text-[#5CB6F9] font-bold block mb-1">Riyadah Anti-Gambling Guarantee</span>
            Prize disbursements are strictly host-funded bounties for certified competitive performance. Zero wagering, player buy-in entry cuts, or gambling mechanics are tolerated on the platform.
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
          >
            {submitting ? "Saving Tournament..." : isEditMode ? "Save Changes" : "Publish Tournament"}
          </button>
        </div>
      </form>
    </div>
  );
};
