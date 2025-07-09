// QuitPlanListScreen.js
// Màn hình danh sách kế hoạch bỏ thuốc mobile

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native';
import quitPlanService from '../../service/quitPlanService';

const QuitPlanListScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await quitPlanService.getAllQuitPlans();
      setPlans(res.data || res); // handle both axios and fetch style
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (plan) => {
    navigation.navigate('QuitPlanDetail', { id: plan._id });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Tạo kế hoạch mới" onPress={() => navigation.navigate('CreateQuitPlan')} />
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : plans.length === 0 ? (
        <Text style={{ marginTop: 32, textAlign: 'center' }}>Chưa có kế hoạch nào</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.reason}</Text>
              <Text style={{ color: '#666' }}>Loại: {item.plan_type}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default QuitPlanListScreen; 