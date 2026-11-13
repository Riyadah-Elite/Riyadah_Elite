import { StyleSheet, Text, View } from 'react-native';

import { Palette, Space, Typography } from '@/constants/design';
import { useResponsive } from '@/hooks/use-responsive';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  const { isMobile } = useResponsive();

  return (
    <View style={[styles.root, isMobile && styles.rootMobile]}>
      <View style={styles.copy}>
        <View style={styles.eyebrowRow}>
          <View style={styles.marker} />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <View style={styles.eyebrowLine} />
        </View>

        <Text style={[Typography.headline, isMobile && styles.titleMobile]}>{title}</Text>

        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Space.lg,
    marginBottom: Space.lg,
  },
  rootMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Space.sm,
  },
  copy: {
    flex: 1,
    gap: 8,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: Palette.primary,
  },
  eyebrow: {
    ...Typography.labelTight,
    color: Palette.primaryBright,
    letterSpacing: 1.4,
  },
  eyebrowLine: {
    width: 34,
    height: 1,
    backgroundColor: Palette.border,
    marginLeft: 2,
  },
  titleMobile: {
    fontSize: 22,
    lineHeight: 30,
  },
  description: {
    ...Typography.body,
    color: Palette.textDim,
    maxWidth: 560,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.sm,
  },
});
