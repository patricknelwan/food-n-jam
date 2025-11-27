import { cuisineMapper } from './cuisineMapper';
import { mealDBService } from '@services/api/mealdb';
import type { Meal } from '@services/api/mealdb';
import type { CuisineMapping } from './cuisineMapper';

export interface MealPlaylistPairing {
  meal: Meal;
  cuisine: string;
  genreRecommendation: CuisineMapping;
  confidence: number; // 0-1 scale of how confident we are in the pairing
}

export interface PlaylistMealPairing {
  playlist: {
    id: string;
    name: string;
  };
  detectedGenre: string;
  suggestedCuisines: string[];
  suggestedMeal: Meal | null;
  confidence: number;
}

class PairingLogic {
  // Create meal to playlist pairing
  async createMealPlaylistPairing(meal: Meal): Promise<MealPlaylistPairing> {
    const genreRecommendation = cuisineMapper.getGenreForCuisine(meal.cuisine);

    // Calculate confidence based on how well-known the cuisine is
    const confidence = this.calculateMealPairingConfidence(meal);

    return {
      meal,
      cuisine: meal.cuisine,
      genreRecommendation: genreRecommendation || cuisineMapper.getGenreForCuisine('Unknown')!,
      confidence,
    };
  }

  // Create playlist to meal pairing
  async createPlaylistMealPairing(
    playlist: { id: string; name: string },
    detectedGenre: string
  ): Promise<PlaylistMealPairing> {
    const suggestedCuisines = cuisineMapper.getCuisinesForGenre(detectedGenre);

    // Get a random meal from one of the suggested cuisines
    let suggestedMeal: Meal | null = null;

    if (suggestedCuisines.length > 0) {
      const randomCuisine = suggestedCuisines[Math.floor(Math.random() * suggestedCuisines.length)];
      if (randomCuisine) {
        const mealResult = await mealDBService.getMealsByCuisine(randomCuisine);

        if (mealResult.status === 'success' && mealResult.data.length > 0) {
          const randomMeal = mealResult.data[Math.floor(Math.random() * mealResult.data.length)];
          if (randomMeal) {
            suggestedMeal = randomMeal;
          }
        }
      }
    }

    // Fallback: get a random meal if no cuisine-specific meal found
    if (!suggestedMeal) {
      const randomMealResult = await mealDBService.getRandomMeal();
      if (randomMealResult.status === 'success') {
        suggestedMeal = randomMealResult.data;
      }
    }

    const confidence = this.calculatePlaylistPairingConfidence(detectedGenre, suggestedCuisines);

    return {
      playlist,
      detectedGenre,
      suggestedCuisines,
      suggestedMeal,
      confidence,
    };
  }

  // Get multiple meal suggestions for a genre
  async getMultipleMealSuggestions(genre: string, count: number = 3): Promise<Meal[]> {
    const cuisines = cuisineMapper.getCuisinesForGenre(genre);
    const meals: Meal[] = [];

    for (const cuisine of cuisines.slice(0, count)) {
      const result = await mealDBService.getMealsByCuisine(cuisine);
      if (result.status === 'success' && result.data.length > 0) {
        const randomMeal = result.data[Math.floor(Math.random() * result.data.length)];
        if (randomMeal) {
          meals.push(randomMeal);
        }
      }
    }

    // Fill remaining slots with random meals if needed
    while (meals.length < count) {
      const randomResult = await mealDBService.getRandomMeal();
      if (randomResult.status === 'success' && randomResult.data) {
        meals.push(randomResult.data);
      } else {
        break;
      }
    }

    return meals;
  }

  // Calculate confidence for meal-to-playlist pairing
  private calculateMealPairingConfidence(meal: Meal): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence for well-known cuisines
    const knownCuisines = cuisineMapper.getAllCuisines();
    if (knownCuisines.includes(meal.cuisine)) {
      confidence += 0.3;
    }

    // Higher confidence if meal has tags that might indicate mood/style
    const moodTags = ['spicy', 'comfort', 'fresh', 'hearty', 'light'];
    const hasMoodTags = meal.tags.some((tag) =>
      moodTags.some((moodTag) => tag.toLowerCase().includes(moodTag))
    );

    if (hasMoodTags) {
      confidence += 0.1;
    }

    // Higher confidence for popular meal categories
    const popularCategories = ['Chicken', 'Beef', 'Pasta', 'Seafood'];
    if (popularCategories.includes(meal.category)) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  // Calculate confidence for playlist-to-meal pairing
  private calculatePlaylistPairingConfidence(genre: string, suggestedCuisines: string[]): number {
    let confidence = 0.3; // Lower base confidence for reverse mapping

    // Higher confidence for well-defined genres
    const wellDefinedGenres = ['jazz', 'classical', 'reggae', 'latin', 'indian'];
    if (wellDefinedGenres.some((g) => genre.toLowerCase().includes(g))) {
      confidence += 0.4;
    }

    // Higher confidence if we have multiple cuisine options
    if (suggestedCuisines.length > 1) {
      confidence += 0.2;
    }

    // Lower confidence for vague genres
    const vagueGenres = ['pop', 'rock', 'electronic'];
    if (vagueGenres.some((g) => genre.toLowerCase().includes(g))) {
      confidence -= 0.1;
    }

    return Math.max(Math.min(confidence, 1.0), 0.1);
  }
}

export const pairingLogic = new PairingLogic();
