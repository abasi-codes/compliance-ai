'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  refreshToken as apiRefreshToken,
  type UserResponse,
  type LoginData,
  type RegisterData,
} from '@/lib/api/auth';

const TOKEN_KEY = 'compliance-ai-access-token';
const REFRESH_TOKEN_KEY = 'compliance-ai-refresh-token';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/', '/login', '/register'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const getAccessToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  const getRefreshToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }, []);

  const loadUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser(token);
      setUser(userData);
    } catch {
      // Try to refresh the token
      const refreshTokenValue = getRefreshToken();
      if (refreshTokenValue) {
        try {
          const tokens = await apiRefreshToken(refreshTokenValue);
          setTokens(tokens.access_token, tokens.refresh_token);
          const userData = await getCurrentUser(tokens.access_token);
          setUser(userData);
        } catch {
          clearTokens();
          setUser(null);
        }
      } else {
        clearTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, getRefreshToken, setTokens, clearTokens]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(
    async (data: LoginData) => {
      const tokens = await apiLogin(data);
      setTokens(tokens.access_token, tokens.refresh_token);
      const userData = await getCurrentUser(tokens.access_token);
      setUser(userData);
      router.push('/dashboard');
    },
    [setTokens, router]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      await apiRegister(data);
      // After registration, log the user in
      await login({ email: data.email, password: data.password });
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore errors on logout
    }
    clearTokens();
    setUser(null);
    router.push('/login');
  }, [clearTokens, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
