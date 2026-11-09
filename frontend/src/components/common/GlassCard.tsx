import React from 'react';
import { View } from '../primitives';
import surfaceStyles from '../../styles/SurfaceEffects.module.css';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'hud' | 'subtle' | 'glow';
  className?: string;
  testID?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  testID = 'glass-card',
  onClick,
}) => {
  let variantClass = '';
  switch (variant) {
    case 'elevated':
      variantClass = `${surfaceStyles.claymorphicCard} border border-[#181C26]`;
      break;
    case 'hud':
      variantClass = `${surfaceStyles.glassFloatingHud} border border-[#22D3EE]/30`;
      break;
    case 'subtle':
      variantClass = 'bg-[#11141C]/80 border border-[#181C26]/60 backdrop-blur-md';
      break;
    case 'glow':
      variantClass = `${surfaceStyles.claymorphicCard} border border-[#8B5CF6]/40 shadow-[0_0_24px_rgba(139,92,246,0.25)]`;
      break;
    case 'default':
    default:
      variantClass = 'bg-[#11141C] border border-[#181C26] shadow-xl';
      break;
  }

  return (
    <View
      testID={testID}
      onClick={onClick}
      className={`rounded-2xl ${variantClass} ${className}`}
    >
      {children}
    </View>
  );
};

