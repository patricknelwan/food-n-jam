import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import type { Meal } from '../../types/meal';
import { UI_CONSTANTS } from '@utils/constants';

interface MealDetailHeaderProps {
  meal: Meal;
}

export const MealDetailHeader: React.FC<MealDetailHeaderProps> = ({ meal }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: meal.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{meal.name}</Text>

          <View style={styles.info}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🌍 {meal.cuisine}</Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>🍽️ {meal.category}</Text>
            </View>
          </View>

          {meal.tags.length > 0 && (
            <View style={styles.tags}>
              {meal.tags.slice(0, 3).map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
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

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONSTANTS.SPACING.xs,
  },

  tag: {
    ...Typography.text90,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
  },
});
