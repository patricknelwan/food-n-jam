import * as SecureStore from 'expo-secure-store';
import type { SpotifyTokens, User, AuthError } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import {
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  EXPO_PUBLIC_REDIRECT_URI,
} from '@env';

class AuthService {
  // Complete Spotify login (called from useSpotifyAuth hook)
  async completeSpotifyLogin(
    code: string, 
    codeVerifier?: string
  ): Promise<{ user: User; tokens: SpotifyTokens } | AuthError> {
    try {
      console.log('🔄 Starting Spotify login process...');
      
      // Exchange code for tokens with PKCE
      console.log('🔄 Step 1: Exchange code for tokens');
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
      console.log('✅ Step 1: Got tokens successfully');
      
      // Get user info from Spotify
      console.log('🔄 Step 2: Get user info from Spotify');
      const spotifyUser = await this.getSpotifyUserInfo(tokens.access_token);
      console.log('✅ Step 2: Got Spotify user info:', spotifyUser.display_name);
      
      // Create user object (skip Supabase for now)
      console.log('🔄 Step 3: Create user object locally');
      const user: User = {
        id: spotifyUser.id, // Use Spotify ID as our user ID for now
        spotify_id: spotifyUser.id,
        email: spotifyUser.email,
        display_name: spotifyUser.display_name,
        avatar_url: spotifyUser.images?.[0]?.url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('✅ Step 3: User object created successfully');
      
      // Store both tokens and user data locally
      console.log('🔄 Step 4: Store data locally');
      await this.storeTokens(tokens);
      await this.storeUser(user);
      console.log('✅ Step 4: Data stored successfully');
      
      console.log('🎉 Login completed successfully!');
      return { user, tokens };
    } catch (error) {
      console.error('❌ Login failed:', error);
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
      message: 'Use useSpotifyAuth hook and LoginScreen instead of direct service call',
      code: 'DEPRECATED_METHOD',
      details: null,
    };
  }

  // Exchange authorization code for access tokens with PKCE
  private async exchangeCodeForTokens(code: string, codeVerifier?: string): Promise<SpotifyTokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: EXPO_PUBLIC_REDIRECT_URI,
      client_id: EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
    });

    if (codeVerifier) {
      body.append('code_verifier', codeVerifier);
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to exchange code for tokens: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  // Get user info from Spotify API
  private async getSpotifyUserInfo(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to get user info from Spotify: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  // Store tokens securely
  private async storeTokens(tokens: SpotifyTokens): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS, JSON.stringify(tokens));
  }

  // Store user securely
  private async storeUser(user: User): Promise<void> {
    await SecureStore.setItemAsync('USER_DATA', JSON.stringify(user));
  }

  // Get stored user
  async getStoredUser(): Promise<User | null> {
    try {
      const user = await SecureStore.getItemAsync('USER_DATA');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
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

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status} - ${responseText}`);
    }

    const newTokens = JSON.parse(responseText);
    await this.storeTokens(newTokens);
    return newTokens;
  }

  // Logout
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS);
    await SecureStore.deleteItemAsync('USER_DATA');
  }

  // Get current session (simplified - just return stored user)
  async getCurrentSession() {
    const user = await this.getStoredUser();
    return user ? { user } : null;
  }
}

export const authService = new AuthService();
