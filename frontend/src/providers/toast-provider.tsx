import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette, Radius, Space, Typography, webBackdrop } from '@/constants/design';

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
  { accent: string; icon: keyof typeof Ionicons.glyphMap; label: string }
> = {
  success: { accent: Palette.tertiary, icon: 'checkmark-circle', label: 'Confirmed' },
  error: { accent: Palette.danger, icon: 'alert-circle', label: 'Action failed' },
  info: { accent: Palette.primary, icon: 'radio', label: 'Transmission' },
  warning: { accent: Palette.warning, icon: 'warning', label: 'Attention' },
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
          : { right: Space.lg, top: insets.top + Space.lg, width: 380 },
      ]}>
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

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

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.toast,
        webBackdrop,
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
      <View style={[styles.toastIcon, { backgroundColor: `${meta.accent}14` }]}>
        <Ionicons name={meta.icon} size={16} color={meta.accent} />
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
        <Ionicons name="close" size={16} color={Palette.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    zIndex: 4000,
    gap: Space.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Space.sm,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.glassBorder,
    borderLeftWidth: 3,
    backgroundColor: Palette.glassStrong,
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
    gap: 2,
    paddingTop: 1,
  },
  toastLabel: {
    ...Typography.labelTight,
    color: Palette.textMuted,
    fontSize: 9,
  },
  toastMessage: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Palette.text,
  },
  toastClose: {
    padding: 4,
    borderRadius: Radius.sm,
  },
});
