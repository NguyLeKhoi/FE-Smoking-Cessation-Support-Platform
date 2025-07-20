// QuitPlanListScreen.js
// Mobile quit plan list screen with web-like UI

import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import quitPlanService from '../../service/quitPlanService';
import { SwipeListView } from 'react-native-swipe-list-view';

const slogans = [
  'Start your quit journey today and track your progress here!',
  'Your determination today is your freedom tomorrow.',
  'A smoke-free life is a healthier life. You can do it!',
];

const QuitPlanListScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reason, setReason] = useState('');
  const [planType, setPlanType] = useState('standard');
  const [expandedId, setExpandedId] = useState(null);
  const [openRowKey, setOpenRowKey] = useState(null);

  // Get the first plan (like web implementation)
  const plan = Array.isArray(plans) && plans.length > 0 ? plans[0] : null;
  
  // Fallback: if no plan but plans array exists, show first plan
  const displayPlan = plan || (Array.isArray(plans) && plans.length > 0 ? plans[0] : null);
  const randomSlogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);

  // Calculate plan info (total days and phases)
  const getPlanInfo = (plan) => {
    if (!plan) return { totalDays: 0, numPhases: 0 };
    
    let totalDays = 0;
    if (plan.start_date && plan.expected_end_date) {
      const start = new Date(plan.start_date);
      const end = new Date(plan.expected_end_date);
      totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    
    const numPhases = plan.phases ? plan.phases.length : 0;
    
    return { totalDays, numPhases };
  };

  useEffect(() => {
    fetchPlans();
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await quitPlanService.getAllQuitPlans();
      
      // Handle different response structures
      let plansData = [];
      if (Array.isArray(response.data?.data?.data)) {
        plansData = response.data.data.data;
      } else if (Array.isArray(response.data?.data)) {
        plansData = response.data.data;
      } else if (Array.isArray(response.data)) {
        plansData = response.data;
      } else if (Array.isArray(response)) {
        plansData = response;
      }
      
      setPlans(plansData);
    } catch (error) {
      // Don't clear plans on 401 error, just show error
      if (error.response?.status === 401) {
        // Don't clear existing plans on 401 error
        // Just show a warning but keep the UI functional
        return;
      }
      
      // Only clear plans on other errors
      setPlans([]);
      Alert.alert('Error', 'Failed to load quit plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (plan) => {
    console.log('Navigate to detail with id:', plan._id || plan.id);
    navigation.navigate('QuitPlanDetail', { id: plan._id || plan.id });
  };

  const handleDeletePlan = async (plan) => {
    Alert.alert(
      'Delete Plan',
      'Are you sure you want to delete this quit plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(plan._id || plan.id);
            try {
              await quitPlanService.deleteQuitPlan(plan._id || plan.id);
              setPlans((prev) => prev.filter((p) => (p._id || p.id) !== (plan._id || plan.id)));
              Alert.alert('Success', 'Plan deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plan');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const handleCreatePlan = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a reason for quitting');
      return;
    }

    setCreating(true);
    try {
      const response = await quitPlanService.createQuitPlan({
        reason: reason.trim(),
        plan_type: planType
      });
      
      setShowCreateModal(false);
      setReason('');
      setPlanType('standard');
      
      // Refresh plans list first
      await fetchPlans();
      
      Alert.alert('Success', 'Quit plan created successfully!');
      
      // No longer navigate to detail, just stay on list
    } catch (error) {
      Alert.alert('Error', 'Failed to create quit plan');
    } finally {
      setCreating(false);
    }
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

  const renderPlanFieldListRow = ({ item: plan }) => {
    if (plan.type === 'slogan') {
      return (
        <View style={styles.sloganRowContainer}>
          <Text style={styles.sloganText}>{randomSlogan}</Text>
        </View>
      );
    }
    const { totalDays, numPhases } = getPlanInfo(plan);
    const isOpen = openRowKey === (plan._id || plan.id);
    return (
      <View style={styles.fieldListRowContainerOuter}>
        <View style={styles.fieldListRowContainer}>
          <View style={styles.fieldListRow}><MaterialCommunityIcons name="smoking" size={18} color="#1976d2" style={styles.fieldListIcon} /><Text style={styles.fieldListLabel}>Reason:</Text><Text style={styles.fieldListValue}>{plan.reason}</Text></View>
          <View style={styles.fieldListRow}><MaterialIcons name="flag" size={18} color="#388e3c" style={styles.fieldListIcon} /><Text style={styles.fieldListLabel}>Type:</Text><Text style={styles.fieldListValue}>{String(plan.plan_type).toUpperCase()}</Text></View>
          <View style={styles.fieldListRow}><Ionicons name="hourglass" size={18} color="#43a047" style={styles.fieldListIcon} /><Text style={styles.fieldListLabel}>Status:</Text><Text style={styles.fieldListValue}>{plan.status}</Text></View>
          <View style={styles.fieldListRow}><Ionicons name="calendar" size={18} color="#0288d1" style={styles.fieldListIcon} /><Text style={styles.fieldListLabel}>Duration:</Text><Text style={styles.fieldListValue}>{plan.start_date && plan.expected_end_date ? `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.expected_end_date).toLocaleDateString()}` : '-'}</Text></View>
          <View style={styles.fieldListRow}><MaterialIcons name="event" size={18} color="#7e57c2" style={styles.fieldListIcon} /><Text style={styles.fieldListLabel}>Plan info:</Text><Text style={styles.fieldListValue}>{totalDays}d, {numPhases}p</Text></View>
        </View>
        <Ionicons name={isOpen ? "chevron-back" : "chevron-forward"} size={20} color="#bbb" style={styles.chevronIconFieldList} />
      </View>
    );
  };

  const renderHiddenRow = (data, rowMap) => {
    const plan = data.item;
    if (plan.type === 'slogan') return null;
    return (
      <View style={styles.swipeRowBackRight}>
        <TouchableOpacity
          style={[styles.swipeActionBtn, styles.swipeViewBtn]}
          onPress={() => handlePress(plan)}
        >
          <Ionicons name="eye" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.swipeActionBtn, styles.swipeDeleteBtn, styles.swipeDeleteBtnGap]}
          onPress={() => handleDeletePlan(plan)}
          disabled={deletingId === (plan._id || plan.id)}
        >
          {deletingId === (plan._id || plan.id) ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="delete" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.content}>
        
      {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3f332b" />
          </View>
        ) : !plans.length ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>You have no quit plan yet.</Text>
            <Text style={styles.emptySubtitle}>
              Start your journey to quit smoking by creating a personalized plan.
            </Text>
            <TouchableOpacity 
              style={styles.emptyCreateButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.emptyCreateButtonText}>Create Quit Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SwipeListView
            data={[...plans, { type: 'slogan', id: 'slogan-row' }]}
            keyExtractor={item => item._id || item.id || item.id || item.type}
            renderItem={renderPlanFieldListRow}
            renderHiddenItem={renderHiddenRow}
            rightOpenValue={-140}
            leftOpenValue={0}
            disableRightSwipe={true}
            disableLeftSwipe={false}
            contentContainerStyle={styles.swipeListContainer}
            onRowOpen={rowKey => setOpenRowKey(rowKey)}
            onRowClose={() => setOpenRowKey(null)}
          />
        )}
        
      </View>

      {/* Create Plan Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Quit Plan</Text>
            
            <View style={styles.planTypeContainer}>
              <Text style={styles.modalLabel}>Plan Type:</Text>
              <View style={styles.planTypeOptions}>
                {[
                  { value: 'slow', label: 'Slow', description: 'Gradual reduction, gentler pace' },
                  { value: 'standard', label: 'Standard', description: 'Balanced reduction and support' },
                  { value: 'aggressive', label: 'Aggressive', description: 'Fastest reduction, more challenging' }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.planTypeOption,
                      planType === type.value && styles.planTypeOptionSelected
                    ]}
                    onPress={() => setPlanType(type.value)}
                  >
                    <Text style={[
                      styles.planTypeLabel,
                      planType === type.value && styles.planTypeLabelSelected
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={[
                      styles.planTypeDescription,
                      planType === type.value && styles.planTypeDescriptionSelected
                    ]}>
                      {type.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Text style={styles.modalLabel}>Reason for quitting:</Text>
            <TextInput
              style={styles.reasonInput}
              value={reason}
              onChangeText={setReason}
              placeholder="Describe your main motivation for quitting smoking..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setShowCreateModal(false)}
                disabled={creating}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]} 
                onPress={handleCreatePlan}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                    Create Plan
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
    </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3f332b',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emptyCreateButton: {
    backgroundColor: '#3f332b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyCreateButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  plansContainer: {
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexWrap: 'wrap',
    minHeight: 48,
    backgroundColor: '#fff',
  },
  badgeReason: {
    fontWeight: 'bold',
    color: '#3f332b',
    fontSize: 15,
    maxWidth: 90,
    marginRight: 8,
    flexShrink: 1,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
    marginBottom: 2,
    minWidth: 0,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  badgeType: {
    backgroundColor: '#388e3c',
  },
  badgeStatus: {
    backgroundColor: '#43a047',
  },
  badgeDuration: {
    backgroundColor: '#0288d1',
  },
  badgePlanInfo: {
    backgroundColor: '#7e57c2',
  },
  badgeActionBtn: {
    marginLeft: 4,
    padding: 4,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexWrap: 'nowrap',
    minHeight: 48,
  },
  rowIcon: {
    marginHorizontal: 2,
  },
  rowReason: {
    fontWeight: 'bold',
    color: '#3f332b',
    fontSize: 14,
    maxWidth: 70,
    marginHorizontal: 2,
    flexShrink: 1,
  },
  rowType: {
    fontWeight: 'bold',
    fontSize: 13,
    marginHorizontal: 2,
    maxWidth: 50,
  },
  rowStatus: {
    fontWeight: 'bold',
    fontSize: 13,
    marginHorizontal: 2,
    maxWidth: 50,
  },
  rowDuration: {
    fontSize: 12,
    color: '#333',
    marginHorizontal: 2,
    maxWidth: 80,
  },
  rowPlanInfo: {
    fontSize: 12,
    color: '#7e57c2',
    marginHorizontal: 2,
    maxWidth: 60,
  },
  rowActionBtn: {
    marginHorizontal: 2,
    padding: 2,
  },
  rowViewText: {
    color: '#3f332b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planCard: {
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  planCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  planCardTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f332b',
    marginLeft: 8,
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planCardDetails: {
    marginBottom: 15,
  },
  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planDetailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
  },
  planDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  planCardActions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  viewDetailsButton: {
    backgroundColor: '#3f332b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  planTypeContainer: {
    marginBottom: 20,
  },
  planTypeOptions: {
    gap: 10,
  },
  planTypeOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  planTypeOptionSelected: {
    borderColor: '#3f332b',
    backgroundColor: '#f5f5f5',
  },
  planTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planTypeLabelSelected: {
    color: '#3f332b',
  },
  planTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  planTypeDescriptionSelected: {
    color: '#3f332b',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 20,
    textAlignVertical: 'top',
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
  sloganText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 0,
    fontStyle: 'italic',
  },
  swipeListContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  swipeRowFront: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    minHeight: 64,
  },
  swipeReason: {
    fontWeight: 'bold',
    color: '#3f332b',
    fontSize: 18,
    maxWidth: 120,
    marginRight: 12,
    flexShrink: 1,
  },
  swipeFields: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  swipeIcon: {
    marginHorizontal: 2,
  },
  swipeFieldText: {
    color: '#333',
    fontSize: 15,
    marginRight: 12,
    fontWeight: '500',
  },
  swipeRowBackRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingRight: 10,
    width: 140,
  },
  swipeActionBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  swipeViewBtn: {
    backgroundColor: '#1976d2',
    marginRight: 0,
  },
  swipeDeleteBtn: {
    backgroundColor: '#e53935',
    marginLeft: 0,
  },
  swipeDeleteBtnGap: {
    marginLeft: 10,
  },
  swipeRowFront2Line: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  swipeReason2Line: {
    fontWeight: 'bold',
    color: '#3f332b',
    fontSize: 18,
    marginBottom: 6,
    flexShrink: 1,
  },
  swipeFields2Line: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 18,
  },
  swipeFieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  swipeIcon2Line: {
    marginRight: 4,
  },
  swipeFieldText2Line: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  swipeRowFront3Line: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  swipeReason3Line: {
    fontWeight: 'bold',
    color: '#3f332b',
    fontSize: 18,
    marginBottom: 6,
    flexShrink: 1,
  },
  swipeFields3Line: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 18,
    marginBottom: 4,
  },
  swipeFieldItem3Line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  swipeIcon3Line: {
    marginRight: 4,
  },
  swipeFieldText3Line: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  swipeFields3LineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginLeft: 2,
    gap: 24,
  },
  swipeRowFront3LineWithChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  chevronIcon: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  sloganRowContainer: {
    marginTop: 24,
    marginBottom: 12,
    alignItems: 'center',
  },
  fieldListRowContainerOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  fieldListRowContainer: {
    flex: 1,
  },
  fieldListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldListIcon: {
    marginRight: 8,
  },
  fieldListLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 15,
    marginRight: 6,
    minWidth: 80,
  },
  fieldListValue: {
    color: '#222',
    fontSize: 15,
    flexShrink: 1,
  },
  chevronIconFieldList: {
    marginLeft: 12,
    alignSelf: 'center',
  },
});

export default QuitPlanListScreen; 