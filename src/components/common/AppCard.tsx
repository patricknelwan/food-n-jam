import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Card, Colors, Typography } from 'react-native-ui-lib';
import { UI_CONSTANTS } from '@utils/constants';

interface AppCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  style?: any;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outline' | 'elevated';
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  style,
  size = 'medium',
  variant = 'default',
}) => {
  const cardStyle = [
    styles.card,
    styles[`${size}Card`],
    styles[`${variant}Card`],
    style,
  ];

  const content = (
    <View style={styles.content}>
      {icon && (
        <View style={styles.iconContainer}>
          <Text style={[styles.icon, styles[`${size}Icon`]]}>{icon}</Text>
        </View>
      )}
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles[`${size}Title`]]} numberOfLines={2}>
          {title}
        </Text>
        
        {subtitle && (
          <Text style={[styles.subtitle, styles[`${size}Subtitle`]]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    padding: UI_CONSTANTS.SPACING.md,
  },
  
  // Size variants
  smallCard: {
    padding: UI_CONSTANTS.SPACING.sm,
  },
  mediumCard: {
    padding: UI_CONSTANTS.SPACING.md,
  },
  largeCard: {
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  // Style variants
  defaultCard: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlineCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.grey60,
  },
  elevatedCard: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  iconContainer: {
    marginRight: UI_CONSTANTS.SPACING.md,
  },
  
  icon: {
    textAlign: 'center',
  },
  
  smallIcon: {
    fontSize: 24,
  },
  mediumIcon: {
    fontSize: 32,
  },
  largeIcon: {
    fontSize: 40,
  },
  
  textContainer: {
    flex: 1,
  },
  
  title: {
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  
  smallTitle: {
    ...Typography.text70,
  },
  mediumTitle: {
    ...Typography.text60,
  },
  largeTitle: {
    ...Typography.text50,
  },
  
  subtitle: {
    color: Colors.grey30,
  },
  
  smallSubtitle: {
    ...Typography.text90,
  },
  mediumSubtitle: {
    ...Typography.text80,
  },
  largeSubtitle: {
    ...Typography.text70,
  },
});
