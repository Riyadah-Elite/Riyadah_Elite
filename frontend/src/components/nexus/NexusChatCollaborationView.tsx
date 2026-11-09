import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { View, Text, Pressable, TextInput, Image } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { GlassCard } from '../common/GlassCard';
import { TelemetryPill } from '../common/TelemetryPill';
import { StatusBadge } from '../common/StatusBadge';

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatarColor: string;
  time: string;
  text: string;
  badge?: string;
  hasAttachment?: boolean;
  attachmentTitle?: string;
  codeSnippet?: string;
}

export interface NexusChatCollaborationProps {
  mode: ThemeMode;
  user?: {
    handle: string;
    email: string;
    role: string;
  };
}

export const NexusChatCollaborationView: React.FC<NexusChatCollaborationProps> = ({
  mode,
  user = { handle: 'Nadia_Vanguard', email: 'nadia@riyadahelite.gg', role: 'Lead QA Specialist' },
}) => {
  const [currentFrame, setCurrentFrame] = useState(412);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState('#unreal-engine-bugs');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Dr_Kavinsky',
      role: 'Lead Engine Architect',
      avatarColor: 'bg-[#8B5CF6]',
      time: '14:21:48',
      text: 'Observing spatial collision delta on client tick 412. Character sliding through airlock collision barrier on high-ping packets.',
      badge: 'DEV VERIFIED',
    },
    {
      id: 'm2',
      sender: 'Nadia_Vanguard',
      role: 'Lead QA Specialist',
      avatarColor: 'bg-[#22D3EE]',
      time: '14:22:15',
      text: 'Reproduced 4/5 times on 128Hz netcode when crouch-sliding into the portal gate. Attached frame telemetry dump below.',
      hasAttachment: true,
      attachmentTitle: 'frame_412_desync_telemetry.dmp (4.2 MB)',
      badge: 'QA REPRODUCIBLE',
    },
    {
      id: 'm3',
      sender: 'Dr_Kavinsky',
      role: 'Lead Engine Architect',
      avatarColor: 'bg-[#8B5CF6]',
      time: '14:22:50',
      text: 'Found the root cause in the capsule interpolation rewind buffer. Patching hotfix v0.9.4-RC3 now.',
      codeSnippet: `// CapsuleRewindBuffer.cpp:142\nif (PacketLoss > 0.03f && DeltaTime < 0.02f) {\n    EnforceStrictAirlockBarrier(CapsuleTransform);\n}`,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Auto-play replay animation loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((f) => (f >= 1200 ? 0 : f + 4));
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: user.handle,
        role: user.role,
        avatarColor: 'bg-[#22D3EE]',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: newMessage.trim(),
      },
    ]);
    setNewMessage('');
  };

  const handleQuickChip = (text: string) => {
    setNewMessage(text);
  };

  return (
    <div className="space-y-6" data-testid="nexus-chat-collaboration-view">
      {/* Header Meta Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#22D3EE] font-bold">SCREEN 01</span>
            <span>/</span>
            <span className="text-[#8B5CF6]">COLLABORATIVE DEV BRIDGE</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">128Hz TELEMETRY</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Dev ↔ QA Telemetry Bridge &amp; Replay Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TelemetryPill variant="netcode" value="128Hz REWIND" />
          <TelemetryPill variant="live" value="LIVE SESSION" />
        </div>
      </div>

      {/* 2-Column Split: Workbench Screen Left (7 Cols) + Chat Drawer Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT WORKBENCH (7 Columns): Unreal Engine Frame Desync Replay & Telemetry */}
        <div className="lg:col-span-7 space-y-6">
          {/* Game Telemetry Replay Viewport */}
          <GlassCard variant="elevated" className="overflow-hidden">
            {/* Viewport Top HUD Bar */}
            <div className="p-3.5 bg-[#0B0D12] border-b border-[#181C26] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                <span className="font-bold text-[#F8FAFC]">
                  FRAME {currentFrame} DESYNC REPLAY // UNREAL ENGINE 5.4.1
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <span>BUFFER: 4.2 MB</span>
                <span className="text-[#22D3EE] font-bold">LIVE STAMP 14:22:04</span>
              </div>
            </div>

            {/* Simulated Replay Canvas Viewport */}
            <div className="relative w-full h-72 sm:h-84 bg-[#0B0D12] overflow-hidden flex items-center justify-center">
              <Image
                source="/assets/images/games/eclipse-protocol.png"
                alt="Unreal Engine Desync Replay"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-black/40" />

              {/* Spatial Bounding Box & Target Reticle */}
              <div className="absolute z-10 w-44 h-52 rounded-xl border border-[#EF4444] bg-[#EF4444]/10 p-2.5 flex flex-col justify-between shadow-[0_0_24px_rgba(239,68,68,0.35)]">
                <div className="flex justify-between items-start font-mono text-[10px]">
                  <span className="bg-[#0B0D12]/90 text-[#EF4444] px-1.5 py-0.5 rounded font-bold">
                    ΔPos: 3.24m DESYNC
                  </span>
                  <span className="text-[#8B5CF6] font-bold">CAPSULE_01</span>
                </div>

                <div className="self-center">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#22D3EE] animate-spin" />
                </div>

                <div className="flex justify-between font-mono text-[10px] text-[#22D3EE] bg-[#0B0D12]/90 px-1.5 py-0.5 rounded">
                  <span>TICK: 128Hz</span>
                  <span>LOST: 4.2%</span>
                </div>
              </div>
            </div>

            {/* Frame Scrubber & Playback Bar */}
            <div className="p-4 bg-[#11141C] border-t border-[#181C26] space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#94A3B8]">Frame: {currentFrame} / 1200</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentFrame((f) => Math.max(0, f - 10))}
                    className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-1.5 rounded-lg bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentFrame((f) => Math.min(1200, f + 10))}
                    className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[#22D3EE] font-bold">Δt = +16.6ms</span>
              </div>

              {/* Progress Scrub Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setCurrentFrame(Math.round(pct * 1200));
                }}
                className="w-full h-2 rounded-full bg-[#0B0D12] overflow-hidden flex cursor-pointer"
              >
                <div
                  className="bg-[#8B5CF6] h-full"
                  style={{ width: `${(currentFrame / 1200) * 100}%` }}
                />
                <div className="bg-[#EF4444] h-full w-[3%] animate-pulse" />
                <div className="bg-[#181C26] h-full flex-1" />
              </div>
            </div>
          </GlassCard>

          {/* 3 Telemetry Metrics Sparkline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard className="p-4 space-y-1">
              <span className="font-mono text-[11px] text-[#94A3B8] uppercase">COLLISION DELTA</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-[#EF4444]">3.24</span>
                <span className="font-mono text-xs text-[#94A3B8]">METERS</span>
              </div>
              {/* Sparkline Curve */}
              <svg
                className="w-full h-7 text-[#EF4444]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 100 24"
              >
                <path d="M0,18 L15,17 L30,16 L45,19 L60,4 L75,20 L90,18 L100,17" />
              </svg>
              <span className="font-mono text-[10px] text-[#EF4444] block">Severe Geometry Clip</span>
            </GlassCard>

            <GlassCard className="p-4 space-y-1">
              <span className="font-mono text-[11px] text-[#94A3B8] uppercase">TICK RATE</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-[#22D3EE]">128</span>
                <span className="font-mono text-xs text-[#94A3B8]">Hz</span>
              </div>
              {/* Sparkline Curve */}
              <svg
                className="w-full h-7 text-[#22D3EE]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 100 24"
              >
                <path d="M0,12 L20,12 L25,10 L30,14 L50,12 L70,12 L80,11 L100,12" />
              </svg>
              <span className="font-mono text-[10px] text-[#10B981] block">0.02ms Jitter Delta</span>
            </GlassCard>

            <GlassCard className="p-4 space-y-1">
              <span className="font-mono text-[11px] text-[#94A3B8] uppercase">BURST DROP</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-bold text-[#F59E0B]">4.2%</span>
                <span className="font-mono text-xs text-[#94A3B8]">PACKETS</span>
              </div>
              {/* Sparkline Curve */}
              <svg
                className="w-full h-7 text-[#F59E0B]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 100 24"
              >
                <path d="M0,20 L25,18 L50,19 L65,8 L75,18 L100,19" />
              </svg>
              <span className="font-mono text-[10px] text-[#CBD5E1] block">Interpolation Fail</span>
            </GlassCard>
          </div>
        </div>

        {/* RIGHT CHAT DRAWER (5 Columns): Collaborative Live Bridge */}
        <div className="lg:col-span-5">
          <GlassCard variant="elevated" className="h-[620px] flex flex-col justify-between overflow-hidden">
            {/* Chat Drawer Header */}
            <div className="p-4 bg-[#0B0D12] border-b border-[#181C26] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
                <div>
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <h3 className="font-display text-xs font-bold text-[#F8FAFC]">
                      {activeChannel}
                    </h3>
                    <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#94A3B8]">
                    Unreal Engine 5.4.1 Direct · 2 Operatives
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="font-mono text-[10px] text-[#10B981] font-bold">SOCKET LIVE</span>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full ${m.avatarColor} text-[10px] font-bold text-white flex items-center justify-center`}>
                        {m.sender.charAt(0)}
                      </div>
                      <span className="font-display text-xs font-semibold text-[#F8FAFC]">
                        {m.sender}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B]">{m.role}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#64748B]">{m.time}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#181C26] text-xs font-mono text-[#CBD5E1] space-y-2">
                    <p className="leading-relaxed">{m.text}</p>

                    {m.hasAttachment && (
                      <div className="p-2 rounded-lg bg-[#11141C] border border-[#22D3EE]/30 flex items-center justify-between text-[11px] text-[#22D3EE]">
                        <span className="truncate">{m.attachmentTitle}</span>
                        <span className="font-bold underline shrink-0 cursor-pointer">Download</span>
                      </div>
                    )}

                    {m.codeSnippet && (
                      <pre className="p-2.5 rounded-lg bg-[#11141C] border border-[#181C26] font-mono text-[10px] text-[#A78BFA] overflow-x-auto">
                        <code>{m.codeSnippet}</code>
                      </pre>
                    )}

                    {m.badge && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/30">
                        {m.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Chips & Chat Input Box */}
            <div className="p-3.5 bg-[#0B0D12] border-t border-[#181C26] space-y-2.5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['Confirmed on tick 412', 'Requesting memory dump', 'Verified in v0.9.4-RC3'].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickChip(chip)}
                      className="px-2.5 py-1 rounded-lg bg-[#11141C] border border-[#181C26] text-[10px] font-mono text-[#94A3B8] hover:text-[#22D3EE] whitespace-nowrap shrink-0 transition-colors"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Type telemetry directive or stack trace..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#11141C] border border-[#181C26] font-mono text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#8B5CF6]"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
