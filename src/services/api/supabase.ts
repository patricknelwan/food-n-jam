import { createClient } from '@supabase/supabase-js';
import {
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
} from '@env';

// Debug: Log the environment variables (remove after testing)
console.log('🔧 Supabase Environment Check:');
console.log('📍 URL:', EXPO_PUBLIC_SUPABASE_URL);
console.log('🔑 Key (first 20 chars):', EXPO_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: undefined, // We'll use expo-secure-store
      autoRefreshToken: false, // We handle auth manually
      persistSession: false, // We handle sessions manually  
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    },
  }
);

// Database types (same as before)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          spotify_id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          country: string | null;
          followers_count: number;
          premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          spotify_id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          followers_count?: number;
          premium?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          spotify_id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          country?: string | null;
          followers_count?: number;
          premium?: boolean;
          updated_at?: string;
        };
      };
      pairings: {
        Row: {
          id: string;
          user_id: string;
          meal_name: string;
          meal_id: string | null;
          cuisine: string | null;
          category: string | null;
          meal_image_url: string | null;
          playlist_id: string;
          playlist_name: string;
          playlist_description: string | null;
          playlist_image_url: string | null;
          playlist_tracks_total: number;
          is_favorite: boolean;
          pairing_score: number | null;
          tags: string[] | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_name: string;
          meal_id?: string | null;
          cuisine?: string | null;
          category?: string | null;
          meal_image_url?: string | null;
          playlist_id: string;
          playlist_name: string;
          playlist_description?: string | null;
          playlist_image_url?: string | null;
          playlist_tracks_total?: number;
          is_favorite?: boolean;
          pairing_score?: number | null;
          tags?: string[] | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_name?: string;
          meal_id?: string | null;
          cuisine?: string | null;
          category?: string | null;
          meal_image_url?: string | null;
          playlist_id?: string;
          playlist_name?: string;
          playlist_description?: string | null;
          playlist_image_url?: string | null;
          playlist_tracks_total?: number;
          is_favorite?: boolean;
          pairing_score?: number | null;
          tags?: string[] | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
