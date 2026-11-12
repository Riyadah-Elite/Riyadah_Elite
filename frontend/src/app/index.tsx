import { StyleSheet, View } from 'react-native';

import { AppShell, SectionDivider } from '@/components/layout/app-shell';
import { FAQ } from '@/components/landing/faq';
import { FeatureCards } from '@/components/landing/feature-cards';
import { Hero } from '@/components/landing/hero';
import { Leaderboard } from '@/components/landing/leaderboard';
import { Space } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';

export default function LandingScreen() {
  const { isMobile } = useResponsive();

  return (
    <AppShell eyebrow="Riyadah Elite" title="Home">
      <View style={styles.page}>
        <Hero />

        <View style={[styles.sections, { gap: isMobile ? Space.lg : Space.xl }]}>
          <FeatureCards />
          <SectionDivider />
          <Leaderboard />
          <SectionDivider />
          <FAQ />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: {
    gap: Space.xl,
  },
  sections: {
    flexDirection: 'column',
  },
});
