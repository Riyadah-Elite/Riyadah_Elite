import { useEffect, useState } from "react";
import { Activity, CheckCircle, RefreshCw, Server, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  service: string;
}

export const HomePage = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/health");
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect to backend server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-7 h-7 text-emerald-500" />
          <h1 className="text-xl font-bold tracking-tight">Riyadah Elite</h1>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
          PERN Monorepo Baseline
        </span>
      </header>

      <main className="max-w-4xl mx-auto w-full my-auto py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/50 border border-amber-800/40 px-2.5 py-0.5 rounded">
              Temporary Foundation Placeholder
            </span>
            <h2 className="text-2xl font-bold mt-3 text-slate-100">
              Stack & Backend Health Verification
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              This minimal application verifies Vite, React Router, Tailwind CSS, and Express API
              connectivity. Full product features will be planned with GSD.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Server className="w-4 h-4 text-slate-400" />
                Backend Connection Status
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchHealth}
                disabled={loading}
                className="gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Test Ping
              </Button>
            </div>

            {loading && (
              <div className="text-sm text-slate-400 py-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                Contacting backend health endpoint (/api/v1/health)...
              </div>
            )}

            {error && (
              <div className="bg-rose-950/40 border border-rose-900 text-rose-300 p-3 rounded text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Backend Unreachable: </span>
                  {error}
                </div>
              </div>
            )}

            {health && (
              <div className="bg-emerald-950/30 border border-emerald-900/60 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-2">
                  <CheckCircle className="w-4 h-4" />
                  Backend responding normally
                </div>
                <div className="font-mono text-xs text-slate-300 space-y-1 bg-slate-900/80 p-3 rounded border border-slate-800">
                  <div>
                    Status: <span className="text-emerald-400">{health.status}</span>
                  </div>
                  <div>
                    Service: <span className="text-sky-300">{health.service}</span>
                  </div>
                  <div>
                    Server Time: <span className="text-slate-400">{health.timestamp}</span>
                  </div>
                  <div>
                    Uptime: <span className="text-slate-400">{health.uptime.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="text-xs text-slate-400">Frontend</div>
              <div className="font-semibold text-sm text-slate-200 mt-0.5">React + Vite</div>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="text-xs text-slate-400">Styling</div>
              <div className="font-semibold text-sm text-slate-200 mt-0.5">Tailwind v4</div>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="text-xs text-slate-400">Backend</div>
              <div className="font-semibold text-sm text-slate-200 mt-0.5">Express + TS</div>
            </div>
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <div className="text-xs text-slate-400">ORM</div>
              <div className="font-semibold text-sm text-slate-200 mt-0.5">Prisma</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-800/80 pt-4">
        Ready for GSD Discovery & Requirements phase
      </footer>
    </div>
  );
};
