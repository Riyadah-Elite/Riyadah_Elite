import React, { useState, useEffect, useRef } from "react";

export const PlatformStatisticsSection: React.FC = () => {
  const [countersTriggered, setCountersTriggered] = useState(false);
  const [gamersCount, setGamersCount] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersTriggered) {
            setCountersTriggered(true);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [countersTriggered]);

  useEffect(() => {
    if (!countersTriggered) return;

    const animateNumber = (target: number, setter: (val: number) => void) => {
      let start = 0;
      const steps = 40;
      const stepTime = 35;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, stepTime);
    };

    animateNumber(10, setGamersCount);
    animateNumber(250, setGamesCount);
    animateNumber(500, setTournamentsCount);
    animateNumber(50, setMatchesCount);
  }, [countersTriggered]);

  return (
    <section className="w-full py-16 px-6 bg-[#0a0f35]" ref={sectionRef}>
      <div className="max-w-[1380px] mx-auto rounded-2xl bg-[#21274c]/70 backdrop-blur-xl p-8 sm:p-12 shadow-xl border border-[#444557]/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Metric 1 */}
          <div className="flex flex-col gap-1 group">
            <span className="font-headline text-4xl sm:text-5xl text-[#bcc2ff] font-bold group-hover:scale-105 transition-transform">
              {gamersCount}K+
            </span>
            <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-semibold">
              Gamers Active
            </span>
            <span className="text-xs text-[#c5c5da] font-headline uppercase">
              Global Testers &amp; Players
            </span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col gap-1 group">
            <span className="font-headline text-4xl sm:text-5xl text-[#92ccff] font-bold group-hover:scale-105 transition-transform">
              {gamesCount}+
            </span>
            <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-semibold">
              Games Tested
            </span>
            <span className="text-xs text-[#c5c5da] font-headline uppercase">
              Alphas, Betas &amp; Playtests
            </span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col gap-1 group">
            <span className="font-headline text-4xl sm:text-5xl text-[#bcc2ff] font-bold group-hover:scale-105 transition-transform">
              {tournamentsCount}+
            </span>
            <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-semibold">
              Tournaments
            </span>
            <span className="text-xs text-[#c5c5da] font-headline uppercase">
              Community &amp; Pro Cups
            </span>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col gap-1 group">
            <span className="font-headline text-4xl sm:text-5xl text-[#92ccff] font-bold group-hover:scale-105 transition-transform">
              {matchesCount}K+
            </span>
            <span className="font-headline text-lg sm:text-xl text-[#dfe0ff] font-semibold">
              Matches Played
            </span>
            <span className="text-xs text-[#c5c5da] font-headline uppercase">
              Verified Competition Matches
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
