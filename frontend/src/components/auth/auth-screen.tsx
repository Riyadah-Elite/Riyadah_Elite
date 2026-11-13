import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Palette,
  Radius,
  Space,
  Typography,
  clayShadow,
} from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import type { AuthMode } from '@/providers/auth-modal-provider';

import { AuthForm } from './auth-form';
import { IconButton } from '../ui/icon-button';
import { Logo } from '../ui/logo';

interface AuthScreenProps {
  mode: AuthMode;
}

/**
 * Native (and direct-link web) authentication surface. It shares the same form
 * as the web dialog so validation and API error copy never drift apart.
 */
export function AuthScreen({ mode }: AuthScreenProps) {
  const { isMobile } = useResponsive();

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  function switchMode(next: AuthMode) {
    router.replace(next === 'login' ? '/auth/login' : '/auth/register');
  }

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={styles.glowLayer}>
        <View style={[styles.orb, styles.orbPrimary]} />
        <View style={[styles.orb, styles.orbGold]} />
      </View>

      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <IconButton
            iconSize={17}
            label="Go back"
            name="arrow-back"
            onPress={goBack}
            size={40}
          />

          <Logo onPress={() => router.replace('/')} size="sm" />

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.media, isMobile && styles.mediaMobile]}>
            <Image
              accessibilityLabel={
                mode === 'login' ? 'Gaming characters artwork' : 'Game artwork collage'
              }
              contentFit="cover"
              contentPosition={mode === 'login' ? 'top' : 'center'}
              source={
                mode === 'login'
                  ? require('@/assets/images/landingpage/login.jpg')
                  : require('@/assets/images/landingpage/register.jpg')
              }
              style={StyleSheet.absoluteFill}
              transition={180}
            />

            <LinearGradient
              colors={['rgba(36,28,22,0.14)', 'rgba(198,79,40,0.05)', 'rgba(36,28,22,0.40)']}
              end={{ x: 0.5, y: 1 }}
              locations={[0, 0.55, 1]}
              start={{ x: 0.5, y: 0.15 }}
              style={StyleSheet.absoluteFill}
            />

          </View>

          <View style={[styles.card, isMobile && styles.cardMobile]}>
            <AuthForm key={mode} mode={mode} onSwitch={switchMode} />
          </View>

          <View style={styles.foot}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Palette.textFaint} />
            <Text style={styles.footText}>
              {Platform.OS === 'web'
                ? 'Session secured with an HttpOnly cookie'
                : 'Session secured in the device keychain'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.canvas,
  },
  glowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbPrimary: {
    width: 460,
    height: 460,
    top: -220,
    right: -140,
    backgroundColor: 'rgba(198, 79, 40, 0.10)',
  },
  orbGold: {
    width: 340,
    height: 340,
    bottom: -160,
    left: -140,
    backgroundColor: 'rgba(217, 154, 43, 0.08)',
  },
  safe: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.md,
    paddingVertical: Space.sm,
  },
  topBarSpacer: {
    width: 40,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.md,
    paddingTop: Space.lg,
    paddingBottom: Space.xl,
    gap: Space.md,
  },
  media: {
    width: '100%',
    maxWidth: 470,
    height: 208,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Palette.card,
  },
  mediaMobile: {
    height: 182,
  },
  card: {
    width: '100%',
    maxWidth: 470,
    padding: Space.xl,
    borderRadius: Radius.clay,
    backgroundColor: Palette.elevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    ...clayShadow,
    overflow: 'hidden',
  },
  cardMobile: {
    padding: Space.lg,
    borderRadius: Radius.clay,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 0.8,
  },
});
