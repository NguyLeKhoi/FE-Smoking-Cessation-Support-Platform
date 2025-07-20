import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import motivationService from '../service/motivationService';

const MotivationalBanner = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await motivationService.getMotivationMessage();
        setMessage(res.message || res.data || 'A smoke-free life is a healthier life. You can do it!');
      } catch (err) {
        setMessage('A smoke-free life is a healthier life. You can do it!');
      }
    };
    fetchMessage();
  }, []);

  if (!message) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 14,
    marginVertical: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 2
  },
  text: {
    color: '#1976d2',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default MotivationalBanner; 