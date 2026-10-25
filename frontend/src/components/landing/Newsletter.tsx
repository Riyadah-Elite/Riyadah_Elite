import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';


export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('idle');
      setMessage('Newsletter dispatch API is scheduled for Phase 1 backend rollout. Email recorded locally for staging testing.');
      setEmail('');
    }, 500);
  };

  return (
    <section className="w-full py-16 px-6 md:px-12 bg-white border-t border-neutral-100">
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#F8FCFF] border border-cyan-200/80 p-8 md:p-12 text-center relative overflow-hidden shadow-xs">
        {/* Top gamified perk chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
          <span>🪙 +50 PLAYTESTER COINS ON JOIN</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-[#172B3A] mb-3 tracking-tight">
          Stay Ahead of Playtest Drops & Tournaments
        </h3>
        <p className="text-sm sm:text-base text-[#5B7083] max-w-lg mx-auto mb-8 leading-relaxed">
          Get weekly alpha drop alerts, exclusive studio key batches, and tournament bracket announcements delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your gamer or studio email"
            className="flex-1 px-4 py-3.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#0891B2] text-xs text-[#172B3A] bg-white font-medium"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3.5 rounded-xl bg-[#0891B2] hover:bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-cyan-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === 'loading' ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Subscribe</span>
                <Ionicons name="paper-plane-outline" size={14} color="white" />
              </>
            )}
          </button>
        </form>

        {message && status !== 'error' && (
          <p className="text-xs font-semibold text-[#0891B2] mt-4 bg-cyan-50 py-2 px-4 rounded-lg inline-block border border-cyan-200">
            {message}
          </p>
        )}
        {status === 'error' && (
          <p className="text-xs font-bold text-red-600 mt-4 bg-red-50 py-2 px-4 rounded-lg inline-block border border-red-200">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
