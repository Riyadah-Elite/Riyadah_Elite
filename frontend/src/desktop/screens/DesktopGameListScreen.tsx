import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DesktopGameCard } from '../components/DesktopGameCard';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { gameService } from '../../shared/services/gameService';
import { GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';

const GENRES = ['All Genres', 'Sci-Fi RPG', 'Action Tactical', 'Cyberpunk Combat', 'Open World', 'VR Simulation'];
const PLATFORMS = ['All Platforms', 'PC Windows', 'Console PS5/Xbox', 'Steam Deck Verified'];

export const DesktopGameListScreen: React.FC = () => {
  const [games, setGames] = useState<GameListing[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [search, setSearch] = useState('');

  useEffect(() => {
    gameService.listGames({ search }).then((all) => {
      let filtered = all;
      if (selectedGenre !== 'All Genres') {
        filtered = filtered.filter((g) =>
          g.categoryName?.toLowerCase().includes(selectedGenre.toLowerCase().split(' ')[0])
        );
      }
      setGames(filtered);
    });
  }, [search, selectedGenre]);

  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.badge}>
          <Ionicons name="flask" size={14} color={theme.colors.brand.accent} />
          <Text style={styles.badgeText}>EXCLUSIVE CLOSED ALPHA & BETA QA LABS</Text>
        </View>
        <Text style={styles.title}>Game Testing & Playtest Nexus</Text>
        <Text style={styles.desc}>
          Get early access to pre-release game builds, stress test live servers, report critical edge-case bugs,
          and earn verified QA badges and bounty rewards.
        </Text>

        {/* Telemetry quick stats */}
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryVal}>34</Text>
            <Text style={styles.telemetryLabel}>Active Test Builds</Text>
          </View>
          <View style={styles.telemetryDivider} />
          <View style={styles.telemetryItem}>
            <Text style={[styles.telemetryVal, { color: theme.colors.brand.accent }]}>$48,500</Text>
            <Text style={styles.telemetryLabel}>Paid Bug Bounties</Text>
          </View>
          <View style={styles.telemetryDivider} />
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryVal}>1,420</Text>
            <Text style={styles.telemetryLabel}>Certified Testers</Text>
          </View>
          <View style={styles.telemetryDivider} />
          <View style={styles.telemetryItem}>
            <Text style={[styles.telemetryVal, { color: theme.colors.brand.secondary }]}>128-tick</Text>
            <Text style={styles.telemetryLabel}>Telemetry Rate</Text>
          </View>
        </View>
      </View>

      {/* Filter and Search Bar */}
      <View style={styles.controlsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPills}>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[styles.pill, selectedGenre === genre && styles.pillActive]}
              onPress={() => setSelectedGenre(genre)}
            >
              <Text style={[styles.pillText, selectedGenre === genre && styles.pillTextActive]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={theme.colors.text.muted} />
          <TextInput
            placeholder="Search test builds, studios..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Header and Grid */}
      <SectionHeader
        title={`${games.length} Available Playtest Titles`}
        subtitle="Select a title to review test requirements, hardware specs, and submit bug reports."
      />

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="game-controller-outline" size={48} color={theme.colors.text.muted} />
          <Text style={styles.emptyTitle}>No game builds found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search query or filters.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {games.map((g) => (
            <View key={g.id} style={styles.gridItem}>
              <DesktopGameCard game={g} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borders.radius.full,
    marginBottom: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    fontFamily: theme.typography.fontFamily.heading,
  },
  desc: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    maxWidth: 800,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borders.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 24,
  },
  telemetryItem: {
    alignItems: 'center',
  },
  telemetryVal: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  telemetryLabel: {
    fontSize: 11,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  telemetryDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border.subtle,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    gap: 16,
  },
  filterPills: {
    flexDirection: 'row',
    flex: 1,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borders.radius.full,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  pillText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: 12,
    width: 300,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridItem: {
    width: '31.5%',
    minWidth: 280,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
  },
});

