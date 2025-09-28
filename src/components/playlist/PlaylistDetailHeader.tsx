import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import type { SpotifyPlaylist } from '@types/spotify';
import { UI_CONSTANTS } from '@utils/constants';

interface PlaylistDetailHeaderProps {
  playlist: SpotifyPlaylist;
}

export const PlaylistDetailHeader: React.FC<PlaylistDetailHeaderProps> = ({ playlist }) => {
  return (
    <View style={styles.container}>
      {playlist.image ? (
        <Image
          source={{ uri: playlist.image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderIcon}>🎵</Text>
        </View>
      )}
      
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{playlist.name}</Text>
          
          <View style={styles.info}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>👤 {playlist.owner}</Text>
            </View>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎵 {playlist.trackCount} tracks</Text>
            </View>
          </View>
          
          {playlist.isOwner && (
            <View style={styles.ownerIndicator}>
              <Text style={styles.ownerText}>✨ Your Playlist</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 280,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.grey60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderIcon: {
    fontSize: 80,
    opacity: 0.3,
  },
  
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: UI_CONSTANTS.SPACING.xl,
  },
  
  content: {
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  title: {
    ...Typography.text30,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: UI_CONSTANTS.SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  info: {
    flexDirection: 'row',
    gap: UI_CONSTANTS.SPACING.sm,
    marginBottom: UI_CONSTANTS.SPACING.sm,
  },
  
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: UI_CONSTANTS.SPACING.sm,
    paddingVertical: UI_CONSTANTS.SPACING.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  badgeText: {
    ...Typography.text80,
    color: Colors.white,
    fontWeight: '500',
  },
  
  ownerIndicator: {
    alignSelf: 'flex-start',
  },
  
  ownerText: {
    ...Typography.text80,
    color: Colors.primary,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
