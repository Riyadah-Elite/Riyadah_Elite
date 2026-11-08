import React, { useState } from 'react';
import { X, Shield, Fingerprint, Lock, Mail, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { View, Text, Pressable, TextInput } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import surfaceStyles from '../../styles/SurfaceEffects.module.css';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: ThemeMode;
  initialTab?: 'login' | 'register' | '2fa';
  onSuccess?: (user: { handle: string; email: string; role: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode = 'dark',
  initialTab = 'login',
  onSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | '2fa'>(initialTab);
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Gamer & Playtester' | 'Game Developer' | 'Esports Organizer'>(
    'Gamer & Playtester'
  );
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulateBiometric = () => {
    setBiometricScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricVerified(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            handle: handle || 'GhostRecon',
            email: email || 'tester@riyadahelite.gg',
            role,
          });
        }
        onClose();
      }, 700);
    }, 1200);
  };

  const handleOtpChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5 && typeof document !== 'undefined') {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tab === 'login') {
      if (!email) {
        setErrorMsg('Please enter your gamer handle or email.');
        return;
      }
      setTab('2fa');
    } else if (tab === 'register') {
      if (!email || !handle) {
        setErrorMsg('Please enter both your handle and email.');
        return;
      }
      setTab('2fa');
    } else {
      if (onSuccess) {
        onSuccess({
          handle: handle || 'GhostRecon',
          email: email || 'tester@riyadahelite.gg',
          role,
        });
      }
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-[#0B0D12] border border-[#181C26] shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden ${surfaceStyles.claymorphicCard}`}
      >
        {/* Top Header Scrim Bar */}
        <div className="h-10 px-4 bg-[#11141C] border-b border-[#181C26] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="ml-3 font-mono text-[10px] text-[#94A3B8] tracking-widest uppercase">
              KERNEL ENCLAVE ACCESS v4.2
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#64748B] hover:text-[#F8FAFC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Title & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] font-mono text-[10px] font-bold uppercase tracking-wider">
                  NEXUS AUTH
                </span>
                <span className="text-[#64748B] font-mono text-xs">TIER-1 SECURITY</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1 tracking-tight">
                {tab === 'login' && 'Sign In to Arena'}
                {tab === 'register' && 'Create Operative Dossier'}
                {tab === '2fa' && 'Hardware Biometric Challenge'}
              </h2>
            </div>

            {/* Tab Switcher */}
            {tab !== '2fa' && (
              <div className="inline-flex p-1 rounded-xl bg-[#11141C] border border-[#181C26]">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors ${
                    tab === 'login'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg('');
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-colors ${
                    tab === 'register'
                      ? 'bg-[#8B5CF6] text-white'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {errorMsg ? (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#FCA5A5] font-mono text-xs">
              {errorMsg}
            </div>
          ) : null}

          {/* Form Content */}
          {tab === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>GAMER HANDLE OR ENCRYPTED EMAIL</span>
                </label>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="e.g. ghost_recon@nexus.gg"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>PASSPHRASE</span>
                </label>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(139,92,246,0.4)]"
              >
                <span>Authorize Terminal Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>OPERATIVE GAMER TAG</span>
                </label>
                <TextInput
                  value={handle}
                  onChangeText={setHandle}
                  placeholder="e.g. Nadia_Vanguard"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>COMMUNICATION EMAIL</span>
                </label>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="nadia@studios.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8]">ECOSYSTEM ROLE</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Gamer & Playtester', 'Game Developer', 'Esports Organizer'] as const).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-2 rounded-xl font-mono text-[11px] text-center transition-colors border ${
                          role === r
                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white font-semibold'
                            : 'bg-[#11141C] border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        {r.split(' ')[0]}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12] transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
              >
                <span>Register Operative Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {tab === '2fa' && (
            <div className="space-y-6 text-center">
              {/* Biometric Scanner Visual */}
              <div className="flex flex-col items-center justify-center py-4">
                <button
                  type="button"
                  onClick={handleSimulateBiometric}
                  disabled={biometricScanning || biometricVerified}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all ${
                    biometricVerified
                      ? 'bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] shadow-[0_0_24px_rgba(16,185,129,0.5)]'
                      : biometricScanning
                      ? 'bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] text-[#8B5CF6] animate-pulse shadow-[0_0_24px_rgba(139,92,246,0.5)]'
                      : 'bg-[#11141C] border border-[#181C26] text-[#94A3B8] hover:border-[#8B5CF6]/60 hover:text-[#8B5CF6]'
                  }`}
                >
                  {biometricVerified ? (
                    <CheckCircle2 className="w-12 h-12" />
                  ) : (
                    <Fingerprint className="w-12 h-12" />
                  )}
                </button>
                <p className="font-mono text-xs text-[#CBD5E1] mt-3">
                  {biometricScanning
                    ? 'SCANNING BIOMETRIC ENCLAVE...'
                    : biometricVerified
                    ? 'BIOMETRIC CREDENTIAL VERIFIED'
                    : 'Click TouchID / Fingerprint to Authenticate'}
                </p>
              </div>

              {/* 6-Digit OTP Alternative */}
              <div className="space-y-2">
                <p className="font-mono text-xs text-[#94A3B8]">OR ENTER 6-DIGIT TOTP TOKEN</p>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      className="w-10 h-12 rounded-xl bg-[#11141C] border border-[#181C26] text-center font-mono text-base font-bold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-mono text-xs text-[#64748B] hover:text-[#94A3B8]"
                >
                  Back to Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-sm"
                >
                  Confirm 2FA
                </button>
              </div>
            </div>
          )}

          {/* Social Auth Strip */}
          {tab !== '2fa' && (
            <div className="pt-4 border-t border-[#181C26] text-center">
              <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
                OR FEDERATE VIA GAMING PLATFORM
              </span>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {['Steam', 'Discord', 'Epic', 'Google'].map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => {
                      if (onSuccess) {
                        onSuccess({
                          handle: `${provider}_Operative`,
                          email: `${provider.toLowerCase()}@nexus.gg`,
                          role,
                        });
                      }
                      onClose();
                    }}
                    className="py-2 px-3 rounded-xl bg-[#11141C] border border-[#181C26] hover:bg-[#181C26] font-mono text-xs text-[#CBD5E1] transition-colors"
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

