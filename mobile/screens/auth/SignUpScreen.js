import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { signup } from '../../service/authService';

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
      <Text style={styles.title}>Create your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={form.username}
        onChangeText={text => handleChange('username', text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#999"
        value={form.first_name}
        onChangeText={text => handleChange('first_name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#999"
        value={form.last_name}
        onChangeText={text => handleChange('last_name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date (yyyy-mm-dd)"
        placeholderTextColor="#999"
        value={form.birth_date}
        onChangeText={text => handleChange('birth_date', text)}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SignUpScreen; 