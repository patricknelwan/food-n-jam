import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { theme } from '../../theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = theme.colors.primary,
  message,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    minHeight: 100,
  },
  message: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});
