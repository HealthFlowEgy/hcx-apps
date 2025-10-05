import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import ESHICCardScreen from '../screens/home/ESHICCardScreen';

const Stack = createStackNavigator<HomeStackParamList>();

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
