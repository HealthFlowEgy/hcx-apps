// ============================================================================
// AUTH STACK NAVIGATOR
// Location: beneficiary-app-mobile/src/navigation/AuthStack.tsx
// ============================================================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Import screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen';
import KYCScreen from '../screens/auth/KYCScreen';
import RegistrationSuccessScreen from '../screens/auth/RegistrationSuccessScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
