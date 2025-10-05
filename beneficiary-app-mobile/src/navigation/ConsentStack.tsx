import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ConsentStackParamList } from './types';
import ConsentRequestsScreen from '../screens/consent/ConsentRequestsScreen';
import ConsentDetailScreen from '../screens/consent/ConsentDetailScreen';
import ConsentHistoryScreen from '../screens/consent/ConsentHistoryScreen';

const Stack = createStackNavigator<ConsentStackParamList>();

export const ConsentStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <Stack.Screen name="ConsentRequests" component={ConsentRequestsScreen} options={{ title: 'طلبات الموافقة' }} />
      <Stack.Screen name="ConsentDetail" component={ConsentDetailScreen} options={{ title: 'تفاصيل الموافقة' }} />
      <Stack.Screen name="ConsentHistory" component={ConsentHistoryScreen} options={{ title: 'السجل' }} />
    </Stack.Navigator>
  );
};

export default ConsentStack;
