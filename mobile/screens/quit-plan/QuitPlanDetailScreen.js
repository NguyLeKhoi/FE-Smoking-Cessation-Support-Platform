// QuitPlanDetailScreen.js
// Màn hình chi tiết kế hoạch bỏ thuốc mobile - Updated to match web functionality

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Slider from '@react-native-community/slider';
import quitPlanService from '../../service/quitPlanService';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

// Custom Progress Bar Component
const ProgressBar = ({ progress, color, style }) => {
  return (
    <View style={[styles.progressBarContainer, style]}>
      <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
};

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
      const planObj = response.data?.data?.data || response.data?.data || response.data;
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

        {/* Progress Circle - Updated to match web */}
        <View style={styles.progressContainer}>
          <Progress.Circle
            size={250}
            thickness={12}
            progress={percent / 100}
            showsText={false}
            color={'#4caf50'}
            unfilledColor={'#e0e0e0'}
            borderWidth={0}
            animated={true}
            style={{ marginBottom: 20 }}
          />
          <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', height: 250 }]}>
            <Text style={styles.progressText}>{completedPhases}/{totalPhases}</Text>
            <Text style={styles.progressLabel}>Phases completed</Text>
          </View>
        </View>

        {/* Statistics Cards - Updated to match web */}
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

        {/* Plan Overview - Updated to match web */}
        <View style={styles.overviewContainer}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="flag" size={24} color="#3f332b" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Plan Overview</Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewLabelContainer}>
              <MaterialCommunityIcons name="smoking" size={18} color="#3f332b" style={{ marginRight: 6 }} />
              <Text style={styles.overviewLabel}>Reason</Text>
            </View>
            <Text style={styles.overviewValue}>{plan.reason}</Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewLabelContainer}>
              <MaterialIcons name="flag" size={18} color="#3f332b" style={{ marginRight: 6 }} />
              <Text style={styles.overviewLabel}>Type</Text>
            </View>
            <Text style={[styles.overviewValue, { color: getPlanTypeColor(plan.plan_type) }]}>
              {String(plan.plan_type).toUpperCase()}
            </Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewLabelContainer}>
              <Ionicons name="hourglass" size={18} color="#3f332b" style={{ marginRight: 6 }} />
              <Text style={styles.overviewLabel}>Status</Text>
            </View>
            <Text style={[styles.overviewValue, { color: getStatusColor(plan.status) }]}>
              {plan.status}
            </Text>
          </View>

          <View style={styles.overviewItem}>
            <View style={styles.overviewLabelContainer}>
              <Ionicons name="calendar" size={18} color="#3f332b" style={{ marginRight: 6 }} />
              <Text style={styles.overviewLabel}>Duration</Text>
            </View>
            <Text style={styles.overviewValue}>
              {plan.start_date && plan.expected_end_date
                ? `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.expected_end_date).toLocaleDateString()}`
                : '-'}
            </Text>
          </View>
        </View>

        {/* Phases - Updated to match web */}
        <View style={styles.phasesContainer}>
          <View style={styles.sectionTitleContainer}>
            <MaterialIcons name="flag" size={24} color="#3f332b" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Phases</Text>
          </View>

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
                      {/* Tab switch - Updated to match web */}
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
                      {/* Tab content - Updated to match web */}
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
                        <View style={styles.statisticsContainer}>
                          {(() => {
                            const total = phase.duration || 1;
                            const recorded = stats.recordedDays || 0;
                            const passed = stats.passedDays || 0;
                            const missed = stats.missedDays || 0;
                            const failed = stats.failedDays || 0;
                            return (
                              <View style={styles.statisticsContent}>
                                <View style={styles.statRow}>
                                  <View style={styles.statHeader}>
                                    <FontAwesome name="check-circle" size={15} color="#43a047" style={{ marginRight: 4 }} />
                                    <Text style={[styles.statLabel, { color: '#43a047' }]}>Recorded</Text>
                                  </View>
                                  <Text style={[styles.statValue, { color: '#43a047' }]}>{recorded} days ({Math.round((recorded/total)*100)}%)</Text>
                                </View>
                                <ProgressBar 
                                  progress={Math.round((recorded/total)*100) / 100} 
                                  color="#43a047" 
                                  style={styles.progressBar}
                                />
                                
                                <View style={styles.statRow}>
                                  <View style={styles.statHeader}>
                                    <FontAwesome name="heart" size={15} color="#1976d2" style={{ marginRight: 4 }} />
                                    <Text style={[styles.statLabel, { color: '#1976d2' }]}>Passed</Text>
                                  </View>
                                  <Text style={[styles.statValue, { color: '#1976d2' }]}>{passed} days ({Math.round((passed/total)*100)}%)</Text>
                                </View>
                                <ProgressBar 
                                  progress={Math.round((passed/total)*100) / 100} 
                                  color="#1976d2" 
                                  style={styles.progressBar}
                                />
                                
                                <View style={styles.statRow}>
                                  <View style={styles.statHeader}>
                                    <MaterialIcons name="block" size={15} color="#e53935" style={{ marginRight: 4 }} />
                                    <Text style={[styles.statLabel, { color: '#e53935' }]}>Missed</Text>
                                  </View>
                                  <Text style={[styles.statValue, { color: '#e53935' }]}>{missed} days ({Math.round((missed/total)*100)}%)</Text>
                                </View>
                                <ProgressBar 
                                  progress={Math.round((missed/total)*100) / 100} 
                                  color="#e53935" 
                                  style={styles.progressBar}
                                />
                                
                                <View style={styles.statRow}>
                                  <View style={styles.statHeader}>
                                    <MaterialIcons name="error" size={15} color="#ff9800" style={{ marginRight: 4 }} />
                                    <Text style={[styles.statLabel, { color: '#ff9800' }]}>Failed</Text>
                                  </View>
                                  <Text style={[styles.statValue, { color: '#ff9800' }]}>{failed} days ({Math.round((failed/total)*100)}%)</Text>
                                </View>
                                <ProgressBar 
                                  progress={Math.round((failed/total)*100) / 100} 
                                  color="#ff9800" 
                                  style={styles.progressBar}
                                />
                              </View>
                            );
                          })()}
                        </View>
                      )}
                      {/* Actions - Updated to match web */}
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
const AddDailyRecordModal = ({ visible, onClose, onSubmit, limitCigarettesPerDay, loading = false }) => {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState(5);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setCigaretteSmoke('');
      setCravingLevel(5);
      setError('');
      setSubmitted(false);
    }
  }, [visible]);

  const validate = () => {
    if (!cigaretteSmoke || isNaN(cigaretteSmoke) || cigaretteSmoke < 0) {
      setError('Please enter a valid number of cigarettes');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validate() || loading) return;
    
    const now = new Date();
    const payload = {
      cigarette_smoke: Number(cigaretteSmoke),
      craving_level: Number(cravingLevel),
      health_status: 'NORMAL', // Default to normal as per web version
      record_date: now.toISOString(),
    };
    
    onSubmit(payload);
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    onClose();
  };

  // Calculate progress for the limit indicator
  const progress = limitCigarettesPerDay > 0 && cigaretteSmoke 
    ? Math.min(100, (Number(cigaretteSmoke) / limitCigarettesPerDay) * 100) 
    : 0;

  // Determine status color based on progress
  const getStatusColor = () => {
    if (limitCigarettesPerDay === 0) return '#fff3e0'; // Warning color for no cigarettes allowed
    if (!cigaretteSmoke) return '#f5f5f5'; // Default color
    if (progress > 100) return '#ffebee'; // Light red for exceeded limit
    if (progress === 100) return '#fff3e0'; // Light orange for exact limit
    if (progress >= 80) return '#fff8e1'; // Light yellow for approaching limit
    return '#e8f5e9'; // Light green for within limit
  };

  const getTextColor = () => {
    if (limitCigarettesPerDay === 0) return '#5d4037';
    if (!cigaretteSmoke) return '#333';
    if (progress >= 100) return '#c62828';
    if (progress >= 80) return '#e65100';
    return '#2e7d32';
  };

  const getStatusMessage = () => {
    if (limitCigarettesPerDay === 0) {
      return 'Your plan does not allow any cigarettes for today.';
    }
    if (progress > 100) {
      return `⚠️ You have exceeded your daily limit by ${cigaretteSmoke - limitCigarettesPerDay} cigarettes.`;
    }
    if (progress === 100) {
      return '⚠️ You have reached your daily limit. Try not to smoke more today.';
    }
    if (progress >= 80) {
      return 'You are close to your daily limit. Be mindful of your consumption.';
    }
    return 'Track your progress below';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            {loading ? (
              <View style={styles.loadingHeader}>
                <ActivityIndicator size="small" color="#4caf50" />
                <Text style={[styles.modalTitle, { marginLeft: 10 }]}>
                  Saving your record...
                </Text>
              </View>
            ) : (
              <Text style={styles.modalTitle}>Add Today's Record</Text>
            )}
          </View>
          
          {loading && <View style={styles.progressBar}><View style={[styles.progressFill, { width: '100%' }]} /></View>}
          
          <ScrollView style={styles.modalScrollContent}>
            {typeof limitCigarettesPerDay !== 'undefined' && (
              <View style={[
                styles.limitContainer,
                { 
                  backgroundColor: getStatusColor(),
                  borderColor: limitCigarettesPerDay === 0 ? '#ff9800' : 'transparent',
                  borderWidth: limitCigarettesPerDay === 0 ? 1 : 0,
                }
              ]}>
                <Text style={[
                  styles.limitText,
                  { 
                    color: getTextColor(),
                    fontWeight: 'bold',
                    fontSize: 16,
                  }
                ]}>
                  {limitCigarettesPerDay === 0 
                    ? 'No Cigarettes Allowed Today' 
                    : `Daily Limit: ${limitCigarettesPerDay} cigarettes`}
                </Text>
                <Text style={[
                  styles.limitSubtext,
                  { 
                    color: getTextColor(),
                    marginTop: 4,
                    opacity: 0.9,
                  }
                ]}>
                  {getStatusMessage()}
                </Text>
                
                {limitCigarettesPerDay > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${progress > 100 ? 100 : progress}%`,
                            backgroundColor: progress > 100 ? '#f44336' : 
                                           progress === 100 ? '#ff9800' :
                                           progress >= 80 ? '#ffc107' : '#4caf50'
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.progressText, { color: getTextColor() }]}>
                      {cigaretteSmoke || 0} / {limitCigarettesPerDay} cigarettes
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>How many cigarettes did you smoke today?</Text>
              <TextInput
                style={[
                  styles.input,
                  error ? styles.inputError : {},
                  { textAlign: 'center', fontSize: 18, fontWeight: '500' }
                ]}
                placeholder="0"
                value={cigaretteSmoke}
                onChangeText={(text) => {
                  setCigaretteSmoke(text);
                  if (submitted) validate();
                }}
                keyboardType="numeric"
                editable={!loading}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>How strong is your craving? (1-10)</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{cravingLevel}</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={cravingLevel}
                  onValueChange={setCravingLevel}
                  minimumTrackTintColor="#4caf50"
                  maximumTrackTintColor="#e0e0e0"
                  thumbTintColor="#4caf50"
                  disabled={loading}
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1</Text>
                  <Text style={styles.sliderLabel}>10</Text>
                </View>
              </View>
            </View>

            {limitCigarettesPerDay > 0 && progress >= 100 && (
              <View style={[
                styles.warningContainer,
                { 
                  backgroundColor: progress > 100 ? '#ffebee' : '#fff3e0',
                  borderLeftColor: progress > 100 ? '#f44336' : '#ff9800'
                }
              ]}>
                <Text style={[styles.warningText, { color: progress > 100 ? '#c62828' : '#e65100' }]}>
                  {progress > 100 
                    ? `You've exceeded your daily limit by ${cigaretteSmoke - limitCigarettesPerDay} cigarettes. Try to reduce your intake.`
                    : 'You have reached your daily limit. Please try not to smoke more today.'}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary, loading ? styles.buttonDisabled : null]} 
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton, 
                styles.modalButtonPrimary,
                loading ? styles.buttonDisabled : null
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                {loading ? 'Saving...' : 'Save Record'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Existing styles...
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  modalScrollContent: {
    maxHeight: '70%',
    marginBottom: 15,
  },
  limitContainer: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  limitText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  limitSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 5,
  },
  sliderContainer: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 5,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  sliderLabel: {
    color: '#666',
    fontSize: 14,
  },
  warningContainer: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  warningText: {
    color: '#e65100',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  modalButtonPrimary: {
    backgroundColor: '#4caf50',
  },
  modalButtonSecondary: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  modalButtonTextSecondary: {
    color: '#333',
  },
  progressBar: {
    height: 2,
    backgroundColor: '#e0e0e0',
    width: '100%',
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
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
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: '#4caf50',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3f332b',
  },
  progressLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statCardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statCardNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3f332b',
  },
  overviewContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3f332b',
    textAlign: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '700',
    flex: 1,
  },
  overviewLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overviewValue: {
    fontSize: 16,
    color: '#3f332b',
    fontWeight: '700',
    flex: 2,
    textAlign: 'right',
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
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
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
    flex: 1,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 24,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  pickerOptionSelected: {
    borderColor: '#3f332b',
    backgroundColor: '#f5f5f5',
  },
  pickerOptionUnselected: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#3f332b',
  },
  pickerOptionTextUnselected: {
    color: '#666',
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
    borderColor: '#000',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#000',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  limitContainer: {
    backgroundColor: '#ffe0b2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  limitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d84315',
    textAlign: 'center',
  },
  phaseTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    padding: 4,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  phaseTabActive: {
    backgroundColor: 'black',
  },
  phaseTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  phaseTabTextActive: {
    color: '#fff',
  },
  phaseDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3f332b',
    flex: 1,
    textAlign: 'right',
  },
  limitBox: {
    backgroundColor: '#ffe0b2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  limitText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d84315',
  },
  phaseActionsRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  webViewRecordsButton: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  webViewRecordsButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  webAddRecordButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  webAddRecordButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  statisticsContainer: {
    marginTop: 10,
  },
  statisticsContent: {
    marginTop: 10,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '900',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3f332b',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default QuitPlanDetailScreen; 