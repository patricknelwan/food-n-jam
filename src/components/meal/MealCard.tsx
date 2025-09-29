import React from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text } from 'react-native';
import { theme } from '../../theme';
import type { Meal } from '../../types/meal';

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
        source={{ uri: meal.image || 'https://via.placeholder.com/300' }}
        style={[styles.image, styles[`${size}Image`]]}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, styles[`${size}Title`]]} numberOfLines={2}>
          {meal.name}
        </Text>
        
        <View style={styles.metadata}>
          {meal.cuisine && (
            <View style={[styles.badge, styles.cuisineBadge]}>
              <Text style={styles.badgeText}>{meal.cuisine}</Text>
            </View>
          )}
          
          {meal.category && (
            <View style={[styles.badge, styles.categoryBadge]}>
              <Text style={styles.badgeText}>{meal.category}</Text>
            </View>
          )}
        </View>

        {meal.tags && meal.tags.length > 0 && (
          <View style={styles.tags}>
            {meal.tags.slice(0, 3).map((tag, index) => (
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
    overflow: 'hidden',
  },
  
  // Card sizes
  smallCard: {
    width: 140,
  },
  mediumCard: {
    width: 160,
  },
  largeCard: {
    width: '100%',
  },
  
  // Image styles
  image: {
    backgroundColor: theme.colors.gray200,
    width: '100%',
  },
  smallImage: {
    height: 100,
  },
  mediumImage: {
    height: 120,
  },
  largeImage: {
    height: 180,
  },
  
  content: {
    padding: theme.spacing.md,
  },
  
  // Title styles
  title: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  smallTitle: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * 1.3,
  },
  mediumTitle: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * 1.3,
  },
  largeTitle: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.fontSize.lg * 1.3,
  },
  
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  
  cuisineBadge: {
    backgroundColor: theme.colors.primary,
  },
  
  categoryBadge: {
    backgroundColor: theme.colors.secondary,
  },
  
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  
  tag: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
});
