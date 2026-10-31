import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../shared/theme';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { SecondaryButton } from '../../shared/components/SecondaryButton';
import { useAuth } from '../../shared/context/AuthContext';

export const DesktopHero: React.FC = () => {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  return (
    <View style={styles.heroContainer}>
      <View style={styles.grid}>
        {/* Left Column: Typography & CTAs */}
        <View style={styles.leftCol}>
          {/* Eyebrow Pill */}
          <View style={styles.eyebrowBadge}>
            <View style={styles.pingDot} />
            <Text style={styles.eyebrowText}>
              RIYADAH ELITE ECOSYSTEM • COMPETITIVE QA & ESPORTS
            </Text>
          </View>

          {/* Huge Display Headline */}
          <Text style={styles.headline}>
            DISCOVER GAMES.{'\n'}
            <Text style={styles.gradientText}>TEST BUILDS.</Text>{'\n'}
            COMPETE.
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtext}>
            The high-precision platform connecting competitive gamers, indie studios, and QA engineering talent. Test pre-release builds, file structured reproducible bug tickets, and battle across prize-backed tournaments.
          </Text>

          {/* CTA Cluster */}
          <View style={styles.ctaCluster}>
            <PrimaryButton
              title="Explore Games"
              variant="neon"
              onPress={() => router.push('/games')}
              icon={<Ionicons name="game-controller" size={18} color="#09090D" />}
            />
            <SecondaryButton
              title="Game Testing Lab"
              onPress={() => router.push('/games')}
              icon={<Ionicons name="flask" size={18} color={theme.colors.brand.secondary} />}
            />
            <TouchableOpacity
              style={styles.textLink}
              onPress={() => router.push('/tournaments')}
              activeOpacity={0.7}
            >
              <Text style={styles.textLinkTitle}>Explore Tournaments</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.brand.accent} />
            </TouchableOpacity>
          </View>

          {/* Platform Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>340+</Text>
              <Text style={styles.metricLbl}>Active Missions</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.colors.text.primary }]}>50K</Text>
              <Text style={styles.metricLbl}>Gamer Community</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.colors.brand.secondary }]}>99.2%</Text>
              <Text style={styles.metricLbl}>Repro Rate</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: theme.colors.brand.gold }]}>$120K+</Text>
              <Text style={styles.metricLbl}>Prize Pool Vault</Text>
            </View>
          </View>
        </View>

        {/* Right Column: Tactile Live Card Preview */}
        <View style={styles.rightCol}>
          <View style={styles.tactileCard}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>FEATURED MISSION</Text>
              </View>
              <Text style={styles.stageTag}>ALPHA STAGE 03</Text>
            </View>

            {/* Artwork Banner */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' }}
              style={styles.cardArtwork}
            />

            {/* Mission Details */}
            <View style={styles.missionDetails}>
              <Text style={styles.cardTitle}>APEX PROTOCOL: ALPHA</Text>
              <Text style={styles.cardDesc}>
                High-intensity tactical extraction scrim with crash telemetry sync and 128Hz tickrate servers.
              </Text>
            </View>

            {/* Bounty & Slot Pill */}
            <View style={styles.bountyRow}>
              <View>
                <Text style={styles.bountyLbl}>Total Bounty Pool</Text>
                <Text style={styles.bountyVal}>$15,000 USD</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.bountyLbl}>Slots Confirmed</Text>
                <Text style={styles.slotVal}>48 / 64 Squads</Text>
              </View>
            </View>

            {/* Platform Badges */}
            <View style={styles.platformBadges}>
              <Text style={styles.pBadge}>PC / STEAM</Text>
              <Text style={styles.pBadge}>DIRECTX 12</Text>
              <Text style={styles.pBadge}>TICKRATE 128HZ</Text>
            </View>

            {/* Action */}
            <PrimaryButton
              title="Claim Bracket Slot"
              variant="neon"
              onPress={() => openAuthModal('Apex Protocol: Alpha')}
              icon={<Ionicons name="shield-checkmark" size={16} color="#09090D" />}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    paddingVertical: 36,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    marginBottom: 48,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 48,
  },
  leftCol: {
    flex: 1.2,
    gap: 20,
  },
  eyebrowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borders.radius.round,
    backgroundColor: 'rgba(57, 230, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57, 230, 0, 0.3)',
    gap: 8,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.brand.accent,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: theme.typography.fontSize['6xl'],
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: -1.5,
    lineHeight: 60,
  },
  gradientText: {
    color: theme.colors.brand.accent,
  },
  subtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    maxWidth: 580,
  },
  ctaCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  textLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textLinkTitle: {
    color: theme.colors.brand.accent,
    fontWeight: '700',
    fontSize: theme.typography.fontSize.sm,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginTop: 16,
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'flex-start',
    gap: 4,
  },
  metricVal: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '900',
    color: theme.colors.brand.accent,
    letterSpacing: -0.5,
  },
  metricLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border.subtle,
  },
  rightCol: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tactileCard: {
    width: '100%',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius['2xl'],
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    padding: 24,
    gap: 14,
    ...theme.shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.brand.accent,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.brand.accent,
    letterSpacing: 0.8,
  },
  stageTag: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.brand.secondary,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borders.radius.sm,
  },
  cardArtwork: {
    width: '100%',
    height: 160,
    borderRadius: theme.borders.radius.lg,
  },
  missionDetails: {
    gap: 4,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  bountyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background.elevated,
    padding: 12,
    borderRadius: theme.borders.radius.md,
  },
  bountyLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.muted,
    textTransform: 'uppercase',
  },
  bountyVal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '900',
    color: theme.colors.brand.accent,
    marginTop: 2,
  },
  slotVal: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginTop: 2,
  },
  platformBadges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  pBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.text.muted,
    backgroundColor: theme.colors.background.elevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

