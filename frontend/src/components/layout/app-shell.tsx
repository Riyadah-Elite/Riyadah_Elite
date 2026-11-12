import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Layout, Palette, Space } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuth } from '@/providers/auth-provider';

import { Footer } from './footer';
import { MobileTabBar } from './mobile-tab-bar';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

interface AppShellProps {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  showFooter?: boolean;
}

/**
 * The responsive arena shell.
 *
 * Desktop keeps a persistent sidebar; below 768px the same items become a
 * glass tab bar pinned above the home indicator. Content scrolls in its own
 * column so the sidebar never moves.
 */
export function AppShell({ title, eyebrow, children, showFooter = true }: AppShellProps) {
  const { isMobile } = useResponsive();
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {!isMobile ? <Sidebar /> : null}

      <View style={styles.main}>
        {isAuthenticated ? <TopBar eyebrow={eyebrow} title={title} /> : null}

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isMobile && { paddingBottom: Layout.tabBarHeight + insets.bottom + Space.lg },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}>
          <View pointerEvents="none" style={styles.glowLayer}>
            <View style={[styles.orb, styles.orbPrimary, webBlur]} />
            <View style={[styles.orb, styles.orbGold, webBlur]} />
            <View style={[styles.orb, styles.orbMint, webBlur]} />
            <View style={styles.gridLine} />
          </View>

          <View style={[styles.contentWrap, isMobile && styles.contentWrapMobile, isMobile && !isAuthenticated && { paddingTop: insets.top + Space.md }]}>
            <View style={styles.content}>{children}</View>
          </View>

          {showFooter ? <Footer /> : null}
        </ScrollView>

        {isMobile ? <MobileTabBar /> : null}
      </View>
    </View>
  );
}

const webBlur =
  Platform.OS === 'web'
    ? ({ filter: 'blur(90px)' } as unknown as ViewStyle)
    : {};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Palette.canvas,
    minHeight: '100%',
  },
  main: {
    flex: 1,
    minWidth: 0,
    backgroundColor: Palette.canvas,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrap: {
    width: '100%',
    paddingHorizontal: Space.xl,
    paddingTop: Space.xl,
    paddingBottom: Space.xxl,
  },
  contentWrapMobile: {
    paddingHorizontal: Space.md,
    paddingTop: Space.lg,
    paddingBottom: Space.xl,
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContent,
    alignSelf: 'center',
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
    width: 420,
    height: 420,
    top: -180,
    right: -80,
    backgroundColor: 'rgba(198, 79, 40, 0.10)',
  },
  orbGold: {
    width: 320,
    height: 320,
    top: 520,
    left: -140,
    backgroundColor: 'rgba(217, 154, 43, 0.09)',
  },
  orbMint: {
    width: 380,
    height: 380,
    bottom: 120,
    right: -160,
    backgroundColor: 'rgba(46, 125, 98, 0.06)',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(120, 88, 60, 0.05)',
  },
});

/** Small gradient rule used between major landing sections. */
export function SectionDivider() {
  return (
    <LinearGradient
      colors={['rgba(225, 205, 185, 0)', 'rgba(201, 176, 154, 0.7)', 'rgba(225, 205, 185, 0)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={dividerStyles.rule}
    />
  );
}

const dividerStyles = StyleSheet.create({
  rule: {
    height: 1,
    width: '100%',
  },
});
