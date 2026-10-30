import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileGameCard } from '../components/MobileGameCard';
import { gameService } from '../../shared/services/gameService';
import { GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';

const GENRES = ['All Genres', 'Sci-Fi RPG', 'Action Tactical', 'Cyberpunk Combat', 'Open World', 'VR'];

export const MobileGameListScreen: React.FC = () => {
  const [games, setGames] = useState<GameListing[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
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
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Ionicons name="flask" size={12} color={theme.colors.brand.accent} />
          <Text style={styles.badgeTxt}>PLAYTEST & QA LABS</Text>
        </View>
        <Text style={styles.title}>Game Testing Hub</Text>
        <Text style={styles.sub}>
          Access early closed builds, report bugs, and earn QA bounty rewards.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={theme.colors.text.muted} />
        <TextInput
          placeholder="Search test builds..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filter Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.pill, selectedGenre === g && styles.pillActive]}
            onPress={() => setSelectedGenre(g)}
          >
            <Text style={[styles.pillTxt, selectedGenre === g && styles.pillTxtActive]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{games.length} Test Builds Active</Text>
      </View>

      {/* Game Cards Stack */}
      <View style={styles.list}>
        {games.map((game) => (
          <MobileGameCard key={game.id} game={game} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeTxt: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  sub: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 14,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  pillActive: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.secondary,
  },
  pillTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  pillTxtActive: {
    color: '#fff',
  },
  countRow: {
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  list: {
    gap: 16,
  },
});

