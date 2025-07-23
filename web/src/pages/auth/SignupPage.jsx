import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Grid,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import GlowingDotsGrid from "../../components/animated/GlowingDotsGrid"; // Add this import
import LoadingPage from "../LoadingPage"; // Import LoadingPage
import HomeIcon from "@mui/icons-material/Home"; // Import the home icon
import { toast } from "react-toastify";
import { HttpStatusCode } from "axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
  });
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

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    // if (formData.password !== formData.confirmPassword) {
    //   setError('Passwords do not match');
    //   return false;
    // }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Please enter your phone number');
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
        phone_number: formData.phone_number,
      };

      console.log('Signup data being sent:', userData);

      const response = await signup(userData);
      if (response.statusCode === HttpStatusCode.Created) {
        toast.success("Signup successfully");
        navigate("/login");
      } else {
        setError('Failed to create account');
      }
    } catch (error) {
      console.error('Signup error caught:', error);
      let errorMessage = 'An unexpected error occurred during signup.';

      if (error.response) {
        console.log('Backend error response:', error.response);
        if (error.response.data) {
          console.log('Backend error response data:', error.response.data);

          if (error.response.data.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
            errorMessage = error.response.data.errors.map((err) => `${err.path}: ${err.message}`).join(', ');
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else {
            errorMessage = `Request failed: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = `Request failed with status ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.log('Setting error message:', errorMessage);
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
      {/* GlowingDotsGrid remains the same */}
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

      <Container maxWidth="md" sx={{ zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            maxWidth: 600,
            mx: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto',
            backdropFilter: 'blur(5px)',
            position: 'relative', // Add this for absolute positioning of the home button
          }}
        >
          {/* Home Icon Button - Added to top left */}
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
            Create Account
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            Sign up to get started with your journey to quit smoking
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    sx={textFieldStyle}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    sx={textFieldStyle}
                  />
                </Box>
              </Grid>
            </Grid>

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
              {loading ? 'Creating Account...' : 'Sign up'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => window.location.href = process.env.REACT_APP_BACKEND_GOOGLE_AUTH_URL}
              startIcon={<img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" style={{ width: 20, height: 20 }} />}
              sx={{
                mt: 2,
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
              Sign up with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Already have an account?{' '}
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