import React, { useEffect, useState } from "react";
import { apiRequest, HostProfileData } from "../../lib/api";

export const HostProfileSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"PROFILE" | "VERIFICATION" | "SETTINGS">("PROFILE");
  const [profile, setProfile] = useState<HostProfileData>({
    hostName: "",
    organizationName: "",
    contactEmail: "",
    discordHandle: null,
    country: "Saudi Arabia",
    city: "Riyadh",
    bio: "",
    tier: "Community Host",
    isVerified: false,
    telemetryWebhook: null,
    autoCheckIn: true,
    requireAntiCheat: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        setError(null);
        const res = await apiRequest<{ status: string; data: { profile: HostProfileData } }>(
          "/host/profile"
        );
        if (mounted) {
          if (res.ok && res.data.data.profile) {
            setProfile(res.data.data.profile);
          } else if (!res.ok) {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load host profile from server");
        }
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key: "autoCheckIn" | "requireAntiCheat") => {
    setProfile((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      setSaving(true);
      const res = await apiRequest<{ status: string; message: string }>("/host/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "Host profile and settings updated successfully." });
      } else {
        setMsg({ type: "error", text: res.error || "Failed to save host settings." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Failed to save host settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>ORGANIZER CONFIGURATION</span>
            <span>•</span>
            <span>NODE 04 · SAUDI ARABIA</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Host Profile &amp; Settings
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Configure your public tournament host organization credentials, anti-cheat webhook integrations, and verified host tier.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
              : "bg-[#1F122B] border border-red-500/40 text-red-200"
          }`}
        >
          <span>{msg.type === "success" ? "✓" : "⚠️"}</span>
          <span>{msg.text}</span>
        </div>
      )}

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

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#070D38] p-2 rounded-xl border border-[#151F52]">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`px-4 py-2 rounded-lg text-xs font-headline font-bold transition ${
            activeTab === "PROFILE" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
          }`}
        >
          Organization Profile
        </button>
        <button
          onClick={() => setActiveTab("VERIFICATION")}
          className={`px-4 py-2 rounded-lg text-xs font-headline font-bold transition ${
            activeTab === "VERIFICATION" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
          }`}
        >
          Verification &amp; Accreditation
        </button>
        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`px-4 py-2 rounded-lg text-xs font-headline font-bold transition ${
            activeTab === "SETTINGS" ? "bg-[#233DFF] text-white shadow" : "text-[#8796C0] hover:text-white"
          }`}
        >
          Match &amp; Telemetry Settings
        </button>
      </div>

      {/* Content Form */}
      <form onSubmit={handleSubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        {activeTab === "PROFILE" && (
          <div className="space-y-4">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Organizer Identity &amp; Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Host Lead Name *</label>
                <input
                  type="text"
                  name="hostName"
                  value={profile.hostName}
                  onChange={handleProfileChange}
                  required
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Organization / League Title *</label>
                <input
                  type="text"
                  name="organizationName"
                  value={profile.organizationName}
                  onChange={handleProfileChange}
                  required
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={profile.contactEmail}
                  onChange={handleProfileChange}
                  required
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Discord Operations Handle</label>
                <input
                  type="text"
                  name="discordHandle"
                  value={profile.discordHandle || ""}
                  onChange={handleProfileChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Country</label>
                <input
                  type="text"
                  name="country"
                  value={profile.country}
                  onChange={handleProfileChange}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Organization Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio}
                onChange={handleProfileChange}
                className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>
        )}

        {activeTab === "VERIFICATION" && (
          <div className="space-y-4">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Organizer Verification Status
            </h2>

            <div className="p-4 rounded-xl bg-[#091038] border border-[#182352] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="text-xs font-headline font-bold text-white">
                    {profile.tier}
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    {profile.isVerified ? "✓ Accredited Saudi Esports Host Node" : "Pending Administrative Review"}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-[#8796C0] leading-relaxed">
              Tier-1 Hosts are certified to disburse verified escrow prize pools, operate automated 128-tick server lobbies, and host official qualifying tournaments for regional Saudi esports circuits.
            </p>
          </div>
        )}

        {activeTab === "SETTINGS" && (
          <div className="space-y-4">
            <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
              Automated Match &amp; Telemetry Pipeline
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#091038] border border-[#182352] cursor-pointer">
                <div>
                  <span className="text-xs font-headline font-bold text-white block">Auto-Confirm Checked-In Roster</span>
                  <span className="text-[11px] text-[#8796C0]">Automatically assign tournament seed slots to teams upon lobby check-in</span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.autoCheckIn}
                  onChange={() => handleToggle("autoCheckIn")}
                  className="rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#091038] border border-[#182352] cursor-pointer">
                <div>
                  <span className="text-xs font-headline font-bold text-white block">Enforce Anti-Cheat Telemetry</span>
                  <span className="text-[11px] text-[#8796C0]">Require certified Riot Vanguard / Valve Anti-Cheat telemetry validation on all match results</span>
                </div>
                <input
                  type="checkbox"
                  checked={profile.requireAntiCheat}
                  onChange={() => handleToggle("requireAntiCheat")}
                  className="rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Direct Telemetry Webhook URL</label>
              <input
                type="text"
                name="telemetryWebhook"
                value={profile.telemetryWebhook || ""}
                onChange={handleProfileChange}
                placeholder="https://my-league.sa/api/telemetry-hook"
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Host Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};
