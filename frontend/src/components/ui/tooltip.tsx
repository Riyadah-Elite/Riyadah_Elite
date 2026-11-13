import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useHover } from '@/hooks/use-hover';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

/**
 * Cross-platform Tooltip component for user guidance.
 *
 * Laws satisfied:
 * - Web: Shows on hover via useHover hook after smooth delay.
 * - Mobile: Toggles on press/long-press with auto-dismiss timer.
 * - Neomorphic/Clay-consistent dark ink bubble with 1px highlight and pointer arrow.
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 180,
  disabled = false,
  style,
}: TooltipProps) {
  const { hovered, hoverProps } = useHover();
  const [mobileVisible, setMobileVisible] = useState(false);
  const [active, setActive] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isWeb = Platform.OS === 'web';
  const shouldShow = !disabled && (isWeb ? hovered : mobileVisible);

  useEffect(() => {
    if (disabled) {
      setActive(false);
      return;
    }

    if (shouldShow) {
      timeoutRef.current = setTimeout(() => {
        setActive(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }, delay);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => setActive(false));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldShow, disabled, delay, opacity]);

  // Mobile toggle handler
  function handlePress() {
    if (isWeb || disabled) return;

    if (mobileVisible) {
      setMobileVisible(false);
      if (autoHideRef.current) clearTimeout(autoHideRef.current);
    } else {
      setMobileVisible(true);
      if (autoHideRef.current) clearTimeout(autoHideRef.current);
      autoHideRef.current = setTimeout(() => {
        setMobileVisible(false);
      }, 3500);
    }
  }

  const positionStyles = getPositionStyles(position);

  return (
    <View style={[styles.container, style]}>
      {isWeb ? (
        <View {...hoverProps} style={styles.anchor}>
          {children}
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityHint="Tap to show guidance tooltip"
          onPress={handlePress}
          onLongPress={handlePress}
          delayLongPress={300}
          style={styles.anchor}>
          {children}
        </Pressable>
      )}

      {active && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bubbleContainer,
            positionStyles.container,
            { opacity },
          ]}>
          <View style={[styles.bubble, positionStyles.bubbleShadow]}>
            {typeof content === 'string' ? (
              <Text style={styles.bubbleText}>{content}</Text>
            ) : (
              content
            )}
            <View style={[styles.arrow, positionStyles.arrow]} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function getPositionStyles(position: TooltipPosition) {
  switch (position) {
    case 'bottom':
      return {
        container: {
          top: '100%',
          left: '50%',
          transform: [{ translateX: -75 }],
          marginTop: 8,
        } as ViewStyle,
        bubbleShadow: Platform.select({
          web: {
            boxShadow:
              '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          },
        }),
        arrow: {
          top: -4,
          left: '50%',
          transform: [{ translateX: -4 }, { rotate: '45deg' }],
        } as ViewStyle,
      };

    case 'left':
      return {
        container: {
          right: '100%',
          top: '50%',
          transform: [{ translateY: -14 }],
          marginRight: 8,
        } as ViewStyle,
        bubbleShadow: Platform.select({
          web: {
            boxShadow:
              '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          },
        }),
        arrow: {
          right: -4,
          top: '50%',
          transform: [{ translateY: -4 }, { rotate: '45deg' }],
        } as ViewStyle,
      };

    case 'right':
      return {
        container: {
          left: '100%',
          top: '50%',
          transform: [{ translateY: -14 }],
          marginLeft: 8,
        } as ViewStyle,
        bubbleShadow: Platform.select({
          web: {
            boxShadow:
              '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          },
        }),
        arrow: {
          left: -4,
          top: '50%',
          transform: [{ translateY: -4 }, { rotate: '45deg' }],
        } as ViewStyle,
      };

    case 'top':
    default:
      return {
        container: {
          bottom: '100%',
          left: '50%',
          transform: [{ translateX: -75 }],
          marginBottom: 8,
        } as ViewStyle,
        bubbleShadow: Platform.select({
          web: {
            boxShadow:
              '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
          },
          default: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          },
        }),
        arrow: {
          bottom: -4,
          left: '50%',
          transform: [{ translateX: -4 }, { rotate: '45deg' }],
        } as ViewStyle,
      };
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  anchor: {
    position: 'relative',
  },
  bubbleContainer: {
    position: 'absolute',
    zIndex: 9999,
    width: 150,
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: Palette.text,
    paddingHorizontal: Space.sm + 2,
    paddingVertical: Space.xs + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: Palette.onPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: Palette.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    zIndex: -1,
  },
});
