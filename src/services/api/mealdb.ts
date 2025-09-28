import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/constants';
import type { ApiResponse } from '../../types';

// MealDB API Response Types
export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

export interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

// Processed meal type for our app
export interface Meal {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  instructions: string;
  image: string;
  tags: string[];
  ingredients: Array<{
    name: string;
    measure: string;
  }>;
  youtubeUrl?: string;
  sourceUrl?: string;
}

class MealDBService {
  private baseURL = API_ENDPOINTS.MEALDB_BASE;

  // Search meals by name
  async searchMealsByName(query: string): Promise<ApiResponse<Meal[]>> {
    try {
      const response = await axios.get<MealDBResponse>(`${this.baseURL}/search.php?s=${encodeURIComponent(query)}`);
      
      if (!response.data.meals) {
        return {
          data: [],
          status: 'success'
        };
      }

      const meals = response.data.meals.map(meal => this.processMeal(meal));
      return {
        data: meals,
        status: 'success'
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to search meals',
        status: 'error'
      };
    }
  }

  // Get meal by ID
  async getMealById(id: string): Promise<ApiResponse<Meal | null>> {
    try {
      const response = await axios.get<MealDBResponse>(`${this.baseURL}/lookup.php?i=${id}`);
      
      if (!response.data.meals || response.data.meals.length === 0) {
        return {
          data: null,
          status: 'success'
        };
      }

      const mealData = response.data.meals[0];
      if (!mealData) {
        return {
          data: null,
          status: 'success'
        };
      }

      const meal = this.processMeal(mealData);
      return {
        data: meal,
        status: 'success'
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to fetch meal',
        status: 'error'
      };
    }
  }

  // Get random meal
  async getRandomMeal(): Promise<ApiResponse<Meal | null>> {
    try {
      const response = await axios.get<MealDBResponse>(`${this.baseURL}/random.php`);
      
      if (!response.data.meals || response.data.meals.length === 0) {
        return {
          data: null,
          status: 'success'
        };
      }

      const mealData = response.data.meals[0];
      if (!mealData) {
        return {
          data: null,
          status: 'success'
        };
      }

      const meal = this.processMeal(mealData);
      return {
        data: meal,
        status: 'success'
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to fetch random meal',
        status: 'error'
      };
    }
  }

  // Get meals by cuisine
  async getMealsByCuisine(cuisine: string): Promise<ApiResponse<Meal[]>> {
    try {
      const response = await axios.get<MealDBResponse>(`${this.baseURL}/filter.php?a=${encodeURIComponent(cuisine)}`);
      
      if (!response.data.meals) {
        return {
          data: [],
          status: 'success'
        };
      }

      // Note: filter endpoint returns limited data, so we need to fetch full details for each meal
      const mealPromises = response.data.meals.slice(0, 10).map(meal =>
        this.getMealById(meal.idMeal)
      );

      const mealResults = await Promise.all(mealPromises);
      const meals = mealResults
        .filter(result => result.data !== null)
        .map(result => result.data as Meal);

      return {
        data: meals,
        status: 'success'
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch meals by cuisine',
        status: 'error'
      };
    }
  }

  // Get multiple random meals (for featured meals)
  async getRandomMeals(count: number = 5): Promise<ApiResponse<Meal[]>> {
    try {
      const randomPromises = Array.from({ length: count }, () => this.getRandomMeal());
      const randomResults = await Promise.all(randomPromises);
      
      const meals = randomResults
        .filter(result => result.data !== null)
        .map(result => result.data as Meal);

      return {
        data: meals,
        status: 'success'
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch random meals',
        status: 'error'
      };
    }
  }

  // Get all available cuisines
  async getAllCuisines(): Promise<ApiResponse<string[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/list.php?a=list`);
      const cuisines = response.data.meals?.map((item: any) => item.strArea) || [];
      
      return {
        data: cuisines,
        status: 'success'
      };
    } catch (error) {
      return {
        data: [],
        error: 'Failed to fetch cuisines',
        status: 'error'
      };
    }
  }

  // Process raw MealDB response to our Meal format
  private processMeal(mealData: MealDBMeal): Meal {
    // Extract ingredients and measures
    const ingredients: Array<{ name: string; measure: string }> = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}` as keyof MealDBMeal] as string;
      const measure = mealData[`strMeasure${i}` as keyof MealDBMeal] as string;
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }

    return {
      id: mealData.idMeal,
      name: mealData.strMeal,
      category: mealData.strCategory,
      cuisine: mealData.strArea,
      instructions: mealData.strInstructions,
      image: mealData.strMealThumb,
      tags: mealData.strTags ? mealData.strTags.split(',').map(tag => tag.trim()) : [],
      ingredients,
      youtubeUrl: mealData.strYoutube || undefined,
      sourceUrl: mealData.strSource || undefined,
    } as Meal;
  }
}

export const mealDBService = new MealDBService();
