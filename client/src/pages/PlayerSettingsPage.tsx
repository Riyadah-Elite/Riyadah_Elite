import React, { useState } from "react";
import { apiRequest } from "../lib/api";

export const PlayerSettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    setPasswordLoading(true);
    const result = await apiRequest("/player/settings/password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    });
    setPasswordLoading(false);

    if (result.ok) {
      setPasswordMessage({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } else {
      setPasswordMessage({ text: result.error, type: "error" });
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1080px] mx-auto w-full space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-[#091038] p-6 rounded-2xl border border-[#182352]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono uppercase tracking-widest text-[#5CB6F9]">
            SECURITY &amp; ACCOUNT ADMINISTRATION
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight">
          PLAYER SETTINGS
        </h1>
        <p className="text-xs text-[#8796C0] mt-1 font-body">
          Configure authentication credentials, notification channels, and session security.
        </p>
      </div>

      {/* SECURITY / PASSWORD UPDATE */}
      <div className="bg-[#091038] border border-[#182352] rounded-2xl p-6">
        <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#5CB6F9] mb-1">
          UPDATE ACCOUNT PASSWORD
        </h2>
        <p className="text-xs text-[#8796C0] mb-5 font-body">
          Ensure your password contains at least 8 characters, with uppercase, lowercase, numbers, and special symbols.
        </p>

        {passwordMessage && (
          <div
            className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2 mb-5 ${
              passwordMessage.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/40 border-red-500/40 text-red-200"
            }`}
          >
            <span>{passwordMessage.type === "success" ? "✓" : "⚠"}</span>
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#050A30] border border-[#1A2560] text-sm text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1B31D6] disabled:opacity-50 text-white font-headline text-xs font-bold uppercase tracking-wider transition shadow-[0_0_15px_rgba(35,61,255,0.4)] cursor-pointer"
          >
            {passwordLoading ? "Updating..." : "Update Password →"}
          </button>
        </form>
      </div>

      {/* NOTIFICATION PREFERENCES - HONEST NOTICE */}
      <div className="bg-[#091038] border border-[#182352] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-[#5CB6F9]">
            DISPATCH PREFERENCES
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
            LOCAL DEMO
          </span>
        </div>
        <p className="text-xs text-[#8796C0] mb-4">
          External email push channels (SMTP/SMS) are currently in sandbox staging. Testing invites and security alerts will be reflected directly on your player dashboard telemetry feed.
        </p>

        <div className="space-y-3 max-w-lg text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#1A2560] flex items-center justify-between">
            <span>Playtest Acceptance Alerts</span>
            <span className="text-emerald-400 font-bold">ACTIVE (IN-APP)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#050A30] border border-[#1A2560] flex items-center justify-between">
            <span>Critical Security Alerts</span>
            <span className="text-emerald-400 font-bold">MANDATORY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
