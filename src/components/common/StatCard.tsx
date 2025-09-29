import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Colors, Typography } from 'react-native-ui-lib';

interface StatCardProps {
  title: string;
  subtitle: string;
  style?: any;
  variant?: 'default' | 'primary' | 'success' | 'orange';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  subtitle,
  style,
  variant = 'default',
}) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      <Text style={[styles.title, styles[`${variant}Title`]]}>{title}</Text>
      <Text style={[styles.subtitle, styles[`${variant}Subtitle`]]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  
  default: {
    backgroundColor: Colors.white,
    borderTopWidth: 4,
    borderTopColor: Colors.primary,
  },
  
  primary: {
    backgroundColor: Colors.primary,
  },
  
  success: {
    backgroundColor: '#22c55e', // Green
  },
  
  orange: {
    backgroundColor: '#FF6B35', // Orange
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  
  defaultTitle: {
    color: Colors.primary,
  },
  
  primaryTitle: {
    color: Colors.white,
  },
  
  successTitle: {
    color: Colors.white,
  },
  
  orangeTitle: {
    color: Colors.white,
  },
  
  subtitle: {
    ...Typography.text70,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  
  defaultSubtitle: {
    color: Colors.grey30,
  },
  
  primarySubtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
  
  successSubtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
  
  orangeSubtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
});
