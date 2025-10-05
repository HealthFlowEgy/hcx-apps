import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LanguageSettingsScreen = () => {
  const [selected, setSelected] = useState('ar');
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.languageItem}
        onPress={() => setSelected('ar')}
      >
        <Text style={styles.languageText}>العربية</Text>
        {selected === 'ar' && <Icon name="checkmark" size={24} color="#007AFF" />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.languageItem}
        onPress={() => setSelected('en')}
      >
        <Text style={styles.languageText}>English</Text>
        {selected === 'en' && <Icon name="checkmark" size={24} color="#007AFF" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  languageItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  languageText: { fontSize: 16, color: '#000' },
});

export default LanguageSettingsScreen;
