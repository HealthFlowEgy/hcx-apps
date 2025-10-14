import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ConsentHistoryScreen = () => {
  const history = [
    { id: '1', provider: 'مستشفى النور', date: '2024-12-15', status: 'approved' },
    { id: '2', provider: 'عيادة الشفاء', date: '2024-12-10', status: 'denied' },
  ];
  
  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <View style={styles.historyCard}>
            <Icon 
              name={item.status === 'approved' ? 'checkmark-circle' : 'close-circle'} 
              size={40} 
              color={item.status === 'approved' ? '#4CAF50' : '#F44336'} 
            />
            <View style={styles.historyInfo}>
              <Text style={styles.provider}>{item.provider}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: item.status === 'approved' ? '#4CAF50' : '#F44336' }]}>
                {item.status === 'approved' ? 'موافق' : 'مرفوض'}
              </Text>
            </View>
          </View>
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
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 15 },
  historyInfo: { flex: 1, marginLeft: 15 },
  provider: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  date: { fontSize: 14, color: '#666', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
});

export default ConsentHistoryScreen;
