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

export interface MealSearchFilters {
  cuisine?: string;
  category?: string;
  query?: string;
}

export interface MealSearchState {
  query: string;
  results: Meal[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}
