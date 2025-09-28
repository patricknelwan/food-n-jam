import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotifyAuth } from '../../hooks/useSpotifyAuth';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen: React.FC = () => {
  const { login: spotifyLogin, isLoading, isReady } = useSpotifyAuth();
  const { login } = useAuth(); // This updates the auth state

  const handleSpotifyLogin = async () => {
    try {
      const result = await spotifyLogin();
      if ('user' in result) {
        // Success! Now update the auth state
        console.log('Login successful!');
        await login(); // This will trigger useAuth to refresh and detect the stored user
      } else {
        // Handle error
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Login Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>🎵 Food n' Jam</Text>
          <Text style={styles.subtitle}>
            Discover the perfect meal for your music taste
          </Text>
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>
            Connect your Spotify account to get personalized meal recommendations based on your music preferences
          </Text>

          <TouchableOpacity
            style={[styles.spotifyButton, (!isReady || isLoading) && styles.disabledButton]}
            onPress={handleSpotifyLogin}
            disabled={!isReady || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Continue with Spotify</Text>
            )}
          </TouchableOpacity>

          {!isReady && (
            <Text style={styles.loadingText}>
              Preparing Spotify authentication...
            </Text>
          )}

          {isLoading && (
            <Text style={styles.loadingText}>
              Logging in...
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to connect your Spotify account to discover music-inspired meals
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  spotifyButton: {
    backgroundColor: '#1DB954', // Spotify green
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    minWidth: 250,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
