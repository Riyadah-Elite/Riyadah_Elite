import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuthModal } from '@/providers/auth-modal-provider';

import { ClayCard } from '../ui/card';
import { Chip } from '../ui/badge';
import { Tooltip } from '../ui/tooltip';
import { SectionHeading } from './section-heading';

interface Feature {
  key: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: string;
  href: Href;
  image: number;
  tags: string[];
}

const FEATURES: Feature[] = [
  {
    key: 'tournaments',
    index: '01',
    eyebrow: 'Brackets',
    title: 'Tournaments',
    description:
      'Seeded brackets, locked rules and match-ready rooms. Every series follows the same rulebook, from the opening round to the final.',
    accent: Palette.primaryBright,
    icon: 'trophy',
    action: 'View tournaments',
    href: '/tournaments',
    image: require('@/assets/images/landingpage/tournamnet.jpg'),
    tags: ['Solo & squad', 'Seeded ladders', 'Live results'],
  },
  {
    key: 'game-testing',
    index: '02',
    eyebrow: 'Testing',
    title: 'Game Testing',
    description:
      'Play assigned builds, log issues and earn testing points. Your reports feed the rank ladder that powers the global scoreboard.',
    accent: Palette.tertiaryDeep,
    icon: 'game-controller',
    action: 'View programs',
    href: '/game-testing',
    image: require('@/assets/images/landingpage/gametesting.jpg'),
    tags: ['Assigned builds', 'Bug intake', 'Ranked points'],
  },
];

export function FeatureCards() {
  const { isMobile } = useResponsive();
  const { requireAuth } = useAuthModal();

  return (
    <View>
      <SectionHeading
        description="Two ways into the arena. Pick the discipline that matches your playstyle - the ladder tracks both."
        eyebrow="Explore"
        title="Choose your arena"
      />

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        {FEATURES.map((feature) => (
          <FeatureCard
            feature={feature}
            key={feature.key}
            onPress={() => requireAuth(feature.href)}
          />
        ))}
      </View>
    </View>
  );
}

function FeatureCard({ feature, onPress }: { feature: Feature; onPress: () => void }) {
  const { isMobile } = useResponsive();

  return (
    <Tooltip content={`Enter the ${feature.title} arena`} position="top" style={{ flex: 1 }}>
      <ClayCard
        accessibilityLabel={`Open ${feature.title}`}
        interactive
        onPress={onPress}
        padded={false}
        style={styles.card}>
        <View style={[styles.media, isMobile && styles.mediaMobile]}>
          <Image
            accessibilityLabel={`${feature.title} artwork`}
            contentFit="cover"
            source={feature.image}
            style={StyleSheet.absoluteFill}
            transition={220}
          />

          <View style={styles.mediaTop}>
            <View style={styles.tag}>
              <Ionicons name={feature.icon} size={11} color={Palette.onPrimary} />
              <Text style={styles.tagText}>{feature.eyebrow}</Text>
            </View>

            <Text style={styles.index}>{feature.index}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isMobile && styles.titleMobile]}>{feature.title}</Text>

            <View style={[styles.arrow, { borderColor: `${feature.accent}33` }]}>
              <Ionicons name="arrow-forward" size={16} color={feature.accent} />
            </View>
          </View>

          <Text style={styles.description}>{feature.description}</Text>

          <View style={styles.footer}>
            <View style={styles.tags}>
              {feature.tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>

            <View style={styles.actionRow}>
              <Text style={[styles.action, { color: feature.accent }]}>{feature.action}</Text>
              <View style={[styles.actionRule, { backgroundColor: feature.accent }]} />
            </View>
          </View>
        </View>
      </ClayCard>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: Space.md,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
  },
  media: {
    height: 220,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  mediaMobile: {
    height: 178,
  },
  mediaTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Space.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(36,28,22,0.62)',
  },
  tagText: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.onPrimary,
    letterSpacing: 0.9,
  },
  index: {
    fontFamily: Fonts.display,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -1.4,
    color: 'rgba(255,253,249,0.9)',
    textShadowColor: 'rgba(36,28,22,0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  body: {
    padding: Space.lg,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.7,
    color: Palette.text,
  },
  titleMobile: {
    fontSize: 21,
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    ...Typography.body,
    color: Palette.textMuted,
    lineHeight: 21,
  },
  footer: {
    gap: 14,
    marginTop: 2,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  action: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  actionRule: {
    height: 1,
    flex: 1,
    opacity: 0.28,
  },
});
