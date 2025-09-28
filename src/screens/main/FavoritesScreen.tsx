import React, { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PairingCard } from '@components/pairing/PairingCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useFavorites } from '@hooks/useFavorites';
import { UI_CONSTANTS } from '@utils/constants';
import type { MainTabScreenProps } from '@navigation/types';
import type { SavedPairing } from '@types/pairing';

type FavoritesScreenProps = MainTabScreenProps<'Favorites'>;

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const navigation = useNavigation<FavoritesScreenProps['navigation']>();
  const { 
    pairings, 
    isLoading, 
    error, 
    stats,
    loadPairings, 
    deletePairing 
  } = useFavorites();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePairingPress = (pairing: SavedPairing) => {
    // Navigate to meal detail if we have meal_id
    if (pairing.meal_id) {
      navigation.navigate('MealFlow', {
        screen: 'MealDetail',
        params: { mealId: pairing.meal_id, mealName: pairing.meal_name }
      });
    }
    // TODO: Could also add option to navigate to playlist detail
  };

  const handleDeletePairing = async (pairingId: string) => {
    setDeletingId(pairingId);
    try {
      await deletePairing(pairingId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    loadPairings();
  };

  const handleDiscoverPairings = () => {
    navigation.navigate('Home');
  };

  const renderPairingItem = ({ item }: { item: SavedPairing }) => (
    <PairingCard
      pairing={item}
      onPress={() => handlePairingPress(item)}
      onDelete={handleDeletePairing}
      style={[
        styles.pairingCard,
        deletingId === item.id && styles.deletingCard
      ]}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return <LoadingSpinner message="Loading your favorites..." />;
    }

    if (error) {
      return (
        <EmptyState
          icon="⚠️"
          title="Error Loading Favorites"
          message={error}
          actionLabel="Try Again"
          onAction={handleRefresh}
        />
      );
    }

    return (
      <EmptyState
        icon="❤️"
        title="No Favorites Yet"
        message="Start pairing meals with music to save your favorites here! Your perfect combinations will appear in this space."
        actionLabel="Discover Pairings"
        onAction={handleDiscoverPairings}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Your Favorites</Text>
        <Text style={styles.subtitle}>Your saved meal and music pairings</Text>
      </View>
      
      {pairings.length > 0 && (
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalPairings}</Text>
              <Text style={styles.statLabel}>Total Pairings</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.uniqueMeals}</Text>
              <Text style={styles.statLabel}>Unique Meals</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.uniquePlaylists}</Text>
              <Text style={styles.statLabel}>Playlists</Text>
            </View>
            
            {stats.topCuisine && (
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.topCuisine}</Text>
                <Text style={styles.statLabel}>Top Cuisine</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        {renderHeader()}
      </View>

      <FlatList
        data={pairings}
        renderItem={renderPairingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
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
  
  headerContent: {
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  titleSection: {
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  title: {
    ...Typography.text40,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  subtitle: {
    ...Typography.text70,
    color: Colors.grey30,
  },
  
  statsSection: {
    paddingTop: UI_CONSTANTS.SPACING.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grey70,
  },
  
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  
  statItem: {
    alignItems: 'center',
    minWidth: '20%',
  },
  
  statNumber: {
    ...Typography.text50,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 2,
  },
  
  statLabel: {
    ...Typography.text90,
    color: Colors.grey30,
    textAlign: 'center',
  },
  
  listContainer: {
    padding: UI_CONSTANTS.SPACING.lg,
    flexGrow: 1,
  },
  
  pairingCard: {
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  deletingCard: {
    opacity: 0.5,
  },
  
  separator: {
    height: UI_CONSTANTS.SPACING.sm,
  },
});
