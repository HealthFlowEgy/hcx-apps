import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ClaimTimelineScreen = () => {
  const timeline = [
    { date: '2024-12-14', title: 'الزيارة الطبية', icon: 'medical', color: '#007AFF' },
    { date: '2024-12-15', title: 'تقديم المطالبة', icon: 'cloud-upload', color: '#007AFF' },
    { date: '2024-12-16', title: 'قيد المراجعة', icon: 'time', color: '#FF9800' },
    { date: '2024-12-18', title: 'تمت الموافقة', icon: 'checkmark-circle', color: '#4CAF50' },
  ];
  
  return (
    <ScrollView style={styles.container}>
      {timeline.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
            <Icon name={item.icon} size={24} color={item.color} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>{item.title}</Text>
            <Text style={styles.timelineDate}>{item.date}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  timelineContent: { flex: 1 },
  timelineTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  timelineDate: { fontSize: 14, color: '#666', marginTop: 4 },
});

export default ClaimTimelineScreen;
