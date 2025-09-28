import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MealSearchBar } from '@components/meal/MealSearchBar';
import { MealCard } from '@components/meal/MealCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useMeals } from '@hooks/useMeals';
import { UI_CONSTANTS } from '@utils/constants';
import type { MealStackScreenProps } from '@navigation/types';

type MealSearchScreenProps = MealStackScreenProps<'MealSearch'>;

export const MealSearchScreen: React.FC<MealSearchScreenProps> = () => {
  const navigation = useNavigation<MealSearchScreenProps['navigation']>();
  const { searchState, searchMeals, clearSearch } = useMeals();

  const handleMealPress = (mealId: string, mealName: string) => {
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
      return <LoadingSpinner message="Searching for meals..." />;
    }

    if (searchState.error) {
      return (
        <EmptyState
          icon="⚠️"
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
          icon="🔍"
          title="No Meals Found"
          message={`No meals found for "${searchState.query}". Try a different search term.`}
          actionLabel="Clear Search"
          onAction={clearSearch}
        />
      );
    }

    return (
      <EmptyState
        icon="🍽️"
        title="Search for Meals"
        message="Start typing to search for delicious meals and discover perfect music pairings!"
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Perfect Meal</Text>
        <MealSearchBar
          onSearch={searchMeals}
          onClear={clearSearch}
          autoFocus={true}
        />
      </View>

      <FlatList
        data={searchState.results}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
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
    backgroundColor: Colors.grey80,
  },
  
  header: {
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    paddingVertical: UI_CONSTANTS.SPACING.md,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  listContainer: {
    padding: UI_CONSTANTS.SPACING.lg,
    flexGrow: 1,
  },
  
  mealCard: {
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  separator: {
    height: UI_CONSTANTS.SPACING.sm,
  },
});
