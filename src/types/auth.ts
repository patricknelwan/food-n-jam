export interface User {
  id: string;
  email?: string;
  spotify_id: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SpotifyTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface AuthSession {
  user: User | null;
  tokens: SpotifyTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

export type AuthState = 'loading' | 'authenticated' | 'unauthenticated' | 'error';
