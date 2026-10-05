import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logoImg from "../../../assets/logos/re_logo.png";
import rahulAvatar from "../../../assets/images/rahul_avatar.png";

interface PlayerLayoutProps {
  currentUser?: {
    username?: string;
    fullName?: string;
  };
}

export const PlayerLayout: React.FC<PlayerLayoutProps> = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("riyadah_auth_token");

  React.useEffect(() => {
    if (!token) {
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname), { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("riyadah_auth_token");
    navigate("/login");
  };

  const navClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-headline text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-[#233DFF] text-white shadow-[0_0_20px_rgba(35,61,255,0.4)]"
        : "text-[#8796C0] hover:text-[#CAE8FF] hover:bg-[#091038]"
    }`;

  return (
    <div className="min-h-screen bg-[#050A30] text-[#CAE8FF] flex flex-col md:flex-row antialiased">
      {/* SIDEBAR NAVIGATION (DESKTOP) */}
      <aside className="w-full md:w-64 bg-[#070D38] border-r border-[#151F52] flex flex-col justify-between shrink-0 select-none">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-[#151F52]">
            <Link to="/player/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#0F174A] border border-[#23337A] p-1 flex items-center justify-center shadow-lg group-hover:border-[#5CB6F9] transition-all">
                <img src={logoImg} alt="Riyadah Elite" className="w-full h-full object-contain drop-shadow" />
              </div>
              <div>
                <span className="text-white font-bold tracking-wider text-sm font-headline block">
                  RIYADAH <span className="text-[#5CB6F9]">ELITE</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-[#5CB6F9] uppercase block">
                  PLAYER LAB
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <NavLink to="/player/dashboard" className={navClasses}>
              <span className="text-lg">📊</span>
              <span>Overview</span>
            </NavLink>

            <NavLink to="/player/game-testing" className={navClasses}>
              <span className="text-lg">🎮</span>
              <span>Game Testing</span>
            </NavLink>

            <NavLink to="/player/tournaments" className={navClasses}>
              <span className="text-lg">🏆</span>
              <span>My Tournaments</span>
            </NavLink>

            <NavLink to="/player/profile" className={navClasses}>
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </NavLink>

            <NavLink to="/player/settings" className={navClasses}>
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </NavLink>

            <div className="pt-4 border-t border-[#151F52]/60 mt-4 space-y-2">
              <Link
                to="/games"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-headline text-xs text-[#7F8FB8] hover:text-[#5CB6F9] hover:bg-[#091038] transition"
              >
                <span>🌐</span>
                <span>Public Games Catalog</span>
              </Link>
              <Link
                to="/tournaments"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-headline text-xs text-[#7F8FB8] hover:text-[#5CB6F9] hover:bg-[#091038] transition"
              >
                <span>🏆</span>
                <span>Esports Tournaments</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Mini Bar & Session Termination */}
        <div className="p-4 m-3 rounded-2xl bg-[#091038] border border-[#182352]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={rahulAvatar}
                alt="Player"
                className="w-9 h-9 rounded-xl object-cover border border-[#233DFF]/40 shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-headline font-bold text-white truncate">Player Session</span>
                <span className="text-[11px] font-mono text-emerald-400 truncate">
                  {token ? "Authenticated" : "Guest Mode"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#7F8FB8] hover:text-rose-400 hover:bg-[#050A30] rounded-xl transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <span className="text-sm font-mono font-bold">⎋</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
