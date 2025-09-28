import React, { useEffect } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { View, Text, Colors } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PlaylistCard } from '@components/playlist/PlaylistCard';
import { EmptyState } from '@components/common/EmptyState';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useSpotify } from '@hooks/useSpotify';
import { UI_CONSTANTS } from '@utils/constants';
import type { PlaylistStackScreenProps } from '../../navigation/types';

type PlaylistListScreenProps = PlaylistStackScreenProps<'PlaylistList'>;

export const PlaylistListScreen: React.FC<PlaylistListScreenProps> = () => {
  const navigation = useNavigation<PlaylistListScreenProps['navigation']>();
  const { 
    playlists, 
    isLoading, 
    error, 
    loadUserPlaylists 
  } = useSpotify();

  useEffect(() => {
    loadUserPlaylists();
  }, [loadUserPlaylists]);

  const handlePlaylistPress = (playlistId: string, playlistName: string) => {
    navigation.navigate('PlaylistDetail', { playlistId, playlistName });
  };

  const handleRefresh = () => {
    loadUserPlaylists();
  };

  const renderPlaylistItem = ({ item }: { item: any }) => (
    <PlaylistCard
      playlist={item}
      onPress={() => handlePlaylistPress(item.id, item.name)}
      style={styles.playlistCard}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return <LoadingSpinner message="Loading your playlists..." />;
    }

    if (error) {
      return (
        <EmptyState
          icon="⚠️"
          title="Error Loading Playlists"
          message={error}
          actionLabel="Try Again"
          onAction={handleRefresh}
        />
      );
    }

    return (
      <EmptyState
        icon="🎵"
        title="No Playlists Found"
        message="We couldn't find any playlists in your Spotify account. Create some playlists in Spotify and come back!"
        actionLabel="Refresh"
        onAction={handleRefresh}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Playlist</Text>
        <Text style={styles.subtitle}>
          Pick a playlist to get meal recommendations based on its vibe
        </Text>
      </View>

      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
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
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    paddingVertical: UI_CONSTANTS.SPACING.lg,
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
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  subtitle: {
    fontSize: 16,
    color: Colors.grey30,
  },
  
  listContainer: {
    padding: UI_CONSTANTS.SPACING.lg,
    flexGrow: 1,
  },
  
  playlistCard: {
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  separator: {
    height: UI_CONSTANTS.SPACING.sm,
  },
});
