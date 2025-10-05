import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PolicyStackParamList } from './types';
import PoliciesListScreen from '../screens/policies/PoliciesListScreen';
import PolicyDetailScreen from '../screens/policies/PolicyDetailScreen';
import PolicyDocumentsScreen from '../screens/policies/PolicyDocumentsScreen';

const Stack = createStackNavigator<PolicyStackParamList>();

export const PolicyStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <Stack.Screen name="PoliciesList" component={PoliciesListScreen} options={{ title: 'البوليصات' }} />
      <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} options={{ title: 'تفاصيل البوليصة' }} />
      <Stack.Screen name="PolicyDocuments" component={PolicyDocumentsScreen} options={{ title: 'المستندات' }} />
    </Stack.Navigator>
  );
};

export default PolicyStack;
