import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PolicyStackParamList } from '../../navigation/types';

type Props = {
  navigation: StackNavigationProp<PolicyStackParamList, 'PolicyDetail'>;
  route: RouteProp<PolicyStackParamList, 'PolicyDetail'>;
};

const PolicyDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { policyId } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تفاصيل البوليصة</Text>
        <Text style={styles.policyId}>#{policyId}</Text>
      </View>
      <View style={styles.card}>
        <Icon name="document-text" size={60} color="#007AFF" />
        <Text style={styles.cardTitle}>بوليصة HI-2024-001234</Text>
        <Text style={styles.cardText}>شركة التأمين الوطنية</Text>
        <Text style={styles.cardText}>التغطية: 100,000 ج.م</Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('PolicyDocuments', { policyId })}
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
  policyId: { fontSize: 16, color: '#666', marginTop: 5 },
  card: { backgroundColor: '#fff', margin: 20, padding: 30, borderRadius: 16, alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 15 },
  cardText: { fontSize: 16, color: '#666', marginTop: 8 },
  button: { backgroundColor: '#007AFF', margin: 20, padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default PolicyDetailScreen;
