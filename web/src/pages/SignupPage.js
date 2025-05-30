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
    birth_date: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        birth_date: formData.birth_date,
        phone_number: formData.phone_number
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
      // Check if the error response contains specific validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const fieldErrors = error.response.data.errors;
        // Assuming there's only one field error for now, or we can loop through them
        if (fieldErrors.length > 0) {
          setError(`${fieldErrors[0].path}: ${fieldErrors[0].message}`);
        } else {
          // If there are errors but no specific field errors listed
          setError(error.response.data.message || 'Validation failed');
        }
      } else if (error.message) {
        setError(error.message || 'Failed to sign up');
      } else {
        // ... existing code ...
      }
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
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#AF3E3E' }}>
          Create Account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
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
          />
          <TextField
            fullWidth
            label="Birth Date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
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
              backgroundColor: '#AF3E3E',
              '&:hover': {
                backgroundColor: '#CD5656',
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ color: '#AF3E3E', fontWeight: 'bold' }}
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