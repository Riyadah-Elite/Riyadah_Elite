import React from "react";

export const CommunityRolesSection: React.FC = () => {
  return (
    <section className="w-full py-20 px-6 bg-[#050930]">
      <div className="max-w-[1380px] mx-auto flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-headline text-xs uppercase tracking-widest text-[#bcc2ff] font-bold">
            COMMUNITY ROLES
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#dfe0ff] mt-2 uppercase font-bold tracking-tight">
            BUILT FOR PLAYERS, CREATORS &amp; COMMUNITIES.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: GAMERS */}
          <div className="rounded-2xl bg-[#21274c]/60 backdrop-blur-xl p-8 sm:p-10 shadow-xl border border-[#444557]/30 flex flex-col justify-between hover:-translate-y-2 hover:border-[#5CB6F9]/50 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#233dff]/20 flex items-center justify-center text-[#bcc2ff] ring-1 ring-[#bcc2ff]/30 group-hover:scale-110 group-hover:bg-[#233dff] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[32px]">sports_esports</span>
              </div>
              <h3 className="font-headline text-2xl text-[#dfe0ff] uppercase font-bold group-hover:text-[#92ccff] transition-colors">
                GAMERS
              </h3>
              <p className="font-body text-base text-[#c5c5da] leading-relaxed">
                Test cutting-edge titles before public release, compete against peers in scheduled
                brackets, form squads, and earn verified status in the global gaming ecosystem.
              </p>
            </div>
            <div className="pt-8">
              <a
                href="#games"
                className="text-xs font-headline text-[#92ccff] uppercase tracking-wider font-semibold group-hover:underline flex items-center gap-1"
              >
                Discover Beta Drops &amp; Tournaments{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 2: DEVELOPERS & STUDIOS */}
          <div className="rounded-2xl bg-[#21274c]/60 backdrop-blur-xl p-8 sm:p-10 shadow-xl border border-[#444557]/30 flex flex-col justify-between hover:-translate-y-2 hover:border-[#5CB6F9]/50 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#3698d9]/20 flex items-center justify-center text-[#92ccff] ring-1 ring-[#92ccff]/30 group-hover:scale-110 group-hover:bg-[#3698d9] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[32px]">code</span>
              </div>
              <h3 className="font-headline text-2xl text-[#dfe0ff] uppercase font-bold group-hover:text-[#92ccff] transition-colors">
                DEVELOPERS &amp; STUDIOS
              </h3>
              <p className="font-body text-base text-[#c5c5da] leading-relaxed">
                From indie teams to scale studios, run structured testing cohorts, squash
                game-breaking bugs, benchmark hardware performance, and tune gameplay balance.
              </p>
            </div>
            <div className="pt-8">
              <a
                href="#developers"
                className="text-xs font-headline text-[#92ccff] uppercase tracking-wider font-semibold group-hover:underline flex items-center gap-1"
              >
                Onboard Your Game Studio{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          {/* Card 3: TOURNAMENT HOSTS */}
          <div className="rounded-2xl bg-[#21274c]/60 backdrop-blur-xl p-8 sm:p-10 shadow-xl border border-[#444557]/30 flex flex-col justify-between hover:-translate-y-2 hover:border-[#5CB6F9]/50 hover:shadow-[0_15px_30px_rgba(5,10,48,0.8),0_0_20px_rgba(92,182,249,0.25)] transition-all duration-300 group">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#233dff]/20 flex items-center justify-center text-[#233dff] ring-1 ring-[#233dff]/30 group-hover:scale-110 group-hover:bg-[#233dff] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-[32px]">hub</span>
              </div>
              <h3 className="font-headline text-2xl text-[#dfe0ff] uppercase font-bold group-hover:text-[#92ccff] transition-colors">
                TOURNAMENT HOSTS
              </h3>
              <p className="font-body text-base text-[#c5c5da] leading-relaxed">
                College clubs, gaming cafes, streamer communities, and grassroots esports organizers
                power matches with zero overhead, automatic brackets, and dispute resolution.
              </p>
            </div>
            <div className="pt-8">
              <a
                href="#tournaments"
                className="text-xs font-headline text-[#92ccff] uppercase tracking-wider font-semibold group-hover:underline flex items-center gap-1"
              >
                Launch Community Brackets{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
