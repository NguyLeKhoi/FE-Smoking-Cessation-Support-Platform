import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      [e.target.name]: e.target.value,
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
          // boxShadow: '0 0 10px rgba(0,0,0,0.1)', // Remove light shadow
          bgcolor: '#2c3e50', // Darker background for the form container
          color: 'white', // White text color
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}> {/* White title */}
          Sign in
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: '#b0b3b8' }}> {/* Light grey subtitle */}
          Welcome to Quitify!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="Email or username"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="email"
            InputLabelProps={{
              style: { color: '#b0b3b8' }, // Light grey label
            }}
            InputProps={{
              style: { color: 'white' }, // White input text
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px', // Slight rounding
                bgcolor: '#1c2833', // Even darker background for input
                '& fieldset': { borderColor: 'transparent' }, // Hide border
                '&:hover fieldset': { borderColor: 'transparent' }, // Hide border on hover
                '&.Mui-focused fieldset': { borderColor: 'transparent' }, // Hide border when focused
              },
            }}
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
            InputLabelProps={{
              style: { color: '#b0b3b8' }, // Light grey label
            }}
            InputProps={{
              style: { color: 'white' }, // White input text
            }}
             sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px', // Slight rounding
                bgcolor: '#1c2833', // Even darker background for input
                '& fieldset': { borderColor: 'transparent' }, // Hide border
                '&:hover fieldset': { borderColor: 'transparent' }, // Hide border on hover
                '&.Mui-focused fieldset': { borderColor: 'transparent' }, // Hide border when focused
              },
            }}
          />

          {/* Forgot password link */}
          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Link component="button" variant="body2" onClick={() => navigate('/forgot-password')} sx={{ color: '#00b0ff' }}> {/* Blue color for link */}
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#00b0ff', // Vibrant blue background
              color: 'white', // White text color
              borderRadius: '8px', // More rounded corners
              px: 3,
              py: 1.5, // Keep this one for vertical padding
              boxShadow: '0 4px 0 #007ac1', // Custom box shadow for 3D effect
              '&:hover': {
                bgcolor: '#0091ea', // Slightly darker blue on hover
                boxShadow: '0 2px 0 #007ac1', // Adjust shadow on hover
                transform: 'translateY(2px)', // Move button down slightly on hover
              },
              '&:active': {
                boxShadow: '0 0 0 #007ac1', // Remove shadow when pressed
                transform: 'translateY(4px)', // Move button down further when pressed
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#3a3a3a' }} />
            <Typography variant="body2" sx={{ mx: 2, color: '#b0b3b8' }}>OR</Typography>
            <Box sx={{ flexGrow: 1, height: '1px', bgcolor: '#3a3a3a' }} />
          </Box>

          {/* Social Login Buttons (placeholders) */}

          <Button
            fullWidth
            variant="outlined"
            onClick={() => window.location.href = process.env.REACT_APP_BACKEND_GOOGLE_AUTH_URL}
            startIcon={<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" style={{ width: 20, height: 20 }} />}
            sx={{
              mt: 1,
              mb: 2,
              color: 'black', // Black text
              backgroundColor: 'white', // White background
              borderColor: '#3a3a3a', // Dark border
              borderRadius: '8px', // More rounded corners
              px: 3,
              py: 1.5, // Keep this one for vertical padding
              boxShadow: '0 4px 0 #212121', // Custom box shadow for 3D effect (dark grey)
              '&:hover': {
                borderColor: '#555', // Slightly lighter border on hover
                bgcolor: '#f0f0f0', // Light grey background on hover
                boxShadow: '0 2px 0 #212121', // Adjust shadow on hover
                transform: 'translateY(2px)', // Move button down slightly on hover
              },
              '&:active': {
                boxShadow: '0 0 0 #212121', // Remove shadow when pressed
                transform: 'translateY(4px)', // Move button down further when pressed
              },
            }}
          >
            Sign in with Google
          </Button>

          {/* Signup link */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b3b8' }}>
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/signup')}
                sx={{ color: '#00b0ff', fontWeight: 'bold' }} // Blue link
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
