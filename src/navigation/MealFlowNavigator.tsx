import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MealSearchScreen } from '@screens/meal/MealSearchScreen';
import { MealDetailScreen } from '@screens/meal/MealDetailScreen';
import type { MealStackParamList } from '@app-types/navigation';

const Stack = createStackNavigator<MealStackParamList>();

export const MealFlowNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MealSearch" component={MealSearchScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
    </Stack.Navigator>
  );
};
