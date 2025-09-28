import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
  color = Colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  message: {
    ...Typography.text70,
    color: Colors.grey30,
    marginTop: 16,
    textAlign: 'center',
  },
});
