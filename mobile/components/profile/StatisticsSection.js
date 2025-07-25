import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../theme/theme';

const StatisticsSection = ({ statisticsData }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      <View style={styles.grid}>
        {statisticsData.map((stat, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.icon}>{stat.icon}</Text>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
    fontFamily: theme.fontFamily,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.sectionLight, // Sửa ở đây
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default StatisticsSection; 