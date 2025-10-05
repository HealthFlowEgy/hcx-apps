import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { ConsentStackParamList } from '../../navigation/types';

type Props = {
  navigation: StackNavigationProp<ConsentStackParamList, 'ConsentRequests'>;
};

const ConsentRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const consents = [
    { id: 'CNS-001', provider: 'مستشفى النور', purpose: 'مشاركة السجل الطبي', status: 'pending' },
    { id: 'CNS-002', provider: 'عيادة الشفاء', purpose: 'الوصول للتحاليل', status: 'approved' },
  ];
  
  return (
    <View style={styles.container}>
      <FlatList
        data={consents}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.consentCard}
            onPress={() => navigation.navigate('ConsentDetail', { consentId: item.id })}
          >
            <Icon name="shield-checkmark" size={40} color="#007AFF" />
            <View style={styles.consentInfo}>
              <Text style={styles.provider}>{item.provider}</Text>
              <Text style={styles.purpose}>{item.purpose}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'approved' ? '#E8F5E9' : '#FFF3E0' }]}>
                <Text style={[styles.statusText, { color: item.status === 'approved' ? '#4CAF50' : '#FF9800' }]}>
                  {item.status === 'approved' ? 'موافق' : 'معلق'}
                </Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#666" />
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
  consentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 15 },
  consentInfo: { flex: 1, marginLeft: 15 },
  provider: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  purpose: { fontSize: 14, color: '#666', marginTop: 4 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
});

export default ConsentRequestsScreen;
