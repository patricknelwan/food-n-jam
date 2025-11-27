import React, { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PairingCard } from '../../components/pairing/PairingCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useFavorites } from '../../hooks/useFavorites';
import { UI_CONSTANTS } from '../../utils/constants';
import type { SavedPairing } from '../../types/pairing';
import { useNavigation } from '@react-navigation/native';

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { pairings, isLoading, error, stats, loadPairings, deletePairing } = useFavorites();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePairingPress = (pairing: SavedPairing) => {
    if (pairing.meal_id) {
      console.log('Navigate to meal:', pairing.meal_id, pairing.meal_name);
      alert(`Would navigate to meal: ${pairing.meal_name}`);
    }
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
    if (navigation?.navigate) {
      navigation.navigate('Home');
    }
  };

  const renderPairingItem = ({ item }: { item: SavedPairing }) => (
    <PairingCard
      pairing={item}
      onPress={() => handlePairingPress(item)}
      onDelete={handleDeletePairing}
      style={[styles.pairingCard, deletingId === item.id && styles.deletingCard]}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <EmptyState
          title="Error Loading Favorites"
          message={error}
          actionLabel="Try Again"
          onAction={handleRefresh}
        />
      );
    }

    return (
      <EmptyState
        title="No Favorites Yet"
        message="Start discovering perfect meal and music pairings to save your favorites"
        actionLabel="Discover Pairings"
        onAction={handleDiscoverPairings}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
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
