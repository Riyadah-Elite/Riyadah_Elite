import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("No reset authorization token provided. Please request a new link.");
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setErrorMessage("Please fulfill all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    setLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    navigate("/password-changed-success");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#03061A] text-[#F7FBFF] relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#233DFF]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-[#0B113B]/90 border border-[#1A2460] shadow-2xl backdrop-blur-xl">
        <div className="w-14 h-14 rounded-2xl bg-[#0E1545] border border-[#5CB6F9]/30 flex items-center justify-center text-[#5CB6F9] mx-auto mb-6 text-2xl font-bold">
          🔒
        </div>

        <div className="text-center mb-6">
          <span className="text-[10px] font-mono tracking-widest text-[#5CB6F9] uppercase font-bold block mb-1">
            CREDENTIAL RESET
          </span>
          <h1 className="font-headline text-2xl font-bold uppercase text-white mb-2">Create New Password</h1>
          <p className="font-body text-xs text-[#8796C0] leading-relaxed">
            Choose a strong new password for your Riyadah Elite account.
          </p>
        </div>

        {!token && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
            <p className="font-bold mb-1">Missing Reset Token</p>
            <p>Please use the reset link sent to your email or request a new one below.</p>
            <Link to="/forgot-password" className="text-[#5CB6F9] underline block mt-2 font-mono">
              Request New Link →
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="new-password" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase">
                NEW PASSWORD
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full h-11 px-4 rounded-xl bg-[#090F3B] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5CB6F9]"
            />

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-2 text-[11px] font-mono">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-slate-500"}`}>
                <span>{hasMinLength ? "✓" : "○"}</span>
                <span>Min 8 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-400" : "text-slate-500"}`}>
                <span>{hasUpper ? "✓" : "○"}</span>
                <span>Uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-400" : "text-slate-500"}`}>
                <span>{hasLower ? "✓" : "○"}</span>
                <span>Lowercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                <span>{hasNumber ? "✓" : "○"}</span>
                <span>At least one number</span>
              </div>
              <div className={`flex items-center gap-1.5 col-span-2 ${hasSpecial ? "text-emerald-400" : "text-slate-500"}`}>
                <span>{hasSpecial ? "✓" : "○"}</span>
                <span>Special character (!@#$%^&amp;*)</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1">
              CONFIRM NEW PASSWORD
            </label>
            <input
              id="confirm-new-password"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full h-11 px-4 rounded-xl bg-[#090F3B] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5CB6F9]"
            />
            {confirmPassword.length > 0 && (
              <p className={`text-[11px] font-mono mt-1 ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:from-blue-600 hover:to-[#5CB6F9] disabled:opacity-50 text-white font-headline font-bold text-sm tracking-wider uppercase transition shadow-[0_0_25px_rgba(35,61,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>UPDATING CREDENTIALS...</span>
              </>
            ) : (
              <span>RESET PASSWORD →</span>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#1A2460]/60 mt-5">
          <Link to="/login" className="text-xs text-[#5CB6F9] hover:text-white transition font-mono">
            ← Remember your password? Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
