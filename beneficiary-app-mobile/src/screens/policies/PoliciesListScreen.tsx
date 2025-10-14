// ============================================================================
// POLICIES LIST SCREEN
// Location: beneficiary-app-mobile/src/screens/policies/PoliciesListScreen.tsx
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { PolicyStackParamList } from '../../navigation/types';
import HCXEnhancedService from '../../services/hcx.enhanced.service';

type PoliciesListNavigationProp = StackNavigationProp<PolicyStackParamList, 'PoliciesList'>;

interface Props {
  navigation: PoliciesListNavigationProp;
}

const PoliciesListScreen: React.FC<Props> = ({ navigation }) => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'expired'>('all');

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    filterPolicies();
  }, [policies, searchQuery, selectedFilter]);

  const loadPolicies = async () => {
    try {
      // Mock data for development
      const mockPolicies = [
        {
          policyId: 'POL-001',
          policyNumber: 'HI-2024-001234',
          insurerName: 'شركة التأمين الوطنية',
          policyType: 'شامل',
          status: 'active',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          coverageAmount: '100,000',
          premium: '5,000',
          familyMembers: 4,
        },
        {
          policyId: 'POL-002',
          policyNumber: 'HI-2024-005678',
          insurerName: 'شركة التأمين التعاوني',
          policyType: 'أساسي',
          status: 'active',
          startDate: '2024-03-15',
          endDate: '2025-03-14',
          coverageAmount: '50,000',
          premium: '3,000',
          familyMembers: 2,
        },
      ];
      setPolicies(mockPolicies);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error loading policies:', error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const filterPolicies = () => {
    let filtered = [...policies];
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(policy => policy.status === selectedFilter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(policy =>
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.insurerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPolicies(filtered);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPolicies();
  };

  const renderPolicyCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.policyCard}
      onPress={() => navigation.navigate('PolicyDetail', { policyId: item.policyId })}
    >
      <View style={styles.policyHeader}>
        <View style={styles.policyTitleContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? '#E8F5E9' : '#FFEBEE' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'active' ? '#4CAF50' : '#F44336' }
            ]}>
              {item.status === 'active' ? 'نشط' : 'منتهي'}
            </Text>
          </View>
          <Text style={styles.policyType}>{item.policyType}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#666" />
      </View>

      <Text style={styles.insurerName}>{item.insurerName}</Text>
      <Text style={styles.policyNumber}>رقم البوليصة: {item.policyNumber}</Text>

      <View style={styles.policyDetails}>
        <View style={styles.detailItem}>
          <Icon name="calendar" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.startDate} - {item.endDate}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="shield-checkmark" size={16} color="#666" />
          <Text style={styles.detailText}>
            تغطية: {item.coverageAmount} ج.م
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="people" size={16} color="#666" />
          <Text style={styles.detailText}>
            {item.familyMembers} أفراد
          </Text>
        </View>
      </View>

      <View style={styles.premiumContainer}>
        <Text style={styles.premiumLabel}>القسط السنوي:</Text>
        <Text style={styles.premiumAmount}>{item.premium} ج.م</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>جاري تحميل البوليصات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن بوليصة..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'all' && styles.filterButtonTextActive
          ]}>
            الكل ({policies.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'active' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('active')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === 'active' && styles.filterButtonTextActive
          ]}>
            النشطة ({policies.filter(p => p.status === 'active').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPolicies}
        renderItem={renderPolicyCard}
        keyExtractor={(item) => item.policyId}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="document-text-outline" size={80} color="#ccc" />
            <Text style={styles.emptyStateTitle}>لا توجد بوليصات</Text>
            <Text style={styles.emptyStateText}>ليس لديك أي بوليصات تأمين حالياً</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#666' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 15, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E5EA' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#000' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15 },
  filterButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#fff', marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA' },
  filterButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  filterButtonText: { fontSize: 14, fontWeight: '600', color: '#666' },
  filterButtonTextActive: { color: '#fff' },
  listContent: { padding: 15 },
  policyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  policyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  policyTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 10 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  policyType: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  insurerName: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  policyNumber: { fontSize: 14, color: '#666', marginBottom: 15 },
  policyDetails: { marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailText: { fontSize: 14, color: '#666', marginLeft: 8 },
  premiumContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  premiumLabel: { fontSize: 14, color: '#666' },
  premiumAmount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 20, marginBottom: 10 },
  emptyStateText: { fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
});

export default PoliciesListScreen;
