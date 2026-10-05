import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";
import rahulAvatar from "../../../assets/images/rahul_avatar.png";

export const HostLayout: React.FC = () => {
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
      group: "MAIN OPERATIONS",
      links: [
        { to: "/host/dashboard", icon: "📊", label: "Overview" },
        { to: "/host/tournaments", icon: "🏆", label: "My Tournaments" },
        { to: "/host/tournaments/new", icon: "➕", label: "Create Tournament" },
        { to: "/host/results", icon: "👥", label: "Results & Participants" },
      ],
    },
    {
      group: "ORGANIZER SUITE",
      links: [
        { to: "/host/profile", icon: "🛡️", label: "Host Profile & Settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A30] text-[#F7FBFF] flex flex-col antialiased selection:bg-[#233DFF] selection:text-white">
      {/* Fixed Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[#070D38]/95 backdrop-blur-xl border-r border-[#151F52] flex-col justify-between z-40">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Node Header */}
          <div className="p-5 border-b border-[#151F52]/60 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={logoImg}
                alt="Riyadah Elite"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold tracking-tight text-white leading-none">
                  RIYADAH
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#5CB6F9] uppercase mt-1">
                  Host Operations
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            {navItems.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7F8FB8]">
                  {sec.group}
                </span>
                <div className="space-y-1 pt-1">
                  {sec.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/host/dashboard"}
                      className={navClasses}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{link.icon}</span>
                        <span>{link.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom User / Studio Capsule */}
        <div className="p-4 border-t border-[#151F52]/80 bg-[#060B33]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={rahulAvatar}
                alt="Host"
                className="w-9 h-9 rounded-full object-cover border border-[#233DFF]/40 shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-headline font-bold text-white truncate">
                  Host Workspace
                </div>
                <div className="text-[10px] font-mono text-[#5CB6F9] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tier-1 Verified
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#8796C0] hover:text-red-400 hover:bg-[#13183D] transition"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column Wrapper */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Operational Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#070D38]/85 backdrop-blur-md border-b border-[#151F52] px-4 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#8796C0] hover:text-white hover:bg-[#13183D]"
            >
              ☰
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8796C0]">
              <span className="text-[#5CB6F9]">HOST PORTAL</span>
              <span>/</span>
              <span className="uppercase text-white">
                {location.pathname.replace("/host/", "") || "DASHBOARD"}
              </span>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-64">
              <input
                type="text"
                placeholder="Search tournaments, teams... ⌘K"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white placeholder-[#5A6E9E] focus:outline-none focus:border-[#5CB6F9] transition"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-[#5A6E9E]">🔍</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1B56] border border-[#233DFF]/30 text-[11px] font-mono text-[#5CB6F9]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ME-EAST LIVE</span>
            </div>

            <Link
              to="/host/tournaments/new"
              className="px-3.5 py-1.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-[0_0_15px_rgba(35,61,255,0.4)] flex items-center gap-1.5"
            >
              <span>+</span>
              <span className="hidden sm:inline">Create Tournament</span>
            </Link>
          </div>
        </header>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-[#050A30]/90 backdrop-blur-lg flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#151F52] pb-4">
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="Logo" className="h-7 w-auto" />
                <span className="font-headline font-bold text-white text-base">Host Workspace</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-white hover:bg-[#13183D]"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              {navItems.flatMap((s) => s.links).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#091038] text-sm text-white"
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-600/20 text-red-300 font-bold text-xs"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Route Outlet Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
