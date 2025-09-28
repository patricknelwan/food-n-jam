import axios from 'axios';
import { authService } from '@services/auth/AuthService';
import { API_ENDPOINTS } from '@utils/constants';
import type { SpotifyTokens, ApiResponse } from '@types';

// Spotify API Response Types
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  followers: {
    total: number;
  };
  country: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  tracks: {
    total: number;
  };
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  collaborative: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height?: number;
      width?: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifyPlaylistTracks {
  items: Array<{
    track: SpotifyTrack;
  }>;
  total: number;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
}

// Processed types for our app
export interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  trackCount: number;
  owner: string;
  isOwner: boolean;
}

class SpotifyService {
  private baseURL = API_ENDPOINTS.SPOTIFY_BASE;

  // Get current user's playlists
  async getUserPlaylists(): Promise<ApiResponse<Playlist[]>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: [], error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/me/playlists`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      });

      const playlists = response.data.items.map((item: SpotifyPlaylist) => 
        this.processPlaylist(item, tokens.access_token)
      );

      return {
        data: playlists,
        status: 'success',
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch playlists',
        status: 'error',
      };
    }
  }

  // Get playlist details
  async getPlaylist(playlistId: string): Promise<ApiResponse<Playlist | null>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: null, error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const playlist = this.processPlaylist(response.data, tokens.access_token);

      return {
        data: playlist,
        status: 'success',
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to fetch playlist',
        status: 'error',
      };
    }
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId: string): Promise<ApiResponse<SpotifyTrack[]>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: [], error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      });

      const tracks = response.data.items
        .filter((item: any) => item.track && item.track.id)
        .map((item: any) => item.track);

      return {
        data: tracks,
        status: 'success',
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch playlist tracks',
        status: 'error',
      };
    }
  }

  // Get audio features for tracks (to help with genre detection)
  async getAudioFeatures(trackIds: string[]): Promise<ApiResponse<SpotifyAudioFeatures[]>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: [], error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/audio-features`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        params: {
          ids: trackIds.slice(0, 100).join(','), // Spotify limits to 100 IDs
        },
      });

      return {
        data: response.data.audio_features.filter(Boolean), // Remove null values
        status: 'success',
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch audio features',
        status: 'error',
      };
    }
  }

  // Get user's top artists (for genre detection)
  async getUserTopArtists(): Promise<ApiResponse<any[]>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: [], error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/me/top/artists`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        params: {
          limit: 20,
          time_range: 'medium_term',
        },
      });

      return {
        data: response.data.items,
        status: 'success',
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch top artists',
        status: 'error',
      };
    }
  }

  // Search for playlists
  async searchPlaylists(query: string): Promise<ApiResponse<Playlist[]>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: [], error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/search`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
        params: {
          q: query,
          type: 'playlist',
          limit: 20,
        },
      });

      const playlists = response.data.playlists.items.map((item: SpotifyPlaylist) =>
        this.processPlaylist(item, tokens.access_token)
      );

      return {
        data: playlists,
        status: 'success',
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to search playlists',
        status: 'error',
      };
    }
  }

  // Get valid tokens (refresh if needed)
  private async getValidTokens(): Promise<SpotifyTokens | null> {
    const tokens = await authService.getStoredTokens();
    
    if (!tokens) {
      return null;
    }

    // Check if tokens are still valid
    const isValid = await authService.checkTokenValidity(tokens);
    
    if (isValid) {
      return tokens;
    }

    // Try to refresh if we have a refresh token
    if (tokens.refresh_token) {
      try {
        return await authService.refreshAccessToken(tokens.refresh_token);
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  // Process raw Spotify playlist data
  private processPlaylist(spotifyPlaylist: SpotifyPlaylist, currentUserId: string): Playlist {
    return {
      id: spotifyPlaylist.id,
      name: spotifyPlaylist.name,
      description: spotifyPlaylist.description || '',
      image: spotifyPlaylist.images?.[0]?.url || '',
      trackCount: spotifyPlaylist.tracks.total,
      owner: spotifyPlaylist.owner.display_name || spotifyPlaylist.owner.id,
      isOwner: spotifyPlaylist.owner.id === currentUserId,
    };
  }

  // Get current user info
  async getCurrentUser(): Promise<ApiResponse<SpotifyUser | null>> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) {
        return { data: null, error: 'No valid tokens', status: 'error' };
      }

      const response = await axios.get(`${this.baseURL}/me`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      return {
        data: response.data,
        status: 'success',
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to fetch user info',
        status: 'error',
      };
    }
  }
}

export const spotifyService = new SpotifyService();
