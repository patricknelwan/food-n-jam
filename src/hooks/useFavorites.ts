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

  // Load user's saved pairings
  const loadPairings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await favoritesService.getUserPairings();
      
      if (result.status === 'success') {
        setPairings(result.data);
      } else {
        setError(result.error || 'Failed to load favorites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a new pairing
  const savePairing = useCallback(async (pairingData: CreatePairingData): Promise<boolean> => {
    console.log('===== useFavorites.savePairing =====');
    console.log('DEBUG useFavorites: savePairing called with:', pairingData);
    
    try {
      setError(null);
      
      console.log('DEBUG useFavorites: Checking if pairing exists...');
      // Check if pairing already exists
      const existsResult = await favoritesService.checkPairingExists(
        pairingData.meal_name,
        pairingData.playlist_id
      );
      
      console.log('DEBUG useFavorites: existsResult:', existsResult);
      
      if (existsResult.data) {
        console.log('DEBUG useFavorites: Pairing already exists!');
        setError('This pairing is already saved to your favorites');
        return false;
      }

      console.log('DEBUG useFavorites: Calling favoritesService.savePairing...');
      const result = await favoritesService.savePairing(pairingData);
      
      console.log('DEBUG useFavorites: favoritesService.savePairing result:', result);
      console.log('DEBUG useFavorites: result.status:', result.status);
      console.log('DEBUG useFavorites: result.error:', result.error);
      
      if (result.status === 'success') {
        console.log('DEBUG useFavorites: Success! Reloading pairings...');
        await loadPairings();
        return true;
      } else {
        console.error('DEBUG useFavorites: Failed with error:', result.error);
        setError(result.error || 'Failed to save pairing');
        return false;
      }
    } catch (err) {
      console.error('===== useFavorites.savePairing ERROR =====');
      console.error('DEBUG useFavorites: Exception caught:', err);
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
        setPairings(prev => prev.filter(p => p.id !== pairingId));
        return true;
      } else {
        setError(result.error || 'Failed to delete pairing');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pairing');
      return false;
    }
  }, []);

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
    loadStats();
  }, [loadPairings, loadStats]);

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
