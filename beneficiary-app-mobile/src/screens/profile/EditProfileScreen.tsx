import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#666" />
        <TextInput style={styles.input} placeholder="الاسم الكامل" defaultValue="أحمد محمد علي" />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="call" size={20} color="#666" />
        <TextInput style={styles.input} placeholder="رقم الهاتف" defaultValue="+20 123 456 7890" />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#666" />
        <TextInput style={styles.input} placeholder="البريد الإلكتروني" defaultValue="ahmed@example.com" />
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15 },
  input: { flex: 1, fontSize: 16, color: '#000', marginLeft: 10 },
  saveButton: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EditProfileScreen;
