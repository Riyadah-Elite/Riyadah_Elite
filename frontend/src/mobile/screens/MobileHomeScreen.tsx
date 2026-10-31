import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MobileHero } from '../components/MobileHero';
import { MobileTournamentCard } from '../components/MobileTournamentCard';
import { MobileGameCard } from '../components/MobileGameCard';
import { MobileLeaderboard } from '../components/MobileLeaderboard';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { tournamentService } from '../../shared/services/tournamentService';
import { gameService } from '../../shared/services/gameService';
import { MOCK_LEADERBOARD } from '../../shared/services/mockData';
import { TournamentListing, GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';

export const MobileHomeScreen: React.FC = () => {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<TournamentListing[]>([]);
  const [games, setGames] = useState<GameListing[]>([]);

  useEffect(() => {
    tournamentService.listTournaments({ limit: 3 }).then(setTournaments);
    gameService.listGames({ limit: 3 }).then(setGames);
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Mobile Hero */}
      <MobileHero />

      {/* 2. Featured Tournaments */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="HIGH-STAKES ARENA"
          title="Tournaments & Jams"
          subtitle="Compete for real prize pools."
          action={
            <TouchableOpacity onPress={() => router.push('/tournaments')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          }
        />
        {tournaments.slice(0, 3).map((t) => (
          <MobileTournamentCard key={t.id} tournament={t} />
        ))}
      </View>

      {/* 3. Game Testing Opportunities */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="PRE-RELEASE LAB"
          title="Game Playtests"
          subtitle="Submit bugs and build your tester portfolio."
          action={
            <TouchableOpacity onPress={() => router.push('/games')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          }
        />
        {games.slice(0, 3).map((g) => (
          <MobileGameCard key={g.id} game={g} />
        ))}
      </View>

      {/* 4. Bug Report Callout */}
      <View style={styles.bugBanner}>
        <View style={styles.bugBannerContent}>
          <Text style={styles.bugBannerTag}>LIVE TRIAGE INSPECTOR</Text>
          <Text style={styles.bugBannerTitle}>Found a Glitch or Crash?</Text>
          <Text style={styles.bugBannerDesc}>
            Submit hardware profiles and steps to reproduce. Get rewarded with verified tester endorsements.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bugBannerBtn}
          onPress={() => router.push('/bug-report')}
        >
          <Text style={styles.bugBannerBtnTxt}>Submit Bug</Text>
          <Ionicons name="arrow-forward" size={14} color="#09090D" />
        </TouchableOpacity>
      </View>

      {/* 5. Leaderboard */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="HALL OF FAME"
          title="Top QA Testers"
          subtitle="Highest ranked bug hunters in the ecosystem."
        />
        <MobileLeaderboard users={MOCK_LEADERBOARD} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    marginBottom: 32,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.brand.accent,
  },
  bugBanner: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.25)',
    borderRadius: theme.borders.radius.lg,
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  bugBannerContent: {
    gap: 4,
  },
  bugBannerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  bugBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  bugBannerDesc: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
  bugBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.sm,
  },
  bugBannerBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: '#09090D',
    textTransform: 'uppercase',
  },
});

