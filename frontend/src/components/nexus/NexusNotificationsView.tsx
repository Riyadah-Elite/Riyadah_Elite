import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trophy,
  Bug,
  Shield,
  Trash2,
  ArrowRight,
  Sparkles,
  Inbox,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { View, Text, Pressable } from '../primitives';
import { ThemeMode } from '../../theme/theme';
import { NotificationItem } from '../../utils/ecosystemRules';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { TelemetryPill } from '../common/TelemetryPill';

export interface NexusNotificationsProps {
  mode: ThemeMode;
  notifications?: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
}

export const NexusNotificationsView: React.FC<NexusNotificationsProps> = ({
  mode,
  notifications: initialNotifications,
  onMarkAsRead,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'tournaments' | 'bugs' | 'builds'>('all');
  const [showPopoverPreview, setShowPopoverPreview] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(
    initialNotifications || [
      {
        id: 'n-1',
        title: 'QA Bounty Credited: Airlock Geometry Clip',
        detail: 'Lead Engine Architect Dr_Kavinsky verified your defect on tick 412. +350 PTS released from Escrow.',
        category: 'Bug Verification',
        unread: true,
        time: '10m ago',
      },
      {
        id: 'n-2',
        title: 'Quarterfinals Live Match Alert: Apex Winter Invitational',
        detail: 'Game 3 is starting in 5 minutes on Riyadh Node 09. Netcode tick locked at 128Hz.',
        category: 'Tournament Bracket',
        unread: true,
        time: '25m ago',
      },
      {
        id: 'n-3',
        title: 'Ranked Node Maintenance: EU Frankfurt Node 04',
        detail: 'Matchmaking paused for 30m for netcode interpolation kernel hotfix v0.9.4.',
        category: 'Playtest Build',
        unread: true,
        time: '45m ago',
      },
      {
        id: 'n-4',
        title: 'New Testing Cohort Available: Chrono Strike',
        detail: 'Arena playtesting slots opened for Diamond QA operatives (Build v1.1). 72 slots remaining.',
        category: 'Playtest Build',
        unread: false,
        time: '2h ago',
      },
    ]
  );

  const unreadCount = items.filter((i) => i.unread).length;

  const filterTabs = [
    { id: 'all', label: `All Telemetry (${items.length})` },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'bugs', label: 'QA Bounties' },
    { id: 'builds', label: 'Builds & Nodes' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeTab === 'tournaments' && item.category !== 'Tournament Bracket') return false;
    if (activeTab === 'bugs' && item.category !== 'Bug Verification') return false;
    if (activeTab === 'builds' && item.category !== 'Playtest Build') return false;
    return true;
  });

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    if (onMarkAsRead) onMarkAsRead(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClear = () => {
    setItems([]);
    if (onClearAll) onClearAll();
  };

  return (
    <div className="space-y-6" data-testid="nexus-notifications-view">
      {/* Top Presentation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#181C26]">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#64748B]">
            <span className="text-[#22D3EE] font-bold">SCREEN 04</span>
            <span>/</span>
            <span className="text-[#8B5CF6]">NOTIFICATION NODE</span>
            <span>/</span>
            <span className="text-[#F8FAFC]">TELEMETRY INBOX</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Telemetry Notifications &amp; Bounty Alerts
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Bell Trigger with Glass Popover Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPopoverPreview((p) => !p)}
              className="relative p-2.5 rounded-xl bg-[#11141C] border border-[#181C26] hover:border-[#8B5CF6]/50 text-[#CBD5E1] transition-all"
              title="Toggle Glass Popover Preview"
            >
              <Bell className="w-4 h-4 text-[#8B5CF6]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22D3EE] ring-2 ring-[#0B0D12] animate-pulse" />
              )}
            </button>

            {/* FLOATING GLASS POPOVER (STATE C from Stitch) */}
            {showPopoverPreview && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-[#181C26]/95 backdrop-blur-2xl border border-[#8B5CF6]/40 p-4 shadow-[0_24px_50px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-3 animate-fade-in">
                {/* Pointer Pip */}
                <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#181C26] rotate-45 border-l border-t border-[#8B5CF6]/40" />

                {/* Popover Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#11141C]">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-[#F8FAFC]">
                      Telemetry Alerts
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#22D3EE]/20 text-[#22D3EE] font-mono text-[10px] font-bold">
                      {unreadCount} NEW
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="font-mono text-[11px] text-[#8B5CF6] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                </div>

                {/* Popover List */}
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMarkRead(item.id)}
                      className="p-2.5 rounded-xl bg-[#0B0D12] hover:bg-[#11141C] border border-[#181C26] transition-colors cursor-pointer flex items-start gap-2.5"
                    >
                      <div className="p-1.5 rounded-lg bg-[#8B5CF6]/15 text-[#8B5CF6] shrink-0 mt-0.5">
                        {item.category === 'Bug Verification' ? (
                          <Bug className="w-3.5 h-3.5 text-[#22D3EE]" />
                        ) : (
                          <Trophy className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs font-bold text-[#F8FAFC] truncate">
                            {item.title}
                          </span>
                          <span className="font-mono text-[9px] text-[#64748B]">{item.time}</span>
                        </div>
                        <p className="font-mono text-[10px] text-[#94A3B8] truncate mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowPopoverPreview(false)}
                  className="w-full py-2 rounded-xl bg-[#11141C] hover:bg-[#0B0D12] border border-[#181C26] font-mono text-[11px] text-[#CBD5E1] text-center"
                >
                  Close Popover
                </button>
              </div>
            )}
          </div>

          <TelemetryPill variant="netcode" value="REALTIME STREAM" />
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 rounded-xl font-mono text-xs bg-[#11141C] border border-[#181C26] text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl font-mono text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-[#11141C] border border-[#181C26] max-w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#8B5CF6] text-white'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((n) => {
            const isBug = n.category === 'Bug Verification';
            const isTournament = n.category === 'Tournament Bracket';

            return (
              <GlassCard
                key={n.id}
                variant={!n.unread ? 'default' : 'elevated'}
                className={`p-5 transition-all ${
                  n.unread ? 'border-[#8B5CF6]/50 shadow-[0_0_16px_rgba(139,92,246,0.15)]' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isBug
                          ? 'bg-[#22D3EE]/15 text-[#22D3EE]'
                          : isTournament
                          ? 'bg-[#8B5CF6]/15 text-[#8B5CF6]'
                          : 'bg-[#3B82F6]/15 text-[#3B82F6]'
                      }`}
                    >
                      {isBug ? (
                        <Bug className="w-5 h-5" />
                      ) : isTournament ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                          {n.title}
                        </h3>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#94A3B8] leading-relaxed max-w-2xl">
                        {n.detail}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="font-mono text-[10px] text-[#64748B] block">
                          {n.time}
                        </span>
                        <span className="font-mono text-[10px] text-[#22D3EE]">
                          {n.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {n.unread && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(n.id)}
                        className="px-3 py-1.5 rounded-lg font-mono text-xs bg-[#181C26] hover:bg-[#8B5CF6] hover:text-white text-[#CBD5E1] transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="font-display text-base font-bold text-[#F8FAFC]">
            All Cleared · Zero Inbox
          </h3>
          <p className="font-mono text-xs text-[#94A3B8]">
            No unread telemetry notifications or bounty alerts at this time.
          </p>
        </GlassCard>
      )}
    </div>
  );
};
