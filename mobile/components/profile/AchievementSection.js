import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

const AchievementCard = ({ achievement, theme }) => {
  const { name, description, progress, target, completed, earned_date, image_url } = achievement;
  const progressPercent = Math.min((progress / target) * 100, 100);

  return (
    <View style={styles.achievementCard}>
      <Image 
        source={image_url ? { uri: image_url } : require('../../assets/icon.png')}
        style={[
          styles.achievementAvatar,
          completed && styles.achievementAvatarCompleted
        ]}
        resizeMode="cover"
      />
      <View style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={[
            styles.achievementTitle,
            completed && styles.achievementTitleCompleted
          ]}>{name}</Text>
          {completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>completed</Text>
            </View>
          )}
        </View>
        <Text style={[
          styles.achievementDescription,
          completed && styles.achievementDescriptionCompleted
        ]}>{description}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                !completed && styles.progressFillNotCompleted,
                { width: `${progressPercent}%` }
              ]}
            />
          </View>
          <Text style={[
            styles.progressText,
            !completed && styles.progressTextNotCompleted
          ]}>{progress}/{target}</Text>
        </View>
        {earned_date && (
          <Text style={styles.earnedDate}>
            Earned: {new Date(earned_date).toLocaleDateString()}
          </Text>
        )}
      </View>
    </View>
  );
};

const AchievementSection = ({ achievements = [], onViewAll }) => {
  const theme = useTheme();
  const achievementsList = Array.isArray(achievements) ? achievements : [];
  
  if (achievementsList.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Achievements</Text>
          <TouchableOpacity onPress={onViewAll}>
            <Text style={[styles.viewAll, { color: theme.colors.primary }]}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
            You haven't earned any achievements yet!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>Achievements</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={[styles.viewAll, { color: theme.colors.primary }]}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.achievementList} showsVerticalScrollIndicator={false}>
        {achievementsList.map((achievement, index) => (
          <AchievementCard 
            key={achievement._id || achievement.id || index} 
            achievement={achievement}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
  },
  achievementList: {
    flex: 1,
  },
  achievementCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    opacity: 0.5,
  },
  achievementAvatarCompleted: {
    opacity: 1,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    opacity: 0.5,
  },
  achievementTitleCompleted: {
    opacity: 1,
  },
  completedBadge: {
    backgroundColor: '#63bd6f',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
    opacity: 0.5,
  },
  achievementDescriptionCompleted: {
    opacity: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#ffa426',
  },
  progressFillNotCompleted: {
    backgroundColor: '#ffd8b9',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'right',
    color: '#ffa426',
  },
  progressTextNotCompleted: {
    color: '#666',
  },
  earnedDate: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default AchievementSection;
 