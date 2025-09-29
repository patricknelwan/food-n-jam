import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppCard } from '@components/common/AppCard';
import { MealCard } from '@components/meal/MealCard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { useAuth } from '@hooks/useAuth';
import { theme } from '../../theme';

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
      params: { mealId, mealName }
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            title="Meal → Playlist"
            subtitle="Find the perfect soundtrack for your meal"
            icon="🍽️"
            onPress={handleMealToPlaylist}
            style={styles.actionCard}
          />
          
          <AppCard
            title="Playlist → Meal"
            subtitle="Discover meals that match your music"
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
              <LoadingSpinner />
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
              title="Surprise Me!"
              subtitle="Random meal + playlist combo"
              icon="🎲"
              onPress={handleRandomPairing}
              style={styles.quickActionCard}
            />
            
            <AppCard
              title="My Favorites"
              subtitle="Your saved pairings"
              icon="❤️"
              onPress={handleViewFavorites}
              style={styles.quickActionCard}
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
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    ...theme.typography.textStyles.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textStyles.body,
    color: theme.colors.textSecondary,
  },
  actionCards: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionCard: {
    marginBottom: theme.spacing.sm,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  featuredMealCard: {
    width: 160,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  quickActionCard: {
    flex: 1,
  },
});
