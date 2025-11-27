import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';

interface AppCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  style?: any;
  variant?: 'default' | 'orange' | 'spotify';
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  subtitle,
  onPress,
  style,
  variant = 'default',
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View>
        <Text style={[styles.title, styles[`${variant}Title`]]}>{title}</Text>
        <Text style={[styles.subtitle, styles[`${variant}Subtitle`]]}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
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
  },

  default: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },

  orange: {
    backgroundColor: '#FF6B35', // Food orange
  },

  spotify: {
    backgroundColor: '#1DB954', // Spotify green
  },

  title: {
    ...Typography.text60,
    fontWeight: '600',
    marginBottom: 4,
  },

  defaultTitle: {
    color: Colors.grey10,
  },

  orangeTitle: {
    color: Colors.white,
  },

  spotifyTitle: {
    color: Colors.white,
  },

  subtitle: {
    ...Typography.text80,
    lineHeight: 18,
  },

  defaultSubtitle: {
    color: Colors.grey30,
  },

  orangeSubtitle: {
    color: Colors.white,
    opacity: 0.9,
  },

  spotifySubtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
});
