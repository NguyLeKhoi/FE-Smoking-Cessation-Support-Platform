import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, Grid, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerCoach } from '../../services/authService';
import GlowingDotsGrid from '../../components/animated/GlowingDotsGrid';
import LoadingPage from '../LoadingPage';
import HomeIcon from '@mui/icons-material/Home';

export default function RegisterCoachPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    code: '',
    phone_number: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    // Parse email, code from URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const codeParam = params.get('code');
    setFormData(prev => ({
      ...prev,
      email: emailParam || prev.email,
      code: codeParam || prev.code,
    }));
    return () => { document.body.style.overflow = originalStyle; };
  }, [location.search]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.code.trim()) {
      setError('Verification code is required');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { ...formData };
      await registerCoach(payload);
      setSuccess('Coach registered successfully!');
      setFormData({ email: '', username: '', password: '', code: '', phone_number: '' });
    } catch (err) {
      setError(typeof err === 'string' ? err : (err?.message || 'Failed to register coach'));
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: 'background.paper',
      '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
      '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': { color: 'text.secondary' },
    '& .MuiOutlinedInput-input': { color: 'text.primary' },
  };

  if (loading) return <LoadingPage />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f6f5f3',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GlowingDotsGrid dotSize={12} dotGap={38} threshold={150} speedThreshold={100} shockRadius={250} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
      <Container maxWidth="sm" sx={{ zIndex: 2 }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: '0px 4px 24px rgba(0,0,0,0.07)',
            maxWidth: 420,
            mx: 'auto',
            mt: 6,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="h4" fontWeight={900} mb={1.5} align="center">
            Register Coach
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={3} align="center">
            Please fill in all information and enter the verification code sent to your email.
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" direction="column">
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required type="email" variant="outlined" sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth required variant="outlined" sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField label="Password" name="password" value={formData.password} onChange={handleChange} fullWidth required type="password" variant="outlined" sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth required variant="outlined" sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField label="Verification Code" name="code" value={formData.code} onChange={handleChange} fullWidth required variant="outlined" sx={textFieldStyle} />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ maxWidth: 220, fontWeight: 700, py: 1.3, bgcolor: '#000000', color: 'white', borderRadius: '12px', boxShadow: '0 4px 0 #00000020', '&:hover': { bgcolor: '#000000cd', boxShadow: '0 2px 0 #00000040', transform: 'translateY(2px)' }, '&:active': { boxShadow: '0 0 0 #00000040', transform: 'translateY(4px)' } }}>
                {loading ? 'Registering...' : 'Register Coach'}
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </Box>
  );
} 