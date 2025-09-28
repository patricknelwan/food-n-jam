import { useState, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { authService } from '../services/auth/AuthService';
import {
  EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
  EXPO_PUBLIC_REDIRECT_URI,
} from '@env';

WebBrowser.maybeCompleteAuthSession();

export const useSpotifyAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Configure Spotify OAuth request (hooks called at top level)
  const discovery = AuthSession.useAutoDiscovery('https://accounts.spotify.com');
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
      scopes: ['user-read-email', 'user-read-private', 'playlist-read-private'],
      redirectUri: EXPO_PUBLIC_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        show_dialog: 'true',
      },
    },
    discovery
  );

  const login = useCallback(async () => {
    if (!request) {
      throw new Error('Auth request not ready');
    }

    setIsLoading(true);
    try {
      const result = await promptAsync();
      
      if (result.type !== 'success' || !result.params?.code) {
        throw new Error('Authentication cancelled or failed');
      }

      const loginResult = await authService.completeSpotifyLogin(result.params.code);
      
      setIsLoading(false);
      return loginResult;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [request, promptAsync]);

  return {
    login,
    isLoading,
    isReady: !!request,
  };
};
