import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    dob: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone_number.match(/^[0-9]{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob,
        phone_number: formData.phone_number,
      };

      console.log('Signup data being sent:', userData);

      const response = await signup(userData);

      if (response.success) {
        navigate('/login');
      } else {
        // Fallback for generic success: false response (shouldn't happen if backend follows standard)
        setError('Failed to create account');
      }
    } catch (error) {
      console.error('Signup error caught:', error);
      let errorMessage = 'An unexpected error occurred during signup.'; // Default error message

      if (error.response) {
        // Server responded with a status other than 2xx (e.g., 422)
        console.log('Backend error response:', error.response);
        if (error.response.data) {
          console.log('Backend error response data:', error.response.data);

          // --- Attempt to get specific error message from 'errors' array --- 
          if (error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
            errorMessage = error.response.data.errors.map((err) => `${err.path}: ${err.message}`).join(', ');
          } else if (error.response.data.message) {
            // --- Fallback to a general message from the backend --- 
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            // --- Handle plain string error responses --- 
            errorMessage = error.response.data;
          } else {
            // --- If data exists but doesn't match expected structures --- 
            errorMessage = `Request failed: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.message) {
          // Use generic error message from the Error object if no response data
          errorMessage = error.message;
        } else {
          errorMessage = `Request failed with status ${error.response.status}`;
        }
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      setError(errorMessage); // Set the determined error message
      console.log('Setting error message:', errorMessage);
    } finally {
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
          bgcolor: '#2c3e50',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Create Account
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: '#b0b3b8' }}>
          Sign up to get started
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                autoComplete="given-name"
                InputLabelProps={{
                  style: { color: '#b0b3b8' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    bgcolor: '#1c2833',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                autoComplete="family-name"
                InputLabelProps={{
                  style: { color: '#b0b3b8' },
                }}
                InputProps={{
                  style: { color: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    bgcolor: '#1c2833',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' },
                  },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="username"
            InputLabelProps={{
              style: { color: '#b0b3b8' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />
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
            InputLabelProps={{
              style: { color: '#b0b3b8' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="tel"
            placeholder="1234567890"
            InputLabelProps={{
              style: { color: '#b0b3b8' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Birth Date"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true, style: { color: '#b0b3b8' } }}
            InputProps={{
                style: { color: 'white' },
              }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
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
            autoComplete="new-password"
            InputLabelProps={{
              style: { color: '#b0b3b8' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            autoComplete="new-password"
            InputLabelProps={{
              style: { color: '#b0b3b8' },
            }}
            InputProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#1c2833',
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'transparent' },
                '&.Mui-focused fieldset': { borderColor: 'transparent' },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#00b0ff',
              color: 'white',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 0 #007ac1',
              '&:hover': {
                bgcolor: '#0091ea',
                boxShadow: '0 2px 0 #007ac1',
                transform: 'translateY(2px)',
              },
              '&:active': {
                boxShadow: '0 0 0 #007ac1',
                transform: 'translateY(4px)',
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => window.location.href = process.env.REACT_APP_BACKEND_GOOGLE_AUTH_URL}
            startIcon={<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" style={{ width: 20, height: 20 }} />}
            sx={{
              mt: 1,
              mb: 2,
              color: 'black',
              backgroundColor: 'white',
              borderColor: '#3a3a3a',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 0 #212121',
              '&:hover': {
                borderColor: '#555',
                bgcolor: '#f0f0f0',
                boxShadow: '0 2px 0 #212121',
                transform: 'translateY(2px)',
              },
              '&:active': {
                boxShadow: '0 0 0 #212121',
                transform: 'translateY(4px)',
              },
            }}
          >
            Sign up with Google
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b3b8' }}>
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: '#00b0ff', fontWeight: 'bold' }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 