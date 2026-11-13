import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  clayShadow,
  webBackdrop,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';

import { Button } from '../ui/button';
import { StatusBadge } from '../ui/badge';
import { Tooltip } from '../ui/tooltip';

const HERO_STATS = [
  { value: '15', label: 'Rank tiers' },
  { value: '100', label: 'Pts / tier' },
  { value: '1,500', label: 'Apex points' },
];

export function Hero() {
  const { isMobile, isDesktop } = useResponsive();
  const { isAuthenticated, user } = useAuth();
  const { openAuth, requireAuth } = useAuthModal();
  const [entrance] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View
      style={[
        styles.shell,
        clayShadow,
        { opacity: entrance, transform: [{ translateY }] },
        isMobile && styles.shellMobile,
      ]}>
      <Image
        accessibilityLabel="Collage of iconic video game characters"
        contentFit="cover"
        contentPosition={isMobile ? 'center' : 'right'}
        source={require('@/assets/images/landingpage/hero.jpg')}
        style={isMobile ? styles.mobileMedia : StyleSheet.absoluteFill}
        transition={250}
      />

      {isMobile ? (
        <LinearGradient
          colors={['rgba(248,239,228,0)', 'rgba(248,239,228,0.55)', Palette.card]}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0.2 }}
          style={styles.mobileMediaFade}
        />
      ) : (
        <>
          <LinearGradient
            colors={[
              'rgba(248,239,228,0.985)',
              'rgba(248,239,228,0.90)',
              'rgba(248,239,228,0.08)',
            ]}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 0.42, 0.74]}
            start={{ x: 0, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['rgba(248,239,228,0)', 'rgba(248,239,228,0.06)', 'rgba(248,239,228,0.55)']}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.6, 1]}
            start={{ x: 0.5, y: 0.1 }}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}

      {isDesktop ? (
        <View pointerEvents="none" style={styles.gridOverlay}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={`v-${index}`} style={[styles.gridVertical, { left: `${(index + 1) * 12.5}%` }]} />
          ))}
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={`h-${index}`} style={[styles.gridHorizontal, { top: `${(index + 1) * 20}%` }]} />
          ))}
        </View>
      ) : null}

      {!isMobile ? (
        <>
          <View pointerEvents="none" style={styles.cornerTopLeft} />
          <View pointerEvents="none" style={styles.cornerBottomRight} />
        </>
      ) : null}

      <View style={[styles.inner, isMobile && styles.innerMobile]}>
        {isAuthenticated ? (
          <View style={styles.topRow}>
            <View style={[styles.sessionPill, webBackdrop]}>
              <View style={styles.sessionDot} />
              <Text style={styles.sessionText} numberOfLines={1}>
                {user?.username}
              </Text>
              <Text style={styles.sessionRank}>{user?.testingRank ?? 'bronze 3'}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.heroBody}>
          <StatusBadge dot label="Season 04 · Ladder open" />

          <Text style={[styles.headline, isMobile && styles.headlineMobile]}>
            THE ARENA{'\n'}IS <Text style={styles.accent}>YOURS.</Text>
          </Text>

          <Text style={[styles.subcopy, isMobile && styles.subcopyMobile]}>
            High-stakes tournaments and deep telemetry testing, built around one rank ladder.
            Enter a bracket, run a build and prove your precision under pressure.
          </Text>

          <View style={[styles.ctaRow, isMobile && styles.ctaRowMobile]}>
            {isAuthenticated ? (
              <>
                <Tooltip content="Browse live tournament brackets and competitive arenas" position="top">
                  <Button
                    fullWidth={isMobile}
                    icon="arrow-forward"
                    label="Enter the ladder"
                    onPress={() => router.push('/tournaments')}
                    size="lg"
                  />
                </Tooltip>
                <Tooltip content="Explore available game test flights and earn points" position="top">
                  <Button
                    fullWidth={isMobile}
                    label="Testing programs"
                    onPress={() => requireAuth('/game-testing')}
                    size="lg"
                    variant="ghost"
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip content="Register your operative account and choose your path" position="top">
                  <Button
                    fullWidth={isMobile}
                    icon="arrow-forward"
                    label="Claim your rank"
                    onPress={() => openAuth('register')}
                    size="lg"
                  />
                </Tooltip>
                <Tooltip content="Sign in to your operative dossier" position="top">
                  <Button
                    fullWidth={isMobile}
                    label="Sign in"
                    onPress={() => openAuth('login')}
                    size="lg"
                    variant="ghost"
                  />
                </Tooltip>
              </>
            )}
          </View>

          <View style={[styles.statsRow, isMobile && styles.statsRowMobile]}>
            {HERO_STATS.map((stat, index) => (
              <View key={stat.label} style={[styles.stat, index > 0 && styles.statBorder]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {isDesktop ? (
          <View style={[styles.telemetry, clayShadow, webBackdrop]}>
            <View style={styles.telemetryTop}>
              <Ionicons name="pulse" size={17} color={Palette.primary} />
              <View>
                <Text style={styles.telemetryLabel}>Live ladder</Text>
                <Text style={styles.telemetryValue}>Season standings</Text>
              </View>
            </View>

            <View style={styles.telemetryDivider} />

            <TelemetryLine label="Tier ceiling" value="Diamond 1" accent={Palette.diamond} />
            <TelemetryLine label="Scoring" value="100 pts / tier" accent={Palette.tertiary} />
            <TelemetryLine label="Session" value="JWT secured" accent={Palette.primary} />

            <View style={styles.telemetryFoot}>
              <View style={styles.onlineDot} />
              <Text style={styles.telemetryFootText}>CORE ONLINE</Text>
            </View>
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

function TelemetryLine({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <View style={styles.telemetryLine}>
      <Text style={styles.telemetryLineLabel}>{label}</Text>
      <View style={styles.telemetryLineValueRow}>
        <View style={[styles.telemetryBullet, { backgroundColor: accent }]} />
        <Text style={styles.telemetryLineValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: Palette.card,
    overflow: 'hidden',
    minHeight: 452,
  },
  shellMobile: {
    minHeight: 620,
    borderRadius: Radius.xl,
  },
  mobileMedia: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 214,
  },
  mobileMediaFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  gridVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(36,28,22,0.04)',
  },
  gridHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(36,28,22,0.03)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 26,
    height: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(198, 79, 40, 0.4)',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 26,
    height: 26,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(46, 125, 98, 0.45)',
  },
  inner: {
    flex: 1,
    padding: Space.lg,
    gap: Space.lg,
  },
  innerMobile: {
    paddingTop: 236,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    zIndex: 2,
  },
  sessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Palette.glass,
    maxWidth: 240,
  },
  sessionDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.tertiary,
  },
  sessionText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.text,
  },
  sessionRank: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textDim,
    textTransform: 'capitalize',
  },
  heroBody: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: Space.md,
    maxWidth: 560,
    paddingBottom: Space.sm,
    zIndex: 2,
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: 56,
    lineHeight: 58,
    fontWeight: '700',
    letterSpacing: -2.4,
    color: Palette.text,
  },
  headlineMobile: {
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.4,
  },
  accent: {
    color: Palette.primary,
  },
  subcopy: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: Palette.textMuted,
    maxWidth: 460,
  },
  subcopyMobile: {
    fontSize: 13,
    lineHeight: 20,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  ctaRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.lg,
    marginTop: Space.sm,
  },
  statsRowMobile: {
    gap: Space.md,
    justifyContent: 'space-between',
  },
  stat: {
    gap: 1,
    paddingRight: Space.lg,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Palette.border,
    paddingLeft: Space.lg,
  },
  statValue: {
    fontFamily: Fonts.display,
    fontSize: 19,
    fontWeight: '600',
    color: Palette.text,
    letterSpacing: -0.4,
  },
  statLabel: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textDim,
  },
  telemetry: {
    position: 'absolute',
    right: Space.lg,
    bottom: Space.lg,
    width: 218,
    padding: Space.md,
    gap: 10,
    borderRadius: Radius.xl,
    backgroundColor: Palette.glass,
    zIndex: 3,
  },
  telemetryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  telemetryLabel: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
  },
  telemetryValue: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '600',
    color: Palette.text,
    marginTop: 1,
  },
  telemetryDivider: {
    height: 1,
    backgroundColor: Palette.glassBorder,
  },
  telemetryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryLineLabel: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  telemetryLineValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  telemetryBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  telemetryLineValue: {
    fontFamily: Fonts.body,
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textMuted,
  },
  telemetryFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.glassBorder,
  },
  onlineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.tertiary,
  },
  telemetryFootText: {
    ...Typography.labelTight,
    fontSize: 7,
    color: Palette.textFaint,
    letterSpacing: 1.2,
  },
});
