import React from "react";
import { Link } from "react-router-dom";

export const PasswordChangedSuccessPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#03071e] text-[#F7FBFF] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#233dff]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl bg-[#0a0f35]/90 border border-[#1f2756] shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_40px_rgba(35,61,255,0.25)] text-center backdrop-blur-xl">
        {/* Animated Check Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#13183d] border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)]">
          <span className="text-3xl text-[#38bdf8]">✓</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050a30] border border-[#38bdf8]/30 text-xs font-mono text-[#38bdf8] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
          <span>SECURITY UPDATED</span>
        </div>

        <h1 className="font-headline text-2xl font-bold uppercase text-white mb-2">
          Password Changed Successfully
        </h1>

        <p className="text-sm text-slate-300 font-body leading-relaxed mb-6">
          Your credentials have been securely updated. You can now use your new password to access your Riyadah Elite account.
        </p>

        <Link
          to="/login"
          className="block w-full py-3.5 rounded-xl bg-[#233dff] hover:bg-[#1B31D6] text-white font-headline text-sm font-semibold shadow-[0_0_20px_rgba(35,61,255,0.5)] transition text-center"
        >
          Proceed to Sign In →
        </Link>
      </div>
    </div>
  );
};
