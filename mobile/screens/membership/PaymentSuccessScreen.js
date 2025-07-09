// PaymentSuccessScreen.js
// Màn hình thanh toán thành công mobile

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PaymentSuccessScreen = ({ route, navigation }) => {
  const { plan } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán thành công!</Text>
      <Text style={styles.message}>Cảm ơn bạn đã đăng ký gói {plan.name}</Text>
      <Text style={styles.details}>
        Gói: {plan.name}{'\n'}
        Giá: {plan.price} VND{'\n'}
        Thời hạn: {plan.duration} tháng
      </Text>
      <Button title="Về trang chủ" onPress={() => navigation.navigate('MainApp')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PaymentSuccessScreen; 