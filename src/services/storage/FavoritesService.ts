import { supabase } from '@services/api/supabase';
import type { SavedPairing } from '../../types/pairing';
import type { ApiResponse } from '../../types';

export interface CreatePairingData {
  meal_name: string;
  cuisine: string;
  playlist_id: string;
  playlist_name: string;
  meal_id?: string;
  meal_image?: string;
  playlist_image?: string | undefined;
}

class FavoritesService {
  // Save a new pairing
  async savePairing(pairingData: CreatePairingData): Promise<ApiResponse<SavedPairing>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as SavedPairing,
          error: 'User not authenticated',
          status: 'error'
        };
      }

      const { data, error } = await supabase
        .from('pairings')
        .insert({
          user_id: user.id,
          meal_name: pairingData.meal_name,
          cuisine: pairingData.cuisine,
          playlist_id: pairingData.playlist_id,
          playlist_name: pairingData.playlist_name,
          meal_id: pairingData.meal_id,
          meal_image: pairingData.meal_image,
          playlist_image: pairingData.playlist_image,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as SavedPairing,
        status: 'success'
      };
    } catch (error) {
      return {
        data: {} as SavedPairing,
        error: error instanceof Error ? error.message : 'Failed to save pairing',
        status: 'error'
      };
    }
  }

  // Get all saved pairings for the current user
  async getUserPairings(): Promise<ApiResponse<SavedPairing[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: [],
          error: 'User not authenticated',
          status: 'error'
        };
      }

      const { data, error } = await supabase
        .from('pairings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        data: data as SavedPairing[],
        status: 'success'
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch pairings',
        status: 'error'
      };
    }
  }

  // Delete a pairing
  async deletePairing(pairingId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: false,
          error: 'User not authenticated',
          status: 'error'
        };
      }

      const { error } = await supabase
        .from('pairings')
        .delete()
        .eq('id', pairingId)
        .eq('user_id', user.id); // Ensure user can only delete their own pairings

      if (error) {
        throw error;
      }

      return {
        data: true,
        status: 'success'
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to delete pairing',
        status: 'error'
      };
    }
  }

  // Check if a pairing already exists
  async checkPairingExists(mealName: string, playlistId: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: false,
          status: 'success'
        };
      }

      const { data, error } = await supabase
        .from('pairings')
        .select('id')
        .eq('user_id', user.id)
        .eq('meal_name', mealName)
        .eq('playlist_id', playlistId)
        .limit(1);

      if (error) {
        throw error;
      }

      return {
        data: data.length > 0,
        status: 'success'
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to check pairing',
        status: 'error'
      };
    }
  }

  // Get pairing statistics for the user
  async getUserStats(): Promise<ApiResponse<{
    totalPairings: number;
    uniqueMeals: number;
    uniquePlaylists: number;
    topCuisine: string | null;
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {
            totalPairings: 0,
            uniqueMeals: 0,
            uniquePlaylists: 0,
            topCuisine: null
          },
          status: 'success'
        };
      }

      // Get all pairings for stats calculation
      const { data: pairings, error } = await supabase
        .from('pairings')
        .select('meal_name, playlist_id, cuisine')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      const uniqueMeals = new Set(pairings.map(p => p.meal_name)).size;
      const uniquePlaylists = new Set(pairings.map(p => p.playlist_id)).size;
      
      // Calculate top cuisine
      const cuisineCounts: Record<string, number> = {};
      pairings.forEach(p => {
        cuisineCounts[p.cuisine] = (cuisineCounts[p.cuisine] || 0) + 1;
      });
      
      const topCuisine = Object.keys(cuisineCounts).length > 0
        ? Object.entries(cuisineCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : null;

      return {
        data: {
          totalPairings: pairings.length,
          uniqueMeals,
          uniquePlaylists,
          topCuisine
        },
        status: 'success'
      };
    } catch (error) {
      return {
        data: {
          totalPairings: 0,
          uniqueMeals: 0,
          uniquePlaylists: 0,
          topCuisine: null
        },
        error: error instanceof Error ? error.message : 'Failed to get stats',
        status: 'error'
      };
    }
  }
}

export const favoritesService = new FavoritesService();
