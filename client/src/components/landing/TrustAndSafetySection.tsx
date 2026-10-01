import React from "react";

export const TrustAndSafetySection: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#13183d]">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#92ccff] font-bold">
            INTEGRITY FIRST
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            BUILT FOR FAIR PLAY.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/20 hover:border-[#92ccff]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 text-center items-center group">
            <div className="w-12 h-12 rounded-full bg-[#233dff]/20 flex items-center justify-center text-[#bcc2ff] group-hover:bg-[#bcc2ff] group-hover:text-[#00169d] transition-all">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <h4 className="font-headline text-base text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
              Verified Game Developers
            </h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Every testing campaign and studio lead is manually authenticated to prevent
              counterfeit builds.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/20 hover:border-[#92ccff]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 text-center items-center group">
            <div className="w-12 h-12 rounded-full bg-[#3698d9]/20 flex items-center justify-center text-[#92ccff] group-hover:bg-[#92ccff] group-hover:text-[#003351] transition-all">
              <span className="material-symbols-outlined text-[24px]">lock</span>
            </div>
            <h4 className="font-headline text-base text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
              Secure Player Accounts
            </h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Multi-factor security, steam ID linking, and hardware fingerprinting keep profiles
              protected.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/20 hover:border-[#92ccff]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 text-center items-center group">
            <div className="w-12 h-12 rounded-full bg-[#233dff]/20 flex items-center justify-center text-[#bcc2ff] group-hover:bg-[#bcc2ff] group-hover:text-[#00169d] transition-all">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
            <h4 className="font-headline text-base text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
              Fair Competition Standards
            </h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Standardized tournament rulebooks and automated check-ins eliminate match
              manipulation.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/20 hover:border-[#92ccff]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 text-center items-center group">
            <div className="w-12 h-12 rounded-full bg-[#3698d9]/20 flex items-center justify-center text-[#92ccff] group-hover:bg-[#92ccff] group-hover:text-[#003351] transition-all">
              <span className="material-symbols-outlined text-[24px]">shield</span>
            </div>
            <h4 className="font-headline text-base text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
              Community Moderation
            </h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              Active match adjudicators and behavior scoring ensure toxic-free competitive play.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-2xl bg-[#21274c]/50 backdrop-blur-md border border-[#444557]/20 hover:border-[#92ccff]/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col gap-3 text-center items-center group">
            <div className="w-12 h-12 rounded-full bg-[#446073]/30 flex items-center justify-center text-[#adcae1] group-hover:bg-[#adcae1] group-hover:text-[#153345] transition-all">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <h4 className="font-headline text-base text-[#dfe0ff] font-bold group-hover:text-[#92ccff] transition-colors">
              Transparent Results
            </h4>
            <p className="text-xs text-[#c5c5da] leading-relaxed">
              All bracket matches and prize pool escrow settlements are immutable and publicly
              auditable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
