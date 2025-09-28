// App Configuration
export const APP_CONFIG = {
  name: 'Food n\' Jam',
  version: '1.0.0',
  scheme: 'foodnjam',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  MEALDB_BASE: 'https://www.themealdb.com/api/json/v1/1',
  SPOTIFY_BASE: 'https://api.spotify.com/v1',
  SPOTIFY_ACCOUNTS: 'https://accounts.spotify.com',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  SPOTIFY_TOKENS: 'spotify_tokens',
  CACHED_MEALS: 'cached_meals',
  CACHED_PLAYLISTS: 'cached_playlists',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Authentication
export const AUTH_CONFIG = {
  SPOTIFY_SCOPES: [
    'user-read-private',
    'user-read-email', 
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
  ].join(' '),
  TOKEN_REFRESH_THRESHOLD: 300, // 5 minutes before expiry
} as const;

// UI Constants
export const UI_CONSTANTS = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 80,
  CARD_BORDER_RADIUS: 12,
  BUTTON_BORDER_RADIUS: 8,
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

// Colors (RNUIlib will override these, but good to have defaults)
export const COLORS = {
  primary: '#1DB954', // Spotify Green
  secondary: '#191414', // Spotify Black
  accent: '#FF6B35', // Food Orange
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: {
    primary: '#000000',
    secondary: '#6C757D',
    light: '#FFFFFF',
  },
  error: '#DC3545',
  warning: '#FFC107',
  success: '#28A745',
} as const;

// Animation Durations
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  SPOTIFY_ERROR: 'Spotify connection error.',
  MEAL_FETCH_ERROR: 'Unable to fetch meals. Please try again.',
  GENERIC: 'Something went wrong. Please try again.',
} as const;
