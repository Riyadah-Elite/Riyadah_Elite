import React, { useState, useEffect } from 'react';
import {
  Bug,
  Upload,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Monitor,
  Shield,
  FileText,
  Hash,
  ArrowRight,
  Plus,
  Trash2,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react';
import { View, Text, Pressable, TextInput } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { BugReportItem, GameItem, calculateBugReportPoints } from '../../utils/ecosystemRules';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusBugReportingProps {
  mode: ThemeMode;
  games?: GameItem[];
  preselectedGameId?: string;
  onSubmitBug: (report: {
    gameId: string;
    title: string;
    severity: BugReportItem['severity'];
    category: BugReportItem['category'];
    reproductionSteps: string;
    expectedResult: string;
    actualResult: string;
  }) => void;
  recentBugReports?: BugReportItem[];
}

export const NexusBugReportingView: React.FC<NexusBugReportingProps> = ({
  mode,
  games = [],
  preselectedGameId,
  onSubmitBug,
  recentBugReports = [],
}) => {
  const [gameId, setGameId] = useState(preselectedGameId || (games[0]?.id || 'game-eclipse-protocol'));
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<BugReportItem['severity']>('Critical');
  const [category, setCategory] = useState<BugReportItem['category']>('Network / Desync');
  const [steps, setSteps] = useState([
    'Launch CyberPulse / Eclipse Protocol test build at 128Hz netcode',
    'Execute crouch-slide toward the Sector-7 airlock barrier at 240 FPS',
    'Observe character capsule geometry clipping through door collision mesh',
  ]);
  const [expectedBehavior, setExpectedBehavior] = useState('Capsule collision barrier stops player slide cleanly.');
  const [actualBehavior, setActualBehavior] = useState('Character slides through barrier and falls under the level geometry.');
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastProgress, setToastProgress] = useState(100);

  const estimatedPoints = calculateBugReportPoints(severity);

  // Auto-close toast timer
  useEffect(() => {
    if (!toastVisible) return;
    const interval = setInterval(() => {
      setToastProgress((prev) => {
        if (prev <= 0) {
          setToastVisible(false);
          return 100;
        }
        return prev - 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [toastVisible]);

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleUpdateStep = (text: string, index: number) => {
    const updated = [...steps];
    updated[index] = text;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onSubmitBug({
      gameId,
      title: title.trim(),
      severity,
      category,
      reproductionSteps: steps.filter((s) => s.trim().length > 0).join('\n'),
      expectedResult: expectedBehavior,
      actualResult: actualBehavior,
    });

    const shaHash = `SHA256:0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_UNREAL_5.4`;
    setSubmittedHash(shaHash);
    setToastVisible(true);
    setToastProgress(100);
    setTitle('');
  };

  const handleUndoDispatch = () => {
    setToastVisible(false);
    setSubmittedHash(null);
  };

  const taxonomyCategories: Array<{ label: string; cat: BugReportItem['category'] }> = [
    { label: 'CRITICAL DESYNC', cat: 'Network / Desync' },
    { label: 'FRAME GLITCH', cat: 'Visual / Shader' },
    { label: 'NETCODE LAG', cat: 'Network / Desync' },
    { label: 'CRASH / FREEZE', cat: 'Crash / Freeze' },
    { label: 'BALANCE EXPLOIT', cat: 'Gameplay Balance' },
  ];

  return (
    <div className="space-y-6 relative" data-testid="nexus-bug-reporting-view">
      {/* FLOATING GLASSMORPHIC TOAST (Stitch Artboard Feature) */}
      {toastVisible && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed sm:absolute top-4 right-4 z-50 w-96 max-w-[calc(100vw-32px)] bg-[#181C26]/95 backdrop-blur-2xl border border-[#22D3EE]/40 rounded-2xl p-4 shadow-[0_24px_50px_rgba(0,0,0,0.85)] animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-[#F8FAFC]">
                  Bug submitted · Dev notified
                </span>
                <button
                  type="button"
                  onClick={() => setToastVisible(false)}
                  className="text-[#64748B] hover:text-[#F8FAFC] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="font-mono text-xs text-[#8B5CF6] font-bold block mt-0.5">
                #BUG-8924 // UNREAL_5.4
              </span>
              <p className="font-mono text-[11px] text-[#94A3B8] mt-1 leading-snug">
                Telemetry packet dispatched to Team Phantom Apex sprint queue.
              </p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#181C26]">
                <button
                  type="button"
                  onClick={handleUndoDispatch}
                  className="font-mono text-xs text-[#22D3EE] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo Dispatch</span>
                </button>
                <span className="font-mono text-[10px] text-[#64748B]">AUTO-CLOSE 4s</span>
              </div>
              {/* Progress Indicator */}
              <div className="w-full bg-[#0B0D12] rounded-full h-1 mt-2 overflow-hidden">
                <div
                  className="bg-[#22D3EE] h-full transition-all duration-75"
                  style={{ width: `${toastProgress}%` }}
                />
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#22D3EE] font-bold">SCREEN 03</span>
            <span>/</span>
            <span className="text-[#8B5CF6]">DEFECT TELEMETRY</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">UNREAL 5.4.2 DIRECT</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Submit Anomaly &amp; Bug Telemetry Workbench
          </h1>
          <p className="font-mono text-xs text-[#94A3B8] mt-1">
            Direct dispatch to core engineering sprint pipeline. Verified zero-frame exploits receive tier-3 bounties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="netcode" value="128Hz LOG DUMP" />
          <TelemetryPill variant="escrow" value={`+${estimatedPoints} PTS ESCROW`} />
        </div>
      </div>

      {submittedHash && !toastVisible && (
        <div className="p-4 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/50 text-[#10B981] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-display text-sm font-bold block">
                Defect Receipt Verified by Enclave
              </span>
              <span className="font-mono text-xs">
                Receipt Stamp: {submittedHash} · +{estimatedPoints} PTS credited to QA Escrow!
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmittedHash(null)}
            className="text-xs font-mono underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 2-Column Split: Defect Submission Form Left (7 Cols) & Telemetry / Recent Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Defect Report Form */}
        <div className="lg:col-span-7">
          <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Target Engine & Game Build with Ping Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#94A3B8] uppercase">
                    TARGET ENGINE &amp; GAME BUILD
                  </label>
                  <span className="font-mono text-[11px] text-[#22D3EE] font-bold">
                    PING: 12ms // STABLE
                  </span>
                </div>
                <div className="relative bg-[#0B0D12] rounded-xl p-3 border border-[#181C26] flex items-center justify-between">
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-[#181C26] flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-display text-xs font-bold text-[#F8FAFC] truncate">
                        CyberPulse: Zero
                      </span>
                      <span className="font-mono text-[10px] text-[#64748B]">
                        v0.84 Alpha (Unreal 5.4.2 Direct Netcode)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#22D3EE]/15 text-[#22D3EE] font-mono text-[10px] font-bold">
                    ALPHA-PROD
                  </span>
                </div>
              </div>

              {/* Row 2: Classification Taxonomy Chips */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-[#94A3B8] uppercase">
                  CLASSIFICATION TAXONOMY
                </label>
                <div className="flex flex-wrap gap-2">
                  {taxonomyCategories.map((tax) => {
                    const isSelected = category === tax.cat;
                    return (
                      <button
                        key={tax.label}
                        type="button"
                        onClick={() => setCategory(tax.cat)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                            : 'bg-[#0B0D12] border-[#181C26] text-[#94A3B8] hover:text-[#F8FAFC]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-[#22D3EE]' : 'bg-[#64748B]'
                          }`}
                        />
                        <span>{tax.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bug Title */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] uppercase">
                  DEFECT SUMMARY / TITLE
                </label>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Capsule geometry clips through airlock barrier during crouch-slide"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]"
                />
              </div>

              {/* Severity Selection */}
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-[#94A3B8] uppercase">
                  SEVERITY LEVEL &amp; BOUNTY IMPACT
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Critical', label: 'P1 · CRITICAL', desc: '+350 PTS' },
                    { id: 'High', label: 'P2 · HIGH', desc: '+200 PTS' },
                    { id: 'Medium', label: 'P3 · MEDIUM', desc: '+100 PTS' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id as BugReportItem['severity'])}
                      className={`p-3 rounded-xl border text-left transition-colors font-mono ${
                        severity === s.id
                          ? 'bg-[#181C26] border-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                          : 'bg-[#0B0D12] border-[#181C26] text-[#94A3B8] hover:border-[#64748B]'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#F8FAFC] block">{s.label}</span>
                      <span className="text-[10px] text-[#22D3EE] font-bold">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Reproduction Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-[#94A3B8] uppercase">
                    REPRODUCTION PROTOCOL ({steps.length} STEPS)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="font-mono text-xs text-[#22D3EE] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#0B0D12] border border-[#181C26] flex items-center justify-center font-mono text-[10px] font-bold text-[#8B5CF6] shrink-0">
                        {idx + 1}
                      </span>
                      <TextInput
                        value={step}
                        onChangeText={(t) => handleUpdateStep(t, idx)}
                        placeholder={`Reproduction step ${idx + 1}...`}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                      />
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="p-2 text-[#64748B] hover:text-[#EF4444] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected vs Actual Behavior Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] uppercase">
                    EXPECTED BEHAVIOR
                  </label>
                  <TextInput
                    value={expectedBehavior}
                    onChangeText={setExpectedBehavior}
                    multiline
                    numberOfLines={3}
                    placeholder="Normal behavior..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-[#94A3B8] uppercase">
                    OBSERVED ANOMALY
                  </label>
                  <TextInput
                    value={actualBehavior}
                    onChangeText={setActualBehavior}
                    multiline
                    numberOfLines={3}
                    placeholder="Actual glitch observed..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D12] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#EF4444]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <span>Dispatch Defect Telemetry &amp; Claim Bounty</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Hardware Spec & Telemetry Ingestion */}
        <div className="lg:col-span-5 space-y-6">
          {/* Automated Hardware Telemetry Stamp */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#181C26] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#22D3EE]" />
                <span className="font-display text-xs font-bold text-[#F8FAFC] uppercase">
                  Telemetry Spec Stamp
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#10B981] font-bold">NODE VERIFIED</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#181C26]/50">
                <span className="text-[#94A3B8]">GPU ENGINE</span>
                <span className="text-[#F8FAFC]">RTX 4090 (Driver 551.86)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#181C26]/50">
                <span className="text-[#94A3B8]">CPU THREADS</span>
                <span className="text-[#F8FAFC]">i9-14900K (32 Threads)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#181C26]/50">
                <span className="text-[#94A3B8]">CLIENT TICK</span>
                <span className="text-[#22D3EE] font-bold">128Hz UDP Locked</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#94A3B8]">HASH CIPHER</span>
                <span className="text-[#8B5CF6] font-mono text-[10px]">SHA-256 ENCLAVE</span>
              </div>
            </div>
          </GlassCard>

          {/* Crash Dump Upload Dropzone */}
          <GlassCard className="p-6 text-center space-y-3 border-dashed border-[#181C26] hover:border-[#8B5CF6]/50 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-[#11141C] text-[#8B5CF6] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display text-xs font-bold text-[#F8FAFC]">
                Attach Crash Dump / Replay Logs
              </h4>
              <p className="font-mono text-[11px] text-[#94A3B8] mt-1">
                Drag &amp; drop .dmp, .log, or Unreal Engine crash logs (Max 50MB)
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#22D3EE] block">
              Direct Memory Dump Auto-Parsed
            </span>
          </GlassCard>

          {/* Recent Submitted Reports */}
          {recentBugReports.length > 0 && (
            <GlassCard className="p-5 space-y-3">
              <h4 className="font-mono text-xs text-[#94A3B8] uppercase">
                RECENT DEFECT SUBMISSIONS
              </h4>
              <div className="space-y-2">
                {recentBugReports.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] flex items-center justify-between font-mono text-xs"
                  >
                    <div className="truncate pr-2">
                      <span className="text-[#F8FAFC] font-semibold block truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] text-[#64748B]">{r.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold text-[10px] shrink-0">
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
