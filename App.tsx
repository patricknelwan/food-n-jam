// App.tsx or wherever you handle navigation
import React from 'react';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuth } from './src/hooks/useAuth';
import { View, Text } from 'react-native';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <AppNavigator />;
}
