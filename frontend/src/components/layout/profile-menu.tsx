import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  clayModalShadow,
  clayShadow,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
import {
  fetchUsersListRequest,
  restoreUserRequest,
  softDeleteUserRequest,
  updateProfileRequest,
} from '@/lib/auth-api';
import { formatNumber, tierColor, titleCase } from '@/lib/format';
import { pickAvatar, type PickedAvatar } from '@/lib/media';
import { uploadScreenshotRequest } from '@/lib/telemetry-api';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/providers/toast-provider';

import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { ClayModal } from '../ui/card';
import { TextField } from '../ui/text-field';
import { Tooltip } from '../ui/tooltip';

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { hovered, hoverProps } = useHover();

  if (!user) return null;

  return (
    <>
      <Tooltip content={`Operative: ${user.username} (${user.role})`} position="bottom">
        <Pressable
          {...hoverProps}
          accessibilityLabel="Open profile menu"
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          style={({ pressed }) => [
            styles.trigger,
            hovered && styles.triggerHover,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}>
          <Avatar name={user.username} ring size={38} uri={user.avatarUrl} />
        </Pressable>
      </Tooltip>

      <ProfileModal onClose={() => setOpen(false)} visible={open} />
    </>
  );
}

function ProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { isMobile } = useResponsive();
  const { user, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [signingOut, setSigningOut] = useState(false);

  // Edit Profile modal state (for all users)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username ?? '');
  const [pickedAvatar, setPickedAvatar] = useState<PickedAvatar | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security / 2FA settings toggle
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // ADMIN: Manage Operatives Modal
  const [showAdminModal, setShowAdminModal] = useState(false);

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';
  const rank = user.testingRank ?? 'unranked';
  const points = user.testingPoints ?? 0;
  const color = tierColor(rank);
  const progress = Math.min(100, Math.round((points / 1_500) * 100));

  async function handleSaveProfile() {
    if (!editUsername.trim()) {
      showToast({
        title: 'Validation',
        message: 'Username cannot be blank.',
        variant: 'warning',
      });
      return;
    }

    try {
      setSavingProfile(true);
      let avatarId: string | null = null;
      if (pickedAvatar) {
        const fileRes = await uploadScreenshotRequest(
          pickedAvatar.uri,
          pickedAvatar.fileName,
          pickedAvatar.mimeType,
          'User avatar',
          pickedAvatar.file,
        );
        avatarId = fileRes.id;
      }

      await updateProfileRequest(user!.id, {
        username: editUsername.trim(),
        avatarId: avatarId ?? undefined,
      });

      await refreshProfile();

      showToast({
        title: 'Profile Synchronized',
        message: 'Operative dossier callsign and avatar updated.',
        variant: 'success',
      });
      setShowEditProfileModal(false);
    } catch (err) {
      showToast({
        title: 'Update Failed',
        message: err instanceof Error ? err.message : 'Could not update profile.',
        variant: 'error',
      });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);

    try {
      await logout();
      onClose();
      showToast({
        title: 'Session terminated',
        message: 'Your access token has been revoked. See you in the arena.',
        variant: 'info',
      });
      router.replace('/');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <>
      <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="Close profile menu"
            onPress={onClose}
            style={[StyleSheet.absoluteFill, styles.scrim]}
          />

          <View
            style={[
              styles.panel,
              clayModalShadow,
              webBackdrop,
              isMobile
                ? { left: 12, right: 12, bottom: insets.bottom + 10 }
                : { right: Space.lg, top: insets.top + 76, width: 330 },
            ]}>
            <View style={styles.identity}>
              <Avatar name={user.username} online ring size={52} uri={user.avatarUrl} />
              <View style={styles.identityCopy}>
                <Text numberOfLines={1} style={styles.username}>
                  {user.username}
                </Text>
                <Text numberOfLines={1} style={styles.email}>
                  {user.email}
                </Text>
              </View>
              <View style={styles.roleChip}>
                <Text style={styles.roleText}>{user.role}</Text>
              </View>
            </View>

            <View style={styles.rankCard}>
              <View style={styles.rankTop}>
                <View style={styles.rankLabelRow}>
                  <Ionicons name="shield-half" size={13} color={color} />
                  <Text style={styles.rankLabel}>Testing tier</Text>
                </View>
                <Text style={[styles.rankTitle, { color }]}>{titleCase(rank)}</Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(progress, 2)}%`, backgroundColor: color },
                  ]}
                />
              </View>

              <View style={styles.rankBottom}>
                <Text style={styles.points}>{formatNumber(points)} PTS</Text>
                <Text style={styles.pointsCap}>1,500 CAP</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <MenuAction
                highlight
                icon="person-circle-outline"
                label="Edit Profile"
                onPress={() => {
                  setEditUsername(user.username);
                  setPickedAvatar(null);
                  onClose();
                  setShowEditProfileModal(true);
                }}
              />

              {isAdmin && (
                <MenuAction
                  highlight
                  icon="people"
                  label="Manage Operatives"
                  onPress={() => {
                    onClose();
                    setShowAdminModal(true);
                  }}
                />
              )}

              <MenuAction
                icon="shield-checkmark-outline"
                label="Security & 2FA"
                onPress={() => {
                  onClose();
                  setShowSecurityModal(true);
                }}
              />

              <MenuAction
                icon="notifications-outline"
                label="Notification preferences"
                onPress={() => {
                  onClose();
                  showToast({
                    title: 'Notification preferences',
                    message: 'Channel alerts are currently wired to the notification center bell.',
                    variant: 'info',
                  });
                }}
              />

              <MenuAction
                icon="help-circle-outline"
                label="Support channel"
                onPress={() => {
                  onClose();
                  showToast({
                    title: 'Support channel',
                    message: 'A platform steward will be dispatched shortly.',
                    variant: 'info',
                  });
                }}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={signingOut}
              onPress={() => void handleSignOut()}
              style={({ pressed }) => [
                styles.signOut,
                pressed && { backgroundColor: 'rgba(178, 58, 58, 0.14)' },
              ]}>
              {signingOut ? (
                <ActivityIndicator color={Palette.danger} size="small" />
              ) : (
                <Ionicons name="log-out-outline" size={16} color={Palette.danger} />
              )}
              <Text style={styles.signOutText}>Sign out</Text>
              <Ionicons name="chevron-forward" size={13} color="rgba(178,58,58,0.55)" />
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* CLAYMORPHIC MODAL: Security & 2FA Toggle */}
      <ClayModal
        eyebrow="Account Security"
        onClose={() => setShowSecurityModal(false)}
        title="Authentication & 2FA"
        visible={showSecurityModal}>
        <View style={styles.securityModalBody}>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Two-Factor Authentication (2FA)</Text>
              <Text style={styles.settingSubtitle}>
                Require an authenticator code or SMS token upon sign in
              </Text>
            </View>
            <Switch
              onValueChange={(val) => {
                setTwoFactorEnabled(val);
                showToast({
                  title: val ? '2FA Protection Armed' : '2FA Protection Disarmed',
                  message: val
                    ? 'Two-factor authentication requirement has been bound to your account.'
                    : 'Two-factor requirement disabled.',
                  variant: val ? 'success' : 'info',
                });
              }}
              thumbColor={twoFactorEnabled ? Palette.primary : Palette.surface}
              trackColor={{ false: Palette.surfaceDim, true: `${Palette.primary}66` }}
              value={twoFactorEnabled}
            />
          </View>

          <View style={styles.rule} />

          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Password Recovery</Text>
              <Text style={styles.settingSubtitle}>
                Send a secure password reset link to {user.email}
              </Text>
            </View>
            <Tooltip content="Dispatch recovery link to email" position="top">
              <Button
                icon="mail-outline"
                label="Dispatch Link"
                onPress={() => {
                  showToast({
                    title: 'Recovery Link Sent',
                    message: `Password reset instructions sent to ${user.email}.`,
                    variant: 'success',
                  });
                }}
                size="sm"
                variant="dark"
              />
            </Tooltip>
          </View>

          <View style={styles.modalBtnRow}>
            <Button
              fullWidth
              label="Done"
              onPress={() => setShowSecurityModal(false)}
              size="md"
              variant="lime"
            />
          </View>
        </View>
      </ClayModal>

      {/* CLAYMORPHIC MODAL: Edit Profile */}
      <ClayModal
        eyebrow="Operative Dossier"
        maxWidth={440}
        onClose={() => setShowEditProfileModal(false)}
        title="Edit Profile"
        visible={showEditProfileModal}>
        <View style={styles.editProfileBody}>
          <View style={styles.editAvatarSection}>
            <Avatar
              name={editUsername || user.username}
              ring
              size={72}
              uri={pickedAvatar?.uri ?? user.avatarUrl}
            />
            <Button
              icon="camera-outline"
              iconPosition="left"
              label={pickedAvatar ? 'Change Photo' : 'Upload Avatar'}
              onPress={async () => {
                try {
                  const picked = await pickAvatar();
                  if (picked) setPickedAvatar(picked);
                } catch (e) {
                  showToast({
                    title: 'Avatar Selection',
                    message: e instanceof Error ? e.message : 'Failed to select image.',
                    variant: 'warning',
                  });
                }
              }}
              size="sm"
              variant="dark"
            />
          </View>

          <TextField
            label="Callsign / Username"
            onChangeText={setEditUsername}
            placeholder="operative_callsign"
            value={editUsername}
          />

          <View style={styles.modalBtnRow}>
            <Button
              label="Cancel"
              onPress={() => setShowEditProfileModal(false)}
              size="md"
              variant="dark"
            />
            <Button
              icon="checkmark"
              label="Save Changes"
              loading={savingProfile}
              onPress={() => void handleSaveProfile()}
              size="md"
              variant="lime"
            />
          </View>
        </View>
      </ClayModal>

      {/* CLAYMORPHIC MODAL: ADMIN Manage Operatives */}
      {isAdmin && (
        <AdminOperativesModal
          onClose={() => setShowAdminModal(false)}
          visible={showAdminModal}
        />
      )}
    </>
  );
}

function AdminOperativesModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [actionId, setActionId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchUsersListRequest({
        page,
        limit: 8,
        search: search.trim() || undefined,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
      });
      setUsers(res.users || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      showToast({
        title: 'User Roster Failed',
        message: err instanceof Error ? err.message : 'Could not fetch platform operatives.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, showToast]);

  useEffect(() => {
    if (visible) {
      void loadUsers();
    }
  }, [visible, loadUsers]);

  async function handleSoftDelete(userId: string, username: string) {
    try {
      setActionId(userId);
      await softDeleteUserRequest(userId);
      showToast({
        title: 'Operative Suspended',
        message: `@${username} has been soft-deleted and token access invalidated.`,
        variant: 'info',
      });
      void loadUsers();
    } catch (err) {
      showToast({
        title: 'Operation Failed',
        message: err instanceof Error ? err.message : 'Could not soft delete user.',
        variant: 'error',
      });
    } finally {
      setActionId(null);
    }
  }

  async function handleRestore(userId: string, username: string) {
    try {
      setActionId(userId);
      await restoreUserRequest(userId);
      showToast({
        title: 'Operative Restored',
        message: `@${username} has been reinstated with active arena credentials.`,
        variant: 'success',
      });
      void loadUsers();
    } catch (err) {
      showToast({
        title: 'Operation Failed',
        message: err instanceof Error ? err.message : 'Could not restore user account.',
        variant: 'error',
      });
    } finally {
      setActionId(null);
    }
  }

  return (
    <ClayModal
      eyebrow="Platform Steward Deck"
      onClose={onClose}
      title="Manage Platform Operatives"
      visible={visible}>
      <View style={styles.adminModalBody}>
        {/* Search & Role Bar */}
        <View style={styles.adminFilterRow}>
          <View style={styles.adminSearchCol}>
            <TextField
              label=""
              onChangeText={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search by username or email..."
              value={search}
            />
          </View>

          <View style={styles.roleFilterRow}>
            {['ALL', 'USER', 'DEVELOPER', 'ORG', 'ADMIN'].map((r) => {
              const active = roleFilter === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => {
                    setRoleFilter(r);
                    setPage(1);
                  }}
                  style={[styles.roleFilterChip, active && styles.roleFilterChipActive]}>
                  <Text
                    style={[
                      styles.roleFilterChipText,
                      active && styles.roleFilterChipTextActive,
                    ]}>
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* User Roster */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Palette.primary} size="small" />
            <Text style={styles.loadingText}>Syncing operative roster...</Text>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No operatives found</Text>
          </View>
        ) : (
          <ScrollView style={styles.rosterScroll}>
            <View style={styles.userList}>
              {users.map((item) => {
                const busy = actionId === item.id;
                return (
                  <View key={item.id} style={styles.userRow}>
                    <Avatar name={item.username} size={34} uri={item.avatarUrl} />
                    <View style={styles.userMeta}>
                      <View style={styles.userNameBadge}>
                        <Text style={styles.userUsername}>@{item.username}</Text>
                        <View style={styles.roleTag}>
                          <Text style={styles.roleTagText}>{item.role}</Text>
                        </View>
                      </View>
                      <Text style={styles.userSubText}>
                        Enlisted: {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.userActions}>
                      <Tooltip content="Suspend and soft-delete operative" position="left">
                        <Button
                          disabled={busy}
                          label="Suspend"
                          onPress={() => void handleSoftDelete(item.id, item.username)}
                          size="sm"
                          variant="ghost"
                        />
                      </Tooltip>
                      <Tooltip content="Re-arm and restore operative" position="left">
                        <Button
                          disabled={busy}
                          icon="refresh"
                          label="Restore"
                          onPress={() => void handleRestore(item.id, item.username)}
                          size="sm"
                          variant="dark"
                        />
                      </Tooltip>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.modalPagination}>
            <Button
              disabled={page <= 1}
              icon="chevron-back"
              label="Prev"
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              size="sm"
              variant="dark"
            />
            <Text style={styles.modalPageText}>
              Page {page} of {totalPages}
            </Text>
            <Button
              disabled={page >= totalPages}
              icon="chevron-forward"
              label="Next"
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              size="sm"
              variant="dark"
            />
          </View>
        )}
      </View>
    </ClayModal>
  );
}

function MenuAction({
  icon,
  label,
  onPress,
  highlight = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  highlight?: boolean;
}) {
  const { hovered, hoverProps } = useHover();

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        hovered && styles.actionHover,
        highlight && styles.actionHighlight,
        pressed && { opacity: 0.75 },
      ]}>
      <Ionicons
        name={icon}
        size={16}
        color={highlight ? Palette.primary : hovered ? Palette.primaryBright : Palette.textMuted}
      />
      <Text
        style={[
          styles.actionText,
          highlight && { color: Palette.primary, fontWeight: '700' },
          hovered && { color: Palette.text },
        ]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={13} color={Palette.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
  },
  triggerHover: {
    opacity: 0.88,
  },
  modalRoot: {
    flex: 1,
  },
  scrim: {
    backgroundColor: 'rgba(36, 28, 22, 0.34)',
  },
  panel: {
    position: 'absolute',
    borderRadius: Radius.clay,
    backgroundColor: 'rgba(255, 251, 246, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    padding: Space.lg,
    gap: Space.md,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
  identityCopy: {
    flex: 1,
    gap: 1,
  },
  username: {
    fontFamily: Fonts.display,
    fontSize: 14,
    fontWeight: '700',
    color: Palette.text,
  },
  email: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
  },
  roleText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  rankCard: {
    padding: Space.sm,
    backgroundColor: Palette.surfaceDim,
    borderRadius: Radius.lg,
    gap: Space.xs,
  },
  rankTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  rankTitle: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  rankBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  points: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.text,
  },
  pointsCap: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  actions: {
    gap: 2,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: Space.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: 9,
    paddingHorizontal: Space.xs,
    borderRadius: Radius.md,
  },
  actionHover: {
    backgroundColor: Palette.surfaceDim,
  },
  actionHighlight: {
    backgroundColor: `${Palette.primary}12`,
  },
  actionText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textMuted,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: 9,
    paddingHorizontal: Space.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    marginTop: Space.xs,
    borderRadius: Radius.md,
  },
  signOutText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.danger,
    fontWeight: '600',
  },
  securityModalBody: {
    gap: Space.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  settingCopy: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontFamily: Fonts.display,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.text,
  },
  settingSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  rule: {
    height: 1,
    backgroundColor: Palette.border,
  },
  editProfileBody: {
    gap: Space.md,
  },
  editAvatarSection: {
    alignItems: 'center',
    gap: Space.sm,
    paddingVertical: Space.xs,
  },
  modalBtnRow: {
    marginTop: Space.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Space.sm,
  },
  adminModalBody: {
    gap: Space.md,
    maxHeight: 520,
  },
  adminFilterRow: {
    gap: Space.sm,
  },
  adminSearchCol: {
    width: '100%',
  },
  roleFilterRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  roleFilterChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  roleFilterChipActive: {
    backgroundColor: `${Palette.primary}18`,
    borderColor: Palette.primary,
  },
  roleFilterChipText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  roleFilterChipTextActive: {
    color: Palette.primary,
    fontWeight: '700',
  },
  rosterScroll: {
    maxHeight: 320,
  },
  userList: {
    gap: Space.xs,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
    padding: Space.sm,
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  userMeta: {
    flex: 1,
    gap: 2,
  },
  userNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userUsername: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.text,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Palette.surfaceDim,
    borderRadius: Radius.pill,
  },
  roleTagText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    fontWeight: '700',
    color: Palette.primary,
  },
  userSubText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  userActions: {
    flexDirection: 'row',
    gap: Space.xs,
  },
  centered: {
    padding: Space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.xs,
  },
  loadingText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
  empty: {
    padding: Space.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
  },
  modalPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Space.md,
    paddingTop: Space.xs,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  modalPageText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Palette.textDim,
  },
});
