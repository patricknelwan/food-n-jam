import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack Navigation
export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
};

// Main Tab Navigation  
export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Meal Flow Stack
export type MealStackParamList = {
  MealSearch: undefined;
  MealDetail: {
    mealId: string;
    mealName: string;
  };
};

// Playlist Flow Stack
export type PlaylistStackParamList = {
  PlaylistList: undefined;
  PlaylistDetail: {
    playlistId: string;
    playlistName: string;
  };
};

// Root Navigation
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  MealFlow: NavigatorScreenParams<MealStackParamList>;
  PlaylistFlow: NavigatorScreenParams<PlaylistStackParamList>;
};

// Screen Props Types
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  StackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

export type MealStackScreenProps<T extends keyof MealStackParamList> = 
  StackScreenProps<MealStackParamList, T>;

export type PlaylistStackScreenProps<T extends keyof PlaylistStackParamList> = 
  StackScreenProps<PlaylistStackParamList, T>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
