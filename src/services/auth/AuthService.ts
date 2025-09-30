import * as SecureStore from 'expo-secure-store';
import { supabase } from '../api/supabase';
import type { SpotifyTokens, User, AuthError } from '../../types';
import { STORAGE_KEYS } from '../../utils/constants';
import {
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  EXPO_PUBLIC_REDIRECT_URI,
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
} from '@env';

class AuthService {
  // Test Supabase connection with detailed logging
  async testSupabaseConnection(): Promise<void> {
    try {
      console.log('🔧 Testing basic Supabase connection...');
      console.log('📍 URL:', EXPO_PUBLIC_SUPABASE_URL);
      console.log('🔑 Key prefix:', EXPO_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
      
      // Test 1: Direct HTTP request to Supabase
      console.log('🌐 Test 1: Direct HTTP request...');
      const response = await fetch(`${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🌐 Direct API response status:', response.status);
      const responseText = await response.text();
      console.log('🌐 Direct API response (first 200 chars):', responseText.substring(0, 200));
      
      if (response.status === 404) {
        throw new Error('Supabase project not found. Check your EXPO_PUBLIC_SUPABASE_URL');
      }
      
      // Test 2: Supabase client connection
      console.log('🔧 Test 2: Supabase client connection...');
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
        
      console.log('📊 Users table count:', data);
      console.log('❗ Users table error:', error);
      
      if (error) {
        console.error('❌ Supabase client connection failed:', error);
        throw error;
      } else {
        console.log('✅ Supabase connection successful!');
      }
    } catch (error) {
      console.error('❌ Connection test failed completely:', error);
      throw error;
    }
  }

  // Complete Spotify login with proper Supabase integration
  async completeSpotifyLogin(
    code: string, 
    codeVerifier?: string
  ): Promise<{ user: User; tokens: SpotifyTokens } | AuthError> {
    try {
      console.log('🔄 Starting Spotify login process...');
      
      // Step 1: Exchange code for tokens
      console.log('🔄 Step 1: Exchange code for tokens');
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier);
      console.log('✅ Step 1: Got tokens successfully');
      
      // Step 2: Get user info from Spotify
      console.log('🔄 Step 2: Get user info from Spotify');
      const spotifyUser = await this.getSpotifyUserInfo(tokens.access_token);
      console.log('✅ Step 2: Got Spotify user info:', spotifyUser.display_name);
      
      // Step 3: Create/update user in Supabase
      console.log('🔄 Step 3: Create/update user in Supabase');
      const user = await this.createOrUpdateUser(spotifyUser);
      console.log('✅ Step 3: User created/updated in Supabase');
      
      // Step 4: Store tokens securely
      console.log('🔄 Step 4: Store tokens locally');
      await this.storeTokens(tokens);
      console.log('✅ Step 4: Tokens stored successfully');
      
      // Step 5: Store user data locally - THIS IS THE KEY ADDITION!
      console.log('🔄 Step 5: Store user data locally');
      await this.storeUser(user);
      console.log('✅ Step 5: User data stored successfully');
      
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

  // Exchange authorization code for access tokens with PKCE support
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
    console.log('Spotify token response status:', response.status);

    if (!response.ok) {
      console.error('Spotify token error:', responseText);
      throw new Error(`Failed to exchange code for tokens: ${response.status} - ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Spotify token response:', responseText);
      throw new Error('Invalid response from Spotify token endpoint');
    }
  }

  // Get user info from Spotify API
  private async getSpotifyUserInfo(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseText = await response.text();
    console.log('Spotify user response status:', response.status);

    if (!response.ok) {
      console.error('Spotify user error:', responseText);
      throw new Error(`Failed to get user info from Spotify: ${response.status} - ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Spotify user response:', responseText);
      throw new Error('Invalid response from Spotify user endpoint');
    }
  }

  // Create or update user in Supabase (simplified with better error handling)
  private async createOrUpdateUser(spotifyUser: any): Promise<User> {
    const userData = {
      spotify_id: spotifyUser.id,
      email: spotifyUser.email,
      display_name: spotifyUser.display_name,
      avatar_url: spotifyUser.images?.[0]?.url || null,
      country: spotifyUser.country || null,
      followers_count: spotifyUser.followers?.total || 0,
      premium: spotifyUser.product === 'premium',
    };

    console.log('🔄 Creating/updating user with simple approach:', userData);

    try {
      // Method 1: Try simple insert first
      console.log('🔄 Attempting insert...');
      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (!insertError && insertedUser) {
        console.log('✅ User created successfully:', insertedUser.display_name);
        return insertedUser;
      }

      console.log('🔄 Insert failed, trying update. Insert error:', insertError);

      // Method 2: Insert failed, try update
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq('spotify_id', userData.spotify_id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Update also failed:', updateError);
        throw new Error(`Both insert and update failed. Insert: ${insertError?.message}, Update: ${updateError.message}`);
      }

      if (!updatedUser) {
        throw new Error('Update completed but no user data returned');
      }

      console.log('✅ User updated successfully:', updatedUser.display_name);
      return updatedUser;

    } catch (error) {
      console.error('❌ Complete operation failed:', error);
      throw error;
    }
  }

  // Store tokens securely
  private async storeTokens(tokens: SpotifyTokens): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS, JSON.stringify(tokens));
  }

  // Store user data securely - NEW METHOD ADDED!
  private async storeUser(user: User): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
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

  // Get stored user data - NEW METHOD ADDED!
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
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

    try {
      const newTokens = JSON.parse(responseText);
      await this.storeTokens(newTokens);
      return newTokens;
    } catch (e) {
      throw new Error('Invalid response from token refresh endpoint');
    }
  }

  // Logout - UPDATED TO CLEAR USER DATA TOO!
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SPOTIFY_TOKENS);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA); // Clear user data too
  }

  // Get user by Spotify ID
  async getUserBySpotifyId(spotifyId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('spotify_id', spotifyId)
        .single();

      if (error && error.code === 'PGRST116') {
        return null; // User not found
      }

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserBySpotifyId:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
