import { useState, useCallback, useEffect } from 'react';
import { favoritesService } from '@services/storage/FavoritesService';
import type { SavedPairing } from '../types/pairing';
import type { CreatePairingData } from '@services/storage/FavoritesService';

export const useFavorites = () => {
  const [pairings, setPairings] = useState<SavedPairing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPairings: 0,
    uniqueMeals: 0,
    uniquePlaylists: 0,
    topCuisine: null as string | null,
  });

  // Load user statistics
  const loadStats = useCallback(async () => {
    try {
      const result = await favoritesService.getUserStats();
      
      if (result.status === 'success') {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Load user's saved pairings
  const loadPairings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await favoritesService.getUserPairings();
      
      if (result.status === 'success') {
        setPairings(result.data);
        // Also reload stats when pairings change
        await loadStats();
      } else {
        setError(result.error || 'Failed to load favorites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [loadStats]);

  // Save a new pairing
  const savePairing = useCallback(async (pairingData: CreatePairingData): Promise<boolean> => {
    try {
      setError(null);
      
      // Check if pairing already exists
      const existsResult = await favoritesService.checkPairingExists(
        pairingData.meal_name,
        pairingData.playlist_id
      );
      
      if (existsResult.data) {
        setError('This pairing is already saved to your favorites');
        return false;
      }

      const result = await favoritesService.savePairing(pairingData);
      
      if (result.status === 'success') {
        // Refresh both pairings and stats
        await loadPairings();
        return true;
      } else {
        setError(result.error || 'Failed to save pairing');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pairing');
      return false;
    }
  }, [loadPairings]);

  // Delete a pairing
  const deletePairing = useCallback(async (pairingId: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await favoritesService.deletePairing(pairingId);
      
      if (result.status === 'success') {
        // Remove from local state and reload stats
        setPairings(prev => prev.filter(p => p.id !== pairingId));
        await loadStats();
        return true;
      } else {
        setError(result.error || 'Failed to delete pairing');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pairing');
      return false;
    }
  }, [loadStats]);

  // Check if a specific pairing exists
  const checkPairingExists = useCallback(async (mealName: string, playlistId: string): Promise<boolean> => {
    try {
      const result = await favoritesService.checkPairingExists(mealName, playlistId);
      return result.data;
    } catch {
      return false;
    }
  }, []);

  // Load pairings and stats on mount
  useEffect(() => {
    loadPairings();
  }, [loadPairings]);

  return {
    pairings,
    isLoading,
    error,
    stats,
    loadPairings,
    savePairing,
    deletePairing,
    checkPairingExists,
    loadStats,
  };
};
