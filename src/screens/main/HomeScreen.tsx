import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppCard } from '@components/common/AppCard';
import { MealCard } from '@components/meal/MealCard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { useAuth } from '../../contexts/AuthContext';
import { UI_CONSTANTS } from '@utils/constants';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { featuredMeals, isLoadingFeatured, loadFeaturedMeals } = useMeals();

  useEffect(() => {
    loadFeaturedMeals();
  }, [loadFeaturedMeals]);

  const handleMealToPlaylist = () => {
    navigation.navigate('MealFlow', { screen: 'MealSearch' });
  };

  const handlePlaylistToMeal = () => {
    navigation.navigate('PlaylistFlow', { screen: 'PlaylistList' });
  };

  const handleMealPress = (mealId: string, mealName: string) => {
    navigation.navigate('MealFlow', {
      screen: 'MealDetail',
      params: { mealId, mealName },
    });
  };

  const handleRandomPairing = () => {
    const randomMeal = featuredMeals[Math.floor(Math.random() * featuredMeals.length)];
    if (randomMeal) {
      handleMealPress(randomMeal.id, randomMeal.name);
    } else {
      alert('Loading meals... Please try again in a moment!');
    }
  };

  const handleViewFavorites = () => {
    navigation.navigate('Favorites');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.display_name || 'Music Lover'}!</Text>
          <Text style={styles.subtitle}>What's Your Vibe Today?</Text>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionCards}>
          <AppCard
            title="Meal to Playlist"
            subtitle="Find the perfect soundtrack for your meal"
            onPress={handleMealToPlaylist}
            style={styles.actionCard}
            variant="orange"
          />

          <AppCard
            title="Playlist to Meal"
            subtitle="Discover meals that match your music"
            onPress={handlePlaylistToMeal}
            style={styles.actionCard}
            variant="spotify"
          />
        </View>

        {/* Featured Meals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Meals</Text>
          {isLoadingFeatured ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}>
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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <AppCard
              title="Surprise Me"
              subtitle="Random meal + playlist combo"
              onPress={handleRandomPairing}
              style={styles.quickActionCard}
              variant="default"
            />

            <AppCard
              title="My Favorites"
              subtitle="Your saved pairings"
              onPress={handleViewFavorites}
              style={styles.quickActionCard}
              variant="default"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey80,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add bottom padding to account for tab bar
  },
  header: {
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    paddingTop: UI_CONSTANTS.SPACING.xl,
    paddingBottom: UI_CONSTANTS.SPACING.md,
  },
  greeting: {
    ...Typography.text40,
    fontWeight: 'bold',
    color: Colors.grey10,
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
    color: Colors.grey10,
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
