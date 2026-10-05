import React, { useEffect, useState } from "react";
import { apiRequest, AdminFinanceOverviewData } from "../../lib/api";

export const AdminFinancePage: React.FC = () => {
  const [data, setData] = useState<AdminFinanceOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFinanceOverview() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B finance endpoint
      const res = await apiRequest<AdminFinanceOverviewData>("/admin/finance/overview");

      if (res.ok) {
        setData(res.data);
      } else {
        setError(res.error || "Financial Settlement API currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadFinanceOverview();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              FINANCE &amp; SETTLEMENT NODE • OPERATIONAL LEVEL 2
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Financial Operations &amp; Settlement Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Oversee developer campaign disbursements, verified tester payouts, tournament escrow, dispute holds, and KSA VAT compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Multi-sig approval queue pending Phase 5B treasury service.")}
              className="px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(35,61,255,0.45)] flex items-center gap-2"
            >
              <span>🔒</span>
              <span>Multi-Sig Approvals ({data?.transactions.filter(t => t.status === "PENDING_MULTI_SIG").length ?? 0})</span>
            </button>
            <button
              onClick={() => alert("CSV ledger export pending Phase 5B finance service.")}
              className="px-4 py-2.5 rounded-xl bg-[#13183D] hover:bg-[#1A2255] border border-[#21274C] text-[#CAE8FF] font-headline text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
            >
              <span>📊</span>
              <span>Export Ledger (.CSV)</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Reconciling Escrow &amp; Settlement Telemetry...
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <span>⚠️</span>
              <span>Financial Ledger Service Unavailable</span>
            </div>
            <p className="text-xs text-[#8796C0]">
              {error} — Financial figures represent awaiting reconciliation schemas; no simulated funds or payouts are executed.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Ledger Sync
          </button>
        </div>
      )}

      {/* Truthful Gateway Status Banner */}
      {data?.integrationStatus?.paymentGateway === "UNCONFIGURED" && !loading && (
        <div className="p-4 rounded-xl bg-[#090F3B] border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <span className="text-base">ℹ️</span>
            <span>
              <strong>Payment Gateway Mesh: UNCONFIGURED</strong> — Escrow balances report authoritative 0 SAR until live banking credentials and payment webhooks are provisioned.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
            SANDBOX STANDBY
          </span>
        </div>
      )}

      {/* Finance Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Escrow Balance", val: data ? `${data.totalEscrowBalanceSAR.toLocaleString()} SAR` : "—", icon: "🏦" },
          { label: "Pending Disbursements", val: data ? `${data.pendingDisbursementsSAR.toLocaleString()} SAR` : "—", icon: "⏳" },
          { label: "Settled Transactions", val: data?.settledTransactionsCount ?? "—", icon: "✅" },
          { label: "Gateway Disputes", val: data?.activeGatewayDisputesCount ?? "—", icon: "⚠️" },
        ].map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col justify-between gap-2 shadow-sm">
            <div className="flex items-center justify-between text-[#8796C0]">
              <span className="text-[10px] font-mono uppercase tracking-wider">{m.label}</span>
              <span>{m.icon}</span>
            </div>
            <span className="font-headline text-xl font-bold text-white tracking-tight">{m.val}</span>
          </div>
        ))}
      </section>

      {/* Transaction Ledger Table */}
      <div className="rounded-2xl bg-[#090F3B] border border-[#192359] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#151F52] flex items-center justify-between">
          <h3 className="font-headline text-sm font-bold text-white tracking-wide uppercase">
            Settlement Audit &amp; Transaction Ledger
          </h3>
          <span className="text-xs font-mono text-[#5CB6F9]">SAMA PROTOCOL AUDIT</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#151F52] bg-[#070D38]/60 text-[#8796C0] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Beneficiary</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151F52]/60">
              {!data || data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8796C0] font-mono">
                    {loading ? "Reconciling gateway ledger..." : "No transaction records present or pending."}
                  </td>
                </tr>
              ) : (
                data.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#13183D]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5CB6F9]">{tx.reference}</td>
                    <td className="py-3 px-4 font-bold text-white">{tx.type}</td>
                    <td className="py-3 px-4 text-[#8796C0]">{tx.beneficiary}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{tx.amountSAR} SAR</td>
                    <td className="py-3 px-4 font-mono text-[#8796C0]">{tx.channel}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        tx.status === "SETTLED"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : tx.status === "PENDING_MULTI_SIG"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Transaction audit for ${tx.reference} pending Phase 5B bank connector.`)}
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
