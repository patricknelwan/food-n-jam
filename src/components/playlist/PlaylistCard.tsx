import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import type { SpotifyPlaylist } from '@types/spotify';
import { UI_CONSTANTS } from '@utils/constants';

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
  onPress: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onPress,
  style,
  size = 'medium',
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, styles[`${size}Card`], style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.imageContainer, styles[`${size}ImageContainer`]]}>
          {playlist.image ? (
            <Image
              source={{ uri: playlist.image }}
              style={[styles.image, styles[`${size}Image`]]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderImage, styles[`${size}Image`]]}>
              <Text style={styles.placeholderIcon}>🎵</Text>
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.title, styles[`${size}Title`]]} numberOfLines={2}>
            {playlist.name}
          </Text>
          
          <View style={styles.metadata}>
            <Text style={[styles.owner, styles[`${size}Owner`]]} numberOfLines={1}>
              by {playlist.owner}
            </Text>
            
            <View style={styles.stats}>
              <Text style={[styles.trackCount, styles[`${size}TrackCount`]]}>
                🎵 {playlist.trackCount} tracks
              </Text>
              
              {playlist.isOwner && (
                <View style={styles.ownerBadge}>
                  <Text style={styles.ownerBadgeText}>Your Playlist</Text>
                </View>
              )}
            </View>
          </View>
          
          {playlist.description && size === 'large' && (
            <Text style={styles.description} numberOfLines={2}>
              {playlist.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  
  smallCard: {
    width: 140,
  },
  mediumCard: {
    width: '100%',
  },
  largeCard: {
    width: '100%',
  },
  
  content: {
    flexDirection: 'row',
    padding: UI_CONSTANTS.SPACING.md,
  },
  
  imageContainer: {
    marginRight: UI_CONSTANTS.SPACING.md,
  },
  
  smallImageContainer: {
    alignSelf: 'flex-start',
  },
  mediumImageContainer: {
    alignSelf: 'flex-start',
  },
  largeImageContainer: {
    alignSelf: 'flex-start',
  },
  
  image: {
    backgroundColor: Colors.grey70,
    borderRadius: 8,
  },
  
  smallImage: {
    width: 60,
    height: 60,
  },
  mediumImage: {
    width: 80,
    height: 80,
  },
  largeImage: {
    width: 100,
    height: 100,
  },
  
  placeholderImage: {
    backgroundColor: Colors.grey70,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  
  info: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  
  title: {
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  smallTitle: {
    ...Typography.text80,
  },
  mediumTitle: {
    ...Typography.text70,
  },
  largeTitle: {
    ...Typography.text60,
  },
  
  metadata: {
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  owner: {
    color: Colors.grey30,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  smallOwner: {
    ...Typography.text90,
  },
  mediumOwner: {
    ...Typography.text80,
  },
  largeOwner: {
    ...Typography.text70,
  },
  
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: UI_CONSTANTS.SPACING.xs,
  },
  
  trackCount: {
    color: Colors.grey40,
  },
  
  smallTrackCount: {
    ...Typography.text90,
  },
  mediumTrackCount: {
    ...Typography.text80,
  },
  largeTrackCount: {
    ...Typography.text80,
  },
  
  ownerBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: UI_CONSTANTS.SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  ownerBadgeText: {
    ...Typography.text90,
    color: Colors.white,
    fontWeight: '500',
  },
  
  description: {
    ...Typography.text80,
    color: Colors.grey30,
    lineHeight: 16,
    marginTop: UI_CONSTANTS.SPACING.xs,
  },
});
