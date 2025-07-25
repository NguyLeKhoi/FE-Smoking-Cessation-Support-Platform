// PhaseRecordScreen.js
// Màn hình ghi nhận giai đoạn mobile - Updated to match web design

import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import quitPlanService from '../../service/quitPlanService';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const PhaseRecordScreen = ({ route, navigation }) => {
  const { planId, phaseId } = route.params;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slogans = [
    'Every record is a step closer to a healthier you!',
    'Consistency is the key to quitting successfully.',
    'Small steps every day make a big difference.',
  ];
  const randomSlogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);

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

  // Tính toán summary giống web
  const totalCigarettes = records.reduce((sum, r) => sum + (r.cigarette_smoke || 0), 0);
  const totalMoneySaved = records.reduce((sum, r) => sum + (r.money_saved || 0), 0);
  const totalRecords = records.length;
  const avgCraving = totalRecords > 0 ? Math.round(records.reduce((sum, r) => sum + (r.craving_level || 0), 0) / totalRecords) : 0;

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
        <StatusBar barStyle="dark-content" backgroundColor="#f7f7ff" />
        <ActivityIndicator size="large" color="#3f332b" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f7ff" />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7ff" />
      <ScrollView style={styles.scrollContainer}>
        
        {/* Summary section - giống web */}
        <Text style={styles.summaryTitle}>Phase Summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Cigarettes</Text>
              <Text style={styles.summaryNumber}>{totalCigarettes}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Money Saved</Text>
              <Text style={[styles.summaryNumber, { color: '#43a047' }]}>${totalMoneySaved.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Records</Text>
              <Text style={styles.summaryNumber}>{totalRecords}</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Avg Craving</Text>
              <Text style={[styles.summaryNumber, { color: '#1976d2' }]}>{avgCraving}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.recordsTitle}>Phase Records</Text>
        
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No records found for this phase.</Text>
          </View>
        ) : (
          <View style={styles.recordsContainer}>
            {records.map((record, index) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordDateContainer}>
                    <Ionicons name="calendar" size={18} color="#1976d2" style={{ marginRight: 6 }} />
                  <Text style={styles.recordDate}>
                    {record.record_date ? new Date(record.record_date).toLocaleDateString() : '-'}
                  </Text>
                  </View>
                  <View style={styles.resultContainer}>
                    <Text style={styles.statusIcon}>
                      {getStatusIcon(record.is_pass)}
                    </Text>
                    <Text style={[styles.resultText, { color: getStatusColor(record.is_pass) }]}>
                      {record.is_pass ? 'Pass' : 'Fail'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recordDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <MaterialCommunityIcons name="smoking" size={16} color="#388e3c" style={{ marginRight: 6 }} />
                    <Text style={styles.detailLabel}>Cigarettes:</Text>
                    <Text style={styles.detailValue}>{record.cigarette_smoke}</Text>
                  </View>
                  
                    <View style={styles.detailItem}>
                      <FontAwesome name="heart" size={16} color="#e53935" style={{ marginRight: 6 }} />
                      <Text style={styles.detailLabel}>Craving:</Text>
                    <Text style={styles.detailValue}>{record.craving_level}/10</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <MaterialIcons name="attach-money" size={16} color="#43a047" style={{ marginRight: 6 }} />
                      <Text style={styles.detailLabel}>Money Saved:</Text>
                      <Text style={[styles.detailValue, { color: '#43a047', fontWeight: '700' }]}>
                        ${record.money_saved ? record.money_saved.toFixed(2) : '0.00'}
                      </Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <MaterialIcons name="local-hospital" size={16} color="#607d8b" style={{ marginRight: 6 }} />
                      <Text style={styles.detailLabel}>Health:</Text>
                      <Text style={[styles.detailValue, { color: getHealthStatusColor(record.health_status) }]}>
                      {record.health_status}
                    </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.sloganText}>{randomSlogan}</Text>
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
  summaryTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  summaryContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#222',
  },
  recordsTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    color: '#3f332b',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  recordsContainer: {
    gap: 15,
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '700',
  },
  recordDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  sloganText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default PhaseRecordScreen; 