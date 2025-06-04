import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to disable scrolling when component mounts
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } catch (error) {
      console.error('Forgot password error caught:', error);
      if (error.message) {
        setError(`Error: ${error.message}`);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Common text field styling based on theme
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: 'background.paper',
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': {
      color: 'text.secondary',
    },
    '& .MuiOutlinedInput-input': {
      color: 'text.primary',
    },
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: '#f6f5f3',
    }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            maxWidth: 500,
            minWidth: 600,
            mx: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Forgot Password
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            Enter your email to receive a password reset link
          </Typography>

          {message && (
            <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              sx={textFieldStyle}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                bgcolor: '#000000',
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 0 #00000080',
                '&:hover': {
                  bgcolor: '#000000cd',
                  boxShadow: '0 2px 0 #00000080',
                  transform: 'translateY(2px)',
                },
                '&:active': {
                  boxShadow: '0 0 0 #00000080',
                  transform: 'translateY(4px)',
                },
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Remember your password?{' '}
                <Link
                  component="button"
                  variant="body1"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      transform: 'scaleX(0)',
                      height: '2px',
                      bottom: -1,
                      left: 0,
                      backgroundColor: 'primary.main',
                      transformOrigin: 'bottom right',
                      transition: 'transform 0.3s ease-out'
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'bottom left'
                    }
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}