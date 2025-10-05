import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ConsentStackParamList } from './types';
import { View, Text } from 'react-native';

const Stack = createStackNavigator<ConsentStackParamList>();

const ConsentRequestsScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Consent Requests</Text></View>;
const ConsentDetailScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Consent Detail</Text></View>;
const ConsentHistoryScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Consent History</Text></View>;

export const ConsentStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ConsentRequests" component={ConsentRequestsScreen} options={{ title: 'الموافقات' }} />
      <Stack.Screen name="ConsentDetail" component={ConsentDetailScreen} options={{ title: 'تفاصيل الموافقة' }} />
      <Stack.Screen name="ConsentHistory" component={ConsentHistoryScreen} options={{ title: 'السجل' }} />
    </Stack.Navigator>
  );
};

export default ConsentStack;
