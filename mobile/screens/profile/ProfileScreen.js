import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../service/authService';
import userService from '../../service/userService';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await userService.fetchCurrentUser();
      setUser(data);
      setName(data.name || '');
      setEmail(data.email || '');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateCurrentUser({ name, email });
      Alert.alert('Thành công', 'Đã cập nhật thông tin cá nhân');
      fetchUser();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login'); // Navigate to Login screen after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, show an error message to the user
    }
  };

  const userData = {
    username: "johnsmith",
    role: "MEMBER",
    phone_number: "+84 (555) 123-4567",
    dob: "1990-05-15",
    joined: "June 2023"
  };

  const statisticsData = [
    {
      icon: '💧',
      value: '63',
      label: 'Day streak',
      iconColor: '#64748b'
    },
    {
      icon: '⚡',
      value: '18303',
      label: 'Total XP',
      iconColor: '#f59e0b'
    },
    {
      icon: '🏅',
      value: 'Gold',
      label: 'Current league',
      iconColor: '#f59e0b'
    },
    {
      icon: '🏆',
      value: '3',
      label: 'Top 3 finishes',
      iconColor: '#f59e0b'
    }
  ];

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (!user) return <Text>Không tìm thấy thông tin người dùng</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollContent}>
          {/* User Information Section */}
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoContent}>
              {/* Avatar Section - Left Side */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {userData.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.username}>{userData.username}</Text>
                <Text style={styles.joinDate}>Member since {userData.joined}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>

              {/* User Information - Right Side */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoColumn}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Email</Text>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                      />
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Phone Number</Text>
                      <Text style={styles.infoValue}>{userData.phone_number}</Text>
                    </View>
                  </View>
                  <View style={styles.infoColumn}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Role</Text>
                      <Text style={styles.infoValue}>{userData.role}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Date of Birth</Text>
                      <Text style={styles.infoValue}>{userData.dob}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Statistics Section */}
          <View style={styles.statisticsSection}>
            <Text style={styles.statisticsTitle}>Statistics</Text>
            <View style={styles.statisticsGrid}>
              {statisticsData.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <Text style={[styles.statIcon, { color: stat.iconColor }]}>
                    {stat.icon}
                  </Text>
                  <View style={styles.statContent}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>

          <Button title={saving ? 'Đang lưu...' : 'Lưu thay đổi'} onPress={handleSave} disabled={saving} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f5f3',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  userInfoCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  userInfoContent: {
    flexDirection: 'row',
    gap: 32,
    flexWrap: 'wrap',
  },
  avatarSection: {
    alignItems: 'center',
    width: 160,
  },
  avatarContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0f0f0',
    borderWidth: 4,
    borderColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 64,
    color: '#000000',
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 16,
  },
  editButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  infoSection: {
    flex: 1,
    minWidth: 250,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  statisticsSection: {
    margin: 16,
  },
  statisticsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  logoutButton: {
    backgroundColor: 'black', // Red color for logout
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 16,
    marginTop: 32,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default ProfileScreen;