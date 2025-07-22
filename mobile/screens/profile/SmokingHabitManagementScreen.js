import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import smokingService from '../../service/smokingService';

const SmokingHabitManagementScreen = () => {
  const theme = useTheme();
  const [smokingStats, setSmokingStats] = useState({
    dailyCigarettes: 0,
    costPerPack: 0,
    cigarettesPerPack: 20,
    startDate: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSmokingHabits();
  }, []);

  const loadSmokingHabits = async () => {
    try {
      const response = await smokingService.getMySmokingHabits();
      if (response?.data) {
        setSmokingStats({
          dailyCigarettes: response.data.cigarettes_per_day || 0,
          costPerPack: response.data.price_per_pack || 0,
          cigarettesPerPack: response.data.cigarettes_per_pack || 20,
          startDate: new Date(response.data.created_at) || new Date(),
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading smoking habits:', error);
      setLoading(false);
    }
  };

  const calculateDailySpending = () => {
    const costPerCigarette = smokingStats.costPerPack / smokingStats.cigarettesPerPack;
    return (costPerCigarette * smokingStats.dailyCigarettes).toFixed(2);
  };

  const calculateMonthlySpending = () => {
    return (calculateDailySpending() * 30).toFixed(2);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { borderBottomColor: theme.colors.outline }]}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            Smoking Habit Management
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.content}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statTitle, { color: theme.colors.onSurface }]}>Daily Consumption</Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {smokingStats.dailyCigarettes}
                <Text style={[styles.statUnit, { color: theme.colors.onSurfaceVariant }]}> cigarettes</Text>
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statTitle, { color: theme.colors.onSurface }]}>Cost Analysis</Text>
              <View style={styles.costBreakdown}>
                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: theme.colors.onSurfaceVariant }]}>Cost per pack</Text>
                  <Text style={[styles.costValue, { color: theme.colors.onSurface }]}>
                    ${smokingStats.costPerPack.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: theme.colors.onSurfaceVariant }]}>Daily spending</Text>
                  <Text style={[styles.costValue, { color: theme.colors.onSurface }]}>
                    ${calculateDailySpending()}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                  <Text style={[styles.costLabel, { color: theme.colors.onSurfaceVariant }]}>Monthly estimate</Text>
                  <Text style={[styles.costValue, { color: theme.colors.onSurface }]}>
                    ${calculateMonthlySpending()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.statTitle, { color: theme.colors.onSurface }]}>Smoking History</Text>
              <Text style={[styles.historyText, { color: theme.colors.onSurfaceVariant }]}>
                Started smoking on: {new Date(smokingStats.startDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.15,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '600',
  },
  statUnit: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  costBreakdown: {
    marginTop: 8,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  costLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  costValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: 4,
  },
  historyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SmokingHabitManagementScreen;
