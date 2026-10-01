import React from "react";
import logoImg from "../../../assets/logos/re_logo.png";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050930] mt-20 py-16 border-t border-[#21274c]/40">
      <div className="max-w-[1380px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4 group">
              <img
                alt="RIYADAH ELITE"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
                src={logoImg}
              />
              <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-bold">
                RIYADAH ELITE
              </span>
            </div>
            <p className="font-body text-sm text-[#c5c5da] max-w-sm mb-6 leading-relaxed">
              The competitive gaming SaaS standard for live multi-regional tournament orchestrations
              and high-fidelity game testing telemetry.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21274c] border border-[#92ccff]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92ccff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#92ccff]"></span>
              </span>
              <span className="font-headline text-[11px] text-[#92ccff] uppercase tracking-widest font-bold">
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Platform
            </h4>
            <ul className="space-y-2">
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#tournaments">Tournaments</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#games">Game Testing Hub</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#leaderboards">Leaderboards</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#telemetry">Telemetry Engine</a>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Solutions
            </h4>
            <ul className="space-y-2">
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#developers">Game Studios</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#tournaments">Esports Organizers</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#games">Beta Playtesters</a>
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                <a href="#security">Anti-Cheat Verification</a>
              </li>
            </ul>
          </div>

          {/* Nav Col 3 */}
          <div>
            <h4 className="font-headline text-sm uppercase tracking-wider text-[#dfe0ff] mb-4 font-bold">
              Legal &amp; Terms
            </h4>
            <ul className="space-y-2">
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                Privacy Policy
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                Terms of Service
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                Code of Conduct
              </li>
              <li className="font-body text-sm text-[#c5c5da] hover:text-[#92ccff] transition-colors cursor-pointer">
                Security Telemetry
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#21274c]/40 text-xs text-[#c5c5da]">
          <p>© 2025 Riyadah Elite Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 font-headline">
            <span className="uppercase">Region: Global Edge</span>
            <span className="uppercase text-[#92ccff]">v2.4.0-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
