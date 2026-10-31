import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileTournamentCard } from '../components/MobileTournamentCard';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { tournamentService } from '../../shared/services/tournamentService';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';

export const MobileTournamentListScreen: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentListing[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    tournamentService.listTournaments({ search }).then(setTournaments);
  }, [search]);

  return (
    <View style={styles.container}>
      <SectionHeader
        eyebrow="ARENA LADDER"
        title="Active Tournaments"
        subtitle="Compete for verified prize bounties."
      />

      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={theme.colors.text.muted} />
        <TextInput
          placeholder="Search tournaments..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.list}>
        {tournaments.map((t) => (
          <MobileTournamentCard key={t.id} tournament={t} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  list: {
    gap: 8,
  },
});

