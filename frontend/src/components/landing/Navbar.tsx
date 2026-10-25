import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/70 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0891B2] via-cyan-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-[#172B3A] leading-tight">
              RIYADAH <span className="text-[#0891B2]">ELITE</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase">
              GAMING & QA NEXUS
            </span>
          </div>
        </a>

        {/* Global Quick Search (inspired by game-night-landing-page-template) */}
        <div className="hidden xl:flex items-center flex-1 max-w-xs mx-4">
          <div className="relative w-full">
            <Ionicons
              name="search-outline"
              size={15}
              color="#5B7083"
              style={{ position: 'absolute', left: 12, top: 10, pointerEvents: 'none' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, playtests, cups..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FCFF] border border-neutral-200 rounded-full text-xs text-[#172B3A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0891B2] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-wider font-bold text-[#5B7083]">
          <a href="#explore" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            Games
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
          <a href="#testing" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            Playtest
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
          <a href="#tournaments" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            Tournaments
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
          <a href="#rewards" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            Rewards
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
          <a href="#about" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
          <a href="#community" className="hover:text-[#0891B2] transition-colors relative py-1 group">
            Community
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0891B2] transition-all group-hover:w-full" />
          </a>
        </nav>

        {/* Live Operational Status Pill & Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            QA NETWORK • ACTIVE
          </div>
          <a
            href="#explore"
            className="text-xs font-bold uppercase tracking-wider text-[#172B3A] hover:text-[#0891B2] transition-colors px-3 py-2 cursor-pointer"
          >
            Explore
          </a>
          <a
            href="#community"
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0891B2] hover:bg-[#0E7490] text-white shadow-sm shadow-cyan-600/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            Join Community
          </a>
        </div>


        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Ionicons name={menuOpen ? "close" : "menu"} size={26} color="#172B3A" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lg:hidden px-6 pt-2 pb-6 bg-white border-b border-neutral-200 flex flex-col gap-4 text-base font-semibold text-[#172B3A]">
          <div className="relative w-full my-1">
            <Ionicons
              name="search-outline"
              size={15}
              color="#5B7083"
              style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search games, playtests, cups..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FCFF] border border-neutral-200 rounded-xl text-xs text-[#172B3A]"
            />
          </div>
          <a href="#explore" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Games</a>
          <a href="#testing" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Playtest</a>
          <a href="#tournaments" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Tournaments</a>
          <a href="#rewards" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Rewards</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">About</a>
          <a href="#community" onClick={() => setMenuOpen(false)} className="py-2 border-b border-neutral-100">Community</a>
          <div className="flex flex-col gap-3 pt-2">
            <a
              href="#explore"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 text-center rounded-xl border border-neutral-200 text-sm font-bold text-[#172B3A]"
            >
              Explore Hub
            </a>
            <a
              href="#community"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 text-center rounded-xl bg-[#0891B2] text-white text-sm font-bold shadow-md shadow-cyan-600/20"
            >
              Join Community
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
