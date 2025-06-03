import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { login } from '../service/authService';
import { startAsync } from 'expo-auth-session';
import { getGoogleLoginUrl } from '../service/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await login(email, password);
        navigation.replace('MainApp');
      } catch (error) {
        console.log('Login error:', error);
        let message = 'Login failed. Please check your credentials.';
        if (error.response && error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
        Alert.alert('Error', message);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={async () => {
          try {
            const url = await getGoogleLoginUrl();
            const result = await startAsync({ authUrl: url });
            if (result.type === 'success') {
              Alert.alert('Google Login Success', 'You have logged in with Google!');
              navigation.replace('MainApp');
            }
          } catch (error) {
            Alert.alert('Google Login Failed', error.message);
          }
        }}>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  inputContainer: {
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#00b0ff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#00b0ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#b0b3b8',
    fontSize: 14,
  },
  registerLink: {
    color: '#00b0ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#212121',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  googleButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
