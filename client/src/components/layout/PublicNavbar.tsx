import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Games", path: "/games" },
    { label: "Tournaments", path: "/tournaments" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "For Developers", path: "/for-developers" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1035]/90 backdrop-blur-xl border-b border-[#21274c]/70 shadow-[0_4px_24px_rgba(5,9,48,0.7)]">
      <div className="h-20 max-w-[1380px] mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5cb6f9] rounded-lg p-1"
          aria-label="Riyadah Elite Home"
        >
          <img
            alt="RIYADAH ELITE"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(92,182,249,0.7)]"
            src={logoImg}
          />
          <span className="font-headline text-lg sm:text-xl uppercase tracking-wider text-[#dfe0ff] font-bold">
            RIYADAH <span className="text-[#5cb6f9]">ELITE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-2 p-1.5 rounded-full bg-[#050930]/80 border border-[#21274c]/50"
          aria-label="Main Navigation"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-5 py-2 rounded-full font-headline text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5cb6f9] ${
                  isActive
                    ? "bg-[#233dff] text-white shadow-[0_0_20px_rgba(35,61,255,0.6)]"
                    : "text-[#c5c5da] hover:text-[#dfe0ff] hover:bg-[#171c41]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center justify-center font-headline text-sm px-4 py-2 text-[#c5c5da] hover:text-[#92ccff] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5cb6f9] rounded-lg"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn-shimmer inline-flex items-center justify-center font-headline text-sm px-5 py-2.5 rounded-lg bg-[#233dff] text-white font-bold hover:brightness-110 hover:shadow-[0_0_25px_rgba(35,61,255,0.7)] active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#92ccff]"
          >
            Create an account
          </Link>

          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#c5c5da] hover:text-white hover:bg-[#171c41] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5cb6f9]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[26px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f35] border-b border-[#21274c] px-6 py-5 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top duration-200">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-headline text-base font-semibold transition-all ${
                  isActive
                    ? "bg-[#233dff] text-white"
                    : "text-[#c5c5da] hover:text-white hover:bg-[#171c41]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-3 mt-1 border-t border-[#21274c] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-headline font-semibold text-[#c5c5da] hover:text-[#92ccff] py-1"
              >
                Log In
              </Link>
              <span className="text-xs font-headline text-[#8f8fa3]">
                Riyadah Elite Platform
              </span>
            </div>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-headline text-sm font-bold py-2.5 rounded-lg bg-[#233dff] text-white shadow-md hover:brightness-110 transition-all"
            >
              Create an account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
