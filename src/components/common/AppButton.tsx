import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.base,
    styles[size],
    styles[variant],
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
  ];

  const spinnerColor = variant === 'outline' ? theme.colors.primary : theme.colors.textInverse;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },

  // Sizes
  small: {
    height: 36,
    paddingHorizontal: theme.spacing.lg,
  },
  medium: {
    height: 48,
    paddingHorizontal: theme.spacing.xl,
  },
  large: {
    height: 56,
    paddingHorizontal: theme.spacing['2xl'],
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  // Text base
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },

  // Text sizes
  smallText: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * 1.2,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * 1.2,
  },
  largeText: {
    fontSize: theme.typography.fontSize.lg,
    lineHeight: theme.typography.fontSize.lg * 1.2,
  },

  // Text variants
  primaryText: {
    color: theme.colors.textInverse,
  },
  secondaryText: {
    color: theme.colors.textInverse,
  },
  outlineText: {
    color: theme.colors.primary,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
