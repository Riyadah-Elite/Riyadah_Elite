import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalContext: string | null;
  openAuthModal: (context?: string) => void;
  closeAuthModal: () => void;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authModalOpen: false,
  authModalContext: null,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-vanguard',
    username: 'Vanguard_QA',
    email: 'vanguard@riyadahelite.gg',
    role: 'USER',
    testingPoints: 1500,
    testingRank: 'diamond 1',
    isNotificationAllowed: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalContext, setAuthModalContext] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        const profile = await authService.getProfile();
        if (mounted && profile) {
          setUser(profile);
        }
      } catch {
        // Retain initial session
      }
    }
    checkSession();
    return () => {
      mounted = false;
    };
  }, []);

  const openAuthModal = useCallback((context?: string) => {
    setAuthModalContext(context ?? null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalContext(null);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      setUser(res.user);
      closeAuthModal();
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal]);

  const register = useCallback(async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      setUser(res.user);
      closeAuthModal();
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authModalOpen,
        authModalContext,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

