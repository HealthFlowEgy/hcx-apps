// ============================================================================
// HOME SCREEN - Dashboard
// Location: beneficiary-app-mobile/src/screens/home/HomeScreen.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from '../../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeScreen'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activePolicies: 2,
    pendingClaims: 3,
    pendingConsents: 1,
    totalCoverage: '150,000',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const beneficiaryData = await AsyncStorage.getItem('beneficiaryData');
      if (beneficiaryData) {
        setBeneficiary(JSON.parse(beneficiaryData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>مرحباً</Text>
          <Text style={styles.userName}>{beneficiary?.fullName || 'المستخدم'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color="#007AFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ESHIC Card Quick Access */}
      <TouchableOpacity
        style={styles.eshicCard}
        onPress={() => navigation.navigate('ESHICCard')}
      >
        <View style={styles.eshicCardContent}>
          <View style={styles.eshicCardIcon}>
            <Icon name="card" size={40} color="#fff" />
          </View>
          <View style={styles.eshicCardText}>
            <Text style={styles.eshicCardTitle}>بطاقة ESHIC الرقمية</Text>
            <Text style={styles.eshicCardSubtitle}>اضغط لعرض البطاقة</Text>
          </View>
        </View>
        <Icon name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="document-text" size={32} color="#007AFF" />
          <Text style={styles.statValue}>{stats.activePolicies}</Text>
          <Text style={styles.statLabel}>بوليصات نشطة</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="clipboard" size={32} color="#FF9500" />
          <Text style={styles.statValue}>{stats.pendingClaims}</Text>
          <Text style={styles.statLabel}>مطالبات قيد المراجعة</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="shield-checkmark" size={32} color="#34C759" />
          <Text style={styles.statValue}>{stats.pendingConsents}</Text>
          <Text style={styles.statLabel}>موافقات معلقة</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="cash" size={32} color="#5856D6" />
          <Text style={styles.statValue}>{stats.totalCoverage}</Text>
          <Text style={styles.statLabel}>إجمالي التغطية</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Icon name="add-circle" size={24} color="#007AFF" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>تقديم مطالبة جديدة</Text>
            <Text style={styles.actionSubtitle}>قدم مطالبة طبية جديدة</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Icon name="search" size={24} color="#34C759" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>البحث عن مستشفى</Text>
            <Text style={styles.actionSubtitle}>ابحث عن مستشفيات الشبكة</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <View style={styles.actionIcon}>
            <Icon name="call" size={24} color="#F44336" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>اتصال طوارئ</Text>
            <Text style={styles.actionSubtitle}>16123</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>النشاط الأخير</Text>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Icon name="checkmark-circle" size={24} color="#34C759" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>تمت الموافقة على المطالبة</Text>
            <Text style={styles.activitySubtitle}>HC-2024-001234</Text>
            <Text style={styles.activityTime}>منذ ساعتين</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Icon name="time" size={24} color="#FF9500" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>طلب موافقة جديد</Text>
            <Text style={styles.activitySubtitle}>يتطلب موافقتك</Text>
            <Text style={styles.activityTime}>منذ 5 ساعات</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Icon name="document-text" size={24} color="#007AFF" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>تجديد البوليصة</Text>
            <Text style={styles.activitySubtitle}>HI-2024-001234</Text>
            <Text style={styles.activityTime}>منذ يوم واحد</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eshicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#667eea',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  eshicCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eshicCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  eshicCardText: {
    flex: 1,
  },
  eshicCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eshicCardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    margin: '1%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
