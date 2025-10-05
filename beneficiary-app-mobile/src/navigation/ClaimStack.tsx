import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ClaimStackParamList } from './types';
import { View, Text } from 'react-native';

const Stack = createStackNavigator<ClaimStackParamList>();

const ClaimsListScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Claims List</Text></View>;
const ClaimDetailScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Claim Detail</Text></View>;
const ClaimTimelineScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Claim Timeline</Text></View>;
const ClaimDocumentsScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Claim Documents</Text></View>;

export const ClaimStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ClaimsList" component={ClaimsListScreen} options={{ title: 'المطالبات' }} />
      <Stack.Screen name="ClaimDetail" component={ClaimDetailScreen} options={{ title: 'تفاصيل المطالبة' }} />
      <Stack.Screen name="ClaimTimeline" component={ClaimTimelineScreen} options={{ title: 'الجدول الزمني' }} />
      <Stack.Screen name="ClaimDocuments" component={ClaimDocumentsScreen} options={{ title: 'المستندات' }} />
    </Stack.Navigator>
  );
};

export default ClaimStack;
