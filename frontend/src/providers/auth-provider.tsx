import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { ApiRequestError, toApiRequestError } from '@/lib/api';
import { loginRequest, logoutRequest, profileRequest, registerRequest } from '@/lib/auth-api';
import type { RegistrationPayload } from '@/lib/media';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/token-store';
import type { ApiUser } from '@/lib/types';

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
  const [user, setUser] = useState<ApiUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

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

      // Axios errors are converted here rather than in every caller.
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
        // Web may already hold an HttpOnly cookie, so it always probes.
        const token = Platform.OS === 'web' ? null : await getStoredToken();

        if (Platform.OS !== 'web' && !token) {
          if (!cancelled) setStatus('anonymous');
          return;
        }

        const nextUser = await profileRequest();
        if (!cancelled) adoptSession(nextUser);
      } catch (error) {
        if (cancelled) return;

        const normalised = toApiRequestError(error);

        if (Platform.OS !== 'web' && normalised.status === null) {
          // Network is down: keep the keychain token so the next launch retries.
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

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);

    // The login payload is the raw database row; profile is the canonical,
    // flattened shape (avatarUrl, derived rank) every screen expects.
    await setStoredToken(response.token);

    try {
      return adoptSession(await profileRequest());
    } catch (error) {
      await clearStoredToken();
      setUser(null);
      setStatus('anonymous');
      throw toApiRequestError(error);
    }
  }, [adoptSession]);

  const register = useCallback(async (payload: RegistrationPayload) => {
    const response = await registerRequest(payload);

    await setStoredToken(response.token);

    try {
      return adoptSession(await profileRequest());
    } catch (error) {
      await clearStoredToken();
      setUser(null);
      setStatus('anonymous');
      throw toApiRequestError(error);
    }
  }, [adoptSession]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Always end the local session, even if the server already forgot it.
    } finally {
      await clearSession();
    }
  }, [clearSession]);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
