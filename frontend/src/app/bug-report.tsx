import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
import { useState } from 'react';
import {
=======
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  Platform,
  Pressable,
  StyleSheet,
  Text,
<<<<<<< HEAD
  TextInput,
  View,
  type ViewStyle,
=======
  View,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
} from 'react-native';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGate } from '@/components/layout/auth-gate';
import { SectionHeading } from '@/components/landing/section-heading';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';
import { ClayCard } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
import { useToast } from '@/providers/toast-provider';

const AREAS = ['Gameplay', 'Interface', 'Performance', 'Network', 'Other'];
const SEVERITIES = [
  { key: 'low', label: 'Low', accent: Palette.tertiary },
  { key: 'medium', label: 'Medium', accent: Palette.warning },
  { key: 'high', label: 'High', accent: Palette.danger },
  { key: 'critical', label: 'Critical', accent: Palette.danger },
];

const GUIDANCE = [
  'State what you expected and what happened instead.',
  'List the exact steps that reproduce the anomaly.',
  'Include build, device and network conditions.',
  'Attach one screenshot per distinct issue.',
];

export default function BugReportScreen() {
  const { isMobile } = useResponsive();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [area, setArea] = useState(AREAS[0]);
  const [severity, setSeverity] = useState(SEVERITIES[1].key);
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [titleError, setTitleError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<string | undefined>();

  function handleSubmit() {
    let valid = true;

    if (title.trim().length < 5) {
      setTitleError('Give the report a clear title of at least 5 characters.');
      valid = false;
    }

    if (description.trim().length < 20) {
      setDescriptionError('Describe the anomaly in at least 20 characters.');
      valid = false;
    }

    if (!valid) return;

    showToast({
      title: 'Intake channel pending',
      message:
        'The bug intake endpoint is not connected yet. Your draft stays on this device - nothing was submitted.',
      variant: 'warning',
    });
  }

  return (
    <AppShell eyebrow="Anomaly intake" title="Bug Report">
      <AuthGate
        copy="Bug intake is reserved for enlisted operatives. Sign in to file a report against an assigned build."
        icon="bug"
        title="Intake is session-gated">
        <View style={styles.page}>
          <SectionHeading
            action={
              <View style={styles.secureTag}>
                <Ionicons name="shield-checkmark-outline" size={12} color={Palette.tertiary} />
                <Text style={styles.secureText}>Verified intake</Text>
              </View>
            }
            description="File a precise anomaly report. Title, affected area and exact reproduction steps are what move a bug through triage."
            eyebrow="Quality control"
            title="Report an anomaly"
          />

          <View style={[styles.layout, isMobile && styles.layoutMobile]}>
            <ClayCard style={styles.formCard} padded={false}>
              <View style={styles.form}>
                <View style={styles.formHead}>
                  <View style={styles.formHeadIcon}>
                    <Ionicons name="bug-outline" size={17} color={Palette.secondary} />
                  </View>
                  <View>
                    <Text style={styles.formTitle}>Anomaly report</Text>
                    <Text style={styles.formSubtitle}>All fields are reviewed by a testing steward</Text>
                  </View>
                </View>

                <TextField
                  autoCapitalize="sentences"
                  error={titleError}
                  icon="create-outline"
                  label="Report title"
                  maxLength={90}
                  onChangeText={(value) => {
                    setTitle(value);
                    if (titleError) setTitleError(undefined);
                  }}
                  placeholder="Short, specific summary of the anomaly"
                  value={title}
                />

                <View style={styles.group}>
                  <Text style={styles.groupLabel}>Affected area</Text>
                  <View style={styles.chips}>
                    {AREAS.map((option) => (
                      <ChoiceChip
                        active={area === option}
                        key={option}
                        label={option}
                        onPress={() => setArea(option)}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.group}>
                  <Text style={styles.groupLabel}>Severity</Text>
                  <View style={styles.chips}>
                    {SEVERITIES.map((option) => (
                      <ChoiceChip
                        accent={option.accent}
                        active={severity === option.key}
                        key={option.key}
                        label={option.label}
                        onPress={() => setSeverity(option.key)}
                      />
                    ))}
                  </View>
                </View>

                <TextArea
                  error={descriptionError}
                  label="What happened?"
                  onChangeText={(value) => {
                    setDescription(value);
                    if (descriptionError) setDescriptionError(undefined);
                  }}
                  placeholder="Expected behaviour, actual behaviour and how often it occurs."
                  value={description}
                />

                <TextArea
                  label="Reproduction steps"
                  onChangeText={setSteps}
                  placeholder={'1. Start a testing session\n2. Open the assigned build\n3. …'}
                  value={steps}
                />

                <View style={styles.actions}>
                  <Button
                    icon="send"
                    label="Submit report"
                    onPress={handleSubmit}
                    size="lg"
                  />
                  <Text style={styles.actionsNote}>
                    Reports are stored against your operative profile only after the intake
                    endpoint is connected.
                  </Text>
                </View>
              </View>
            </ClayCard>

            <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
              <ClayCard glass padded={false}>
                <View style={styles.sidebarBody}>
                  <View style={styles.sidebarHead}>
                    <Ionicons name="list-outline" size={15} color={Palette.primaryBright} />
                    <Text style={styles.sidebarTitle}>Triage checklist</Text>
                  </View>

                  <View style={styles.guidance}>
                    {GUIDANCE.map((item, index) => (
                      <View key={item} style={styles.guidanceRow}>
                        <Text style={styles.guidanceIndex}>{String(index + 1).padStart(2, '0')}</Text>
                        <Text style={styles.guidanceText}>{item}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.sidebarRule} />

                  <View style={styles.sidebarMeta}>
                    <Ionicons name="time-outline" size={12} color={Palette.tertiary} />
                    <Text style={styles.sidebarMetaText}>First review inside 24 hours</Text>
                  </View>
                  <View style={styles.sidebarMeta}>
                    <Ionicons name="git-commit-outline" size={12} color={Palette.primaryBright} />
                    <Text style={styles.sidebarMetaText}>Linked to your assigned build</Text>
                  </View>
                </View>
              </ClayCard>

              <ClayCard padded={false}>
                <View style={styles.sidebarBody}>
                  <Text style={styles.cardEyebrow}>Report state</Text>
                  <Text style={styles.stateTitle}>Draft only</Text>
                  <Text style={styles.stateCopy}>
                    This screen builds the report locally. Submitting is disabled until the backend
                    intake route exists, so no fake tickets are created.
                  </Text>
                </View>
              </ClayCard>
            </View>
          </View>
        </View>
      </AuthGate>
    </AppShell>
  );
}

function ChoiceChip({
  label,
  active,
  onPress,
  accent = Palette.primaryBright,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  accent?: string;
}) {
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && {
          borderColor: `${accent}66`,
          backgroundColor: `${accent}16`,
        },
        hovered && !active && styles.chipHover,
        pressed && { opacity: 0.8 },
      ]}>
      {active ? <View style={[styles.chipDot, { backgroundColor: accent }]} /> : null}
      <Text style={[styles.chipText, active && { color: accent }]}>{label}</Text>
    </Pressable>
  );
}

function TextArea({
  label,
  value,
  onChangeText,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  const fieldShadow: ViewStyle =
    Platform.OS === 'web'
      ? ({
          boxShadow: error
            ? 'inset 2px 2px 5px rgba(136,104,74,0.16), inset -2px -2px 5px rgba(255,255,255,0.85), 0 0 0 3px rgba(178,58,58,0.12)'
            : focused
              ? 'inset 2px 2px 5px rgba(136,104,74,0.16), inset -2px -2px 5px rgba(255,255,255,0.85), 0 0 0 3px rgba(198,79,40,0.12)'
              : 'inset 2px 2px 5px rgba(136,104,74,0.18), inset -2px -2px 5px rgba(255,255,255,0.85)',
        } as ViewStyle)
      : {};

  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>

      <View
        style={[
          styles.textArea,
          {
            borderColor: error ? Palette.danger : focused ? Palette.primary : 'transparent',
            backgroundColor: focused ? Palette.elevated : Palette.surfaceDim,
          },
          fieldShadow,
        ]}>
        <TextInput
          accessibilityLabel={label}
          multiline
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={Palette.textFaint}
          selectionColor={Palette.primary}
          style={styles.textAreaInput}
          textAlignVertical="top"
          value={value}
        />
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={11} color={Palette.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  );
}

const styles = StyleSheet.create({
  page: {
<<<<<<< HEAD
    gap: Space.xl,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(46, 125, 98, 0.10)',
  },
  secureText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.tertiary,
    letterSpacing: 0.9,
  },
  layout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
  },
  layoutMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  formCard: {
    flex: 1,
    minWidth: 0,
  },
  form: {
    padding: Space.lg,
    gap: 14,
  },
  formHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: Space.md,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  formHeadIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(217, 154, 43, 0.12)',
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
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
<<<<<<< HEAD
    fontSize: 10,
    color: Palette.textFaint,
    marginTop: 1,
  },
  group: {
    gap: 6,
  },
  groupLabel: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: Palette.surfaceDim,
  },
  chipHover: {
    borderColor: Palette.border,
    backgroundColor: Palette.raised,
  },
  chipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  chipText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  textArea: {
    minHeight: 104,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textAreaInput: {
    minHeight: 82,
    padding: 0,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.text,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.danger,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
  },
  actionsNote: {
    ...Typography.bodySm,
    fontSize: 10,
    color: Palette.textFaint,
    flex: 1,
    minWidth: 200,
    lineHeight: 15,
  },
  sidebar: {
    width: 300,
    gap: Space.md,
  },
  sidebarMobile: {
    width: '100%',
  },
  sidebarBody: {
    padding: Space.lg,
    gap: 10,
  },
  sidebarHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sidebarTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.text,
  },
  guidance: {
    gap: 9,
  },
  guidanceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  guidanceIndex: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.primary,
    letterSpacing: 0.8,
    lineHeight: 17,
  },
  guidanceText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 17,
    color: Palette.textMuted,
    flex: 1,
  },
  sidebarRule: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  sidebarMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sidebarMetaText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
  },
  cardEyebrow: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.2,
  },
  stateTitle: {
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    fontFamily: Fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.text,
  },
<<<<<<< HEAD
  stateCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 18,
=======
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
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
});
