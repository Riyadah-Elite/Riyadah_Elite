import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";
import rahulAvatar from "../../../assets/images/rahul_avatar.png";

export const DeveloperLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("riyadah_auth_token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    if (!token) {
      navigate("/login?redirect=" + encodeURIComponent(location.pathname), { replace: true });
    }
  }, [token, navigate, location.pathname]);

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("riyadah_auth_token");
    navigate("/login");
  };

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl font-headline text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? "bg-[#233DFF] text-white shadow-[0_0_20px_rgba(35,61,255,0.45)] ring-1 ring-white/20"
        : "text-[#8796C0] hover:text-[#CAE8FF] hover:bg-[#13183D]"
    }`;

  const navItems = [
    {
      group: "MAIN TELEMETRY",
      links: [
        { to: "/developer/dashboard", icon: "📊", label: "Overview" },
        { to: "/developer/games", icon: "🎮", label: "My Games" },
        { to: "/developer/games/new", icon: "➕", label: "Add / Submit Game" },
        { to: "/developer/campaigns", icon: "🚀", label: "Testing Campaigns" },
        { to: "/developer/testers", icon: "👥", label: "Testers" },
        { to: "/developer/feedback", icon: "📝", label: "Feedback & Results" },
        { to: "/developer/earnings", icon: "💳", label: "Payments & Earnings" },
      ],
    },
    {
      group: "STUDIO & VERIFICATION",
      links: [
        { to: "/developer/verification", icon: "🛡️", label: "Verification" },
        { to: "/developer/profile", icon: "🏢", label: "Developer Profile" },
        { to: "/developer/settings", icon: "⚙️", label: "Settings" },
      ],
    },
    {
      group: "ASSISTANCE",
      links: [
        { to: "/developer/support", icon: "💬", label: "Support & Disputes" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A30] text-[#CAE8FF] flex flex-col md:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#070D38] border-b border-[#151F52] z-50">
        <Link to="/developer/dashboard" className="flex items-center gap-2.5">
          <img src={logoImg} alt="Riyadah Elite" className="w-7 h-7 object-contain" />
          <span className="text-white font-headline text-sm font-bold">
            RIYADAH <span className="text-[#5CB6F9]">DEVELOPER</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#13183D] text-[#CAE8FF] text-lg"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex w-full md:w-64 lg:w-72 bg-[#070D38] border-r border-[#151F52] flex-col justify-between shrink-0 select-none z-40 md:sticky md:top-0 md:h-screen overflow-y-auto`}
      >
        <div className="flex flex-col">
          {/* Studio Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#151F52]">
            <Link to="/developer/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#0F174A] border border-[#23337A] p-1 flex items-center justify-center shadow-lg group-hover:border-[#5CB6F9] transition-all">
                <img src={logoImg} alt="Riyadah Elite" className="w-full h-full object-contain drop-shadow" />
              </div>
              <div>
                <span className="text-white font-bold tracking-wider text-sm font-headline block">
                  RIYADAH <span className="text-[#5CB6F9]">ELITE</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#5CB6F9] uppercase block">
                  DEVELOPER RIG · NODE 04
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Action: Submit Game */}
          <div className="p-4 border-b border-[#151F52]/60">
            <Link
              to="/developer/games/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white font-headline font-bold text-xs tracking-wider uppercase shadow-[0_4px_16px_rgba(35,61,255,0.4)] transition-all"
            >
              <span>+ SUBMIT NEW GAME</span>
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="p-4 space-y-6">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#5A6E9E] block mb-1">
                  {group.group}
                </span>
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/developer/dashboard" || link.to === "/developer/games"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={navClasses}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{link.icon}</span>
                      <span>{link.label}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            ))}

            <div className="pt-4 border-t border-[#151F52]/60 space-y-1.5">
              <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#5A6E9E] block mb-1">
                PUBLIC CATALOUGES
              </span>
              <Link
                to="/games"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-headline text-[#8796C0] hover:text-[#5CB6F9] hover:bg-[#13183D] transition"
              >
                <span>🌐</span>
                <span>Public Games Catalog</span>
              </Link>
              <Link
                to="/tournaments"
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-headline text-[#8796C0] hover:text-[#5CB6F9] hover:bg-[#13183D] transition"
              >
                <span>🏆</span>
                <span>Esports Tournaments</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Studio Mini Profile Box */}
        <div className="p-4 m-3 rounded-2xl bg-[#091038] border border-[#182352]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={rahulAvatar}
                alt="Studio Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-[#233DFF]/40 shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-headline font-bold text-white truncate">Studio Partner</span>
                <span className="text-[10px] font-mono text-emerald-400 truncate">
                  ● Tier-1 Verified
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-[#7F8FB8] hover:text-red-400 hover:bg-[#121B48] rounded-lg transition"
              aria-label="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#151F52]/60 flex items-center justify-between text-[10px] font-mono text-[#7F8FB8]">
            <span>NODE: RIYADH-04</span>
            <span className="text-[#5CB6F9]">99.9% ONLINE</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-6 lg:px-8 border-b border-[#151F52] bg-[#070D38]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#5CB6F9] bg-[#0E1B56] px-2.5 py-1 rounded-md border border-[#233DFF]/30">
              DEV WORKSPACE
            </span>
            <div className="hidden sm:flex items-center text-xs text-[#8796C0]">
              <span>Riyadah Verification Network</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, builds, telemetry..."
                className="w-64 h-9 pl-9 pr-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9] transition"
              />
              <span className="absolute left-3 text-xs text-[#5A6E9E]">🔍</span>
            </div>
            <Link
              to="/developer/games/new"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-semibold transition"
            >
              <span>+ Add Game</span>
            </Link>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
