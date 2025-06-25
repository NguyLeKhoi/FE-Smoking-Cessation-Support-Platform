import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// Fix the import paths
import membershipService from '../../services/membershipService';
import LoadingPage from '../LoadingPage';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

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
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Adjust based on header height
        backgroundColor: '#f0f2f5',
        padding: 4,
        gap: 4,
      }}
    >
      {plans.map((plan) => (
        <Box
          key={plan.id}
          sx={{
            width: 300,
            minHeight: 500,
            borderRadius: '20px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 8, // Space for the top gradient part
            paddingBottom: 4,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-10px)',
            },
          }}
        >
          {/* Gradient background part */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '120px',
              background: plan.name === 'BASIC PACK' ? 'linear-gradient(to right, #8e2de2, #4a00e0)' :
                plan.name === 'STANDARD' ? 'linear-gradient(to right, #ff4e50, #fcb045)' :
                  'linear-gradient(to right, #00c6ff, #0072ff)',
              borderRadius: '20px 20px 0 0',
              zIndex: 1,
            }}
          />

          {/* Main content */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              width: '100%',
              padding: '0 20px',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              {plan.name}
            </Typography>
            <List sx={{ width: '100%' }}>
              {plan.features.map((feature, featureIndex) => (
                <ListItem key={featureIndex} sx={{ paddingY: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 'auto', marginRight: 1 }}>
                    <CheckCircleOutlineIcon sx={{
                      color: plan.name === 'BASIC PACK' ? '#8e2de2' :
                        plan.name === 'STANDARD' ? '#ff4e50' :
                          '#00c6ff', fontSize: '1.2rem'
                    }} />
                  </ListItemIcon>
                  <ListItemText primary={feature} sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }} />
                </ListItem>
              ))}
            </List>
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: `5px solid ${plan.name === 'BASIC PACK' ? '#8e2de2' :
                    plan.name === 'STANDARD' ? '#ff4e50' :
                      '#00c6ff'
                  }`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#333',
                color: 'white',
                margin: '20px auto 0 auto',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${plan.price}
              </Typography>
              <Typography variant="subtitle2">
                PRICE CREDIT
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default MembershipPlansPage;