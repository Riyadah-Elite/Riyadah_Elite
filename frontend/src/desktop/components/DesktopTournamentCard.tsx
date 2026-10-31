import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';
import { StatusBadge } from '../../shared/components/StatusBadge';

interface Props {
  tournament: TournamentListing;
}

export const DesktopTournamentCard: React.FC<Props> = ({ tournament }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Top Banner Artwork */}
      {tournament.imageUrl && (
        <Image source={{ uri: tournament.imageUrl }} style={styles.artwork} />
      )}

      <View style={styles.body}>
        {/* Header Status */}
        <View style={styles.headerRow}>
          <StatusBadge label="Registration Open" variant="green" />
          <Text style={styles.dateText}>
            {tournament.tournamentDate ? new Date(tournament.tournamentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Upcoming'}
          </Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.seriesText}>{tournament.gameName || 'CYBER ARENA'}</Text>
          <Text style={styles.titleText} numberOfLines={2}>
            {tournament.tournamentName}
          </Text>
        </View>

        {/* Metric Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLbl}>Prize Pool</Text>
            <Text style={styles.prizeVal}>
              ${tournament.amount?.amount.toLocaleString() ?? '10,000'} {tournament.amount?.currency ?? 'USD'}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLbl}>Bracket Size</Text>
            <Text style={styles.bracketVal}>
              {tournament.enrolledCount ?? 0} / {tournament.maxEntry} Slots
            </Text>
          </View>
        </View>

        {/* Description snippet */}
        {tournament.description && (
          <Text style={styles.desc} numberOfLines={2}>
            {tournament.description}
          </Text>
        )}

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/tournaments/${tournament.id}` as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Register / View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#09090D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    flexDirection: 'column',
    ...theme.shadows.md,
  },
  artwork: {
    width: '100%',
    height: 140,
  },
  body: {
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  titleSection: {
    gap: 4,
  },
  seriesText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  titleText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.md,
    padding: 12,
    justifyContent: 'space-between',
  },
  metricItem: {
    gap: 2,
  },
  metricLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  prizeVal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '800',
    color: theme.colors.brand.accent,
  },
  bracketVal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  desc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
    gap: 8,
    marginTop: 4,
    ...theme.shadows.neonGlow,
  },
  actionBtnText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '800',
    color: '#09090D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

