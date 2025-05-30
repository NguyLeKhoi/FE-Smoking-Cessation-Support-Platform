import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log('LoginPage component mounted');
  //   return () => {
  //     console.log('LoginPage component unmounted');
  //   };
  // }, []);

  const handleChange = (e) => {
    // console.log('Form data changing:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form submitted');
    // console.log('Login credentials being sent:', formData);
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      // console.log('Login API response:', response);
      // Check for the presence of accessToken to confirm successful login
      if (response && response.accessToken) {
        // console.log('Login successful, navigating to /');
        navigate('/');
      } else {
        // console.log('Login failed: Invalid credentials or server response (no accessToken)');
        setError('Login failed: Invalid credentials or server response.');
      }
    } catch (error) {
      console.error('Login error caught:', error);
      // Attempt to display a more specific error message from the server
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Server error message:', error.response.data.message);
        setError(`Login failed: ${error.response.data.message}`);
      } else if (error.message) {
        console.error('Error message:', error.message);
        setError(`Login failed: ${error.message}`);
      } else {
        console.error('Unknown error');
        setError('Login failed: An unexpected error occurred.');
      }
    } finally {
      // console.log('Login process finished, loading set to false');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          // Add semi-transparent background and backdrop filter for blur
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
          backdropFilter: 'blur(5px)', // Apply a blur effect
          WebkitBackdropFilter: 'blur(5px)', // For Safari support
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#AF3E3E' }}> {/* Use dark red for title */}
          Welcome Back
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Sign in to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              backgroundColor: '#AF3E3E', // Use dark red for button
              '&:hover': {
                backgroundColor: '#CD5656', // Use medium red for hover
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signup')}
                sx={{ color: '#AF3E3E', fontWeight: 'bold' }} // Use dark red for link
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
