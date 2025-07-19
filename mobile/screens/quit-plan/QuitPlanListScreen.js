// QuitPlanListScreen.js
// Màn hình danh sách kế hoạch bỏ thuốc mobile - Updated with better UI and create plan functionality

import React, { useEffect, useState } from 'react';
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
  TextInput
} from 'react-native';
import quitPlanService from '../../service/quitPlanService';

const QuitPlanListScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [reason, setReason] = useState('');
  const [planType, setPlanType] = useState('standard');

  useEffect(() => {
    fetchPlans();
    const unsubscribe = navigation.addListener('focus', fetchPlans);
    return unsubscribe;
  }, [navigation]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await quitPlanService.getAllQuitPlans();
      setPlans(res.data || res); // handle both axios and fetch style
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (plan) => {
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
      
      // Refresh plans list
      fetchPlans();
      
      Alert.alert('Success', 'Quit plan created successfully!');
      
      // Navigate to the new plan detail
      const newPlan = response.data?.data || response.data;
      if (newPlan) {
        navigation.navigate('QuitPlanDetail', { id: newPlan.id || newPlan._id });
      }
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

  const renderPlanItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.planItem} 
      onPress={() => handlePress(item)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planReason}>{item.reason}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePlan(item)}
          disabled={deletingId === (item._id || item.id)}
        >
          {deletingId === (item._id || item.id) ? (
            <ActivityIndicator size="small" color="#e53935" />
          ) : (
            <Text style={styles.deleteButtonText}>×</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.planDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={[
            styles.detailValue, 
            { color: getPlanTypeColor(item.plan_type) }
          ]}>
            {String(item.plan_type).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[
            styles.detailValue, 
            { color: getStatusColor(item.status) }
          ]}>
            {item.status}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration:</Text>
          <Text style={styles.detailValue}>
            {item.start_date && item.expected_end_date
              ? `${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.expected_end_date).toLocaleDateString()}`
              : '-'}
          </Text>
        </View>
      </View>
      
      <View style={styles.planFooter}>
        <Text style={styles.viewDetailsText}>Tap to view details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quit Plans</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.createButtonText}>+ Create Plan</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f332b" />
        </View>
      ) : plans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No quit plans yet</Text>
          <Text style={styles.emptySubtitle}>
            Start your journey to quit smoking by creating a personalized plan.
          </Text>
          <TouchableOpacity 
            style={styles.emptyCreateButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.emptyCreateButtonText}>Create Your First Plan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={item => item._id || item.id}
          renderItem={renderPlanItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

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
    backgroundColor: '#f7f7ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f332b',
  },
  createButton: {
    backgroundColor: '#3f332b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  listContainer: {
    padding: 20,
  },
  planItem: {
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  planReason: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3f332b',
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#e53935',
    fontWeight: 'bold',
  },
  planDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  planFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#3f332b',
    textAlign: 'center',
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
});

export default QuitPlanListScreen; 