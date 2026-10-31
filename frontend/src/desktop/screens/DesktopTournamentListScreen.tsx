import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesktopTournamentCard } from '../components/DesktopTournamentCard';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { tournamentService } from '../../shared/services/tournamentService';
import { TournamentListing } from '../../shared/types';
import { theme } from '../../shared/theme';

const CATEGORIES = ['All Tournaments', 'Tactical FPS', 'Battle Royale', 'Speedrun Sprint', 'Fighting Games', 'MMO Raids'];

export const DesktopTournamentListScreen: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentListing[]>([]);
  const [selectedCat, setSelectedCat] = useState('All Tournaments');
  const [search, setSearch] = useState('');

  useEffect(() => {
    tournamentService.listTournaments({ search }).then(setTournaments);
  }, [search]);

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="trophy" size={14} color={theme.colors.brand.accent} />
          <Text style={styles.badgeText}>COMPETITIVE ARENAS & CASH BOUNTIES</Text>
        </View>
        <Text style={styles.title}>Tournament Arena Nexus</Text>
        <Text style={styles.desc}>
          Compete across 128Hz high-tickrate servers. Prize pools are verified and distributed instantly.
        </Text>
      </View>

      {/* Filter and Search Bar */}
      <View style={styles.controlsRow}>
        <View style={styles.filterPills}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.pill, selectedCat === cat && styles.pillActive]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[styles.pillText, selectedCat === cat && styles.pillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={theme.colors.text.muted} />
          <TextInput
            placeholder="Search tournaments or games..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Grid of Tournaments */}
      <SectionHeader
        title={`${tournaments.length} Active Competitions`}
        subtitle="Open for squad and solo registration."
      />

      <View style={styles.grid}>
        {tournaments.map((t) => (
          <View key={t.id} style={styles.col}>
            <DesktopTournamentCard tournament={t} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  banner: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius['2xl'],
    padding: 36,
    gap: 12,
    marginBottom: 36,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: '900',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    maxWidth: 620,
    lineHeight: 24,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
    flexWrap: 'wrap',
    gap: 16,
  },
  filterPills: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    padding: 6,
    borderRadius: theme.borders.radius.lg,
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borders.radius.md,
  },
  pillActive: {
    backgroundColor: theme.colors.brand.accent,
  },
  pillText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.muted,
  },
  pillTextActive: {
    color: '#09090D',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: 320,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  col: {
    flex: 1,
    minWidth: 340,
    maxWidth: 440,
  },
});

