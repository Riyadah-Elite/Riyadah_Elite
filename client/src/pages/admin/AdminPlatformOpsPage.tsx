import React, { useEffect, useState } from "react";
import { apiRequest, AdminPlatformServiceStatus } from "../../lib/api";

export const AdminPlatformOpsPage: React.FC = () => {
  const [services, setServices] = useState<AdminPlatformServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServiceHealth() {
      setLoading(true);
      setError(null);

      // Connect to pending Phase 5B platform operations telemetry endpoint
      const res = await apiRequest<{ services: AdminPlatformServiceStatus[] }>("/admin/platform/health");

      if (res.ok) {
        setServices(res.data.services || []);
      } else {
        setError(res.error || "Platform Telemetry Mesh currently offline (Pending Phase 5B Backend)");
      }
      setLoading(false);
    }

    loadServiceHealth();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0B1347]/80 border border-[#1B256B] p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13183D] border border-[#233DFF]/40 text-[#5CB6F9] font-mono text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#5CB6F9] animate-pulse"></span>
              PLATFORM OPERATIONS • DISPATCH &amp; TELEMETRY NODE
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Platform Operations Command Center
            </h1>
            <p className="text-sm text-[#8796C0] leading-relaxed">
              Real-time service health, cross-department task dispatch, node latencies, and critical incident response protocols.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert("Cross-department dispatch directive modal pending Phase 5B.")}
              className="px-4 py-2.5 rounded-xl bg-[#233DFF] hover:bg-blue-600 text-white font-headline text-xs font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(35,61,255,0.45)] flex items-center gap-2"
            >
              <span>⚡</span>
              <span>Initiate Ops Dispatch</span>
            </button>
          </div>
        </div>
      </section>

      {/* State Display */}
      {loading && (
        <div className="p-12 text-center rounded-2xl bg-[#070D38]/60 border border-[#151F52] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#233DFF] border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#8796C0] uppercase tracking-wider">
            Polling Platform Node Telemetry...
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
              {error} — Truthful unconfigured monitoring rendered. No fake node uptimes or synthetic heartbeat checks are faked.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3.5 py-1.5 rounded-lg bg-[#13183D] border border-amber-500/40 text-amber-300 text-xs font-mono hover:bg-amber-950/40"
          >
            Retry Telemetry
          </button>
        </div>
      )}

      {/* Platform Node Grid */}
      <section className="space-y-3">
        <h2 className="font-headline text-lg font-bold text-white tracking-wide">
          Core Services &amp; Network Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full p-8 text-center rounded-2xl bg-[#090F3B] border border-[#192359] text-xs text-[#8796C0] font-mono">
              Live service status awaiting connection to Phase 5B monitoring engine.
            </div>
          ) : (
            services.map((srv, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#090F3B] border border-[#192359] flex flex-col justify-between gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-xs font-bold text-white">{srv.serviceName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    srv.status === "HEALTHY"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : srv.status === "DEGRADED"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {srv.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#8796C0]">
                  <span>Uptime: {srv.uptimePercentage}%</span>
                  <span className="text-[#5CB6F9]">{srv.latencyMs}ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
