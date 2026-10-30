import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../shared/theme';

export const MobileFooter: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      {/* Brand */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.brandTitle}>
          RIYADAH <Text style={{ color: theme.colors.brand.secondary }}>ELITE</Text>
        </Text>
      </View>
      <Text style={styles.desc}>
        Competitive esports ladders and structured pre-release game QA playtesting nexus.
      </Text>

      {/* Quick Navigation Links */}
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => router.push('/tournaments')}>
          <Text style={styles.link}>Tournaments</Text>
        </TouchableOpacity>
        <Text style={styles.bullet}>•</Text>
        <TouchableOpacity onPress={() => router.push('/games')}>
          <Text style={styles.link}>Testing Lab</Text>
        </TouchableOpacity>
        <Text style={styles.bullet}>•</Text>
        <TouchableOpacity onPress={() => router.push('/bug-report')}>
          <Text style={styles.link}>Bug Reports</Text>
        </TouchableOpacity>
        <Text style={styles.bullet}>•</Text>
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Text style={styles.link}>Alerts</Text>
        </TouchableOpacity>
      </View>

      {/* Social Icons */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
          <Ionicons name="logo-discord" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
          <Ionicons name="logo-github" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
          <Ionicons name="logo-twitch" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
          <Ionicons name="logo-youtube" size={16} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.copyright}>
        © 2026 RIYADAH ELITE • ALL RIGHTS RESERVED
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
    marginTop: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: theme.borders.radius.sm,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  desc: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  bullet: {
    color: theme.colors.text.muted,
    fontSize: 10,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  socialBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyright: {
    fontSize: 9,
    color: theme.colors.text.muted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 8,
  },
});

