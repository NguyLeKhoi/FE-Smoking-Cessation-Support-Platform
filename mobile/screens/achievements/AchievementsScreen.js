// AchievementsScreen.js
// Màn hình thành tích mobile

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import achievementsService from '../../service/achievementsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AchievementsScreen = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      let userId = null;
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        userId = decoded.sub || decoded.id || decoded.user_id;
      }
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }
      const [allData, userData] = await Promise.all([
        achievementsService.getAllAchievements(),
        achievementsService.getUserAchievementsById(userId)
      ]);
      setAllAchievements(allData.data || allData || []);
      setUserAchievements(userData.data || userData || []);
    } catch (err) {
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  // Tạo Set chứa id các achievement user đã đạt
  const userAchievementIds = new Set([
    ...userAchievements.map(a => a.id),
    ...userAchievements.map(a => a.achievement_id)
  ].filter(Boolean));

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Achievements</Text>
      <FlatList
        data={allAchievements}
        keyExtractor={item => item.id || item._id}
        renderItem={({ item, index }) => {
          const hasAchievement = userAchievementIds.has(item.id);
          const imageUrl = item.image_url;
          return (
            <View
              style={[
                styles.card,
                !hasAchievement && styles.cardNotObtained,
                index !== allAchievements.length - 1 && styles.cardBorder
              ]}
            >
              <Image
                source={{ uri: imageUrl }}
                style={[
                  styles.avatar,
                  !hasAchievement && styles.avatarNotObtained
                ]}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  {item.point ? <Text style={styles.cardPoints}>{item.point} pts</Text> : null}
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardStatus}>{hasAchievement ? 'Obtained' : 'Not obtained yet'}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No achievements yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fafbfc',
    borderRadius: 16,
    marginBottom: 12,
    opacity: 1,
  },
  cardNotObtained: {
    opacity: 0.5,
  },
  cardBorder: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  avatarNotObtained: {
    // Grayscale effect (Android/iOS):
    tintColor: '#bbb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  cardPoints: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  cardStatus: {
    fontSize: 12,
    color: '#aaa',
  },
  empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});

export default AchievementsScreen; 