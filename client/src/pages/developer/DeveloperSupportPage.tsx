import React, { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

interface SupportTicket {
  ticketId: string;
  category: string;
  subject: string;
  status: string;
  createdAt: string;
}

export const DeveloperSupportPage: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TECHNICAL");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadTickets() {
      try {
        const res = await apiRequest<{ status: string; data: { tickets: SupportTicket[] } }>(
          "/developer/support"
        );
        if (mounted && res.ok && res.data.data.tickets) {
          setTickets(res.data.data.tickets);
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadTickets();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setMsg({ type: "error", text: "Please enter both a ticket subject and details." });
      return;
    }

    try {
      setSubmitting(true);
      setMsg(null);
      const res = await apiRequest<{ status: string; data: SupportTicket }>("/developer/support", {
        method: "POST",
        body: JSON.stringify({ subject, category, description }),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "Ticket submitted. A developer relations lead will review it." });
        setTickets((prev) => [res.data.data, ...prev]);
        setSubject("");
        setDescription("");
      } else {
        setMsg({ type: "error", text: res.error });
      }
    } catch (err: any) {
      setMsg({
        type: "error",
        text: err.message || "Failed to submit support case.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#151F52]">
        <h1 className="font-headline text-2xl font-bold text-white tracking-tight">
          Support &amp; Disputes
        </h1>
        <p className="text-xs text-[#8796C0] mt-0.5">
          Submit technical issues, query escrow payout validations, or open dispute arbitration cases with platform administrators.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
              : "bg-[#1F122B] border border-amber-500/40 text-amber-200"
          }`}
        >
          <span>{msg.type === "success" ? "✅" : "ℹ️"}</span>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Ticket Creation Form */}
      <form onSubmit={handleSubmit} className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 lg:p-8 space-y-5 shadow-lg">
        <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
          Open Direct Support Case
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            >
              <option value="TECHNICAL">Technical Build / Telemetry Issue</option>
              <option value="ESCROW">Escrow Bounty &amp; Payments</option>
              <option value="TESTER_DISPUTE">Tester Conduct / NDA Violation</option>
              <option value="VERIFICATION">Commercial Verification Query</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Escrow milestone release query for Sprint 02"
              required
              className="w-full h-10 px-3.5 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#8796C0] mb-1.5">Case Description &amp; Context</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide relevant campaign identifiers, tester tags, error codes, and timeline details..."
            required
            className="w-full p-3 rounded-xl bg-[#091038] border border-[#182352] text-xs text-white focus:outline-none focus:border-[#5CB6F9]"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#233DFF] hover:bg-[#1E34DE] text-white text-xs font-headline font-bold transition shadow-lg disabled:opacity-50"
          >
            {submitting ? "Submitting Case..." : "Create Support Case"}
          </button>
        </div>
      </form>

      {/* Case History */}
      <div className="bg-[#070D38] border border-[#151F52] rounded-2xl p-6 space-y-4 shadow-lg">
        <h2 className="text-sm font-headline font-bold text-white uppercase tracking-wider border-b border-[#151F52] pb-2">
          Active &amp; Historical Cases ({tickets.length})
        </h2>
        {tickets.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#0E1B56] flex items-center justify-center text-lg text-[#5CB6F9]">
              💬
            </div>
            <div className="text-xs text-[#8796C0]">
              No support cases recorded yet. Correspondence and dispute status updates will appear here.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                className="p-4 rounded-xl bg-[#091038] border border-[#182352] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#5CB6F9]">{t.ticketId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0E1B56] text-[#CAE8FF]">
                      {t.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-headline font-bold text-white mt-1">{t.subject}</h3>
                  <span className="text-[10px] text-[#7F8FB8] font-mono">
                    Opened: {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
