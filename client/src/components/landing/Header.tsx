import React, { useState } from "react";
import logoImg from "../../../assets/logos/re_logo.png";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f35]/85 backdrop-blur-xl border-b border-[#21274c]/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="h-20 max-w-[1380px] mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0 group cursor-pointer">
          <img
            alt="RIYADAH ELITE"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(92,182,249,0.7)]"
            src={logoImg}
          />
          <span className="font-headline text-lg sm:text-xl uppercase tracking-wider text-[#dfe0ff] font-bold">
            RIYADAH ELITE
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            aria-current="page"
            className="nav-link font-headline text-sm transition-colors text-[#bcc2ff] font-bold active"
            href="#games"
          >
            Games
          </a>
          <a
            className="nav-link font-headline text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors"
            href="#tournaments"
          >
            Tournaments
          </a>
          <a
            className="nav-link font-headline text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="nav-link font-headline text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors"
            href="#developers"
          >
            For Developers
          </a>
        </nav>

        {/* CTA & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            className="hidden sm:inline-flex items-center justify-center font-headline text-sm px-4 py-2 text-[#c5c5da] hover:text-[#bcc2ff] transition-all duration-200"
            href="#login"
          >
            Log In
          </a>
          <a
            className="btn-shimmer inline-flex items-center justify-center font-headline text-sm px-5 py-2.5 rounded-lg bg-[#233dff] text-white font-bold hover:brightness-110 hover:shadow-[0_0_25px_rgba(35,61,255,0.7)] active:scale-95 transition-all duration-300"
            href="#signup"
          >
            [ Get Started ]
          </a>
          <div
            className="w-9 h-9 rounded-full ring-2 ring-[#bcc2ff]/40 bg-[#21274c] flex items-center justify-center hover:ring-[#92ccff] cursor-pointer transition-all"
            title="Profile"
          >
            <span className="material-symbols-outlined text-[#92ccff] text-[20px]">person</span>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#c5c5da] hover:text-white hover:bg-[#171c41] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f35] border-b border-[#21274c] px-6 py-4 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <a
            className="text-[#bcc2ff] font-headline font-semibold text-base py-1"
            href="#games"
            onClick={() => setMobileMenuOpen(false)}
          >
            Games
          </a>
          <a
            className="text-[#c5c5da] hover:text-[#92ccff] font-headline font-medium text-base py-1"
            href="#tournaments"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tournaments
          </a>
          <a
            className="text-[#c5c5da] hover:text-[#92ccff] font-headline font-medium text-base py-1"
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </a>
          <a
            className="text-[#c5c5da] hover:text-[#92ccff] font-headline font-medium text-base py-1"
            href="#developers"
            onClick={() => setMobileMenuOpen(false)}
          >
            For Developers
          </a>
          <div className="pt-2 border-t border-[#21274c] flex items-center justify-between">
            <a className="text-sm font-semibold text-[#c5c5da]" href="#login">
              Log In
            </a>
            <span className="text-xs text-[#8f8fa3]">Riyadah Elite Platform</span>
          </div>
        </div>
      )}
    </header>
  );
};
