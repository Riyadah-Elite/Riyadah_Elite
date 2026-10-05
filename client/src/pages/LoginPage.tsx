import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, AuthSuccessResponse } from "../lib/api";
import logoImg from "../../assets/logos/re_logo.png";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    const result = await apiRequest<AuthSuccessResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    // Save token and navigate
    if (result.data.data?.token) {
      localStorage.setItem("riyadah_auth_token", result.data.data.token);
    }

    navigate("/games");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#040826] text-[#dfe0ff]">
      {/* LEFT SIDE: BRAND & ECOSYSTEM SHOWCASE (DESKTOP) */}
      <div className="relative lg:w-[48%] xl:w-[50%] bg-[#060C33] border-b lg:border-b-0 lg:border-r border-[#151F52] flex flex-col justify-between p-6 sm:p-8 lg:p-12 xl:p-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#233dff]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#5cb6f9]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0F174A] border border-[#23337A] p-1 flex items-center justify-center shadow-lg group-hover:border-[#5cb6f9] transition-all duration-300">
              <img src={logoImg} alt="Riyadah Elite" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-wider text-white">RIYADAH ELITE</span>
                <span className="w-2 h-2 rounded-full bg-[#5cb6f9] animate-ping"></span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-[#7C8CB8] uppercase">
                Competitive Esports &amp; Playtesting
              </p>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1645]/80 border border-[#1E2B6D] text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEMS NOMINAL</span>
          </div>
        </div>

        {/* Center Hologram Hub Showcase */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#091038]/80 border border-[#1A2560] shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5cb6f9]">Active Platform Pulse</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
                KSA / GCC
              </span>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#050A30] border border-[#182352] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#233dff]/20 text-[#5cb6f9] flex items-center justify-center text-sm font-bold">
                    GT
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Game Testing Lab</p>
                    <p className="text-[11px] font-mono text-[#8796C0]">Verified Bug Telemetry</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#5cb6f9] font-bold">ONLINE</span>
              </div>

              <div className="p-3 rounded-xl bg-[#050A30] border border-[#182352] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                    TC
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Esports Brackets</p>
                    <p className="text-[11px] font-mono text-[#8796C0]">Fair Match Coordination</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ethos Anchor */}
        <div className="relative z-10 pt-6 border-t border-[#152157]">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">PLAY. TEST. COMPETE.</h3>
          <p className="text-xs text-[#7F8FB8] mt-1 max-w-sm">
            The unified ecosystem for elite gamers, visionary game studios, and esports tournament organizers.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="relative lg:w-[52%] xl:w-[50%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-[#040826]">
        {/* Back Link */}
        <div className="flex justify-end mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#7888B8] hover:text-[#5cb6f9] transition-colors py-1 px-3 rounded-lg hover:bg-[#0D1540]"
          >
            <span>← Back to platform</span>
          </Link>
        </div>

        <div className="w-full max-w-[440px] mx-auto my-auto py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D174A] border border-[#1E2B6D] text-[11px] font-mono text-[#5cb6f9] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5cb6f9] animate-pulse"></span>
            <span>SECURE ACCESS PORTAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-headline">Welcome Back</h1>
          <p className="text-sm text-[#8796C0] mb-7 leading-relaxed font-body">
            Enter your credentials to access your tournaments, teams, and test lab.
          </p>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-xs text-red-200">
              <span className="text-red-400 font-bold">⚠</span>
              <div>
                <p className="font-semibold text-red-300">Authentication Failed</p>
                <p className="text-red-300/80 text-[11px] mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-mono font-semibold tracking-wider text-[#98A8D4] uppercase mb-2">
                EMAIL ADDRESS
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-12 px-4 rounded-xl bg-[#090F3B] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5cb6f9] focus:ring-1 focus:ring-[#5cb6f9] transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="text-xs font-mono font-semibold tracking-wider text-[#98A8D4] uppercase">
                  PASSWORD
                </label>
                <Link to="/forgot-password" className="text-xs text-[#5cb6f9] hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-4 pr-11 rounded-xl bg-[#090F3B] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5cb6f9] focus:ring-1 focus:ring-[#5cb6f9] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5C6E9E] hover:text-[#5cb6f9] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="text-xs font-mono">{showPassword ? "HIDE" : "SHOW"}</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#233dff] hover:bg-[#1B31D6] disabled:opacity-50 text-white font-headline font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(35,61,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Riyadah Elite →</span>
              )}
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-8 text-center text-xs text-[#8796C0]">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-[#5cb6f9] font-semibold hover:text-white transition-colors">
              Create an account
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#121945] text-center text-[11px] text-[#55638E] font-mono">
          Riyadah Elite Protected Access • TLS 1.3 End-to-End
        </div>
      </div>
    </div>
  );
};
