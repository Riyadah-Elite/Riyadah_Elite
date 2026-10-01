import React from "react";

export const TournamentHostCTA: React.FC = () => {
  return (
    <section className="w-full py-16 px-6 bg-[#050A30]">
      <div className="max-w-[1380px] mx-auto rounded-3xl bg-[#21274c]/40 backdrop-blur-xl p-8 sm:p-12 shadow-xl border border-[#444557]/30 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
              ORGANIZER SUITE
            </span>
            <h3 className="font-headline text-2xl sm:text-3xl text-[#dfe0ff] uppercase mt-2 font-bold tracking-tight">
              GOT A COMMUNITY? HOST A TOURNAMENT.
            </h3>
            <p className="font-body text-base text-[#c5c5da] mt-2 max-w-xl leading-relaxed">
              Streamers, colleges, and gaming cafes run automated brackets with guaranteed check-ins
              and fair matchmaking.
            </p>
          </div>
          <a
            className="btn-shimmer px-8 py-3.5 rounded-xl bg-[#233dff] text-white font-headline text-sm font-bold shadow-[0_4px_20px_rgba(35,61,255,0.4)] hover:shadow-[0_0_25px_rgba(35,61,255,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap self-start md:self-auto cursor-pointer"
            href="#tournaments"
          >
            Host a Tournament{" "}
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </a>
        </div>

        {/* Horizontal 4-Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:-translate-y-1 transition-all space-y-1.5">
            <span className="font-headline text-2xl text-[#bcc2ff] font-bold">01</span>
            <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">Create Bracket</h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Select Single, Double Elim, or Round Robin formats.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:-translate-y-1 transition-all space-y-1.5">
            <span className="font-headline text-2xl text-[#92ccff] font-bold">02</span>
            <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">Invite Players</h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Share custom entry links with automated discord role sync.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:-translate-y-1 transition-all space-y-1.5">
            <span className="font-headline text-2xl text-[#bcc2ff] font-bold">03</span>
            <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">Run Matches</h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Track automated screenshot submissions and referee calls.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-[#050930]/80 border border-[#444557]/20 hover:border-[#92ccff]/50 hover:-translate-y-1 transition-all space-y-1.5">
            <span className="font-headline text-2xl text-[#92ccff] font-bold">04</span>
            <h4 className="font-headline text-sm text-[#dfe0ff] font-semibold">Crown Winner</h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Disburse prize pools instantly and publish permanent leaderboards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
