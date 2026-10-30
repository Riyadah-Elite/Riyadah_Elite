import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeaderboardUser } from '../../shared/types';
import { theme } from '../../shared/theme';

interface Props {
  users: LeaderboardUser[];
}

export const DesktopLeaderboard: React.FC<Props> = ({ users }) => {
  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.colHead, { width: 60 }]}>RANK</Text>
        <Text style={[styles.colHead, { flex: 1.5 }]}>QA COMMANDER</Text>
        <Text style={[styles.colHead, { flex: 1 }]}>TIER</Text>
        <Text style={[styles.colHead, { width: 100, textAlign: 'right' }]}>XP POINTS</Text>
        <Text style={[styles.colHead, { width: 100, textAlign: 'right' }]}>BUGS FIXED</Text>
        <Text style={[styles.colHead, { width: 90, textAlign: 'right' }]}>ACCURACY</Text>
      </View>

      {/* Rows */}
      {users.map((u) => {
        const isTop3 = u.rank <= 3;
        const rankColor =
          u.rank === 1
            ? theme.colors.brand.gold
            : u.rank === 2
            ? '#CBD5E1'
            : u.rank === 3
            ? '#CD7F32'
            : theme.colors.text.muted;

        return (
          <View key={u.id} style={[styles.row, isTop3 && styles.topRow]}>
            <View style={[styles.rankBox, { borderColor: rankColor }]}>
              <Text style={[styles.rankNum, { color: rankColor }]}>#{u.rank}</Text>
            </View>

            <View style={[styles.userCol, { flex: 1.5 }]}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarTxt}>{u.username.charAt(0)}</Text>
              </View>
              <Text style={styles.usernameTxt}>@{u.username}</Text>
              {isTop3 && (
                <Ionicons name="sparkles" size={13} color={theme.colors.brand.accent} />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.tierPill}>
                <Text style={styles.tierTxt}>{u.tierName}</Text>
              </View>
            </View>

            <Text style={[styles.dataTxt, { width: 100, textAlign: 'right', color: theme.colors.brand.accent, fontWeight: '800' }]}>
              {u.testingPoints.toLocaleString()}
            </Text>

            <Text style={[styles.dataTxt, { width: 100, textAlign: 'right' }]}>
              {u.bugsResolved}
            </Text>

            <Text style={[styles.dataTxt, { width: 90, textAlign: 'right', color: theme.colors.brand.secondary }]}>
              {u.accuracyRate}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  colHead: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  topRow: {
    backgroundColor: 'rgba(112, 41, 245, 0.04)',
  },
  rankBox: {
    width: 36,
    height: 28,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontSize: 11,
    fontWeight: '900',
  },
  userCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  usernameTxt: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  tierPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(57, 230, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.round,
  },
  tierTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    textTransform: 'uppercase',
  },
  dataTxt: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
});

