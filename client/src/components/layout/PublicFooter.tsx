import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#050930] mt-24 py-16 border-t border-[#21274c]/50 text-[#c5c5da]">
      <div className="max-w-[1380px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <img
                alt="RIYADAH ELITE"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
                src={logoImg}
              />
              <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-bold">
                RIYADAH <span className="text-[#5cb6f9]">ELITE</span>
              </span>
            </Link>
            <p className="font-body text-sm text-[#c5c5da] max-w-sm mb-6 leading-relaxed">
              The competitive gaming SaaS standard for live multi-regional tournament orchestrations
              and high-fidelity game testing telemetry.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13183d] border border-[#92ccff]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5cb6f9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5cb6f9]"></span>
              </span>
              <span className="font-headline text-[11px] text-[#92ccff] uppercase tracking-widest font-bold">
                All Systems Operational · Riyadh 9ms
              </span>
            </div>
          </div>

          {/* Navigation Column 1: Platform */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Platform
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <Link to="/games" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Game Testing Hub
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Live Tournaments
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/for-developers" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Telemetry SDK
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Solutions */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Solutions
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <Link to="/for-developers" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  For Game Studios
                </Link>
              </li>
              <li>
                <Link to="/game-rights-ownership" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Rights &amp; IP Protection
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Esports Organizers
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Beta Playtesters
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Trust & Governance */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2.5 font-body text-sm">
              <li>
                <Link to="/game-rights-ownership" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Ownership Verification
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Escrow Guarantee
                </Link>
              </li>
              <li>
                <Link to="/for-developers" className="text-[#c5c5da] hover:text-[#5cb6f9] transition-colors">
                  Tester NDA Terms
                </Link>
              </li>
              <li>
                <span className="text-[#8f8fa3] cursor-default">
                  Telemetry Privacy (GDPR/KSA)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#21274c]/50 text-xs text-[#8f8fa3]">
          <p>© 2025 Riyadah Elite Esports &amp; Telemetry Systems. All rights reserved.</p>
          <div className="flex items-center gap-6 font-headline">
            <span className="uppercase">Region: Global Edge (AWS ME-CENTRAL-1)</span>
            <span className="uppercase text-[#92ccff] font-bold">Protocol v4.18</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
