import { useState, useCallback } from 'react';
import { spotifyService } from '@services/api/spotify';
import type { SpotifyPlaylist } from '../types/spotify';

export const useSpotify = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's playlists
  const loadUserPlaylists = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await spotifyService.getUserPlaylists();

      if (result.status === 'success') {
        setPlaylists(result.data);
      } else {
        setError(result.error || 'Failed to load playlists');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get specific playlist
  const getPlaylist = useCallback(async (playlistId: string) => {
    try {
      const result = await spotifyService.getPlaylist(playlistId);
      return result.status === 'success' ? result.data : null;
    } catch {
      return null;
    }
  }, []);

  // Get playlist tracks
  const getPlaylistTracks = useCallback(async (playlistId: string) => {
    try {
      const result = await spotifyService.getPlaylistTracks(playlistId);
      return result.status === 'success' ? result.data : [];
    } catch {
      return [];
    }
  }, []);

  // Search playlists
  const searchPlaylists = useCallback(async (query: string) => {
    if (!query.trim()) return [];

    try {
      const result = await spotifyService.searchPlaylists(query);
      return result.status === 'success' ? result.data : [];
    } catch {
      return [];
    }
  }, []);

  return {
    playlists,
    isLoading,
    error,
    loadUserPlaylists,
    getPlaylist,
    getPlaylistTracks,
    searchPlaylists,
  };
};
