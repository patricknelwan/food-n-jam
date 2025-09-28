import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Colors, ButtonProps } from 'react-native-ui-lib';
import { UI_CONSTANTS } from '@utils/constants';

interface AppButtonProps extends Omit<ButtonProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle | ViewStyle[];
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: UI_CONSTANTS.BUTTON_BORDER_RADIUS,
    };

    const sizeStyles = {
      small: { height: 36, paddingHorizontal: 16 },
      medium: { height: 44, paddingHorizontal: 20 },
      large: { height: 56, paddingHorizontal: 24 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: Colors.primary,
        color: Colors.white,
      },
      secondary: {
        backgroundColor: Colors.grey60,
        color: Colors.white,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
        color: Colors.primary,
      },
    };

    return StyleSheet.flatten([
      baseStyle, 
      sizeStyles[size], 
      variantStyles[variant], 
      style
    ]);
  };

  return (
    <Button
      {...props}
      style={getButtonStyle()}
    />
  );
};
