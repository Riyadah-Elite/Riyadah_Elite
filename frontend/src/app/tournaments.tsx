import { Ionicons } from '@expo/vector-icons';
<<<<<<< HEAD
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
=======
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SectionHeading } from '@/components/landing/section-heading';
import { AppShell } from '@/components/layout/app-shell';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClayCard, ClayModal, Panel } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { TextField } from '@/components/ui/text-field';
import { Tooltip } from '@/components/ui/tooltip';
import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  clayShadow,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { getApiErrorMessage } from '@/lib/api';
import { pickImage, type PickedAvatar } from '@/lib/media';
import { uploadScreenshotRequest } from '@/lib/telemetry-api';
import {
  createTournamentRequest,
  deleteTournamentRequest,
  getGamesForTournamentRequest,
  getTournamentsRequest,
  joinTournamentRequest,
  updateTournamentRequest,
} from '@/lib/tournament-api';
import type {
  CreateTournamentPayload,
  GameOption,
  TournamentItem,
} from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';
import { useToast } from '@/providers/toast-provider';

export default function TournamentsScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();
  const { showToast } = useToast();

  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());

  // Creation form state (ORG & ADMIN)
  const [formName, setFormName] = useState('');
  const [formGameId, setFormGameId] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formTeamSize, setFormTeamSize] = useState('1');
  const [formMaxEntry, setFormMaxEntry] = useState('16');
  const [formAmount, setFormAmount] = useState('500');
  const [formCurrency, setFormCurrency] = useState<'INR' | 'USD' | 'QAR' | 'SDG' | 'EUR'>('USD');
  const [formDescription, setFormDescription] = useState('');
  const [formBanner, setFormBanner] = useState<PickedAvatar | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<TournamentItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editTeamSize, setEditTeamSize] = useState('1');
  const [editMaxEntry, setEditMaxEntry] = useState('16');
  const [editAmount, setEditAmount] = useState('500');
  const [editCurrency, setEditCurrency] = useState<'INR' | 'USD' | 'QAR' | 'SDG' | 'EUR'>('USD');
  const [editDescription, setEditDescription] = useState('');
  const [editBanner, setEditBanner] = useState<PickedAvatar | null>(null);
  const [editImageId, setEditImageId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Delete confirmation modal state
  const [deletingItem, setDeletingItem] = useState<TournamentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const role = user?.role ?? 'USER';
  const isOrg = role === 'ORG';
  const isAdmin = role === 'ADMIN';
  const canPublish = isOrg || isAdmin;

  const loadTournaments = useCallback(
    async (targetPage = 1, searchQuery = '') => {
      setLoading(true);
      try {
        const data = await getTournamentsRequest({
          page: targetPage,
          limit: 10,
          search: searchQuery,
        });
        setTournaments(data.items);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages || 1);
      } catch (err) {
        showToast({
          title: 'Load Failed',
          message: getApiErrorMessage(err),
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  const loadGames = useCallback(async () => {
    try {
      const pageData = await getGamesForTournamentRequest();
      const mapped = pageData.items.map((g) => ({ id: g.id, gameName: g.gameName }));
      setGames(mapped);
      if (mapped.length > 0 && !formGameId) {
        setFormGameId(mapped[0].id);
      }
    } catch {
      // Non-blocking
    }
  }, [formGameId]);

  useEffect(() => {
    void loadTournaments(1, search);
    if (user && canPublish) {
      void loadGames();
    }
  }, [canPublish, loadGames, loadTournaments, user]);

  async function handleCreateTournament() {
    if (!formName.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Enter a valid tournament title.',
        variant: 'error',
      });
      return;
    }

    if (!formGameId) {
      showToast({
        title: 'Validation Error',
        message: 'Select an assigned game title for this tournament.',
        variant: 'error',
      });
      return;
    }

    setPublishing(true);
    try {
      let imageId: string | undefined;
      if (formBanner) {
        const uploadRes = await uploadScreenshotRequest(
          formBanner.uri,
          formBanner.fileName,
          formBanner.mimeType,
          'Tournament banner',
          formBanner.file,
        );
        imageId = uploadRes.id;
      }

      const payload: CreateTournamentPayload = {
        tournamentName: formName.trim(),
        gameListingId: formGameId,
        tournamentUrl: formUrl.trim() || undefined,
        teamSize: parseInt(formTeamSize, 10) || 1,
        maxEntry: parseInt(formMaxEntry, 10) || 16,
        amount: parseFloat(formAmount) || undefined,
        currency: formCurrency,
        description: formDescription.trim() || undefined,
        imageId,
        status: 'active',
      };

      const created = await createTournamentRequest(payload);
      showToast({
        title: 'Tournament Published',
        message: `"${created.tournamentName}" is now active in the platform schedule.`,
        variant: 'success',
      });

      setFormName('');
      setFormUrl('');
      setFormDescription('');
      setFormBanner(null);
      void loadTournaments(1, search);
    } catch (err) {
      showToast({
        title: 'Publish Failed',
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    } finally {
      setPublishing(false);
    }
  }

  async function handleJoin(item: TournamentItem) {
    if (!user) {
      openAuth('login');
      showToast({
        title: 'Authentication Required',
        message: 'Please sign in or create an account to join this tournament.',
        variant: 'info',
      });
      return;
    }

    try {
      await joinTournamentRequest(item.id);
      setEnrolledIds((prev) => new Set(prev).add(item.id));
      showToast({
        title: 'Bracket Enlisted',
        message: `You are officially registered for "${item.tournamentName}".`,
        variant: 'success',
      });
    } catch (err) {
      showToast({
        title: 'Enlistment Failed',
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    }
  }

  function handleOpenEdit(item: TournamentItem) {
    setEditingItem(item);
    setEditName(item.tournamentName);
    setEditUrl(item.tournamentUrl ?? '');
    setEditTeamSize(String(item.teamSize));
    setEditMaxEntry(String(item.maxEntry ?? 16));
    setEditAmount(item.amount?.amount !== undefined ? String(item.amount.amount) : '500');
    setEditCurrency(((item.amount?.currency as any) || 'USD'));
    setEditDescription(item.description ?? '');
    setEditBanner(null);
    setEditImageId(item.image?.id ?? null);
  }

  async function handleSaveEdit() {
    if (!editingItem) return;
    setUpdating(true);
    try {
      let imageId = editImageId;
      if (editBanner) {
        const uploadRes = await uploadScreenshotRequest(
          editBanner.uri,
          editBanner.fileName,
          editBanner.mimeType,
          'Tournament banner',
          editBanner.file,
        );
        imageId = uploadRes.id;
      }

      await updateTournamentRequest(editingItem.id, {
        tournamentName: editName.trim() || editingItem.tournamentName,
        tournamentUrl: editUrl.trim() || undefined,
        teamSize: parseInt(editTeamSize, 10) || editingItem.teamSize,
        maxEntry: parseInt(editMaxEntry, 10) || editingItem.maxEntry,
        amount: editAmount ? parseFloat(editAmount) : undefined,
        currency: editCurrency,
        description: editDescription.trim() || undefined,
        imageId: imageId ?? undefined,
      });

      showToast({
        title: 'Tournament Updated',
        message: 'Modifications synced with the platform bracket.',
        variant: 'success',
      });

      setEditingItem(null);
      void loadTournaments(page, search);
    } catch (err) {
      showToast({
        title: 'Update Failed',
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      await deleteTournamentRequest(deletingItem.id);
      showToast({
        title: 'Tournament Deleted',
        message: `"${deletingItem.tournamentName}" was permanently removed.`,
        variant: 'info',
      });
      setDeletingItem(null);
      void loadTournaments(page, search);
    } catch (err) {
      showToast({
        title: 'Delete Failed',
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    } finally {
      setDeleting(false);
    }
  }

  async function handleAdminToggleStatus(item: TournamentItem) {
    const nextStatus = item.status === 'active' ? 'inactive' : 'active';
    try {
      await updateTournamentRequest(item.id, { status: nextStatus });
      showToast({
        title: 'Status Synchronized',
        message: `Tournament marked as ${nextStatus.toUpperCase()}.`,
        variant: 'success',
      });
      void loadTournaments(page, search);
    } catch (err) {
      showToast({
        title: 'Action Failed',
        message: getApiErrorMessage(err),
        variant: 'error',
      });
    }
  }

  return (
    <AppShell eyebrow="Tournament Brackets" title="Tournaments">
      <View style={styles.page}>
          {/* Shared Top Hero */}
          <SectionHeading
            action={
              <StatusBadge
                color={isAdmin ? Palette.primaryBright : isOrg ? Palette.secondary : Palette.tertiary}
                dot
                label={isAdmin ? 'Admin Steward' : isOrg ? 'Organizer Suite' : 'Live Ladder'}
              />
            }
            description="Compete in governed brackets seeded from telemetry points, or host high-stakes tournament series with prize pools and live telemetry."
            eyebrow="Season 04 · Arena Operations"
            title="Tournaments & Brackets"
          />

          {/* VIEW 1 & 2: ORG and ADMIN Publishing Form */}
          {canPublish && (
            <ClayCard style={styles.formCard} padded={false}>
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <View style={styles.formHeaderIcon}>
                    <Ionicons name="trophy" size={18} color={Palette.primary} />
                  </View>
                  <View>
                    <Text style={styles.formTitle}>
                      {isAdmin ? 'Platform Tournament Dispatch' : 'Publish Tournament'}
                    </Text>
                    <Text style={styles.formSubtitle}>
                      {isAdmin
                        ? 'Publish global platform tournament fixtures for operatives and devs.'
                        : 'Deploy your tournament bracket, prize link and squad regulations.'}
                    </Text>
                  </View>
                </View>

                <View style={styles.formFields}>
                  <Tooltip content="Official title of the tournament cup or championship series" position="top">
                    <TextField
                      label="Tournament Name"
                      onChangeText={setFormName}
                      placeholder="e.g. Apex Vanguard Series Cup #4"
                      value={formName}
                    />
                  </Tooltip>

                  {/* Game Selection */}
                  <View style={styles.gameSelectBlock}>
                    <Text style={styles.fieldLabel}>Contested Game Title</Text>
                    {games.length === 0 ? (
                      <TextField
                        hint="Enter target game listing ID"
                        label="Game Listing ID"
                        onChangeText={setFormGameId}
                        placeholder="Paste gameListingId (cuid)"
                        value={formGameId}
                      />
                    ) : (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gameChipsScroll}>
                        <View style={styles.gameChipsRow}>
                          {games.map((g) => {
                            const isSelected = formGameId === g.id;
                            return (
                              <Pressable
                                key={g.id}
                                onPress={() => setFormGameId(g.id)}
                                style={[styles.gameChip, isSelected && styles.gameChipSelected]}>
                                <Text style={[styles.gameChipText, isSelected && styles.gameChipTextSelected]}>
                                  {g.gameName}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </ScrollView>
                    )}
                  </View>

                  <View style={[styles.inlineInputs, isMobile && styles.inlineInputsMobile]}>
                    <View style={styles.inlineCol}>
                      <Tooltip content="Squad size per entry (1 for solo, 2 for duos, 3-5 for squads)" position="top">
                        <TextField
                          keyboardType="number-pad"
                          label="Team Size"
                          onChangeText={setFormTeamSize}
                          placeholder="1"
                          value={formTeamSize}
                        />
                      </Tooltip>
                    </View>

                    <View style={styles.inlineCol}>
                      <Tooltip content="Maximum number of player or team bracket slots" position="top">
                        <TextField
                          keyboardType="number-pad"
                          label="Max Entries"
                          onChangeText={setFormMaxEntry}
                          placeholder="16"
                          value={formMaxEntry}
                        />
                      </Tooltip>
                    </View>
                  </View>

                  <View style={[styles.inlineInputs, isMobile && styles.inlineInputsMobile]}>
                    <View style={styles.inlineCol}>
                      <Tooltip content="Prize pool amount" position="top">
                        <TextField
                          keyboardType="numeric"
                          label="Prize Pool Amount"
                          onChangeText={setFormAmount}
                          placeholder="500"
                          value={formAmount}
                        />
                      </Tooltip>
                    </View>

                    <View style={styles.inlineCol}>
                      <Text style={styles.chipGroupLabel}>Currency</Text>
                      <View style={styles.currencyRow}>
                        {(['USD', 'INR', 'QAR', 'SDG', 'EUR'] as const).map((curr) => {
                          const active = formCurrency === curr;
                          return (
                            <Pressable
                              key={curr}
                              onPress={() => setFormCurrency(curr)}
                              style={[styles.currChip, active && styles.currChipActive]}>
                              <Text style={[styles.currChipText, active && styles.currChipTextActive]}>
                                {curr}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  <Tooltip content="Direct link to Challonge, Battlefy, Discord, or live stream" position="top">
                    <TextField
                      label="External Bracket / Stream URL"
                      onChangeText={setFormUrl}
                      placeholder="https://challonge.com/your-bracket"
                      value={formUrl}
                    />
                  </Tooltip>

                  <Tooltip content="Tournament format, check-in instructions and prizing breakdown" position="top">
                    <TextField
                      label="Description & Rulebook"
                      multiline
                      numberOfLines={3}
                      onChangeText={setFormDescription}
                      placeholder="Specify single elimination, match schedules, anti-cheat rules..."
                      value={formDescription}
                    />
                  </Tooltip>

                  <View style={styles.bannerPickerRow}>
                    {formBanner ? (
                      <View style={styles.bannerPreviewWrapper}>
                        <Image source={{ uri: formBanner.uri }} style={styles.bannerThumbnail} contentFit="cover" />
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text numberOfLines={1} style={styles.bannerName}>{formBanner.fileName}</Text>
                          <Text style={styles.bannerHint}>Banner image attached (MinIO)</Text>
                        </View>
                        <Button
                          icon="close"
                          label=""
                          onPress={() => setFormBanner(null)}
                          size="sm"
                          variant="ghost"
                        />
                      </View>
                    ) : (
                      <Button
                        icon="image-outline"
                        iconPosition="left"
                        label="Attach Tournament Banner"
                        onPress={async () => {
                          try {
                            const picked = await pickImage();
                            if (picked) setFormBanner(picked);
                          } catch (err) {
                            showToast({
                              title: 'Image Picker',
                              message: err instanceof Error ? err.message : 'Could not select banner.',
                              variant: 'warning',
                            });
                          }
                        }}
                        size="sm"
                        variant="dark"
                      />
                    )}
                  </View>

                  <Button
                    fullWidth
                    icon="checkmark-circle-outline"
                    label={isAdmin ? 'Publish Official Tournament' : 'Publish Tournament'}
                    loading={publishing}
                    onPress={() => void handleCreateTournament()}
                    size="lg"
                    variant="lime"
                  />
                </View>
              </View>
            </ClayCard>
          )}

          {/* Search Filter & Header */}
          <Panel padded={false} style={styles.listPanel}>
            <View style={styles.listHeader}>
              <View style={styles.listHeaderTitle}>
                <Ionicons name="git-network-outline" size={18} color={Palette.primary} />
                <View>
                  <Text style={styles.panelTitle}>
                    {isOrg ? 'My Published Tournaments' : isAdmin ? 'All Platform Tournaments' : 'Active Tournaments'}
                  </Text>
                  <Text style={styles.panelSubtitle}>
                    {isOrg
                      ? 'Manage your hosted brackets, edit dates, and remove series'
                      : isAdmin
                        ? 'Master admin controls for verifying, editing, or terminating tournaments'
                        : 'Explore live brackets, view prizing, and join match rooms'}
                  </Text>
                </View>
              </View>

              <View style={styles.searchWrapper}>
                <Tooltip content="Search tournaments by title" position="bottom">
                  <TextField
                    icon="search-outline"
                    label=""
                    onChangeText={(val) => {
                      setSearch(val);
                      void loadTournaments(1, val);
                    }}
                    placeholder="Search tournaments…"
                    value={search}
                  />
                </Tooltip>
              </View>
            </View>

            {/* Tournament Feed */}
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={Palette.primary} size="large" />
                <Text style={styles.loadingText}>Loading tournament feed…</Text>
              </View>
            ) : tournaments.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="trophy-outline" size={32} color={Palette.textDim} />
                <Text style={styles.emptyTitle}>No tournaments found</Text>
                <Text style={styles.emptyCopy}>
                  {canPublish
                    ? 'Use the form above to deploy your first tournament bracket.'
                    : 'Check back soon for new open tournaments.'}
                </Text>
              </View>
            ) : (
              <View style={styles.tournamentsList}>
                {tournaments.map((item) => {
                  const isEnrolled = enrolledIds.has(item.id);
                  const isSolo = item.teamSize === 1;

                  return (
                    <ClayCard key={item.id} style={styles.itemCard} padded={false}>
                      <View style={styles.itemInner}>
                        <View style={styles.itemHeader}>
                          <View style={styles.itemTitleGroup}>
                            <Text style={styles.itemName}>{item.tournamentName}</Text>
                            <Text style={styles.itemGame}>
                              Game: <Text style={styles.bold}>{item.gameListing?.gameName ?? 'Featured Title'}</Text>
                            </Text>
                          </View>

                          <View style={styles.badgesRow}>
                            <StatusBadge
                              color={item.status === 'active' ? Palette.tertiary : Palette.warning}
                              dot
                              label={item.status === 'active' ? 'Active' : 'Inactive'}
                            />
                            <StatusBadge color={Palette.primary} label={isSolo ? '1v1 Solo' : `${item.teamSize}v${item.teamSize} Squad`} />
                            <StatusBadge color={Palette.secondary} label={`Cap: ${item.maxEntry}`} />
                          </View>
                        </View>

                        {item.description ? (
                          <Text numberOfLines={2} style={styles.itemDesc}>
                            {item.description}
                          </Text>
                        ) : null}

                        {/* Controls per Role */}
                        <View style={styles.itemFooter}>
                          <View style={styles.externalLinkRow}>
                            {item.tournamentUrl ? (
                              <Pressable
                                accessibilityLabel="Open external tournament link"
                                onPress={() => {
                                  if (item.tournamentUrl) void Linking.openURL(item.tournamentUrl);
                                }}
                                style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}>
                                <Ionicons name="open-outline" size={14} color={Palette.primaryBright} />
                                <Text style={styles.linkText}>External Bracket</Text>
                              </Pressable>
                            ) : (
                              <Text style={styles.internalBadge}>Platform Room</Text>
                            )}
                          </View>

                          {/* Role 1: ORG Controls */}
                          {isOrg && (
                            <View style={styles.actionRow}>
                              <Button
                                icon="pencil-outline"
                                iconPosition="left"
                                label="Edit"
                                onPress={() => handleOpenEdit(item)}
                                size="sm"
                                variant="dark"
                              />
                              <Button
                                icon="trash-outline"
                                iconPosition="left"
                                label="Delete"
                                onPress={() => setDeletingItem(item)}
                                size="sm"
                                variant="dark"
                              />
                            </View>
                          )}

                          {/* Role 2: ADMIN Controls */}
                          {isAdmin && (
                            <View style={styles.actionRow}>
                              <Button
                                icon={item.status === 'active' ? 'close-circle-outline' : 'checkmark-circle-outline'}
                                iconPosition="left"
                                label={item.status === 'active' ? 'Deactivate' : 'Verify & Open'}
                                onPress={() => void handleAdminToggleStatus(item)}
                                size="sm"
                                variant="ghost"
                              />
                              <Button
                                icon="pencil-outline"
                                iconPosition="left"
                                label="Edit"
                                onPress={() => handleOpenEdit(item)}
                                size="sm"
                                variant="dark"
                              />
                              <Button
                                icon="trash-outline"
                                iconPosition="left"
                                label="Delete"
                                onPress={() => setDeletingItem(item)}
                                size="sm"
                                variant="dark"
                              />
                            </View>
                          )}

                          {/* Role 3: USER & DEVELOPER Controls */}
                          {!canPublish && (
                            <View style={styles.actionRow}>
                              <Button
                                disabled={isEnrolled}
                                icon={isEnrolled ? 'checkmark-done' : 'trophy-outline'}
                                iconPosition="left"
                                label={isEnrolled ? 'Enlisted' : 'Join Tournament'}
                                onPress={() => void handleJoin(item)}
                                size="sm"
                                variant={isEnrolled ? 'dark' : 'lime'}
                              />
                            </View>
                          )}
                        </View>
                      </View>
                    </ClayCard>
                  );
                })}
              </View>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.paginationRow}>
                <Button
                  disabled={page <= 1}
                  label="Previous"
                  onPress={() => void loadTournaments(page - 1, search)}
                  size="sm"
                  variant="dark"
                />
                <Text style={styles.pageIndicator}>
                  Page {page} of {totalPages}
                </Text>
                <Button
                  disabled={page >= totalPages}
                  label="Next"
                  onPress={() => void loadTournaments(page + 1, search)}
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
                  size="sm"
                  variant="dark"
                />
              </View>
<<<<<<< HEAD
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
=======
            )}
          </Panel>
        </View>

      {/* Claymorphic Edit Modal */}
      <ClayModal
        eyebrow="Tournament Editor"
        maxWidth={500}
        onClose={() => setEditingItem(null)}
        title="Edit Tournament"
        visible={Boolean(editingItem)}>
        <View style={styles.modalForm}>
          <TextField
            label="Tournament Title"
            onChangeText={setEditName}
            value={editName}
          />

          <View style={[styles.inlineInputs, isMobile && styles.inlineInputsMobile]}>
            <View style={styles.inlineCol}>
              <TextField
                keyboardType="number-pad"
                label="Team Size"
                onChangeText={setEditTeamSize}
                value={editTeamSize}
              />
            </View>
            <View style={styles.inlineCol}>
              <TextField
                keyboardType="number-pad"
                label="Max Entries"
                onChangeText={setEditMaxEntry}
                value={editMaxEntry}
              />
            </View>
          </View>

          <View style={[styles.inlineInputs, isMobile && styles.inlineInputsMobile]}>
            <View style={styles.inlineCol}>
              <TextField
                keyboardType="numeric"
                label="Prize Pool Amount"
                onChangeText={setEditAmount}
                value={editAmount}
              />
            </View>
            <View style={styles.inlineCol}>
              <Text style={styles.chipGroupLabel}>Currency</Text>
              <View style={styles.currencyRow}>
                {(['USD', 'INR', 'QAR', 'SDG', 'EUR'] as const).map((curr) => {
                  const active = editCurrency === curr;
                  return (
                    <Pressable
                      key={curr}
                      onPress={() => setEditCurrency(curr)}
                      style={[styles.currChip, active && styles.currChipActive]}>
                      <Text style={[styles.currChipText, active && styles.currChipTextActive]}>
                        {curr}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <TextField
            label="External Bracket / Stream URL"
            onChangeText={setEditUrl}
            value={editUrl}
          />

          <TextField
            label="Description & Rulebook"
            multiline
            numberOfLines={3}
            onChangeText={setEditDescription}
            value={editDescription}
          />

          <View style={styles.bannerPickerRow}>
            {editBanner ? (
              <View style={styles.bannerPreviewWrapper}>
                <Image source={{ uri: editBanner.uri }} style={styles.bannerThumbnail} contentFit="cover" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text numberOfLines={1} style={styles.bannerName}>{editBanner.fileName}</Text>
                  <Text style={styles.bannerHint}>New banner selected</Text>
                </View>
                <Button
                  icon="close"
                  label=""
                  onPress={() => setEditBanner(null)}
                  size="sm"
                  variant="ghost"
                />
              </View>
            ) : editingItem?.image?.imageUrl ? (
              <View style={styles.bannerPreviewWrapper}>
                <Image source={{ uri: editingItem.image.imageUrl }} style={styles.bannerThumbnail} contentFit="cover" />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text numberOfLines={1} style={styles.bannerName}>Current Banner</Text>
                  <Text style={styles.bannerHint}>Active on platform</Text>
                </View>
                <Button
                  icon="camera-outline"
                  label="Change"
                  onPress={async () => {
                    try {
                      const picked = await pickImage();
                      if (picked) setEditBanner(picked);
                    } catch (err) {
                      showToast({
                        title: 'Image Picker',
                        message: err instanceof Error ? err.message : 'Could not pick image.',
                        variant: 'warning',
                      });
                    }
                  }}
                  size="sm"
                  variant="dark"
                />
              </View>
            ) : (
              <Button
                icon="image-outline"
                iconPosition="left"
                label="Attach Banner Image"
                onPress={async () => {
                  try {
                    const picked = await pickImage();
                    if (picked) setEditBanner(picked);
                  } catch (err) {
                    showToast({
                      title: 'Image Picker',
                      message: err instanceof Error ? err.message : 'Could not pick image.',
                      variant: 'warning',
                    });
                  }
                }}
                size="sm"
                variant="dark"
              />
            )}
          </View>

          <View style={styles.modalButtonRow}>
            <Button
              label="Cancel"
              onPress={() => setEditingItem(null)}
              size="md"
              style={styles.modalBtn}
              variant="dark"
            />
            <Button
              icon="checkmark"
              label="Save Changes"
              loading={updating}
              onPress={() => void handleSaveEdit()}
              size="md"
              style={styles.modalBtn}
              variant="lime"
            />
          </View>
        </View>
      </ClayModal>

      {/* Claymorphic Delete Confirmation Modal */}
      <ClayModal
        eyebrow="Irreversible Action"
        maxWidth={440}
        onClose={() => setDeletingItem(null)}
        title="Delete Tournament"
        visible={Boolean(deletingItem)}>
        <View style={styles.modalForm}>
          <Text style={styles.deleteWarning}>
            Are you sure you want to delete <Text style={styles.bold}>{deletingItem?.tournamentName}</Text>? All tournament seedings and telemetry references will be permanently removed.
          </Text>

          <View style={styles.modalButtonRow}>
            <Button
              label="Cancel"
              onPress={() => setDeletingItem(null)}
              size="md"
              style={styles.modalBtn}
              variant="dark"
            />
            <Button
              icon="trash-outline"
              label="Delete Tournament"
              loading={deleting}
              onPress={() => void handleConfirmDelete()}
              size="md"
              style={styles.modalBtn}
              variant="dark"
            />
          </View>
        </View>
      </ClayModal>
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: {
<<<<<<< HEAD
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
=======
    gap: Space.lg,
  },
  formCard: {
    backgroundColor: Palette.elevated,
    borderRadius: Radius.clay,
  },
  formContainer: {
    padding: Space.lg,
    gap: Space.md,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  formHeaderIcon: {
    width: 36,
    height: 36,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
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
=======
  },
  formTitle: {
    fontFamily: Fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: Palette.text,
  },
  formSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  formFields: {
    gap: Space.sm + 4,
  },
  gameSelectBlock: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  gameChipsScroll: {
    maxHeight: 46,
  },
  gameChipsRow: {
    flexDirection: 'row',
    gap: Space.xs + 2,
    alignItems: 'center',
  },
  gameChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  gameChipSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primaryBright,
  },
  gameChipText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  gameChipTextSelected: {
    color: Palette.onPrimary,
  },
  inlineInputs: {
    flexDirection: 'row',
    gap: Space.md,
  },
  inlineInputsMobile: {
    flexDirection: 'column',
  },
  inlineCol: {
    flex: 1,
  },
  listPanel: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.clay,
    padding: Space.md,
    gap: Space.md,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Space.sm,
    paddingBottom: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  listHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  panelTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  panelSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  searchWrapper: {
    minWidth: 220,
  },
  loadingWrap: {
    alignItems: 'center',
    padding: Space.xl,
    gap: Space.sm,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Palette.textMuted,
  },
  emptyWrap: {
    alignItems: 'center',
    padding: Space.xl,
    gap: Space.sm,
  },
  emptyTitle: {
    fontFamily: Fonts.display,
    fontSize: 15,
    fontWeight: '600',
    color: Palette.text,
  },
  emptyCopy: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: 'center',
  },
  tournamentsList: {
    gap: Space.md,
  },
  itemCard: {
    backgroundColor: Palette.elevated,
    borderRadius: Radius.xl,
  },
  itemInner: {
    padding: Space.md,
    gap: Space.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Space.xs,
  },
  itemTitleGroup: {
    gap: 2,
    flex: 1,
    minWidth: 180,
  },
  itemName: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  itemGame: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  bold: {
    fontWeight: '700',
    color: Palette.text,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  itemDesc: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: Palette.textDim,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Space.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.surfaceDim,
    flexWrap: 'wrap',
    gap: Space.sm,
  },
  externalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
  },
  linkText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.primaryBright,
  },
  internalBadge: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textFaint,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs + 2,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.md,
    paddingTop: Space.sm,
  },
  chipGroupLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  currChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  currChipActive: {
    backgroundColor: `${Palette.primary}18`,
    borderColor: Palette.primary,
  },
  currChipText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  currChipTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  pageIndicator: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  modalForm: {
    gap: Space.md,
    paddingVertical: Space.xs,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: Space.sm,
    paddingTop: Space.xs,
  },
  modalBtn: {
    flex: 1,
  },
  deleteWarning: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.text,
  },
  bannerPickerRow: {
    paddingVertical: 4,
  },
  bannerPreviewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.xs + 2,
    backgroundColor: Palette.surfaceDim,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  bannerThumbnail: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
  },
  bannerName: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text,
  },
  bannerHint: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
});
