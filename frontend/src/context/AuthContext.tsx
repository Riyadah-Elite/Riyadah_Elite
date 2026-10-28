import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginInput, RegisterInput } from '@/types/auth';
import { login as apiLogin, register as apiRegister, fetchProfile, logout as apiLogout } from '@/services/auth';
import { ApiError } from '@/lib/api-client';

interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'register';
  tournamentContext?: string | null;
  onAuthenticated?: () => void;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendAvailable: boolean;
  authError: string | null;
  clearError: () => void;
  login: (input: LoginInput) => Promise<boolean>;
  registerUser: (input: RegisterInput, avatarFile?: Blob | File) => Promise<boolean>;
  logout: () => Promise<void>;
  authModal: AuthModalState;
  openAuthModal: (options?: {
    mode?: 'login' | 'register';
    tournamentContext?: string | null;
    onAuthenticated?: () => void;
  }) => void;
  closeAuthModal: () => void;
}

export const defaultAuthValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  backendAvailable: true,
  authError: null,
  clearError: () => {},
  login: async () => false,
  registerUser: async () => false,
  logout: async () => {},
  authModal: {
    isOpen: false,
    mode: 'login',
    tournamentContext: null,
  },
  openAuthModal: () => {},
  closeAuthModal: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendAvailable, setBackendAvailable] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<AuthModalState>({
    isOpen: false,
    mode: 'login',
    tournamentContext: null,
  });

  // Verify active session on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const response = await fetchProfile();
        if (isMounted) {
          setUser(response.user ?? null);
          setBackendAvailable(true);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setUser(null);

        if (err instanceof ApiError) {
          if (err.status === 401) {
            // Expected normal unauthenticated state for guest visitors
            setBackendAvailable(true);
          } else if (err.isNetworkError) {
            // Backend offline, unreachable, or CORS failure
            setBackendAvailable(false);
            console.warn('[AuthContext] Backend server unreachable; continuing in guest mode:', err.message);
          } else {
            // Server error (5xx, etc.)
            setBackendAvailable(false);
            console.warn(`[AuthContext] Backend returned status ${err.status}; continuing in guest mode:`, err.message);
          }
        } else {
          setBackendAvailable(false);
          console.warn('[AuthContext] Profile verification error; continuing in guest mode:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const openAuthModal = useCallback((options?: {
    mode?: 'login' | 'register';
    tournamentContext?: string | null;
    onAuthenticated?: () => void;
  }) => {
    setAuthError(null);
    setAuthModal({
      isOpen: true,
      mode: options?.mode ?? 'login',
      tournamentContext: options?.tournamentContext ?? null,
      onAuthenticated: options?.onAuthenticated,
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
      tournamentContext: null,
      onAuthenticated: undefined,
    }));
    setAuthError(null);
  }, []);

  const login = useCallback(async (input: LoginInput): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await apiLogin(input);
      if (response?.user) {
        setUser(response.user);
        setBackendAvailable(true);
        if (authModal.onAuthenticated) {
          authModal.onAuthenticated();
        }
        closeAuthModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      let msg = 'Login failed. Please check credentials.';
      if (err instanceof ApiError) {
        if (err.isNetworkError) {
          msg = 'Unable to reach the authentication server. Please check your connection and try again.';
        } else if (err.status === 401) {
          msg = 'Invalid email or password.';
        } else {
          msg = err.message || msg;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setAuthError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authModal, closeAuthModal]);

  const registerUser = useCallback(async (
    input: RegisterInput,
    avatarFile?: Blob | File
  ): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // If no custom avatar was uploaded, create a clean default avatar blob
      let avatarToSend = avatarFile;
      if (!avatarToSend && typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#08A8C8';
          ctx.fillRect(0, 0, 120, 120);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 50px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((input.username[0] || 'R').toUpperCase(), 60, 60);
        }
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );
        if (blob) {
          avatarToSend = blob;
        }
      }

      const response = await apiRegister(
        input,
        (avatarToSend as unknown as { uri: string; name: string; type: string }) || {
          uri: 'avatar.png',
          name: 'avatar.png',
          type: 'image/png',
        }
      );

      if (response?.user) {
        setUser(response.user);
        setBackendAvailable(true);
        if (authModal.onAuthenticated) {
          authModal.onAuthenticated();
        }
        closeAuthModal();
        return true;
      }
      return false;
    } catch (err: unknown) {
      let msg = 'Registration failed. Please check your details.';
      if (err instanceof ApiError) {
        if (err.isNetworkError) {
          msg = 'Unable to reach the authentication server. Please check your connection and try again.';
        } else {
          msg = err.message || msg;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setAuthError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authModal, closeAuthModal]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } catch (err: unknown) {
      console.warn('[AuthContext] Logout exception:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        backendAvailable,
        authError,
        clearError,
        login,
        registerUser,
        logout,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  return context || defaultAuthValue;
}

