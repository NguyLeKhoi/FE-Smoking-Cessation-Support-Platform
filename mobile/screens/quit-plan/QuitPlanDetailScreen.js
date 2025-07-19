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
  TextInput,
  StatusBar
} from 'react-native';
import quitPlanService from '../../service/quitPlanService';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

const QuitPlanDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [recordPhase, setRecordPhase] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState([]);
  // Add phaseTabValues state for tab switching per phase
  const [phaseTabValues, setPhaseTabValues] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
    }
  }, [id]);

  // Update phaseTabValues when phases change
  useEffect(() => {
    if (plan && Array.isArray(plan.phases)) {
      setPhaseTabValues(plan.phases.map(() => 0));
    } else {
      setPhaseTabValues([]);
    }
  }, [plan]);

  const handlePhaseTabChange = (idx, newValue) => {
    setPhaseTabValues(prev => {
      const copy = [...prev];
      copy[idx] = newValue;
      return copy;
    });
  };

  const fetchPlanById = async (planId) => {
    setLoading(true);
    setError('');
    try {
      const response = await quitPlanService.getQuitPlanById(planId);
      const planObj = response.data.data?.data || response.data.data;

      setPlan(planObj);
      setExpandedPhases(new Array(planObj?.phases?.length || 0).fill(false));
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
      const payload = {
        ...data,
        phase_id: recordPhase.id,
        record_date: new Date().toISOString(), // LUÔN truyền ngày hiện tại
      };
      console.log('Add daily record payload:', payload);
      const res = await quitPlanService.createPlanRecord(payload);
      setOpenRecordModal(false);
      setRecordPhase(null);
      Alert.alert('Success', 'Daily record added successfully!');
      // Refresh plan data
      fetchPlanById(plan.id);
    } catch (err) {
      console.log('Add daily record error:', err?.response?.data || err);
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

  // Update getStatusColor for more web-like colors
  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case 'active':
      case 'in-progress':
        return '#ff9800'; // orange
      case 'pending':
        return '#bdbdbd'; // gray
      case 'completed':
      case 'passed':
        return '#1976d2'; // blue
      case 'failed':
        return '#e53935'; // red
      default:
        return '#222';
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

  if (!plan || !Array.isArray(plan.phases)) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView style={styles.scrollContainer}>
          <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>Loading or no plan data</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
  // Only now, after the guard, call getPhaseStatus
  const phases = getPhaseStatus(plan.phases);
  // Ensure phaseTabValues is always an array
  const safePhaseTabValues = Array.isArray(phaseTabValues) ? phaseTabValues : [];
  const planProgress = plan.progress || {};
  const planStatistics = plan.statistics || {};

  const totalPhases = planProgress.totalPhases ?? phases.length;
  const completedPhases = planProgress.completedPhases ?? phases.filter(phase => String(phase.status).toLowerCase() === 'completed').length;
  const percent = planProgress.progressPercentage ?? (totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollContainer}>

        {/* Progress Circle */}
        <View style={styles.progressContainer}>
          <Progress.Circle
            size={200}
            thickness={10}
            progress={percent / 100}
            showsText={false}
            color={'#4caf50'}
            unfilledColor={'#e0e0e0'}
            borderWidth={0}
            animated={true}
            style={{ marginBottom: 20 }}
          />
          <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', height: 200 }]}>
            <Text style={styles.progressText}>{completedPhases}/{totalPhases}</Text>
            <Text style={styles.progressLabel}>Phases completed</Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statCardLabel}>Money Saved</Text>
            <Text style={styles.statCardNumber}>
              ${typeof planStatistics.totalMoneySaved === 'number'
                ? planStatistics.totalMoneySaved.toFixed(2)
                : planStatistics.totalMoneySaved ?? '-'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statCardLabel}>Days Recorded</Text>
            <Text style={styles.statCardNumber}>{planStatistics.totalDaysRecorded ?? '-'}</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statCardLabel}>Avg. Cigarettes/Day</Text>
            <Text style={styles.statCardNumber}>{planStatistics.averageCigarettesPerDay ?? '-'}</Text>
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

          {Array.isArray(phases) && phases.length > 0 ? (
            phases.map((phase, index) => {
              const isPending = String(phase.status).toLowerCase() === 'pending';
              const isDisabled = isPending;
              const tabValue = safePhaseTabValues[index] || 0;
              const stats = phase.statistics || {};

              return (
                <View key={phase.id} style={[styles.phaseItem, isPending && { opacity: 0.5 }]}>
                  <TouchableOpacity
                    style={styles.phaseHeader}
                    onPress={() => handleTogglePhase(index)}
                    disabled={isDisabled}
                  >
                    <View style={styles.phaseHeaderRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.phaseTitle}>Phase {phase.phase_number ?? (index + 1)}</Text>
                        <MaterialCommunityIcons name="smoking" size={20} color="#d84315" style={{ marginLeft: 6 }} />
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.limitBox}>
                          <Text style={styles.limitText}>Limit per day: {phase.limit_cigarettes_per_day ?? '-'}</Text>
                        </View>
                      </View>
                      <Ionicons
                        name={expandedPhases[index] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#888"
                        style={{ marginLeft: 10 }}
                      />
                    </View>
                  </TouchableOpacity>
                  {expandedPhases[index] && (
                    <View style={styles.phaseDetails}>
                      {/* Tab switch */}
                      <View style={styles.phaseTabs}>
                        <TouchableOpacity
                          style={[styles.phaseTab, tabValue === 0 && styles.phaseTabActive]}
                          onPress={() => handlePhaseTabChange(index, 0)}
                          disabled={isDisabled}
                        >
                          <Text style={[styles.phaseTabText, tabValue === 0 && styles.phaseTabTextActive]}>OVERVIEW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.phaseTab, tabValue === 1 && styles.phaseTabActive]}
                          onPress={() => handlePhaseTabChange(index, 1)}
                          disabled={isDisabled}
                        >
                          <Text style={[styles.phaseTabText, tabValue === 1 && styles.phaseTabTextActive]}>STATISTICS</Text>
                        </TouchableOpacity>
                      </View>
                      {/* Tab content */}
                      {tabValue === 0 ? (
                        <View>
                          <View style={styles.phaseDetailRow}>
                            <View style={styles.phaseDetailLabel}>
                              <Ionicons name="calendar" size={18} color="#333" style={{ marginRight: 6 }} />
                              <Text style={styles.detailLabel}>Start:</Text>
                            </View>
                            <Text style={styles.detailValue}>{phase.start_date ? new Date(phase.start_date).toLocaleDateString() : '-'}</Text>
                          </View>
                          <View style={styles.phaseDetailRow}>
                            <View style={styles.phaseDetailLabel}>
                              <Ionicons name="calendar" size={18} color="#333" style={{ marginRight: 6 }} />
                              <Text style={styles.detailLabel}>End:</Text>
                            </View>
                            <Text style={styles.detailValue}>{phase.expected_end_date ? new Date(phase.expected_end_date).toLocaleDateString() : '-'}</Text>
                          </View>
                          <View style={styles.phaseDetailRow}>
                            <View style={styles.phaseDetailLabel}>
                              <MaterialIcons name="flag" size={18} color="#333" style={{ marginRight: 6 }} />
                              <Text style={styles.detailLabel}>Duration:</Text>
                            </View>
                            <Text style={styles.detailValue}>{phase.duration ?? '-'}</Text>
                          </View>
                          <View style={styles.phaseDetailRow}>
                            <View style={styles.phaseDetailLabel}>
                              <Ionicons name="hourglass" size={18} color="#333" style={{ marginRight: 6 }} />
                              <Text style={styles.detailLabel}>Status:</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: getStatusColor(phase.status) }]}>{phase.status ?? '-'}</Text>
                          </View>
                          <View style={styles.phaseDetailRow}>
                            <View style={styles.phaseDetailLabel}>
                              <Ionicons name="time" size={18} color="#333" style={{ marginRight: 6 }} />
                              <Text style={styles.detailLabel}>Remaining Days:</Text>
                            </View>
                            <Text style={styles.detailValue}>{phase.remainingDays ?? '-'}</Text>
                          </View>
                        </View>
                      ) : (
  <View>
                          <View style={styles.phaseStatsRow}>
                            <View style={styles.phaseStatBox}><Ionicons name="checkmark-circle" size={18} color="#43a047" style={{ marginRight: 4 }} /><Text style={[styles.phaseStatLabel, { color: '#43a047' }]}>Recorded:</Text><Text style={[styles.phaseStatValue, { color: '#43a047' }]}>{stats.recordedDays ?? '-'}</Text></View>
                            <View style={styles.phaseStatBox}><Ionicons name="close-circle" size={18} color="#e53935" style={{ marginRight: 4 }} /><Text style={[styles.phaseStatLabel, { color: '#e53935' }]}>Missed:</Text><Text style={[styles.phaseStatValue, { color: '#e53935' }]}>{stats.missedDays ?? '-'}</Text></View>
                          </View>
                          <View style={styles.phaseStatsRow}>
                            <View style={styles.phaseStatBox}><FontAwesome name="heart" size={18} color="#1976d2" style={{ marginRight: 4 }} /><Text style={[styles.phaseStatLabel, { color: '#1976d2' }]}>Passed:</Text><Text style={[styles.phaseStatValue, { color: '#1976d2' }]}>{stats.passedDays ?? '-'}</Text></View>
                            <View style={styles.phaseStatBox}><MaterialIcons name="error" size={18} color="#ff9800" style={{ marginRight: 4 }} /><Text style={[styles.phaseStatLabel, { color: '#ff9800' }]}>Failed:</Text><Text style={[styles.phaseStatValue, { color: '#ff9800' }]}>{stats.failedDays ?? '-'}</Text></View>
                          </View>
                        </View>
                      )}
                      {/* Action buttons */}
                      <View style={styles.phaseActionsRowModern}>
                        <TouchableOpacity
                          style={[styles.webViewRecordsButton, isDisabled && { opacity: 0.5 }]}
                          onPress={() => navigation.navigate('PhaseRecord', { planId: plan.id, phaseId: phase.id })}
                          disabled={isDisabled}
                        >
                          <Text style={styles.webViewRecordsButtonText}>View Records</Text>
                        </TouchableOpacity>
                        {['active', 'in-progress'].includes(String(phase.status).toLowerCase()) && (
                          <TouchableOpacity
                            style={styles.webAddRecordButton}
                            onPress={() => handleOpenRecordModal(phase)}
                          >
                            <Text style={styles.webAddRecordButtonText}>Add Daily Record</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
  </View>
);
            })
          ) : (
            <Text style={{ textAlign: 'center', color: '#888', marginVertical: 16 }}>No phases available</Text>
          )}
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
    // KHÔNG truyền record_date từ UI, để logic ngoài handleAddDailyRecord tự thêm
    const payload = {
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: healthStatus,
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
                  style={[styles.pickerOption, healthStatus === status ? styles.pickerOptionSelected : styles.pickerOptionUnselected]}
                  onPress={() => setHealthStatus(status)}
                >
                  <Text style={[styles.pickerOptionText, healthStatus === status ? styles.pickerOptionTextSelected : styles.pickerOptionTextUnselected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={onClose}>
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Cancel</Text>
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
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    color: '#3f332b',
    letterSpacing: 1,
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
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statCardNumber: {
    fontSize: 24,
    fontWeight: '900',
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
    borderRadius: 18,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  phaseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
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
    backgroundColor: 'black',
    borderColor: 'black',
  },
  pickerOptionUnselected: {
    backgroundColor: 'white',
    borderColor: 'black',
  },
  pickerOptionText: {
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerOptionTextUnselected: {
    color: 'black',
    fontWeight: 'bold',
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
    backgroundColor: 'black',
    borderColor: 'black',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3f332b',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontWeight: 'bold',
  },
  phaseTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  phaseTabActive: {
    borderBottomColor: '#222',
  },
  phaseTabText: {
    fontSize: 15,
    color: '#888',
    fontWeight: 'bold',
  },
  phaseTabTextActive: {
    color: '#222',
  },
  phaseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseStatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phaseStatLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 4,
  },
  phaseStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  phaseActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 10,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitBox: {
    backgroundColor: '#fff8e1',
    borderColor: '#ffb300',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    marginLeft: 4,
    shadowColor: '#ffb300',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  webViewRecordsButton: {
    backgroundColor: '#fff',
    borderColor: '#222',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  webViewRecordsButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  webAddRecordButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#1976d2',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  webAddRecordButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  phaseDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  phaseDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
  },
  phaseActionsRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
});

export default QuitPlanDetailScreen; 