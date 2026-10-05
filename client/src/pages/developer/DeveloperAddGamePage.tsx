import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

export const DeveloperAddGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    studio: "",
    genre: "Action RPG",
    platform: "PC (Windows)",
    stage: "Closed Alpha",
    version: "v0.1.0",
    description: "",
    focusAreas: "Combat Balance, Network Latency, UI Usability",
    requirements: "DirectX 12, 16GB RAM, Dedicated GPU",
    capacity: 100,
    rewardText: "Certified Testing Badge + Exclusive In-Game Title",
    buildDownloadUrl: "",
    agreedIpTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please provide a valid game title");
      return;
    }
    if (!formData.agreedIpTerms) {
      setError("You must verify IP rights and agree to the Developer Distribution Terms");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      // Attempt backend submission
      await apiRequest("/developer/games", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          focusAreas: formData.focusAreas.split(",").map((s) => s.trim()),
          requirements: formData.requirements.split(",").map((s) => s.trim()),
        }),
      });
      setSuccess(true);
      setTimeout(() => navigate("/developer/games"), 2000);
    } catch (err: any) {
      // Truthful error handling
      setError(
        err.message ||
          "Backend submission endpoint is in preparation (Phase 3B). Form inputs are validated and saved in session."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#7F8FB8] uppercase tracking-wider">
          <Link to="/developer/dashboard" className="hover:text-[#5CB6F9]">
            DEVELOPER PORTAL
          </Link>
          <span>/</span>
          <Link to="/developer/games" className="hover:text-[#5CB6F9]">
            MY GAMES
          </Link>
          <span>/</span>
          <span className="text-white">ADD / SUBMIT GAME</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-headline text-2xl font-bold text-white">Add / Submit Game</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30">
            DRAFT PIPELINE
          </span>
        </div>
        <p className="text-xs text-[#8796C0]">
          Submit your game build, configure rigorous telemetry tasks, declare IP rights, and deploy escrow-backed player testing campaigns across the Riyadah verification network.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 gap-3 bg-[#070D38] p-3 rounded-2xl border border-[#151F52]">
        {[
          { num: 1, title: "Game Details", sub: "Metadata & Genre" },
          { num: 2, title: "Build & Telemetry", sub: "Requirements & Testing" },
          { num: 3, title: "IP & Review", sub: "Verification & Submit" },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-3 p-3 rounded-xl transition text-left ${
              step === s.num
                ? "bg-[#233DFF] text-white shadow-lg"
                : "text-[#8796C0] hover:bg-[#091038]"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                step === s.num ? "bg-white text-[#233DFF]" : "bg-[#13183D] text-[#8796C0]"
              }`}
            >
              {s.num}
            </div>
            <div>
              <div className="text-xs font-headline font-bold leading-none">{s.title}</div>
              <div className="text-[10px] opacity-80 mt-1">{s.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Feedback Messages */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <span className="text-lg">✅</span>
          <span>Game successfully registered! Redirecting to fleet catalog...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Multi-Step Submission Form */}
      <form onSubmit={handleSubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Step 1: Game Identification &amp; Genre
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Game Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. CyberStrike: Sands of Riyadh"
                  required
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Studio / Developer Name</label>
                <input
                  type="text"
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                  placeholder="e.g. CyberNova Interactive"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Genre</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                >
                  <option value="Action RPG">Action RPG</option>
                  <option value="Tactical Shooter">Tactical Shooter</option>
                  <option value="Battle Royale">Battle Royale</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Sports / Racing">Sports / Racing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Target Platform</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                >
                  <option value="PC (Windows)">PC (Windows)</option>
                  <option value="PlayStation 5">PlayStation 5</option>
                  <option value="Xbox Series X/S">Xbox Series X/S</option>
                  <option value="Mobile (iOS/Android)">Mobile (iOS/Android)</option>
                  <option value="Cross-Platform">Cross-Platform</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Game Overview / Synopsis</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your gameplay loop, technical testing objectives, and story background..."
                className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Step 2: Build Specification &amp; Testing Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Testing Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                >
                  <option value="Closed Alpha">Closed Alpha</option>
                  <option value="Technical Beta">Technical Beta</option>
                  <option value="Stress Test">Stress Test</option>
                  <option value="Pre-Release QA">Pre-Release QA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Build Version</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="e.g. 0.4.1-rc"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Tester Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={10}
                  max={5000}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Telemetry &amp; Focus Areas (comma separated)</label>
              <input
                type="text"
                name="focusAreas"
                value={formData.focusAreas}
                onChange={handleChange}
                placeholder="e.g. Frame Rate Drops, Matchmaking Latency, Weapon Recoil"
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Hardware / System Requirements</label>
              <input
                type="text"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g. 16GB RAM, RTX 3060 or higher, 50GB SSD space"
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Direct Build / Repository URL</label>
              <input
                type="text"
                name="buildDownloadUrl"
                value={formData.buildDownloadUrl}
                onChange={handleChange}
                placeholder="https://builds.mystudio.com/alpha-v0.1.zip (or Steam Playtest Key ID)"
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
              <span className="text-[10px] text-[#7F8FB8] block mt-1">
                Note: File upload storage is not configured locally. Provide secure distribution URL or Steam beta keys.
              </span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Step 3: Intellectual Property &amp; Developer Agreement
            </h2>

            <div className="p-4 rounded-xl bg-[#091038] border border-[#182352] space-y-3">
              <h3 className="text-xs font-headline font-bold text-[#5CB6F9]">Riyadah Elite IP &amp; Quality Guarantee</h3>
              <p className="text-[11px] text-[#8796C0] leading-relaxed">
                By submitting this game, you affirm that you own or possess the legitimate rights to license, distribute, and conduct playtesting for this software. Riyadah Elite operates zero-fake-data policies and provides escrow-guaranteed testing feedback. No gambling or wagering mechanisms may be integrated into playtesting rewards.
              </p>
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedIpTerms"
                  checked={formData.agreedIpTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
                />
                <span className="text-xs text-white">
                  I confirm that all game assets and code belong to my studio and I agree to the{" "}
                  <Link to="/game-rights-ownership" className="text-[#5CB6F9] underline" target="_blank">
                    Game Rights &amp; Ownership Terms
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Bottom Form Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#151F52]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-[#091038] hover:bg-[#13183D] text-[#8796C0] text-xs font-headline transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Game to Fleet"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
