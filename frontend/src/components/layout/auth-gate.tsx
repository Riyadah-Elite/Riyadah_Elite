import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { useAuth } from '@/providers/auth-provider';
import { useAuthModal } from '@/providers/auth-modal-provider';

import { Button } from '../ui/button';
import { ClayCard } from '../ui/card';

interface AuthGateProps {
  children: React.ReactNode;
  title: string;
  copy: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Direct-link guard for the protected channels. Card and table taps already
 * open the auth surface; this covers a pasted URL or a browser refresh while
 * the session is anonymous.
 */
export function AuthGate({ children, title, copy, icon = 'lock-closed' }: AuthGateProps) {
  const { isAuthenticated, status } = useAuth();
  const { openAuth } = useAuthModal();

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Palette.primary} />
        <Text style={styles.loadingText}>Verifying session…</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <ClayCard glass padded={false} style={styles.card}>
        <View style={styles.body}>
          <View style={styles.iconShell}>
            <Ionicons name={icon} size={22} color={Palette.primary} />
          </View>

          <View style={styles.eyebrowRow}>
            <View style={styles.dot} />
            <Text style={styles.eyebrow}>Restricted channel</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.copy}>{copy}</Text>

          <View style={styles.actions}>
            <Button
              icon="log-in-outline"
              iconPosition="left"
              label="Sign in"
              onPress={() => openAuth('login')}
            />
            <Button
              label="Create account"
              onPress={() => openAuth('register')}
              variant="ghost"
            />
          </View>

          <View style={styles.foot}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Palette.textFaint} />
            <Text style={styles.footText}>
              Your session is stored as an HttpOnly cookie on web and in the keychain on mobile.
            </Text>
          </View>
        </View>
      </ClayCard>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: Space.xxl,
  },
  loadingText: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textDim,
  },
  card: {
    maxWidth: 560,
  },
  body: {
    padding: Space.xl,
    gap: 10,
    alignItems: 'flex-start',
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.warning,
  },
  eyebrow: {
    ...Typography.labelTight,
    fontSize: 9,
    color: Palette.textMuted,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    color: Palette.text,
  },
  copy: {
    ...Typography.body,
    color: Palette.textMuted,
    lineHeight: 22,
    maxWidth: 470,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: Space.sm,
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Space.md,
    paddingTop: Space.md,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    width: '100%',
  },
  footText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Palette.textFaint,
    flexShrink: 1,
  },
});
