import React, { useState } from 'react';
import { StyleSheet, Modal, ScrollView } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@components/common/AppButton';
import { shareHelper } from '@utils/sharing/shareHelper';
import type { SavedPairing } from '../../types/pairing';
import { UI_CONSTANTS } from '@utils/constants';

interface SharePairingModalProps {
  visible: boolean;
  pairing: SavedPairing | null;
  onClose: () => void;
}

export const SharePairingModal: React.FC<SharePairingModalProps> = ({
  visible,
  pairing,
  onClose,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform?: string) => {
    if (!pairing) return;

    setIsSharing(true);

    try {
      const success = await shareHelper.shareSavedPairing(pairing);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCustomShare = async () => {
    if (!pairing) return;

    const customMessage = `Just discovered an amazing pairing! 🍽️🎵\n\n${pairing.meal_name} goes perfectly with "${pairing.playlist_name}"\n\nTry it and let me know what you think! ✨`;
    
    setIsSharing(true);
    try {
      await shareHelper.shareCustomMessage(customMessage, 'Check out this pairing!');
      onClose();
    } catch (error) {
      console.error('Custom share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!pairing) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Pairing</Text>
          <AppButton
            label="✕"
            onPress={onClose}
            variant="outline"
            size="small"
            style={styles.closeButton}
          />
        </View>

        <ScrollView style={styles.content}>
          {/* Pairing Preview */}
          <View style={styles.pairingPreview}>
            <Text style={styles.previewTitle}>Your Pairing</Text>
            
            <View style={styles.pairingInfo}>
              <View style={styles.pairingRow}>
                <Text style={styles.emoji}>🍽️</Text>
                <Text style={styles.pairingText}>{pairing.meal_name}</Text>
              </View>
              
              <View style={styles.plusRow}>
                <Text style={styles.plusText}>+</Text>
              </View>
              
              <View style={styles.pairingRow}>
                <Text style={styles.emoji}>🎵</Text>
                <Text style={styles.pairingText}>"{pairing.playlist_name}"</Text>
              </View>
            </View>
            
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineText}>{pairing.cuisine} Cuisine</Text>
            </View>
          </View>

          {/* Share Options */}
          <View style={styles.shareOptions}>
            <Text style={styles.sectionTitle}>Share Options</Text>

            <View style={styles.shareButtons}>
              <View style={styles.shareButtonContainer}>
                <AppButton
                  label="📱 Share to Apps"
                  onPress={() => handleShare()}
                  disabled={isSharing}
                  size="large"
                  style={styles.shareButton}
                />
                <Text style={styles.shareButtonDescription}>
                  Share via your favorite apps
                </Text>
              </View>

              <View style={styles.shareButtonContainer}>
                <AppButton
                  label="✏️ Custom Message"
                  onPress={handleCustomShare}
                  disabled={isSharing}
                  variant="outline"
                  size="large"
                  style={styles.shareButton}
                />
                <Text style={styles.shareButtonDescription}>
                  Share with a personal touch
                </Text>
              </View>
            </View>
          </View>

          {/* Share Tips */}
          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Sharing Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tip}>• Tag friends who love food and music</Text>
              <Text style={styles.tip}>• Share in food or music communities</Text>
              <Text style={styles.tip}>• Try the pairing and share your experience</Text>
              <Text style={styles.tip}>• Ask others to share their favorite combos</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONSTANTS.SPACING.lg,
    paddingVertical: UI_CONSTANTS.SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey70,
  },
  
  title: {
    ...Typography.text50,
    fontWeight: 'bold',
    color: Colors.text,
  },
  
  closeButton: {
    width: 40,
    height: 40,
  },
  
  content: {
    flex: 1,
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  pairingPreview: {
    backgroundColor: Colors.grey80,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.lg,
    marginBottom: UI_CONSTANTS.SPACING.xl,
  },
  
  previewTitle: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
    textAlign: 'center',
  },
  
  pairingInfo: {
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  pairingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: UI_CONSTANTS.SPACING.xs,
  },
  
  emoji: {
    fontSize: 24,
    marginRight: UI_CONSTANTS.SPACING.sm,
  },
  
  pairingText: {
    ...Typography.text60,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  
  plusRow: {
    marginVertical: UI_CONSTANTS.SPACING.xs,
  },
  
  plusText: {
    ...Typography.text50,
    fontWeight: 'bold',
    color: Colors.grey30,
  },
  
  cuisineBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: UI_CONSTANTS.SPACING.md,
    paddingVertical: UI_CONSTANTS.SPACING.xs,
    borderRadius: 20,
    alignSelf: 'center',
  },
  
  cuisineText: {
    ...Typography.text80,
    color: Colors.white,
    fontWeight: '500',
  },
  
  shareOptions: {
    marginBottom: UI_CONSTANTS.SPACING.xl,
  },
  
  sectionTitle: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  shareButtons: {
    gap: UI_CONSTANTS.SPACING.md,
  },
  
  shareButton: {
    width: '100%',
  },
  
  tips: {
    backgroundColor: Colors.grey80,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  tipsTitle: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  tipsList: {
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  tip: {
    ...Typography.text70,
    color: Colors.grey20,
    lineHeight: 20,
  },

  shareButtonContainer: {
  alignItems: 'center',
  gap: UI_CONSTANTS.SPACING.xs,
},

shareButtonDescription: {
  ...Typography.text80,
  color: Colors.grey30,
  textAlign: 'center',
},

shareDescriptions: {
  marginTop: UI_CONSTANTS.SPACING.sm,
  alignItems: 'center',
},

shareDescription: {
  ...Typography.text80,
  color: Colors.grey30,
  textAlign: 'center',
},
});
