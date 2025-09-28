import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PlaylistDetailHeader } from '../../components/playlist/PlaylistDetailHeader'; // Fixed relative path
import { MealCard } from '../../components/meal/MealCard'; // Fixed relative path
import { PairingActions } from '../../components/pairing/PairingActions'; // Fixed relative path
import { AppButton } from '../../components/common/AppButton'; // Fixed relative path
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; // Fixed relative path
import { useSpotify } from '../../hooks/useSpotify'; // Fixed relative path
import { usePairing } from '../../hooks/usePairing'; // Fixed relative path
import { genreDetector } from '../../utils/pairing/genreDetector'; // Fixed relative path
import { UI_CONSTANTS } from '../../utils/constants'; // Fixed relative path
import type { SpotifyPlaylist } from '../../types/spotify'; // Fixed relative path
import type { Meal } from '../../types/meal'; // Fixed relative path

// Simple props interface for now
interface PlaylistDetailScreenProps {
  navigation: any;
  route: {
    params: {
      playlistId: string;
      playlistName: string;
    };
  };
}

export const PlaylistDetailScreen: React.FC<PlaylistDetailScreenProps> = ({ navigation, route }) => {
  const { playlistId, playlistName } = route.params;
  
  const { getPlaylist } = useSpotify();
  const { createPlaylistPairing, isLoading: isPairingLoading } = usePairing();
  
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [suggestedMeal, setSuggestedMeal] = useState<Meal | null>(null);
  const [detectedGenre, setDetectedGenre] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlaylistAndGeneratePairing();
  }, [playlistId]);

  const loadPlaylistAndGeneratePairing = async () => {
    setIsLoading(true);
    
    try {
      // Load playlist details
      const playlistData = await getPlaylist(playlistId);
      if (!playlistData) {
        Alert.alert('Error', 'Failed to load playlist details');
        return;
      }
      
      setPlaylist(playlistData);
      
      // Detect genre and generate pairing
      await generateMealPairing(playlistData);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while loading the playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMealPairing = async (playlistData: SpotifyPlaylist) => {
    try {
      // Detect genre from playlist
      const genreDetection = await genreDetector.detectPlaylistGenre(playlistData);
      setDetectedGenre(genreDetection.detectedGenre);
      
      // Create pairing
      const pairingResult = await createPlaylistPairing(
        { id: playlistData.id, name: playlistData.name },
        genreDetection.detectedGenre
      );
      
      if (pairingResult) {
        setSuggestedMeal(pairingResult.suggestedMeal);
        setConfidence(pairingResult.confidence);
      }
    } catch (error) {
      console.error('Failed to generate pairing:', error);
    }
  };

  const handleViewRecipe = () => {
    if (suggestedMeal) {
      // For now, just show an alert instead of complex navigation
      Alert.alert(
        'Recipe Details',
        `Would navigate to recipe for: ${suggestedMeal.name}\n\nThis feature will be fully implemented when navigation is properly set up.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleTryAgain = () => {
    if (playlist) {
      generateMealPairing(playlist);
    }
  };

  if (isLoading || !playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Analyzing your playlist..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PlaylistDetailHeader playlist={playlist} />
        
        <View style={styles.content}>
          {/* Genre Detection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎵 Detected Vibe</Text>
            
            <View style={styles.genreCard}>
              <Text style={styles.genreText}>
                We detected a <Text style={styles.genreBold}>{detectedGenre}</Text> vibe from this playlist
              </Text>
              <Text style={styles.confidenceText}>
                {Math.round(confidence * 100)}% confidence in this match
              </Text>
            </View>
          </View>

          {/* Meal Suggestion Section */}
          {suggestedMeal ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Perfect Meal Match</Text>
              
              <MealCard
                meal={suggestedMeal}
                onPress={handleViewRecipe}
                size="large"
                style={styles.mealCard}
              />
              
              <Text style={styles.matchReason}>
                Based on your {detectedGenre} playlist, we recommend this {suggestedMeal.cuisine} dish. 
                The flavors and cooking style complement the musical mood perfectly!
              </Text>
              
              <PairingActions
                pairing={{
                  meal: suggestedMeal,
                  playlist: {
                    name: playlist.name,
                    genre: detectedGenre,
                    spotifyGenre: detectedGenre,
                  },
                  confidence,
                  cuisine: suggestedMeal.cuisine,
                }}
                onViewRecipe={handleViewRecipe}
                playlistId={playlist.id}
                playlistImage={playlist.image}
                layout="vertical"
              />
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍽️ Meal Suggestion</Text>
              
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>
                  We couldn't find a perfect meal match for this playlist. This might happen with very unique or mixed-genre playlists.
                </Text>
                
                <AppButton
                  label="Try Again"
                  onPress={handleTryAgain}
                  variant="outline"
                  size="medium"
                  style={styles.retryButton}
                />
              </View>
            </View>
          )}

          {/* Playlist Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Playlist Details</Text>
            
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistStat}>
                🎵 {playlist.trackCount} tracks
              </Text>
              <Text style={styles.playlistStat}>
                👤 Created by {playlist.owner}
              </Text>
              {playlist.description && (
                <Text style={styles.playlistDescription}>
                  {playlist.description}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  content: {
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  section: {
    marginBottom: UI_CONSTANTS.SPACING.xl,
  },
  
  sectionTitle: {
    ...Typography.text50,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  genreCard: {
    backgroundColor: Colors.grey80,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  
  genreText: {
    ...Typography.text60,
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  genreBold: {
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  
  confidenceText: {
    ...Typography.text80,
    color: Colors.grey30,
  },
  
  mealCard: {
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  matchReason: {
    ...Typography.text70,
    color: Colors.grey20,
    lineHeight: 22,
    marginBottom: UI_CONSTANTS.SPACING.lg,
    fontStyle: 'italic',
  },
  
  errorCard: {
    backgroundColor: Colors.grey70,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.lg,
    alignItems: 'center',
  },
  
  errorText: {
    ...Typography.text70,
    color: Colors.grey20,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.md,
    lineHeight: 20,
  },
  
  retryButton: {
    minWidth: 120,
  },
  
  playlistInfo: {
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  playlistStat: {
    ...Typography.text70,
    color: Colors.text,
  },
  
  playlistDescription: {
    ...Typography.text80,
    color: Colors.grey30,
    fontStyle: 'italic',
    marginTop: UI_CONSTANTS.SPACING.xs,
  },
});
