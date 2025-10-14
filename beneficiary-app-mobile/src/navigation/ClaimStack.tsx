import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ClaimStackParamList } from './types';
import ClaimsListScreen from '../screens/claims/ClaimsListScreen';
import ClaimDetailScreen from '../screens/claims/ClaimDetailScreen';
import ClaimTimelineScreen from '../screens/claims/ClaimTimelineScreen';
import ClaimDocumentsScreen from '../screens/claims/ClaimDocumentsScreen';

const Stack = createStackNavigator<ClaimStackParamList>();

export const ClaimStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <Stack.Screen name="ClaimsList" component={ClaimsListScreen} options={{ title: 'المطالبات' }} />
      <Stack.Screen name="ClaimDetail" component={ClaimDetailScreen} options={{ title: 'تفاصيل المطالبة' }} />
      <Stack.Screen name="ClaimTimeline" component={ClaimTimelineScreen} options={{ title: 'الجدول الزمني' }} />
      <Stack.Screen name="ClaimDocuments" component={ClaimDocumentsScreen} options={{ title: 'المستندات' }} />
    </Stack.Navigator>
  );
};

export default ClaimStack;
