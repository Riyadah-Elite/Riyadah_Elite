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

const STATUS_META = {
  pending: { label: 'Pending', accent: Palette.warning, icon: 'hourglass-outline' as const },
  inprogress: { label: 'In progress', accent: Palette.primaryBright, icon: 'pulse' as const },
  completed: { label: 'Completed', accent: Palette.tertiary, icon: 'checkmark-done' as const },
  failure: { label: 'Failure', accent: Palette.danger, icon: 'close-circle-outline' as const },
} as const;

const PIPELINE = [
  { key: 'pending', copy: 'A build is assigned and waiting for your first session.' },
  { key: 'inprogress', copy: 'Telemetry collection is active while you exercise the listed flows.' },
  { key: 'completed', copy: 'Findings are reviewed, then testing points are credited to your tier.' },
  { key: 'failure', copy: 'A blocked build is recorded with the reason attached to your profile.' },
] as const;

export default function GameTestingScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { showToast } = useToast();

  const status = user?.testingStatus ?? null;
  const meta = status ? STATUS_META[status] : null;
  const rank = user?.testingRank ?? 'unranked';
  const points = user?.testingPoints ?? 0;
  const accent = tierColor(rank);
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  return (
    <AppShell eyebrow="Telemetry programmes" title="Game Testing">
      <AuthGate
        copy="Testing programmes are assigned to enlisted operatives. Sign in to see your build, status and credited points."
        icon="game-controller"
        title="Programmes are session-gated">
        <View style={styles.page}>
          <SectionHeading
            action={<StatusBadge dot color={Palette.primaryBright} label="Telemetry ready" />}
            description="Play assigned builds, record anomalies and convert verified findings into ladder points."
            eyebrow="Testing floor"
            title="Telemetry programmes"
          />

          <View style={[styles.row, isMobile && styles.rowMobile]}>
            <ClayCard glass style={styles.assignment} padded={false}>
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardEyebrow}>Current assignment</Text>
                  {meta ? (
                    <StatusBadge color={meta.accent} icon={meta.icon} label={meta.label} />
                  ) : (
                    <StatusBadge color={Palette.textDim} label="Unassigned" />
                  )}
                </View>

                <View style={[styles.assignmentIcon, meta ? { backgroundColor: `${meta.accent}14` } : null]}>
                  <Ionicons
                    name={meta?.icon ?? 'flask-outline'}
                    size={22}
                    color={meta?.accent ?? Palette.textDim}
                  />
                </View>

                <Text style={styles.assignmentTitle}>
                  {status ? titleCase(meta?.label ?? status) : 'No active build'}
                </Text>
                <Text style={styles.assignmentCopy}>
                  {status
                    ? 'Your programme state is synced from the arena core. Open the build brief when the assignment channel goes live.'
                    : 'No build has been assigned yet. Programmes appear here as soon as a steward attaches one to your account.'}
                </Text>

                <Button
                  fullWidth
                  label="Open build brief"
                  onPress={() =>
                    showToast({
                      title: 'Build brief',
                      message: 'Assignment channels are being wired into the testing floor.',
                      variant: 'info',
                    })
                  }
                  size="sm"
                  variant="dark"
                />
              </View>
            </ClayCard>

            <ClayCard style={styles.scoring} padded={false}>
              <View style={styles.cardBody}>
                <Text style={styles.cardEyebrow}>Ladder output</Text>

                <View style={styles.scoreRow}>
                  <Text style={[styles.scoreValue, { color: accent }]}>{formatNumber(points)}</Text>
                  <Text style={styles.scoreCap}>/ 1,500</Text>
                </View>

                <Text style={[styles.scoreRank, { color: accent }]}>{titleCase(rank)}</Text>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${Math.max(progress, 2)}%`, backgroundColor: accent },
                    ]}
                  />
                </View>

                <View style={styles.scoreMeta}>
                  <Text style={styles.scoreMetaText}>15 tiers · 100 pts each</Text>
                  <Text style={styles.scoreMetaText}>{progress}%</Text>
                </View>

                <View style={styles.scoreRule} />

                <View style={styles.scoreNote}>
                  <Ionicons name="information-circle-outline" size={13} color={Palette.textDim} />
                  <Text style={styles.scoreNoteText}>
                    Points are credited only after a completed programme is reviewed.
                  </Text>
                </View>
              </View>
            </ClayCard>
          </View>

          <Panel padded={false}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>Assigned builds</Text>
                <Text style={styles.panelSubtitle}>Programmes attached to your operative profile</Text>
              </View>
              <Text style={styles.panelCount}>0 ACTIVE</Text>
            </View>

            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="flask-outline" size={22} color={Palette.textDim} />
              </View>
              <Text style={styles.emptyTitle}>No build attached</Text>
              <Text style={styles.emptyCopy}>
                Builds are assigned by the testing stewards. Nothing is simulated here - this list
                stays empty until a real programme is attached.
              </Text>
            </View>
          </Panel>

          <ClayCard padded={false}>
            <View style={styles.pipeline}>
              <View style={styles.pipelineHead}>
                <Text style={styles.cardEyebrow}>Programme lifecycle</Text>
                <Text style={styles.pipelineMeta}>4 STATES</Text>
              </View>

              <View style={[styles.pipelineGrid, isMobile && styles.pipelineGridMobile]}>
                {PIPELINE.map((step, index) => {
                  const stepMeta = STATUS_META[step.key];

                  return (
                    <View key={step.key} style={styles.step}>
                      <View style={styles.stepTop}>
                        <View
                          style={[
                            styles.stepDot,
                            {
                              backgroundColor: `${stepMeta.accent}1f`,
                              borderColor: `${stepMeta.accent}55`,
                            },
                          ]}>
                          <Ionicons name={stepMeta.icon} size={14} color={stepMeta.accent} />
                        </View>
                        <Text style={styles.stepIndex}>{String(index + 1).padStart(2, '0')}</Text>
                      </View>

                      <Text style={styles.stepTitle}>{stepMeta.label}</Text>
                      <Text style={styles.stepCopy}>{step.copy}</Text>
                    </View>
                  );
                })}
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
  assignment: {
    flex: 1.1,
  },
  scoring: {
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
  assignmentIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(198, 79, 40, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  assignmentTitle: {
    fontFamily: Fonts.display,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Palette.text,
  },
  assignmentCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 19,
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  scoreValue: {
    fontFamily: Fonts.display,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -1.4,
  },
  scoreCap: {
    ...Typography.numericSm,
    color: Palette.textFaint,
    fontSize: 11,
  },
  scoreRank: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
  },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    overflow: 'hidden',
    marginTop: 4,
  },
  fill: {
    height: 4,
    borderRadius: Radius.pill,
  },
  scoreMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreMetaText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
  },
  scoreRule: {
    height: 1,
    backgroundColor: Palette.border,
    marginTop: 6,
  },
  scoreNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  scoreNoteText: {
    ...Typography.bodySm,
    color: Palette.textFaint,
    lineHeight: 17,
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
    maxWidth: 430,
  },
  pipeline: {
    padding: Space.lg,
    gap: Space.md,
  },
  pipelineHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pipelineMeta: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.1,
  },
  pipelineGrid: {
    flexDirection: 'row',
    gap: Space.md,
  },
  pipelineGridMobile: {
    flexDirection: 'column',
    gap: Space.lg,
  },
  step: {
    flex: 1,
    gap: 5,
  },
  stepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndex: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.2,
  },
  stepTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.text,
  },
  stepCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 18,
  },
});
