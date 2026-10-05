import React, { useEffect, useState } from "react";
import { apiRequest, AdminUserListItem } from "../../lib/api";

export const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B user directory endpoint
      const res = await apiRequest<{ users: AdminUserListItem[] }>("/admin/users");

      if (res.ok) {
        setUsers(res.data.users || []);
      } else {
        setError(res.error || "User directory API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              USER OPERATIONS • PLAYER MANAGEMENT CONSOLE
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              User Directory &amp; Conduct Ledger
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Manage gamer profiles, conduct scores, platform-level restrictions, playtest quotas, and account statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("CSV export pending Phase 5B user export service.")}
              className="px-4 py-2.5 rounded-xl bg-[#13183D] hover:bg-[#1A2255] border border-[#21274C] text-[#CAE8FF] font-headline text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <span>📥</span>
              <span>Export User Ledger (.CSV)</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading User Records...
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>⚠️</span>
              <span>Backend Contract Pending (Phase 5B)</span>
            </div>
            <p className="text-xs text-[#8796C0]">
              {error} — All search, filters, and management action controls are mounted according to the Stitch design specification.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-xl bg-[#090F3B] border border-[#192359] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, handle, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#F7FBFF] placeholder-[#8796C0] focus:outline-none focus:border-[#233DFF]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#8796C0]">🔍</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="PLAYER">Players</option>
            <option value="DEVELOPER">Developers</option>
            <option value="HOST">Hosts</option>
            <option value="ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#13183D] border border-[#21274C] text-xs text-[#CAE8FF] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="BANNED">Banned</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Conduct Score</th>
                <th className="py-3.5 px-4">Tournaments</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Fetching users..." : "No user records match current filter criteria."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{u.fullName}</span>
                        <span className="text-[11px] text-[#8796C0]">@{u.username} • {u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{u.role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-[#5CB6F9]">
                        {u.conductScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{u.totalTournamentsJoined}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : u.status === "BANNED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8796C0] font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Review action for user @${u.username} pending Phase 5B moderation router.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
