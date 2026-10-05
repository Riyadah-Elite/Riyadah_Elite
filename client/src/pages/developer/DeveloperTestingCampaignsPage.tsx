import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, DeveloperCampaignItem } from "../../lib/api";

export const DeveloperTestingCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<DeveloperCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    let mounted = true;
    async function loadCampaigns() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{
          status: string;
          data: { campaigns: DeveloperCampaignItem[] };
        }>("/developer/campaigns");
        if (mounted) {
          if (res.ok) {
            setCampaigns(res.data.data.campaigns || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              "Testing campaigns endpoint is scheduled for Phase 3B. Rendering truthful interface."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadCampaigns();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = campaigns.filter(
    (c) => statusFilter === "ALL" || c.status === statusFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>TESTING CYCLES</span>
            <span>•</span>
            <span>ESCROW PROTECTED</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Testing Campaigns
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Configure targeted player recruitment campaigns, allocate escrow bounties, and gather telemetry reports from certified elite testers.
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              "Campaign creation backend workflow will be fully connected in Phase 3B."
            )
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold shadow-lg transition"
        >
          <span>+ Create Campaign</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#070D38] p-2.5 rounded-xl border border-[#151F52] overflow-x-auto">
        {["ALL", "ACTIVE", "DRAFT", "PAUSED", "COMPLETED"].map((tab) => (
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

      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading testing campaigns...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
            🚀
          </div>
          <h2 className="text-base font-headline font-bold text-white">No Testing Campaigns Active</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            You do not have any testing campaigns running. Create a campaign to specify tester requirements, time windows, and target milestones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((camp) => (
            <div
              key={camp.id}
              className="rounded-2xl bg-[#070D38] border border-[#151F52] p-5 flex flex-col justify-between hover:border-[#233DFF]/50 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#5CB6F9]">{camp.gameTitle}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {camp.status}
                  </span>
                </div>
                <h2 className="text-base font-headline font-bold text-white group-hover:text-[#5CB6F9] transition">
                  {camp.title}
                </h2>
                <div className="text-xs text-[#8796C0] space-y-1">
                  <div>
                    Focus: <span className="text-white">{camp.primaryFocus}</span>
                  </div>
                  <div>
                    Enrolled:{" "}
                    <span className="text-white font-mono">
                      {camp.enrolledTesters} / {camp.targetTesters} Testers
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#151F52]/60 mt-4 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#7F8FB8]">
                  {camp.startDate} – {camp.endDate}
                </span>
                <Link
                  to={`/developer/campaigns/${camp.id}`}
                  className="text-xs font-headline font-bold text-[#5CB6F9] hover:text-white transition"
                >
                  Manage Sprint →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
