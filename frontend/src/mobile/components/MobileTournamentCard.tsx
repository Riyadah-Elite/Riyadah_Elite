import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';

interface Props {
  tournament: TournamentListing;
}

export const MobileTournamentCard: React.FC<Props> = ({ tournament }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {tournament.imageUrl && (
        <Image source={{ uri: tournament.imageUrl }} style={styles.art} />
      )}
      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <Text style={styles.series}>{tournament.gameName || 'CYBER ARENA'}</Text>
          <Text style={styles.prize}>
            ${tournament.amount?.amount.toLocaleString() ?? '10,000'}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {tournament.tournamentName}
        </Text>

        <View style={styles.slotRow}>
          <Ionicons name="people-outline" size={14} color={theme.colors.text.muted} />
          <Text style={styles.slotText}>
            {tournament.enrolledCount ?? 0} / {tournament.maxEntry} Registered
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push(`/tournaments/${tournament.id}` as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionText}>View Tournament</Text>
          <Ionicons name="arrow-forward" size={14} color="#09090D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    marginBottom: 14,
  },
  art: {
    width: '100%',
    height: 120,
  },
  body: {
    padding: 14,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  series: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.secondary,
    textTransform: 'uppercase',
  },
  prize: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.brand.accent,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotText: {
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.sm,
    gap: 6,
    marginTop: 4,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#09090D',
    textTransform: 'uppercase',
  },
});

