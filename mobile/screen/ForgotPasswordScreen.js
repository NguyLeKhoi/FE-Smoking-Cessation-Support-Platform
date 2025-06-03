import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { forgotPassword } from '../service/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      Alert.alert('Success', 'A password reset link has been sent to your email address.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send password reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email address to receive a password reset link.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginLink}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    padding: 40,
    margin: 20,
    borderRadius: 8,
    backgroundColor: '#2c3e50',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b3b8',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1c2833',
    padding: 15,
    borderRadius: 4,
    marginBottom: 15,
    fontSize: 16,
    color: 'white',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  button: {
    backgroundColor: '#00b0ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#00b0ff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ForgotPasswordScreen; 