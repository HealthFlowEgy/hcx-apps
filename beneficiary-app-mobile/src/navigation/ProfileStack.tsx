import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList } from './types';
import { View, Text } from 'react-native';

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Profile</Text></View>;
const EditProfileScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Edit Profile</Text></View>;
const NotificationSettingsScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Notifications</Text></View>;
const LanguageSettingsScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Language</Text></View>;

export const ProfileStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'الملف الشخصي' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'تعديل الملف' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'الإشعارات' }} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} options={{ title: 'اللغة' }} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
