import type { Meal } from './meal';

export interface PairingRecommendation {
  meal: Meal;
  playlist: {
    name: string;
    genre: string;
    spotifyGenre: string;
  };
  confidence: number;
  cuisine: string;
}

export interface SavedPairing {
  id: string;
  user_id: string;
  meal_name: string;
  cuisine: string;
  playlist_id: string;
  playlist_name: string;
  meal_id?: string;
  meal_image?: string;
  playlist_image?: string;
  created_at: string;
}

export interface PairingAction {
  type: 'save' | 'share' | 'open_spotify' | 'view_recipe';
  pairing: PairingRecommendation;
}

export interface UserStats {
  totalPairings: number;
  uniqueMeals: number;
  uniquePlaylists: number;
  topCuisine: string | null;
}
