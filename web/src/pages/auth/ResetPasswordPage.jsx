import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import GlowingDotsGrid from '../../components/animated/GlowingDotsGrid';
import LoadingPage from '../LoadingPage';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to disable scrolling when component mounts
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
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
      await resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword });
      setMessage('Your password has been reset successfully. You can now sign in.');
      setFormData({
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Reset password error caught:', error);
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

  if (loading) {
    return <LoadingPage />;
  }

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
      <GlowingDotsGrid
        dotSize={12}
        dotGap={38}
        threshold={150}
        speedThreshold={100}
        shockRadius={250}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            maxWidth: 500,
            mx: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Reset Password
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            Enter your new password below
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
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="new-password"
              sx={textFieldStyle}
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
              autoComplete="new-password"
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
              {loading ? 'Resetting...' : 'Reset Password'}
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