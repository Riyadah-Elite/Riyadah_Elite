import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';

import {
  Fonts,
  Palette,
  Radius,
  Space,
  Typography,
  clayModalShadow,
  clayShadow,
  neoShadow,
  webBackdrop,
} from '@/constants/design';
import { useHover } from '@/hooks/use-hover';
import { IconButton } from './icon-button';

interface ClayCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  interactive?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  glass?: boolean;
}

/**
 * The primary claymorphic surface.
 *
 * Strict Claymorphism: Matte inflated surface, dual inner shadows
 * (top-left highlight + bottom-right shade), and soft ambient outer elevation.
 */
export function ClayCard({
  children,
  style,
  padded = true,
  interactive = false,
  onPress,
  accessibilityLabel,
  glass = false,
}: ClayCardProps) {
  const { hovered, hoverProps } = useHover();

  const content = (
    <>
      {/* Top-left light highlight for mobile + enhanced depth */}
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={styles.topHighlight}
        pointerEvents="none"
      />

      {/* Bottom-right subtle inner shade for mobile tactile inflation */}
      <LinearGradient
        colors={['rgba(136,104,74,0)', 'rgba(136,104,74,0.08)', 'rgba(136,104,74,0.14)']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomShade}
        pointerEvents="none"
      />

      {glass ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.40)', 'rgba(255,255,255,0.05)', 'rgba(198,79,40,0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}

      <View style={padded ? styles.padded : undefined}>{children}</View>
    </>
  );

  if (interactive) {
    return (
      <Pressable
        {...hoverProps}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          glass && styles.glassCard,
          clayShadow,
          hovered && styles.hovered,
          hovered && { transform: [{ translateY: -3 }] },
          pressed && styles.pressed,
          style,
        ]}>
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.card, glass && styles.glassCard, clayShadow, style]}>{content}</View>;
}

export interface ClayModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  maxWidth?: number;
  maxHeight?: number;
  accessibilityLabel?: string;
  showCloseButton?: boolean;
}

/**
 * Strict Claymorphic Modal / Popup Wrapper.
 *
 * Laws satisfied:
 * - 28px border-radius (Radius.clay = 28)
 * - Matte inflated surface (Palette.elevated)
 * - Dual inner shadows (top-left light highlight + bottom-right deep shade)
 * - Soft outer drop shadow elevation
 * - Seamless cross-platform support (Web CSS insets + React Native Mobile multi-gradient overlays)
 */
export function ClayModal({
  visible,
  onClose,
  children,
  title,
  eyebrow,
  maxWidth = 560,
  maxHeight,
  accessibilityLabel = 'Modal dialog',
  showCloseButton = true,
}: ClayModalProps) {
  const { width, height } = useWindowDimensions();
  const isMobile = width < 768;
  const panelWidth = Math.min(width - (isMobile ? 32 : 64), maxWidth);
  const panelMaxHeight = maxHeight ?? Math.min(height - (isMobile ? 48 : 96), 720);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
      accessibilityLabel={accessibilityLabel}>
      <View style={[styles.modalRoot, isMobile && styles.modalRootMobile]}>
        {/* Scrim backdrop */}
        <Pressable
          accessibilityLabel="Close dialog backdrop"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.modalScrim, webBackdrop]}
        />

        {/* Strict Claymorphic Dialog Panel */}
        <View
          style={[
            styles.modalPanel,
            clayModalShadow,
            {
              width: panelWidth,
              maxHeight: panelMaxHeight,
            },
          ]}>
          {/* Top-left inner highlight gradient */}
          <LinearGradient
            colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 0.6 }}
            style={styles.modalTopHighlight}
            pointerEvents="none"
          />

          {/* Bottom-right inner deep shade gradient */}
          <LinearGradient
            colors={['rgba(136,104,74,0)', 'rgba(136,104,74,0.08)', 'rgba(136,104,74,0.18)']}
            start={{ x: 0.4, y: 0.4 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBottomShade}
            pointerEvents="none"
          />

          {/* Header */}
          {(title || eyebrow || showCloseButton) && (
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderCopy}>
                {eyebrow ? <Text style={styles.modalEyebrow}>{eyebrow}</Text> : null}
                {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
              </View>

              {showCloseButton ? (
                <IconButton
                  iconSize={16}
                  label="Close dialog"
                  name="close"
                  onPress={onClose}
                  size={36}
                />
              ) : null}
            </View>
          )}

          {/* Body Content */}
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.modalScrollView}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Lighter surface for dense data rows and tables. The inset rim reads as part
 * of the panel rather than a floating card.
 */
export function Panel({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}) {
  return (
    <View style={[styles.panel, panelShadow, style]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
        style={styles.panelEdge}
      />
      <View style={padded ? styles.padded : undefined}>{children}</View>
    </View>
  );
}

const panelShadow = neoShadow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.clay, // 28px strict Claymorphism
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    overflow: 'hidden',
  },
  glassCard: {
    backgroundColor: Palette.glass,
    borderColor: Palette.glassBorder,
    ...webBackdrop,
  },
  hovered: {
    borderColor: Palette.primaryWashStrong,
  },
  pressed: {
    transform: [{ scale: 0.995 }],
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    borderTopLeftRadius: Radius.clay,
    borderTopRightRadius: Radius.clay,
    zIndex: 2,
  },
  bottomShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    borderBottomLeftRadius: Radius.clay,
    borderBottomRightRadius: Radius.clay,
    zIndex: 2,
  },
  padded: {
    padding: Space.lg,
  },
  panel: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  panelEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  // Modal styles
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Space.lg,
  },
  modalRootMobile: {
    padding: Space.sm,
  },
  modalScrim: {
    backgroundColor: Palette.overlay,
  },
  modalPanel: {
    backgroundColor: Palette.elevated, // Matte inflated surface
    borderRadius: Radius.clay, // Exactly 28px border-radius
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    position: 'relative',
  },
  modalTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    borderTopLeftRadius: Radius.clay,
    borderTopRightRadius: Radius.clay,
    zIndex: 1,
  },
  modalBottomShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    borderBottomLeftRadius: Radius.clay,
    borderBottomRightRadius: Radius.clay,
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space.lg,
    paddingTop: Space.lg,
    paddingBottom: Space.sm,
    zIndex: 5,
  },
  modalHeaderCopy: {
    flex: 1,
    gap: 2,
  },
  modalEyebrow: {
    ...Typography.labelTight,
    color: Palette.primary,
  },
  modalTitle: {
    ...Typography.title,
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Palette.text,
  },
  modalScrollView: {
    flexGrow: 0,
    zIndex: 3,
  },
  modalScrollContent: {
    paddingHorizontal: Space.lg,
    paddingBottom: Space.lg,
    paddingTop: Space.xs,
  },
});
