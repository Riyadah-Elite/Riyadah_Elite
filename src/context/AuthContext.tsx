import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import toast from 'react-hot-toast';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginAdmin: (credentials: LoginCredentials) => Promise<void>;
  loginHost: (credentials: LoginCredentials) => Promise<void>;
  loginModerator: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginAdmin: async () => {},
  loginHost: async () => {},
  loginModerator: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: userData } = await auth.getUser();
        setState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user } = await auth.login(email, password);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/dashboard');
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async ({ name, email, password }: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user } = await auth.register(name, email, password);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(`Welcome to Riyadh Elite, ${user.username}!`);
      navigate('/dashboard');
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const loginAdmin = async ({ email, password }: LoginCredentials) => {
    await login({ email, password });
  };

  const loginHost = async ({ email, password }: LoginCredentials) => {
    await login({ email, password });
  };

  const loginModerator = async ({ email, password }: LoginCredentials) => {
    await login({ email, password });
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUser = (userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginAdmin,
        loginHost,
        loginModerator,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);