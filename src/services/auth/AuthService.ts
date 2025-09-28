import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../api/supabase';
import type { SpotifyTokens, User, AuthError } from '@types';
import { AUTH_CONFIG, STORAGE_KEYS } from '@utils/constants';
import {
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  EXPO_PUBLIC_REDIRECT_URI,
} from '@env';

// Complete the auth session for web browsers
WebBrowser.maybeCompleteAuthSession();

class AuthService {
  // Configure Spotify OAuth request
  private async createAuthRequest() {
    const discovery = AuthSession.useAutoDiscovery('https://accounts.spotify.com');
    
    return AuthSession.useAuthRequest(
      {
        clientId: EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
        scopes: AUTH_CONFIG.SPOTIFY_SCOPES.split(' '),
        redirectUri: EXPO_PUBLIC_REDIRECT_URI,
        responseType: AuthSession.ResponseType.Code,
        additionalParameters: {},
        extraParams: {
          show_dialog: 'true', // Force Spotify login dialog
        },
      },
      discovery
    );
  }

  // Initiate Spotify login
  async loginWithSpotify(): Promise<{ user: User; tokens: SpotifyTokens } | AuthError> {
    try {
      const [request, response, promptAsync] = await this.createAuthRequest();

      if (!request) {
        throw new Error('Failed to create auth request');
      }

      // Prompt for authentication
      const result = await promptAsync();

      if (result.type !== 'success') {
        throw new Error('Authentication cancelled or failed');
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(result.params.code);
      
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

    // Sign in with Supabase (creates user if doesn't exist)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email || `${userData.spotify_id}@spotify.local`,
      password: userData.spotify_id, // Using Spotify ID as password
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
      return signUpData.user as User;
    }

    if (error) throw error;
    return data.user as User;
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

  // Check if tokens are valid
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

  // Refresh access token
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
