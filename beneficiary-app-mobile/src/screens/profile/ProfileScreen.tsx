import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileStackParamList } from '../../navigation/types';

type Props = {
  navigation: StackNavigationProp<ProfileStackParamList, 'ProfileScreen'>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    // Navigation will be handled by RootNavigator
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={60} color="#007AFF" />
        </View>
        <Text style={styles.name}>أحمد محمد علي</Text>
        <Text style={styles.nationalId}>12345678901234</Text>
      </View>
      
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="create" size={24} color="#007AFF" />
          <Text style={styles.menuText}>تعديل الملف الشخصي</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Icon name="notifications" size={24} color="#007AFF" />
          <Text style={styles.menuText}>إعدادات الإشعارات</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('LanguageSettings')}
        >
          <Icon name="language" size={24} color="#007AFF" />
          <Text style={styles.menuText}>اللغة</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#fff', padding: 30, alignItems: 'center' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  nationalId: { fontSize: 16, color: '#666', marginTop: 5 },
  section: { backgroundColor: '#fff', marginTop: 20, padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuText: { flex: 1, fontSize: 16, color: '#000', marginLeft: 15 },
  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F44336', margin: 20, padding: 18, borderRadius: 12 },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});

export default ProfileScreen;
