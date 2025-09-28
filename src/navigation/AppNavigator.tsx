import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './TabNavigator';
import { MealFlowNavigator } from './MealFlowNavigator';
import { PlaylistFlowNavigator } from './PlaylistFlowNavigator';
import { useAuth } from '@hooks/useAuth';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { authState, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authState === 'authenticated' ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="MealFlow" 
              component={MealFlowNavigator}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen 
              name="PlaylistFlow" 
              component={PlaylistFlowNavigator}
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
