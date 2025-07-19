// PhaseRecordScreen.js
// Màn hình ghi nhận giai đoạn mobile - Updated to show detailed records

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import quitPlanService from '../../service/quitPlanService';

const PhaseRecordScreen = ({ route, navigation }) => {
  const { planId, phaseId } = route.params;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [planId, phaseId]);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await quitPlanService.getPhaseRecords(planId, phaseId);
      setRecords(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (isPass) => {
    return isPass ? '✅' : '❌';
  };

  const getStatusColor = (isPass) => {
    return isPass ? '#43a047' : '#e53935';
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'GOOD':
        return '#43a047';
      case 'NORMAL':
        return '#ff9800';
      case 'BAD':
        return '#e53935';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3f332b" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Phase Records</Text>
        
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No records found for this phase.</Text>
            <Text style={styles.emptySubtext}>
              Start adding daily records to track your progress!
            </Text>
          </View>
        ) : (
          <View style={styles.recordsContainer}>
            {records.map((record) => (
              <View key={record.id} style={styles.recordItem}>
                <View style={styles.recordHeader}>
                  <Text style={styles.recordDate}>
                    {record.record_date ? new Date(record.record_date).toLocaleDateString() : '-'}
                  </Text>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusIcon}>
                      {getStatusIcon(record.is_pass)}
                    </Text>
                    <Text style={[
                      styles.statusText, 
                      { color: getStatusColor(record.is_pass) }
                    ]}>
                      {record.is_pass ? 'Pass' : 'Fail'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recordDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Cigarettes:</Text>
                    <Text style={styles.detailValue}>{record.cigarette_smoke}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Craving Level:</Text>
                    <Text style={styles.detailValue}>{record.craving_level}/10</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Health Status:</Text>
                    <Text style={[
                      styles.detailValue, 
                      { color: getHealthStatusColor(record.health_status) }
                    ]}>
                      {record.health_status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{records.length}</Text>
              <Text style={styles.statLabel}>Total Records</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {records.filter(r => r.is_pass).length}
              </Text>
              <Text style={styles.statLabel}>Passed Days</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {records.length > 0 
                  ? Math.round(records.reduce((sum, r) => sum + r.cigarette_smoke, 0) / records.length)
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Avg Cigarettes</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {records.length > 0 
                  ? Math.round(records.reduce((sum, r) => sum + r.craving_level, 0) / records.length)
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Avg Craving</Text>
            </View>
          </View>
  </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7ff',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3f332b',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  recordsContainer: {
    marginBottom: 30,
  },
  recordItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f332b',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#3f332b',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3f332b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f332b',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PhaseRecordScreen; 