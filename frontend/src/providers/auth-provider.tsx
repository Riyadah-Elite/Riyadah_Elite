import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Fonts, Palette, Radius, Space, Typography } from '@/constants/design';
import { ApiRequestError, toApiRequestError } from '@/lib/api';
import {
  loginRequest,
  logoutRequest,
  profileRequest,
  registerRequest,
  updateNotificationPreferenceRequest,
} from '@/lib/auth-api';
import type { RegistrationPayload } from '@/lib/media';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/token-store';
import type { ApiUser } from '@/lib/types';
import { useToast } from './toast-provider';
import { Button } from '../components/ui/button';
import { ClayModal } from '../components/ui/card';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: ApiUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (payload: RegistrationPayload) => Promise<ApiUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<ApiUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [user, setUser] = useState<ApiUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [updatingNotification, setUpdatingNotification] = useState(false);

  /** Single place that turns a profile response into session state. */
  const adoptSession = useCallback((nextUser: ApiUser) => {
    setUser(nextUser);
    setStatus('authenticated');
    return nextUser;
  }, []);

  const clearSession = useCallback(async () => {
    await clearStoredToken();
    setUser(null);
    setStatus('anonymous');
  }, []);

  const refreshProfile = useCallback(async (): Promise<ApiUser | null> => {
    try {
      const nextUser = await profileRequest();
      return adoptSession(nextUser);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.status === 401 || error.status === 403) {
          await clearSession();
        }
        return null;
      }

      const normalised = toApiRequestError(error);

      if (normalised.status === 401 || normalised.status === 403) {
        await clearSession();
      }

      return null;
    }
  }, [adoptSession, clearSession]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const token = await getStoredToken();

        if (!token && Platform.OS !== 'web') {
          if (!cancelled) setStatus('anonymous');
          return;
        }

        const nextUser = await profileRequest();
        if (!cancelled) adoptSession(nextUser);
      } catch (error) {
        if (cancelled) return;

        const normalised = toApiRequestError(error);

        if (Platform.OS !== 'web' && normalised.status === null) {
          setStatus('anonymous');
          return;
        }

        await clearStoredToken();
        setUser(null);
        setStatus('anonymous');
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [adoptSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginRequest(email, password);
      await setStoredToken(response.token);

      try {
        const profile = await profileRequest();
        adoptSession(profile);

        if (!profile.isNotificationAllowed) {
          setPendingUserId(profile.id);
          setShowNotificationPrompt(true);
        }

        return profile;
      } catch (error) {
        await clearStoredToken();
        setUser(null);
        setStatus('anonymous');
        throw toApiRequestError(error);
      }
    },
    [adoptSession],
  );

  const register = useCallback(
    async (payload: RegistrationPayload) => {
      const response = await registerRequest(payload);
      await setStoredToken(response.token);

      try {
        const profile = await profileRequest();
        adoptSession(profile);

        if (!profile.isNotificationAllowed) {
          setPendingUserId(profile.id);
          setShowNotificationPrompt(true);
        }

        return profile;
      } catch (error) {
        await clearStoredToken();
        setUser(null);
        setStatus('anonymous');
        throw toApiRequestError(error);
      }
    },
    [adoptSession],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Always end local session
    } finally {
      await clearSession();
    }
  }, [clearSession]);

  async function handleTurnOnNotifications() {
    if (!pendingUserId) return;

    setUpdatingNotification(true);
    try {
      await updateNotificationPreferenceRequest(pendingUserId, true);
      setUser((current) => (current ? { ...current, isNotificationAllowed: true } : null));

      showToast({
        variant: 'success',
        title: 'Notifications enabled',
        message: 'Instant telemetry alerts for tournaments, builds, and bugs are now live.',
      });
    } catch {
      showToast({
        variant: 'error',
        title: 'Preference update failed',
        message: 'Could not enable notification alerts. You can retry later from your profile.',
      });
    } finally {
      setUpdatingNotification(false);
      setShowNotificationPrompt(false);
      setPendingUserId(null);
    }
  }

  function handleDismissPrompt() {
    setShowNotificationPrompt(false);
    setPendingUserId(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [login, logout, refreshProfile, register, status, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Strict Claymorphic Notification Consent Popup */}
      <ClayModal
        accessibilityLabel="Notification permissions dialog"
        eyebrow="Operative Dispatch"
        maxWidth={460}
        onClose={handleDismissPrompt}
        title="Live Telemetry Alerts"
        visible={showNotificationPrompt}>
        <View style={styles.promptRoot}>
          <View style={styles.promptIconWrap}>
            <View style={styles.promptIconCircle}>
              <Ionicons name="notifications" size={28} color={Palette.primary} />
            </View>
          </View>

          <Text style={styles.promptHeading}>
            Turn on notifications to get instant alerts on tournaments, builds, and bug updates?
          </Text>

          <Text style={styles.promptCopy}>
            Receive urgent alerts when newly assigned game builds drop, tournament brackets lock, or bug triage milestones are approved.
          </Text>

          <View style={styles.promptButtonRow}>
            <Button
              accessibilityLabel="Dismiss notification prompt for now"
              fullWidth
              label="Later"
              onPress={handleDismissPrompt}
              size="md"
              style={styles.promptBtn}
              variant="dark"
            />

            <Button
              accessibilityLabel="Turn on instant notification alerts"
              fullWidth
              icon="notifications-outline"
              label="Turn On"
              loading={updatingNotification}
              onPress={() => void handleTurnOnNotifications()}
              size="md"
              style={styles.promptBtn}
              variant="lime"
            />
          </View>
        </View>
      </ClayModal>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  promptRoot: {
    paddingVertical: Space.sm,
    gap: Space.md,
    alignItems: 'center',
  },
  promptIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Space.xs,
  },
  promptIconCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    backgroundColor: Palette.primaryWash,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptHeading: {
    fontFamily: Fonts.display,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
    color: Palette.text,
    textAlign: 'center',
  },
  promptCopy: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textMuted,
    textAlign: 'center',
    paddingHorizontal: Space.xs,
  },
  promptButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.md,
    width: '100%',
    paddingTop: Space.xs,
  },
  promptBtn: {
    flex: 1,
  },
});
