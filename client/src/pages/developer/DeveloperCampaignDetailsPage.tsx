import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, DeveloperCampaignItem } from "../../lib/api";

export const DeveloperCampaignDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<DeveloperCampaignItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadCampaignDetails() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{
          status: string;
          data: { campaign: DeveloperCampaignItem };
        }>(`/developer/campaigns/${id}`);
        if (mounted) {
          if (res.ok) {
            setCampaign(res.data.data.campaign);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              `Campaign ${id} data endpoint is scheduled for Phase 3B. Displaying campaign configuration contract.`
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadCampaignDetails();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#7F8FB8] uppercase tracking-wider">
          <Link to="/developer/dashboard" className="hover:text-[#5CB6F9]">
            DEVELOPER PORTAL
          </Link>
          <span>/</span>
          <Link to="/developer/campaigns" className="hover:text-[#5CB6F9]">
            TESTING CAMPAIGNS
          </Link>
          <span>/</span>
          <span className="text-white">SPRINT #{id?.slice(0, 8)}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-white">
              {campaign?.title || `Testing Campaign Sprint #${id?.slice(0, 8)}`}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {campaign?.status || "ACTIVE SPRINT"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/developer/testers"
              className="px-4 py-2 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg"
            >
              View Enrolled Testers →
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <span>ℹ️ Telemetry Notice: {error}</span>
          <Link to="/developer/campaigns" className="text-amber-300 font-mono text-[11px] underline">
            Back to Campaigns
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading sprint details...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Sprint Target &amp; Telemetry Scope
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">ASSOCIATED GAME</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {campaign?.gameTitle || "CyberStrike: Sands of Riyadh"}
                  </span>
                </div>
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">TARGET PLAYERS</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {campaign?.targetTesters || 50} Testers
                  </span>
                </div>
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">PRIMARY FOCUS</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {campaign?.primaryFocus || "Hit Registration & Netcode"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Campaign Verification Rules
              </h2>
              <ul className="text-xs text-[#8796C0] space-y-2 list-disc pl-5">
                <li>Testers must log at least 2 full competitive matches before submitting feedback.</li>
                <li>Crash dumps are automatically sanitized and forwarded without exposing PII.</li>
                <li>Payouts from escrow require verified report completion by studio administrators.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Sprint Status
              </h2>
              <div className="text-xs text-[#8796C0] space-y-2">
                <div className="flex justify-between">
                  <span>Enrolled:</span>
                  <span className="text-white font-mono">{campaign?.enrolledTesters || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="text-white font-mono">{campaign?.targetTesters || 50}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-mono">{campaign?.status || "ACTIVE"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
