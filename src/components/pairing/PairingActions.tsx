import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View } from 'react-native-ui-lib';
import { AppButton } from '@components/common/AppButton';
import { shareHelper } from '@utils/sharing/shareHelper';
import { useFavorites } from '@hooks/useFavorites';
import type { PairingRecommendation } from '../../types/pairing';
import type { CreatePairingData } from '@services/storage/FavoritesService';
import { UI_CONSTANTS } from '@utils/constants';

interface PairingActionsProps {
  pairing: PairingRecommendation;
  onOpenSpotify?: () => void;
  onViewRecipe?: () => void;
  layout?: 'vertical' | 'horizontal';
  playlistId?: string;
  playlistImage?: string;
}

export const PairingActions: React.FC<PairingActionsProps> = ({
  pairing,
  onOpenSpotify,
  onViewRecipe,
  layout = 'vertical',
  playlistId,
  playlistImage,
}) => {
  const { savePairing, checkPairingExists } = useFavorites();
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if pairing is already saved on mount
  React.useEffect(() => {
    if (playlistId) {
      checkIfSaved();
    }
  }, [pairing.meal.name, playlistId]);

  const checkIfSaved = async () => {
    if (playlistId) {
      const exists = await checkPairingExists(pairing.meal.name, playlistId);
      setIsSaved(exists);
    }
  };

  const handleSavePairing = async () => {
    if (!playlistId) {
      Alert.alert('Error', 'Unable to save pairing - missing playlist information');
      return;
    }

    setIsSaving(true);

    try {
      const pairingData: CreatePairingData = {
        meal_name: pairing.meal.name,
        cuisine: pairing.cuisine,
        playlist_id: playlistId,
        playlist_name: pairing.playlist.name,
        meal_id: pairing.meal.id,
        meal_image: pairing.meal.image,
        playlist_image: playlistImage,
      };

      const success = await savePairing(pairingData);
      
      if (success) {
        setIsSaved(true);
        Alert.alert(
          'Saved! ❤️',
          `Your pairing of ${pairing.meal.name} + ${pairing.playlist.name} has been added to favorites!`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save pairing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePairing = async () => {
    setIsSharing(true);

    try {
      const success = await shareHelper.shareMealPairing(pairing);
      
      if (success) {
        // Optional: Track sharing analytics here
        console.log('Pairing shared successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share pairing. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleOpenSpotify = () => {
    // For now, show an alert. In a real app, this would deep link to Spotify
    Alert.alert(
      'Open in Spotify',
      `Search for "${pairing.playlist.name}" playlist in Spotify to listen to this perfect pairing!`,
      [
        { text: 'OK' },
        { 
          text: 'Open Spotify', 
          onPress: () => {
            // TODO: Implement deep linking to Spotify
            // Linking.openURL(`spotify:search:${encodeURIComponent(pairing.playlist.name)}`);
            onOpenSpotify?.();
          }
        }
      ]
    );
  };

  const containerStyle = layout === 'horizontal' 
    ? styles.horizontalContainer 
    : styles.verticalContainer;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Primary Action */}
      {onViewRecipe ? (
        <AppButton
          label="📖 View Full Recipe"
          onPress={onViewRecipe}
          variant="primary"
          size="large"
          style={layout === 'horizontal' ? styles.flexButton : styles.fullButton}
        />
      ) : (
        <AppButton
          label="🎧 Listen on Spotify"
          onPress={handleOpenSpotify}
          variant="primary"
          size="large"
          style={layout === 'horizontal' ? styles.flexButton : styles.fullButton}
        />
      )}

      {/* Secondary Actions */}
      <View style={layout === 'horizontal' ? styles.horizontalSecondary : styles.verticalSecondary}>
        <AppButton
          label={isSaved ? "❤️ Saved" : "💾 Save"}
          onPress={handleSavePairing}
          variant={isSaved ? "secondary" : "outline"}
          size="medium"
          disabled={isSaving || isSaved}
          style={layout === 'horizontal' ? styles.secondaryButton : styles.halfButton}
        />
        
        <AppButton
          label={isSharing ? "📤 Sharing..." : "📤 Share"}
          onPress={handleSharePairing}
          variant="outline"
          size="medium"
          disabled={isSharing}
          style={layout === 'horizontal' ? styles.secondaryButton : styles.halfButton}
        />
      </View>

      {/* Additional Action for Recipe View */}
      {onViewRecipe && (
        <AppButton
          label="🎧 Listen on Spotify"
          onPress={handleOpenSpotify}
          variant="secondary"
          size="medium"
          style={layout === 'horizontal' ? styles.flexButton : styles.fullButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: UI_CONSTANTS.SPACING.md,
  },
  
  verticalContainer: {
    flexDirection: 'column',
  },
  
  horizontalContainer: {
    flexDirection: 'column',
  },
  
  fullButton: {
    width: '100%',
  },
  
  flexButton: {
    flex: 1,
  },
  
  verticalSecondary: {
    flexDirection: 'row',
    gap: UI_CONSTANTS.SPACING.md,
  },
  
  horizontalSecondary: {
    flexDirection: 'row',
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  halfButton: {
    flex: 1,
  },
  
  secondaryButton: {
    minWidth: 80,
  },
});
