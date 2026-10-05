import React, { useEffect, useState } from "react";
import { apiRequest, AdminStaffItem } from "../../lib/api";

export const AdminHrPeopleCulturePage: React.FC = () => {
  const [staff, setStaff] = useState<AdminStaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B staff governance directory
      const res = await apiRequest<{ staff: AdminStaffItem[] }>("/admin/hr/staff");

      if (res.ok) {
        setStaff(res.data.staff || []);
      } else {
        setError(res.error || "Staff Directory API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadStaff();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              PEOPLE, CULTURE &amp; OPERATOR ACCESS DIRECTORY
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Internal Staff Governance &amp; Enclave Roles
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Maintain administrative team rosters, security clearances, departmental access keys, and operator session audits.
            </p>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Loading Staff Clearance Records...
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
              {error} — Personal data is strictly protected. Roster displays verified internal clearance levels.
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

      {/* Staff Roster Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#151F52] flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-white tracking-wide uppercase">
            Authorized Administrative Personnel
          </h3>
          <span className="text-xs font-mono text-[#5CB6F9]">ENCLAVE PRIVILEGE MATRIX</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Operator Name</th>
                <th className="py-3.5 px-4">Title / Role</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Clearance Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Verifying staff credentials..." : "No active staff personnel records loaded."}
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{s.fullName}</td>
                    <td className="py-3 px-4 text-[#8796C0]">{s.title}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{s.department}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#233DFF]/20 text-[#5CB6F9]">
                        LEVEL {s.clearanceLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8796C0] font-mono text-[11px]">
                      {new Date(s.lastActiveAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Clearance modification for ${s.fullName} requires Level 5 Founder authorization.`)}
                        className="px-2.5 py-1 rounded-lg bg-[#13183D] hover:bg-[#20275C] border border-[#233DFF]/30 text-[#CAE8FF] text-[11px]"
                      >
                        Audit
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
