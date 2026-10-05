import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, DeveloperGameItem } from "../../lib/api";

export const DeveloperGameDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<DeveloperGameItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadGameDetails() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{ status: string; data: { game: DeveloperGameItem } }>(
          `/developer/games/${id}`
        );
        if (mounted) {
          if (res.ok) {
            setGame(res.data.data.game);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              `Backend endpoint for game ${id} is scheduled for Phase 3B. Displaying contract interface.`
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadGameDetails();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Breadcrumb */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#7F8FB8] uppercase tracking-wider">
          <Link to="/developer/dashboard" className="hover:text-[#5CB6F9]">
            DEVELOPER PORTAL
          </Link>
          <span>/</span>
          <Link to="/developer/games" className="hover:text-[#5CB6F9]">
            MY GAMES
          </Link>
          <span>/</span>
          <span className="text-white">BUILD TELEMETRY</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-white">
              {game ? game.title : `Game Build #${id?.slice(0, 8)}`}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30">
              {game?.status || "REGISTERED"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/developer/campaigns"
              className="px-4 py-2 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg"
            >
              + Create Campaign
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#1F122B] border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <span>ℹ️ Telemetry notice: {error}</span>
          <Link to="/developer/games" className="text-amber-300 font-mono text-[11px] underline">
            Back to Catalog
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading build telemetry...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Box */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Game Specifications &amp; Overview
              </h2>
              <p className="text-xs text-[#CAE8FF] leading-relaxed">
                {game?.description ||
                  "Real-time technical playtest build for competitive telemetry evaluation. Performance logs and crash dumps are mapped through the Riyadah verification network."}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">GENRE</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {game?.genre || "Action RPG"}
                  </span>
                </div>
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">PLATFORM</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {game?.platform || "PC (Windows)"}
                  </span>
                </div>
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">STAGE</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {game?.stage || "Technical Alpha"}
                  </span>
                </div>
                <div className="bg-[#091038] p-3 rounded-xl border border-[#182352]">
                  <span className="text-[10px] font-mono text-[#7F8FB8] block">CAPACITY</span>
                  <span className="text-xs font-headline font-bold text-white mt-1 block">
                    {game?.capacity || 100} Testers
                  </span>
                </div>
              </div>
            </div>

            {/* Focus Areas & System Requirements */}
            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Telemetry Focus Areas &amp; Hardware Targets
              </h2>

              <div className="space-y-3">
                <h3 className="text-xs font-mono text-[#5CB6F9]">Focus Objectives:</h3>
                <div className="flex flex-wrap gap-2">
                  {(game?.focusAreas || ["Server Latency", "Hitbox Precision", "Memory Leaks"]).map(
                    (fa, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-[#0E1B56] border border-[#233DFF]/30 text-xs text-[#CAE8FF]"
                      >
                        {fa}
                      </span>
                    )
                  )}
                </div>

                <h3 className="text-xs font-mono text-[#5CB6F9] pt-2">System Requirements:</h3>
                <div className="space-y-1.5 text-xs text-[#8796C0]">
                  {(
                    game?.requirements || [
                      "Windows 10/11 64-bit",
                      "16 GB RAM System Memory",
                      "NVIDIA GTX 1060 / AMD RX 580 or higher",
                      "DirectX 12 Compatible",
                    ]
                  ).map((req, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#5CB6F9]">✓</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Associated Campaigns */}
          <div className="space-y-6">
            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Testing Campaigns
              </h2>
              <div className="py-6 text-center space-y-3">
                <div className="text-2xl">🚀</div>
                <div className="text-xs text-[#8796C0]">
                  No campaigns currently configured for this title. Launch an escrow-guaranteed testing cycle.
                </div>
                <Link
                  to="/developer/campaigns"
                  className="inline-block px-4 py-2 rounded-xl bg-[#233DFF] text-white text-xs font-headline font-bold"
                >
                  + Setup Sprint
                </Link>
              </div>
            </div>

            <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
                Build Security &amp; NDA
              </h2>
              <div className="space-y-2 text-xs text-[#8796C0]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>🔒</span>
                  <span>Mandatory NDA required for enrolled testers</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <span>🛡️</span>
                  <span>Escrow protection enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
