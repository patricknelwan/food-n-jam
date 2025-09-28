import { useState, useEffect, useCallback } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { authService } from '@services/auth/AuthService';
import type { User, SpotifyTokens, AuthState } from '../types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [error, setError] = useState<string | null>(null);

  // Helper function to transform Supabase user to our User type
  const transformSupabaseUser = (supabaseUser: SupabaseUser): User => {
    // Handle optional properties properly for exactOptionalPropertyTypes
    const user: User = {
      id: supabaseUser.id,
      spotify_id: supabaseUser.user_metadata?.spotify_id || supabaseUser.app_metadata?.spotify_id || '',
      created_at: supabaseUser.created_at || new Date().toISOString(),
      updated_at: supabaseUser.updated_at || new Date().toISOString(),
    };

    // Only add optional properties if they exist
    if (supabaseUser.email) {
      user.email = supabaseUser.email;
    }

    if (supabaseUser.user_metadata?.display_name || supabaseUser.app_metadata?.display_name) {
      user.display_name = supabaseUser.user_metadata?.display_name || supabaseUser.app_metadata?.display_name;
    }

    if (supabaseUser.user_metadata?.avatar_url || supabaseUser.app_metadata?.avatar_url) {
      user.avatar_url = supabaseUser.user_metadata?.avatar_url || supabaseUser.app_metadata?.avatar_url;
    }

    return user;
  };

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
        const transformedUser = transformSupabaseUser(session.user);
        setUser(transformedUser);
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

      // Transform the user from the auth service result
      let transformedUser: User;
      
      if ('spotify_id' in result.user) {
        // Already our custom User type from AuthService
        transformedUser = result.user as User;
      } else {
        // Transform from Supabase user
        transformedUser = transformSupabaseUser(result.user);
      }

      setUser(transformedUser);
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
