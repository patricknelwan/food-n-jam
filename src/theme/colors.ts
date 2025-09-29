export const colors = {
  // Brand Colors (Spotify-inspired + Food themes)
  primary: '#1DB954',        // Spotify green
  primaryDark: '#1ed760',    // Darker green
  primaryLight: '#1db954',   // Lighter green
  
  secondary: '#FF6B35',      // Food orange
  secondaryDark: '#e55a2b',  // Darker orange
  secondaryLight: '#ff7849', // Lighter orange
  
  accent: '#FFD23F',         // Golden yellow (warmth)
  accentDark: '#e6bd39',
  accentLight: '#ffdd66',

  // Backgrounds
  background: '#f8f9fa',     // Main app background
  surface: '#ffffff',        // Cards, modals
  surfaceVariant: '#f1f3f4', // Alternative surface
  overlay: 'rgba(0,0,0,0.6)', // Modal overlays
  
  // Text Colors
  textPrimary: '#1a1a1a',    // Main text
  textSecondary: '#4a4a4a',  // Secondary text
  textTertiary: '#6b7280',   // Disabled/placeholder text
  textInverse: '#ffffff',    // Text on dark backgrounds
  
  // Interactive States
  interactive: '#007AFF',     // Links, interactive elements
  interactiveHover: '#0056CC',
  interactivePressed: '#004499',
  
  // Status Colors
  success: '#22c55e',        // Success states
  successLight: '#dcfce7',   // Success backgrounds
  
  warning: '#f59e0b',        // Warning states
  warningLight: '#fef3c7',   // Warning backgrounds
  
  error: '#ef4444',          // Error states
  errorLight: '#fecaca',     // Error backgrounds
  
  info: '#3b82f6',           // Info states
  infoLight: '#dbeafe',      // Info backgrounds
  
  // Neutral Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Spotify Brand Colors (for music-related elements)
  spotifyGreen: '#1DB954',
  spotifyBlack: '#191414',
  spotifyDarkGray: '#121212',
  spotifyGray: '#535353',
  spotifyLightGray: '#b3b3b3',
  
  // Food Category Colors
  foodRed: '#dc2626',        // Meat, spicy
  foodOrange: '#ea580c',     // Vegetables, warm
  foodYellow: '#d97706',     // Grains, comfort
  foodGreen: '#16a34a',      // Healthy, fresh
  foodBlue: '#2563eb',       // Seafood, cool
  foodPurple: '#7c3aed',     // Desserts, exotic
  foodBrown: '#a16207',      // Coffee, chocolate
  
  // Transparent overlays
  black10: 'rgba(0,0,0,0.1)',
  black20: 'rgba(0,0,0,0.2)',
  black30: 'rgba(0,0,0,0.3)',
  black50: 'rgba(0,0,0,0.5)',
  white10: 'rgba(255,255,255,0.1)',
  white20: 'rgba(255,255,255,0.2)',
  white30: 'rgba(255,255,255,0.3)',
  white50: 'rgba(255,255,255,0.5)',
} as const;

// Type for autocomplete
export type ColorKey = keyof typeof colors;
