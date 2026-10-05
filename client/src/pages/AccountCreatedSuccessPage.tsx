import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LocationState {
  email?: string;
  username?: string;
  fullName?: string;
}

export const AccountCreatedSuccessPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as LocationState) || {};
  const email = state.email || "your registered email";
  const username = state.username || "Gamer";

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#020617] text-slate-100 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#233dff]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-[#070D38]/90 border border-[#38bdf8]/20 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_40px_rgba(35,61,255,0.25)] text-center backdrop-blur-xl">
        {/* Animated Badge Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#0B1347] border border-[#38bdf8]/40 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.3)]">
          <span className="text-3xl text-[#38bdf8]">✓</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050A30] border border-[#38bdf8]/30 text-xs font-mono text-[#38bdf8] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
          <span>IDENTITY REGISTERED</span>
        </div>

        <h1 className="font-headline text-2xl sm:text-3xl font-bold uppercase text-white mb-2">
          Account Created Successfully
        </h1>

        <p className="text-sm text-slate-300 font-body leading-relaxed mb-6">
          Welcome to Riyadah Elite, <span className="text-[#38bdf8] font-bold">@{username}</span>! Your competitive profile has been initialized and secured on the platform.
        </p>

        {/* Verification Notice Card */}
        <div className="p-4 rounded-xl bg-[#050A30]/80 border border-[#1A2560] text-left mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5CB6F9] mb-1 font-semibold">
            <span>ℹ</span>
            <span>ACCOUNT STATUS &amp; ACCESS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-body">
            You can now discover playtests and browse tournament brackets with your account. Notification updates will be dispatched to <span className="text-white font-medium">{email}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/games"
            className="px-6 py-3 rounded-xl bg-[#233DFF] hover:bg-[#1B31D6] text-white font-headline text-sm font-semibold shadow-[0_0_20px_rgba(35,61,255,0.5)] transition text-center"
          >
            Explore Game Testing →
          </Link>
          <Link
            to="/tournaments"
            className="px-6 py-3 rounded-xl bg-[#050A30] hover:bg-[#0E1545] border border-[#1A2560] text-slate-200 font-headline text-sm font-semibold transition text-center"
          >
            Browse Tournaments
          </Link>
        </div>
      </div>
    </div>
  );
};
