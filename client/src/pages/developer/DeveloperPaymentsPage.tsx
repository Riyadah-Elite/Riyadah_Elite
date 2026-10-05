import React, { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export const DeveloperPaymentsPage: React.FC = () => {
  const [balance, setBalance] = useState<string>("0.00 SAR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadLedger() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{ status: string; data: { escrowBalance: string } }>(
          "/developer/earnings"
        );
        if (mounted) {
          if (res.ok) {
            setBalance(res.data.data.escrowBalance || "0.00 SAR");
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              "Financial ledger and escrow payout integration will be completed in Phase 3B. No simulated payouts or fake balances are generated."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadLedger();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>ESCROW LEDGER</span>
            <span>•</span>
            <span>COMPLIANT SETTLEMENT</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Payments &amp; Earnings
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Audit your studio testing expenditures, allocated bounty escrow balances, and legitimate payout disbursements.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>ℹ️</span>
            <span>Ledger status: {error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded bg-[#2D1B40] text-amber-300 font-mono text-[10px]"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Balance Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#7F8FB8]">Escrow Wallet Balance</span>
          <div className="text-3xl font-headline font-bold text-white">
            {loading ? "..." : balance}
          </div>
          <p className="text-[11px] text-[#8796C0]">Allocated for certified tester reward disbursements.</p>
        </div>

        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#7F8FB8]">Total Disbursed (SAR)</span>
          <div className="text-3xl font-headline font-bold text-[#5CB6F9]">0.00 SAR</div>
          <p className="text-[11px] text-[#8796C0]">Verified bounty settlements paid to player testers.</p>
        </div>

        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#7F8FB8]">Pending Settlement</span>
          <div className="text-3xl font-headline font-bold text-emerald-400">0.00 SAR</div>
          <p className="text-[11px] text-[#8796C0]">Awaiting QA validation confirmation.</p>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
          Transaction &amp; Escrow History
        </h2>
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-xl text-[#5CB6F9]">
            💳
          </div>
          <div className="text-xs text-[#8796C0]">
            No financial settlements recorded yet. Transactions will appear when campaigns release funds upon completed testing milestones.
          </div>
        </div>
      </div>
    </div>
  );
};
