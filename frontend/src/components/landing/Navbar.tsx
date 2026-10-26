import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#DCE8F0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#08A8C8] via-cyan-500 to-[#36D9EE] flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-[#14283A] leading-tight">
              RIYADAH <span className="text-[#08A8C8]">ELITE</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-[#647B91] tracking-widest uppercase">
              GAMING & QA NEXUS
            </span>
          </div>
        </a>

        {/* Global Quick Search */}
        <div className="hidden xl:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Ionicons
              name="search-outline"
              size={15}
              color="#647B91"
              style={{ position: 'absolute', left: 12, top: 10, pointerEvents: 'none' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, playtests, cups..."
              className="w-full pl-9 pr-4 py-2 bg-[#F4FAFE] border border-[#DCE8F0] rounded-full text-xs text-[#14283A] placeholder-[#94A3B8] focus:outline-none focus:border-[#08A8C8] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-[#647B91]">
          <a href="#games" className="hover:text-[#08A8C8] transition-colors relative py-1 group">
            Games
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08A8C8] transition-all group-hover:w-full" />
          </a>
          <a href="#tournaments" className="hover:text-[#08A8C8] transition-colors relative py-1 group">
            Tournaments
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08A8C8] transition-all group-hover:w-full" />
          </a>
          <a href="#testing" className="hover:text-[#08A8C8] transition-colors relative py-1 group">
            Playtest & QA
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08A8C8] transition-all group-hover:w-full" />
          </a>
          <a href="#how-it-works" className="hover:text-[#08A8C8] transition-colors relative py-1 group">
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08A8C8] transition-all group-hover:w-full" />
          </a>
          <a href="#community" className="hover:text-[#08A8C8] transition-colors relative py-1 group">
            Community
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#08A8C8] transition-all group-hover:w-full" />
          </a>
        </nav>

        {/* Live Operational Status Pill & Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-[#14283A]">
                <div className="w-6 h-6 rounded-full bg-[#08A8C8] text-white flex items-center justify-center text-[10px] font-black uppercase">
                  {(user?.username || 'U')[0]}
                </div>
                <span>{user?.username}</span>
              </div>
              <button
                onClick={() => logout()}
                className="text-xs font-bold uppercase tracking-wider text-[#647B91] hover:text-red-600 transition-colors px-3 py-2 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal({ mode: 'login' })}
                className="text-xs font-bold uppercase tracking-wider text-[#14283A] hover:text-[#08A8C8] transition-colors px-3 py-2 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal({ mode: 'register' })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#08A8C8] hover:bg-[#068EA9] text-white shadow-sm shadow-cyan-600/20 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Ionicons name={menuOpen ? "close" : "menu"} size={26} color="#14283A" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden px-6 pt-2 pb-6 bg-white border-b border-[#DCE8F0] flex flex-col gap-4 text-base font-semibold text-[#14283A]">
          <div className="relative w-full my-1">
            <Ionicons
              name="search-outline"
              size={15}
              color="#647B91"
              style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, playtests, cups..."
              className="w-full pl-9 pr-4 py-2 bg-[#F4FAFE] border border-[#DCE8F0] rounded-xl text-xs text-[#14283A]"
            />
          </div>
          <a href="#games" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Games</a>
          <a href="#tournaments" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Tournaments</a>
          <a href="#testing" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Playtest & QA</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">How It Works</a>
          <a href="#community" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Community</a>

          <div className="flex flex-col gap-2 pt-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-xl bg-cyan-50 text-xs font-bold text-[#14283A] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#08A8C8] text-white flex items-center justify-center text-[10px]">
                    {(user?.username || 'U')[0]}
                  </div>
                  <span>Signed in as {user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center rounded-xl border border-red-200 text-xs font-bold text-red-600 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    openAuthModal({ mode: 'login' });
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 text-center rounded-xl border border-[#DCE8F0] text-sm font-bold text-[#14283A] cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal({ mode: 'register' });
                    setMenuOpen(false);
                  }}
                  className="w-full py-3 text-center rounded-xl bg-[#08A8C8] text-white text-sm font-bold shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
