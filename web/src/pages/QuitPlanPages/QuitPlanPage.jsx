import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, IconButton, CircularProgress, Button, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import quitPlanService from '../../services/quitPlanService';
import { useNavigate } from 'react-router-dom';
import QuitPlanMainLayout from '../../layout/QuitPlanMainLayout';

const getPhaseStatus = (phases) => {
  if (!Array.isArray(phases)) return {};
  let foundActive = false;
  return phases.map((phase, idx) => {
    if (phase.status === 'active') {
      foundActive = true;
      return { ...phase, _display: 'active' };
    }
    if (!foundActive && phase.status !== 'completed') {
      foundActive = true;
      return { ...phase, _display: 'next' };
    }
    if (foundActive && phase.status !== 'completed' && phase.status !== 'active') {
      return { ...phase, _display: 'future' };
    }
    return { ...phase, _display: phase.status === 'completed' ? 'completed' : 'other' };
  });
};

const QuitPlanPage = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const fetchQuitPlans = async () => {
    setFetchingPlans(true);
    try {
      const response = await quitPlanService.getAllQuitPlans();
      setQuitPlans(Array.isArray(response.data?.data?.data) ? response.data.data.data : []);
    } catch (err) {
      setError('Failed to fetch quit plans');
    } finally {
      setFetchingPlans(false);
    }
  };

  const handleDeletePlan = async (id) => {
    setDeletingId(id);
    try {
      await quitPlanService.deleteQuitPlan(id);
      setQuitPlans((prev) => prev.filter((plan) => plan.id !== id));
    } catch (err) {
      setError('Failed to delete quit plan');
    } finally {
      setDeletingId(null);
    }
  };

  // Only show the most recent plan (if multiple)
  const plan = Array.isArray(quitPlans) && quitPlans.length > 0 ? quitPlans[0] : null;
  const phases = plan?.phases ? getPhaseStatus(plan.phases) : [];

  return (
    <QuitPlanMainLayout onPlanCreated={fetchQuitPlans}>
      <Box mb={4}>
        <Typography variant="h3" fontWeight={800} align="center" mb={4} color="primary">
          Quit Plan
        </Typography>
        {fetchingPlans ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : !plan ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
            <Typography variant="h5" fontWeight={700} mb={2} align="center">
              You have no quit plan yet.
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3} align="center">
              Start your journey to quit smoking by creating a personalized plan.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => document.querySelector('[aria-label=\"create quit plan\"]').click()}>
              Create Quit Plan
            </Button>
          </Box>
        ) : (
          <>
            {/* Plan Overview */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={1}><FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Plan Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary"><SmokingRoomsIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Reason</Typography>
                  <Typography variant="body1">{plan.reason}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary"><FlagIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Type</Typography>
                  <Typography variant="body1">{plan.plan_type}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary"><HourglassEmptyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Status</Typography>
                  <Typography variant="body1">{plan.status}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Start date</Typography>
                  <Typography variant="body1">{plan.start_date ? new Date(plan.start_date).toLocaleDateString() : '-'}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />End date</Typography>
                  <Typography variant="body1">{plan.expected_end_date ? new Date(plan.expected_end_date).toLocaleDateString() : '-'}</Typography>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate(`/quit-plan/${plan.id}`)}>
                  View details
                </Button>
                <IconButton color="error" onClick={() => handleDeletePlan(plan.id)} disabled={deletingId === plan.id}>
                  {deletingId === plan.id ? <CircularProgress size={24} /> : <DeleteIcon />}
                </IconButton>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </QuitPlanMainLayout>
  );
};

export default QuitPlanPage; 