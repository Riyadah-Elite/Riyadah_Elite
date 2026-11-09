import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Shield,
  Fingerprint,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Zap,
  Key,
  Smartphone,
  ChevronLeft,
  Activity,
  Layers,
} from 'lucide-react';
import { View, Text, Pressable, TextInput, SafeAreaView } from '../../components/primitives';
import { TelemetryPill } from '../../components/common/TelemetryPill';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GlassCard } from '../../components/common/GlassCard';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | '2fa'>('login');
  const [loginEmail, setLoginEmail] = useState('ghost.spectre@nexus.net');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [rememberSession, setRememberSession] = useState(true);

  const [regCallsign, setRegCallsign] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regRole, setRegRole] = useState<'Gamer & Playtester' | 'Game Developer' | 'Esports Organizer'>(
    'Gamer & Playtester'
  );

  const [otp, setOtp] = useState(['8', '4', '2', '1', '9', '0']);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginEmail) return;
    setActiveTab('2fa');
  };

  const handleRegisterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!regEmail || !regCallsign) return;
    setActiveTab('2fa');
  };

  const handleBiometricAuthenticate = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setAuthSuccessMsg('Biometric Node Authenticated · Telemetry Stream Active');
      try {
        const user = {
          handle: regCallsign || 'GhostRecon',
          email: regEmail || loginEmail || 'operator@riyadahelite.gg',
          role: regRole,
          tier: 'Apex Verifier',
        };
        localStorage.setItem('riyadah_user', JSON.stringify(user));
        localStorage.setItem('riyadah_auth_token', 'op_tok_' + Date.now());
      } catch {}
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }, 1200);
  };

  const handleOtpConfirm = () => {
    setBiometricSuccess(true);
    setAuthSuccessMsg('TOTP Session Validated · Entering Arena');
    try {
      const user = {
        handle: regCallsign || 'GhostRecon',
        email: regEmail || loginEmail || 'operator@riyadahelite.gg',
        role: regRole,
        tier: 'Apex Verifier',
      };
      localStorage.setItem('riyadah_user', JSON.stringify(user));
      localStorage.setItem('riyadah_auth_token', 'op_tok_' + Date.now());
    } catch {}
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <SafeAreaView className="min-h-screen bg-[#0B0D12] text-[#F8FAFC]">
      {/* Top Scrim Navigation Bar */}
      <header className="sticky top-0 z-50 h-16 w-full px-6 lg:px-12 bg-[#0B0D12]/90 backdrop-blur-xl border-b border-[#181C26] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Pressable
            onPress={() => router.push('/')}
            className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#8B5CF6]" />
            <span>Return to Arena Hub</span>
          </Pressable>
          <span className="hidden sm:inline text-[#181C26]">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22D3EE] animate-pulse" />
            <span className="font-mono text-xs text-[#22D3EE] font-bold">NODE 09_ONLINE</span>
            <span className="text-[#64748B] text-xs">/</span>
            <span className="font-mono text-xs text-[#94A3B8]">128Hz KERNEL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="fps" value="240 FPS STABLE" />
          <TelemetryPill variant="escrow" value="ESCROW LOCKED" />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header Title & Artboard Spec */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
              <span className="text-[#8B5CF6] font-bold">NEXUS SECURE GATEWAY</span>
              <span>/</span>
              <span className="text-[#22D3EE]">HARDWARE ENCLAVE</span>
              <span>/</span>
              <span className="text-[#F8FAFC]">ARTBOARD 01</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
              Operative Authentication &amp; Biometric Node
            </h1>
          </div>

          {/* Mobile / Tablet Tab Switcher */}
          <div className="flex lg:hidden p-1 rounded-xl bg-[#11141C] border border-[#181C26]">
            {(['login', 'register', '2fa'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold capitalize transition-colors ${
                  activeTab === t ? 'bg-[#8B5CF6] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {t === 'login' ? 'Sign In' : t === 'register' ? 'Register' : '2FA Enclave'}
              </button>
            ))}
          </div>
        </div>

        {authSuccessMsg ? (
          <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/50 text-[#10B981] flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="font-mono text-xs font-bold">{authSuccessMsg}</span>
            </div>
            <span className="font-mono text-[10px] text-[#A7F3D0]">Redirecting to Dashboard...</span>
          </div>
        ) : null}

        {/* 3-Column Desktop Grid / 1-Column Responsive Mode */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* PANEL A: SIGN IN (MODAL A) */}
          <div
            className={`transition-opacity ${
              activeTab !== 'login' && 'hidden lg:block lg:opacity-60 lg:hover:opacity-100'
            }`}
          >
            <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#8B5CF6]" />
                  <span className="font-display font-extrabold text-sm uppercase text-[#F8FAFC]">
                    NEXUS GATEWAY
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#11141C] text-[#22D3EE] border border-[#22D3EE]/30 font-bold">
                  OPERATIVE LOGIN
                </span>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Welcome Back, Operator</h2>
                <p className="font-mono text-xs text-[#94A3B8] mt-1">
                  Authenticate node to sync telemetry &amp; ladder brackets.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>OPERATOR ID / EMAIL</span>
                  </label>
                  <TextInput
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    placeholder="callsign@nexus.net"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>AUTH TOKEN / PASSPHRASE</span>
                  </label>
                  <TextInput
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded bg-[#0B0D12] border-[#181C26] text-[#8B5CF6]"
                    />
                    <span>Remember Node</span>
                  </label>
                  <button type="button" className="text-[#8B5CF6] hover:underline text-[11px]">
                    Reset Token?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                >
                  <span>Enter Nexus Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </div>

          {/* PANEL B: REGISTRATION (MODAL B) */}
          <div
            className={`transition-opacity ${
              activeTab !== 'register' && 'hidden lg:block lg:opacity-60 lg:hover:opacity-100'
            }`}
          >
            <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#22D3EE]" />
                  <span className="font-display font-extrabold text-sm uppercase text-[#F8FAFC]">
                    JOIN CORPS
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#11141C] text-[#8B5CF6] border border-[#8B5CF6]/30 font-bold">
                  NEW RECRUIT
                </span>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Enlist Operative Node</h2>
                <p className="font-mono text-xs text-[#94A3B8] mt-1">
                  Deploy verified telemetry rig &amp; unlock bounty escrow.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>OPERATIVE CALLSIGN</span>
                  </label>
                  <TextInput
                    value={regCallsign}
                    onChangeText={setRegCallsign}
                    placeholder="e.g. Spectre_Zero"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>NEURAL LINK / EMAIL</span>
                  </label>
                  <TextInput
                    value={regEmail}
                    onChangeText={setRegEmail}
                    placeholder="spectre@nexus.gg"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>LADDER PASSCODE</span>
                  </label>
                  <TextInput
                    value={regPasscode}
                    onChangeText={setRegPasscode}
                    secureTextEntry
                    placeholder="Minimum 8 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8]">DIVISION ASSIGNMENT</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Gamer & Playtester', 'Game Developer', 'Esports Organizer'] as const).map(
                      (roleOption) => (
                        <button
                          key={roleOption}
                          type="button"
                          onClick={() => setRegRole(roleOption)}
                          className={`p-2 rounded-xl font-mono text-[10px] text-center border transition-colors ${
                            regRole === roleOption
                              ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white font-bold'
                              : 'bg-[#0B0D12] border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC]'
                          }`}
                        >
                          {roleOption.split(' ')[0]}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#22D3EE] hover:bg-[#06B6D4] text-[#0B0D12] transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                >
                  <span>Register Operative Node</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </GlassCard>
          </div>

          {/* PANEL C: 2FA BIOMETRIC ENCLAVE (MODAL C) */}
          <div
            className={`transition-opacity ${
              activeTab !== '2fa' && 'hidden lg:block lg:opacity-60 lg:hover:opacity-100'
            }`}
          >
            <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6 text-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-[#22D3EE]" />
                  <span className="font-display font-extrabold text-sm uppercase text-[#F8FAFC]">
                    NEURAL LINK 2FA
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#11141C] text-[#10B981] border border-[#10B981]/30 font-bold">
                  HARDWARE KEY
                </span>
              </div>

              <div>
                <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Biometric Handshake</h2>
                <p className="font-mono text-xs text-[#94A3B8] mt-1">
                  Verify cryptographic key or biometric sensor to complete node handshake.
                </p>
              </div>

              {/* Biometric Interactive Button */}
              <div className="flex flex-col items-center justify-center py-2">
                <button
                  type="button"
                  onClick={handleBiometricAuthenticate}
                  disabled={biometricScanning || biometricSuccess}
                  className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all ${
                    biometricSuccess
                      ? 'bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] shadow-[0_0_24px_rgba(16,185,129,0.5)]'
                      : biometricScanning
                      ? 'bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] text-[#8B5CF6] animate-pulse shadow-[0_0_24px_rgba(139,92,246,0.5)]'
                      : 'bg-[#0B0D12] border border-[#181C26] text-[#94A3B8] hover:border-[#22D3EE]/70 hover:text-[#22D3EE]'
                  }`}
                >
                  {biometricSuccess ? (
                    <CheckCircle2 className="w-12 h-12" />
                  ) : (
                    <Fingerprint className="w-12 h-12" />
                  )}
                </button>
                <p className="font-mono text-xs text-[#CBD5E1] mt-3">
                  {biometricScanning
                    ? 'SCANNING BIOMETRIC ENCLAVE...'
                    : biometricSuccess
                    ? 'NODE AUTHENTICATED'
                    : 'Tap Fingerprint / WebAuthn Sensor'}
                </p>
              </div>

              {/* 6-Digit TOTP Matrix */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                  OR ENTER 6-DIGIT TOTP TOKEN
                </span>
                <div className="flex justify-center gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      value={d}
                      readOnly
                      className="w-9 h-11 rounded-lg bg-[#0B0D12] border border-[#181C26] text-center font-mono text-base font-bold text-[#22D3EE]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleOtpConfirm}
                className="w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(139,92,246,0.35)]"
              >
                <span>Authorize &amp; Enter Nexus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>
          </div>
        </div>
      </main>
    </SafeAreaView>
  );
}

