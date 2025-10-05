// ============================================================================
// MAIN TAB NAVIGATOR
// Location: beneficiary-app-mobile/src/navigation/MainTabs.tsx
// ============================================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import Icon from 'react-native-vector-icons/Ionicons';

// Import stack navigators
import { HomeStack } from './HomeStack';
import { PolicyStack } from './PolicyStack';
import { ClaimStack } from './ClaimStack';
import { ConsentStack } from './ConsentStack';
import { ProfileStack } from './ProfileStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Policies" 
        component={PolicyStack}
        options={{
          title: 'البوليصات',
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Claims" 
        component={ClaimStack}
        options={{
          title: 'المطالبات',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Consent" 
        component={ConsentStack}
        options={{
          title: 'الموافقات',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shield-checkmark" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{
          title: 'الملف',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
