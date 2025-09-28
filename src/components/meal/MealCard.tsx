import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import type { Meal } from '@types/meal';
import { UI_CONSTANTS } from '@utils/constants';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
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
      <Image
        source={{ uri: meal.image }}
        style={[styles.image, styles[`${size}Image`]]}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, styles[`${size}Title`]]} numberOfLines={2}>
            {meal.name}
          </Text>
          
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{meal.cuisine}</Text>
            </View>
            
            {meal.category && (
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={[styles.badgeText, styles.categoryBadgeText]}>
                  {meal.category}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {meal.tags.length > 0 && (
          <View style={styles.tags}>
            {meal.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
        )}
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
    width: 160,
  },
  largeCard: {
    width: '100%',
  },
  
  image: {
    backgroundColor: Colors.grey70,
  },
  
  smallImage: {
    height: 100,
  },
  mediumImage: {
    height: 120,
  },
  largeImage: {
    height: 200,
  },
  
  content: {
    padding: UI_CONSTANTS.SPACING.md,
  },
  
  header: {
    marginBottom: UI_CONSTANTS.SPACING.sm,
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
  
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONSTANTS.SPACING.xs,
  },
  
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: UI_CONSTANTS.SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  categoryBadge: {
    backgroundColor: Colors.grey60,
  },
  
  badgeText: {
    ...Typography.text90,
    color: Colors.white,
    fontWeight: '500',
  },
  
  categoryBadgeText: {
    color: Colors.white,
  },
  
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONSTANTS.SPACING.xs,
  },
  
  tag: {
    ...Typography.text90,
    color: Colors.grey20,
    fontStyle: 'italic',
  },
});
