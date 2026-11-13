import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGate } from '@/components/layout/auth-gate';
import { SectionHeading } from '@/components/landing/section-heading';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClayCard, ClayModal, Panel } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Tooltip } from '@/components/ui/tooltip';
import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { pickAvatar, type PickedAvatar } from '@/lib/media';
import {
  createBugReportRequest,
  fetchBugReportsRequest,
  fetchGameListingsRequest,
  fetchUserEnrollmentsRequest,
  updateBugReportStatusRequest,
  uploadScreenshotRequest,
} from '@/lib/telemetry-api';
import type { BugReportItem, BugReportStatus, GameListingItem } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';
import { useToast } from '@/providers/toast-provider';

const STATUS_METAS: Record<
  BugReportStatus,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  open: { label: 'Open', color: Palette.warning, icon: 'alert-circle-outline' },
  inprogress: { label: 'In Progress', color: Palette.primary, icon: 'sync-outline' },
  resolved: { label: 'Resolved', color: Palette.tertiary, icon: 'checkmark-circle-outline' },
  closed: { label: 'Closed', color: Palette.textDim, icon: 'close-circle-outline' },
};

export default function BugReportScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { showToast } = useToast();

  const role = user?.role ?? 'USER';
  const isDev = role === 'DEVELOPER';
  const isAdmin = role === 'ADMIN';

  // Shared reports list state
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<BugReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BugReportStatus | undefined>();
  const [search, setSearch] = useState('');

  // USER VIEW: In-page submit form state
  const [enrolledGames, setEnrolledGames] = useState<GameListingItem[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [bugDescription, setBugDescription] = useState('');
  const [screenshot, setScreenshot] = useState<PickedAvatar | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // CLAYMORPHIC MODAL: Image preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // DEVELOPER / ADMIN: Triage action loading state per report id
  const [triagingBugId, setTriagingBugId] = useState<string | null>(null);

  // Load Reports
  const loadReports = useCallback(async () => {
    if (!user) {
      setReports([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchBugReportsRequest({
        page,
        limit: 10,
        status: statusFilter,
        search: search.trim() || undefined,
      });
      setReports(res.items);
      setTotalPages(res.pagination.totalPages || 1);
    } catch (err) {
      showToast({
        title: 'Telemetry Sync Failed',
        message: err instanceof Error ? err.message : 'Could not load bug telemetry reports.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [user, page, statusFilter, search, showToast]);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  // Load Enrolled Games for USER report form
  useEffect(() => {
    if (user && !isDev && !isAdmin) {
      void (async () => {
        try {
          const [enrollments, listingsRes] = await Promise.all([
            fetchUserEnrollmentsRequest().catch(() => []),
            fetchGameListingsRequest({ page: 1, limit: 50 }).catch(() => ({ items: [] })),
          ]);

          const enrolledIds = new Set(enrollments.map((e) => e.gameListingId || (e as any).listingId).filter(Boolean));
          const matched = listingsRes.items.filter((item) => enrolledIds.has(item.id));
          setEnrolledGames(matched);
          if (matched[0] && !selectedGameId) {
            setSelectedGameId(matched[0].id);
          }
        } catch {
          // silently continue
        }
      })();
    }
  }, [user, isDev, isAdmin, selectedGameId]);

  // Pick Screenshot Evidence
  async function handlePickScreenshot() {
    try {
      const picked = await pickAvatar();
      if (picked) {
        setScreenshot(picked);
        showToast({
          title: 'Evidence Attached',
          message: `${picked.fileName} ready for telemetry upload.`,
          variant: 'info',
        });
      }
    } catch (err) {
      showToast({
        title: 'Attachment Failed',
        message: err instanceof Error ? err.message : 'Could not select screenshot.',
        variant: 'warning',
      });
    }
  }

  // Submit Bug Report (USER View)
  async function handleSubmitBug() {
    if (!selectedGameId) {
      showToast({
        title: 'Validation',
        message: 'Select an enrolled test flight before submitting an anomaly.',
        variant: 'warning',
      });
      return;
    }

    if (bugDescription.trim().length < 10) {
      showToast({
        title: 'Validation',
        message: 'Please provide at least 10 characters detailing the anomaly and reproduction steps.',
        variant: 'warning',
      });
      return;
    }

    try {
      setSubmitting(true);
      let uploadedImageId: string | null = null;

      if (screenshot) {
        const uploadRes = await uploadScreenshotRequest(
          screenshot.uri,
          screenshot.fileName,
          screenshot.mimeType,
          'Bug report evidence screenshot',
          screenshot.file,
        );
        uploadedImageId = uploadRes.id;
      }

      await createBugReportRequest({
        gameListingId: selectedGameId,
        bugDescription: bugDescription.trim(),
        imageId: uploadedImageId,
      });

      showToast({
        title: 'Anomaly Logged',
        message: 'Bug report submitted! Ladder points will be credited upon developer verification.',
        variant: 'success',
      });

      setBugDescription('');
      setScreenshot(null);
      setPage(1);
      void loadReports();
    } catch (err) {
      showToast({
        title: 'Submission Failed',
        message: err instanceof Error ? err.message : 'Could not submit bug report.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  // Quick Triage Status Button Handler (DEVELOPER / ADMIN)
  async function handleQuickStatusUpdate(bugId: string, newStatus: BugReportStatus) {
    try {
      setTriagingBugId(bugId);
      await updateBugReportStatusRequest(bugId, newStatus);
      showToast({
        title: 'Triage Updated',
        message:
          newStatus === 'resolved'
            ? 'Report marked as RESOLVED! Operative awarded 100 ladder points.'
            : `Bug status updated to ${newStatus.toUpperCase()}.`,
        variant: 'success',
      });
      void loadReports();
    } catch (err) {
      showToast({
        title: 'Triage Failed',
        message: err instanceof Error ? err.message : 'Failed to update bug status.',
        variant: 'error',
      });
    } finally {
      setTriagingBugId(null);
    }
  }

  return (
    <AppShell eyebrow="Anomaly intake & telemetry" title="Bug Reports">
      <View style={styles.page}>
        <SectionHeading
          description="Submit reproducible telemetry with evidence, triage incoming anomalies, and earn testing ladder points."
          eyebrow="Quality telemetry"
          title={
            !user
              ? 'Operative Anomaly Intake'
              : isDev
                ? 'Developer Triage Queue'
                : isAdmin
                  ? 'Global Platform Anomaly Deck'
                  : 'Operative Anomaly Intake & History'
          }
        />

        {/* ================================================================= */}
        {/* GUEST VIEW: Clean prompt card with Submit Bug Report auth trigger */}
        {/* ================================================================= */}
        {!user ? (
          <ClayCard style={styles.submitCard} padded={false}>
            <View style={styles.formInner}>
              <View style={styles.formHeader}>
                <View style={styles.formIcon}>
                  <Ionicons name="bug" size={18} color={Palette.secondary} />
                </View>
                <View>
                  <Text style={styles.formTitle}>Submit Anomaly Telemetry</Text>
                  <Text style={styles.formSubtitle}>
                    Record gameplay bugs with screenshot proof to advance your testing rank
                  </Text>
                </View>
              </View>

              <View style={styles.warningBox}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Palette.primary} />
                <Text style={styles.warningText}>
                  Bug reporting requires an active test flight assignment. Enlist in games on the
                  testing floor, run telemetry builds, and report verified issues to earn ladder points.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <Button
                  icon="log-in-outline"
                  label="Submit Bug Report"
                  onPress={() => {
                    openAuth('login');
                    showToast({
                      title: 'Authentication Required',
                      message: 'Please sign in or create an account to submit bug telemetry.',
                      variant: 'info',
                    });
                  }}
                  size="lg"
                  variant="lime"
                />
                <Button
                  icon="person-add-outline"
                  label="Create Account"
                  onPress={() => openAuth('register')}
                  size="lg"
                  variant="dark"
                />
              </View>
            </View>
          </ClayCard>
        ) : !isDev && !isAdmin ? (
            <ClayCard style={styles.submitCard} padded={false}>
              <View style={styles.formInner}>
                <View style={styles.formHeader}>
                  <View style={styles.formIcon}>
                    <Ionicons name="bug" size={18} color={Palette.secondary} />
                  </View>
                  <View>
                    <Text style={styles.formTitle}>Submit Anomaly Telemetry</Text>
                    <Text style={styles.formSubtitle}>
                      Record gameplay bugs with screenshot proof to advance your testing rank
                    </Text>
                  </View>
                </View>

                {enrolledGames.length === 0 ? (
                  <View style={styles.warningBox}>
                    <Ionicons name="alert-circle-outline" size={20} color={Palette.warning} />
                    <Text style={styles.warningText}>
                      You are not enrolled in any active test flights yet. Visit the Game Testing
                      floor to enlist in a build before filing bug reports!
                    </Text>
                  </View>
                ) : (
                  <View style={styles.flightSelectorSection}>
                    <Text style={styles.fieldLabel}>Select Enrolled Game Flight *</Text>
                    <View style={styles.flightChips}>
                      {enrolledGames.map((game) => {
                        const selected = selectedGameId === game.id;
                        return (
                          <Tooltip
                            key={game.id}
                            content={`File bug for ${game.gameName}`}
                            position="top">
                            <Pressable
                              onPress={() => setSelectedGameId(game.id)}
                              style={[styles.flightChip, selected && styles.flightChipSelected]}>
                              <Ionicons
                                name="game-controller"
                                size={14}
                                color={selected ? Palette.primary : Palette.textDim}
                              />
                              <Text
                                style={[
                                  styles.flightChipText,
                                  selected && styles.flightChipTextSelected,
                                ]}>
                                {game.gameName}
                              </Text>
                            </Pressable>
                          </Tooltip>
                        );
                      })}
                    </View>
                  </View>
                )}

                <Tooltip content="Detail the expected behavior vs actual bug and exact steps to reproduce" position="top">
                  <TextField
                    label="Anomaly Description & Reproduction Steps *"
                    multiline
                    numberOfLines={4}
                    onChangeText={setBugDescription}
                    placeholder="1. Launch into Level 2&#10;2. Press Shift + Space simultaneously&#10;3. Camera disconnects from character avatar..."
                    value={bugDescription}
                  />
                </Tooltip>

                <View style={styles.evidenceUploadRow}>
                  <Tooltip content="Upload JPG or PNG screenshot evidence stored via MinIO" position="top">
                    <Button
                      icon="image-outline"
                      label={
                        screenshot
                          ? `Evidence: ${screenshot.fileName.slice(0, 18)}...`
                          : 'Attach Screenshot Evidence'
                      }
                      onPress={() => void handlePickScreenshot()}
                      size="sm"
                      variant="dark"
                    />
                  </Tooltip>
                  {screenshot && (
                    <StatusBadge
                      color={Palette.tertiary}
                      icon="checkmark-circle"
                      label="Screenshot Ready"
                    />
                  )}
                </View>

                <Tooltip content="Submit report to developer triage pipeline" position="top">
                  <Button
                    disabled={enrolledGames.length === 0}
                    fullWidth
                    icon="send"
                    label="Submit Bug Report"
                    loading={submitting}
                    onPress={() => void handleSubmitBug()}
                    size="lg"
                    variant="lime"
                  />
                </Tooltip>
              </View>
            </ClayCard>
          ) : null}

          {/* ================================================================= */}
          {/* REPORTS FEED / TRIAGE QUEUE (Role-Adaptive - Signed-in Operatives) */}
          {/* ================================================================= */}
          {user && (
            <Panel padded={false}>
            <View style={styles.panelHeader}>
              <View>
                <Text style={styles.panelTitle}>
                  {isDev
                    ? 'Incoming Telemetry Triage Queue'
                    : isAdmin
                      ? 'Global Anomaly Moderation Queue'
                      : 'My Submitted Bug Telemetry History'}
                </Text>
                <Text style={styles.panelSubtitle}>
                  {isDev
                    ? 'Review bug evidence, inspect screenshots, and approve fixes with status actions'
                    : 'Track triage progression and verified point rewards'}
                </Text>
              </View>

              <View style={styles.filterControls}>
                {/* Status Filter Chips */}
                <View style={styles.statusChips}>
                  {(['open', 'inprogress', 'resolved', 'closed'] as BugReportStatus[]).map(
                    (st) => {
                      const active = statusFilter === st;
                      const cfg = STATUS_METAS[st];
                      return (
                        <Tooltip key={st} content={`Filter tickets by ${cfg.label}`} position="top">
                          <Pressable
                            onPress={() => {
                              setStatusFilter(active ? undefined : st);
                              setPage(1);
                            }}
                            style={[
                              styles.chip,
                              active && {
                                backgroundColor: `${cfg.color}22`,
                                borderColor: cfg.color,
                              },
                            ]}>
                            <Ionicons
                              name={cfg.icon}
                              size={12}
                              color={active ? cfg.color : Palette.textDim}
                            />
                            <Text
                              style={[
                                styles.chipLabel,
                                active && { color: cfg.color, fontWeight: '700' },
                              ]}>
                              {cfg.label}
                            </Text>
                          </Pressable>
                        </Tooltip>
                      );
                    },
                  )}
                </View>

                <View style={styles.searchWrap}>
                  <TextField
                    label=""
                    onChangeText={(val) => {
                      setSearch(val);
                      setPage(1);
                    }}
                    placeholder="Search descriptions..."
                    value={search}
                  />
                </View>
              </View>
            </View>

            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator color={Palette.primary} size="large" />
                <Text style={styles.loadingText}>Fetching anomaly records...</Text>
              </View>
            ) : reports.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="shield-checkmark-outline" size={32} color={Palette.textDim} />
                <Text style={styles.emptyTitle}>No anomaly reports found</Text>
                <Text style={styles.emptyCopy}>
                  {isDev
                    ? 'All reports for your builds have been addressed. No active tickets pending!'
                    : 'You have not submitted any bug reports matching these filters.'}
                </Text>
              </View>
            ) : (
              <View style={styles.reportsList}>
                {reports.map((report) => {
                  const cfg = STATUS_METAS[report.status] ?? STATUS_METAS.open;
                  const isBusy = triagingBugId === report.id;

                  return (
                    <ClayCard key={report.id} style={styles.reportCard} padded={false}>
                      <View style={styles.reportInner}>
                        <View style={styles.reportTop}>
                          <View style={styles.reportMeta}>
                            <View style={styles.badgeRow}>
                              <StatusBadge color={cfg.color} icon={cfg.icon} label={cfg.label} />
                              {report.gameListing?.gameName && (
                                <StatusBadge
                                  color={Palette.primary}
                                  label={report.gameListing.gameName}
                                />
                              )}
                              {report.user?.username && (
                                <Text style={styles.authorTag}>by @{report.user.username}</Text>
                              )}
                            </View>
                            <Text style={styles.timestamp}>
                              Filed on {new Date(report.createdAt).toLocaleDateString()}
                            </Text>
                          </View>

                          {/* Image preview thumbnail */}
                          {report.image?.imageUrl && (
                            <Tooltip content="Click to enlarge screenshot in Claymorphic modal" position="left">
                              <Pressable
                                onPress={() => setPreviewImageUrl(report.image!.imageUrl)}
                                style={styles.evidenceThumbWrap}>
                                <Image
                                  resizeMode="cover"
                                  source={{ uri: report.image.imageUrl }}
                                  style={styles.evidenceThumb}
                                />
                                <View style={styles.thumbOverlay}>
                                  <Ionicons name="expand" size={12} color="#FFF" />
                                </View>
                              </Pressable>
                            </Tooltip>
                          )}
                        </View>

                        <Text style={styles.reportDescription}>{report.bugDescription}</Text>

                        {/* DEVELOPER / ADMIN Neumorphic Triage Buttons Toolbar */}
                        {(isDev || isAdmin) && (
                          <View style={styles.triageToolbar}>
                            <Text style={styles.triageLabel}>Shift Ticket Status:</Text>
                            <View style={styles.triageButtons}>
                              <Tooltip content="Mark as Open" position="top">
                                <Button
                                  disabled={isBusy || report.status === 'open'}
                                  label="Open"
                                  onPress={() => void handleQuickStatusUpdate(report.id, 'open')}
                                  size="sm"
                                  variant={report.status === 'open' ? 'dark' : 'ghost'}
                                />
                              </Tooltip>

                              <Tooltip content="Mark work In Progress" position="top">
                                <Button
                                  disabled={isBusy || report.status === 'inprogress'}
                                  label="In Progress"
                                  onPress={() =>
                                    void handleQuickStatusUpdate(report.id, 'inprogress')
                                  }
                                  size="sm"
                                  variant={report.status === 'inprogress' ? 'dark' : 'ghost'}
                                />
                              </Tooltip>

                              <Tooltip content="Resolve anomaly and award 100 points to operative" position="top">
                                <Button
                                  disabled={isBusy || report.status === 'resolved'}
                                  icon="checkmark-circle"
                                  label="Resolve (+100 Pts)"
                                  onPress={() =>
                                    void handleQuickStatusUpdate(report.id, 'resolved')
                                  }
                                  size="sm"
                                  variant="lime"
                                />
                              </Tooltip>

                              <Tooltip content="Close ticket if resolved or invalid" position="top">
                                <Button
                                  disabled={isBusy || report.status === 'closed'}
                                  label="Close"
                                  onPress={() => void handleQuickStatusUpdate(report.id, 'closed')}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                            </View>
                          </View>
                        )}
                      </View>
                    </ClayCard>
                  );
                })}
              </View>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.paginationRow}>
                <Tooltip content="Previous page" position="top">
                  <Button
                    disabled={page <= 1}
                    icon="chevron-back"
                    label="Prev"
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                    size="sm"
                    variant="dark"
                  />
                </Tooltip>
                <Text style={styles.pageLabel}>
                  Page {page} of {totalPages}
                </Text>
                <Tooltip content="Next page" position="top">
                  <Button
                    disabled={page >= totalPages}
                    icon="chevron-forward"
                    label="Next"
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                    size="sm"
                    variant="dark"
                  />
                </Tooltip>
              </View>
            )}
          </Panel>
        )}
      </View>

      {/* CLAYMORPHIC MODAL: Image Evidence Preview */}
      <ClayModal
        eyebrow="Bug Evidence"
        onClose={() => setPreviewImageUrl(null)}
        title="Screenshot Inspection"
        visible={!!previewImageUrl}>
        <View style={styles.previewModalBody}>
          {previewImageUrl && (
            <Image
              resizeMode="contain"
              source={{ uri: previewImageUrl }}
              style={styles.fullPreviewImage}
            />
          )}
          <View style={styles.previewActions}>
            <Tooltip content="Open raw screenshot link in new browser tab" position="top">
              <Button
                icon="open-outline"
                label="Open Full Resolution"
                onPress={() => {
                  if (previewImageUrl) void Linking.openURL(previewImageUrl);
                }}
                size="sm"
                variant="ghost"
              />
            </Tooltip>
            <Tooltip content="Close preview modal" position="top">
              <Button
                label="Close"
                onPress={() => setPreviewImageUrl(null)}
                size="sm"
                variant="dark"
              />
            </Tooltip>
          </View>
        </View>
      </ClayModal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: Space.lg,
    paddingVertical: Space.xl,
    gap: Space.xl,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  submitCard: {
    backgroundColor: Palette.surface,
  },
  formInner: {
    padding: Space.lg,
    gap: Space.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingBottom: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  formIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: `${Palette.secondary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  formSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.md,
    backgroundColor: `${Palette.warning}15`,
    borderRadius: Radius.lg,
  },
  warningText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.warning,
    flex: 1,
    lineHeight: 18,
  },
  flightSelectorSection: {
    gap: Space.xs,
  },
  fieldLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text,
  },
  flightChips: {
    flexDirection: 'row',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  flightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Space.sm,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  flightChipSelected: {
    backgroundColor: `${Palette.primary}15`,
    borderColor: Palette.primary,
  },
  flightChipText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  flightChipTextSelected: {
    color: Palette.primary,
    fontWeight: '700',
  },
  evidenceUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
  },
  panelHeader: {
    padding: Space.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    gap: Space.md,
  },
  panelTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.text,
  },
  panelSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
    marginTop: 2,
  },
  filterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Space.md,
  },
  statusChips: {
    flexDirection: 'row',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Space.sm,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  searchWrap: {
    minWidth: 220,
  },
  centered: {
    padding: Space.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.md,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
  },
  empty: {
    padding: Space.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  emptyCopy: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 20,
  },
  reportsList: {
    padding: Space.lg,
    gap: Space.md,
  },
  reportCard: {
    backgroundColor: Palette.surface,
  },
  reportInner: {
    padding: Space.lg,
    gap: Space.md,
  },
  reportTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Space.sm,
  },
  reportMeta: {
    gap: Space.xs,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  authorTag: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
    marginLeft: 4,
  },
  timestamp: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  reportDescription: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Palette.text,
    lineHeight: 20,
  },
  evidenceThumbWrap: {
    width: 60,
    height: 60,
    borderRadius: Radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  evidenceThumb: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Radius.pill,
    padding: 3,
  },
  triageToolbar: {
    paddingTop: Space.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  triageLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  triageButtons: {
    flexDirection: 'row',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.lg,
    padding: Space.lg,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  pageLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  previewModalBody: {
    gap: Space.md,
    alignItems: 'center',
  },
  fullPreviewImage: {
    width: '100%',
    height: 320,
    borderRadius: Radius.lg,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: Space.sm,
  },
});
