// QuitPlanDetailScreen.js
// Màn hình chi tiết kế hoạch bỏ thuốc mobile - Updated to match web functionality

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import quitPlanService from '../../service/quitPlanService';

const QuitPlanDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [recordPhase, setRecordPhase] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
    }
  }, [id]);

  const fetchPlanById = async (planId) => {
    setLoading(true);
    setError('');
    try {
      const response = await quitPlanService.getQuitPlanById(planId);
      setPlan(response.data.data);
      setExpandedPhases(new Array(response.data.data?.phases?.length || 0).fill(false));
    } catch (err) {
      setError('Không thể tải kế hoạch cai thuốc');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRecordModal = (phase) => {
    setRecordPhase(phase);
    setOpenRecordModal(true);
  };

  const handleCloseRecordModal = () => {
    setOpenRecordModal(false);
    setRecordPhase(null);
  };

  const handleAddDailyRecord = async (data) => {
    if (!plan?.id || !recordPhase?.id) return;
    
    try {
      const res = await quitPlanService.createPlanRecord({
        ...data,
        phase_id: recordPhase.id,
      });
      
      setOpenRecordModal(false);
      setRecordPhase(null);
      Alert.alert('Success', 'Daily record added successfully!');
      
      // Refresh plan data
      fetchPlanById(plan.id);
    } catch (err) {
      Alert.alert('Error', 'Failed to add daily record');
    }
  };

  const getPhaseStatus = (phases) => {
    if (!Array.isArray(phases)) return [];
    let foundActive = false;
    return phases.map((phase, idx) => {
      if (phase.status === 'active') {
        foundActive = true;
        return { ...phase, _display: 'active' };
      }
      if (!foundActive && phase.status !== 'completed') {
        foundActive = true;
        return { ...phase, _display: 'next' };
      }
      if (foundActive && phase.status !== 'completed' && phase.status !== 'active') {
        return { ...phase, _display: 'future' };
      }
      return { ...phase, _display: phase.status === 'completed' ? 'completed' : 'other' };
    });
  };

  const handleTogglePhase = (index) => {
    const newExpandedPhases = [...expandedPhases];
    newExpandedPhases[index] = !newExpandedPhases[index];
    setExpandedPhases(newExpandedPhases);
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case 'active':
        return '#43a047';
      case 'pending':
        return '#ff9800';
      case 'completed':
        return '#388e3c';
      default:
        return '#e53935';
    }
  };

  const getPlanTypeColor = (planType) => {
    switch (String(planType).toLowerCase()) {
      case 'standard':
        return '#388e3c';
      case 'slow':
        return '#1976d2';
      case 'aggressive':
        return '#ff9800';
      default:
        return '#222';
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

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Plan not found</Text>
      </SafeAreaView>
    );
  }

  const phases = plan.phases ? getPhaseStatus(plan.phases) : [];
  const planProgress = plan.progress || {};
  const planStatistics = plan.statistics || {};
  
  const totalPhases = planProgress.totalPhases ?? phases.length;
  const completedPhases = planProgress.completedPhases ?? phases.filter(phase => String(phase.status).toLowerCase() === 'completed').length;
  const percent = planProgress.progressPercentage ?? (totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Plan Progress</Text>
        
        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{completedPhases}/{totalPhases}</Text>
            <Text style={styles.progressLabel}>Phases completed</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Money Saved</Text>
            <Text style={styles.statNumber}>
              ${typeof planStatistics.totalMoneySaved === 'number'
                ? planStatistics.totalMoneySaved.toFixed(2)
                : planStatistics.totalMoneySaved ?? '-'}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Days Recorded</Text>
            <Text style={styles.statNumber}>{planStatistics.totalDaysRecorded ?? '-'}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg. Cigarettes/Day</Text>
            <Text style={styles.statNumber}>{planStatistics.averageCigarettesPerDay ?? '-'}</Text>
          </View>
        </View>

        {/* Plan Overview */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Plan Overview</Text>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Reason</Text>
            <Text style={styles.overviewValue}>{plan.reason}</Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Type</Text>
            <Text style={[styles.overviewValue, { color: getPlanTypeColor(plan.plan_type) }]}>
              {String(plan.plan_type).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Status</Text>
            <Text style={[styles.overviewValue, { color: getStatusColor(plan.status) }]}>
              {plan.status}
            </Text>
          </View>
          
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Duration</Text>
            <Text style={styles.overviewValue}>
              {plan.start_date && plan.expected_end_date
                ? `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.expected_end_date).toLocaleDateString()}`
                : '-'}
            </Text>
          </View>
        </View>

        {/* Phases */}
        <View style={styles.phasesContainer}>
          <Text style={styles.sectionTitle}>Phases</Text>
          
          {phases.map((phase, index) => (
            <View key={phase.id} style={styles.phaseItem}>
              <TouchableOpacity 
                style={styles.phaseHeader}
                onPress={() => handleTogglePhase(index)}
              >
                <View style={styles.phaseInfo}>
                  <Text style={styles.phaseTitle}>Phase {index + 1}</Text>
                  <Text style={styles.phaseDescription}>{phase.description}</Text>
                  <Text style={[styles.phaseStatus, { color: getStatusColor(phase.status) }]}>
                    {phase.status}
                  </Text>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedPhases[index] ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {expandedPhases[index] && (
                <View style={styles.phaseDetails}>
                  <View style={styles.phaseDetailItem}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{phase.duration} days</Text>
                  </View>
                  
                  <View style={styles.phaseDetailItem}>
                    <Text style={styles.detailLabel}>Cigarette Limit:</Text>
                    <Text style={styles.detailValue}>{phase.cigarette_limit} per day</Text>
                  </View>
                  
                  <View style={styles.phaseDetailItem}>
                    <Text style={styles.detailLabel}>Start Date:</Text>
                    <Text style={styles.detailValue}>
                      {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : '-'}
                    </Text>
                  </View>
                  
                  <View style={styles.phaseDetailItem}>
                    <Text style={styles.detailLabel}>End Date:</Text>
                    <Text style={styles.detailValue}>
                      {phase.end_date ? new Date(phase.end_date).toLocaleDateString() : '-'}
                    </Text>
                  </View>
                  
                  {phase.status === 'active' && (
                    <TouchableOpacity 
                      style={styles.addRecordButton}
                      onPress={() => handleOpenRecordModal(phase)}
                    >
                      <Text style={styles.addRecordButtonText}>Add Daily Record</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.viewRecordsButton}
                    onPress={() => navigation.navigate('PhaseRecord', { 
                      planId: plan.id, 
                      phaseId: phase.id 
                    })}
                  >
                    <Text style={styles.viewRecordsButtonText}>View Records</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
  </View>
      </ScrollView>

      {/* Add Daily Record Modal */}
      <AddDailyRecordModal
        visible={openRecordModal}
        onClose={handleCloseRecordModal}
        onSubmit={handleAddDailyRecord}
        limitCigarettesPerDay={recordPhase?.cigarette_limit}
      />
    </SafeAreaView>
  );
};

// Add Daily Record Modal Component
const AddDailyRecordModal = ({ visible, onClose, onSubmit, limitCigarettesPerDay }) => {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState('');
  const [healthStatus, setHealthStatus] = useState('GOOD');

  const handleSubmit = () => {
    if (!cigaretteSmoke || !cravingLevel) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const payload = {
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: healthStatus,
      record_date: new Date().toISOString(),
    };

    onSubmit(payload);
    setCigaretteSmoke('');
    setCravingLevel('');
    setHealthStatus('GOOD');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Daily Record</Text>
          
          {typeof limitCigarettesPerDay !== 'undefined' && (
            <View style={styles.limitContainer}>
              <Text style={styles.limitText}>
                Limit per day: {limitCigarettesPerDay}
              </Text>
            </View>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Cigarettes Smoked"
            value={cigaretteSmoke}
            onChangeText={setCigaretteSmoke}
            keyboardType="numeric"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Craving Level (1-10)"
            value={cravingLevel}
            onChangeText={setCravingLevel}
            keyboardType="numeric"
          />
          
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Health Status:</Text>
            <View style={styles.pickerOptions}>
              {['GOOD', 'NORMAL', 'BAD'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.pickerOption,
                    healthStatus === status && styles.pickerOptionSelected
                  ]}
                  onPress={() => setHealthStatus(status)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    healthStatus === status && styles.pickerOptionTextSelected
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]} 
              onPress={handleSubmit}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#4caf50',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3f332b',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f332b',
  },
  overviewContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3f332b',
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  overviewLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  overviewValue: {
    fontSize: 16,
    color: '#3f332b',
    fontWeight: '600',
  },
  phasesContainer: {
    marginBottom: 30,
  },
  phaseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f332b',
    marginBottom: 5,
  },
  phaseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  phaseStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  phaseDetails: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  phaseDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#3f332b',
    fontWeight: '600',
  },
  addRecordButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addRecordButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  viewRecordsButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewRecordsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3f332b',
  },
  limitContainer: {
    backgroundColor: '#fff3e0',
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  limitText: {
    color: '#d84315',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  pickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: '#3f332b',
    borderColor: '#3f332b',
  },
  pickerOptionText: {
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3f332b',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#3f332b',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3f332b',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
});

export default QuitPlanDetailScreen; 