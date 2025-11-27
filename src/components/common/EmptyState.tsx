import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { AppButton } from './AppButton';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'search' | 'error' | 'empty' | 'loading';
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,

  onAction,
  type = 'empty',
  icon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content} center>
        <View style={[styles.iconContainer, styles[`${type}Icon`]]}>
          {icon ? (
            <Ionicons name={icon as any} size={32} color={Colors.white} />
          ) : (
            <Text style={styles.iconText}>{getIconText(type)}</Text>
          )}
        </View>
        <Text style={styles.title} center>
          {title}
        </Text>
        <Text style={styles.message} center>
          {message}
        </Text>

        {actionLabel && onAction && (
          <AppButton
            label={actionLabel}
            onPress={onAction}
            variant="outline"
            style={styles.action}
          />
        )}
      </View>
    </View>
  );
};

const getIconText = (type: string) => {
  switch (type) {
    case 'search':
      return 'SEARCH';
    case 'error':
      return 'ERROR';
    case 'empty':
      return 'EMPTY';
    case 'loading':
      return 'LOADING';
    default:
      return 'INFO';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    minHeight: 300,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchIcon: {
    backgroundColor: Colors.blue70,
  },
  errorIcon: {
    backgroundColor: Colors.red70,
  },
  emptyIcon: {
    backgroundColor: Colors.grey60,
  },
  loadingIcon: {
    backgroundColor: Colors.primary,
  },
  iconText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    ...Typography.text50,
    color: Colors.grey10,
    marginBottom: 16,
    fontWeight: '600',
  },
  message: {
    ...Typography.text70,
    color: Colors.grey30,
    lineHeight: 22,
    marginBottom: 32,
  },
  action: {
    marginTop: 16,
    minWidth: 140,
  },
});
