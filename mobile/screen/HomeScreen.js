import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Screen</Text>
      <Text style={styles.subtitle}>This is your main dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181828',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8e24aa',
  },
  subtitle: {
    fontSize: 16,
    color: '#bdbdbd',
  },
});

export default HomeScreen;
