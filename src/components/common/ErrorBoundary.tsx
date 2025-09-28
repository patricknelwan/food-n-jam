import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from 'react-native-ui-lib';
import { AppButton } from './AppButton';
import { UI_CONSTANTS } from '@utils/constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
    
    // In production, you might want to send this to a crash reporting service
    // like Sentry, Crashlytics, etc.
  }

  private handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. You can try restarting the app.
          </Text>
          
          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorTitle}>Error Details (Dev Only):</Text>
              <Text style={styles.errorText}>
                {this.state.error.toString()}
              </Text>
            </View>
          )}
          
          <AppButton
            label="Restart App"
            onPress={this.handleRestart}
            style={styles.button}
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.xl,
    backgroundColor: Colors.white,
  },
  
  title: {
    ...Typography.text40,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
    textAlign: 'center',
  },
  
  message: {
    ...Typography.text60,
    color: Colors.grey20,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: UI_CONSTANTS.SPACING.xl,
  },
  
  errorDetails: {
    backgroundColor: Colors.grey70,
    padding: UI_CONSTANTS.SPACING.md,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    marginBottom: UI_CONSTANTS.SPACING.xl,
    width: '100%',
  },
  
  errorTitle: {
    ...Typography.text70,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  errorText: {
    ...Typography.text80,
    color: Colors.grey30,
    fontFamily: 'monospace',
  },
  
  button: {
    minWidth: 150,
  },
});
