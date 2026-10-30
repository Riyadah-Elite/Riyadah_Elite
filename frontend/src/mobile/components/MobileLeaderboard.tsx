import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaderboardUser } from '../../shared/types';
import { theme } from '../../shared/theme';

interface Props {
  users: LeaderboardUser[];
}

export const MobileLeaderboard: React.FC<Props> = ({ users }) => {
  return (
    <View style={styles.container}>
      {users.slice(0, 5).map((u) => {
        const rankColor =
          u.rank === 1
            ? theme.colors.brand.gold
            : u.rank === 2
            ? '#CBD5E1'
            : u.rank === 3
            ? '#CD7F32'
            : theme.colors.text.muted;

        return (
          <View key={u.id} style={styles.card}>
            <View style={[styles.rankBox, { borderColor: rankColor }]}>
              <Text style={[styles.rankTxt, { color: rankColor }]}>#{u.rank}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>@{u.username}</Text>
              <Text style={styles.tier}>{u.tierName} • {u.accuracyRate} Acc</Text>
            </View>

            <View style={styles.score}>
              <Text style={styles.xp}>{u.testingPoints} XP</Text>
              <Text style={styles.bugs}>{u.bugsResolved} resolved</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.md,
    padding: 12,
    gap: 12,
  },
  rankBox: {
    width: 32,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTxt: {
    fontSize: 10,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  tier: {
    fontSize: 10,
    color: theme.colors.brand.accent,
    fontWeight: '600',
  },
  score: {
    alignItems: 'flex-end',
    gap: 2,
  },
  xp: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.brand.accent,
  },
  bugs: {
    fontSize: 10,
    color: theme.colors.text.muted,
  },
});

