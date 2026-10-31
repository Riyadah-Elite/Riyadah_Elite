import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tournamentService } from '../../shared/services/tournamentService';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { StatusBadge } from '../../shared/components/StatusBadge';

interface Props {
  id: string;
}

export const MobileTournamentDetailScreen: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const [tournament, setTournament] = useState<TournamentListing | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    tournamentService.getTournament(id).then(setTournament);
  }, [id]);

  if (!tournament) {
    return (
      <View style={{ padding: 40, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.secondary }}>Loading tournament...</Text>
      </View>
    );
  }

  const handleRegister = async () => {
    const success = await tournamentService.enrollTournament(tournament.id);
    if (success) setRegistered(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.push('/tournaments')}>
        <Ionicons name="arrow-back" size={16} color={theme.colors.text.secondary} />
        <Text style={styles.backTxt}>Tournaments</Text>
      </TouchableOpacity>

      {tournament.imageUrl && (
        <Image source={{ uri: tournament.imageUrl }} style={styles.art} />
      )}

      <View style={styles.badgeRow}>
        <StatusBadge label="Open" variant="green" />
        <Text style={styles.prizeTxt}>
          ${tournament.amount?.amount.toLocaleString() ?? '15,000'} {tournament.amount?.currency ?? 'USD'}
        </Text>
      </View>

      <Text style={styles.title}>{tournament.tournamentName}</Text>
      <Text style={styles.sub}>{tournament.gameName}</Text>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>Slots Filled</Text>
          <Text style={styles.statVal}>{tournament.enrolledCount ?? 48} / {tournament.maxEntry}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>Team Size</Text>
          <Text style={styles.statVal}>{tournament.teamSize} Players (Squad)</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLbl}>Tournament Date</Text>
          <Text style={styles.statVal}>
            {tournament.tournamentDate ? new Date(tournament.tournamentDate).toLocaleDateString() : 'Nov 14, 2026'}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descCard}>
        <Text style={styles.descTitle}>Rules & Overview</Text>
        <Text style={styles.descTxt}>{tournament.description}</Text>
      </View>

      {/* Register Action */}
      {registered ? (
        <View style={styles.registeredBox}>
          <Ionicons name="checkmark-circle" size={18} color={theme.colors.brand.accent} />
          <Text style={styles.registeredTxt}>Slot Confirmed!</Text>
        </View>
      ) : (
        <PrimaryButton
          title="Claim Bracket Slot"
          variant="neon"
          onPress={handleRegister}
          icon={<Ionicons name="shield-checkmark" size={16} color="#09090D" />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backTxt: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  art: {
    width: '100%',
    height: 160,
    borderRadius: theme.borders.radius.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.brand.accent,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: 12,
    color: theme.colors.brand.secondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLbl: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  descCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
  descTxt: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  registeredBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(57, 230, 0, 0.15)',
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
  },
  registeredTxt: {
    color: theme.colors.brand.accent,
    fontWeight: '800',
    fontSize: 13,
    textTransform: 'uppercase',
  },
});

