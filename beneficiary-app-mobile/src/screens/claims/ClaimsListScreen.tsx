import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ClaimStackParamList } from '../../navigation/types';

type Props = {
  navigation: StackNavigationProp<ClaimStackParamList, 'ClaimsList'>;
};

const ClaimsListScreen: React.FC<Props> = ({ navigation }) => {
  const claims = [
    { id: 'CLM-001', number: 'HC-2024-001234', provider: 'مستشفى النور', status: 'approved', amount: '5,000' },
    { id: 'CLM-002', number: 'HC-2024-001235', provider: 'عيادة الشفاء', status: 'pending', amount: '2,500' },
  ];
  
  return (
    <View style={styles.container}>
      <FlatList
        data={claims}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.claimCard}
            onPress={() => navigation.navigate('ClaimDetail', { claimId: item.id })}
          >
            <View style={styles.claimHeader}>
              <Text style={styles.claimNumber}>{item.number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? '#E8F5E9' : '#FFF3E0' }]}>
                <Text style={[styles.statusText, { color: item.status === 'approved' ? '#4CAF50' : '#FF9800' }]}>
                  {item.status === 'approved' ? 'موافق' : 'قيد المراجعة'}
                </Text>
              </View>
            </View>
            <Text style={styles.provider}>{item.provider}</Text>
            <Text style={styles.amount}>{item.amount} ج.م</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  list: { padding: 20 },
  claimCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 15 },
  claimHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  claimNumber: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  provider: { fontSize: 14, color: '#666', marginBottom: 8 },
  amount: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
});

export default ClaimsListScreen;
