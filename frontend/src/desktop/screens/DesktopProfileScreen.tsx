import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../shared/context/AuthContext';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { StatusBadge } from '../../shared/components/StatusBadge';

export const DesktopProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tournaments' | 'playtests' | 'settings'>('overview');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.isNotificationAllowed ?? true);

  if (!user) {
    return (
      <View style={styles.unauthedBox}>
        <Ionicons name="person-circle-outline" size={64} color={theme.colors.text.muted} />
        <Text style={styles.unauthedTitle}>Sign in to Access Your Profile</Text>
        <Text style={styles.unauthedSub}>
          Track your tournament match history, playtest builds, QA bounty earnings, and rank progression.
        </Text>
        <PrimaryButton label="Sign In / Register" onPress={() => openAuthModal()} icon="log-in-outline" />
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* Profile Header Hero */}
      <View style={styles.profileHero}>
        <View style={styles.heroBackground} />
        <View style={styles.heroContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {user.username.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.username}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={theme.colors.brand.accent} />
                <Text style={styles.verifiedText}>CERTIFIED QA OPERATOR</Text>
              </View>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.tagsRow}>
              <View style={styles.rankPill}>
                <Ionicons name="diamond" size={13} color={theme.colors.brand.accent} />
                <Text style={styles.rankPillText}>
                  {user.testingRank ? user.testingRank.toUpperCase() : 'DIAMOND 1'}
                </Text>
              </View>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>Region: MENA / Riyadh</Text>
              </View>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>Member since Oct 2024</Text>
              </View>
            </View>
          </View>

          {/* XP Progression Card */}
          <View style={styles.xpCard}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpTitle}>Rank Progression</Text>
              <Text style={styles.xpPoints}>{user.testingPoints} / 2,000 XP</Text>
            </View>
            <View style={styles.xpProgressBar}>
              <View style={[styles.xpProgressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.xpNextLevel}>500 XP to Apex Master Rank</Text>
          </View>
        </View>
      </View>

      {/* Telemetry Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Ionicons name="trophy-outline" size={20} color={theme.colors.brand.accent} />
          <View>
            <Text style={styles.statVal}>14</Text>
            <Text style={styles.statLbl}>Tournaments</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="medal-outline" size={20} color={theme.colors.brand.secondary} />
          <View>
            <Text style={styles.statVal}>3</Text>
            <Text style={styles.statLbl}>First Places</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="flask-outline" size={20} color={theme.colors.brand.accent} />
          <View>
            <Text style={styles.statVal}>8</Text>
            <Text style={styles.statLbl}>Active Playtests</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="bug-outline" size={20} color="#EF4444" />
          <View>
            <Text style={styles.statVal}>24</Text>
            <Text style={styles.statLbl}>Verified Defects</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="wallet-outline" size={20} color={theme.colors.brand.accent} />
          <View>
            <Text style={[styles.statVal, { color: theme.colors.brand.accent }]}>$1,450</Text>
            <Text style={styles.statLbl}>Earned Bounties</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Overview & Telemetry
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tournaments' && styles.tabActive]}
          onPress={() => setActiveTab('tournaments')}
        >
          <Text style={[styles.tabText, activeTab === 'tournaments' && styles.tabTextActive]}>
            Enrolled Tournaments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'playtests' && styles.tabActive]}
          onPress={() => setActiveTab('playtests')}
        >
          <Text style={[styles.tabText, activeTab === 'playtests' && styles.tabTextActive]}>
            Playtest Builds & Bugs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>
            Settings & Security
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <View style={styles.grid2}>
          {/* Recent Competitions */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Tournament Performances</Text>
              <TouchableOpacity onPress={() => router.push('/tournaments')}>
                <Text style={styles.linkText}>Browse Tournaments</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trophy" size={16} color={theme.colors.brand.accent} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Valorant GCC Masters Invitational</Text>
                  <Text style={styles.activitySub}>Placed 2nd • $3,500 Squad Bounty</Text>
                </View>
                <StatusBadge label="Completed" variant="green" />
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trophy" size={16} color={theme.colors.brand.secondary} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Cyber Siege 2026 Open Qualifier</Text>
                  <Text style={styles.activitySub}>Round of 16 • 128Hz Tickrate Server</Text>
                </View>
                <StatusBadge label="Qualified" variant="violet" />
              </View>
            </View>
          </View>

          {/* Active Playtests */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Enrolled Playtest Builds</Text>
              <TouchableOpacity onPress={() => router.push('/games')}>
                <Text style={styles.linkText}>View Playtests</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="flask" size={16} color={theme.colors.brand.accent} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Project Chrono: Tactical Extraction</Text>
                  <Text style={styles.activitySub}>Build v0.9.4 • 4 Bugs Logged</Text>
                </View>
                <TouchableOpacity
                  style={styles.miniBtn}
                  onPress={() => router.push('/bug-report?gameId=g1')}
                >
                  <Text style={styles.miniBtnText}>File Bug</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="flask" size={16} color={theme.colors.brand.accent} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Neon Vanguard: Zero Hour</Text>
                  <Text style={styles.activitySub}>Build v1.1.0 • Closed Beta</Text>
                </View>
                <TouchableOpacity
                  style={styles.miniBtn}
                  onPress={() => router.push('/bug-report?gameId=g2')}
                >
                  <Text style={styles.miniBtnText}>File Bug</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'tournaments' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tournament Registrations & Match History</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="trophy" size={20} color={theme.colors.brand.accent} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Valorant GCC Masters Invitational</Text>
                <Text style={styles.activitySub}>Registered Squad: Vanguard Five • Seed #4</Text>
              </View>
              <Text style={{ color: theme.colors.brand.accent, fontWeight: '700' }}>Active in Bracket</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="trophy" size={20} color={theme.colors.brand.secondary} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Cyber Siege 2026 Open Qualifier</Text>
                <Text style={styles.activitySub}>Match Time: Today @ 19:00 UTC</Text>
              </View>
              <Text style={{ color: theme.colors.brand.secondary, fontWeight: '700' }}>Ready for Check-in</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'playtests' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Playtest Builds & Logged Defect Reports</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Ionicons name="bug" size={20} color="#EF4444" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Ticket #TICK-8841: Physics Desync on Sector 4</Text>
                <Text style={styles.activitySub}>Game: Project Chrono • Severity: MAJOR • Status: INVESTIGATING</Text>
              </View>
              <Text style={{ color: theme.colors.brand.accent, fontWeight: '700' }}>+150 XP Awarded</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="bug" size={20} color={theme.colors.brand.accent} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Ticket #TICK-7219: Ultrawide HUD cutoff 32:9</Text>
                <Text style={styles.activitySub}>Game: Neon Vanguard • Severity: MINOR • Status: RESOLVED</Text>
              </View>
              <Text style={{ color: theme.colors.brand.accent, fontWeight: '700' }}>$50 Bounty Paid</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'settings' && (
        <View style={styles.settingsCol}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Preferences & Notifications</Text>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Dispatch Push Notifications</Text>
                <Text style={styles.settingSub}>Receive real-time match reminders and QA bounty updates</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333', true: theme.colors.brand.primary }}
                thumbColor={notificationsEnabled ? theme.colors.brand.accent : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Connected Gaming ID: Steam</Text>
                <Text style={styles.settingSub}>Linked as Vanguard7721 (Verified)</Text>
              </View>
              <TouchableOpacity style={styles.tagPill}>
                <Text style={styles.tagPillText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Action */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Session Security</Text>
            <Text style={[styles.settingSub, { marginBottom: 14 }]}>
              Signing out invalidates your cached bearer credentials on this workstation.
            </Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={16} color="#EF4444" />
              <Text style={styles.logoutBtnText}>Sign Out of Riyadah Elite</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  unauthedBox: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: 60,
    alignItems: 'center',
    gap: 16,
    maxWidth: 500,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  unauthedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  unauthedSub: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  profileHero: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  heroBackground: {
    height: 100,
    backgroundColor: theme.colors.brand.primary,
    opacity: 0.25,
  },
  heroContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 24,
    marginTop: -45,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.brand.secondary,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    fontFamily: theme.typography.fontFamily.heading,
  },
  onlineBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.brand.accent,
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borders.radius.full,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(57, 230, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.brand.accent,
  },
  rankPillText: {
    color: theme.colors.brand.accent,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily.mono,
  },
  tagPill: {
    backgroundColor: theme.colors.background.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  tagPillText: {
    color: theme.colors.text.muted,
    fontSize: 12,
  },
  xpCard: {
    width: 260,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  xpPoints: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.mono,
    color: theme.colors.brand.accent,
    fontWeight: '700',
  },
  xpProgressBar: {
    height: 6,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.accent,
  },
  xpNextLevel: {
    fontSize: 10,
    color: theme.colors.text.muted,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.xl,
    justifyContent: 'space-around',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  statLbl: {
    fontSize: 11,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border.subtle,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    paddingBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borders.radius.md,
  },
  tabActive: {
    backgroundColor: theme.colors.background.surface,
    borderWidth: 1,
    borderColor: theme.colors.brand.primary,
  },
  tabText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  grid2: {
    flexDirection: 'row',
    gap: 24,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.heading,
  },
  linkText: {
    fontSize: 12,
    color: theme.colors.brand.accent,
    fontWeight: '600',
  },
  activityList: {
    gap: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.background.surface,
    padding: 12,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  activitySub: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  miniBtn: {
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borders.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  miniBtnText: {
    color: theme.colors.brand.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  settingsCol: {
    gap: 20,
    maxWidth: 700,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  settingSub: {
    fontSize: 12,
    color: theme.colors.text.muted,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.colors.border.subtle,
    marginVertical: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 12,
    borderRadius: theme.borders.radius.md,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});

