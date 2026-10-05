import React, { useState } from "react";
import { apiRequest } from "../../lib/api";

export const DeveloperSettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Studio Telemetry Toggles
  const [telemetrySettings, setTelemetrySettings] = useState({
    crashDumpsAutoForward: true,
    weeklyReportEmail: true,
    requireTesterNda: true,
    allowAnonymousTelemetry: false,
  });

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordMsg(null);
      const res = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordMsg({ type: "success", text: "Password updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({
          type: "error",
          text: res.error || "Failed to update password. Please check your current credentials.",
        });
      }
    } catch (err: any) {
      setPasswordMsg({
        type: "error",
        text: err.message || "Failed to update password. Please check your current credentials.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#151F52]">
        <h1 className="font-headline text-2xl font-bold text-white tracking-tight">
          Studio &amp; Rig Settings
        </h1>
        <p className="text-xs text-[#8796C0] mt-0.5">
          Configure telemetry pipeline security, notifications, and authenticated studio access credentials.
        </p>
      </div>

      {/* Telemetry Rules */}
      <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-4 shadow-lg">
        <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
          Telemetry &amp; Privacy Policies
        </h2>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#091038] border border-[#182352] cursor-pointer">
            <div>
              <span className="text-xs font-headline font-bold text-white block">Auto-Forward Crash Dumps</span>
              <span className="text-[11px] text-[#8796C0]">Sanitize and forward client stack traces to studio webhook</span>
            </div>
            <input
              type="checkbox"
              checked={telemetrySettings.crashDumpsAutoForward}
              onChange={(e) => setTelemetrySettings({ ...telemetrySettings, crashDumpsAutoForward: e.target.checked })}
              className="rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#091038] border border-[#182352] cursor-pointer">
            <div>
              <span className="text-xs font-headline font-bold text-white block">Mandatory Tester NDA</span>
              <span className="text-[11px] text-[#8796C0]">Require digital NDA signature before distributing build access keys</span>
            </div>
            <input
              type="checkbox"
              checked={telemetrySettings.requireTesterNda}
              onChange={(e) => setTelemetrySettings({ ...telemetrySettings, requireTesterNda: e.target.checked })}
              className="rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#091038] border border-[#182352] cursor-pointer">
            <div>
              <span className="text-xs font-headline font-bold text-white block">Weekly Telemetry Digest</span>
              <span className="text-[11px] text-[#8796C0]">Receive weekly aggregated metrics of bug density and play hours</span>
            </div>
            <input
              type="checkbox"
              checked={telemetrySettings.weeklyReportEmail}
              onChange={(e) => setTelemetrySettings({ ...telemetrySettings, weeklyReportEmail: e.target.checked })}
              className="rounded border-[#233DFF] text-[#233DFF] focus:ring-0"
            />
          </label>
        </div>
      </div>

      {/* Password & Security */}
      <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-4 shadow-lg">
        <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
          Change Password &amp; Studio Security
        </h2>

        {passwordMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              passwordMsg.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border border-red-500/40 text-red-300"
            }`}
          >
            <span>{passwordMsg.type === "success" ? "✓" : "⚠️"}</span>
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
            >
              {savingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
