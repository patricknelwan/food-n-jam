import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@screens/main/HomeScreen';
import { FavoritesScreen } from '@screens/main/FavoritesScreen';
import { ProfileScreen } from '@screens/main/ProfileScreen';
import { Colors, TabController } from 'react-native-ui-lib';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.grey60,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey40,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            // We'll use icons from react-native-ui-lib or expo/vector-icons later
            <TabController.TabBarItem 
              label="Home"
              selectedColor={color}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <TabController.TabBarItem 
              label="Favorites"
              selectedColor={color}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabController.TabBarItem 
              label="Profile"
              selectedColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
