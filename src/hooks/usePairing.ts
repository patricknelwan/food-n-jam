import { useState, useCallback } from 'react';
import { pairingLogic } from '@utils/pairing/pairingLogic';
import type { Meal } from '../types/meal';
import type { PairingRecommendation } from '../types/pairing';

export const usePairing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create meal to playlist pairing
  const createMealPairing = useCallback(async (meal: Meal): Promise<PairingRecommendation | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const pairing = await pairingLogic.createMealPlaylistPairing(meal);
      
      return {
        meal: pairing.meal,
        playlist: {
          name: pairing.genreRecommendation.playlist,
          genre: pairing.genreRecommendation.genre,
          spotifyGenre: pairing.genreRecommendation.spotifyGenre,
        },
        confidence: pairing.confidence,
        cuisine: pairing.cuisine,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pairing');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create playlist to meal pairing
  const createPlaylistPairing = useCallback(async (
    playlist: { id: string; name: string },
    genre: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const pairing = await pairingLogic.createPlaylistMealPairing(playlist, genre);
      return pairing;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pairing');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createMealPairing,
    createPlaylistPairing,
  };
};
