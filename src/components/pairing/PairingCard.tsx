import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { AppButton } from '@components/common/AppButton';
import { SharePairingModal } from './SharePairingModal';
import type { SavedPairing } from '@types/pairing';
import { UI_CONSTANTS } from '@utils/constants';

interface PairingCardProps {
  pairing: SavedPairing;
  onPress?: () => void;
  onDelete?: (pairingId: string) => void;
  style?: any;
}

export const PairingCard: React.FC<PairingCardProps> = ({
  pairing,
  onPress,
  onDelete,
  style,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Pairing',
      `Are you sure you want to remove "${pairing.meal_name}" + "${pairing.playlist_name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(pairing.id)
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.images}>
            {/* Meal Image */}
            <View style={styles.imageContainer}>
              {pairing.meal_image ? (
                <Image
                  source={{ uri: pairing.meal_image }}
                  style={styles.mealImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.mealImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderIcon}>🍽️</Text>
                </View>
              )}
            </View>
            
            {/* Plus Icon */}
            <View style={styles.plusContainer}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            
            {/* Playlist Image */}
            <View style={styles.imageContainer}>
              {pairing.playlist_image ? (
                <Image
                  source={{ uri: pairing.playlist_image }}
                  style={styles.playlistImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.playlistImage, styles.placeholderImage]}>
                  <Text style={styles.placeholderIcon}>🎵</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.info}>
            <Text style={styles.mealName} numberOfLines={1}>
              {pairing.meal_name}
            </Text>
            <Text style={styles.playlistName} numberOfLines={1}>
              {pairing.playlist_name}
            </Text>
            
            <View style={styles.metadata}>
              <View style={styles.cuisineBadge}>
                <Text style={styles.cuisineText}>{pairing.cuisine}</Text>
              </View>
              <Text style={styles.dateText}>
                Saved {formatDate(pairing.created_at)}
              </Text>
            </View>
          </View>
        </View>
        
        {onDelete && (
          <View style={styles.actions}>
            <View style={styles.actionButtons}>
              <AppButton
                label="📤"
                onPress={() => setShowShareModal(true)}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
              
              <AppButton
                label="🗑️"
                onPress={handleDelete}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      <SharePairingModal
        visible={showShareModal}
        pairing={pairing}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  images: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: UI_CONSTANTS.SPACING.md,
  },
  
  imageContainer: {
    position: 'relative',
  },
  
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.grey70,
  },
  
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.grey70,
  },
  
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  placeholderIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  
  plusContainer: {
    marginHorizontal: UI_CONSTANTS.SPACING.sm,
  },
  
  plusIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.grey30,
  },
  
  info: {
    flex: 1,
  },
  
  mealName: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  
  playlistName: {
    ...Typography.text70,
    color: Colors.grey20,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  cuisineBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: UI_CONSTANTS.SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  cuisineText: {
    ...Typography.text90,
    color: Colors.white,
    fontWeight: '500',
  },
  
  dateText: {
    ...Typography.text90,
    color: Colors.grey40,
  },
  
  actions: {
    marginTop: UI_CONSTANTS.SPACING.sm,
    alignItems: 'flex-end',
  },
  
  actionButtons: {
    flexDirection: 'row',
    gap: UI_CONSTANTS.SPACING.xs,
  },
  
  actionButton: {
    width: 36,
    height: 32,
  },
});
