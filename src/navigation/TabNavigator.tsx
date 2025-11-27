import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@screens/main/HomeScreen';
import { FavoritesScreen } from '@screens/main/FavoritesScreen';
import { ProfileScreen } from '@screens/main/ProfileScreen';
import type { MainTabParamList } from '@app-types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey30,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.grey70,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
