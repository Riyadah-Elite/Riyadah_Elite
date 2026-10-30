import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DesktopHero } from '../components/DesktopHero';
import { DesktopTournamentCard } from '../components/DesktopTournamentCard';
import { DesktopGameCard } from '../components/DesktopGameCard';
import { DesktopLeaderboard } from '../components/DesktopLeaderboard';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { tournamentService } from '../../shared/services/tournamentService';
import { gameService } from '../../shared/services/gameService';
import { MOCK_LEADERBOARD } from '../../shared/services/mockData';
import { TournamentListing, GameListing } from '../../shared/types';
import { theme } from '../../shared/theme';

export const DesktopHomeScreen: React.FC = () => {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<TournamentListing[]>([]);
  const [games, setGames] = useState<GameListing[]>([]);

  useEffect(() => {
    tournamentService.listTournaments({ limit: 3 }).then(setTournaments);
    gameService.listGames({ limit: 3 }).then(setGames);
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. Hero Section */}
      <DesktopHero />

      {/* 2. Featured Tournaments */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="HIGH-STAKES ARENA"
          title="Featured Tournaments & Jams"
          subtitle="Compete for real bounties while subjecting developer stress-test builds to peak server concurrency."
          action={
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push('/tournaments')}
            >
              <Text style={styles.viewAllText}>View All Tournaments</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.brand.accent} />
            </TouchableOpacity>
          }
        />
        <View style={styles.grid3}>
          {tournaments.slice(0, 3).map((t) => (
            <View key={t.id} style={styles.col3}>
              <DesktopTournamentCard tournament={t} />
            </View>
          ))}
        </View>
      </View>

      {/* 3. Community Game-Testing Hub */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="PRE-RELEASE QA LAB"
          title="Active Playtest Opportunities"
          subtitle="Test pre-release games, isolate frame pacing spikes, and file structured bug tickets."
          action={
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push('/games')}
            >
              <Text style={styles.viewAllText}>Explore Testing Lab</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.brand.accent} />
            </TouchableOpacity>
          }
        />
        <View style={styles.grid3}>
          {games.slice(0, 3).map((g) => (
            <View key={g.id} style={styles.col3}>
              <DesktopGameCard game={g} />
            </View>
          ))}
        </View>
      </View>

      {/* 4. QA Triage Inspector & Live Telemetry Teaser */}
      <View style={styles.triageBanner}>
        <View style={styles.triageLeft}>
          <View style={styles.terminalIcon}>
            <Ionicons name="terminal" size={24} color={theme.colors.brand.accent} />
          </View>
          <View style={styles.triageTextCol}>
            <View style={styles.triageBadgeRow}>
              <Text style={styles.triageBadge}>LIVE QA TRIAGE INSPECTOR</Text>
              <Text style={styles.triageStatus}>STATUS: REPRODUCED BY STUDIO</Text>
            </View>
            <Text style={styles.triageTitle}>
              Crash: Unhandled memory exception during checkpoint transition
            </Text>
            <Text style={styles.triageDesc}>
              Game: Chrono Shift v1.0.4 • Build #8472 • DirectStorage 1.2 • Hardware Matrix: RTX 3060+
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.triageActionBtn}
          onPress={() => router.push('/bug-report')}
        >
          <Text style={styles.triageActionText}>Submit Bug Report</Text>
          <Ionicons name="arrow-forward" size={16} color="#09090D" />
        </TouchableOpacity>
      </View>

      {/* 5. Ranking Leaderboard */}
      <View style={styles.section}>
        <SectionHeader
          eyebrow="HALL OF FAME"
          title="Top QA Testers & Bug Hunters"
          subtitle="Vetted testers who have earned official endorsements and rank advancement from game studios."
        />
        <DesktopLeaderboard users={MOCK_LEADERBOARD} />
      </View>

      {/* 6. System Operating Cycle (3-Step Process) */}
      <View style={styles.stepsSection}>
        <SectionHeader
          eyebrow="SYSTEM OPERATING CYCLE"
          title="The Riyadah Elite Engine"
          subtitle="A seamless cycle transforming casual players into vetted testers and tournament contenders."
        />
        <View style={styles.stepsGrid}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumBox}>
              <Text style={styles.stepNum}>01</Text>
            </View>
            <Text style={styles.stepTitle}>Discover & Inspect</Text>
            <Text style={styles.stepDesc}>
              Filter unreleased indie titles and active competitive ladders. Check technical hardware minimums before claiming test keys.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumBox, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Text style={[styles.stepNum, { color: theme.colors.brand.secondary }]}>02</Text>
            </View>
            <Text style={styles.stepTitle}>Test & Report</Text>
            <Text style={styles.stepDesc}>
              Stress-test multiplayer lobbies, isolate frame drops, and file structured bug tickets with native crash dumps and system telemetry.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <View style={[styles.stepNumBox, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
              <Text style={[styles.stepNum, { color: theme.colors.brand.gold }]}>03</Text>
            </View>
            <Text style={styles.stepTitle}>Level Up & Earn</Text>
            <Text style={styles.stepDesc}>
              Earn developer endorsements on merged bug fixes. Build a verifiable portfolio that proves technical QA competency to game studios.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  section: {
    marginBottom: 56,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewAllText: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
    fontSize: theme.typography.fontSize.sm,
  },
  grid3: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  col3: {
    flex: 1,
    minWidth: 320,
  },
  triageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.25)',
    borderRadius: theme.borders.radius['2xl'],
    padding: 24,
    marginBottom: 56,
    flexWrap: 'wrap',
    gap: 20,
    ...theme.shadows.md,
  },
  triageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flex: 1,
    minWidth: 320,
  },
  terminalIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borders.radius.lg,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triageTextCol: {
    gap: 4,
    flex: 1,
  },
  triageBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  triageBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  triageStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text.muted,
  },
  triageTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  triageDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  triageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.borders.radius.md,
    ...theme.shadows.neonGlow,
  },
  triageActionText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '800',
    color: '#09090D',
    textTransform: 'uppercase',
  },
  stepsSection: {
    marginBottom: 32,
  },
  stepsGrid: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  stepCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.xl,
    padding: 24,
    gap: 12,
  },
  stepNumBox: {
    width: 44,
    height: 44,
    borderRadius: theme.borders.radius.md,
    backgroundColor: 'rgba(57, 230, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.brand.accent,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
  },
  stepDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

