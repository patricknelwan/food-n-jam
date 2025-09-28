import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Colors, Typography } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import type { AuthStackScreenProps } from '@navigation/types';
import { APP_CONFIG } from '@utils/constants';

type SplashScreenProps = AuthStackScreenProps<'Splash'>;

export const SplashScreen: React.FC<SplashScreenProps> = () => {
  const navigation = useNavigation<SplashScreenProps['navigation']>();

  useEffect(() => {
    // Auto-navigate to login after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder - we'll add actual logo later */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🍽️🎵</Text>
        </View>
        
        <Text style={styles.title}>{APP_CONFIG.name}</Text>
        <Text style={styles.tagline}>Pair your meals with the perfect playlist</Text>
      </View>
      
      <Text style={styles.version}>v{APP_CONFIG.version}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    ...Typography.text30,
    color: Colors.white,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.text70,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  version: {
    ...Typography.text90,
    color: Colors.white,
    opacity: 0.7,
    position: 'absolute',
    bottom: 40,
  },
});
