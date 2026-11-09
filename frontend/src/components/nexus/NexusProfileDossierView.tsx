import React, { useState } from 'react';
import {
  User,
  Shield,
  Award,
  Trophy,
  DollarSign,
  Cpu,
  Monitor,
  Activity,
  CheckCircle2,
  ExternalLink,
  Zap,
  Power,
  Lock,
  ChevronRight,
  Sliders,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from 'lucide-react';
import { View, Text, Pressable } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusProfileDossierProps {
  mode: ThemeMode;
  user?: {
    handle: string;
    email: string;
    role: string;
    tier?: string;
  };
  onLogout?: () => void;
}

export const NexusProfileDossierView: React.FC<NexusProfileDossierProps> = ({
  mode,
  user = {
    handle: 'GhostRecon',
    email: 'recon.vanguard@nexus.gg',
    role: 'Lead QA Specialist & Esports Competitor',
    tier: 'Diamond I · Level 42',
  },
  onLogout,
}) => {
  const [scrimReady, setScrimReady] = useState(true);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAction, setWalletAction] = useState<'withdraw' | 'deposit'>('withdraw');
  const [walletAmount, setWalletAmount] = useState('500');
  const [walletSuccess, setWalletSuccess] = useState('');

  const achievements = [
    { title: 'Grandmaster Tester', desc: '50+ verified studio bug reports', icon: Award, color: 'text-[#8B5CF6]' },
    { title: 'Bracket Champion', desc: 'NEXUS Cup IV 1st Place Squad', icon: Trophy, color: 'text-[#F59E0B]' },
    { title: 'Netcode Inspector', desc: '128Hz tick collision delta auditor', icon: Activity, color: 'text-[#22D3EE]' },
    { title: 'Zero-G Pioneer', desc: 'Eclipse Protocol Closed Beta cohort', icon: Zap, color: 'text-[#10B981]' },
  ];

  const handleWalletSubmit = () => {
    setWalletSuccess(`Successfully queued ${walletAction} of $${walletAmount} USD via Escrow.`);
    setTimeout(() => {
      setWalletSuccess('');
      setShowWalletModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-8" data-testid="nexus-profile-dossier-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#8B5CF6] font-bold">SCREEN 05</span>
            <span>/</span>
            <span className="text-[#22D3EE]">OPERATIVE DOSSIER</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">TELEMETRY WALLET</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Operative Dossier &amp; Escrow Telemetry
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="netcode" value="LEVEL 42 PRO" />
          <TelemetryPill variant="escrow" value="$4,850 USD ESCROW" />
        </div>
      </div>

      {/* Commander Dossier Profile Banner */}
      <GlassCard variant="glow" className="p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-0.5 shadow-[0_0_24px_rgba(139,92,246,0.5)] shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0B0D12] flex items-center justify-center font-display text-2xl font-bold text-white">
                {user.handle.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
                  {user.handle}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-[10px] font-bold">
                  VERIFIED OPERATIVE
                </span>
                <span className="font-mono text-[10px] text-[#8B5CF6] font-bold bg-[#8B5CF6]/15 px-2 py-0.5 rounded-full">
                  NEX-98214 // DEV_QA
                </span>
              </div>
              <p className="font-mono text-xs text-[#94A3B8]">
                {user.role} · {user.email}
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                <span className="text-[#22D3EE] font-bold">{user.tier || 'Diamond I'}</span>
                <span className="text-[#64748B]">·</span>
                <span className="text-[#F8FAFC]">XP 4,850 PTS</span>
              </div>
            </div>
          </div>

          {/* Scrim Status Toggle Switch (from Stitch profiles/code.html) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center justify-between gap-3 bg-[#0B0D12] px-4 py-3 rounded-2xl border border-[#181C26]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    scrimReady ? 'bg-[#10B981] animate-pulse' : 'bg-[#64748B]'
                  }`}
                />
                <span className="font-mono text-xs text-[#F8FAFC]">
                  {scrimReady ? 'Scrim & Telemetry Ready' : 'Node Scrim Standby'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScrimReady((s) => !s)}
                aria-label="Toggle scrim status"
                className={`w-10 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                  scrimReady ? 'bg-[#8B5CF6] justify-end' : 'bg-[#181C26] justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Escrow Balance Chip with Withdraw/Deposit buttons */}
            <div className="p-4 rounded-2xl bg-[#0B0D12] border border-[#181C26] space-y-1 min-w-[200px]">
              <span className="font-mono text-[10px] text-[#94A3B8] uppercase">
                ESCROW BOUNTY WALLET
              </span>
              <div className="font-display text-2xl font-bold text-[#F59E0B]">
                $4,850.00 <span className="text-xs font-mono text-[#CBD5E1]">USD</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setWalletAction('withdraw');
                    setShowWalletModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#181C26] hover:bg-[#8B5CF6] text-white font-mono text-[10px] font-semibold transition-colors flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3 h-3 text-[#22D3EE]" />
                  <span>Withdraw</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWalletAction('deposit');
                    setShowWalletModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#181C26] hover:bg-[#22D3EE] hover:text-[#0B0D12] text-white font-mono text-[10px] font-semibold transition-colors flex items-center gap-1"
                >
                  <ArrowDownLeft className="w-3 h-3 text-[#10B981]" />
                  <span>Deposit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 2-Column Split: Achievements & Rig Telemetry (6 Cols each) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Achievements Grid (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8B5CF6]" />
            <span>Tier Badges &amp; Accolades</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <GlassCard key={ach.title} className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#181C26] text-[#CBD5E1]">
                      <Icon className={`w-5 h-5 ${ach.color}`} />
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-[#F8FAFC]">
                        {ach.title}
                      </h4>
                      <p className="font-mono text-[10px] text-[#94A3B8] mt-0.5">
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Quick Menu Rows (from Stitch profiles/code.html) */}
          <GlassCard className="p-4 space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11141C] transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5 text-[#F8FAFC]">
                <Shield className="w-4 h-4 text-[#8B5CF6]" />
                <span>Account &amp; Hardware Security</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold text-[10px]">
                2FA ON
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#11141C] transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5 text-[#F8FAFC]">
                <Sliders className="w-4 h-4 text-[#22D3EE]" />
                <span>Node Telemetry Config</span>
              </div>
              <span className="text-[#64748B]">RIYADH-09</span>
            </div>
          </GlassCard>
        </div>

        {/* Rig & Connection Specs (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#22D3EE]" />
            <span>Hardware Rig &amp; Network Nodes</span>
          </h3>

          <GlassCard className="p-5 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-[#181C26]">
              <span className="text-[#94A3B8]">PRIMARY RIG</span>
              <span className="text-[#F8FAFC]">Intel Core i9-14900K · RTX 4090</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181C26]">
              <span className="text-[#94A3B8]">SYSTEM MEMORY</span>
              <span className="text-[#F8FAFC]">64GB DDR5 (6000 MHz)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181C26]">
              <span className="text-[#94A3B8]">DISPLAY REFRESH</span>
              <span className="text-[#22D3EE] font-bold">240Hz OLED (0.03ms GtG)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#181C26]">
              <span className="text-[#94A3B8]">MIDDLE EAST NODE</span>
              <span className="text-[#10B981] font-bold">Riyadh DC-01 (12ms ping)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[#94A3B8]">NETCODE TICK</span>
              <span className="text-[#8B5CF6] font-bold">128Hz Native UDP</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Escrow Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0B0D12] border border-[#181C26] p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#181C26] pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="font-display text-sm font-bold text-[#F8FAFC] uppercase">
                  Escrow Bounty {walletAction === 'withdraw' ? 'Withdrawal' : 'Deposit'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className="text-[#64748B] hover:text-[#F8FAFC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {walletSuccess ? (
              <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{walletSuccess}</span>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-[#94A3B8] block mb-1">AMOUNT IN USD</label>
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] text-[#F8FAFC] font-display font-bold text-lg focus:outline-none focus:border-[#8B5CF6]"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Available in Escrow: $4,850.00 USD
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowWalletModal(false)}
                    className="px-4 py-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWalletSubmit}
                    className="px-5 py-2 rounded-xl font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                  >
                    Confirm {walletAction === 'withdraw' ? 'Withdrawal' : 'Deposit'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
