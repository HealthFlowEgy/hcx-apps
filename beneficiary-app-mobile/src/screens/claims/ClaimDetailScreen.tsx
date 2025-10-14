import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ClaimStackParamList } from '../../navigation/types';

type Props = {
  navigation: StackNavigationProp<ClaimStackParamList, 'ClaimDetail'>;
  route: RouteProp<ClaimStackParamList, 'ClaimDetail'>;
};

const ClaimDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { claimId } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تفاصيل المطالبة</Text>
        <Text style={styles.claimId}>#{claimId}</Text>
      </View>
      <View style={styles.card}>
        <Icon name="clipboard" size={60} color="#007AFF" />
        <Text style={styles.cardTitle}>HC-2024-001234</Text>
        <Text style={styles.cardText}>مستشفى النور التخصصي</Text>
        <Text style={styles.cardText}>المبلغ: 5,000 ج.م</Text>
        <View style={styles.statusBadge}>
          <Icon name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.statusText}>موافق عليه</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ClaimTimeline', { claimId })}
      >
        <Text style={styles.buttonText}>عرض الجدول الزمني</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('ClaimDocuments', { claimId })}
      >
        <Text style={styles.buttonText}>عرض المستندات</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  claimId: { fontSize: 16, color: '#666', marginTop: 5 },
  card: { backgroundColor: '#fff', margin: 20, padding: 30, borderRadius: 16, alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 15 },
  cardText: { fontSize: 16, color: '#666', marginTop: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 15, backgroundColor: '#E8F5E9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  statusText: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50', marginLeft: 5 },
  button: { backgroundColor: '#007AFF', margin: 20, marginTop: 10, padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ClaimDetailScreen;
