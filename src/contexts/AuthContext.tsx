import React, { createContext, useContext, ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/AuthService';
import type { User, SpotifyTokens, AuthState } from '../types/auth';

interface AuthContextType {
  user: User | null;
  tokens: SpotifyTokens | null;
  authState: AuthState;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);

  const initializeAuth = useCallback(async () => {
    try {
      console.log('🔄 AuthContext: Starting initializeAuth...');
      setAuthState('loading');

      const storedTokens = await authService.getStoredTokens();
      const storedUser = await authService.getStoredUser();

      console.log('🔍 AuthContext: storedTokens:', !!storedTokens);
      console.log('🔍 AuthContext: storedUser:', !!storedUser);

      if (!storedTokens || !storedUser) {
        console.log('❌ AuthContext: No stored data, setting unauthenticated');
        setAuthState('unauthenticated');
        return;
      }

      const isValid = await authService.checkTokenValidity(storedTokens);
      console.log('🔍 AuthContext: tokens valid:', isValid);

      if (!isValid) {
        if (storedTokens.refresh_token) {
          try {
            console.log('🔄 AuthContext: Refreshing tokens...');
            const newTokens = await authService.refreshAccessToken(storedTokens.refresh_token);
            setTokens(newTokens);
            setUser(storedUser);
            console.log('✅ AuthContext: Set authenticated state (after refresh)');
            setAuthState('authenticated');
          } catch {
            console.log('❌ AuthContext: Token refresh failed');
            setAuthState('unauthenticated');
          }
        } else {
          console.log('❌ AuthContext: No refresh token');
          setAuthState('unauthenticated');
        }
      } else {
        setTokens(storedTokens);
        setUser(storedUser);
        console.log('✅ AuthContext: Set authenticated state (tokens valid)');
        setAuthState('authenticated');
      }
    } catch (err) {
      console.error('❌ AuthContext: initializeAuth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
      setAuthState('error');
    }
  }, []);

  useEffect(() => {
    console.log('🚀 AuthContext: Provider mounted, calling initializeAuth');
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async () => {
    console.log('🔄 AuthContext: login() called');
    await initializeAuth();
  }, [initializeAuth]);

  const logout = useCallback(async () => {
    try {
      console.log('🔄 AuthContext: Starting logout...');

      await authService.logout();

      setUser(null);
      setTokens(null);
      setError(null);

      console.log('✅ AuthContext: Setting unauthenticated state');
      setAuthState('unauthenticated');

      console.log('🎉 AuthContext: Logout completed');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  }, []);

  const value = {
    user,
    tokens,
    authState,
    error,
    login,
    logout,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
