import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ConsentDetailScreen = () => {
  const handleApprove = () => {
    Alert.alert('تم', 'تمت الموافقة على الطلب');
  };
  
  const handleDeny = () => {
    Alert.alert('تم', 'تم رفض الطلب');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Icon name="shield-checkmark" size={60} color="#007AFF" />
        <Text style={styles.title}>طلب موافقة</Text>
        <Text style={styles.provider}>مستشفى النور التخصصي</Text>
        <Text style={styles.purpose}>مشاركة السجل الطبي الكامل</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
          <Icon name="checkmark" size={24} color="#fff" />
          <Text style={styles.buttonText}>موافقة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.denyButton} onPress={handleDeny}>
          <Icon name="close" size={24} color="#fff" />
          <Text style={styles.buttonText}>رفض</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  card: { backgroundColor: '#fff', margin: 20, padding: 30, borderRadius: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 15 },
  provider: { fontSize: 18, color: '#666', marginTop: 10 },
  purpose: { fontSize: 16, color: '#666', marginTop: 5, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', padding: 20 },
  approveButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, marginRight: 10 },
  denyButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F44336', padding: 18, borderRadius: 12, marginLeft: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
});

export default ConsentDetailScreen;
