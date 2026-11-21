import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
import { getApiErrorMessage } from '@/lib/api';
import { leaderboardRequest } from '@/lib/auth-api';
import { formatJoined, formatNumber, positionColor, tierColor, titleCase } from '@/lib/format';
import type { LeaderboardEntry } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';

import { StatusBadge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Panel } from '../ui/card';
import { Tooltip } from '../ui/tooltip';
import { SectionHeading } from './section-heading';

const DESKTOP_LIMIT = 8;
const MOBILE_LIMIT = 5;

export function Leaderboard() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { requireAuth } = useAuthModal();

  const [items, setItems] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    leaderboardRequest(isMobile ? MOBILE_LIMIT : DESKTOP_LIMIT)
      .then((page) => {
        if (active) {
          setError(null);
          setItems(page.items);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(getApiErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isMobile, reloadToken]);

  return (
    <View>
      <SectionHeading
        action={
          <>
            <StatusBadge dot label="Live ladder" />
            <Tooltip content="Explore full tournament roster and competitive brackets" position="bottom">
              <Button
                icon="arrow-forward"
                label="Full ladder"
                onPress={() => requireAuth('/tournaments')}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
          </>
        }
        description="The public scoreboard is generated from testing points. Fifteen tiers, a 1,500-point ceiling and no hidden placements."
        eyebrow="Scoreboard"
        title="Global ladder"
      />

      <Panel padded={false}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headCell, styles.positionCell]}>#</Text>
          <Text style={[styles.headCell, styles.playerCell]}>Player</Text>
          {!isMobile ? <Text style={[styles.headCell, styles.roleCell]}>Role</Text> : null}
          {!isMobile ? <Text style={[styles.headCell, styles.tierCell]}>Tier</Text> : null}
          <Text style={[styles.headCell, styles.pointsHead]}>Points</Text>
          {!isMobile ? <Text style={[styles.headCell, styles.joinedCell]}>Joined</Text> : null}
        </View>

        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={Palette.primary} size="small" />
            <Text style={styles.stateTitle}>Loading the ladder…</Text>
            <Text style={styles.stateCopy}>Reading the latest testing standings.</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <View style={styles.stateIcon}>
              <Ionicons name="cloud-offline-outline" size={22} color={Palette.danger} />
            </View>
            <Text style={styles.stateTitle}>Ladder offline</Text>
            <Text style={styles.stateCopy}>{error}</Text>
            <Tooltip content="Reconnect to telemetry ladder server" position="top">
              <Button
                icon="refresh"
                iconPosition="left"
                label="Retry"
                onPress={retry}
                size="sm"
                variant="dark"
              />
            </Tooltip>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.state}>
            <View style={styles.stateIcon}>
              <Ionicons name="podium-outline" size={22} color={Palette.textDim} />
            </View>
            <Text style={styles.stateTitle}>No standings yet</Text>
            <Text style={styles.stateCopy}>
              The ladder is waiting for its first ranked player. Claim a tier and take the top slot.
            </Text>
            <Tooltip content="Enroll in active game tests to earn first placement" position="top">
              <Button
                label="Claim your rank"
                onPress={() => requireAuth('/game-testing')}
                size="sm"
              />
            </Tooltip>
          </View>
        ) : (
          items.map((entry) => (
            <LeaderboardRow
              entry={entry}
              isCurrentUser={entry.id === user?.id}
              isMobile={isMobile}
              key={entry.id}
              onPress={() => requireAuth('/tournaments')}
            />
          ))
        )}

        <View style={styles.tableFoot}>
          <View style={styles.footNote}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Palette.tertiary} />
            <Text style={styles.footText}>Live telemetry synced from verified bug reports & testing ladder</Text>
          </View>
          <Text style={styles.footMeta}>TOP 8 · SEASON 04</Text>
        </View>
      </Panel>
    </View>
  );
}

function LeaderboardRow({
  entry,
  isMobile,
  isCurrentUser,
  onPress,
}: {
  entry: LeaderboardEntry;
  isMobile: boolean;
  isCurrentUser: boolean;
  onPress: () => void;
}) {
  const { hovered, hoverProps } = useHover();
  const rank = entry.testingRank ?? 'unranked';
  const rankColor = tierColor(rank);
  const placementColor = positionColor(entry.position);

  return (
    <Pressable
      {...hoverProps}
      accessibilityLabel={`${titleCase(entry.username)}, position ${entry.position}, ${formatNumber(entry.testingPoints)} points`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isCurrentUser && styles.rowCurrent,
        hovered && styles.rowHover,
        pressed && styles.rowPressed,
      ]}>
      <View style={styles.positionCell}>
        <View
          style={[
            styles.positionBadge,
            entry.position <= 3 && {
              borderColor: `${placementColor}44`,
              backgroundColor: `${placementColor}12`,
            },
          ]}>
          <Text style={[styles.positionText, { color: placementColor }]}>{entry.position}</Text>
        </View>
      </View>

      <View style={[styles.playerCell, styles.playerIdentity]}>
        <Avatar name={entry.username} size={32} uri={entry.avatarUrl} />

        <View style={styles.identityCopy}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={[styles.username, isCurrentUser && styles.usernameCurrent]}>
              {entry.username}
            </Text>
            {isCurrentUser ? (
              <View style={styles.youChip}>
                <Text style={styles.youText}>You</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.mobileTier}>{titleCase(rank)}</Text>
        </View>
      </View>

      {!isMobile ? (
        <View style={styles.roleCell}>
          <View style={styles.roleChip}>
            <Text style={styles.roleText}>{entry.role}</Text>
          </View>
        </View>
      ) : null}

      {!isMobile ? (
        <View style={styles.tierValueCell}>
          <View style={[styles.tierDot, { backgroundColor: rankColor }]} />
          <Text numberOfLines={1} style={styles.tierText}>
            {titleCase(rank)}
          </Text>
        </View>
      ) : null}

      <View style={styles.pointsCell}>
        <Text style={styles.points}>{formatNumber(entry.testingPoints)}</Text>
        {!isMobile ? <Text style={styles.pointsUnit}>PTS</Text> : null}
      </View>

      {!isMobile ? (
        <Text style={[styles.joinedCell, styles.joinedText]}>{formatJoined(entry.createdAt)}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.surfaceDim,
  },
  headCell: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textDim,
    letterSpacing: 1,
  },
  positionCell: {
    width: 46,
  },
  playerCell: {
    flex: 1,
  },
  roleCell: {
    width: 92,
  },
  tierCell: {
    width: 128,
  },
  pointsCell: {
    width: 90,
    alignItems: 'flex-end',
  },
  pointsHead: {
    width: 90,
    textAlign: 'right',
  },
  joinedCell: {
    width: 92,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.md,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Palette.glassBorder,
  },
  rowCurrent: {
    backgroundColor: Palette.primaryWash,
  },
  rowHover: {
    backgroundColor: 'rgba(36, 28, 22, 0.035)',
  },
  rowPressed: {
    backgroundColor: Palette.primaryWashStrong,
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    ...Typography.numeric,
    fontSize: 12,
    color: Palette.textMuted,
  },
  playerIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  identityCopy: {
    flex: 1,
    gap: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontFamily: Fonts.display,
    fontSize: 13,
    fontWeight: '500',
    color: Palette.text,
    flexShrink: 1,
  },
  usernameCurrent: {
    color: Palette.primaryBright,
  },
  youChip: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: Palette.primaryWashStrong,
  },
  youText: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.primaryBright,
    letterSpacing: 0.7,
  },
  mobileTier: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    textTransform: 'capitalize',
  },
  roleChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: Palette.surfaceDim,
  },
  roleText: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.textDim,
    letterSpacing: 0.7,
  },
  tierValueCell: {
    width: 128,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tierDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  tierText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textMuted,
    flexShrink: 1,
  },
  points: {
    ...Typography.numeric,
    fontSize: 13,
    color: Palette.text,
  },
  pointsUnit: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.textFaint,
    textAlign: 'right',
  },
  joinedText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textFaint,
    fontVariant: ['tabular-nums'],
  },
  state: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: Space.xl,
    paddingHorizontal: Space.lg,
  },
  stateIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  stateTitle: {
    ...Typography.title,
    color: Palette.textMuted,
    fontSize: 14,
  },
  stateCopy: {
    ...Typography.bodySm,
    color: Palette.textFaint,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 4,
  },
  tableFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    paddingHorizontal: Space.md,
    paddingVertical: 10,
    backgroundColor: Palette.surfaceDim,
  },
  footNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  footText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textDim,
    flexShrink: 1,
  },
  footMeta: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.textFaint,
    letterSpacing: 1,
  },
});
