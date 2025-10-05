// ============================================================================
// POLICY STACK NAVIGATOR
// Location: beneficiary-app-mobile/src/navigation/PolicyStack.tsx
// ============================================================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PolicyStackParamList } from './types';
import { View, Text } from 'react-native';

const Stack = createStackNavigator<PolicyStackParamList>();

// Placeholder screens
const PoliciesListScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Policies List - Coming Soon</Text>
  </View>
);

const PolicyDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Policy Detail - Coming Soon</Text>
  </View>
);

const PolicyDocumentsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Policy Documents - Coming Soon</Text>
  </View>
);

export const PolicyStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="PoliciesList" 
        component={PoliciesListScreen}
        options={{ title: 'البوليصات' }}
      />
      <Stack.Screen 
        name="PolicyDetail" 
        component={PolicyDetailScreen}
        options={{ title: 'تفاصيل البوليصة' }}
      />
      <Stack.Screen 
        name="PolicyDocuments" 
        component={PolicyDocumentsScreen}
        options={{ title: 'المستندات' }}
      />
    </Stack.Navigator>
  );
};

export default PolicyStack;
