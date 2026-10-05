import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("riyadah_auth_token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Authentication & Access Protection
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

  interface AdminNavLink {
    to: string;
    label: string;
    icon: string;
    badge?: string;
  }

  interface AdminNavSection {
    group: string;
    links: AdminNavLink[];
  }

  const navSections: AdminNavSection[] = [
    {
      group: "COMMAND CENTRES",
      links: [
        { to: "/admin/founder", label: "Founder Command", icon: "👑", badge: "LVL 5" },
        { to: "/admin/vice-command", label: "Vice Admin Command", icon: "🏛️", badge: "LVL 4" },
      ],
    },
    {
      group: "PLATFORM MANAGEMENT",
      links: [
        { to: "/admin/users", label: "User Management", icon: "👥" },
        { to: "/admin/developers", label: "Developer Management", icon: "💻" },
        { to: "/admin/tournaments", label: "Tournament Arbiter", icon: "⚖️" },
        { to: "/admin/finance", label: "Finance & Escrow", icon: "💳" },
        { to: "/admin/trust-safety", label: "Trust & Safety", icon: "🛡️" },
        { to: "/admin/verification", label: "Verification Review", icon: "📜" },
      ],
    },
    {
      group: "GOVERNANCE & SYSTEM",
      links: [
        { to: "/admin/hr", label: "HR & People", icon: "🏢" },
        { to: "/admin/platform-ops", label: "Platform Operations", icon: "⚡" },
        { to: "/admin/content", label: "Content Management", icon: "📰" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050A30] text-[#F7FBFF] flex flex-col antialiased selection:bg-[#233DFF] selection:text-white">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-[#070D38]/95 backdrop-blur-xl border-r border-[#151F52] flex-col justify-between z-40">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo & Node Indicator */}
          <div className="p-5 border-b border-[#151F52]/60 flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={logoImg}
                alt="Riyadah Elite"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-headline text-base font-bold tracking-tight text-white leading-none">
                  RIYADAH ELITE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#5CB6F9] uppercase mt-1">
                  INTERNAL ADMIN SUITE
                </span>
              </div>
            </Link>

            {/* Clearance Level Pill */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#13183D] border border-[#21274C]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#CAE8FF]">
                  SEC-ENCLAVE 5.0
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#233DFF]/30 text-[#92CCFF]">
                ROOT-OK
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#7F8FB8]">
                  {sec.group}
                </span>
                <div className="space-y-1 pt-1">
                  {sec.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/admin/founder"}
                      className={navClasses}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{link.icon}</span>
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9]">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Node Telemetry & Operator Logout */}
        <div className="p-4 border-t border-[#151F52]/60 bg-[#060B28]/60 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#8796C0]">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ME-East-RUH #01 (7ms)
            </span>
            <span className="text-[10px] font-mono text-[#5CB6F9]">99.99%</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/20 text-xs font-semibold text-[#CAE8FF] transition-all"
          >
            <span>Disconnect Session</span>
          </button>
        </div>
      </aside>

      {/* Top Header */}
      <header className="lg:pl-72 h-16 bg-[#070D38]/80 backdrop-blur-xl border-b border-[#151F52]/60 fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#13183D] text-[#CAE8FF] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8796C0]">
            <span className="text-[#CAE8FF]">ADMIN ROOT</span>
            <span>/</span>
            <span className="text-[#5CB6F9] uppercase tracking-wider">
              {location.pathname.replace("/admin/", "").replace("-", " ") || "DASHBOARD"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search admin enclave (⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#13183D] border border-[#21274C] text-[#F7FBFF] placeholder-[#8796C0] focus:outline-none focus:border-[#233DFF]"
            />
            <span className="absolute left-2.5 top-1.5 text-xs text-[#8796C0]">🔍</span>
          </div>

          {/* Quick Status Tag */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#151F52] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[#CAE8FF] font-mono text-[11px]">SAMA &amp; VAT Compliant</span>
          </div>

          {/* Operator Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#151F52]/60">
            <div className="w-8 h-8 rounded-full bg-[#233DFF] flex items-center justify-center font-bold text-xs text-white shadow-[0_0_12px_rgba(35,61,255,0.4)]">
              RE
            </div>
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-none text-white">System Executive</span>
              <span className="text-[10px] font-mono text-[#5CB6F9] leading-tight mt-0.5">Level 5 Founder</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-72 max-w-full bg-[#070D38] border-r border-[#151F52] flex flex-col justify-between p-5 z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#151F52]">
                <span className="font-headline font-bold text-sm text-white">ADMIN NAVIGATION</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg p-1 text-[#8796C0] hover:text-white"
                >
                  ✕
                </button>
              </div>

              {navSections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7F8FB8]">
                    {sec.group}
                  </span>
                  <div className="space-y-1">
                    {sec.links.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={navClasses}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{link.icon}</span>
                          <span>{link.label}</span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="mt-6 w-full py-2 px-3 rounded-lg bg-[#13183D] border border-red-500/30 text-xs font-semibold text-red-400"
            >
              Disconnect Session
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="lg:pl-72 pt-16 flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
};
