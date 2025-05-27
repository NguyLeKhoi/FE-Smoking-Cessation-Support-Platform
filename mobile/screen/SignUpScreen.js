import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { signup } from '../service/authService';

const SignUpScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const validateDate = (date) => {
    // Regex for yyyy-mm-dd
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const handleSignUp = async () => {
    if (!validateDate(form.birth_date)) {
      Alert.alert('Error', 'Birth date must be in yyyy-mm-dd format');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={text => handleChange('username', text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.first_name}
        onChangeText={text => handleChange('first_name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.last_name}
        onChangeText={text => handleChange('last_name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date (yyyy-mm-dd)"
        value={form.birth_date}
        onChangeText={text => handleChange('birth_date', text)}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={form.phone_number}
        onChangeText={text => handleChange('phone_number', text)}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#8e24aa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#8e24aa',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignUpScreen; 