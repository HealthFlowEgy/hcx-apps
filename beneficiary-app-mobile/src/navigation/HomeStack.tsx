// ============================================================================
// HOME STACK NAVIGATOR
// Location: beneficiary-app-mobile/src/navigation/HomeStack.tsx
// ============================================================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from './types';
import { View, Text } from 'react-native';

const Stack = createStackNavigator<HomeStackParamList>();

// Placeholder screens (will be implemented)
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen - Coming Soon</Text>
  </View>
);

const ESHICCardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>ESHIC Card Screen - Coming Soon</Text>
  </View>
);

export const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'الرئيسية' }}
      />
      <Stack.Screen 
        name="ESHICCard" 
        component={ESHICCardScreen}
        options={{ title: 'بطاقة ESHIC' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
