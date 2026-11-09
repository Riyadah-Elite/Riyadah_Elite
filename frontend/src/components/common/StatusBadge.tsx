import React from 'react';
import { View, Text } from '../primitives';

export type StatusVariant =
  | 'verified'
  | 'live'
  | 'open'
  | 'closed'
  | 'upcoming'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'pro'
  | 'escrow'
  | 'neutral';

export interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'verified':
      return (
        <View
          testID="status-badge-verified"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] font-mono font-semibold ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" aria-hidden="true" />
          <Text className="text-inherit">{label || 'VERIFIED'}</Text>
        </View>
      );

    case 'live':
      return (
        <View
          testID="status-badge-live"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] font-mono font-bold tracking-wider ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" aria-hidden="true" />
          <Text className="text-inherit">{label || 'LIVE NOW'}</Text>
        </View>
      );

    case 'open':
      return (
        <View
          testID="status-badge-open"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-[#22D3EE] font-mono font-semibold ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" aria-hidden="true" />
          <Text className="text-inherit">{label || 'REGISTRATION OPEN'}</Text>
        </View>
      );

    case 'upcoming':
      return (
        <View
          testID="status-badge-upcoming"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/15 border border-[#3B82F6]/40 text-[#93C5FD] font-mono font-medium ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" aria-hidden="true" />
          <Text className="text-inherit">{label || 'UPCOMING'}</Text>
        </View>
      );

    case 'p1':
      return (
        <View
          testID="status-badge-p1"
          className={`inline-flex items-center gap-1.5 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#FCA5A5] font-mono font-bold ${sizeClasses} ${className}`}
        >
          <Text className="text-inherit">{label || 'P1 · CRITICAL CRASH'}</Text>
        </View>
      );

    case 'p2':
      return (
        <View
          testID="status-badge-p2"
          className={`inline-flex items-center gap-1.5 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#FCD34D] font-mono font-semibold ${sizeClasses} ${className}`}
        >
          <Text className="text-inherit">{label || 'P2 · HIGH BLOCKER'}</Text>
        </View>
      );

    case 'p3':
      return (
        <View
          testID="status-badge-p3"
          className={`inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6]/20 border border-[#3B82F6]/50 text-[#93C5FD] font-mono font-medium ${sizeClasses} ${className}`}
        >
          <Text className="text-inherit">{label || 'P3 · MEDIUM DEFECT'}</Text>
        </View>
      );

    case 'pro':
    case 'escrow':
      return (
        <View
          testID="status-badge-pro"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C4B5FD] font-mono font-bold ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" aria-hidden="true" />
          <Text className="text-inherit">{label || 'ESCROW SECURED'}</Text>
        </View>
      );

    case 'closed':
    case 'neutral':
    default:
      return (
        <View
          testID="status-badge-neutral"
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#181C26] border border-[#282E3E] text-[#94A3B8] font-mono font-medium ${sizeClasses} ${className}`}
        >
          <Text className="text-inherit">{label || 'COMPLETED'}</Text>
        </View>
      );
  }
};

