import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, AuthSuccessResponse } from "../lib/api";
import logoImg from "../../assets/logos/re_logo.png";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live password checklist checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setErrorMessage("Please fulfill all password requirements before continuing.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await apiRequest<AuthSuccessResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      }),
    });
    setLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    if (result.data.data?.token) {
      localStorage.setItem("riyadah_auth_token", result.data.data.token);
    }

    navigate("/account-created-success", { state: { email, username, fullName } });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#040718] text-slate-100">
      {/* LEFT SIDE: BRAND SHOWCASE */}
      <div className="relative lg:w-[48%] xl:w-[50%] bg-[#070c26] border-b lg:border-b-0 lg:border-r border-[#142057] flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#233DFF]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F174A] border border-[#23337A] p-1 flex items-center justify-center shadow-lg group-hover:border-[#5CB6F9] transition-all">
              <img src={logoImg} alt="Riyadah Elite" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-wider text-white">RIYADAH ELITE</span>
                <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-ping"></span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#7C8CB8] uppercase">
                Player Registration Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Telemetry Cards from Stitch Signup Design */}
        <div className="relative z-10 my-8 lg:my-auto max-w-lg mx-auto w-full space-y-3">
          <div className="bg-[#091036]/75 border border-[#142057] rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-[#5CB6F9] text-xs font-bold font-mono">
                LAB
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Targeted Game Playtests</p>
                <p className="text-[11px] font-mono text-slate-400">Direct studio bounty feedback</p>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 uppercase font-semibold">
              VERIFIED
            </span>
          </div>

          <div className="bg-[#091036]/75 border border-[#142057] rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                SAR
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Esports Tournaments</p>
                <p className="text-[11px] font-mono text-slate-400">Fair brackets &amp; official prize pools</p>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/40 text-[#5CB6F9] uppercase font-semibold">
              COMPETITIVE
            </span>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#142057]">
          <p className="font-headline font-bold text-sm tracking-wider text-slate-200 uppercase">PLAY. TEST. COMPETE.</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Join the premier competitive gaming platform for Saudi Arabia &amp; the GCC.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="relative lg:w-[52%] xl:w-[50%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#040718]">
        <div className="flex justify-end mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <span>← Back to platform</span>
          </Link>
        </div>

        <div className="w-full max-w-xl mx-auto my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1746] border border-[#5CB6F9]/30 text-xs font-mono tracking-wider text-[#CAE8FF] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5CB6F9] animate-ping"></span>
            <span className="uppercase">PLAYER REGISTRATION</span>
          </div>

          <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Create Your Riyadah Elite Account
          </h1>
          <p className="text-sm text-slate-400 mt-2 mb-6 leading-relaxed">
            Join gamers, discover upcoming titles, test early builds, and compete in tournaments.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-xs text-red-200">
              <span className="text-red-400 font-bold">⚠</span>
              <p className="font-medium text-red-300">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="signup-fullname" className="block font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-1">
                FULL NAME
              </label>
              <input
                id="signup-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tariq Al-Ghamdi"
                className="w-full bg-[#080e2b] border border-[#142057] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5CB6F9] transition"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="signup-username" className="block font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-1">
                USERNAME (GAMERTAG)
              </label>
              <input
                id="signup-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ApexGamer_KSA"
                className="w-full bg-[#080e2b] border border-[#142057] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5CB6F9] transition"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="signup-email" className="block font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-1">
                EMAIL ADDRESS
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gamer@riyadahelite.com"
                className="w-full bg-[#080e2b] border border-[#142057] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5CB6F9] transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="signup-password" className="block font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                  PASSWORD
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
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
                className="w-full bg-[#080e2b] border border-[#142057] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5CB6F9] transition"
              />

              {/* Dynamic Requirements Checklist */}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirmpassword" className="block font-mono text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-1">
                CONFIRM PASSWORD
              </label>
              <input
                id="signup-confirmpassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-[#080e2b] border border-[#142057] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5CB6F9] transition"
              />
              {confirmPassword.length > 0 && (
                <p className={`text-[11px] font-mono mt-1 ${passwordsMatch ? "text-emerald-400" : "text-red-400"}`}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-12 rounded-xl bg-[#233DFF] hover:bg-[#1c31d9] disabled:opacity-50 text-white font-headline font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(35,61,255,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Complete Registration →</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#5CB6F9] font-semibold hover:text-white transition">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
