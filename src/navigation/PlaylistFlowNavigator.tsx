import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PlaylistListScreen } from '@screens/playlist/PlaylistListScreen';
import { PlaylistDetailScreen } from '@screens/playlist/PlaylistDetailScreen';
import type { PlaylistStackParamList } from './types';

const Stack = createStackNavigator<PlaylistStackParamList>();

export const PlaylistFlowNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PlaylistList" component={PlaylistListScreen} />
      <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
    </Stack.Navigator>
  );
};
