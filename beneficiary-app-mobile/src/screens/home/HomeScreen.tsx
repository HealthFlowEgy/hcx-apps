/**
 * HomeScreen - Updated with Real API Integration
 * Main dashboard for beneficiaries
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getHCXService } from '../../services/hcx.protocol.service';
import type { Policy, Claim, ConsentRequest } from '../../services/hcx.protocol.service';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;

interface DashboardStats {
  activePolicies: number;
  pendingClaims: number;
  pendingConsents: number;
  totalCoverage: number;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const hcxService = getHCXService();

  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activePolicies: 0,
    pendingClaims: 0,
    pendingConsents: 0,
    totalCoverage: 0,
  });
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [userName, setUserName] = useState('');

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await hcxService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUserName(profileResponse.data.name);
      }

      // Fetch policies
      const policiesResponse = await hcxService.getPolicies();
      if (policiesResponse.success && policiesResponse.data) {
        const policies = policiesResponse.data;
        const activePolicies = policies.filter(p => p.status === 'active');
        const totalCoverage = activePolicies.reduce(
          (sum, p) => sum + p.coverageAmount,
          0
        );

        setStats(prev => ({
          ...prev,
          activePolicies: activePolicies.length,
          totalCoverage,
        }));
      }

      // Fetch claims
      const claimsResponse = await hcxService.getClaims();
      if (claimsResponse.success && claimsResponse.data) {
        const claims = claimsResponse.data;
        const pendingClaims = claims.filter(
          c => c.status === 'pending' || c.status === 'submitted'
        );
        
        // Get recent 3 claims
        const sortedClaims = [...claims].sort(
          (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        );
        setRecentClaims(sortedClaims.slice(0, 3));

        setStats(prev => ({
          ...prev,
          pendingClaims: pendingClaims.length,
        }));
      }

      // Fetch consents
      const consentsResponse = await hcxService.getConsentRequests('pending');
      if (consentsResponse.success && consentsResponse.data) {
        setStats(prev => ({
          ...prev,
          pendingConsents: consentsResponse.data!.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert(
        'خطأ',
        'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
        [{ text: 'حسناً' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const handleViewESHIC = () => {
    navigation.navigate('ESHICCard');
  };

  const handleViewPolicies = () => {
    navigation.navigate('PoliciesList');
  };

  const handleViewClaims = () => {
    navigation.navigate('ClaimsList');
  };

  const handleViewConsents = () => {
    navigation.navigate('ConsentRequests');
  };

  const handleClaimPress = (claimId: string) => {
    navigation.navigate('ClaimDetail', { claimId });
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('ar-EG')} ج.م`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return '#FFA500';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'settled':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      submitted: 'مقدم',
      pending: 'قيد المراجعة',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      settled: 'مسوى',
      processing: 'قيد المعالجة',
    };
    return statusMap[status] || status;
  };

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>مرحباً</Text>
        <Text style={styles.userName}>{userName || 'المستخدم'}</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={handleViewPolicies}
        >
          <Text style={styles.statNumber}>{stats.activePolicies}</Text>
          <Text style={styles.statLabel}>وثائق التأمين النشطة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={handleViewClaims}
        >
          <Text style={styles.statNumber}>{stats.pendingClaims}</Text>
          <Text style={styles.statLabel}>مطالبات قيد المراجعة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={handleViewConsents}
        >
          <Text style={styles.statNumber}>{stats.pendingConsents}</Text>
          <Text style={styles.statLabel}>طلبات موافقة معلقة</Text>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {formatCurrency(stats.totalCoverage)}
          </Text>
          <Text style={styles.statLabel}>إجمالي التغطية</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewESHIC}
          >
            <Text style={styles.actionIcon}>🆔</Text>
            <Text style={styles.actionText}>بطاقة ESHIC</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewPolicies}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>وثائقي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewClaims}
          >
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>مطالباتي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewConsents}
          >
            <Text style={styles.actionIcon}>🔒</Text>
            <Text style={styles.actionText}>الموافقات</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Claims */}
      {recentClaims.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المطالبات الأخيرة</Text>
            <TouchableOpacity onPress={handleViewClaims}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {recentClaims.map(claim => (
            <TouchableOpacity
              key={claim.id}
              style={styles.claimCard}
              onPress={() => handleClaimPress(claim.id)}
            >
              <View style={styles.claimHeader}>
                <Text style={styles.claimNumber}>{claim.claimNumber}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(claim.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(claim.status)}
                  </Text>
                </View>
              </View>

              <Text style={styles.claimProvider}>{claim.providerName}</Text>

              <View style={styles.claimFooter}>
                <Text style={styles.claimDate}>
                  {new Date(claim.submissionDate).toLocaleDateString('ar-EG')}
                </Text>
                <Text style={styles.claimAmount}>
                  {formatCurrency(claim.claimedAmount)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty State for Recent Claims */}
      {recentClaims.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المطالبات الأخيرة</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>لا توجد مطالبات حتى الآن</Text>
          </View>
        </View>
      )}

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المساعدة والدعم</Text>
        <View style={styles.helpCard}>
          <Text style={styles.helpIcon}>❓</Text>
          <Text style={styles.helpText}>
            هل تحتاج إلى مساعدة؟ تواصل مع خدمة العملاء
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>تواصل معنا</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontFamily: 'Cairo-Regular',
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 24,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFF',
    fontFamily: 'Cairo-Regular',
  },
  userName: {
    fontSize: 28,
    color: '#FFF',
    fontFamily: 'Cairo-Bold',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Cairo-Bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Cairo-Bold',
    color: '#333',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#1976D2',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  claimCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimNumber: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1976D2',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#FFF',
  },
  claimProvider: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#666',
    marginBottom: 12,
  },
  claimFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  claimDate: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#999',
  },
  claimAmount: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#666',
  },
    emptyState: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: '#999',
      textAlign: 'center',
    },
    helpCard: {
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    helpIcon: {
      fontSize: 32,
      marginBottom: 12,
    },
    helpText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: '#333',
      textAlign: 'center',
      marginBottom: 16,
    },
    helpButton: {
      backgroundColor: '#1976D2',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 24,
      marginTop: 8,
    },
    helpButtonText: {
      color: '#FFF',
      fontFamily: 'Cairo-Bold',
      fontSize: 16,
    },
  },)