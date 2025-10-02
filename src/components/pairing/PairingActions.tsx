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
    console.log('=====================================');
    console.log('DEBUG: PairingActions mounted');
    console.log('DEBUG: playlistId:', playlistId);
    console.log('DEBUG: meal name:', pairing.meal.name);
    console.log('DEBUG: playlist name:', pairing.playlist.name);
    console.log('=====================================');
    
    if (playlistId) {
      checkIfSaved();
    }
  }, [pairing.meal.name, playlistId]);

  const checkIfSaved = async () => {
    console.log('DEBUG: Checking if pairing exists...');
    if (playlistId) {
      try {
        const exists = await checkPairingExists(pairing.meal.name, playlistId);
        console.log('DEBUG: Pairing exists result:', exists);
        setIsSaved(exists);
      } catch (error) {
        console.error('DEBUG: Error checking if pairing exists:', error);
      }
    }
  };

  const handleSavePairing = async () => {
    console.log('=====================================');
    console.log('DEBUG: SAVE BUTTON PRESSED!');
    console.log('DEBUG: Timestamp:', new Date().toISOString());
    console.log('=====================================');
    
    if (!playlistId) {
      console.error('DEBUG: ERROR - No playlistId provided!');
      console.log('DEBUG: playlistId value:', playlistId);
      Alert.alert('Error', 'Unable to save pairing - missing playlist information');
      return;
    }

    console.log('DEBUG: playlistId is available:', playlistId);
    setIsSaving(true);
    console.log('DEBUG: Set isSaving to true');

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

      console.log('=====================================');
      console.log('DEBUG: Pairing data to save:');
      console.log(JSON.stringify(pairingData, null, 2));
      console.log('=====================================');

      console.log('DEBUG: Calling savePairing()...');
      const success = await savePairing(pairingData);
      
      console.log('=====================================');
      console.log('DEBUG: savePairing() returned:', success);
      console.log('DEBUG: Return type:', typeof success);
      console.log('=====================================');

      if (success) {
        console.log('DEBUG: SUCCESS - Pairing saved!');
        setIsSaved(true);
        Alert.alert(
          'Saved!',
          `Your pairing of ${pairing.meal.name} + ${pairing.playlist.name} has been added to favorites!`
        );
      } else {
        console.error('DEBUG: FAILED - savePairing returned false');
        console.log('DEBUG: Check useFavorites hook for error details');
      }
    } catch (error) {
      console.error('=====================================');
      console.error('DEBUG: EXCEPTION in handleSavePairing!');
      console.error('DEBUG: Error type:', typeof error);
      console.error('DEBUG: Error:', error);
      if (error instanceof Error) {
        console.error('DEBUG: Error message:', error.message);
        console.error('DEBUG: Error stack:', error.stack);
      }
      console.error('=====================================');
      Alert.alert('Error', 'Failed to save pairing. Please try again.');
    } finally {
      setIsSaving(false);
      console.log('DEBUG: Set isSaving to false');
      console.log('DEBUG: Save process complete');
      console.log('=====================================');
    }
  };

  const handleSharePairing = async () => {
    setIsSharing(true);
    try {
      const success = await shareHelper.shareMealPairing(pairing);
      if (success) {
        console.log('Pairing shared successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share pairing. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleOpenSpotify = () => {
    Alert.alert(
      'Open in Spotify',
      `Search for "${pairing.playlist.name}" playlist in Spotify to listen to this perfect pairing!`,
      [
        { text: 'OK' },
        {
          text: 'Open Spotify',
          onPress: () => {
            onOpenSpotify?.();
          }
        }
      ]
    );
  };

  const containerStyle = layout === 'horizontal'
    ? styles.horizontalContainer
    : styles.verticalContainer;

  console.log('DEBUG: Rendering - isSaved:', isSaved, 'isSaving:', isSaving);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Primary Action */}
      {onViewRecipe ? (
        <AppButton
          label="View Full Recipe"
          onPress={onViewRecipe}
          variant="primary"
          size="large"
          style={styles.fullButton}
        />
      ) : (
        <AppButton
          label={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
          onPress={handleSavePairing}
          variant={isSaved ? 'secondary' : 'primary'}
          size="large"
          loading={isSaving}
          disabled={isSaved || isSaving}
          style={styles.fullButton}
        />
      )}

      {/* Secondary Actions */}
      <View style={layout === 'horizontal' ? styles.horizontalSecondary : styles.verticalSecondary}>
        <AppButton
          label="Open in Spotify"
          onPress={handleOpenSpotify}
          variant="outline"
          size="medium"
          style={styles.flexButton}
        />
        
        <AppButton
          label="Share"
          onPress={handleSharePairing}
          variant="outline"
          size="medium"
          loading={isSharing}
          style={styles.flexButton}
        />
      </View>

      {/* Additional Action for Recipe View */}
      {onViewRecipe && (
        <AppButton
          label={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
          onPress={handleSavePairing}
          variant={isSaved ? 'secondary' : 'primary'}
          size="medium"
          loading={isSaving}
          disabled={isSaved || isSaving}
          style={styles.fullButton}
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
