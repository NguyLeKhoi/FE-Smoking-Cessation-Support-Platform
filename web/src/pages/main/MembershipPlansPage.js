import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// Fix the import paths
import membershipService from '../../services/membershipService';
import LoadingPage from '../LoadingPage';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import subscriptionService from '../../services/subscriptionService';

const MembershipPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      // Check authentication first
      if (!isAuthenticated()) {
        navigate('/login', { state: { from: '/membership-plans' } });
        return;
      }

      try {
        const response = await membershipService.getMembershipPlans();
        setPlans(response.data);
        setLoading(false);
      } catch (err) {
        // Handle unauthorized error silently
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: '/membership-plans' } });
          return;
        }
        setError(err);
        setLoading(false);
      }
    };

    fetchPlans();
  }, [navigate]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleChoosePlan = async (planId) => {
    try {
      const res = await subscriptionService.createPayment({ plan_id: planId });
      if (res.data && res.data.checkoutUrl) {
        window.open(res.data.checkoutUrl, '_blank');
      }
    } catch (err) {
      alert('Could not create payment link. Please try again.');
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}><Typography color="error">Error: {error.message}</Typography></Box>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#fff',
        padding: 4,
        gap: 4,
      }}
    >
      {plans.map((plan) => (
        <Box
          key={plan.id}
          sx={{
            width: 400,
            minHeight: 480,
            borderRadius: 4,
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.06)',
            backgroundColor: 'background.paper',
            border: '2px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-6px) scale(1.03)',
              boxShadow: 12,
            },
          }}
        >
          <Typography variant="h5" fontWeight={800} mb={2} color="text.primary">
            {plan.name}
          </Typography>
          <List sx={{ width: '100%', mb: 2 }}>
            {plan.features.map((feature, featureIndex) => (
              <ListItem key={featureIndex} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={feature} sx={{ '& .MuiListItemText-primary': { fontSize: '1rem', color: 'text.secondary' } }} />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" fontWeight={900} color="primary.main" mb={0.5}>
              ${plan.price}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              per month
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: 3,
              fontWeight: 700,
              width: '100%',
              mt: 1,
              py: 1.2,
              fontSize: '1.1rem',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            }}
            onClick={() => handleChoosePlan(plan.id)}
          >
            Choose Plan
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default MembershipPlansPage;