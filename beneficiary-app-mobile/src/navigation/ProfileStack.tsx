import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen';
import LanguageSettingsScreen from '../screens/profile/LanguageSettingsScreen';

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'الملف الشخصي' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'تعديل الملف' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'الإشعارات' }} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} options={{ title: 'اللغة' }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
