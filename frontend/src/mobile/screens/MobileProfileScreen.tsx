import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../shared/context/AuthContext';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';

export const MobileProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout, openAuthModal } = useAuth();
  const [notifications, setNotifications] = useState(user?.isNotificationAllowed ?? true);

  if (!user) {
    return (
      <View style={styles.unauthedBox}>
        <Ionicons name="person-circle-outline" size={56} color={theme.colors.text.muted} />
        <Text style={styles.unauthedTitle}>Sign in to Riyadah Elite</Text>
        <Text style={styles.unauthedSub}>
          Access tournament history, registered playtests, and claim bounty rewards.
        </Text>
        <PrimaryButton label="Sign In" onPress={() => openAuthModal()} fullWidth />
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* Header Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>{user.username.slice(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.userName}>{user.username}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.rankBadge}>
              <Ionicons name="diamond" size={11} color={theme.colors.brand.accent} />
              <Text style={styles.rankTxt}>DIAMOND 1</Text>
            </View>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpBox}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLbl}>QA Rank Progression</Text>
            <Text style={styles.xpVal}>{user.testingPoints} / 2,000 XP</Text>
          </View>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: '75%' }]} />
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>14</Text>
          <Text style={styles.statLbl}>Tourneys</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: theme.colors.brand.accent }]}>8</Text>
          <Text style={styles.statLbl}>Playtests</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: '#EF4444' }]}>24</Text>
          <Text style={styles.statLbl}>Bugs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statVal, { color: theme.colors.brand.accent }]}>$1.4k</Text>
          <Text style={styles.statLbl}>Bounties</Text>
        </View>
      </View>

      {/* Navigation Sections */}
      <View style={styles.sectionMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/tournaments')}>
          <Ionicons name="trophy-outline" size={18} color={theme.colors.brand.accent} />
          <Text style={styles.menuTxt}>My Tournaments & Arenas</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/games')}>
          <Ionicons name="flask-outline" size={18} color={theme.colors.brand.accent} />
          <Text style={styles.menuTxt}>Active Playtest Builds</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/bug-report')}>
          <Ionicons name="bug-outline" size={18} color={theme.colors.brand.secondary} />
          <Text style={styles.menuTxt}>Submit Defect Report</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={18} color={theme.colors.text.primary} />
          <Text style={styles.menuTxt}>Dispatch Alerts</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Settings Row */}
      <View style={styles.settingsBox}>
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>Push Notifications</Text>
            <Text style={styles.switchSub}>Match alerts and bounty updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#333', true: theme.colors.brand.primary }}
            thumbColor={notifications ? theme.colors.brand.accent : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text style={styles.logoutTxt}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 28,
  },
  unauthedBox: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  unauthedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  unauthedSub: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  profileCard: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.brand.secondary,
  },
  avatarTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
  nameCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  userEmail: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 230, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  rankTxt: {
    fontSize: 10,
    color: theme.colors.brand.accent,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily.mono,
  },
  xpBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLbl: {
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  xpVal: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.brand.accent,
    fontFamily: theme.typography.fontFamily.mono,
  },
  xpBar: {
    height: 5,
    backgroundColor: theme.colors.background.primary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.surface,
    paddingVertical: 12,
    borderRadius: theme.borders.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  statLbl: {
    fontSize: 10,
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  sectionMenu: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    overflow: 'hidden',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  menuTxt: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  settingsBox: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borders.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  switchSub: {
    fontSize: 11,
    color: theme.colors.text.muted,
    marginTop: 2,
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
  },
  logoutTxt: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});

