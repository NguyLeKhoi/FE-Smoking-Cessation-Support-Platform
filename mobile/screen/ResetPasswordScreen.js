import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
// import { resetPassword } from '../service/authService'; // Will uncomment later
import { useRoute } from '@react-navigation/native';

const ResetPasswordScreen = ({ navigation }) => {
  const route = useRoute();
  const { token } = route.params || {}; // Get token from route params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('No reset token provided.');
    }
  }, [token]);

  const handleResetPassword = async () => {
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
       setError('Cannot reset password: No token provided.');
       return;
    }

    setLoading(true);

    try {
      // await resetPassword({ token, password, confirmPassword }); // Will uncomment later
      setMessage('Your password has been reset successfully. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
      // Optionally navigate to login screen after a delay
      // setTimeout(() => navigation.replace('Login'), 3000);
    } catch (error) {
      console.error('Reset password error caught:', error);
       setError(error.message || 'An unexpected error occurred.'); // Simplified error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
       <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Password</Text>

        {message && (
          <Text style={[styles.subtitle, { color: 'green' }]}>{message}</Text> // Use subtitle style for message
        )}

         {error && (
          <Text style={[styles.subtitle, { color: 'red' }]}>{error}</Text> // Use subtitle style for error
        )}

        <View style={styles.inputContainer}> {/* Added input container */}
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
        </TouchableOpacity>

         <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.loginLink}>Remember your password? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50', // Dark background
     justifyContent: 'center',
    paddingHorizontal: 20,
  },
   formContainer: {
    padding: 40, // Added padding for spacing
    margin: 20, // Added margin to create a box effect
    borderRadius: 8, // Rounded corners for the box
    backgroundColor: '#2c3e50', // Match background or use a slightly different dark shade if desired
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white', // White text
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
     fontSize: 16,
    color: '#b0b3b8', // Light grey text
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1c2833', // Darker background for input
    padding: 15,
    borderRadius: 4, // Slight rounding
    marginBottom: 15,
    fontSize: 16,
    color: 'white', // White input text
    borderWidth: 0, // Remove border
    borderColor: 'transparent', // Ensure border is transparent
  },
  button: {
    backgroundColor: '#00b0ff', // Vibrant blue background
    padding: 15,
    borderRadius: 8, // More rounded corners
    alignItems: 'center',
    marginTop: 20, // Added margin top
    // Custom box shadow for 3D effect (approximate in React Native)
    shadowColor: '#007ac1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#00b0ff', // Blue link
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20, // Adjusted margin top
  },
});

export default ResetPasswordScreen; 