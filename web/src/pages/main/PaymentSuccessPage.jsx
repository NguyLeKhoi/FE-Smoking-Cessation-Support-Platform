import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import subscriptionService from '../../services/subscriptionService';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)', // Account for header
    textAlign: 'center',
    padding: 3,
    backgroundColor: '#F9F7F4', // From theme.background.default
  },
  paper: {
    padding: { xs: 3, sm: 4, md: 6 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  icon: {
    fontSize: 80,
    color: '#4caf50', // Success green
    mb: 3,
  },
  title: {
    fontWeight: 700,
    color: '#3f332b', // From theme.text.primary
    mb: 2,
  },
  subtitle: {
    color: '#5f5349', // From theme.text.secondary
    mb: 3,
    maxWidth: '80%',
    mx: 'auto',
  },
  button: {
    mt: 3,
    px: 4,
    py: 1.5,
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 500,
    backgroundColor: '#000000', // From theme.primary.main
    '&:hover': {
      backgroundColor: '#333333',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  loadingText: {
    color: '#5f5349', // From theme.text.secondary
    mt: 3,
  },
  errorText: {
    color: '#d32f2f', // Error red
    mb: 3,
  },
};

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderCode = params.get('orderCode');
    const code = params.get('code');
    const id = params.get('id');
    const cancel = params.get('cancel');

    const handleCallback = async () => {
      try {
        await subscriptionService.paymentCallback({ status, orderCode, code, id, cancel });
        setProcessing(false);
      } catch (err) {
        console.error('Payment callback error:', err);
        setError('Failed to process payment. Please check your subscription status.');
        setProcessing(false);
      }
    };
    
    handleCallback();
  }, [location]);

  if (processing) {
    return (
      <Container component="main" maxWidth="md" sx={styles.container}>
        <Paper elevation={0} sx={styles.paper}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#000000' }} />
          <Typography variant="h6" sx={styles.loadingText}>
            Processing your payment...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="md" sx={styles.container}>
        <Paper elevation={0} sx={styles.paper}>
          <CancelIcon sx={{ ...styles.icon, color: '#d32f2f' }} />
          <Typography variant="h4" component="h1" sx={styles.title}>
            Payment Error
          </Typography>
          <Typography variant="body1" sx={{ ...styles.subtitle, ...styles.errorText }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={styles.button}
            startIcon={<HomeIcon />}
          >
            Return to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <CheckCircleOutlineIcon sx={styles.icon} />
        <Typography variant="h4" component="h1" sx={styles.title}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" sx={styles.subtitle}>
          Thank you for your purchase. Your payment has been processed successfully.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          A confirmation email has been sent to your registered email address.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={styles.button}
        >
          Return to Homepage
        </Button>
      </Paper>
    </Container>
  );
}