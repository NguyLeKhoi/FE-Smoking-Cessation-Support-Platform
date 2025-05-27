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
    backgroundColor: '#181828',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#232336',
    borderBottomWidth: 0,
    marginBottom: 16,
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#8e24aa',
    marginBottom: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#bdbdbd',
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    backgroundColor: '#232336',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoItemHalf: {
    backgroundColor: '#232336',
    padding: 15,
    borderRadius: 12,
    width: '48%',  // Leave some space between items
  },
  infoLabel: {
    fontSize: 14,
    color: '#bdbdbd',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  quizButton: {
    backgroundColor: '#8e24aa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#8e24aa',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsContainer: {
    padding: 20,
    backgroundColor: '#232336',
    borderRadius: 12,
    marginBottom: 16,
  
  },
  achievementContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    color: '#fff',
  },
  achievementStatus: {
    fontSize: 16,
    color: '#bdbdbd',
  },
  divider: {
    height: 1,
    backgroundColor: '#8e24aa',
    marginVertical: 16,
  },
});

export default ProfileScreen;