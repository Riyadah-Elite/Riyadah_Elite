import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { formatNumber, tierColor, titleCase } from '@/lib/format';
import { pickImage, type PickedAvatar } from '@/lib/media';
import {
  createCategoryRequest,
  createGameListingRequest,
  deleteGameListingRequest,
  fetchCategoriesRequest,
  fetchGameListingsRequest,
  fetchTrackedUsersRequest,
  fetchUserEnrollmentsRequest,
  joinGameListingRequest,
  updateGameListingRequest,
  uploadScreenshotRequest,
} from '@/lib/telemetry-api';
import type { CategoryItem, GameListingItem } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

const PLATFORMS_LIST = [
  'all',
  'windows',
  'web',
  'android',
  'ios',
  'linux',
  'macos',
  'console',
] as const;

export default function GameTestingScreen() {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const { showToast } = useToast();

  const role = user?.role ?? 'USER';
  const isDev = role === 'DEVELOPER';
  const isAdmin = role === 'ADMIN';

  // Listings & Categories state
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<GameListingItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // DEVELOPER: Publish Game Listing Form state
  const [publishing, setPublishing] = useState(false);
  const [devGameName, setDevGameName] = useState('');
  const [devCategoryId, setDevCategoryId] = useState('');
  const [devGameUrl, setDevGameUrl] = useState('');
  const [devPlatform, setDevPlatform] = useState<
    'android' | 'web' | 'ios' | 'windows' | 'console' | 'linux' | 'macos'
  >('windows');
  const [devDescription, setDevDescription] = useState('');
  const [devGuides, setDevGuides] = useState('');
  const [devBugsListing, setDevBugsListing] = useState('');
  const [devAmount, setDevAmount] = useState('100');
  const [devCurrency, setDevCurrency] = useState<'USD' | 'INR' | 'QAR' | 'SDG' | 'EUR'>('USD');
  const [devRegDays, setDevRegDays] = useState('14');
  const [devTestDays, setDevTestDays] = useState('30');
  const [devBanner, setDevBanner] = useState<PickedAvatar | null>(null);

  // Edit Game Listing Modal state (DEVELOPER / ADMIN)
  const [editingListing, setEditingListing] = useState<GameListingItem | null>(null);
  const [editGameName, setEditGameName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editGameUrl, setEditGameUrl] = useState('');
  const [editPlatform, setEditPlatform] = useState<
    'android' | 'web' | 'ios' | 'windows' | 'console' | 'linux' | 'macos'
  >('windows');
  const [editDescription, setEditDescription] = useState('');
  const [editGuides, setEditGuides] = useState('');
  const [editBugsListing, setEditBugsListing] = useState('');
  const [editAmount, setEditAmount] = useState('100');
  const [editCurrency, setEditCurrency] = useState<'USD' | 'INR' | 'QAR' | 'SDG' | 'EUR'>('USD');
  const [editBanner, setEditBanner] = useState<PickedAvatar | null>(null);
  const [editImageId, setEditImageId] = useState<string | null>(null);
  const [updatingListing, setUpdatingListing] = useState(false);

  // DEVELOPER: Enrolled tester tracking modal
  const [trackingModalListing, setTrackingModalListing] = useState<GameListingItem | null>(null);
  const [trackedTesters, setTrackedTesters] = useState<any[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // ADMIN: Category creation bar state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Delete modal (Developer / Admin)
  const [deletingListing, setDeletingListing] = useState<GameListingItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Ladder stats (for USER)
  const rank = user?.testingRank ?? 'unranked';
  const points = user?.testingPoints ?? 0;
  const accent = tierColor(rank);
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [listingsRes, categoriesRes, enrollmentsRes] = await Promise.all([
        fetchGameListingsRequest({
          page,
          limit: 10,
          search: search.trim() || undefined,
          platform: platformFilter === 'all' ? undefined : platformFilter,
        }),
        fetchCategoriesRequest().catch(() => []),
        !isDev && !isAdmin ? fetchUserEnrollmentsRequest().catch(() => []) : Promise.resolve([]),
      ]);

      setGames(listingsRes.items);
      setTotalPages(listingsRes.pagination.totalPages || 1);
      setCategories(categoriesRes);

      if (!devCategoryId && categoriesRes[0]) {
        setDevCategoryId(categoriesRes[0].id);
      }

      if (enrollmentsRes.length > 0) {
        const enrolled = new Set<string>();
        enrollmentsRes.forEach((e) => {
          if (e.gameListingId) enrolled.add(e.gameListingId);
        });
        setEnrolledIds(enrolled);
      }
    } catch (err) {
      showToast({
        title: 'Network Sync Error',
        message: err instanceof Error ? err.message : 'Failed to retrieve telemetry listings.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, platformFilter, isDev, isAdmin, devCategoryId, showToast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Join Game Test (USER / ORG)
  async function handleJoinGame(listing: GameListingItem) {
    try {
      setJoiningId(listing.id);
      await joinGameListingRequest(listing.id);
      setEnrolledIds((prev) => new Set(prev).add(listing.id));
      showToast({
        title: 'Enlisted in Test Flight',
        message: `Successfully enrolled in ${listing.gameName} telemetry testing!`,
        variant: 'success',
      });
    } catch (err) {
      showToast({
        title: 'Enlistment Failed',
        message: err instanceof Error ? err.message : 'Could not join game test.',
        variant: 'error',
      });
    } finally {
      setJoiningId(null);
    }
  }

  // Publish Game Listing (DEVELOPER)
  async function handlePublishListing() {
    if (!devGameName.trim()) {
      showToast({ title: 'Validation', message: 'Game Title is required.', variant: 'warning' });
      return;
    }
    const catId = devCategoryId || categories[0]?.id;
    if (!catId) {
      showToast({
        title: 'Validation',
        message: 'A category is required to list a game build.',
        variant: 'warning',
      });
      return;
    }

    try {
      setPublishing(true);
      let imageId: string | undefined;
      if (devBanner) {
        const uploadRes = await uploadScreenshotRequest(
          devBanner.uri,
          devBanner.fileName,
          devBanner.mimeType,
          'Game banner',
          devBanner.file,
        );
        imageId = uploadRes.id;
      }

      const now = new Date();
      const regEnd = new Date(
        now.getTime() + (parseInt(devRegDays, 10) || 14) * 24 * 60 * 60 * 1000,
      ).toISOString();
      const testDeadline = new Date(
        now.getTime() + (parseInt(devTestDays, 10) || 30) * 24 * 60 * 60 * 1000,
      ).toISOString();

      await createGameListingRequest({
        gameName: devGameName.trim(),
        categoryId: catId,
        description: devDescription.trim() || undefined,
        bugsListing: devBugsListing.trim() || undefined,
        guides: devGuides.trim() || undefined,
        gameUrl: devGameUrl.trim() || undefined,
        platform: devPlatform,
        registrationEndDate: regEnd,
        testingDeadline: testDeadline,
        amount: parseFloat(devAmount) || undefined,
        currency: devCurrency,
        imageId,
        status: 'active',
      });

      showToast({
        title: 'Game Flight Published',
        message: `${devGameName} is now live for operative telemetry testing!`,
        variant: 'success',
      });

      setDevGameName('');
      setDevGameUrl('');
      setDevDescription('');
      setDevGuides('');
      setDevBugsListing('');
      setDevBanner(null);
      void loadData();
    } catch (err) {
      showToast({
        title: 'Publish Error',
        message: err instanceof Error ? err.message : 'Could not publish game build.',
        variant: 'error',
      });
    } finally {
      setPublishing(false);
    }
  }

  // Open Edit Game Listing modal
  function handleOpenEditListing(item: GameListingItem) {
    setEditingListing(item);
    setEditGameName(item.gameName);
    setEditCategoryId(item.categoryId || categories[0]?.id || '');
    setEditGameUrl(item.gameUrl ?? '');
    setEditPlatform(item.platform || 'windows');
    setEditDescription(item.description ?? '');
    setEditGuides(item.guides ?? '');
    setEditBugsListing(item.bugsListing ?? '');
    setEditBanner(null);
    setEditImageId(item.image?.id ?? null);
  }

  // Save Edit Game Listing
  async function handleSaveEditListing() {
    if (!editingListing) return;
    if (!editGameName.trim()) {
      showToast({ title: 'Validation', message: 'Game Title is required.', variant: 'warning' });
      return;
    }
    try {
      setUpdatingListing(true);
      let imageId = editImageId;
      if (editBanner) {
        const uploadRes = await uploadScreenshotRequest(
          editBanner.uri,
          editBanner.fileName,
          editBanner.mimeType,
          'Game banner',
          editBanner.file,
        );
        imageId = uploadRes.id;
      }

      await updateGameListingRequest(editingListing.id, {
        gameName: editGameName.trim(),
        categoryId: editCategoryId || undefined,
        gameUrl: editGameUrl.trim() || undefined,
        platform: editPlatform,
        description: editDescription.trim() || undefined,
        guides: editGuides.trim() || undefined,
        bugsListing: editBugsListing.trim() || undefined,
        amount: editAmount ? parseFloat(editAmount) : undefined,
        currency: editCurrency,
        imageId: imageId ?? undefined,
      });

      showToast({
        title: 'Game Flight Synchronized',
        message: `Modifications to "${editGameName}" successfully synced with operative deck.`,
        variant: 'success',
      });

      setEditingListing(null);
      void loadData();
    } catch (err) {
      showToast({
        title: 'Update Error',
        message: err instanceof Error ? err.message : 'Could not update game flight.',
        variant: 'error',
      });
    } finally {
      setUpdatingListing(false);
    }
  }

  // Create Category (ADMIN)
  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      showToast({ title: 'Validation', message: 'Category Name is required.', variant: 'warning' });
      return;
    }
    try {
      setCreatingCategory(true);
      const created = await createCategoryRequest(newCategoryName.trim());
      showToast({
        title: 'Category Created',
        message: `Category "${created.categoryName}" added to platform index.`,
        variant: 'success',
      });
      setNewCategoryName('');
      const updatedCats = await fetchCategoriesRequest();
      setCategories(updatedCats);
    } catch (err) {
      showToast({
        title: 'Creation Failed',
        message: err instanceof Error ? err.message : 'Could not create category.',
        variant: 'error',
      });
    } finally {
      setCreatingCategory(false);
    }
  }

  // Open Enrolled Tester Tracking (DEVELOPER)
  async function handleOpenTesterTracking(game: GameListingItem) {
    setTrackingModalListing(game);
    try {
      setTrackingLoading(true);
      const res = await fetchTrackedUsersRequest({ page: 1, limit: 20 });
      setTrackedTesters(res.users || []);
    } catch {
      setTrackedTesters([]);
    } finally {
      setTrackingLoading(false);
    }
  }

  // Delete Listing (DEVELOPER / ADMIN)
  async function handleDeleteListing() {
    if (!deletingListing) return;
    try {
      setActionLoading(true);
      await deleteGameListingRequest(deletingListing.id);
      showToast({
        title: 'Build Removed',
        message: `${deletingListing.gameName} was removed from the telemetry floor.`,
        variant: 'info',
      });
      setDeletingListing(null);
      void loadData();
    } catch (err) {
      showToast({
        title: 'Deletion Failed',
        message: err instanceof Error ? err.message : 'Failed to delete listing.',
        variant: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <AppShell eyebrow="Telemetry programmes" title="Game Testing">
      <AuthGate
        copy="Testing programmes are assigned to enlisted operatives. Sign in to see your build, status and credited points."
        icon="game-controller"
        title="Programmes are session-gated">
        <View style={styles.page}>
          <SectionHeading
            description="Play assigned builds, record anomalies, submit verified reports, and convert telemetry into ladder rank."
            eyebrow="Testing floor"
            title={
              isDev
                ? 'Developer Build Hub'
                : isAdmin
                  ? 'Platform Telemetry Ops'
                  : 'Operative Testing Deck'
            }
          />

          {/* ================================================================= */}
          {/* 1. DEVELOPER VIEW: Compact Publish Form + Published History */}
          {/* ================================================================= */}
          {isDev && (
            <View style={styles.roleContainer}>
              <ClayCard style={styles.publishCard} padded={false}>
                <View style={styles.formContainer}>
                  <View style={styles.formHeader}>
                    <View style={styles.formHeaderIcon}>
                      <Ionicons name="cloud-upload" size={18} color={Palette.primary} />
                    </View>
                    <View>
                      <Text style={styles.formTitle}>Publish Game Build for Testing</Text>
                      <Text style={styles.formSubtitle}>
                        Deploy external build URL, platform specs, and testing guides for operative enrollment
                      </Text>
                    </View>
                  </View>

                  <View style={styles.formGrid}>
                    <Tooltip content="Official title of the indie game or build" position="top">
                      <TextField
                        label="Game Title *"
                        onChangeText={setDevGameName}
                        placeholder="e.g. Starborne Frontier"
                        value={devGameName}
                      />
                    </Tooltip>

                    <Tooltip content="Direct link to itch.io, Steam key, Google Drive, or TestFlight" position="top">
                      <TextField
                        label="External Build URL"
                        onChangeText={setDevGameUrl}
                        placeholder="https://game-builds.com/flight-v1.zip"
                        value={devGameUrl}
                      />
                    </Tooltip>
                  </View>

                  <View style={styles.selectorGroup}>
                    <Text style={styles.fieldLabel}>Target Platform *</Text>
                    <View style={styles.platformRow}>
                      {(['windows', 'web', 'android', 'ios', 'linux', 'macos'] as const).map(
                        (plat) => {
                          const active = devPlatform === plat;
                          return (
                            <Tooltip key={plat} content={`Set platform target to ${plat}`} position="top">
                              <Pressable
                                onPress={() => setDevPlatform(plat)}
                                style={[styles.choiceChip, active && styles.choiceChipActive]}>
                                <Text
                                  style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                                  {plat.toUpperCase()}
                                </Text>
                              </Pressable>
                            </Tooltip>
                          );
                        },
                      )}
                    </View>
                  </View>

                  <View style={styles.formGrid}>
                    <Tooltip content="Testing focus, target FPS, key levels to explore" position="top">
                      <TextField
                        label="Testing Objectives & Description"
                        multiline
                        numberOfLines={3}
                        onChangeText={setDevDescription}
                        placeholder="Detail the stress areas and flows operatives should test..."
                        value={devDescription}
                      />
                    </Tooltip>

                    <Tooltip content="Instructions on how to play, controls, cheat keys for QA" position="top">
                      <TextField
                        label="QA Testing Guides"
                        multiline
                        numberOfLines={3}
                        onChangeText={setDevGuides}
                        placeholder="Provide gameplay instructions, debug cheats, and console keys..."
                        value={devGuides}
                      />
                    </Tooltip>
                  </View>

                  <View style={styles.formGrid}>
                    <Tooltip content="Known bugs already logged to prevent duplicates" position="top">
                      <TextField
                        label="Known Issues (Optional)"
                        multiline
                        numberOfLines={2}
                        onChangeText={setDevBugsListing}
                        placeholder="e.g. Pause menu glitches on 144Hz monitors..."
                        value={devBugsListing}
                      />
                    </Tooltip>

                    <View style={styles.dualFieldRow}>
                      <Tooltip content="Registration window in days from today" position="top">
                        <TextField
                          keyboardType="numeric"
                          label="Reg. Days"
                          onChangeText={setDevRegDays}
                          placeholder="14"
                          value={devRegDays}
                        />
                      </Tooltip>
                      <Tooltip content="Total testing duration in days from today" position="top">
                        <TextField
                          keyboardType="numeric"
                          label="Testing Days"
                          onChangeText={setDevTestDays}
                          placeholder="30"
                          value={devTestDays}
                        />
                      </Tooltip>
                    </View>
                  </View>

                  <View style={styles.dualFieldRow}>
                    <View style={{ flex: 1 }}>
                      <Tooltip content="Tester payout or bounty amount" position="top">
                        <TextField
                          keyboardType="numeric"
                          label="Reward Bounty Amount"
                          onChangeText={setDevAmount}
                          placeholder="100"
                          value={devAmount}
                        />
                      </Tooltip>
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.fieldLabel}>Currency</Text>
                      <View style={styles.platformRow}>
                        {(['USD', 'INR', 'QAR', 'SDG', 'EUR'] as const).map((curr) => {
                          const active = devCurrency === curr;
                          return (
                            <Pressable
                              key={curr}
                              onPress={() => setDevCurrency(curr)}
                              style={[styles.choiceChip, active && styles.choiceChipActive]}>
                              <Text
                                style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                                {curr}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  <View style={styles.bannerPickerRow}>
                    {devBanner ? (
                      <View style={styles.bannerPreviewWrapper}>
                        <Image source={{ uri: devBanner.uri }} style={styles.bannerThumbnail} contentFit="cover" />
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text numberOfLines={1} style={styles.bannerName}>{devBanner.fileName}</Text>
                          <Text style={styles.bannerHint}>Banner attached (MinIO)</Text>
                        </View>
                        <Button
                          icon="close"
                          label=""
                          onPress={() => setDevBanner(null)}
                          size="sm"
                          variant="ghost"
                        />
                      </View>
                    ) : (
                      <Button
                        icon="image-outline"
                        iconPosition="left"
                        label="Attach Game Banner Image"
                        onPress={async () => {
                          try {
                            const picked = await pickImage();
                            if (picked) setDevBanner(picked);
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

                  <Tooltip content="Deploy build into operative telemetry roster" position="top">
                    <Button
                      fullWidth
                      icon="rocket-outline"
                      label="Publish Game for Testing"
                      loading={publishing}
                      onPress={() => void handlePublishListing()}
                      size="lg"
                      variant="lime"
                    />
                  </Tooltip>
                </View>
              </ClayCard>

              {/* Developer Own Listings History */}
              <Panel padded={false}>
                <View style={styles.panelHeader}>
                  <View>
                    <Text style={styles.panelTitle}>My Published Game Builds</Text>
                    <Text style={styles.panelSubtitle}>
                      Manage active test flights, track enrolled testers, and triage bug telemetry
                    </Text>
                  </View>
                  <StatusBadge color={Palette.primary} label={`${games.length} FLIGHTS`} />
                </View>

                {loading ? (
                  <View style={styles.centered}>
                    <ActivityIndicator color={Palette.primary} size="large" />
                    <Text style={styles.loadingText}>Syncing your builds...</Text>
                  </View>
                ) : games.length === 0 ? (
                  <View style={styles.empty}>
                    <Ionicons name="game-controller-outline" size={32} color={Palette.textDim} />
                    <Text style={styles.emptyTitle}>No builds published yet</Text>
                    <Text style={styles.emptyCopy}>
                      Use the form above to deploy your first game build for operative testing.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.gamesList}>
                    {games.map((game) => (
                      <ClayCard key={game.id} style={styles.gameCard} padded={false}>
                        <View style={styles.gameCardContent}>
                          <View style={styles.gameHeader}>
                            <View style={styles.gameMeta}>
                              <Text style={styles.gameTitle}>{game.gameName}</Text>
                              <View style={styles.gameTags}>
                                <StatusBadge
                                  color={game.status === 'active' ? Palette.tertiary : Palette.textDim}
                                  label={game.status.toUpperCase()}
                                />
                                {game.platform && (
                                  <StatusBadge color={Palette.primary} label={game.platform.toUpperCase()} />
                                )}
                              </View>
                            </View>

                            <View style={styles.actionsGroup}>
                              <Tooltip content="Edit game flight parameters and rulebook" position="top">
                                <Button
                                  icon="pencil-outline"
                                  label="Edit"
                                  onPress={() => handleOpenEditListing(game)}
                                  size="sm"
                                  variant="dark"
                                />
                              </Tooltip>
                              <Tooltip content="Inspect operatives currently enrolled in this build" position="left">
                                <Button
                                  icon="people-outline"
                                  label="Enrolled Testers"
                                  onPress={() => void handleOpenTesterTracking(game)}
                                  size="sm"
                                  variant="dark"
                                />
                              </Tooltip>
                              <Tooltip content="Delete this game listing" position="left">
                                <Button
                                  icon="trash-outline"
                                  label="Delete"
                                  onPress={() => setDeletingListing(game)}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                            </View>
                          </View>

                          {game.description && (
                            <Text numberOfLines={2} style={styles.gameDesc}>
                              {game.description}
                            </Text>
                          )}

                          <View style={styles.gameFooter}>
                            <Text style={styles.timelineText}>
                              Deadline: {new Date(game.testingDeadline).toLocaleDateString()}
                            </Text>
                            {game.gameUrl && (
                              <Tooltip content="Download or view build link" position="top">
                                <Button
                                  icon="open-outline"
                                  label="Build URL"
                                  onPress={() => {
                                    if (game.gameUrl) void Linking.openURL(game.gameUrl);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                            )}
                          </View>
                        </View>
                      </ClayCard>
                    ))}
                  </View>
                )}
              </Panel>
            </View>
          )}

          {/* ================================================================= */}
          {/* 2. ADMIN VIEW: Category Creation Bar + Platform Moderation List */}
          {/* ================================================================= */}
          {isAdmin && (
            <View style={styles.roleContainer}>
              <ClayCard style={styles.adminBarCard} padded={false}>
                <View style={styles.adminBarInner}>
                  <View style={styles.adminBarHead}>
                    <Ionicons name="folder-open-outline" size={18} color={Palette.secondary} />
                    <Text style={styles.adminBarTitle}>Platform Taxonomy Steward</Text>
                  </View>

                  <View style={styles.adminInputRow}>
                    <View style={styles.adminInputWrap}>
                      <TextField
                        label="New Category Name"
                        onChangeText={setNewCategoryName}
                        placeholder="e.g. Tactical RPG, Simulation, VR"
                        value={newCategoryName}
                      />
                    </View>
                    <Tooltip content="Create and register category in global database" position="top">
                      <Button
                        icon="add"
                        label="Add Category"
                        loading={creatingCategory}
                        onPress={() => void handleCreateCategory()}
                        size="md"
                        variant="lime"
                      />
                    </Tooltip>
                  </View>
                </View>
              </ClayCard>

              <Panel padded={false}>
                <View style={styles.panelHeader}>
                  <View>
                    <Text style={styles.panelTitle}>Global Game Moderation Deck</Text>
                    <Text style={styles.panelSubtitle}>
                      Supervise all game builds listed across the entire platform
                    </Text>
                  </View>
                  <StatusBadge color={Palette.primary} label={`${games.length} LISTED`} />
                </View>

                {loading ? (
                  <View style={styles.centered}>
                    <ActivityIndicator color={Palette.primary} size="large" />
                    <Text style={styles.loadingText}>Fetching platform builds...</Text>
                  </View>
                ) : (
                  <View style={styles.gamesList}>
                    {games.map((game) => (
                      <ClayCard key={game.id} style={styles.gameCard} padded={false}>
                        <View style={styles.gameCardContent}>
                          <View style={styles.gameHeader}>
                            <View style={styles.gameMeta}>
                              <Text style={styles.gameTitle}>{game.gameName}</Text>
                              <View style={styles.gameTags}>
                                <StatusBadge
                                  color={game.status === 'active' ? Palette.tertiary : Palette.textDim}
                                  label={game.status.toUpperCase()}
                                />
                                {game.platform && (
                                  <StatusBadge color={Palette.primary} label={game.platform.toUpperCase()} />
                                )}
                              </View>
                            </View>

                            <View style={styles.actionsGroup}>
                              <Tooltip content="Admin edit game flight" position="top">
                                <Button
                                  icon="pencil-outline"
                                  label="Edit"
                                  onPress={() => handleOpenEditListing(game)}
                                  size="sm"
                                  variant="dark"
                                />
                              </Tooltip>
                              <Tooltip content="Admin force delete listing" position="left">
                                <Button
                                  icon="trash-outline"
                                  label="Delete Listing"
                                  onPress={() => setDeletingListing(game)}
                                  size="sm"
                                  variant="ghost"
                                />
                              </Tooltip>
                            </View>
                          </View>

                          <View style={styles.gameFooter}>
                            <Text style={styles.timelineText}>
                              Author ID: {game.userId ?? 'Unknown'} · Created:{' '}
                              {new Date(game.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                      </ClayCard>
                    ))}
                  </View>
                )}
              </Panel>
            </View>
          )}

          {/* ================================================================= */}
          {/* 3. USER & ORG VIEW: Scorecard + Filterable Builds Grid + Join Test */}
          {/* ================================================================= */}
          {!isDev && !isAdmin && (
            <View style={styles.roleContainer}>
              {/* Operative Ladder Progress Scoreboard */}
              <ClayCard glass style={styles.summaryCard} padded={false}>
                <View style={styles.summaryBody}>
                  <View style={styles.summaryHead}>
                    <Text style={styles.cardEyebrow}>Telemetry Ladder Output</Text>
                    <StatusBadge color={accent} label={titleCase(rank)} />
                  </View>

                  <View style={styles.scoreRow}>
                    <Text style={[styles.scoreValue, { color: accent }]}>{formatNumber(points)}</Text>
                    <Text style={styles.scoreCap}>/ 1,500 PTS</Text>
                  </View>

                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${Math.max(progress, 3)}%`, backgroundColor: accent },
                      ]}
                    />
                  </View>

                  <View style={styles.scoreMeta}>
                    <Text style={styles.scoreMetaText}>
                      Enlist in builds below and submit verified bug telemetry to advance rank
                    </Text>
                    <Text style={styles.scoreMetaText}>{progress}%</Text>
                  </View>
                </View>
              </ClayCard>

              {/* Active Game Testing Builds Feed */}
              <Panel padded={false}>
                <View style={styles.panelHeader}>
                  <View>
                    <Text style={styles.panelTitle}>Active Game Testing Flights</Text>
                    <Text style={styles.panelSubtitle}>
                      Filter by platform, download external builds, and enlist to earn telemetry points
                    </Text>
                  </View>

                  <View style={styles.searchWrap}>
                    <TextField
                      label=""
                      onChangeText={(val) => {
                        setSearch(val);
                        setPage(1);
                      }}
                      placeholder="Search builds..."
                      value={search}
                    />
                  </View>
                </View>

                {/* Platform Filters */}
                <View style={styles.platformFiltersBar}>
                  {PLATFORMS_LIST.map((plat) => {
                    const active = platformFilter === plat;
                    return (
                      <Tooltip key={plat} content={`Filter by ${plat}`} position="top">
                        <Pressable
                          onPress={() => {
                            setPlatformFilter(plat);
                            setPage(1);
                          }}
                          style={[styles.platFilterChip, active && styles.platFilterChipActive]}>
                          <Text
                            style={[
                              styles.platFilterText,
                              active && styles.platFilterTextActive,
                            ]}>
                            {plat.toUpperCase()}
                          </Text>
                        </Pressable>
                      </Tooltip>
                    );
                  })}
                </View>

                {loading ? (
                  <View style={styles.centered}>
                    <ActivityIndicator color={Palette.primary} size="large" />
                    <Text style={styles.loadingText}>Syncing active game builds...</Text>
                  </View>
                ) : games.length === 0 ? (
                  <View style={styles.empty}>
                    <Ionicons name="game-controller-outline" size={32} color={Palette.textDim} />
                    <Text style={styles.emptyTitle}>No game flights available</Text>
                    <Text style={styles.emptyCopy}>
                      No active builds found for the selected platform filter.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.gamesList}>
                    {games.map((game) => {
                      const isEnrolled = enrolledIds.has(game.id);

                      return (
                        <ClayCard key={game.id} style={styles.gameCard} padded={false}>
                          <View style={styles.gameCardContent}>
                            <View style={styles.gameHeader}>
                              <View style={styles.gameMeta}>
                                <Text style={styles.gameTitle}>{game.gameName}</Text>
                                <View style={styles.gameTags}>
                                  <StatusBadge
                                    color={game.status === 'active' ? Palette.tertiary : Palette.textDim}
                                    label={game.status.toUpperCase()}
                                  />
                                  {game.platform && (
                                    <StatusBadge color={Palette.primary} label={game.platform.toUpperCase()} />
                                  )}
                                </View>
                              </View>

                              {game.gameUrl && (
                                <Tooltip content="Download or inspect external build" position="top">
                                  <Button
                                    icon="open-outline"
                                    label="Download"
                                    onPress={() => {
                                      if (game.gameUrl) void Linking.openURL(game.gameUrl);
                                    }}
                                    size="sm"
                                    variant="ghost"
                                  />
                                </Tooltip>
                              )}
                            </View>

                            {game.description && (
                              <Text numberOfLines={2} style={styles.gameDesc}>
                                {game.description}
                              </Text>
                            )}

                            <View style={styles.gameFooter}>
                              <View style={styles.timelineInfo}>
                                <Ionicons name="calendar-outline" size={14} color={Palette.textDim} />
                                <Text style={styles.timelineText}>
                                  Testing Closes: {new Date(game.testingDeadline).toLocaleDateString()}
                                </Text>
                              </View>

                              <Tooltip
                                content={
                                  isEnrolled
                                    ? 'You are active in this flight'
                                    : 'Enlist to gain permission to log bugs and earn points'
                                }
                                position="top">
                                <Button
                                  disabled={isEnrolled}
                                  icon={isEnrolled ? 'checkmark-circle' : 'finger-print-outline'}
                                  label={isEnrolled ? 'Enrolled' : 'Join Test'}
                                  loading={joiningId === game.id}
                                  onPress={() => void handleJoinGame(game)}
                                  size="sm"
                                  variant={isEnrolled ? 'dark' : 'lime'}
                                />
                              </Tooltip>
                            </View>
                          </View>
                        </ClayCard>
                      );
                    })}
                  </View>
                )}
              </Panel>
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
        </View>
      </AuthGate>

      {/* CLAYMORPHIC MODAL: Enrolled Testers Tracking (DEVELOPER) */}
      <ClayModal
        eyebrow="Roster Telemetry"
        onClose={() => setTrackingModalListing(null)}
        title={`Enrolled Testers — ${trackingModalListing?.gameName ?? ''}`}
        visible={!!trackingModalListing}>
        <View style={styles.trackingModalBody}>
          <Text style={styles.trackingModalSubtitle}>
            Active operatives registered to test this build and submit bug reports:
          </Text>

          {trackingLoading ? (
            <ActivityIndicator color={Palette.primary} size="small" />
          ) : trackedTesters.length === 0 ? (
            <Text style={styles.emptyTestersText}>
              No operatives have enrolled in this test flight yet.
            </Text>
          ) : (
            <View style={styles.testerList}>
              {trackedTesters.map((tester, idx) => (
                <View key={tester.id || idx} style={styles.testerItem}>
                  <View style={styles.testerAvatar}>
                    <Ionicons name="person" size={14} color={Palette.primary} />
                  </View>
                  <View style={styles.testerMeta}>
                    <Text style={styles.testerName}>@{tester.username}</Text>
                    <Text style={styles.testerStatus}>
                      Status: {tester.testingStatus || 'Enrolled'} · Rank:{' '}
                      {tester.testingRank || 'Unranked'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ClayModal>

      {/* CLAYMORPHIC MODAL: Confirm Delete (DEVELOPER / ADMIN) */}
      <ClayModal
        eyebrow="Irreversible Action"
        onClose={() => setDeletingListing(null)}
        title="Delete Game Flight"
        visible={!!deletingListing}>
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteCopy}>
            Are you sure you want to permanently delete{' '}
            <Text style={styles.bold}>{deletingListing?.gameName}</Text>? Enrolled operatives will
            no longer be able to log bugs against this flight.
          </Text>

          <View style={styles.modalActions}>
            <Tooltip content="Cancel deletion" position="top">
              <Button
                disabled={actionLoading}
                label="Cancel"
                onPress={() => setDeletingListing(null)}
                size="md"
                variant="dark"
              />
            </Tooltip>
            <Tooltip content="Confirm permanent deletion" position="top">
              <Button
                icon="trash-outline"
                label="Delete Flight"
                loading={actionLoading}
                onPress={() => void handleDeleteListing()}
                size="md"
                variant="dark"
              />
            </Tooltip>
          </View>
        </View>
      </ClayModal>

      {/* CLAYMORPHIC MODAL: Edit Game Flight (DEVELOPER / ADMIN) */}
      <ClayModal
        eyebrow="Flight Editor"
        maxWidth={560}
        onClose={() => setEditingListing(null)}
        title={`Edit Flight — ${editingListing?.gameName ?? ''}`}
        visible={Boolean(editingListing)}>
        <View style={styles.modalEditForm}>
          <TextField
            label="Game Title"
            onChangeText={setEditGameName}
            value={editGameName}
          />

          <View style={{ gap: 4 }}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.platformRow}>
              {categories.map((c) => {
                const active = editCategoryId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setEditCategoryId(c.id)}
                    style={[styles.choiceChip, active && styles.choiceChipActive]}>
                    <Text
                      style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                      {c.categoryName}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={styles.fieldLabel}>Platform</Text>
            <View style={styles.platformRow}>
              {(['windows', 'web', 'android', 'ios', 'linux', 'macos', 'console'] as const).map(
                (plat) => {
                  const active = editPlatform === plat;
                  return (
                    <Pressable
                      key={plat}
                      onPress={() => setEditPlatform(plat)}
                      style={[styles.choiceChip, active && styles.choiceChipActive]}>
                      <Text
                        style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                        {plat.toUpperCase()}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>
          </View>

          <TextField
            label="External Download / Play URL"
            onChangeText={setEditGameUrl}
            value={editGameUrl}
          />

          <View style={styles.dualFieldRow}>
            <View style={{ flex: 1 }}>
              <TextField
                keyboardType="numeric"
                label="Reward Bounty Amount"
                onChangeText={setEditAmount}
                value={editAmount}
              />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.fieldLabel}>Currency</Text>
              <View style={styles.platformRow}>
                {(['USD', 'INR', 'QAR', 'SDG', 'EUR'] as const).map((curr) => {
                  const active = editCurrency === curr;
                  return (
                    <Pressable
                      key={curr}
                      onPress={() => setEditCurrency(curr)}
                      style={[styles.choiceChip, active && styles.choiceChipActive]}>
                      <Text
                        style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>
                        {curr}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <TextField
            label="Game Description"
            multiline
            numberOfLines={2}
            onChangeText={setEditDescription}
            value={editDescription}
          />

          <TextField
            label="Testing Directives & Focus Areas"
            multiline
            numberOfLines={2}
            onChangeText={setEditGuides}
            value={editGuides}
          />

          <TextField
            label="Known Issues"
            multiline
            numberOfLines={2}
            onChangeText={setEditBugsListing}
            value={editBugsListing}
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
            ) : editingListing?.image?.imageUrl ? (
              <View style={styles.bannerPreviewWrapper}>
                <Image source={{ uri: editingListing.image.imageUrl }} style={styles.bannerThumbnail} contentFit="cover" />
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

          <View style={styles.modalActions}>
            <Button
              label="Cancel"
              onPress={() => setEditingListing(null)}
              size="md"
              variant="dark"
            />
            <Button
              icon="checkmark"
              label="Save Changes"
              loading={updatingListing}
              onPress={() => void handleSaveEditListing()}
              size="md"
              variant="lime"
            />
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
  roleContainer: {
    gap: Space.xl,
  },
  publishCard: {
    backgroundColor: Palette.surface,
  },
  formContainer: {
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
  formHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: `${Palette.primary}15`,
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
  formGrid: {
    gap: Space.md,
  },
  dualFieldRow: {
    flexDirection: 'row',
    gap: Space.md,
  },
  selectorGroup: {
    gap: Space.xs,
  },
  fieldLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text,
  },
  platformRow: {
    flexDirection: 'row',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  choiceChip: {
    paddingHorizontal: Space.sm,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  choiceChipActive: {
    backgroundColor: `${Palette.primary}18`,
    borderColor: Palette.primary,
  },
  choiceChipText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  choiceChipTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  adminBarCard: {
    backgroundColor: Palette.surface,
  },
  adminBarInner: {
    padding: Space.lg,
    gap: Space.md,
  },
  adminBarHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  adminBarTitle: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text,
  },
  adminInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Space.md,
    flexWrap: 'wrap',
  },
  adminInputWrap: {
    flex: 1,
    minWidth: 240,
  },
  summaryCard: {
    backgroundColor: Palette.surface,
  },
  summaryBody: {
    padding: Space.lg,
    gap: Space.md,
  },
  summaryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardEyebrow: {
    fontFamily: Fonts.display,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: Palette.textDim,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Space.xs,
  },
  scoreValue: {
    fontFamily: Fonts.display,
    fontSize: 32,
    fontWeight: '800',
  },
  scoreCap: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  scoreMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreMetaText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  panelHeader: {
    padding: Space.lg,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
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
  searchWrap: {
    minWidth: 220,
  },
  platformFiltersBar: {
    flexDirection: 'row',
    gap: Space.xs,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    flexWrap: 'wrap',
  },
  platFilterChip: {
    paddingHorizontal: Space.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  platFilterChipActive: {
    backgroundColor: `${Palette.primary}18`,
    borderColor: Palette.primary,
  },
  platFilterText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  platFilterTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  gamesList: {
    padding: Space.lg,
    gap: Space.md,
  },
  gameCard: {
    backgroundColor: Palette.surface,
  },
  gameCardContent: {
    padding: Space.lg,
    gap: Space.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  gameMeta: {
    gap: Space.xs,
    flex: 1,
  },
  gameTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: Palette.text,
  },
  gameTags: {
    flexDirection: 'row',
    gap: Space.xs,
    flexWrap: 'wrap',
  },
  gameDesc: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
    lineHeight: 18,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Space.sm,
    paddingTop: Space.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  timelineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.xs,
  },
  timelineText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: Space.sm,
    alignItems: 'center',
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
  trackingModalBody: {
    gap: Space.md,
  },
  trackingModalSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
  },
  emptyTestersText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
    textAlign: 'center',
    padding: Space.lg,
  },
  testerList: {
    gap: Space.sm,
    maxHeight: 260,
  },
  testerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.sm,
    backgroundColor: Palette.surfaceDim,
    borderRadius: Radius.md,
  },
  testerAvatar: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: `${Palette.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testerMeta: {
    gap: 2,
  },
  testerName: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.text,
  },
  testerStatus: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  deleteModalContent: {
    gap: Space.lg,
  },
  deleteCopy: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.text,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: Palette.danger,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Space.sm,
  },
  modalEditForm: {
    gap: Space.md,
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
  },
});
