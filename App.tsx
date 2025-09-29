import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext'; // Import AuthProvider

// Create a separate component for the auth-aware content
const AppContent: React.FC = () => {
  const { authState, user } = useAuth();

  console.log('🔍 App.tsx - Current authState:', authState);

  if (authState === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (authState === 'unauthenticated') {
    console.log('🔍 App.tsx - Showing LoginScreen');
    return <LoginScreen />;
  }

  console.log('🔍 App.tsx - Showing AppNavigator for user:', user?.display_name);
  return <AppNavigator />;
};

// Main App component wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
