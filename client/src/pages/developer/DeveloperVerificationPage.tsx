import React, { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export const DeveloperVerificationPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"STUDIO" | "STUDENT" | "SOLO">("STUDIO");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Verification Form fields
  const [formData, setFormData] = useState({
    legalEntityName: "CyberNova Studios LLC",
    registrationNumber: "CR-1010-849204",
    taxId: "300492819200003",
    registeredAddress: "Riyadh Digital City, Building B4, Level 3, Riyadh, Saudi Arabia",
    country: "Saudi Arabia",
  });

  useEffect(() => {
    let mounted = true;
    async function loadVerification() {
      try {
        setError(null);
        const res = await apiRequest<{ status: string; data: any }>("/developer/verification");
        if (mounted) {
          if (res.ok) {
            setVerificationData(res.data.data);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load verification status");
        }
      }
    }
    loadVerification();
    return () => {
      mounted = false;
    };
  }, []);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setSubmitMsg(null);
      const res = await apiRequest<{ status: string; data: any }>("/developer/verification", {
        method: "POST",
        body: JSON.stringify({
          entityType: activeTab,
          ...formData,
        }),
      });

      if (res.ok) {
        setSubmitMsg({
          type: "success",
          text: "Verification application submitted successfully for review.",
        });
        setVerificationData((prev: any) => ({
          ...prev,
          tier: "Tier-1 Pending",
          isVerified: false,
        }));
      } else {
        setSubmitMsg({ type: "error", text: res.error });
      }
    } catch (err: any) {
      setSubmitMsg({
        type: "error",
        text: err.message || "Submission failed. Please check form inputs.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>TRUST FRAMEWORK</span>
            <span>•</span>
            <span>NODE 04 · SAUDI TECH ECOSYSTEM</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Studio Verification
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Verify your commercial entity, IP documentation, and sandbox security credentials to access top-tier elite testing pools.
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

      {submitMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            submitMsg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
              : "bg-[#1F122B] border border-red-500/40 text-red-200"
          }`}
        >
          <span>{submitMsg.type === "success" ? "✓" : "⚠️"}</span>
          <span>{submitMsg.text}</span>
        </div>
      )}

      {/* 1. TOP VERIFICATION SUMMARY CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-[#070D38] border border-[#151F52] p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0E1B56] border border-[#233DFF]/30 flex items-center justify-center text-3xl text-[#5CB6F9]">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-headline font-bold text-white">
                  {verificationData?.tier || "Tier 1: Standard Studio Rig"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30">
                  {verificationData?.isVerified ? "VERIFIED PARTNER" : "UNDER REVIEW"}
                </span>
              </div>
              <p className="text-xs text-[#8796C0] mt-1">
                Node Reference: #{verificationData?.nodeId || "SA-DEV-402"} · {verificationData?.ecosystem || "Riyadh Tech Ecosystem Node"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#091038] border border-[#182352] px-4 py-3 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#7F8FB8] block uppercase">Compliance Checks</span>
              <span className="text-sm font-headline font-bold text-emerald-400">3 of 4 Completed</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-mono text-xs font-bold text-white">
              75%
            </div>
          </div>
        </div>

        {/* 4 Stage Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#151F52]/60">
          <div className="p-3.5 rounded-xl bg-[#091038] border border-[#182352]">
            <span className="text-[10px] font-mono text-[#7F8FB8] block">STAGE 01</span>
            <span className="text-xs font-headline font-bold text-white block mt-0.5">Identity Verification</span>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 block">✓ Verified</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091038] border border-[#182352]">
            <span className="text-[10px] font-mono text-[#7F8FB8] block">STAGE 02</span>
            <span className="text-xs font-headline font-bold text-white block mt-0.5">Commercial Entity</span>
            <span className="text-[11px] font-mono text-[#5CB6F9] mt-1 block">⋯ Under Review</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091038] border border-[#182352]">
            <span className="text-[10px] font-mono text-[#7F8FB8] block">STAGE 03</span>
            <span className="text-xs font-headline font-bold text-white block mt-0.5">Game Rights Clearance</span>
            <span className="text-[11px] font-mono text-emerald-400 mt-1 block">✓ Cleared</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#091038] border border-amber-500/40">
            <span className="text-[10px] font-mono text-amber-400 block">STAGE 04</span>
            <span className="text-xs font-headline font-bold text-white block mt-0.5">Escrow &amp; Tax Payout</span>
            <span className="text-[11px] font-mono text-amber-300 mt-1 block">! Action Needed</span>
          </div>
        </div>
      </div>

      {/* 2. VERIFICATION SUBMISSION & ENTITY REGISTRATION FORM */}
      <form onSubmit={handleVerifySubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#151F52]">
          <div>
            <h2 className="text-base font-headline font-bold text-white">Stage 2: Entity &amp; Commercial Verification</h2>
            <p className="text-xs text-[#8796C0] mt-0.5">
              Submit or update your official studio entity credentials for Riyadh Node accreditation.
            </p>
          </div>

          {/* Entity Type Selector */}
          <div className="flex items-center gap-1 bg-[#091038] p-1 rounded-xl border border-[#182352]">
            {(["STUDIO", "STUDENT", "SOLO"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition ${
                  activeTab === tab
                    ? "bg-[#233DFF] text-white shadow"
                    : "text-[#8796C0] hover:text-white"
                }`}
              >
                {tab === "STUDIO" ? "Studio / Company" : tab === "STUDENT" ? "Student Team" : "Solo Dev"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Legal Entity Name *</label>
            <input
              type="text"
              value={formData.legalEntityName}
              onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Commercial Registration / CR Number *</label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Tax ID / VAT Number (Optional)</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Country / Jurisdiction</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Registered Office Address *</label>
          <input
            type="text"
            value={formData.registeredAddress}
            onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
            required
            className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Verification Documents"}
          </button>
        </div>
      </form>
    </div>
  );
};
