import React, { useEffect, useState } from "react";
import { apiRequest, PlayerProfileData, UserProfile } from "../lib/api";

export const PlayerProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("Riyadh");
  const [primaryPlatform, setPrimaryPlatform] = useState("PC Windows");
  const [hardwareGpu, setHardwareGpu] = useState("");
  const [hardwareCpu, setHardwareCpu] = useState("");
  const [hardwareRam, setHardwareRam] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    const result = await apiRequest<{
      status: string;
      data: { user: UserProfile; profile: PlayerProfileData | null };
    }>("/player/profile");
    setLoading(false);

    if (result.ok) {
      setUser(result.data.data.user);
      const prof = result.data.data.profile;
      setProfile(prof);

      setFullName(result.data.data.user.fullName || "");
      if (prof) {
        setBio(prof.bio || "");
        setCity(prof.city || "Riyadh");
        setPrimaryPlatform(prof.primaryPlatform || "PC Windows");
        setHardwareGpu(prof.hardwareGpu || "");
        setHardwareCpu(prof.hardwareCpu || "");
        setHardwareRam(prof.hardwareRam || "");
        setDiscordHandle(prof.discordHandle || "");
      }
    } else {
      setMessage({ text: result.error, type: "error" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const result = await apiRequest("/player/profile", {
      method: "PUT",
      body: JSON.stringify({
        fullName,
        bio,
        city,
        primaryPlatform,
        hardwareGpu,
        hardwareCpu,
        hardwareRam,
        discordHandle,
      }),
    });
    setSaving(false);

    if (result.ok) {
      setMessage({ text: "Profile updated successfully!", type: "success" });
      fetchProfile();
    } else {
      setMessage({ text: result.error, type: "error" });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1080px] mx-auto w-full space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-[#091038] p-6 rounded-2xl border border-[#182352]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#5CB6F9]">
            PLAYER IDENTITY &amp; TELEMETRY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight">
          PLAYER PROFILE
        </h1>
        <p className="text-xs text-[#8796C0] mt-1 font-body">
          Manage your verified gamer handle, platform benchmarks, and hardware specifications.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/40 border-red-500/40 text-red-200"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {loading && !user ? (
        <div className="h-64 rounded-2xl bg-[#091038] border border-[#182352] animate-pulse"></div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IDENTIFIER SUMMARY */}
          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-6">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#5CB6F9] mb-4">
              1. ACCOUNT CREDENTIALS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#1A2560]">
                <span className="text-[10px] font-mono text-[#8796C0] uppercase block mb-1">Username / Handle</span>
                <span className="text-sm font-mono font-bold text-white">@{user?.username}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#1A2560]">
                <span className="text-[10px] font-mono text-[#8796C0] uppercase block mb-1">Email Address</span>
                <span className="text-sm font-mono font-bold text-white">{user?.email}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#1A2560]">
                <span className="text-[10px] font-mono text-[#8796C0] uppercase block mb-1">Tester Score</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {profile?.testerScore || 0} / 100
                </span>
              </div>
            </div>
          </div>

          {/* BASIC INFORMATION */}
          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#5CB6F9] mb-2">
              2. PUBLIC IDENTITY
            </h2>

            <div>
              <label htmlFor="fullName" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Riyadh, Jeddah, Dammam"
                  className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label htmlFor="primaryPlatform" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                  Primary Gaming Platform
                </label>
                <select
                  id="primaryPlatform"
                  value={primaryPlatform}
                  onChange={(e) => setPrimaryPlatform(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                >
                  <option value="PC Windows">PC Windows</option>
                  <option value="PlayStation 5">PlayStation 5</option>
                  <option value="Xbox Series X/S">Xbox Series X/S</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                  <option value="Mobile">Mobile (iOS / Android)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                Player Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your competitive background, favorite playstyles, or bug hunting interests..."
                className="w-full p-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>

          {/* HARDWARE SPECIFICATIONS */}
          <div className="bg-[#091038] border border-[#182352] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#5CB6F9] mb-2">
              3. HARDWARE &amp; BENCHMARK RIG
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="gpu" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                  Graphics Card (GPU)
                </label>
                <input
                  id="gpu"
                  type="text"
                  value={hardwareGpu}
                  onChange={(e) => setHardwareGpu(e.target.value)}
                  placeholder="e.g. RTX 4070 Ti, RX 7800 XT"
                  className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label htmlFor="cpu" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                  Processor (CPU)
                </label>
                <input
                  id="cpu"
                  type="text"
                  value={hardwareCpu}
                  onChange={(e) => setHardwareCpu(e.target.value)}
                  placeholder="e.g. Ryzen 7 7800X3D, i7-13700K"
                  className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label htmlFor="ram" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                  System RAM
                </label>
                <input
                  id="ram"
                  type="text"
                  value={hardwareRam}
                  onChange={(e) => setHardwareRam(e.target.value)}
                  placeholder="e.g. 32GB DDR5"
                  className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="discord" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
                Discord Handle
              </label>
              <input
                id="discord"
                type="text"
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
                placeholder="e.g. gamer#0001"
                className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:from-blue-600 hover:to-[#5CB6F9] disabled:opacity-50 text-white font-headline text-sm font-bold uppercase tracking-wider transition shadow-[0_0_20px_rgba(35,61,255,0.4)] cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Profile →"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
