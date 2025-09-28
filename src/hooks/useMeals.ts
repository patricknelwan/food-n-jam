import { useState, useCallback } from 'react';
import { mealDBService } from '@services/api/mealdb';
import type { Meal, MealSearchState } from '../types/meal';

export const useMeals = () => {
  const [searchState, setSearchState] = useState<MealSearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);

  // Search meals by name
  const searchMeals = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, query: '', results: [], hasSearched: false }));
      return;
    }

    setSearchState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      query: query.trim() 
    }));

    try {
      const result = await mealDBService.searchMealsByName(query.trim());
      
      if (result.status === 'success') {
        setSearchState(prev => ({
          ...prev,
          results: result.data,
          isLoading: false,
          hasSearched: true,
        }));
      } else {
        setSearchState(prev => ({
          ...prev,
          error: result.error || 'Search failed',
          isLoading: false,
          hasSearched: true,
        }));
      }
    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        error: 'Network error occurred',
        isLoading: false,
        hasSearched: true,
      }));
    }
  }, []);

  // Get meal by ID
  const getMealById = useCallback(async (id: string): Promise<Meal | null> => {
    try {
      const result = await mealDBService.getMealById(id);
      return result.status === 'success' ? result.data : null;
    } catch {
      return null;
    }
  }, []);

  // Load featured/random meals for home screen
  const loadFeaturedMeals = useCallback(async () => {
    setIsLoadingFeatured(true);
    
    try {
      // Get multiple random meals
      const promises = Array(6).fill(null).map(() => mealDBService.getRandomMeal());
      const results = await Promise.all(promises);
      
      const meals = results
        .filter(result => result.status === 'success' && result.data)
        .map(result => result.data!)
        .slice(0, 4); // Take first 4 successful results

      setFeaturedMeals(meals);
    } catch (error) {
      console.error('Failed to load featured meals:', error);
    } finally {
      setIsLoadingFeatured(false);
    }
  }, []);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false,
    });
  }, []);

  return {
    // Search state
    searchState,
    searchMeals,
    clearSearch,
    
    // Individual meal
    getMealById,
    
    // Featured meals
    featuredMeals,
    isLoadingFeatured,
    loadFeaturedMeals,
  };
};
