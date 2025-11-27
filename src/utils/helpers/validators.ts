// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Spotify URL validation
export const isSpotifyUrl = (url: string): boolean => {
  return url.includes('spotify.com') || url.startsWith('spotify:');
};

// Text length validation
export const isValidLength = (text: string, min: number, max: number): boolean => {
  const length = text.trim().length;
  return length >= min && length <= max;
};

// Required field validation
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Playlist name validation
export const isValidPlaylistName = (name: string): boolean => {
  return isValidLength(name, 1, 100) && isRequired(name);
};

// Meal name validation
export const isValidMealName = (name: string): boolean => {
  return isValidLength(name, 1, 150) && isRequired(name);
};

// Cuisine validation
export const isValidCuisine = (cuisine: string): boolean => {
  return isValidLength(cuisine, 1, 50) && isRequired(cuisine);
};

// Search query validation
export const isValidSearchQuery = (query: string): boolean => {
  return isValidLength(query, 2, 100);
};

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Comprehensive validation functions
export const validateEmail = (email: string): ValidationResult => {
  if (!isRequired(email)) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

export const validatePlaylistName = (name: string): ValidationResult => {
  if (!isRequired(name)) {
    return { isValid: false, error: 'Playlist name is required' };
  }

  if (!isValidLength(name, 1, 100)) {
    return { isValid: false, error: 'Playlist name must be between 1 and 100 characters' };
  }

  return { isValid: true };
};

export const validateMealName = (name: string): ValidationResult => {
  if (!isRequired(name)) {
    return { isValid: false, error: 'Meal name is required' };
  }

  if (!isValidLength(name, 1, 150)) {
    return { isValid: false, error: 'Meal name must be between 1 and 150 characters' };
  }

  return { isValid: true };
};

export const validateSearchQuery = (query: string): ValidationResult => {
  if (!isRequired(query)) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }

  if (!isValidLength(query, 2, 100)) {
    return { isValid: false, error: 'Search query must be between 2 and 100 characters' };
  }

  return { isValid: true };
};
