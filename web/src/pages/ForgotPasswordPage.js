import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService'; // Uncommented

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email }); // Uncommented and used
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } catch (error) {
      console.error('Forgot password error caught:', error);
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
          bgcolor: 'white',
          color: 'black',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
          Forgot Password
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
            label="Enter your email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
            InputLabelProps={{
              style: { color: '#666666' },
            }}
            InputProps={{
              style: { color: 'black' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                bgcolor: '#f5f5f5',
                '& fieldset': { borderColor: '#e0e0e0' },
                '&:hover fieldset': { borderColor: '#00b0ff' },
                '&.Mui-focused fieldset': { borderColor: '#00b0ff' },
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
            {loading ? 'Sending...' : 'Send reset link to your email'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666666' }}>
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