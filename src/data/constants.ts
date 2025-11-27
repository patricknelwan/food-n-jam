// Cuisine and genre mappings
export const CUISINE_ALIASES: Record<string, string> = {
  British: 'British',
  American: 'American',
  Chinese: 'Chinese',
  Thai: 'Thai',
  Japanese: 'Japanese',
  Indian: 'Indian',
  French: 'French',
  Italian: 'Italian',
  Mexican: 'Mexican',
  Spanish: 'Spanish',
  Greek: 'Greek',
  Turkish: 'Turkish',
  Moroccan: 'Moroccan',
  Lebanese: 'Lebanese',
  Vietnamese: 'Vietnamese',
  Korean: 'Korean',
};

// Spotify genre mappings for reverse lookup
export const GENRE_TO_CUISINE: Record<string, string[]> = {
  rock: ['American', 'British'],
  pop: ['American', 'British', 'Thai', 'Malaysian', 'Vietnamese'],
  indie: ['British', 'Canadian'],
  chill: ['Chinese', 'Japanese'],
  lofi: ['Chinese', 'Japanese'],
  jazz: ['French', 'Italian'],
  classical: ['Italian', 'Russian'],
  latin: ['Mexican', 'Spanish', 'Portuguese'],
  reggae: ['Jamaican', 'Filipino'],
  reggaeton: ['Mexican'],
  'world-music': ['Egyptian', 'Greek', 'Moroccan', 'Turkish', 'Croatian', 'Tunisian'],
  folk: ['Irish', 'Polish', 'Ukrainian'],
  house: ['Dutch'],
  electronic: ['Dutch'],
  bollywood: ['Indian'],
  indian: ['Indian'],
  'j-pop': ['Japanese'],
  afrobeat: ['Kenyan'],
  bossanova: ['Portuguese'],
  ambient: ['Unknown'],
};

// Default playlist recommendations
export const DEFAULT_PLAYLISTS: Record<string, string> = {
  cooking: 'Cooking Vibes',
  dinner: 'Dinner Party',
  breakfast: 'Morning Coffee',
  lunch: 'Afternoon Chill',
  dessert: 'Sweet Treats',
};

// Popular cuisines for quick access
export const POPULAR_CUISINES = [
  'Italian',
  'Chinese',
  'Mexican',
  'Japanese',
  'Indian',
  'French',
  'Thai',
  'American',
];

// Meal categories
export const MEAL_CATEGORIES = [
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
];
