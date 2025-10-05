import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ClaimDocumentsScreen = () => {
  const docs = [
    { id: '1', name: 'التقرير الطبي', size: '245 KB' },
    { id: '2', name: 'نتائج التحاليل', size: '180 KB' },
    { id: '3', name: 'الفاتورة', size: '120 KB' },
  ];
  
  return (
    <View style={styles.container}>
      <FlatList
        data={docs}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.docCard}>
            <Icon name="document-text" size={40} color="#007AFF" />
            <View style={styles.docInfo}>
              <Text style={styles.docName}>{item.name}</Text>
              <Text style={styles.docSize}>{item.size}</Text>
            </View>
            <Icon name="download" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15 },
  docInfo: { flex: 1, marginLeft: 15 },
  docName: { fontSize: 16, fontWeight: '600', color: '#000' },
  docSize: { fontSize: 14, color: '#666', marginTop: 4 },
});

export default ClaimDocumentsScreen;
