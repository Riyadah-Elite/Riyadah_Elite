import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import logoImg from "../../assets/logos/re_logo.png";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const result = await apiRequest<{
      status: string;
      message: string;
      data?: { devResetUrl?: string };
    }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: emailTrimmed }),
    });
    setLoading(false);

    if (!result.ok) {
      setErrorMessage(result.error);
      return;
    }

    setSubmitted(true);
    if (result.data.data?.devResetUrl) {
      setDevResetUrl(result.data.data.devResetUrl);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#03061A] text-[#F7FBFF] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[#233DFF]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full">
        {/* Glow wrapper */}
        <div className="relative bg-[#0B113B]/95 backdrop-blur-xl border border-[#1A2460] rounded-2xl p-7 sm:p-9 shadow-2xl">
          {/* Tactical HUD Corner Accents */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-[#5CB6F9]/40 rounded-tl pointer-events-none"></div>
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-[#5CB6F9]/40 rounded-tr pointer-events-none"></div>
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-[#5CB6F9]/40 rounded-bl pointer-events-none"></div>
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-[#5CB6F9]/40 rounded-br pointer-events-none"></div>

          {/* Logo & Category Emblem */}
          <div className="text-center mb-6">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0E1545] border border-[#5CB6F9]/40 p-2 flex items-center justify-center shadow-lg shadow-[#233DFF]/20">
                <img src={logoImg} alt="Riyadah Elite" className="w-full h-full object-contain drop-shadow" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A30] border border-[#1A2460] text-[#5CB6F9] text-[11px] font-mono uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              <span>ACCOUNT RECOVERY</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-white tracking-tight uppercase">
              {submitted ? "CHECK YOUR EMAIL" : "FORGOT YOUR PASSWORD?"}
            </h1>
            <p className="mt-2 text-xs text-[#CAE8FF]/75 leading-relaxed max-w-sm mx-auto font-body">
              {submitted
                ? "Click the link in the message to choose a new password. If you don't see it, check your spam folder."
                : "Enter the email address associated with your Riyadah Elite account and we'll send you a link to reset your password."}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200">
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold">⚠</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4">
              {/* Anti-enumeration Neutral Confirmation */}
              <div className="p-4 rounded-xl bg-[#050A30] border border-[#1A2460] text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
                  <span>✓</span>
                  <span>RECOVERY DISPATCHED</span>
                </div>
                <p className="text-xs text-[#CAE8FF]/90 font-body leading-relaxed">
                  If an account exists for <span className="text-white font-mono font-medium">{email}</span>, password reset instructions have been generated.
                </p>
              </div>

              {/* Honest Email Status / Development Link */}
              {devResetUrl && (
                <div className="p-3.5 rounded-xl bg-[#070D38] border border-amber-500/40 text-left text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                    <span>⚡</span>
                    <span>DEV ENVIRONMENT RESET LINK (No SMTP configured)</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 mb-2 font-sans">
                    Email provider is unconfigured in development. Use this direct reset authorization link:
                  </p>
                  <Link
                    to={devResetUrl}
                    className="text-[#5CB6F9] hover:underline break-all block p-2 rounded bg-[#03061A] border border-[#1A2460]"
                  >
                    {window.location.origin}{devResetUrl}
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:from-blue-600 hover:to-[#5CB6F9] text-white font-headline text-sm font-bold tracking-wider uppercase transition shadow-[0_0_25px_rgba(35,61,255,0.5)]"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="recovery-email" className="block text-xs font-mono font-semibold text-[#98A8D4] uppercase mb-1.5">
                  EMAIL ADDRESS <span className="text-[#5CB6F9]">*</span>
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 rounded-xl bg-[#090F3B] border border-[#1A2560] text-sm text-white placeholder-[#4E5D88] focus:outline-none focus:border-[#5CB6F9] focus:ring-1 focus:ring-[#5CB6F9] transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#050A30] border border-[#1A2460] text-left">
                <p className="text-[11px] text-[#CAE8FF]/70 leading-relaxed font-body">
                  For account security, password reset links expire in 15 minutes and can only be used once.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#233DFF] to-[#5CB6F9] hover:from-blue-600 hover:to-[#5CB6F9] disabled:opacity-50 text-white font-headline font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(35,61,255,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>GENERATING LINK...</span>
                  </>
                ) : (
                  <span>SEND RESET LINK →</span>
                )}
              </button>

              <div className="text-center pt-3 border-t border-[#1A2460]/60">
                <Link to="/login" className="text-xs text-[#5CB6F9] hover:text-white transition font-mono">
                  ← Remember your password? Log In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
