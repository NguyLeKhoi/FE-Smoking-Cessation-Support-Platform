import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import subscriptionService from '../../services/subscriptionService';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    subscriptionService.getCurrent()
      .then(res => setSubscription(res.data))
      .catch(err => setError('Could not load subscription'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" bgcolor="#fff">
      <Typography variant="h4" fontWeight={800} mb={3}>My Subscription</Typography>
      {subscription && subscription.plan ? (
        <Paper sx={{ p: 4, borderRadius: 3, minWidth: 320, textAlign: 'center', boxShadow: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={1}>{subscription.plan.name}</Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>Status: <b>{subscription.status}</b></Typography>
          <Typography variant="body2" color="text.secondary">Start: {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : '-'}</Typography>
          <Typography variant="body2" color="text.secondary">End: {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : '-'}</Typography>
        </Paper>
      ) : (
        <Box textAlign="center">
          <Typography variant="body1" mb={2}>You don't have any active subscription.</Typography>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/membership-plans')}>Choose a Membership Plan</Button>
        </Box>
      )}
    </Box>
  );
} 