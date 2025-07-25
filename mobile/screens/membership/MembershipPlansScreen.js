// MembershipPlansScreen.js
// Màn hình gói thành viên mobile

import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import membershipService from '../../service/membershipService';
import MembershipPlanCard from '../../components/MembershipPlanCard';

const MembershipPlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await membershipService.getMembershipPlans();
      setPlans(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách gói thành viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    navigation.navigate('Subscription', { plan });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={plans}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <MembershipPlanCard
            plan={item}
            onSelect={handleSelectPlan}
          />
        )}
      />
    </View>
  );
};

export default MembershipPlansScreen; 