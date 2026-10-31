import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../shared/theme';

export const DesktopFooter: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        {/* Brand Column */}
        <View style={styles.brandCol}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>R</Text>
            </View>
            <Text style={styles.brandTitle}>
              RIYADAH <Text style={{ color: theme.colors.brand.secondary }}>ELITE</Text>
            </Text>
          </View>
          <Text style={styles.brandDesc}>
            The high-precision platform connecting gamers, indie studios, and QA engineering talent. Test pre-release builds, submit structured bug reports, and battle across community tournaments.
          </Text>
          <Text style={styles.copyright}>
            © 2026 RIYADAH ELITE ECOSYSTEM • ALL RIGHTS RESERVED
          </Text>
        </View>

        {/* Platform Column */}
        <View style={styles.linkCol}>
          <Text style={styles.colTitle}>PLATFORM</Text>
          <TouchableOpacity onPress={() => router.push('/tournaments')}>
            <Text style={styles.linkText}>Tournaments & Cups</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/games')}>
            <Text style={styles.linkText}>Game Playtesting Lab</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/bug-report')}>
            <Text style={styles.linkText}>Bug Triage Inspector</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Text style={styles.linkText}>Telemetry & Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Ecosystem Column */}
        <View style={styles.linkCol}>
          <Text style={styles.colTitle}>ECOSYSTEM</Text>
          <Text style={styles.linkText}>Studio Build Submissions</Text>
          <Text style={styles.linkText}>QA Certification Ladder</Text>
          <Text style={styles.linkText}>Anti-Cheat Telemetry</Text>
          <Text style={styles.linkText}>Bounty Payout Guidelines</Text>
        </View>

        {/* Social / Communities Column */}
        <View style={styles.linkCol}>
          <Text style={styles.colTitle}>COMMUNITY & SOCIAL</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Ionicons name="logo-discord" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Ionicons name="logo-github" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Ionicons name="logo-twitch" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Ionicons name="logo-youtube" size={18} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.socialSubtext}>
            Join over 50,000 players and QA specialists in our verified Discord server.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.subtle,
    paddingVertical: 48,
    paddingHorizontal: 40,
    marginTop: 64,
  },
  content: {
    maxWidth: theme.spacing.layout.maxContentWidth,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 32,
  },
  brandCol: {
    width: 340,
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.borders.radius.md,
    backgroundColor: theme.colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  brandTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: 0.5,
  },
  brandDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.muted,
    lineHeight: 18,
  },
  copyright: {
    fontSize: 10,
    color: theme.colors.text.muted,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  linkCol: {
    gap: 10,
    minWidth: 160,
  },
  colTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  linkText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialSubtext: {
    fontSize: 11,
    color: theme.colors.text.muted,
    lineHeight: 16,
    marginTop: 8,
    maxWidth: 240,
  },
});

