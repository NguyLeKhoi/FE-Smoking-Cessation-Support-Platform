import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import achievementsService from '../../service/achievementsService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import theme from '../../theme/theme';
import AchievementSection from '../../components/profile/AchievementSection';

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      let decoded = null;
      if (typeof accessToken === 'string' && accessToken) {
        try {
          decoded = jwtDecode(accessToken);
        } catch (e) {
          decoded = null;
        }
      }
      let userId = null;
      if (decoded) {
        userId = decoded.sub || decoded.id || decoded.user_id;
      }
      if (!userId) {
        setError('User ID not found');
        return;
      }

      const [achievementsResponse, userAchievementsResponse] = await Promise.all([
        achievementsService.getAllAchievements(),
        achievementsService.getUserAchievementsById(userId)
      ]);

      // Ensure we have arrays to work with
      const allAchievements = Array.isArray(achievementsResponse.data)
        ? achievementsResponse.data
        : achievementsResponse.achievements || [];

      const userAchievements = Array.isArray(userAchievementsResponse.data)
        ? userAchievementsResponse.data
        : userAchievementsResponse.achievements || [];

      // Process and combine achievements
      const processedAchievements = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua =>
          ua.id === achievement.id || ua.achievement_id === achievement.id
        );
        return {
          ...achievement,
          progress: userAchievement ? userAchievement.progress || 0 : 0,
          target: achievement.target || achievement.requirement || 100,
          completed: userAchievement ? userAchievement.completed || false : false,
          earned_date: userAchievement ? userAchievement.earned_date || null : null
        };
      });

      setAchievements(processedAchievements);
      setError(null);
    } catch (err) {
      setError('Failed to load achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAchievements();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.paper }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.paper }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={fetchAchievements}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.paper }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>All Achievements</Text>
        </View>
        <AchievementSection
          achievements={achievements}
          onViewAll={() => { }} // No-op since we're already in the all achievements view
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40
  },
});

export default AchievementsScreen; 