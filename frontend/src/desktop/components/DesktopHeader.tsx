import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../shared/context/AuthContext';
import { theme } from '../../shared/theme';

export const DesktopHeader: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={theme.colors.text.muted} />
        <TextInput
          placeholder="Search tournaments, playtests, bug reports, studios..."
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
      </View>

      {/* Right Controls */}
      <View style={styles.rightCluster}>
        {/* Telemetry pill */}
        <View style={styles.telemetryPill}>
          <View style={styles.liveDot} />
          <Text style={styles.telemetryText}>DIRECTX 12 • 128HZ</Text>
        </View>

        {/* Notifications Icon Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.colors.text.secondary} />
          <View style={styles.unreadPing} />
        </TouchableOpacity>

        {/* User / Auth State */}
        {isAuthenticated && user ? (
          <TouchableOpacity
            style={styles.profileChip}
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>{user.testingRank?.toUpperCase() || 'LVL 1'}</Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.usernameText}>@{user.username}</Text>
              <Text style={styles.pointsText}>{user.testingPoints} XP</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => openAuthModal()}
            activeOpacity={0.8}
          >
            <Ionicons name="person" size={16} color="#09090D" />
            <Text style={styles.loginBtnText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: theme.spacing.layout.headerHeight,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 30,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.borders.radius.round,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 380,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xs,
  },
  rightCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.accent,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  unreadPing: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    gap: 10,
  },
  rankBadge: {
    backgroundColor: 'rgba(57, 230, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borders.radius.sm,
  },
  rankBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.5,
  },
  userMeta: {
    flexDirection: 'column',
  },
  usernameText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  pointsText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.brand.secondary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borders.radius.md,
    ...theme.shadows.neonGlow,
  },
  loginBtnText: {
    color: '#09090D',
    fontWeight: '800',
    fontSize: theme.typography.fontSize.xs,
    textTransform: 'uppercase',
  },
});

