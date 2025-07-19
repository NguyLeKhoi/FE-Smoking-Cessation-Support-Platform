import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import GlowingDotsGrid from '../../components/animated/GlowingDotsGrid';
import LoadingPage from '../LoadingPage';
import HomeIcon from '@mui/icons-material/Home'; // Import the home icon
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '../../context/SocketContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshSocket } = useSocket();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      if (response && response.accessToken) {
        // Refresh socket connection with new token
        refreshSocket();

        // Decode token để kiểm tra role
        const decoded = jwtDecode(response.accessToken);
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Login failed: Invalid credentials or server response.');
      }
    } catch (error) {
      console.error('Login error caught:', error);
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
      setLoading(false);
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root CVroot': {
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
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
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
      }}
    >
      {/* Background Glowing Dots Grid */}
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

      {/* Login Form Container */}
      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: '#ffffff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            maxWidth: 500,
            mx: 'auto',
            position: 'relative', 
          }}
        >
          {/* Home Icon Button - Added in top left */}
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                color: 'primary.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
              zIndex: 3,
            }}
            aria-label="Go to home page"
          >
            <HomeIcon />
          </IconButton>

          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Sign in
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            Welcome to Zerotine!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
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
              sx={textFieldStyle}
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
              sx={textFieldStyle}
            />

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link
                component="span"
                variant="body2"
                onClick={() => navigate('/forgot-password')}
                sx={{ color: 'primary.main', fontWeight: 500, cursor: 'pointer' }}
              >
                Forgot password?
              </Link>
            </Box>

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
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
              <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>OR</Typography>
              <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'rgba(0, 0, 0, 0.1)' }} />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => window.location.href = process.env.REACT_APP_BACKEND_GOOGLE_AUTH_URL}
              startIcon={<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" style={{ width: 20, height: 20 }} />}
              sx={{
                mb: 3,
                py: 1.5,
                color: 'text.primary',
                backgroundColor: 'background.paper',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                borderRadius: '12px',
                boxShadow: '0 4px 0 rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'text.primary',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 2px 0 rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(2px)',
                },
                '&:active': {
                  boxShadow: '0 0 0 rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(4px)',
                },
              }}
            >
              Sign in with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Don't have an account?{' '}
                <Link
                  component="span"
                  variant="body1"
                  onClick={() => navigate('/signup')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
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
                      transition: 'transform 0.3s ease-out',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'bottom left',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}