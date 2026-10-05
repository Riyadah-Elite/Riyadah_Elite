import React, { useEffect, useState } from "react";
import { apiRequest, DeveloperFeedbackItem } from "../../lib/api";

export const DeveloperFeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<DeveloperFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string>("ALL");

  useEffect(() => {
    let mounted = true;
    async function loadFeedback() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiRequest<{
          status: string;
          data: { feedback: DeveloperFeedbackItem[] };
        }>("/developer/feedback");
        if (mounted) {
          if (res.ok) {
            setFeedback(res.data.data.feedback || []);
          } else {
            setError(res.error);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setError(
            err.message ||
              "Developer feedback API is scheduled for Phase 3B. Displaying telemetry review contract."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadFeedback();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = feedback.filter(
    (f) => catFilter === "ALL" || f.category === catFilter
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#151F52]">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#5CB6F9] uppercase tracking-widest">
            <span>QA TELEMETRY</span>
            <span>•</span>
            <span>VERIFIED SUBMISSIONS</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-white tracking-tight mt-1">
            Feedback &amp; Results
          </h1>
          <p className="text-xs text-[#8796C0] max-w-2xl mt-0.5">
            Review bug reports, crash logs, gameplay balancing feedback, and performance ratings submitted by verified elite playtesters.
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
        {["ALL", "BUG", "GAMEPLAY", "PERFORMANCE", "UX"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-medium transition ${
              catFilter === cat
                ? "bg-[#233DFF] text-white"
                : "text-[#8796C0] hover:text-[#CAE8FF]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8796C0]">Loading playtest feedback...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-[#070D38] border border-[#151F52] p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-2xl text-[#5CB6F9]">
            📝
          </div>
          <h2 className="text-base font-headline font-bold text-white">No Feedback Reports Filed</h2>
          <p className="text-xs text-[#8796C0] max-w-md mx-auto">
            Once enrolled players test your build, their verified feedback submissions will appear in this triage workspace.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#070D38] border border-[#151F52] p-5 space-y-3 hover:border-[#233DFF]/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0E1B56] text-[#5CB6F9] border border-[#233DFF]/30">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      item.severity === "CRITICAL"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "bg-[#091038] text-[#8796C0]"
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#7F8FB8]">
                  {item.submittedAt} · By {item.testerTag}
                </span>
              </div>

              <h2 className="text-sm font-headline font-bold text-white">{item.title}</h2>
              <p className="text-xs text-[#8796C0] leading-relaxed">{item.details}</p>

              <div className="pt-3 border-t border-[#151F52]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-400">
                  <span>★</span>
                  <span>{item.rating}/5 Rating</span>
                </div>
                <span className="text-[10px] font-mono text-[#5CB6F9]">Status: {item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
