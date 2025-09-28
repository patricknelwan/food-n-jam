import React from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text, Colors, Typography, Avatar } from 'react-native-ui-lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '@components/common/AppButton';
import { AppCard } from '@components/common/AppCard';
import { useAuth } from '@hooks/useAuth';
import { useFavorites } from '@hooks/useFavorites';
import { UI_CONSTANTS, APP_CONFIG } from '@utils/constants';
import type { MainTabScreenProps } from '../../navigation/types';

type ProfileScreenProps = MainTabScreenProps<'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, logout } = useAuth();
  const { stats } = useFavorites();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleSpotifySettings = () => {
    Alert.alert(
      'Spotify Connection',
      `You're currently connected to Spotify as ${user?.display_name || 'Unknown User'}. To change your Spotify account, you'll need to logout and login again.`,
      [
        { text: 'OK' },
        { text: 'Logout & Reconnect', onPress: logout }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      `About ${APP_CONFIG.name}`,
      `Version ${APP_CONFIG.version}\n\nPair your meals with the perfect playlist! Discover new music through food and new recipes through your favorite songs.\n\nMade with ❤️ for food and music lovers.`,
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We\'d love to hear your thoughts! Feature requests, bug reports, or general feedback are all welcome.',
      [
        { text: 'Cancel' },
        { text: 'Email Us', onPress: () => {
          // TODO: Implement email feedback
          Alert.alert('Coming Soon', 'Email feedback will be available in a future update!');
        }}
      ]
    );
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Avatar
              source={user?.avatar_url ? { uri: user.avatar_url } : undefined}
              label={user?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              size={80}
              backgroundColor={Colors.primary}
              labelColor={Colors.white}
            />
            
            <View style={styles.userInfo}>
              <Text style={styles.displayName}>
                {user?.display_name || 'Music Lover'}
              </Text>
              <Text style={styles.email}>
                {user?.email || 'Connected via Spotify'}
              </Text>
              <Text style={styles.memberSince}>
                Member since {formatMemberSince(user?.created_at || new Date().toISOString())}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Journey</Text>
          
          <View style={styles.statsGrid}>
            <AppCard
              title={stats.totalPairings.toString()}
              subtitle="Saved Pairings"
              icon="❤️"
              size="small"
              style={styles.statCard}
            />
            
            <AppCard
              title={stats.uniqueMeals.toString()}
              subtitle="Meals Discovered"
              icon="🍽️"
              size="small"
              style={styles.statCard}
            />
            
            <AppCard
              title={stats.uniquePlaylists.toString()}
              subtitle="Playlists Paired"
              icon="🎵"
              size="small"
              style={styles.statCard}
            />
            
            {stats.topCuisine && (
              <AppCard
                title={stats.topCuisine}
                subtitle="Favorite Cuisine"
                icon="🌍"
                size="small"
                style={styles.statCard}
              />
            )}
          </View>
          
          {stats.totalPairings === 0 && (
            <View style={styles.encouragement}>
              <Text style={styles.encouragementText}>
                Start pairing meals with music to see your stats here! 🚀
              </Text>
            </View>
          )}
        </View>

        {/* Account & Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Account & Settings</Text>
          
          <View style={styles.settingsList}>
            <AppCard
              title="Spotify Connection"
              subtitle="Manage your Spotify account"
              icon="🎧"
              onPress={handleSpotifySettings}
              style={styles.settingCard}
            />
            
            <AppCard
              title="Send Feedback"
              subtitle="Help us improve the app"
              icon="💬"
              onPress={handleFeedback}
              style={styles.settingCard}
            />
            
            <AppCard
              title="About"
              subtitle="App version and information"
              icon="ℹ️"
              onPress={handleAbout}
              style={styles.settingCard}
            />
          </View>
        </View>

        {/* Achievement Section (if user has pairings) */}
        {stats.totalPairings > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Achievements</Text>
            
            <View style={styles.achievementsList}>
              {stats.totalPairings >= 1 && (
                <View style={styles.achievement}>
                  <Text style={styles.achievementIcon}>🎉</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>First Pairing</Text>
                    <Text style={styles.achievementDesc}>Saved your first meal + music combo</Text>
                  </View>
                </View>
              )}
              
              {stats.totalPairings >= 5 && (
                <View style={styles.achievement}>
                  <Text style={styles.achievementIcon}>⭐</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Getting Started</Text>
                    <Text style={styles.achievementDesc}>Saved 5 different pairings</Text>
                  </View>
                </View>
              )}
              
              {stats.totalPairings >= 10 && (
                <View style={styles.achievement}>
                  <Text style={styles.achievementIcon}>🔥</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>On Fire</Text>
                    <Text style={styles.achievementDesc}>Reached 10 saved pairings</Text>
                  </View>
                </View>
              )}
              
              {stats.uniqueMeals >= 10 && (
                <View style={styles.achievement}>
                  <Text style={styles.achievementIcon}>🍽️</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>Food Explorer</Text>
                    <Text style={styles.achievementDesc}>Discovered 10+ different meals</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Logout */}
        <View style={styles.section}>
          <AppButton
            label="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey80,
  },
  
  header: {
    backgroundColor: Colors.white,
    padding: UI_CONSTANTS.SPACING.lg,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  userInfo: {
    marginLeft: UI_CONSTANTS.SPACING.lg,
    flex: 1,
  },
  
  displayName: {
    ...Typography.text50,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  email: {
    ...Typography.text70,
    color: Colors.grey20,
    marginBottom: UI_CONSTANTS.SPACING.xs,
  },
  
  memberSince: {
    ...Typography.text80,
    color: Colors.grey40,
  },
  
  section: {
    padding: UI_CONSTANTS.SPACING.lg,
  },
  
  sectionTitle: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: UI_CONSTANTS.SPACING.md,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONSTANTS.SPACING.md,
  },
  
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  
  encouragement: {
    marginTop: UI_CONSTANTS.SPACING.md,
    padding: UI_CONSTANTS.SPACING.md,
    backgroundColor: Colors.grey70,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
  },
  
  encouragementText: {
    ...Typography.text70,
    color: Colors.grey30,
    textAlign: 'center',
  },
  
  settingsList: {
    gap: UI_CONSTANTS.SPACING.sm,
  },
  
  settingCard: {
    marginBottom: 0,
  },
  
  achievementsList: {
    gap: UI_CONSTANTS.SPACING.md,
  },
  
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: UI_CONSTANTS.SPACING.md,
    borderRadius: UI_CONSTANTS.CARD_BORDER_RADIUS,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  achievementIcon: {
    fontSize: 32,
    marginRight: UI_CONSTANTS.SPACING.md,
  },
  
  achievementInfo: {
    flex: 1,
  },
  
  achievementTitle: {
    ...Typography.text60,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  
  achievementDesc: {
    ...Typography.text80,
    color: Colors.grey30,
  },
  
  logoutButton: {
    width: '100%',
  },
});
