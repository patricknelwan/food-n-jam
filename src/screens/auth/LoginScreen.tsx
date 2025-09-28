import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { View, Text, Button, Colors, Typography } from 'react-native-ui-lib';
import { useAuth } from '@hooks/useAuth';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { APP_CONFIG } from '@utils/constants';
import type { AuthStackScreenProps } from '@navigation/types';

type LoginScreenProps = AuthStackScreenProps<'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { login, isLoading, error } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSpotifyLogin = async () => {
    try {
      setIsLoggingIn(true);
      const success = await login();
      
      if (!success && error) {
        Alert.alert('Login Failed', error);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading || isLoggingIn) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🍽️🎵</Text>
        </View>
        
        <Text style={styles.title}>{APP_CONFIG.name}</Text>
        <Text style={styles.subtitle}>Pair your meals with the perfect playlist</Text>
      </View>

      <View style={styles.illustration}>
        {/* Illustration placeholder - we'll add actual image later */}
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationText}>🍜 + 🎶 = ❤️</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Continue with Spotify"
          backgroundColor={Colors.green30}
          color={Colors.white}
          borderRadius={12}
          size="large"
          onPress={handleSpotifyLogin}
          disabled={isLoggingIn}
          style={styles.spotifyButton}
        />
        
        <Text style={styles.disclaimer}>
          By continuing, you agree to connect your Spotify account and allow us to access your playlists.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    ...Typography.text30,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.text70,
    color: Colors.grey30,
    textAlign: 'center',
  },
  illustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 20,
    backgroundColor: Colors.grey70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    fontSize: 48,
  },
  footer: {
    alignItems: 'center',
  },
  spotifyButton: {
    width: '100%',
    height: 56,
    marginBottom: 20,
  },
  disclaimer: {
    ...Typography.text90,
    color: Colors.grey30,
    textAlign: 'center',
    lineHeight: 18,
  },
});
