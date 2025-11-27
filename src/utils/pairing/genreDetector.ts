import { spotifyService } from '@services/api/spotify';
import type { SpotifyGenreDetection, SpotifyPlaylist, SpotifyTrack } from '@app-types/spotify';

class GenreDetector {
  // Primary method: Detect genre from playlist
  async detectPlaylistGenre(playlist: SpotifyPlaylist): Promise<SpotifyGenreDetection> {
    // Method 1: Try to detect from playlist name
    const nameGenre = this.detectFromPlaylistName(playlist.name);
    if (nameGenre.confidence > 0.7) {
      return nameGenre;
    }

    // Method 2: Analyze tracks and audio features
    const tracksGenre = await this.detectFromTracks(playlist.id);
    if (tracksGenre.confidence > 0.6) {
      return tracksGenre;
    }

    // Method 3: Return the better of the two with adjusted confidence
    return nameGenre.confidence > tracksGenre.confidence ? nameGenre : tracksGenre;
  }

  // Detect genre from playlist name using keywords
  private detectFromPlaylistName(playlistName: string): SpotifyGenreDetection {
    const name = playlistName.toLowerCase();

    const genreKeywords = {
      latin: ['latin', 'latino', 'salsa', 'bachata', 'merengue', 'reggaeton', 'spanish'],
      reggae: ['reggae', 'jamaica', 'bob marley', 'rastafari'],
      jazz: ['jazz', 'blues', 'swing', 'bebop', 'smooth', 'café'],
      classical: ['classical', 'orchestra', 'symphony', 'opera', 'baroque', 'piano'],
      rock: ['rock', 'metal', 'punk', 'alternative', 'indie rock'],
      pop: ['pop', 'hits', 'chart', 'mainstream', 'radio'],
      'hip-hop': ['hip hop', 'rap', 'hiphop', 'trap', 'drill'],
      electronic: ['electronic', 'edm', 'techno', 'house', 'trance', 'dubstep'],
      country: ['country', 'folk', 'bluegrass', 'americana'],
      'r&b': ['r&b', 'rnb', 'soul', 'funk', 'motown'],
      indie: ['indie', 'alternative', 'hipster', 'underground'],
      chill: ['chill', 'lofi', 'ambient', 'relax', 'study', 'sleep'],
      'world-music': ['world', 'ethnic', 'traditional', 'cultural'],
    };

    let bestMatch = { genre: 'pop', confidence: 0.3 }; // Default fallback

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      for (const keyword of keywords) {
        if (name.includes(keyword)) {
          const confidence = this.calculateKeywordConfidence(keyword, name);
          if (confidence > bestMatch.confidence) {
            bestMatch = { genre, confidence };
          }
        }
      }
    }

    return {
      detectedGenre: bestMatch.genre,
      confidence: bestMatch.confidence,
      method: 'playlist_name',
      details: { playlistName, matchedKeywords: bestMatch },
    };
  }

  // Detect genre from tracks using audio features
  private async detectFromTracks(playlistId: string): Promise<SpotifyGenreDetection> {
    try {
      // Get playlist tracks
      const tracksResult = await spotifyService.getPlaylistTracks(playlistId);
      if (tracksResult.status !== 'success' || tracksResult.data.length === 0) {
        return this.getFallbackGenre('No tracks available');
      }

      const tracks = tracksResult.data.slice(0, 20); // Analyze first 20 tracks
      const trackIds = tracks.map((track) => track.id);

      // Get audio features
      const featuresResult = await spotifyService.getAudioFeatures(trackIds);
      if (featuresResult.status !== 'success' || featuresResult.data.length === 0) {
        return this.getFallbackGenre('No audio features available');
      }

      const audioFeatures = featuresResult.data;
      const genre = this.analyzeAudioFeatures(audioFeatures);

      return {
        detectedGenre: genre.genre,
        confidence: genre.confidence,
        method: 'audio_features',
        details: {
          tracksAnalyzed: audioFeatures.length,
          averageFeatures: genre.averageFeatures,
        },
      };
    } catch (error) {
      return this.getFallbackGenre('Error analyzing tracks');
    }
  }

  // Analyze audio features to determine genre
  private analyzeAudioFeatures(features: any[]) {
    const avg = {
      danceability: features.reduce((sum, f) => sum + f.danceability, 0) / features.length,
      energy: features.reduce((sum, f) => sum + f.energy, 0) / features.length,
      valence: features.reduce((sum, f) => sum + f.valence, 0) / features.length,
      acousticness: features.reduce((sum, f) => sum + f.acousticness, 0) / features.length,
      instrumentalness: features.reduce((sum, f) => sum + f.instrumentalness, 0) / features.length,
      tempo: features.reduce((sum, f) => sum + f.tempo, 0) / features.length,
    };

    let genre = 'pop';
    let confidence = 0.4;

    // Genre classification based on audio features
    if (avg.energy > 0.8 && avg.danceability > 0.7 && avg.tempo > 120) {
      genre = 'electronic';
      confidence = 0.7;
    } else if (avg.acousticness > 0.6 && avg.energy < 0.5) {
      genre = 'folk';
      confidence = 0.6;
    } else if (avg.instrumentalness > 0.5) {
      genre = 'ambient';
      confidence = 0.6;
    } else if (avg.danceability > 0.8 && avg.valence > 0.7) {
      genre = 'latin';
      confidence = 0.6;
    } else if (avg.energy > 0.7 && avg.valence < 0.5) {
      genre = 'rock';
      confidence = 0.5;
    } else if (avg.acousticness > 0.4 && avg.valence > 0.6) {
      genre = 'indie';
      confidence = 0.5;
    }

    return {
      genre,
      confidence,
      averageFeatures: avg,
    };
  }

  // Calculate confidence based on keyword matching
  private calculateKeywordConfidence(keyword: string, name: string): number {
    let confidence = 0.5; // Base confidence

    // Exact word match gets higher confidence
    const words = name.split(/\s+/);
    if (words.includes(keyword)) {
      confidence += 0.3;
    }

    // Beginning of name gets higher confidence
    if (name.startsWith(keyword)) {
      confidence += 0.2;
    }

    // Shorter keywords in longer names get less confidence
    if (keyword.length < 4 && name.length > 20) {
      confidence -= 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  // Fallback genre when detection fails
  private getFallbackGenre(reason: string): SpotifyGenreDetection {
    return {
      detectedGenre: 'pop',
      confidence: 0.2,
      method: 'fallback',
      details: { reason },
    };
  }

  // Get multiple possible genres for a playlist
  async getGenreSuggestions(playlist: SpotifyPlaylist): Promise<string[]> {
    const detection = await this.detectPlaylistGenre(playlist);
    const suggestions = [detection.detectedGenre];

    // Add related genres based on the detected one
    const relatedGenres: Record<string, string[]> = {
      latin: ['reggaeton', 'salsa', 'pop'],
      reggae: ['caribbean', 'world-music', 'chill'],
      jazz: ['blues', 'soul', 'classical'],
      rock: ['alternative', 'indie', 'metal'],
      pop: ['indie', 'electronic', 'r&b'],
      electronic: ['house', 'ambient', 'pop'],
      chill: ['ambient', 'indie', 'jazz'],
    };

    const related = relatedGenres[detection.detectedGenre] || [];
    suggestions.push(...related.slice(0, 2));

    return [...new Set(suggestions)]; // Remove duplicates
  }
}

export const genreDetector = new GenreDetector();
