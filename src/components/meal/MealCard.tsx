import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    image?: string;
    category?: string;
  };
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const MealCard: React.FC<MealCardProps> = ({ 
  meal, 
  onPress, 
  size = 'medium',
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, styles[size], style]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: meal.image || 'https://via.placeholder.com/150' }}
        style={[styles.image, styles[`${size}Image`]]}
      />
      <View style={styles.content}>
        <Text style={[styles.name, styles[`${size}Name`]]} numberOfLines={2}>
          {meal.name}
        </Text>
        {meal.category && (
          <Text style={[styles.category, styles[`${size}Category`]]}>
            {meal.category}
          </Text>
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
  },
  
  // Base sizes
  small: {
    padding: theme.spacing.sm,
    width: 140,
  },
  medium: {
    padding: theme.spacing.md,
    width: 160,
  },
  large: {
    padding: theme.spacing.md,
    // Full width for large cards in lists
  },
  
  // Base image
  image: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.gray100,
  },
  
  // Image sizes
  smallImage: {
    width: '100%',
    height: 80,
  },
  mediumImage: {
    width: '100%',
    height: 120,
  },
  largeImage: {
    width: '100%',
    height: 160,
  },
  
  content: {
    paddingHorizontal: theme.spacing.xs,
  },
  
  // Base name styles
  name: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  
  // Name sizes
  smallName: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * 1.3,
  },
  mediumName: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * 1.4,
  },
  largeName: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.fontSize.lg * 1.4,
  },
  
  // Base category styles
  category: {
    color: theme.colors.textSecondary,
  },
  
  // Category sizes
  smallCategory: {
    fontSize: theme.typography.fontSize.xs,
  },
  mediumCategory: {
    fontSize: theme.typography.fontSize.sm,
  },
  largeCategory: {
    fontSize: theme.typography.fontSize.sm,
  },
});
