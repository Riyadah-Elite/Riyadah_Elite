import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';
import { StatusBadge } from '../../shared/components/StatusBadge';

interface Props {
  game: GameListing;
}

export const DesktopGameCard: React.FC<Props> = ({ game }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {game.imageUrl && (
        <Image source={{ uri: game.imageUrl }} style={styles.image} />
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <StatusBadge label="QA Testing Open" variant="green" />
          <View style={styles.platformBadge}>
            <Ionicons name="desktop-outline" size={12} color={theme.colors.brand.secondary} />
            <Text style={styles.platformText}>{game.platform?.toUpperCase() || 'PC'}</Text>
          </View>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.catText}>{game.categoryName || 'ACTION'}</Text>
          <Text style={styles.titleText}>{game.gameName}</Text>
          {game.description && (
            <Text style={styles.descText} numberOfLines={2}>
              {game.description}
            </Text>
          )}
        </View>

        {/* Telemetry Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={14} color={theme.colors.text.muted} />
            <Text style={styles.statVal}>{game.enrolledCount ?? 0} Testers</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="bug-outline" size={14} color={theme.colors.brand.accent} />
            <Text style={[styles.statVal, { color: theme.colors.brand.accent }]}>
              {game.openBugsCount ?? 0} Open Tickets
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/games/${game.id}` as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Inspect Playtest Details</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.brand.accent} />
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
    ...theme.shadows.md,
  },
  image: {
    width: '100%',
    height: 150,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borders.radius.sm,
  },
  platformText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
  },
  infoCol: {
    gap: 4,
  },
  catText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  descText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 18,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statVal: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.3)',
    paddingVertical: 10,
    borderRadius: theme.borders.radius.md,
    gap: 8,
    marginTop: 6,
  },
  actionBtnText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
});

