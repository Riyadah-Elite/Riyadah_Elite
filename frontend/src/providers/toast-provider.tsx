import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
<<<<<<< HEAD
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette, Radius, Space, Typography, webBackdrop } from '@/constants/design';
=======
import { Animated, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  glassToastShadow,
  webBackdrop,
} from '@/constants/design';
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastInput {
  title?: string;
  message: string;
  variant?: ToastVariant;
}

interface ToastItem extends Required<Pick<ToastInput, 'message' | 'variant'>> {
  id: number;
  title?: string;
}

interface ToastContextValue {
  showToast: (input: ToastInput) => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_META: Record<
  ToastVariant,
<<<<<<< HEAD
  { accent: string; icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  success: { accent: Palette.tertiary, icon: 'checkmark-circle', label: 'Confirmed' },
  error: { accent: Palette.danger, icon: 'alert-circle', label: 'Action failed' },
  info: { accent: Palette.primary, icon: 'radio', label: 'Transmission' },
  warning: { accent: Palette.warning, icon: 'warning', label: 'Attention' },
=======
  { accent: string; glow: string; icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  success: {
    accent: '#34D399',
    glow: 'rgba(52, 211, 153, 0.35)',
    icon: 'checkmark-circle',
    label: 'Confirmed',
  },
  error: {
    accent: '#F87171',
    glow: 'rgba(248, 113, 113, 0.35)',
    icon: 'alert-circle',
    label: 'Action Failed',
  },
  info: {
    accent: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.35)',
    icon: 'information-circle',
    label: 'Transmission',
  },
  warning: {
    accent: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.35)',
    icon: 'warning',
    label: 'Attention',
  },
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input: ToastInput) => {
    const id = Date.now() + counter.current++;
    const toast: ToastItem = {
      id,
      title: input.title,
      message: input.message,
      variant: input.variant ?? 'info',
    };

    setToasts((current) => [...current.slice(-2), toast]);
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

function ToastHost({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 768;

  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        isCompact
          ? { left: Space.md, right: Space.md, top: insets.top + Space.sm }
<<<<<<< HEAD
          : { right: Space.lg, top: insets.top + Space.lg, width: 380 },
=======
          : { right: Space.lg, top: insets.top + Space.lg, width: 390 },
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      ]}>
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

<<<<<<< HEAD
=======
/**
 * Strict Glassmorphic Toast Card.
 *
 * Laws satisfied:
 * - Frosted backdrop-blur-md (`webBackdrop`).
 * - Translucent rgba surface.
 * - 1px glowing semi-transparent border with variant accent glow.
 */
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const meta = VARIANT_META[toast.variant];
  const [animation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    }).start();

    const timer = setTimeout(() => onDismiss(toast.id), 5_000);
    return () => clearTimeout(timer);
  }, [animation, onDismiss, toast.id]);

<<<<<<< HEAD
=======
  const glassStyle = Platform.select({
    web: {
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.45), 0 0 20px ${meta.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.35)`,
    } as any,
    default: {
      shadowColor: meta.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 12,
    },
  });

>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.toast,
<<<<<<< HEAD
        webBackdrop,
=======
        glassStyle,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
        {
          borderLeftColor: meta.accent,
          opacity: animation,
          transform: [
            {
              translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }),
            },
            {
              scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }),
            },
          ],
        },
      ]}>
<<<<<<< HEAD
      <View style={[styles.toastIcon, { backgroundColor: `${meta.accent}14` }]}>
        <Ionicons name={meta.icon} size={16} color={meta.accent} />
=======
      <View
        style={[
          styles.toastIcon,
          {
            backgroundColor: `${meta.accent}22`,
            borderColor: `${meta.accent}44`,
            borderWidth: 1,
          },
        ]}>
        <Ionicons name={meta.icon} size={18} color={meta.accent} />
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      </View>

      <View style={styles.toastCopy}>
        <Text style={[styles.toastLabel, { color: meta.accent }]}>{toast.title ?? meta.label}</Text>
        <Text style={styles.toastMessage}>{toast.message}</Text>
      </View>

      <Pressable
        accessibilityLabel="Dismiss notification"
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => onDismiss(toast.id)}
        style={({ pressed }) => [styles.toastClose, pressed && { opacity: 0.6 }]}>
<<<<<<< HEAD
        <Ionicons name="close" size={16} color={Palette.textMuted} />
=======
        <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.75)" />
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
<<<<<<< HEAD
    zIndex: 4000,
=======
    zIndex: 9999,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    gap: Space.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.sm,
<<<<<<< HEAD
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    borderLeftWidth: 3,
    backgroundColor: Palette.glassStrong,
=======
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    borderLeftWidth: 3.5,
    backgroundColor: 'rgba(22, 19, 16, 0.72)', // Frosted dark glass tint
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    overflow: 'hidden',
  },
  toastIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCopy: {
    flex: 1,
<<<<<<< HEAD
    gap: 2,
=======
    gap: 3,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    paddingTop: 1,
  },
  toastLabel: {
    ...Typography.labelTight,
<<<<<<< HEAD
    color: Palette.textMuted,
    fontSize: 9,
=======
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
  },
  toastMessage: {
    fontFamily: Fonts.body,
    fontSize: 13,
<<<<<<< HEAD
    lineHeight: 19,
    color: Palette.text,
  },
  toastClose: {
    padding: 4,
=======
    fontWeight: '700',
    lineHeight: 19,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  toastClose: {
    padding: 6,
>>>>>>> 1a0e5c52cf95ca3d4c2ce6da3cc81ed569fd147a
    borderRadius: Radius.sm,
  },
});
