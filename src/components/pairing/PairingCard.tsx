import React, { useState, useRef } from 'react';
import { StyleSheet, Animated, Image, Alert, PanResponder } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { SharePairingModal } from './SharePairingModal';
import type { SavedPairing } from '../../types/pairing';
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
  const translateX = useRef(new Animated.Value(0)).current;
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDelete = () => {
    Alert.alert(
      'Delete Pairing',
      `Are you sure you want to remove "${pairing.meal_name}" + "${pairing.playlist_name}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete?.(pairing.id);
            // Reset position after delete
            Animated.timing(translateX, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        },
      ]
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only activate swipe if moving more than 10 pixels horizontally
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        // Clear any existing long press timeout
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
        }
        
        // Start long press timer for share
        longPressTimeout.current = setTimeout(() => {
          setShowShareModal(true);
        }, 800); // 800ms long press
      },
      onPanResponderMove: (_, gestureState) => {
        // Cancel long press if user starts swiping
        if (Math.abs(gestureState.dx) > 10 && longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }

        // Only allow swipe to the left (negative dx)
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Clear long press timeout
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }

        // If swiped left more than 100px, show delete confirmation
        if (gestureState.dx < -100) {
          handleDelete();
          // Snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else if (gestureState.dx < 0) {
          // Snap back if not swiped far enough
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
          // If it's a tap (not a swipe), trigger onPress
          onPress?.();
        }
      },
      onPanResponderTerminate: () => {
        // Clear long press timeout if gesture is terminated
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
          longPressTimeout.current = null;
        }
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <View style={[styles.cardContainer, style]}>
        {/* Delete background */}
        <View style={styles.deleteBackground}>
          <Ionicons name="trash" size={24} color="#fff" />
          <Text style={styles.deleteText}>Swipe to delete</Text>
        </View>

        {/* Animated card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.content}>
            <View style={styles.images}>
              <View style={styles.imageContainer}>
                {pairing.meal_image ? (
                  <Image source={{ uri: pairing.meal_image }} style={styles.mealImage} />
                ) : (
                  <View style={[styles.mealImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderIcon}>🍽️</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.plusContainer}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              
              <View style={styles.imageContainer}>
                {pairing.playlist_image ? (
                  <Image source={{ uri: pairing.playlist_image }} style={styles.playlistImage} />
                ) : (
                  <View style={[styles.playlistImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderIcon}>🎵</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.info}>
              <Text style={styles.mealName}>{pairing.meal_name}</Text>
              <Text style={styles.playlistName}>{pairing.playlist_name}</Text>
              <View style={styles.metadata}>
                <View style={styles.cuisineBadge}>
                  <Text style={styles.cuisineText}>{pairing.cuisine}</Text>
                </View>
                <Text style={styles.dateText}>Saved {formatDate(pairing.created_at)}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      <SharePairingModal
        visible={showShareModal}
        pairing={pairing}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    flexDirection: 'row',
    gap: UI_CONSTANTS.SPACING.xs,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
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
  gestureHint: {
    marginTop: UI_CONSTANTS.SPACING.xs,
    alignItems: 'center',
  },
  gestureHintText: {
    ...Typography.text90,
    color: Colors.grey40,
    fontSize: 11,
  },
});
