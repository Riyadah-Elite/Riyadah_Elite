import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

interface AccordionRowProps {
  title: string;
  meta?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  expanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  dense?: boolean;
}

/** Shared accordion used by the FAQ and the mobile footer link groups. */
export function AccordionRow({
  title,
  meta,
  icon,
  expanded,
  onToggle,
  children,
  style,
  dense = false,
}: AccordionRowProps) {
  const [animation] = useState(() => new Animated.Value(expanded ? 1 : 0));
  const { hovered, hoverProps } = useHover();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [animation, expanded]);

  const rotate = animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={[styles.wrap, dense && styles.denseWrap, style]}>
      <Pressable
        {...hoverProps}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.header,
          dense && styles.denseHeader,
          pressed && { opacity: 0.82 },
          hovered && !dense && styles.headerHover,
        ]}>
        <View style={styles.headerLeft}>
          {icon ? (
            <Ionicons
              name={icon}
              size={17}
              color={expanded ? Palette.primary : Palette.textDim}
            />
          ) : null}

          <View style={styles.titleGroup}>
            <Text style={[styles.title, expanded && { color: Palette.text }]}>{title}</Text>
            {meta ? <Text style={styles.meta}>{meta}</Text> : null}
          </View>
        </View>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons
            name="chevron-down"
            size={16}
            color={expanded ? Palette.primary : Palette.textDim}
          />
        </Animated.View>
      </Pressable>

      {expanded ? <View style={[styles.body, dense && styles.denseBody]}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Radius.lg,
    backgroundColor: Palette.card,
    overflow: 'hidden',
  },
  denseWrap: {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.md,
    paddingHorizontal: Space.lg,
    paddingVertical: 18,
  },
  denseHeader: {
    paddingHorizontal: 0,
    paddingVertical: 14,
  },
  headerHover: {
    backgroundColor: Palette.primaryWash,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: Palette.textMuted,
  },
  meta: {
    ...Typography.labelTight,
    color: Palette.textFaint,
    fontSize: 9,
  },
  body: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.lg,
    paddingTop: 2,
  },
  denseBody: {
    paddingHorizontal: 0,
  },
});
