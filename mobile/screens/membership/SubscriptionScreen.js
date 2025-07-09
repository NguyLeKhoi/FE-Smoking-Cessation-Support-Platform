// SubscriptionScreen.js
// Màn hình đăng ký gói mobile

import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import subscriptionService from '../../service/subscriptionService';

const SubscriptionScreen = ({ route, navigation }) => {
  const { plan } = route.params;
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const paymentData = {
        planId: plan._id,
        amount: plan.price,
      };
      const result = await subscriptionService.createPayment(paymentData);
      Alert.alert('Thành công', 'Đăng ký gói thành viên thành công!');
      navigation.navigate('PaymentSuccess', { plan });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng ký gói thành viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký gói thành viên</Text>
      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.price}>{plan.price} VND</Text>
      <Text style={styles.duration}>{plan.duration} tháng</Text>
      <Text style={styles.description}>{plan.description}</Text>
      <Button 
        title={loading ? 'Đang xử lý...' : 'Đăng ký ngay'} 
        onPress={handleSubscribe} 
        disabled={loading} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default SubscriptionScreen; 