import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '../../service/userService';
import achievementsService from '../../service/achievementsService';
import StatisticsSection from '../../components/profile/StatisticsSection';
import UserInfoSection from '../../components/profile/UserInfoSection';
import AchievementSection from '../../components/profile/AchievementSection';
import theme from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation: propNavigation }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    dob: '',
    avatar: ''
  });

  useEffect(() => {
    checkTokenAndFetch();
  }, []);

  const checkTokenAndFetch = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      navigation.replace('Login');
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = await userService.fetchCurrentUser();
      setUser(userData.data); // Sửa ở đây
      setFormData({
        first_name: userData.data.first_name || '',
        last_name: userData.data.last_name || '',
        email: userData.data.email || '',
        phone_number: userData.data.phone_number || '',
        dob: userData.data.dob || '',
        avatar: userData.data.avatar || ''
      });
      
      const achData = await achievementsService.getAchievements();
      setAchievements(achData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile or achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Thêm hàm formatDate để chuẩn hóa ngày sinh
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Nếu đã là YYYY-MM-DD thì trả về luôn
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    // Nếu là ISO string thì cắt phần ngày
    return dateString.split('T')[0];
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUserData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        avatar: formData.avatar,
        dob: formatDate(formData.dob), // Đảm bảo đúng định dạng
      };

      await userService.updateCurrentUser(updatedUserData);
      await fetchData(); // Fetch lại user từ API để đồng bộ dữ liệu
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // Clear tokens and navigate to login
            // You'll need to implement this based on your auth system
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const statisticsData = [
    { icon: '💧', value: '63', label: 'Day streak', color: '#64748b' },
    { icon: '⚡', value: '18303', label: 'Total XP', color: '#f59e0b' },
    { icon: '🏅', value: 'Gold', label: 'Current league', color: '#f59e0b' },
    { icon: '🏆', value: '3', label: 'Top 3 finishes', color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 0 }}>
      {/* Đã xóa nút mở drawer lớn ở ngoài */}
      {/* User Info Section */}
      <UserInfoSection
        user={user}
        formData={formData}
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onOpenDrawer={() => navigation.openDrawer()}
      />

      {/* Statistics Section */}
      <StatisticsSection statisticsData={statisticsData} />

      {/* Achievements Section */}
      <AchievementSection 
        achievements={achievements} 
        onViewAll={() => navigation.navigate('Achievements')}
      />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },

  logoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;