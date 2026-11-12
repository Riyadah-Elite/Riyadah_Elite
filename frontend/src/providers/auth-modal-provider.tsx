import { router, type Href } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { useAuth } from './auth-provider';

export type AuthMode = 'login' | 'register';

interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode: AuthMode, redirect?: Href) => void;
  closeAuth: () => void;
  finishAuth: () => Href | null;
  requireAuth: (redirect?: Href) => boolean;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

/**
 * Web presents authentication as a claymorphic dialog; native presents it as
 * a route. Screens only call `requireAuth`, so they do not need to know which.
 *
 * A pending destination survives the round trip, which is what makes
 * "tap Tournaments while signed out → sign in → land on Tournaments" work.
 */
export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const pendingRedirect = useRef<Href | null>(null);

  const openAuth = useCallback((nextMode: AuthMode, redirect?: Href) => {
    if (redirect) pendingRedirect.current = redirect;

    if (Platform.OS === 'web') {
      setMode(nextMode);
      setIsOpen(true);
      return;
    }

    router.push(nextMode === 'login' ? '/auth/login' : '/auth/register');
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    pendingRedirect.current = null;
  }, []);

  const finishAuth = useCallback((): Href | null => {
    const redirect = pendingRedirect.current;
    pendingRedirect.current = null;
    setIsOpen(false);
    return redirect;
  }, []);

  const requireAuth = useCallback(
    (redirect?: Href) => {
      if (isAuthenticated) {
        if (redirect) router.push(redirect);
        return true;
      }

      openAuth('login', redirect);
      return false;
    },
    [isAuthenticated, openAuth],
  );

  const value = useMemo<AuthModalContextValue>(
    () => ({ isOpen, mode, openAuth, closeAuth, finishAuth, requireAuth }),
    [closeAuth, finishAuth, isOpen, mode, openAuth, requireAuth],
  );

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>;
}

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error('useAuthModal must be used inside AuthModalProvider');
  }

  return context;
}
