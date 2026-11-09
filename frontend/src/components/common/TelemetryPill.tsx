import React from 'react';
import { View, Text } from '../primitives';

export interface TelemetryPillProps {
  label?: string;
  variant?: 'latency' | 'netcode' | 'escrow' | 'live' | 'fps';
  value?: string;
  className?: string;
}

export const TelemetryPill: React.FC<TelemetryPillProps> = ({
  label,
  variant = 'latency',
  value,
  className = '',
}) => {
  switch (variant) {
    case 'latency':
      return (
        <View
          testID="telemetry-pill-latency"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11141C] border border-[#181C26] shadow-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" aria-hidden="true" />
          <Text className="font-mono text-xs text-[#94A3B8]">
            {label || 'LATENCY'}
          </Text>
          <Text className="font-mono text-xs font-bold text-[#22D3EE]">
            {value || '12ms PRO'}
          </Text>
        </View>
      );

    case 'netcode':
      return (
        <View
          testID="telemetry-pill-netcode"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11141C] border border-[#181C26] shadow-sm ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" aria-hidden="true" />
          <Text className="font-mono text-xs text-[#94A3B8]">
            {label || 'NETCODE'}
          </Text>
          <Text className="font-mono text-xs font-bold text-[#8B5CF6]">
            {value || '128Hz TICK'}
          </Text>
        </View>
      );

    case 'escrow':
      return (
        <View
          testID="telemetry-pill-escrow"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" aria-hidden="true" />
          <Text className="font-mono text-xs font-bold text-[#A78BFA]">
            {value || 'ESCROW SECURED'}
          </Text>
        </View>
      );

    case 'live':
      return (
        <View
          testID="telemetry-pill-live"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF4444]/15 border border-[#EF4444]/35 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" aria-hidden="true" />
          <Text className="font-mono text-xs font-bold text-[#EF4444] uppercase tracking-wider">
            {value || 'LIVE TIER 1'}
          </Text>
        </View>
      );

    case 'fps':
      return (
        <View
          testID="telemetry-pill-fps"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11141C] border border-[#181C26] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981]" aria-hidden="true" />
          <Text className="font-mono text-xs font-bold text-[#10B981]">
            {value || 'FPS 240 STABLE'}
          </Text>
        </View>
      );

    default:
      return null;
  }
};

