import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../services/authService'; // Uncommented

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // You might want to add logic here to validate the token if necessary
    if (!token) {
      setError('No reset token provided.');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
       setError('Cannot reset password: No token provided.');
       return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }); // Uncommented and used
      setMessage('Your password has been reset successfully. You can now sign in.');
      setFormData({
        password: '',
        confirmPassword: '',
      });
      // Optionally navigate to login page after a delay
      // setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Reset password error caught:', error);
       if (error.message) { // Simplified error handling
        setError(`Error: ${error.message}`);
      } else {
        setError('An unexpected error occurred.');
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
          bgcolor: '#2c3e50',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Reset Password
        </Typography>

        {message && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {message}
          </Alert>
        )}

         {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
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
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

           <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b3b8' }}>
              Remember your password?{' '}
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