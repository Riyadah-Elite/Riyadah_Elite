export default function TournamentsDiscoveryPage() {
  return (
    <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)]">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-primary-container/20 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-96 right-10 w-[420px] h-[420px] bg-secondary-container/15 rounded-full blur-[160px] pointer-events-none -z-10" />
          
          <div className="max-w-container-max mx-auto px-gutter w-full flex flex-col gap-space-2xl pb-space-3xl pt-space-md">
            {/* Header & Discovery Hero Search */}
            <section className="flex flex-col gap-space-lg">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  <a className="hover:text-secondary transition-colors" href="/">Home</a>
                  <span className="text-outline-variant">/</span>
                  <a className="hover:text-secondary transition-colors" href="/tournaments">Tournaments</a>
                  <span className="text-outline-variant">/</span>
                  <span className="text-secondary font-bold">Live Events</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-xl">
                <div className="flex flex-col gap-space-xs max-w-2xl">
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    ACTIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary-fixed to-primary">TOURNAMENTS</span>
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                    Compete in officially sanctioned tournaments, rise up the leaderboards, and win real prizes.
                  </p>
                </div>
              </div>
            </section>

            {/* Empty State Grid */}
            <section className="flex flex-col gap-space-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-lg" id="tournament-cards-container">
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface-container-low/50 rounded-2xl border border-surface-container-high border-dashed">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-4 opacity-50">emoji_events</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">No Active Tournaments</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">There are currently no active tournaments. Stay tuned for upcoming events.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
