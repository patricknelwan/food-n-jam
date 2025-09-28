import { createClient } from '@supabase/supabase-js';
import {
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
} from '@env';

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: undefined, // We'll use expo-secure-store
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Database types
export interface Database {
  public: {
    Tables: {
      pairings: {
        Row: {
          id: string;
          user_id: string;
          meal_name: string;
          cuisine: string;
          playlist_id: string;
          playlist_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_name: string;
          cuisine: string;
          playlist_id: string;
          playlist_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_name?: string;
          cuisine?: string;
          playlist_id?: string;
          playlist_name?: string;
          created_at?: string;
        };
      };
    };
  };
}
