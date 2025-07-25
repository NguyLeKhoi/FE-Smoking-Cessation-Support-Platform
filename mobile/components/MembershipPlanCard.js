import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MembershipPlanCard = ({ plan, onSelect }) => (
  <TouchableOpacity style={styles.card} onPress={() => onSelect(plan)}>
    <Text style={styles.title}>{plan.name}</Text>
    <Text style={styles.price}>{plan.price} VND</Text>
    <Text style={styles.duration}>{plan.duration} tháng</Text>
    <Text style={styles.description}>{plan.description}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});

export default MembershipPlanCard; 