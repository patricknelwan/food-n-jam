import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { AppButton } from './AppButton';
import { UI_CONSTANTS } from '@utils/constants';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🔍',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {actionLabel && onAction && (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          style={styles.button}
          size="medium"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: UI_CONSTANTS.SPACING.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: UI_CONSTANTS.SPACING.lg,
  },
  title: {
    ...Typography.text50,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.sm,
  },
  message: {
    ...Typography.text70,
    color: Colors.grey30,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: UI_CONSTANTS.SPACING.lg,
  },
  button: {
    minWidth: 120,
  },
});
