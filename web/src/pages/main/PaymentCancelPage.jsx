import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';

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
    color: '#ff5252', // Error/alert color
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
};

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const orderCode = params.get('orderCode');
    const code = params.get('code');
    const id = params.get('id');
    const cancel = params.get('cancel');

    // You can add any cancellation logging here if needed
    console.log('Payment cancelled:', { status, orderCode, code, id, cancel });
  }, [location]);

  return (
    <Container component="main" maxWidth="md" sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <CancelIcon sx={styles.icon} />
        <Typography variant="h4" component="h1" sx={styles.title}>
          Payment Cancelled
        </Typography>
        <Typography variant="body1" sx={styles.subtitle}>
          Your payment has been cancelled. No charges were made to your account.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          If this was a mistake, you can try the payment process again.
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
