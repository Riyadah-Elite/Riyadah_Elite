import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/context/AuthContext';

export function AuthModal() {
  const { authModal, closeAuthModal, login, registerUser, isLoading, authError, clearError } = useAuth();
  const [activeTabOverride, setActiveTabOverride] = useState<'login' | 'register' | null>(null);
  const tab = activeTabOverride ?? authModal.mode;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleTabChange = (newTab: 'login' | 'register') => {
    setActiveTabOverride(newTab);
    clearError();
  };

  // Handle escape key
  useEffect(() => {
    if (!authModal.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [authModal.isOpen, closeAuthModal]);

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (tab === 'login') {
      await login({ email, password });
    } else {
      await registerUser({ username, email, password });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#DCE8F0] shadow-2xl p-6 sm:p-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#08A8C8] to-[#36D9EE] flex items-center justify-center text-white font-black text-sm shadow-xs">
              R
            </div>
            <span className="font-mono text-xs font-bold text-[#647B91] uppercase tracking-wider">
              RIYADAH AUTH GATE
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full text-[#647B91] hover:text-[#14283A] hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <Ionicons name="close" size={20} color="#647B91" />
          </button>
        </div>

        {/* Tournament Registration Context Alert */}
        {authModal.tournamentContext && (
          <div className="mb-6 p-4 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-[#08A8C8] flex items-center justify-center shrink-0 mt-0.5">
              <Ionicons name="trophy-outline" size={18} color="#08A8C8" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#14283A] uppercase tracking-wide">
                Tournament Registration Gated
              </p>
              <p className="text-xs text-[#647B91] mt-0.5 leading-relaxed">
                Authentication is required to register squad roster for{' '}
                <strong className="text-[#08A8C8]">{authModal.tournamentContext}</strong>.
              </p>
            </div>
          </div>
        )}

        <h3 id="auth-modal-title" className="text-2xl font-black text-[#14283A] tracking-tight mb-2">
          {tab === 'login' ? 'Sign In to Your Account' : 'Create Playtester Profile'}
        </h3>
        <p className="text-xs text-[#647B91] mb-6 leading-relaxed">
          {tab === 'login'
            ? 'Access your tournament brackets, test waves, and verified telemetry rewards.'
            : 'Join the community of verified testers, studios, and competitive tournament squads.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#F4FAFE] p-1 border border-[#DCE8F0] mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-[#14283A] shadow-xs'
                : 'text-[#647B91] hover:text-[#14283A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-[#14283A] shadow-xs'
                : 'text-[#647B91] hover:text-[#14283A]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
            <span className="font-medium">{authError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#14283A] mb-1.5 uppercase tracking-wide">
                Username / Gamer Tag
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. ApexPredator"
                className="w-full px-4 py-3 rounded-xl border border-[#DCE8F0] text-sm text-[#14283A] placeholder-[#94A3B8] focus:outline-none focus:border-[#08A8C8] focus:ring-1 focus:ring-[#08A8C8] transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#14283A] mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gamer@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#DCE8F0] text-sm text-[#14283A] placeholder-[#94A3B8] focus:outline-none focus:border-[#08A8C8] focus:ring-1 focus:ring-[#08A8C8] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14283A] mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              maxLength={20}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#DCE8F0] text-sm text-[#14283A] placeholder-[#94A3B8] focus:outline-none focus:border-[#08A8C8] focus:ring-1 focus:ring-[#08A8C8] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#08A8C8] hover:bg-[#0790AC] disabled:opacity-50 text-white shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs font-semibold text-[#647B91] hover:text-[#14283A] transition-colors cursor-pointer"
          >
            Cancel and continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}
