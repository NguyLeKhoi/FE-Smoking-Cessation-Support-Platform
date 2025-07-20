import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import theme from '../../theme/theme';

const AchievementSection = ({ achievements, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Achievements</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
      
      {achievements && achievements.length > 0 ? (
        achievements.slice(0, 3).map((achievement, index) => (
          <View key={achievement._id || index} style={styles.achievementCard}>
            <Image 
              source={{ uri: achievement.image_url || achievement.thumbnail }} 
              style={styles.achievementIcon}
              defaultSource={require('../../assets/icon.png')}
            />
            <View style={styles.achievementInfo}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                {achievement.point && (
                  <Text style={styles.achievementPoints}>{achievement.point} pts</Text>
                )}
              </View>
              <Text style={styles.achievementDesc}>{achievement.description}</Text>
              {achievement.earned_date && (
                <Text style={styles.achievementDate}>
                  Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyAchievements}>
          <Text style={styles.emptyText}>
            You haven't earned any achievements yet!{' '}
            <Text style={styles.linkText} onPress={onViewAll}>
              See all available achievements.
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.paper,
    borderRadius: theme.borderRadius,
    padding: theme.padding,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  achievementPoints: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  achievementDesc: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyAchievements: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default AchievementSection; 