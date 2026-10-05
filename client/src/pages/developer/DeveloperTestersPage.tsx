import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, DeveloperTesterItem } from "../../lib/api";

export const DeveloperTestersPage: React.FC = () => {
  const [testers, setTesters] = useState<DeveloperTesterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    let mounted = true;
    async function loadTesters() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{
          status: string;
          data: { testers: DeveloperTesterItem[] };
        }>("/developer/testers");
        if (mounted) {
          if (res.ok) {
            setTesters(res.data.data.testers || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              "Developer testers endpoint is scheduled for Phase 3B. Displaying privacy-compliant tester interface."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadTesters()
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = testers.filter(
    (t) => statusFilter === "ALL" || t.status === statusFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>VERIFIED SQUAD</span>
            <span>•</span>
            <span>PRIVACY COMPLIANT (NO PII EXPOSURE)</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Enrolled Testers
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Monitor verified testers assigned to your active campaigns. Tester identities are pseudonymous to preserve player privacy and comply with data minimization regulations.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <span>ℹ️ Telemetry Notice: {error}</span>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#2D1B40] text-amber-300 font-mono text-[10px]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#070D38] p-2.5 rounded-xl border border-[#151F52] overflow-x-auto">
        {["ALL", "ACTIVE", "COMPLETED", "WITHDRAWN"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-medium transition ${
              statusFilter === tab
                ? "bg-[#233DFF] text-white"
                : "text-[#8796C0] hover:text-[#CAE8FF]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Testers Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading enrolled testers...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
            👥
          </div>
          <h2 className="text-base font-headline font-bold text-white">No Enrolled Testers Found</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            Once you launch an active testing campaign, qualified players with verified hardware profiles will be assigned to your build.
          </p>
          <Link
            to="/developer/campaigns"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold"
          >
            Go to Campaigns
          </Link>
        </div>
      ) : (
        <div className="bg-[#070D38] border border-[#151F52] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#091038] text-[10px] font-mono text-[#7F8FB8] uppercase border-b border-[#151F52]">
                <tr>
                  <th className="p-4">Tester Tag</th>
                  <th className="p-4">Campaign</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Bugs Logged</th>
                  <th className="p-4">Time Played</th>
                  <th className="p-4">NDA Status</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151F52]/60 text-[#CAE8FF]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#091038]/50 transition">
                    <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#0E1B56] flex items-center justify-center text-[10px] text-[#5CB6F9]">
                        👤
                      </span>
                      <span>{t.testerTag}</span>
                    </td>
                    <td className="p-4">{t.campaignTitle}</td>
                    <td className="p-4 font-mono text-[11px]">{t.platform}</td>
                    <td className="p-4 font-mono text-[#5CB6F9]">{t.bugsReported}</td>
                    <td className="p-4 font-mono">{t.hoursPlayed} hrs</td>
                    <td className="p-4">
                      {t.ndaSigned ? (
                        <span className="text-emerald-400 font-mono text-[11px]">✓ Executed</span>
                      ) : (
                        <span className="text-amber-400 font-mono text-[11px]">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
