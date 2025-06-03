import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { logout } from '../service/authService';

const mockSmokingHabits = {
  cigarettes_per_pack: 20,
  price_per_pack: 5.5,
  cigarettes_per_day: 10,
  smoking_years: 3,
  triggers: ['stress', 'social'],
};

const mockAchievements = [
  { id: 1, title: '1 Day Smoke Free', completed: true },
  { id: 2, title: '1 Week Smoke Free', completed: false },
  { id: 3, title: 'Money Saved: $100', completed: true },
  { id: 4, title: '1 Month Smoke Free', completed: false },
];

const ProfileScreen = ({ navigation }) => {
  const [smokingHabits, setSmokingHabits] = useState(null);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: async () => {
            try {
              await logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Logout Failed', error.message || 'Failed to logout');
            }
          }, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleTakeQuiz = () => {
    setSmokingHabits(mockSmokingHabits);
    Alert.alert('Quiz', 'Pretend you took the quiz and filled your smoking habits!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Habits</Text>
        {smokingHabits ? (
          <>
            <View style={styles.infoRow}>
              <View style={styles.infoItemHalf}>
                <InfoItem label="Cigarettes per Pack" value={smokingHabits.cigarettes_per_pack} />
              </View>
              <View style={styles.infoItemHalf}>
                <InfoItem label="Price per Pack" value={smokingHabits.price_per_pack} />
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItemHalf}>
                <InfoItem label="Cigarettes per Day" value={smokingHabits.cigarettes_per_day} />
              </View>
              <View style={styles.infoItemHalf}>
                <InfoItem label="Smoking Years" value={smokingHabits.smoking_years} />
              </View>
            </View>
            <View style={styles.infoItem}>
              <InfoItem label="Triggers" value={smokingHabits.triggers?.join(', ')} />
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.quizButton} onPress={handleTakeQuiz}>
            <Text style={styles.quizButtonText}>Take Quiz to Fill Smoking Habits</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {mockAchievements.map((achievement) => (
          <View key={achievement.id} style={styles.infoItem}>
            <InfoItem 
              label={achievement.title} 
              value={achievement.completed ? '✓ Completed' : '✗ Incomplete'}
            />
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value ?? '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#2c3e50',
    borderBottomWidth: 0,
    marginBottom: 16,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#00b0ff',
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#b0b3b8',
  },
  infoContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    backgroundColor: '#1c2833',
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoItemHalf: {
    backgroundColor: '#1c2833',
    padding: 18,
    borderRadius: 8,
    width: '48%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#b0b3b8',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  quizButton: {
    backgroundColor: '#00b0ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#00b0ff',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetPasswordButton: {
    backgroundColor: '#00b0ff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  resetPasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsContainer: {
    padding: 20,
    backgroundColor: '#1c2833',
    borderRadius: 8,
    marginBottom: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    color: 'white',
  },
  achievementStatus: {
    fontSize: 16,
    color: '#00b0ff',
  },
  divider: {
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 16,
  },
});

export default ProfileScreen;