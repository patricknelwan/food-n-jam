import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotifyAuth } from '@hooks/useSpotifyAuth';
import { useAuth } from '@hooks/useAuth';
import { theme } from '../../theme';

export const LoginScreen: React.FC = () => {
  const { login: spotifyLogin, isLoading, isReady } = useSpotifyAuth();
  const { login } = useAuth();

  const handleSpotifyLogin = async () => {
    try {
      const result = await spotifyLogin();
      if ('user' in result) {
        console.log('Login successful!');
        await login();
      } else {
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
            style={[
              styles.spotifyButton, 
              (!isReady || isLoading) && styles.disabledButton
            ]}
            onPress={handleSpotifyLogin}
            disabled={!isReady || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.textInverse} size="small" />
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
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing['6xl'],
  },
  title: {
    ...theme.typography.textStyles.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.textStyles.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...theme.typography.textStyles.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  spotifyButton: {
    backgroundColor: theme.colors.spotifyGreen,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing['2xl'],
    minWidth: 280,
    ...theme.shadows.medium,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    ...theme.typography.textStyles.button,
    color: theme.colors.textInverse,
  },
  loadingText: {
    ...theme.typography.textStyles.caption,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.textStyles.small,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal,
  },
});
