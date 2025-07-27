import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import membershipService from '../../services/membershipService';
import LoadingPage from '../LoadingPage';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import subscriptionService from '../../services/subscriptionService';

const MembershipPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleOpenConfirm = (plan) => (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setSelectedPlan(plan);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedPlan(null);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    try {
      const res = await subscriptionService.createPayment({ plan_id: selectedPlan.id });
      const url = res?.data?.data?.data?.checkoutUrl;
      if (!url) {
        throw new Error('No checkout URL received');
      }
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError(err.message || 'Có lỗi xảy ra khi tạo đăng ký');
    } finally {
      setIsProcessing(false);
      handleCloseConfirm();
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Đã xảy ra lỗi: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Membership Plans
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        {plans.map((plan) => (
          <Box
            key={plan.id}
            sx={{
              width: 300,
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s',
                boxShadow: 6,
              },
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {plan.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
              <Typography variant="h4" component="span" sx={{ fontWeight: 'bold' }}>
                ${plan.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                /{plan.billing_cycle || 'month'}
              </Typography>
            </Box>
            <List disablePadding sx={{ flexGrow: 1, mb: 2 }}>
              {plan.features?.map((feature, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenConfirm(plan)}
              sx={{ mt: 2 }}
            >
              Choose Plan
            </Button>
          </Box>
        ))}
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog 
        open={openConfirm} 
        onClose={handleCloseConfirm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to subscribe to <strong>{selectedPlan?.name}</strong> for <strong>${selectedPlan?.price}/{selectedPlan?.billing_cycle || 'month'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseConfirm}
            disabled={isProcessing}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            color="primary"
            disabled={isProcessing}
            autoFocus
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipPlansPage;