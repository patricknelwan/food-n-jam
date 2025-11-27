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
      console.log('🔄 useAuth: Starting initializeAuth...');
      setAuthState('loading');

      // Check for stored tokens and user
      console.log('🔄 useAuth: Checking stored data...');
      const storedTokens = await authService.getStoredTokens();
      const storedUser = await authService.getStoredUser();

      console.log('🔍 useAuth: storedTokens:', !!storedTokens);
      console.log('🔍 useAuth: storedUser:', !!storedUser);
      console.log('🔍 useAuth: user details:', storedUser?.display_name);

      if (!storedTokens || !storedUser) {
        console.log('❌ useAuth: No stored data, setting unauthenticated');
        setAuthState('unauthenticated');
        return;
      }

      // Validate tokens
      console.log('🔄 useAuth: Validating tokens...');
      const isValid = await authService.checkTokenValidity(storedTokens);
      console.log('🔍 useAuth: tokens valid:', isValid);

      if (!isValid) {
        // Try to refresh if we have a refresh token
        if (storedTokens.refresh_token) {
          try {
            console.log('🔄 useAuth: Refreshing tokens...');
            const newTokens = await authService.refreshAccessToken(storedTokens.refresh_token);
            setTokens(newTokens);
            setUser(storedUser);
            console.log('✅ useAuth: Set authenticated state (after refresh)');
            setAuthState('authenticated');
          } catch {
            console.log('❌ useAuth: Token refresh failed, setting unauthenticated');
            setAuthState('unauthenticated');
          }
        } else {
          console.log('❌ useAuth: No refresh token, setting unauthenticated');
          setAuthState('unauthenticated');
        }
      } else {
        setTokens(storedTokens);
        setUser(storedUser);
        console.log('✅ useAuth: Set authenticated state (tokens valid)');
        setAuthState('authenticated');
      }
    } catch (err) {
      console.error('❌ useAuth: initializeAuth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication error');
      setAuthState('error');
    }
  }, []);

  // THIS IS THE MISSING PIECE - useEffect to call initializeAuth on mount!
  useEffect(() => {
    console.log('🚀 useAuth: Component mounted, calling initializeAuth');
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async () => {
    console.log('🔄 useAuth: login() called, running initializeAuth...');
    await initializeAuth();
    console.log('✅ useAuth: login() completed');
  }, [initializeAuth]);

  const logout = useCallback(async () => {
    try {
      console.log('🔄 useAuth: Starting logout...');

      // Clear data from AuthService
      await authService.logout();

      // Clear local state
      setUser(null);
      setTokens(null);
      setError(null);

      // Set auth state to unauthenticated
      console.log('✅ useAuth: Setting unauthenticated state');
      setAuthState('unauthenticated');

      console.log('🎉 useAuth: Logout completed successfully');
    } catch (error) {
      console.error('❌ useAuth: Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
    }
  }, []);

  return {
    user,
    tokens,
    authState,
    error,
    login,
    logout,
    initializeAuth,
  };
};
