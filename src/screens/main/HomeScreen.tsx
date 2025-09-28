import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppCard } from '../../components/common/AppCard'; // Fixed relative path
import { MealCard } from '../../components/meal/MealCard'; // Fixed relative path
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; // Fixed relative path
import { useMeals } from '../../hooks/useMeals'; // Fixed relative path
import { useAuth } from '../../hooks/useAuth'; // Fixed relative path
import { UI_CONSTANTS } from '../../utils/constants'; // Fixed relative path

// Simple navigation type for now
interface HomeScreenProps {
  navigation: any; // Temporary - you can refine this later
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { featuredMeals, isLoadingFeatured, loadFeaturedMeals } = useMeals();

  useEffect(() => {
    loadFeaturedMeals();
  }, [loadFeaturedMeals]);

  const handleMealToPlaylist = () => {
    // For now, just show an alert instead of navigation
    alert('Meal to Playlist feature - Coming Soon!');
  };

  const handlePlaylistToMeal = () => {
    // For now, just show an alert instead of navigation
    alert('Playlist to Meal feature - Coming Soon!');
  };

  const handleMealPress = (mealId: string, mealName: string) => {
    // For now, just show an alert instead of navigation
    alert(`Would navigate to meal: ${mealName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.display_name || 'Music Lover'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            What's Your Vibe Today?
          </Text>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionCards}>
          <AppCard
            title="🍽️ Meal → Playlist"
            subtitle="Find perfect music for your meal"
            icon="🎵"
            onPress={handleMealToPlaylist}
            style={styles.actionCard}
          />
          
          <AppCard
            title="🎧 Playlist → Meal"
            subtitle="Discover meals that match your music"
            icon="🍴"
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
              title="🎲 Surprise Me"
              subtitle="Random pairing"
              icon="✨"
              onPress={() => {
                // TODO: Implement random pairing
                alert('Random pairing - Coming Soon!');
              }}
              style={styles.quickActionCard}
            />
            
            <AppCard
              title="❤️ My Favorites"
              subtitle="Saved pairings"
              icon="📱"
              onPress={() => navigation?.navigate('Favorites')}
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
