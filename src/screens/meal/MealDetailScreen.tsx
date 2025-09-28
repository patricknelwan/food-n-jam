import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MealDetailHeader } from '@components/meal/MealDetailHeader';
import { PairingActions } from '@components/pairing/PairingActions';
import { AppButton } from '@components/common/AppButton';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { usePairing } from '@hooks/usePairing';
import { UI_CONSTANTS } from '@utils/constants';
import type { MealStackScreenProps } from '@navigation/types';
import type { Meal } from '@types/meal';
import type { PairingRecommendation } from '@types/pairing';

type MealDetailScreenProps = MealStackScreenProps<'MealDetail'>;

export const MealDetailScreen: React.FC<MealDetailScreenProps> = () => {
  const route = useRoute<MealDetailScreenProps['route']>();
  const navigation = useNavigation<MealDetailScreenProps['navigation']>();
  const { mealId, mealName } = route.params;
  
  const { getMealById } = useMeals();
  const { createMealPairing, isLoading: isPairingLoading } = usePairing();
  
  const [meal, setMeal] = useState<Meal | null>(null);
  const [pairing, setPairing] = useState<PairingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMeal();
  }, [mealId]);

  const loadMeal = async () => {
    setIsLoading(true);
    const mealData = await getMealById(mealId);
    setMeal(mealData);
    setIsLoading(false);
    
    // Auto-generate pairing
    if (mealData) {
      generatePairing(mealData);
    }
  };

  const generatePairing = async (mealData: Meal) => {
    const pairingResult = await createMealPairing(mealData);
    if (pairingResult) {
      setPairing(pairingResult);
    }
  };

  const handleOpenSpotify = () => {
    if (pairing) {
      Alert.alert(
        'Open in Spotify',
        `Search for "${pairing.playlist.name}" in Spotify to enjoy this perfect pairing!`,
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading || !meal) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading meal details..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MealDetailHeader meal={meal} />
        
        <View style={styles.content}>
          {/* Music Pairing Section */}
          {pairing && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎵 Perfect Music Pairing</Text>
              
              <View style={styles.pairingCard}>
                <View style={styles.pairingHeader}>
                  <Text style={styles.playlistName}>{pairing.playlist.name}</Text>
                  <Text style={styles.genreText}>{pairing.playlist.genre}</Text>
                </View>
                
                <Text style={styles.confidenceText}>
                  {Math.round(pairing.confidence * 100)}% match for {pairing.cuisine} cuisine
                </Text>
                
                <PairingActions
                  pairing={pairing}
                  onOpenSpotify={handleOpenSpotify}
                  playlistId="generated_playlist" // Mock ID for generated playlists
                  layout="vertical"
                />
              </View>
            </View>
          )}
          
          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🥘 Ingredients</Text>
            
            <View style={styles.ingredientsList}>
              {meal.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.ingredientMeasure}>
                    {ingredient.measure || '•'}
                  </Text>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🍳 Instructions</Text>
            <Text style={styles.instructions}>{meal.instructions}</Text>
          </View>
          
          {/* Additional Links */}
          {(meal.youtubeUrl || meal.sourceUrl) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔗 More Info</Text>
              
              <View style={styles.links}>
                {meal.youtubeUrl && (
                  <AppButton
                    label="📺 Watch Video"
                    onPress={() => {
                      Alert.alert('Coming Soon', 'Video links will open in the next version!');
                    }}
                    variant="outline"
                    size="medium"
                    style={styles.linkButton}
                  />
                )}
                
                {meal.sourceUrl && (
                  <AppButton
                    label="🌐 View Recipe Source"
                    onPress={() => {
                      Alert.alert('Coming Soon', 'Recipe links will open in the next version!');
                    }}
                    variant="outline"
                    size="medium"
                    style={styles.linkButton}
                  />
                )}
              </View>
            </View>
          )}
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
  
  pairingCard: {
    backgroundColor: Colors.grey80,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  
  pairingHeader: {
    marginBottom: UI_CONSTANTS.SPACING.sm,
  },
  
  playlistName: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  genreText: {
    ...Typography.text70,
    color: Colors.grey20,
    fontStyle: 'italic',
  },
  
  confidenceText: {
    ...Typography.text80,
    color: Colors.grey30,
    marginBottom: UI_CONSTANTS.SPACING.lg,
  },
  
  ingredientsList: {
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: UI_CONSTANTS.SPACING.xs,
  },
  
  ingredientMeasure: {
    ...Typography.text70,
    fontWeight: '500',
    color: Colors.primary,
    minWidth: 80,
    marginRight: UI_CONSTANTS.SPACING.md,
  },
  
  ingredientName: {
    ...Typography.text70,
    color: Colors.text,
    flex: 1,
  },
  
  instructions: {
    ...Typography.text70,
    color: Colors.grey10,
    lineHeight: 22,
  },
  
  links: {
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  linkButton: {
    width: '100%',
  },
});
