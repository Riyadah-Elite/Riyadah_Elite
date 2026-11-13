import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  modalShadow,
  webBackdrop,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuthModal, type AuthMode } from '@/providers/auth-modal-provider';

import { AuthForm } from './auth-form';
import { IconButton } from '../ui/icon-button';
import { Logo } from '../ui/logo';
import { StatusBadge } from '../ui/badge';

const PROOF_POINTS = [
  { icon: 'shield-checkmark-outline' as const, label: 'HttpOnly session token' },
  { icon: 'pulse-outline' as const, label: 'Live rank synchronisation' },
  { icon: 'notifications-outline' as const, label: 'Match and programme alerts' },
];

/**
 * Web-only authentication dialog. Native renders the auth routes instead, so
 * this component is a no-op there even if it is mounted in the root layout.
 */
export function AuthModalHost() {
  const { isOpen, mode, openAuth, closeAuth } = useAuthModal();
  const { isMobile, width, height } = useResponsive();

  const panelWidth = Math.min(width - (isMobile ? 24 : 72), 920);

  return (
    <Modal animationType="fade" onRequestClose={closeAuth} transparent visible={isOpen}>
      <View style={[styles.root, isMobile && styles.rootMobile]}>
        <Pressable
          accessibilityLabel="Close authentication dialog"
          onPress={closeAuth}
          style={[StyleSheet.absoluteFill, styles.scrim, webBackdrop]}
        />

        <View
          style={[
            styles.panel,
            modalShadow,
            {
              width: panelWidth,
              maxHeight: Math.max(420, Math.min(height - (isMobile ? 24 : 72), 720)),
            },
          ]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'rgba(198,79,40,0.06)', 'rgba(255,255,255,0)']}
            end={{ x: 1, y: 1 }}
            pointerEvents="none"
            start={{ x: 0, y: 0 }}
            style={styles.topEdge}
          />

          {!isMobile ? <BrandPane mode={mode} /> : null}

          <View style={styles.formPane}>
            <View style={styles.formHeader}>
              <View style={styles.formHeaderMeta}>
                <View style={styles.secureDot} />
                <Text style={styles.formHeaderLabel}>Secure session</Text>
              </View>

              <IconButton
                iconSize={16}
                label="Close authentication dialog"
                name="close"
                onPress={closeAuth}
                size={36}
              />
            </View>

            <ScrollView
              contentContainerStyle={styles.formScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.formScrollView}>
              <AuthForm
                compact
                key={mode}
                mode={mode}
                onSwitch={(next) => openAuth(next)}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function BrandPane({ mode }: { mode: AuthMode }) {
  return (
    <View style={styles.brandPane}>
      <Image
        accessibilityLabel="Gaming artwork"
        contentFit="cover"
        contentPosition="center"
        source={
          mode === 'login'
            ? require('@/assets/images/landingpage/login.jpg')
            : require('@/assets/images/landingpage/register.jpg')
        }
        style={StyleSheet.absoluteFill}
        transition={180}
      />

      <LinearGradient
        colors={['rgba(30,22,17,0.35)', 'rgba(30,22,17,0.72)', 'rgba(30,22,17,0.94)']}
        end={{ x: 0.6, y: 1 }}
        start={{ x: 0.2, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.brandInner}>
        <View style={styles.brandRow}>
          <Logo showWordmark={false} size="sm" />
          <Text style={styles.brandName}>RIYADAH ELITE</Text>
        </View>

        <StatusBadge color={Palette.secondary} dot label="Season 04 · Ladder open" />

        <View style={styles.brandHeading}>
          <Text style={styles.brandTitle}>
            THE ARENA{'\n'}IS <Text style={styles.brandAccent}>YOURS.</Text>
          </Text>
          <Text style={styles.brandCopy}>
            One account unlocks brackets, testing programmes, rank tracking and the global
            scoreboard.
          </Text>
        </View>

        <View style={styles.proofList}>
          {PROOF_POINTS.map((point) => (
            <View key={point.label} style={styles.proofRow}>
              <Ionicons name={point.icon} size={14} color={Palette.secondary} />
              <Text style={styles.proofText}>{point.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.brandFoot}>
          <View style={styles.brandStat}>
            <Text style={styles.brandStatValue}>15</Text>
            <Text style={styles.brandStatLabel}>Tiers</Text>
          </View>
          <View style={styles.brandStat}>
            <Text style={styles.brandStatValue}>100</Text>
            <Text style={styles.brandStatLabel}>Pts / tier</Text>
          </View>
          <View style={styles.brandStat}>
            <Text style={styles.brandStatValue}>1.5K</Text>
            <Text style={styles.brandStatLabel}>Point cap</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.lg,
  },
  rootMobile: {
    padding: Space.sm,
  },
  scrim: {
    backgroundColor: Palette.overlay,
  },
  panel: {
    flexDirection: 'row',
    borderRadius: Radius.clay,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: Palette.elevated,
    overflow: 'hidden',
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    zIndex: 5,
  },
  brandPane: {
    flex: 0.92,
    minWidth: 0,
    backgroundColor: Palette.text,
    overflow: 'hidden',
  },
  brandInner: {
    flex: 1,
    justifyContent: 'space-between',
    gap: Space.lg,
    padding: Space.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandName: {
    fontFamily: Fonts.display,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2.2,
    color: Palette.onPrimary,
  },
  brandHeading: {
    gap: 10,
  },
  brandTitle: {
    fontFamily: Fonts.display,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    letterSpacing: -1.4,
    color: Palette.onPrimary,
  },
  brandAccent: {
    color: Palette.secondary,
  },
  brandCopy: {
    ...Typography.bodySm,
    color: 'rgba(255,248,243,0.78)',
    lineHeight: 19,
    maxWidth: 300,
  },
  proofList: {
    gap: 9,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proofText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: 'rgba(255,248,243,0.82)',
  },
  brandFoot: {
    flexDirection: 'row',
    gap: Space.lg,
    paddingTop: Space.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,248,243,0.16)',
  },
  brandStat: {
    gap: 1,
  },
  brandStatValue: {
    fontFamily: Fonts.display,
    fontSize: 17,
    fontWeight: '600',
    color: Palette.onPrimary,
    letterSpacing: -0.4,
  },
  brandStatLabel: {
    ...Typography.labelTight,
    fontSize: 7,
    color: 'rgba(255,248,243,0.55)',
  },
  formPane: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    backgroundColor: Palette.elevated,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.lg,
    paddingTop: Space.md,
  },
  formHeaderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.tertiary,
  },
  formHeaderLabel: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1.2,
  },
  formScroll: {
    padding: Space.lg,
    paddingTop: Space.md,
  },
  formScrollView: {
    flexShrink: 1,
  },
});
