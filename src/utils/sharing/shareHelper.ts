import { Share } from 'react-native';
import type { PairingRecommendation } from '@app-types/pairing';
import type { SavedPairing } from '@app-types/pairing';
import { APP_CONFIG } from '@utils/constants';

class ShareHelper {
  // Share a meal-to-playlist pairing
  async shareMealPairing(pairing: PairingRecommendation): Promise<boolean> {
    try {
      const message = this.formatMealPairingMessage(pairing);

      const result = await Share.share({
        message,
        title: `Perfect Pairing from ${APP_CONFIG.name}`,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing meal pairing:', error);
      return false;
    }
  }

  // Share a playlist-to-meal pairing
  async sharePlaylistPairing(
    playlistName: string,
    mealName: string,
    cuisine: string
  ): Promise<boolean> {
    try {
      const message = this.formatPlaylistPairingMessage(playlistName, mealName, cuisine);

      const result = await Share.share({
        message,
        title: `Perfect Pairing from ${APP_CONFIG.name}`,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing playlist pairing:', error);
      return false;
    }
  }

  // Share a saved pairing
  async shareSavedPairing(pairing: SavedPairing): Promise<boolean> {
    try {
      const message = this.formatSavedPairingMessage(pairing);

      const result = await Share.share({
        message,
        title: `My Favorite Pairing from ${APP_CONFIG.name}`,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing saved pairing:', error);
      return false;
    }
  }

  // Share app recommendation
  async shareApp(): Promise<boolean> {
    try {
      const message = `Check out ${APP_CONFIG.name}! 🍽️🎵\n\nDiscover the perfect music for your meals and find new recipes through your favorite playlists. It's like having a personal DJ and chef in one app!\n\nDownload it now and start pairing your food with music! 🎶✨`;

      const result = await Share.share({
        message,
        title: `Try ${APP_CONFIG.name}!`,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing app:', error);
      return false;
    }
  }

  // Format meal pairing message
  private formatMealPairingMessage(pairing: PairingRecommendation): string {
    const emojis = this.getCuisineEmoji(pairing.cuisine);

    return `Tonight's perfect pairing from ${APP_CONFIG.name}! ${emojis.food}🎵

${emojis.flag} ${pairing.meal.name} + ${pairing.playlist.name}

The ${pairing.cuisine} flavors pair beautifully with ${pairing.playlist.genre} vibes. ${Math.round(pairing.confidence * 100)}% match!

Try ${APP_CONFIG.name} to discover your own perfect food + music combinations! ✨`;
  }

  // Format playlist pairing message
  private formatPlaylistPairingMessage(
    playlistName: string,
    mealName: string,
    cuisine: string
  ): string {
    const emojis = this.getCuisineEmoji(cuisine);

    return `My playlist just inspired dinner! ${emojis.food}🎵

🎧 "${playlistName}" → ${emojis.flag} ${mealName}

${APP_CONFIG.name} suggested this ${cuisine} dish based on my music taste. Time to cook and vibe! 🍳✨

Get recipe ideas from your playlists with ${APP_CONFIG.name}!`;
  }

  // Format saved pairing message
  private formatSavedPairingMessage(pairing: SavedPairing): string {
    const emojis = this.getCuisineEmoji(pairing.cuisine);

    return `One of my favorite pairings from ${APP_CONFIG.name}! ${emojis.food}🎵

${emojis.flag} ${pairing.meal_name} + "${pairing.playlist_name}"

This combo never fails to hit the right mood. Food and music just make everything better! 😋🎶

Discover your perfect pairings with ${APP_CONFIG.name}! ✨`;
  }

  // Get appropriate emojis for cuisines
  private getCuisineEmoji(cuisine: string): { food: string; flag: string } {
    const emojiMap: Record<string, { food: string; flag: string }> = {
      Italian: { food: '🍝', flag: '🇮🇹' },
      Chinese: { food: '🥢', flag: '🇨🇳' },
      Japanese: { food: '🍜', flag: '🇯🇵' },
      Mexican: { food: '🌮', flag: '🇲🇽' },
      Indian: { food: '🍛', flag: '🇮🇳' },
      French: { food: '🥐', flag: '🇫🇷' },
      Thai: { food: '🍲', flag: '🇹🇭' },
      American: { food: '🍔', flag: '🇺🇸' },
      British: { food: '🫖', flag: '🇬🇧' },
      Greek: { food: '🫒', flag: '🇬🇷' },
      Spanish: { food: '🥘', flag: '🇪🇸' },
      Korean: { food: '🍱', flag: '🇰🇷' },
      Lebanese: { food: '🥙', flag: '🇱🇧' },
      Turkish: { food: '🥙', flag: '🇹🇷' },
      Vietnamese: { food: '🍜', flag: '🇻🇳' },
      Moroccan: { food: '🍲', flag: '🇲🇦' },
      Brazilian: { food: '🥩', flag: '🇧🇷' },
    };

    return emojiMap[cuisine] || { food: '🍽️', flag: '🌍' };
  }

  // Share with custom message
  async shareCustomMessage(message: string, title?: string): Promise<boolean> {
    try {
      const result = await Share.share({
        message,
        title: title || `Shared from ${APP_CONFIG.name}`,
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing custom message:', error);
      return false;
    }
  }
}

export const shareHelper = new ShareHelper();
