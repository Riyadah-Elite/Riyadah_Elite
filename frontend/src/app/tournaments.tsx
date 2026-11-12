import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGate } from '@/components/layout/auth-gate';
import { SectionHeading } from '@/components/landing/section-heading';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClayCard, Panel } from '@/components/ui/card';
import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { formatNumber, tierColor, titleCase } from '@/lib/format';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

const PROTOCOL = [
  {
    icon: 'person-add-outline' as const,
    title: 'Enlist',
    copy: 'Your ladder position is read from verified testing points before seeding.',
  },
  {
    icon: 'git-branch-outline' as const,
    title: 'Seed',
    copy: 'Brackets lock once the field is full. Every round follows the same rulebook.',
  },
  {
    icon: 'trophy-outline' as const,
    title: 'Compete',
    copy: 'Series results are recorded against your operative profile and ladder standing.',
  },
];

export default function TournamentsScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { showToast } = useToast();

  const rank = user?.testingRank ?? 'unranked';
  const points = user?.testingPoints ?? 0;
  const accent = tierColor(rank);
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  return (
    <AppShell eyebrow="Bracket operations" title="Tournaments">
      <AuthGate
        copy="Tournament brackets are reserved for enlisted operatives. Sign in to see your seeding, queue status and match history."
        icon="trophy"
        title="Brackets are session-gated">
        <View style={styles.page}>
          <SectionHeading
            action={<StatusBadge dot color={Palette.tertiary} label="Ladder online" />}
            description="Governed brackets seeded from verified ladder position. One rulebook, from the opening round to the final."
            eyebrow="Season 04"
            title="Bracket operations"
          />

          <View style={[styles.row, isMobile && styles.rowMobile]}>
            <ClayCard style={styles.standing} padded={false}>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardEyebrow}>Your standing</Text>
                  <View style={[styles.tierChip, { borderColor: `${accent}55`, backgroundColor: `${accent}14` }]}>
                    <Ionicons name="shield-half" size={12} color={accent} />
                    <Text style={[styles.tierText, { color: accent }]}>{titleCase(rank)}</Text>
                  </View>
                </View>

                <Text style={styles.points}>{formatNumber(points)}</Text>
                <Text style={styles.pointsLabel}>TESTING POINTS</Text>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${Math.max(progress, 2)}%`, backgroundColor: accent },
                    ]}
                  />
                </View>

                <View style={styles.progressMeta}>
                  <Text style={styles.progressText}>{progress}% to the 1,500 cap</Text>
                  <Text style={styles.progressText}>{titleCase(user?.tournamentStatus ?? 'not queued')}</Text>
                </View>
              </View>
            </ClayCard>

            <ClayCard glass style={styles.queue} padded={false}>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardEyebrow}>Queue status</Text>
                  <StatusBadge color={Palette.warning} label="Standby" />
                </View>

                <View style={styles.queueIcon}>
                  <Ionicons name="hourglass-outline" size={22} color={Palette.warning} />
                </View>

                <Text style={styles.queueTitle}>No bracket is open</Text>
                <Text style={styles.queueCopy}>
                  The next season window has not been announced. Your seeding is calculated
                  automatically when a bracket opens.
                </Text>

                <Button
                  fullWidth
                  label="Check queue position"
                  onPress={() =>
                    showToast({
                      title: 'Queue channel',
                      message: 'Bracket announcements land in your transmissions feed.',
                      variant: 'info',
                    })
                  }
                  size="sm"
                  variant="dark"
                />
              </View>
            </ClayCard>
          </View>

          <Panel padded={false}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Open brackets</Text>
                <Text style={styles.panelSubtitle}>Live and upcoming tournament rooms</Text>
              </View>
              <Text style={styles.panelCount}>0 ACTIVE</Text>
            </View>

            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="git-branch-outline" size={22} color={Palette.textDim} />
              </View>
              <Text style={styles.emptyTitle}>The bracket feed is clear</Text>
              <Text style={styles.emptyCopy}>
                When a tournament opens, its room appears here with seeding, schedule and prizing.
                Nothing is simulated.
              </Text>
            </View>
          </Panel>

          <ClayCard glass padded={false}>
            <View style={styles.protocol}>
              <View style={styles.protocolHead}>
                <Text style={styles.cardEyebrow}>Match protocol</Text>
                <Text style={styles.protocolMeta}>3 STAGES</Text>
              </View>

              <View style={[styles.protocolGrid, isMobile && styles.protocolGridMobile]}>
                {PROTOCOL.map((step, index) => (
                  <View key={step.title} style={styles.protocolStep}>
                    <View style={styles.protocolIcon}>
                      <Ionicons name={step.icon} size={16} color={Palette.primary} />
                    </View>
                    <Text style={styles.protocolIndex}>STAGE {String(index + 1).padStart(2, '0')}</Text>
                    <Text style={styles.protocolTitle}>{step.title}</Text>
                    <Text style={styles.protocolCopy}>{step.copy}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ClayCard>
        </View>
      </AuthGate>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: Space.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Space.md,
  },
  rowMobile: {
    flexDirection: 'column',
  },
  standing: {
    flex: 1.1,
  },
  queue: {
    flex: 1,
  },
  cardBody: {
    padding: Space.lg,
    gap: 8,
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
    marginBottom: 4,
  },
  cardEyebrow: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.3,
  },
  tierChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  tierText: {
    ...Typography.labelTight,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  points: {
    fontFamily: Fonts.display,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1.6,
    color: Palette.text,
  },
  pointsLabel: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: Radius.pill,
  },
  progressMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.sm,
  },
  progressText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    textTransform: 'capitalize',
  },
  queueIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(185, 119, 14, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  queueTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Palette.text,
  },
  queueCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 19,
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    padding: Space.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    backgroundColor: Palette.surfaceDim,
  },
  panelTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text,
  },
  panelSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textFaint,
    marginTop: 1,
  },
  panelCount: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.2,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: Space.xl,
    paddingHorizontal: Space.lg,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  emptyCopy: {
    ...Typography.bodySm,
    color: Palette.textFaint,
    textAlign: 'center',
    maxWidth: 420,
  },
  protocol: {
    padding: Space.lg,
    gap: Space.md,
  },
  protocolHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protocolMeta: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.1,
  },
  protocolGrid: {
    flexDirection: 'row',
    gap: Space.md,
  },
  protocolGridMobile: {
    flexDirection: 'column',
    gap: Space.lg,
  },
  protocolStep: {
    flex: 1,
    gap: 5,
  },
  protocolIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  protocolIndex: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.textFaint,
    letterSpacing: 1.2,
  },
  protocolTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text,
  },
  protocolCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 18,
  },
});
