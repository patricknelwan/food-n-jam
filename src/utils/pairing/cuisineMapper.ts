import cuisineGenreMapping from '@data/cuisineGenreMapping.json';
import { GENRE_TO_CUISINE } from '@data/constants';

export interface CuisineMapping {
  genre: string;
  playlist: string;
  spotifyGenre: string;
}

class CuisineMapper {
  private mapping: Record<string, CuisineMapping> = cuisineGenreMapping;

  // Get genre and playlist recommendation for a cuisine
  getGenreForCuisine(cuisine: string): CuisineMapping | null {
    const normalizedCuisine = this.normalizeCuisine(cuisine);
    return this.mapping[normalizedCuisine] || this.mapping['Unknown'] || null;
  }

  // Get possible cuisines for a genre
  getCuisinesForGenre(genre: string): string[] {
    const normalizedGenre = genre.toLowerCase();

    // Direct match
    if (GENRE_TO_CUISINE[normalizedGenre]) {
      return GENRE_TO_CUISINE[normalizedGenre];
    }

    // Partial match
    const matchingGenres = Object.keys(GENRE_TO_CUISINE).filter(
      (g) => normalizedGenre.includes(g) || g.includes(normalizedGenre)
    );

    const bestMatch = matchingGenres[0];
    if (bestMatch && GENRE_TO_CUISINE[bestMatch]) {
      return GENRE_TO_CUISINE[bestMatch];
    }

    // Fallback to popular cuisines
    return ['Italian', 'Mexican', 'Chinese'];
  }

  // Get all available cuisines
  getAllCuisines(): string[] {
    return Object.keys(this.mapping).filter((cuisine) => cuisine !== 'Unknown');
  }

  // Get all available genres
  getAllGenres(): string[] {
    return Array.from(new Set(Object.values(this.mapping).map((mapping) => mapping.spotifyGenre)));
  }

  // Normalize cuisine name for consistent mapping
  private normalizeCuisine(cuisine: string): string {
    const normalized = cuisine.trim();

    // Handle common variations
    const variations: Record<string, string> = {
      USA: 'American',
      'United States': 'American',
      UK: 'British',
      Britain: 'British',
      England: 'British',
      Korea: 'Korean',
      Lebanon: 'Lebanese',
    };

    return variations[normalized] || normalized;
  }

  // Check if a cuisine is supported
  isSupportedCuisine(cuisine: string): boolean {
    const normalized = this.normalizeCuisine(cuisine);
    return normalized in this.mapping;
  }

  // Get random cuisine-genre pairing
  getRandomPairing(): { cuisine: string; mapping: CuisineMapping } {
    const cuisines = this.getAllCuisines();
    const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];

    if (!randomCuisine) {
      // Fallback if no cuisines found
      return {
        cuisine: 'Italian',
        mapping: this.mapping['Italian']!,
      };
    }

    const mapping = this.mapping[randomCuisine];
    if (!mapping) {
      return {
        cuisine: 'Italian',
        mapping: this.mapping['Italian']!,
      };
    }

    return {
      cuisine: randomCuisine,
      mapping,
    };
  }
}

export const cuisineMapper = new CuisineMapper();
