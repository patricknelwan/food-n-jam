import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth/AuthService';
import type { User, SpotifyTokens, AuthState } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState('loading');
      
      // Check for stored tokens and user
      const storedTokens = await authService.getStoredTokens();
      const storedUser = await authService.getStoredUser();
      
      if (!storedTokens || !storedUser) {
        setAuthState('unauthenticated');
        return;
      }

      // Validate tokens
      const isValid = await authService.checkTokenValidity(storedTokens);
      if (!isValid) {
        // Try to refresh if we have a refresh token
        if (storedTokens.refresh_token) {
          try {
            const newTokens = await authService.refreshAccessToken(storedTokens.refresh_token);
            setTokens(newTokens);
            setUser(storedUser);
            setAuthState('authenticated');
          } catch {
            setAuthState('unauthenticated');
          }
        } else {
          setAuthState('unauthenticated');
        }
      } else {
        setTokens(storedTokens);
        setUser(storedUser);
        setAuthState('authenticated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication error');
      setAuthState('error');
    }
  }, []);

  // Login (this will be called after successful Spotify auth)
  const login = useCallback(async () => {
    // Refresh auth state to pick up newly stored tokens/user
    await initializeAuth();
  }, [initializeAuth]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setTokens(null);
      setAuthState('unauthenticated');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    tokens,
    authState,
    error,
    isLoading: authState === 'loading',
    isAuthenticated: authState === 'authenticated',
    login,
    logout,
    refreshAuth: initializeAuth,
  };
};
