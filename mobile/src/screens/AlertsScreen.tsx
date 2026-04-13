import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { createAlert } from '../services/api';

export default function AlertsScreen() {
  const [symbol, setSymbol] = useState('SJC');
  const [condition, setCondition] = useState('GREATER_THAN');
  const [targetField, setTargetField] = useState('BUY');
  const [threshold, setThreshold] = useState('85000000');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Dummy Expo Push Token for MVP. Real app uses expo-notifications getExpoPushTokenAsync()
      const dummyToken = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
      await createAlert(dummyToken, symbol, condition, targetField, threshold);
      Alert.alert('Success', 'Alert created successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Set Price Alerts</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Symbol</Text>
        <TextInput 
          style={styles.input} 
          value={symbol} 
          onChangeText={setSymbol} 
          placeholder="e.g. SJC, USD/VND"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Condition</Text>
        <View style={styles.row}>
          <TouchableOpacity 
             style={[styles.toggleBtn, condition === 'GREATER_THAN' && styles.toggleBtnActive]}
             onPress={() => setCondition('GREATER_THAN')}>
             <Text style={[styles.toggleText, condition === 'GREATER_THAN' && styles.toggleTextActive]}>Greater Than</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={[styles.toggleBtn, condition === 'LESS_THAN' && styles.toggleBtnActive]}
             onPress={() => setCondition('LESS_THAN')}>
             <Text style={[styles.toggleText, condition === 'LESS_THAN' && styles.toggleTextActive]}>Less Than</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Target Price Field</Text>
        <View style={styles.row}>
          <TouchableOpacity 
             style={[styles.toggleBtn, targetField === 'BUY' && styles.toggleBtnActive]}
             onPress={() => setTargetField('BUY')}>
             <Text style={[styles.toggleText, targetField === 'BUY' && styles.toggleTextActive]}>Buy Price</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             style={[styles.toggleBtn, targetField === 'SELL' && styles.toggleBtnActive]}
             onPress={() => setTargetField('SELL')}>
             <Text style={[styles.toggleText, targetField === 'SELL' && styles.toggleTextActive]}>Sell Price</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Threshold (VND)</Text>
        <TextInput 
          style={styles.input} 
          value={threshold} 
          onChangeText={setThreshold} 
          keyboardType="numeric"
          placeholder="e.g. 85000000"
          placeholderTextColor="#666"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Saving...' : 'Create Alert'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    color: '#fff',
    padding: 16,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  toggleBtnActive: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  toggleText: {
    color: '#666',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#D4AF37',
  },
  submitBtn: {
    backgroundColor: '#D4AF37',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
