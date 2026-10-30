import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  action,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {eyebrow && (
          <View style={styles.eyebrowRow}>
            <View style={styles.indicator} />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    gap: 12,
  },
  left: {
    flex: 1,
    minWidth: 260,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
  },
  eyebrow: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: 4,
    lineHeight: 22,
  },
  action: {
    alignSelf: 'flex-end',
  },
});

