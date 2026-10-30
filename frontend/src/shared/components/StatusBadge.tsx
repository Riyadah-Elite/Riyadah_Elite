import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface StatusBadgeProps {
  label: string;
  variant?: 'green' | 'violet' | 'red' | 'amber' | 'neutral';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'green',
  pulse = false,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'green':
        return { text: '#39E600', bg: 'rgba(57, 230, 0, 0.14)', dot: '#39E600' };
      case 'violet':
        return { text: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.16)', dot: '#8B5CF6' };
      case 'red':
        return { text: '#EF4444', bg: 'rgba(239, 68, 68, 0.16)', dot: '#EF4444' };
      case 'amber':
        return { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.16)', dot: '#F59E0B' };
      default:
        return { text: '#A1A1AA', bg: 'rgba(255, 255, 255, 0.08)', dot: '#71717A' };
    }
  };

  const { text, bg, dot } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.round,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});

