import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface AuthPlaceholderPageProps {
  mode?: "login" | "signup";
}

export const AuthPlaceholderPage: React.FC<AuthPlaceholderPageProps> = ({ mode }) => {
  const location = useLocation();
  const isLogin = mode ? mode === "login" : location.pathname === "/login";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-[#dfe0ff]">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#233dff]/30 rounded-full blur-3xl"></div>

        <div className="w-16 h-16 rounded-2xl bg-[#21274c] border border-[#5cb6f9]/30 flex items-center justify-center text-[#5cb6f9] mx-auto mb-6 shadow-md">
          <span className="material-symbols-outlined text-[32px]">
            {isLogin ? "lock" : "person_add"}
          </span>
        </div>

        <span className="font-headline text-xs uppercase tracking-widest text-[#5cb6f9] font-bold">
          {isLogin ? "OPERATOR ACCESS" : "EARLY ACCESS ONBOARDING"}
        </span>

        <h1 className="font-headline text-2xl sm:text-3xl text-white font-bold uppercase mt-2 mb-3">
          {isLogin ? "Portal Login" : "Create Account"}
        </h1>

        {/* Honest Notification Box */}
        <div className="p-4 rounded-2xl bg-[#050930]/90 border border-[#21274c] text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-headline font-bold text-[#5cb6f9] mb-1">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Authentication Service Notice</span>
          </div>
          <p className="font-body text-xs text-[#c5c5da] leading-relaxed">
            The full user authentication and database session service is scheduled for release in the upcoming authentication sprint. Currently, public marketing exploration and discovery features are active.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-[#233dff]/20 border border-[#5cb6f9] text-xs font-headline text-[#cae8ff] mb-6">
            <span className="font-bold text-white block mb-1">✓ Notification Request Saved</span>
            We will alert you at <span className="text-[#5cb6f9] font-bold">{email}</span> as soon as operator onboarding goes live.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
            <label className="font-headline text-xs text-[#8f8fa3] uppercase text-left block">
              Register for beta notification
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050930] px-4 py-2.5 rounded-xl font-body text-xs text-white border border-[#21274c] outline-none focus:border-[#5cb6f9]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#233dff] hover:bg-[#324bff] text-white font-headline text-xs font-bold whitespace-nowrap shadow-md"
              >
                Notify Me
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-[#21274c]/50 flex flex-col gap-2 font-headline text-xs">
          <Link
            to="/games"
            className="w-full py-2.5 rounded-xl bg-[#21274c] hover:bg-[#31365d] text-[#5cb6f9] hover:text-white font-bold transition-all"
          >
            Explore Public Game Builds →
          </Link>
          <Link
            to="/tournaments"
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#171c41] text-[#c5c5da] hover:text-white transition-all"
          >
            Browse Live Tournaments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPlaceholderPage;
