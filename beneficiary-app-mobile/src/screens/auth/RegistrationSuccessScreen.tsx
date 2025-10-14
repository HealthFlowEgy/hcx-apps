// ============================================================================
// REGISTRATION SUCCESS SCREEN
// Location: beneficiary-app-mobile/src/screens/auth/RegistrationSuccessScreen.tsx
// ============================================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';

type RegistrationSuccessNavigationProp = StackNavigationProp<RootStackParamList, 'RegistrationSuccess'>;
type RegistrationSuccessRouteProp = RouteProp<RootStackParamList, 'RegistrationSuccess'>;

interface Props {
  navigation: RegistrationSuccessNavigationProp;
  route: RegistrationSuccessRouteProp;
}

const RegistrationSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { beneficiary, eshicCard } = route.params;
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    // Save data to AsyncStorage
    saveData();
    
    // Animate success icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('beneficiaryData', JSON.stringify(beneficiary));
      await AsyncStorage.setItem('eshicCard', JSON.stringify(eshicCard));
      if (beneficiary.token) {
        await AsyncStorage.setItem('authToken', beneficiary.token);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleContinue = () => {
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Icon name="checkmark-circle" size={120} color="#4CAF50" />
        </Animated.View>

        <Text style={styles.title}>تم التسجيل بنجاح!</Text>
        <Text style={styles.subtitle}>
          مرحباً بك في نظام التأمين الصحي
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="person" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>الاسم</Text>
              <Text style={styles.infoValue}>{beneficiary.fullName}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="card" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>رقم الهوية</Text>
              <Text style={styles.infoValue}>{beneficiary.nationalId}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="shield-checkmark" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>رقم بطاقة ESHIC</Text>
              <Text style={styles.infoValue}>{eshicCard?.cardNumber || 'قيد الإصدار'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>يمكنك الآن:</Text>
          
          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>عرض بطاقة التأمين الرقمية</Text>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>إدارة بوليصات التأمين</Text>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>تتبع المطالبات الصحية</Text>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>إدارة الموافقات الطبية</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>ابدأ الاستخدام</Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default RegistrationSuccessScreen;
