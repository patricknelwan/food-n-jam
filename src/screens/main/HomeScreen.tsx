import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { AppCard } from '@components/common/AppCard';
import { MealCard } from '@components/meal/MealCard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { useAuth } from '@hooks/useAuth';
import type { MainTabScreenProps } from '@navigation/types';
import { UI_CONSTANTS } from '@utils/constants';

type HomeScreenProps = MainTabScreenProps<'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const navigation = useNavigation<HomeScreenProps['navigation']>();
  const { user } = useAuth();
  const { featuredMeals, isLoadingFeatured, loadFeaturedMeals } = useMeals();

  useEffect(() => {
    loadFeaturedMeals();
  }, [loadFeaturedMeals]);

  const handleMealToPlaylist = () => {
    // Navigate to meal search screen
    navigation.navigate('MealFlow', { screen: 'MealSearch' });
  };

  const handlePlaylistToMeal = () => {
    // Navigate to playlist selection screen
    navigation.navigate('PlaylistFlow', { screen: 'PlaylistList' });
  };

  const handleMealPress = (mealId: string, mealName: string) => {
    navigation.navigate('MealFlow', { 
      screen: 'MealDetail', 
      params: { mealId, mealName } 
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.display_name || 'Music Lover'}! 👋
        </Text>
        <Text style={styles.subtitle}>What's Your Vibe Today?</Text>
      </View>

      {/* Main Action Cards */}
      <View style={styles.actionCards}>
        <AppCard
          title="Find Meal → Playlist"
          subtitle="Discover the perfect music for your meal"
          icon="🍽️"
          onPress={handleMealToPlaylist}
          style={styles.actionCard}
        />
        
        <AppCard
          title="Pick Playlist → Meal"
          subtitle="Get meal suggestions from your music"
          icon="🎵"
          onPress={handlePlaylistToMeal}
          style={styles.actionCard}
        />
      </View>

      {/* Featured Meals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Trending Meals</Text>
        
        {isLoadingFeatured ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner message="Loading featured meals..." />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {featuredMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onPress={() => handleMealPress(meal.id, meal.name)}
                style={styles.featuredMealCard}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        
        <View style={styles.quickActions}>
          <AppCard
            title="Random Pairing"
            subtitle="Get a surprise meal + playlist combo"
            icon="🎲"
            size="small"
            onPress={() => {
              // TODO: Implement random pairing
            }}
            style={styles.quickActionCard}
          />
          
          <AppCard
            title="My Favorites"
            subtitle="View your saved pairings"
            icon="❤️"
            size="small"
            onPress={() => navigation.navigate('Favorites')}
            style={styles.quickActionCard}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey80,
  },
  header: {
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    paddingTop: UI_CONSTANTS.SPACING.xl,
    paddingBottom: UI_CONSTANTS.SPACING.md,
  },
  greeting: {
    ...Typography.text40,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  subtitle: {
    ...Typography.text60,
    color: Colors.grey30,
  },
  actionCards: {
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    gap: UI_CONSTANTS.SPACING.md,
    marginBottom: UI_CONSTANTS.SPACING.lg,
  },
  actionCard: {
    marginBottom: UI_CONSTANTS.SPACING.sm,
  },
  section: {
    marginBottom: UI_CONSTANTS.SPACING.xl,
  },
  sectionTitle: {
    ...Typography.text50,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScroll: {
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    gap: UI_CONSTANTS.SPACING.md,
  },
  featuredMealCard: {
    width: 160,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    gap: UI_CONSTANTS.SPACING.md,
  },
  quickActionCard: {
    flex: 1,
  },
});
