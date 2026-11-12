import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Fonts,
  Layout,
  Palette,
  Radius,
  Space,
  Typography,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { useResponsive } from '@/hooks/use-responsive';
import { useToast } from '@/providers/toast-provider';

import { AccordionRow } from '../ui/accordion';
import { PulseDot } from '../ui/badge';
import { Logo } from '../ui/logo';

interface FooterLinkItem {
  label: string;
  href?: Href;
}

interface FooterGroup {
  title: string;
  links: FooterLinkItem[];
}

const GROUPS: FooterGroup[] = [
  {
    title: 'Arena',
    links: [
      { label: 'Tournaments', href: '/tournaments' },
      { label: 'Game testing', href: '/game-testing' },
      { label: 'Bug report', href: '/bug-report' },
      { label: 'Global ladder', href: '/' },
    ],
  },
  {
    title: 'Competitive',
    links: [
      { label: 'Ranked tiers' },
      { label: 'Season 04' },
      { label: 'Match rules' },
      { label: 'Fair play policy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Riyadah' },
      { label: 'Press kit' },
      { label: 'Contact' },
      { label: 'Careers' },
    ],
  },
];

const SOCIALS = [
  { icon: 'logo-discord' as const, label: 'Discord' },
  { icon: 'logo-x' as const, label: 'X' },
  { icon: 'logo-twitch' as const, label: 'Twitch' },
];

export function Footer() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileFooter /> : <DesktopFooter />;
}

function DesktopFooter() {
  return (
    <View style={styles.desktopRoot}>
      <View style={styles.desktopTop}>
        <View style={styles.brandColumn}>
          <Logo showMark={false} size="lg" />
          <Text style={styles.tagline}>
            Competitive tournaments and deep telemetry testing, engineered into one disciplined
            arena.
          </Text>

          <View style={styles.statusRow}>
            <PulseDot color={Palette.tertiary} size={5} />
            <Text style={styles.statusText}>All systems operational</Text>
          </View>

          <View style={styles.socialRow}>
            {SOCIALS.map((social) => (
              <SocialButton key={social.label} icon={social.icon} label={social.label} />
            ))}
          </View>
        </View>

        <View style={styles.linkGrid}>
          {GROUPS.map((group) => (
            <View key={group.title} style={styles.linkColumn}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.links.map((link) => (
                <FooterLink key={link.label} link={link} />
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>© 2026 Riyadah Elite. All rights reserved.</Text>

        <View style={styles.legalRow}>
          <Text style={styles.legalLink}>Privacy</Text>
          <View style={styles.legalDot} />
          <Text style={styles.legalLink}>Terms</Text>
          <View style={styles.legalDot} />
          <Text style={styles.legalLink}>Cookies</Text>
        </View>

        <Text style={styles.coreTag}>RIYADAH CORE · v1.0.0</Text>
      </View>
    </View>
  );
}

function MobileFooter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.mobileRoot}>
      <Logo showMark={false} size="md" />

      <Text style={styles.mobileTagline}>
        Tournaments, game testing and a global ladder in one arena.
      </Text>

      <View style={styles.mobileGroups}>
        {GROUPS.map((group, index) => (
          <AccordionRow
            dense
            expanded={openIndex === index}
            key={group.title}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            title={group.title}
            style={styles.mobileGroup}>
            <View style={styles.mobileLinkList}>
              {group.links.map((link) => (
                <FooterLink key={link.label} compact link={link} />
              ))}
            </View>
          </AccordionRow>
        ))}
      </View>

      <View style={styles.socialRow}>
        {SOCIALS.map((social) => (
          <SocialButton key={social.label} icon={social.icon} label={social.label} />
        ))}
      </View>

      <View style={styles.mobileBottom}>
        <View style={styles.statusRow}>
          <PulseDot color={Palette.tertiary} size={5} />
          <Text style={styles.statusText}>All systems operational</Text>
        </View>
        <Text style={styles.copyright}>© 2026 Riyadah Elite</Text>
      </View>
    </View>
  );
}

function FooterLink({ link, compact = false }: { link: FooterLinkItem; compact?: boolean }) {
  const { hovered, hoverProps } = useHover();
  const { showToast } = useToast();

  const onPress = () => {
    if (link.href) {
      router.push(link.href);
      return;
    }

    showToast({
      title: link.label,
      message: 'This channel is being wired into the arena core.',
      variant: 'info',
    });
  };

  return (
    <Pressable
      {...hoverProps}
      accessibilityRole="link"
      onPress={onPress}
      style={({ pressed }) => [styles.link, compact && styles.linkCompact, pressed && { opacity: 0.7 }]}>
      <Text style={[styles.linkText, hovered && styles.linkTextHover]}>{link.label}</Text>
      {hovered && !compact ? (
        <Ionicons name="arrow-forward" size={11} color={Palette.primaryBright} />
      ) : null}
    </Pressable>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const { hovered, hoverProps } = useHover();
  const { showToast } = useToast();

  return (
    <Pressable
      {...hoverProps}
      accessibilityLabel={`${label} channel`}
      accessibilityRole="link"
      onPress={() =>
        showToast({
          title: `${label} channel`,
          message: `The ${label} relay is coming online soon.`,
          variant: 'info',
        })
      }
      style={({ pressed }) => [
        styles.social,
        hovered && styles.socialHover,
        pressed && { transform: [{ scale: 0.94 }] },
      ]}>
      <Ionicons name={icon} size={16} color={hovered ? Palette.primaryBright : Palette.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
    paddingHorizontal: Space.xl,
    paddingTop: Space.xl,
  },
  desktopTop: {
    flexDirection: 'row',
    gap: Space.xl,
    maxWidth: Layout.maxContent,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: Space.xl,
  },
  brandColumn: {
    flex: 1.2,
    gap: Space.md,
    maxWidth: 360,
  },
  tagline: {
    ...Typography.body,
    color: Palette.textDim,
    lineHeight: 21,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  social: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Palette.surfaceDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialHover: {
    backgroundColor: Palette.primaryWash,
  },
  linkGrid: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Space.lg,
  },
  linkColumn: {
    gap: 10,
    minWidth: 120,
  },
  groupTitle: {
    ...Typography.labelTight,
    color: Palette.text,
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  linkCompact: {
    paddingVertical: 7,
    alignSelf: 'stretch',
  },
  linkText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Palette.textDim,
  },
  linkTextHover: {
    color: Palette.primaryBright,
  },  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    maxWidth: Layout.maxContent,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    paddingVertical: Space.lg,
  },
  copyright: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textFaint,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textDim,
  },
  legalDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.textFaint,
  },
  coreTag: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.textFaint,
    letterSpacing: 1,
  },
  mobileRoot: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
    paddingHorizontal: Space.md,
    paddingTop: Space.xl,
    paddingBottom: Space.lg,
    gap: Space.md,
  },
  mobileTagline: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 19,
    maxWidth: 300,
  },
  mobileGroups: {
    marginTop: Space.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  mobileGroup: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  mobileLinkList: {
    gap: 2,
    paddingBottom: Space.sm,
  },
  mobileBottom: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: Space.md,
    gap: Space.sm,
  },
});
