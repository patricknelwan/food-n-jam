import * as SecureStore from 'expo-secure-store';
import { supabase } from '../api/supabase';
import type { SpotifyTokens, User, AuthError } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import {
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  EXPO_PUBLIC_REDIRECT_URI,
} from '@env';

class AuthService {
  // Complete Spotify login (called from hook)
  async completeSpotifyLogin(code: string): Promise<{ user: User; tokens: SpotifyTokens } | AuthError> {
    try {
      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // Get user info from Spotify
      const spotifyUser = await this.getSpotifyUserInfo(tokens.access_token);
      
      // Create/update user in Supabase
      const user = await this.createOrUpdateUser(spotifyUser, tokens);
      
      // Store tokens securely
      await this.storeTokens(tokens);
      
      return { user, tokens };
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : 'Authentication failed',
        code: 'AUTH_ERROR',
        details: error,
      };
    }
  }

  // For backward compatibility with useAuth
  async loginWithSpotify(): Promise<{ user: User; tokens: SpotifyTokens } | AuthError> {
    return {
      message: 'Use useSpotifyAuth hook instead',
      code: 'DEPRECATED_METHOD',
      details: null,
    };
  }

  // Exchange authorization code for access tokens
  private async exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: EXPO_PUBLIC_REDIRECT_URI,
        client_id: EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    return response.json();
  }

  // Get user info from Spotify API
  private async getSpotifyUserInfo(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user info from Spotify');
    }

    return response.json();
  }

  // Create or update user in Supabase
  private async createOrUpdateUser(spotifyUser: any, tokens: SpotifyTokens): Promise<User> {
    const userData = {
      spotify_id: spotifyUser.id,
      email: spotifyUser.email,
      display_name: spotifyUser.display_name,
      avatar_url: spotifyUser.images?.[0]?.url,
    };

    // Try to sign in first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email || `${userData.spotify_id}@spotify.local`,
      password: userData.spotify_id,
    });

    if (error && error.message.includes('Invalid login credentials')) {
      // User doesn't exist, create them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: userData.email || `${userData.spotify_id}@spotify.local`,
        password: userData.spotify_id,
        options: {
          data: userData,
        },
      });

      if (signUpError) throw signUpError;
      
      if (signUpData.user) {
        return {
          id: signUpData.user.id,
          spotify_id: userData.spotify_id,
          email: userData.email,
          display_name: userData.display_name,
          avatar_url: userData.avatar_url,
          created_at: signUpData.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      } else {
        throw new Error('Failed to create user');
      }
    }

    if (error) throw error;
    
    if (data.user) {
      return {
        id: data.user.id,
        spotify_id: userData.spotify_id,
        email: userData.email,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url,
        created_at: data.user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      throw new Error('Failed to authenticate user');
    }
  }

  // Store tokens securely
  private async storeTokens(tokens: SpotifyTokens): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS, JSON.stringify(tokens));
  }

  // Get stored tokens
  async getStoredTokens(): Promise<SpotifyTokens | null> {
    try {
      const tokens = await SecureStore.getItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS);
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  // Check if tokens are valid - ADD THIS METHOD
  async checkTokenValidity(tokens: SpotifyTokens): Promise<boolean> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Refresh access token - ADD THIS METHOD
  async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const newTokens = await response.json();
    await this.storeTokens(newTokens);
    return newTokens;
  }

  // Logout
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS);
    await supabase.auth.signOut();
  }

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
}

export const authService = new AuthService();
