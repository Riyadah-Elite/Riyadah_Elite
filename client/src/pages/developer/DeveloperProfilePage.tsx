import React, { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export const DeveloperProfilePage: React.FC = () => {
  const [profile, setProfile] = useState({
    studioName: "CyberNova Studios",
    contactEmail: "developer@riyadahelite.com",
    website: "https://cybernovagames.com",
    country: "Saudi Arabia",
    city: "Riyadh",
    bio: "Pioneering competitive multiplayer shooters and tactical action games for the MENA region and global esports circuits.",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const res = await apiRequest<{ status: string; data: any }>("/developer/profile");
        if (mounted && res.ok && res.data.data) {
          setProfile((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (err: any) {
        // Fallback to local profile session
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMsg(null);
      const res = await apiRequest("/developer/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setMsg({ type: "success", text: "Studio profile updated successfully." });
      } else {
        setMsg({
          type: "error",
          text: res.error || "Failed to update studio profile.",
        });
      }
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.message || "Failed to update studio profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#151F52]">
        <h1 className="font-headline text-2xl font-bold text-white tracking-tight">
          Developer Studio Profile
        </h1>
        <p className="text-xs text-[#8796C0] mt-0.5">
          Manage public studio credentials, contact points, and verified headquarters location.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
              : "bg-[#1F122B] border border-amber-500/40 text-amber-200"
          }`}
        >
          <span>{msg.type === "success" ? "✅" : "ℹ️"}</span>
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Studio Name</label>
            <input
              type="text"
              value={profile.studioName}
              onChange={(e) => setProfile({ ...profile, studioName: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Primary Contact Email</label>
            <input
              type="email"
              value={profile.contactEmail}
              onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Official Website</label>
            <input
              type="url"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Headquarters City / Country</label>
            <input
              type="text"
              value={`${profile.city}, ${profile.country}`}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Studio Bio</label>
          <textarea
            rows={4}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
          />
        </div>

        <div className="pt-4 border-t border-[#151F52] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Studio Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};
