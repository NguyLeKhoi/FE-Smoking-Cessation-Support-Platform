import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, IconButton, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import quitPlanService from '../../services/quitPlanService';
import { useNavigate, useLocation } from 'react-router-dom';

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

const slogans = [
  'Start your quit journey today and track your progress here!',
  'Your determination today is your freedom tomorrow.',
  'A smoke-free life is a healthier life. You can do it!',
];

const QuitPlanPage = ({ setHasActivePlan }) => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Khai báo plan/phases trước mọi useEffect
  const plan = Array.isArray(quitPlans) && quitPlans.length > 0 ? quitPlans[0] : null;

  const randomSlogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);

  useEffect(() => {
    fetchQuitPlans();
  }, [location.key]);

  useEffect(() => {
    if (setHasActivePlan) setHasActivePlan(!!plan);
  }, [plan, setHasActivePlan]);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const fetchQuitPlans = async () => {
    setFetchingPlans(true);
    try {
      const response = await quitPlanService.getAllQuitPlans();
      setQuitPlans(Array.isArray(response.data?.data?.data) ? response.data.data.data : []);
    } finally {
      setFetchingPlans(false);
    }
  };

  const handleDeletePlan = async (id) => {
    setDeletingId(id);
    try {
      await quitPlanService.deleteQuitPlan(id);
      setQuitPlans((prev) => prev.filter((plan) => plan.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box mb={4} sx={{ bgcolor: '#fff', minHeight: '100vh', p: 0 }}>
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
          <Button variant="contained" color="primary" onClick={() => document.querySelector('[aria-label="create quit plan"]').click()}>
            Create Quit Plan
          </Button>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell align="center"><SmokingRoomsIcon sx={{ mr: 1, color: '#1976d2' }} /> <b>Reason</b></TableCell>
                <TableCell align="center"><FlagIcon sx={{ mr: 1, color: '#ff9800' }} /> <b>Type</b></TableCell>
                <TableCell align="center"><HourglassEmptyIcon sx={{ mr: 1, color: '#43a047' }} /> <b>Status</b></TableCell>
                <TableCell align="center"><EventIcon sx={{ mr: 1, color: '#0288d1' }} /> <b>Duration</b></TableCell>
                <TableCell align="center"><CalendarMonthIcon sx={{ mr: 1, color: '#7e57c2' }} /> <b>Plan info</b></TableCell>
                <TableCell align="center"><SettingsIcon sx={{ mr: 1, color: '#607d8b' }} /> <b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{plan.reason}</TableCell>
                <TableCell align="center">
                  <Typography
                    fontWeight={900}
                    sx={{
                      color:
                        String(plan.plan_type).toLowerCase() === 'standard' ? '#388e3c' :
                        String(plan.plan_type).toLowerCase() === 'slow' ? '#1976d2' :
                        String(plan.plan_type).toLowerCase() === 'aggressive' ? '#ff9800' :
                        '#222',
                      textTransform: 'uppercase',
                    }}
                  >
                    {String(plan.plan_type).toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="inline-flex" alignItems="center" gap={1}>
                    <HourglassEmptyIcon sx={{ fontSize: 18, color: plan.status === 'ACTIVE' ? '#43a047' : plan.status === 'PENDING' ? '#ff9800' : '#e53935' }} />
                    <Typography fontWeight={700} color={plan.status === 'ACTIVE' ? 'success.main' : plan.status === 'PENDING' ? 'warning.main' : 'error.main'}>
                      {plan.status}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {plan.start_date && plan.expected_end_date
                    ? `${new Date(plan.start_date).toLocaleDateString()} - ${new Date(plan.expected_end_date).toLocaleDateString()}`
                    : '-'}
                </TableCell>
                <TableCell align="center">
                  {plan.totalDays && plan.total_phases
                    ? `${plan.totalDays} days, ${plan.total_phases} phases`
                    : '-'}
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined" sx={{ mr: 1 }} onClick={() => navigate(`/quit-plan/${plan.id}`)}>
                    View details
                  </Button>
                  <IconButton color="error" onClick={() => handleDeletePlan(plan.id)} disabled={deletingId === plan.id}>
                    {deletingId === plan.id ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography align="center" color="text.secondary" sx={{ mt: 4, fontSize: '1.1rem' }}>
        {randomSlogan}
      </Typography>
    </Box>
  );
};

export default QuitPlanPage; 