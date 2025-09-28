export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image: string;
  trackCount: number;
  owner: string;
  isOwner: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height?: number;
      width?: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
}

export interface SpotifyGenreDetection {
  detectedGenre: string;
  confidence: number;
  method: 'playlist_name' | 'audio_features' | 'artist_genres' | 'fallback';
  details?: any;
}

export interface PlaylistAnalysis {
  playlist: SpotifyPlaylist;
  genreDetection: SpotifyGenreDetection;
  tracks: SpotifyTrack[];
  audioFeatures?: any[];
}
