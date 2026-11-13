import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';
import { useAuthModal } from '@/providers/auth-modal-provider';
import { useToast } from '@/providers/toast-provider';

import { AccordionRow } from '../ui/accordion';
import { Button } from '../ui/button';
import { ClayCard } from '../ui/card';
import { SectionHeading } from './section-heading';

const FAQ_ITEMS = [
  {
    question: 'What is Riyadah Elite?',
    answer:
      'A competitive arena built around two disciplines: governed tournament brackets and telemetry-driven game testing. Both feed the same rank ladder, so every verified result moves your standing.',
  },
  {
    question: 'How does the testing ladder work?',
    answer:
      'Testing points accumulate across fifteen tiers up to a 1,500-point ceiling. Each tier is separated by 100 points, and your tier determines the accent shown on the public scoreboard.',
  },
  {
    question: 'Do I need an account to browse?',
    answer:
      'The landing page, global ladder and FAQ are public. Your profile, tournament brackets, testing programs and bug intake live behind a session, so sign in when you are ready to compete.',
  },
  {
    question: 'How are tournament brackets seeded?',
    answer:
      'Brackets are seeded from verified ladder position, then locked before the first match. Every series follows the same rulebook, from the opening round through the final.',
  },
  {
    question: 'What does game testing involve?',
    answer:
      'You receive an assigned build, exercise the listed flows and log issues with clear reproduction steps. Completed programs are reviewed before testing points are credited.',
  },
  {
    question: 'How are bug reports triaged?',
    answer:
      'Reports are graded by severity and reproducibility. A clean title, the affected area and exact steps move a report through intake far faster than a raw screenshot alone.',
  },
];

export function FAQ() {
  const { isMobile } = useResponsive();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => setOpenIndex((current) => (current === index ? null : index));

  return (
    <View>
      <SectionHeading
        description="The rules of engagement. Everything you need to know before stepping onto the ladder."
        eyebrow="Protocol"
        title="Frequently asked"
      />

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        {!isMobile ? <SupportCard /> : null}

        <View style={styles.list}>
          {FAQ_ITEMS.map((item, index) => (
            <AccordionRow
              expanded={openIndex === index}
              icon="help-circle-outline"
              key={item.question}
              meta={`PROTOCOL ${String(index + 1).padStart(2, '0')}`}
              onToggle={() => toggle(index)}
              title={item.question}>
              <Text style={styles.answer}>{item.answer}</Text>
            </AccordionRow>
          ))}
        </View>

        {isMobile ? <SupportCard /> : null}
      </View>
    </View>
  );
}

function SupportCard() {
  const { isMobile } = useResponsive();
  const { openAuth } = useAuthModal();
  const { showToast } = useToast();

  return (
    <ClayCard glass style={{ width: isMobile ? '100%' : 300 }} padded={false}>
      <View style={styles.supportBody}>
        <View style={styles.supportIcon}>
          <Ionicons name="headset-outline" size={21} color={Palette.primary} />
        </View>

        <Text style={styles.supportEyebrow}>Support</Text>
        <Text style={styles.supportTitle}>Still need a hand?</Text>
        <Text style={styles.supportCopy}>
          A match steward can walk you through brackets, testing assignments or account access.
        </Text>

        <View style={styles.supportRule} />

        <View style={styles.supportMeta}>
          <View style={styles.supportMetaRow}>
            <Ionicons name="time-outline" size={12} color={Palette.tertiary} />
            <Text style={styles.supportMetaText}>Response inside 24 hours</Text>
          </View>
          <View style={styles.supportMetaRow}>
            <Ionicons name="lock-closed-outline" size={12} color={Palette.textFaint} />
            <Text style={styles.supportMetaText}>Session-verified requests only</Text>
          </View>
        </View>

        <Button
          fullWidth
          label="Contact support"
          onPress={() =>
            showToast({
              title: 'Support relay',
              message: 'A steward will be online shortly. Your request channel is being prepared.',
              variant: 'info',
            })
          }
          size="sm"
          style={styles.supportButton}
          variant="dark"
        />

        <Text style={styles.supportFoot}>
          Not enlisted yet?{' '}
          <Text onPress={() => openAuth('register')} style={styles.supportLink}>
            Create an account
          </Text>
        </Text>
      </View>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.md,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    gap: Space.sm,
    minWidth: 0,
  },
  supportBody: {
    padding: Space.lg,
    gap: 8,
  },
  supportIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  supportEyebrow: {
    ...Typography.labelTight,
    fontSize: 8,
    color: Palette.primary,
    letterSpacing: 1.4,
  },
  supportTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Palette.text,
  },
  supportCopy: {
    ...Typography.bodySm,
    color: Palette.textDim,
    lineHeight: 19,
  },
  supportRule: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: 6,
  },
  supportMeta: {
    gap: 7,
  },
  supportMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  supportMetaText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textMuted,
  },
  supportButton: {
    marginTop: 8,
  },
  supportFoot: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Palette.textFaint,
    textAlign: 'center',
    marginTop: 2,
  },
  supportLink: {
    color: Palette.primary,
    fontWeight: '600',
  },
  answer: {
    ...Typography.body,
    color: Palette.textMuted,
    lineHeight: 21,
  },
});
