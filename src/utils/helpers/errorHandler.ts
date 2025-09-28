import { Alert } from 'react-native';

export type ErrorType = 
  | 'network'
  | 'auth'
  | 'validation'
  | 'api'
  | 'storage'
  | 'spotify'
  | 'meal'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

class ErrorHandler {
  // Log error for debugging
  private logError(error: AppError): void {
    console.error('App Error:', {
      type: error.type,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      details: error.details,
    });
    
    // In production, you might want to send this to a crash reporting service
    // like Sentry, Crashlytics, etc.
  }

  // Create standardized error
  createError(
    type: ErrorType,
    message: string,
    code?: string,
    details?: any
  ): AppError {
    const error: AppError = {
      type,
      message,
      code,
      details,
      timestamp: new Date(),
    };

    this.logError(error);
    return error;
  }

  // Handle network errors
  handleNetworkError(error: any): AppError {
    let message = 'Network error occurred. Please check your connection.';
    
    if (error.code === 'NETWORK_ERROR') {
      message = 'Unable to connect to the internet. Please check your network connection.';
    } else if (error.response?.status === 429) {
      message = 'Too many requests. Please wait a moment and try again.';
    } else if (error.response?.status >= 500) {
      message = 'Server error. Please try again later.';
    }

    return this.createError('network', message, error.code, error);
  }

  // Handle authentication errors
  handleAuthError(error: any): AppError {
    let message = 'Authentication failed. Please try logging in again.';
    
    if (error.message?.includes('refresh')) {
      message = 'Session expired. Please log in again.';
    } else if (error.message?.includes('denied')) {
      message = 'Access denied. Please check your permissions.';
    }

    return this.createError('auth', message, error.code, error);
  }

  // Handle Spotify API errors
  handleSpotifyError(error: any): AppError {
    let message = 'Spotify connection error. Please try again.';
    
    if (error.response?.status === 401) {
      message = 'Spotify authentication expired. Please reconnect your account.';
    } else if (error.response?.status === 403) {
      message = 'Spotify access denied. Please check your account permissions.';
    } else if (error.response?.status === 429) {
      message = 'Spotify rate limit exceeded. Please wait a moment.';
    }

    return this.createError('spotify', message, error.response?.status?.toString(), error);
  }

  // Handle meal API errors
  handleMealError(error: any): AppError {
    let message = 'Unable to load meals. Please try again.';
    
    if (error.response?.status === 404) {
      message = 'No meals found for your search.';
    } else if (error.message?.includes('timeout')) {
      message = 'Request timed out. Please try again.';
    }

    return this.createError('meal', message, error.code, error);
  }

  // Handle validation errors
  handleValidationError(field: string, issue: string): AppError {
    const message = `${field}: ${issue}`;
    return this.createError('validation', message, 'VALIDATION_ERROR', { field, issue });
  }

  // Handle storage errors
  handleStorageError(error: any): AppError {
    let message = 'Storage error occurred. Please try again.';
    
    if (error.message?.includes('quota')) {
      message = 'Storage is full. Please free up some space.';
    } else if (error.message?.includes('permission')) {
      message = 'Storage permission denied.';
    }

    return this.createError('storage', message, error.code, error);
  }

  // Generic error handler
  handleError(error: any, context?: string): AppError {
    // Try to determine error type from context or error properties
    if (context?.includes('spotify') || error.message?.includes('spotify')) {
      return this.handleSpotifyError(error);
    }
    
    if (context?.includes('meal') || error.message?.includes('meal')) {
      return this.handleMealError(error);
    }
    
    if (context?.includes('auth') || error.message?.includes('auth')) {
      return this.handleAuthError(error);
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
      return this.handleNetworkError(error);
    }
    
    if (error.message?.includes('storage')) {
      return this.handleStorageError(error);
    }

    // Default to unknown error
    return this.createError(
      'unknown',
      error.message || 'An unexpected error occurred',
      error.code,
      error
    );
  }

  // Show user-friendly error alert
  showErrorAlert(error: AppError, title?: string): void {
    const alertTitle = title || this.getErrorTitle(error.type);
    
    Alert.alert(
      alertTitle,
      error.message,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  }

  // Show error with retry option
  showRetryAlert(
    error: AppError,
    onRetry: () => void,
    title?: string
  ): void {
    const alertTitle = title || this.getErrorTitle(error.type);
    
    Alert.alert(
      alertTitle,
      error.message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: onRetry }
      ]
    );
  }

  // Get appropriate title for error type
  private getErrorTitle(type: ErrorType): string {
    const titles: Record<ErrorType, string> = {
      network: 'Connection Error',
      auth: 'Authentication Error',
      spotify: 'Spotify Error',
      meal: 'Meal Loading Error',
      validation: 'Validation Error',
      storage: 'Storage Error',
      api: 'API Error',
      unknown: 'Error',
    };

    return titles[type] || 'Error';
  }

  // Check if error is recoverable
  isRecoverable(error: AppError): boolean {
    const recoverableTypes: ErrorType[] = ['network', 'api', 'meal', 'spotify'];
    return recoverableTypes.includes(error.type);
  }

  // Get user-friendly message for common errors
  getFriendlyMessage(error: AppError): string {
    const friendlyMessages: Partial<Record<ErrorType, string>> = {
      network: 'Please check your internet connection and try again.',
      auth: 'Please log out and log back in to fix this issue.',
      spotify: 'Try reconnecting your Spotify account in settings.',
      meal: 'Try searching for a different meal or check your connection.',
      storage: 'Try clearing some app data or restarting the app.',
    };

    return friendlyMessages[error.type] || error.message;
  }
}

export const errorHandler = new ErrorHandler();
