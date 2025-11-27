import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@utils/constants';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheService {
  // Default cache duration (15 minutes)
  private defaultTTL = 15 * 60 * 1000;

  // Set cache item with expiration
  async set<T>(key: string, data: T, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: ttl,
      };

      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error(`Failed to cache data for key ${key}:`, error);
    }
  }

  // Get cache item if not expired
  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);

      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      const now = Date.now();

      // Check if expired
      if (now - cacheItem.timestamp > cacheItem.expiresIn) {
        await this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`Failed to get cached data for key ${key}:`, error);
      return null;
    }
  }

  // Remove cache item
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove cached data for key ${key}:`, error);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Check if cache item exists and is valid
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  // Get cache item age in milliseconds
  async getAge(key: string): Promise<number | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);

      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<any> = JSON.parse(cachedData);
      return Date.now() - cacheItem.timestamp;
    } catch (error) {
      console.error(`Failed to get cache age for key ${key}:`, error);
      return null;
    }
  }

  // Cached meal search results
  async cacheMealSearch(query: string, results: any[]): Promise<void> {
    const key = `${STORAGE_KEYS.CACHED_MEALS}_search_${query}`;
    await this.set(key, results, 10 * 60 * 1000); // 10 minutes
  }

  async getCachedMealSearch(query: string): Promise<any[] | null> {
    const key = `${STORAGE_KEYS.CACHED_MEALS}_search_${query}`;
    return await this.get(key);
  }

  // Cached user playlists
  async cacheUserPlaylists(playlists: any[]): Promise<void> {
    await this.set(STORAGE_KEYS.CACHED_PLAYLISTS, playlists, 5 * 60 * 1000); // 5 minutes
  }

  async getCachedUserPlaylists(): Promise<any[] | null> {
    return await this.get(STORAGE_KEYS.CACHED_PLAYLISTS);
  }

  // Cached meal details
  async cacheMealDetails(mealId: string, meal: any): Promise<void> {
    const key = `${STORAGE_KEYS.CACHED_MEALS}_detail_${mealId}`;
    await this.set(key, meal, 30 * 60 * 1000); // 30 minutes
  }

  async getCachedMealDetails(mealId: string): Promise<any | null> {
    const key = `${STORAGE_KEYS.CACHED_MEALS}_detail_${mealId}`;
    return await this.get(key);
  }

  // Cached genre detection results
  async cacheGenreDetection(playlistId: string, detection: any): Promise<void> {
    const key = `cache_genre_${playlistId}`;
    await this.set(key, detection, 60 * 60 * 1000); // 1 hour
  }

  async getCachedGenreDetection(playlistId: string): Promise<any | null> {
    const key = `cache_genre_${playlistId}`;
    return await this.get(key);
  }

  // Cache statistics
  async getCacheStats(): Promise<{
    totalItems: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (key) =>
          key.startsWith('cache_') ||
          Object.values(STORAGE_KEYS).some((storageKey) => key.startsWith(storageKey))
      );

      if (cacheKeys.length === 0) {
        return { totalItems: 0, oldestItem: null, newestItem: null };
      }

      const ages = await Promise.all(cacheKeys.map((key) => this.getAge(key)));

      const validAges = ages.filter((age) => age !== null) as number[];

      return {
        totalItems: cacheKeys.length,
        oldestItem: validAges.length > 0 ? Math.max(...validAges) : null,
        newestItem: validAges.length > 0 ? Math.min(...validAges) : null,
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return { totalItems: 0, oldestItem: null, newestItem: null };
    }
  }

  // Clean expired cache items
  async cleanExpired(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (key) =>
          key.startsWith('cache_') ||
          Object.values(STORAGE_KEYS).some((storageKey) => key.startsWith(storageKey))
      );

      let cleanedCount = 0;

      for (const key of cacheKeys) {
        const data = await this.get(key);
        if (data === null) {
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Failed to clean expired cache:', error);
      return 0;
    }
  }
}

export const cacheService = new CacheService();
