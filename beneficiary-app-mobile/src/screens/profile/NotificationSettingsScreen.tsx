import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const NotificationSettingsScreen = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  
  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>إشعارات الدفع</Text>
        <Switch value={pushEnabled} onValueChange={setPushEnabled} />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>إشعارات البريد الإلكتروني</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>إشعارات الرسائل النصية</Text>
        <Switch value={smsEnabled} onValueChange={setSmsEnabled} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  settingText: { fontSize: 16, color: '#000' },
});

export default NotificationSettingsScreen;
