import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../shared/context/AuthContext';
import { theme } from '../../shared/theme';

export const MobileHeader: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigateTo = (path: string) => {
    setDrawerOpen(false);
    router.push(path as any);
  };

  return (
    <>
      <View style={styles.header}>
        {/* Brand */}
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <Text style={styles.brandTitle}>
            RIYADAH <Text style={{ color: theme.colors.brand.secondary }}>ELITE</Text>
          </Text>
        </TouchableOpacity>

        {/* Right Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={theme.colors.text.primary} />
            <View style={styles.dot} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setDrawerOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide-in Mobile Drawer */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <Pressable style={styles.drawerOverlay} onPress={() => setDrawerOpen(false)}>
          <Pressable style={styles.drawer} onPress={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.brandRow}>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoText}>R</Text>
                </View>
                <Text style={styles.brandTitle}>RIYADAH ELITE</Text>
              </View>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={22} color={theme.colors.text.muted} />
              </TouchableOpacity>
            </View>

            {/* User Info / Sign In */}
            {isAuthenticated && user ? (
              <View style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarLetter}>{user.username.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userNameText}>@{user.username}</Text>
                  <Text style={styles.userRankText}>{user.testingRank?.toUpperCase() || 'LVL 1'} • {user.testingPoints} XP</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.drawerSignInBtn}
                onPress={() => { setDrawerOpen(false); openAuthModal(); }}
              >
                <Text style={styles.drawerSignInText}>Sign In / Register</Text>
              </TouchableOpacity>
            )}

            {/* Navigation Links */}
            <View style={styles.drawerNav}>
              <TouchableOpacity style={styles.navLink} onPress={() => navigateTo('/')}>
                <Ionicons name="game-controller" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.navLinkText}>Home Nexus</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLink} onPress={() => navigateTo('/tournaments')}>
                <Ionicons name="trophy" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.navLinkText}>Tournaments</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLink} onPress={() => navigateTo('/games')}>
                <Ionicons name="flask" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.navLinkText}>Game Testing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLink} onPress={() => navigateTo('/bug-report')}>
                <Ionicons name="bug" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.navLinkText}>Bug Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navLink} onPress={() => navigateTo('/profile')}>
                <Ionicons name="person" size={18} color={theme.colors.brand.accent} />
                <Text style={styles.navLinkText}>Profile & Settings</Text>
              </TouchableOpacity>
            </View>

            {isAuthenticated && (
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => { setDrawerOpen(false); logout(); }}
              >
                <Ionicons name="log-out-outline" size={18} color={theme.colors.status.error} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 50,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.accent,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 8, 0.8)',
    justifyContent: 'flex-start',
  },
  drawer: {
    width: 280,
    height: '100%',
    backgroundColor: theme.colors.background.secondary,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.subtle,
    padding: 20,
    gap: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borders.radius.md,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  userNameText: {
    color: theme.colors.text.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  userRankText: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
    fontSize: 10,
  },
  drawerSignInBtn: {
    backgroundColor: theme.colors.brand.accent,
    paddingVertical: 10,
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
  },
  drawerSignInText: {
    color: '#09090D',
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  drawerNav: {
    flex: 1,
    gap: 10,
    marginTop: 8,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: theme.borders.radius.sm,
  },
  navLinkText: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
  },
  logoutText: {
    color: theme.colors.status.error,
    fontWeight: '700',
    fontSize: 13,
  },
});

