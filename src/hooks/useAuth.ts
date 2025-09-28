import { useState, useEffect, useCallback } from 'react';
import { authService } from '@services/auth/AuthService';
import type { User, SpotifyTokens, AuthState } from '@types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setAuthState('loading');
      
      // Check for stored tokens
      const storedTokens = await authService.getStoredTokens();
      
      if (!storedTokens) {
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
          } catch {
            setAuthState('unauthenticated');
            return;
          }
        } else {
          setAuthState('unauthenticated');
          return;
        }
      } else {
        setTokens(storedTokens);
      }

      // Get current session
      const session = await authService.getCurrentSession();
      
      if (session?.user) {
        setUser(session.user as User);
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication error');
      setAuthState('error');
    }
  }, []);

  // Login with Spotify
  const login = useCallback(async () => {
    try {
      setAuthState('loading');
      setError(null);

      const result = await authService.loginWithSpotify();
      
      if ('message' in result) {
        // Error occurred
        setError(result.message);
        setAuthState('error');
        return false;
      }

      // Success
      setUser(result.user);
      setTokens(result.tokens);
      setAuthState('authenticated');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setAuthState('error');
      return false;
    }
  }, []);

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
