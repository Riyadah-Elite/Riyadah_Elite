import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0F172A] text-white pt-14 pb-10 px-6 md:px-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-10 border-b border-neutral-800">
        {/* Brand Info */}
        <div className="md:col-span-2 pr-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#08A8C8] to-[#36D9EE] flex items-center justify-center font-black text-xl text-white shadow-md shadow-cyan-500/20">
              R
            </div>
            <span className="font-black text-xl tracking-tight">RIYADAH ELITE</span>
          </div>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
            The premier platform for gaming quality assurance, verified playtesting telemetry, and championship tournaments across the Middle East and worldwide.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            NODE: RIYADH-01 • REGIONAL EDGE • OPERATIONAL
          </div>
        </div>

        {/* Links 1: Platform */}
        <div>
          <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4">Platform</h4>
          <ul className="space-y-3 text-xs text-neutral-300 font-medium">
            <li><a href="#games" className="hover:text-cyan-400 transition-colors">Featured Games</a></li>
            <li><a href="#tournaments" className="hover:text-cyan-400 transition-colors">Tournaments</a></li>
            <li><a href="#testing" className="hover:text-cyan-400 transition-colors">Playtest & QA</a></li>
            <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a></li>
            <li><a href="#community" className="hover:text-cyan-400 transition-colors">Community</a></li>
          </ul>
        </div>

        {/* Links 2: Ecosystem */}
        <div>
          <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4">Ecosystem</h4>
          <ul className="space-y-3 text-xs text-neutral-300 font-medium">
            <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Discord Community</a></li>
            <li><a href="#testing" className="hover:text-cyan-400 transition-colors">Submit QA Telemetry</a></li>
            <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Studio Specs</a></li>
            <li><a href="#games" className="hover:text-cyan-400 transition-colors">Alpha Catalog</a></li>
          </ul>
        </div>

        {/* Links 3: Compliance & Legal */}
        <div>
          <h4 className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest mb-4">Trust & Legal</h4>
          <ul className="space-y-3 text-xs text-neutral-300 font-medium">
            <li><a href="#community" className="hover:text-cyan-400 transition-colors">Privacy & Data Isolation</a></li>
            <li><a href="#community" className="hover:text-cyan-400 transition-colors">Playtester NDA Terms</a></li>
            <li><a href="#testing" className="hover:text-cyan-400 transition-colors">Bug Bounty Framework</a></li>
            <li><a href="#tournaments" className="hover:text-cyan-400 transition-colors">Fair Play Code of Conduct</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© {currentYear} Riyadah Elite. All rights reserved. Built with Expo, React Native & Three.js.</p>
        <p className="font-mono text-neutral-400 text-[11px]">Riyadah Elite Platform • Saudi Arabia Vision 2030</p>
      </div>
    </footer>
  );
}
