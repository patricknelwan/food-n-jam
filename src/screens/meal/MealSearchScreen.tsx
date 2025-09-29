import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MealSearchBar } from '@components/meal/MealSearchBar';
import { MealCard } from '@components/meal/MealCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { theme } from '../../theme';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation prop type for MealFlow stack
type MealFlowNavigationProp = StackNavigationProp<any, 'MealSearch'>;

export const MealSearchScreen: React.FC = () => {
  const navigation = useNavigation<MealFlowNavigationProp>();
  const { searchState, searchMeals, clearSearch } = useMeals();

  const handleMealPress = (mealId: string, mealName: string) => {
    // Navigate within the MealFlow stack
    navigation.navigate('MealDetail', { mealId, mealName });
  };

  const renderMealItem = ({ item }: { item: any }) => (
    <MealCard
      meal={item}
      onPress={() => handleMealPress(item.id, item.name)}
      style={styles.mealCard}
      size="large"
    />
  );

  const renderEmptyState = () => {
    if (searchState.isLoading) {
      return <LoadingSpinner />;
    }

    if (searchState.error) {
      return (
        <EmptyState
          title="Search Error"
          message={searchState.error}
          actionLabel="Try Again"
          onAction={() => searchMeals(searchState.query)}
        />
      );
    }

    if (searchState.hasSearched && searchState.results.length === 0) {
      return (
        <EmptyState
          title="No meals found"
          message="Try searching with different keywords"
          actionLabel="Clear Search"
          onAction={clearSearch}
        />
      );
    }

    return (
      <EmptyState
        title="Find Your Perfect Meal"
        message="Search for meals by name, ingredient, or cuisine type"
        icon="🔍"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Perfect Meal</Text>
        <MealSearchBar onSearch={searchMeals} />
      </View>
      
      <FlatList
        data={searchState.results}
        renderItem={renderMealItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  title: {
    ...theme.typography.textStyles.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  mealCard: {
    marginBottom: theme.spacing.md,
  },
  separator: {
    height: theme.spacing.sm,
  },
});
