import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, CircularProgress } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import quitPlanService from '../../services/quitPlanService';

const getPhaseStatus = (phases) => {
  if (!Array.isArray(phases)) return [];
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

const QuitPlanResultPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const result = location.state?.result;

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
    }
  }, [id]);

  const fetchPlanById = async (planId) => {
    setLoading(true);
    setError('');
    try {
      const response = await quitPlanService.getQuitPlanById(planId);
      setPlan(response.data.data);
    } catch (err) {
      setError('Không thể tải kế hoạch cai thuốc');
    } finally {
      setLoading(false);
    }
  };
;

  const displayData = id
    ? plan
    : result?.data?.data || result?.data || null;
  const planObj = displayData?.data || displayData;
  const phases = planObj?.phases ? getPhaseStatus(planObj.phases) : [];


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 } }}>
      <Typography variant="h3" fontWeight={800} align="center" mb={4} color="primary">
        Quit Plan
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : planObj ? (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 4 },
                alignItems: 'stretch',
                width: '100%',
              }}
            >
              {/* Plan Summary */}
              <Paper
                sx={{
                  flex: '0 0 100%',
                  maxWidth: { md: 340 },
                  minWidth: 0,
                  p: 4,
                  borderRadius: 4,
                  boxShadow: 6,
                  mb: { xs: 4, md: 0 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  mr: { md: 2 },
                }}
              >
                <Typography variant="h5" fontWeight={700} mb={2} align="center"><FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Plan Overview</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary"><SmokingRoomsIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Reason</Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>{planObj.reason}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary"><FlagIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Type</Typography>
                    <Typography variant="body1">{planObj.plan_type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary"><HourglassEmptyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Status</Typography>
                    <Typography variant="body1">{planObj.status}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Start date</Typography>
                    <Typography variant="body1">{planObj.start_date ? new Date(planObj.start_date).toLocaleDateString() : '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />End date</Typography>
                    <Typography variant="body1">{planObj.expected_end_date ? new Date(planObj.expected_end_date).toLocaleDateString() : '-'}</Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  component={Link}
                  to={`/quit-plan/${planObj.id}/phase/all`}
                >
                  View all records
                </Button>
              </Paper>
              {/* Phases Section */}
              <Paper
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 4,
                  borderRadius: 4,
                  boxShadow: 6,
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  ml: { md: 2 },
                }}
              >
                <Typography variant="h5" fontWeight={700} mb={2} align="center"><FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />Phases</Typography>
                <PhaseScrollBox>
                  {phases.map((phase, idx) => (
                    <Paper
                      key={phase.id || idx}
                      sx={{
                        minWidth: 320,
                        maxWidth: 380,
                        p: 3,
                        borderRadius: 4,
                        bgcolor: '#fff',
                        boxShadow: phase.status === 'ACTIVE' ? 8 : 2,
                        opacity: phase.status === 'PENDING' ? 0.2 : 1,
                        border: 'none',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        fontSize: '1.1rem',
                        transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.03)',
                          boxShadow: 12,
                          zIndex: 2,
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        {phase.status === 'COMPLETED' && <CheckCircleIcon color="success" sx={{ mr: 1 }} />}
                        {phase.status === 'ACTIVE' && <FlagIcon color="primary" sx={{ mr: 1 }} />}
                        {phase.status === 'PENDING' && <HourglassEmptyIcon color="warning" sx={{ mr: 1 }} />}
                        {phase.status === 'LOCKED' && <BlockIcon color="disabled" sx={{ mr: 1 }} />}
                        <Typography variant="h6" fontWeight={700}>Phase {phase.phase_number}</Typography>
                      </Box>
                      <Typography variant="body1"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Start: {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : '-'}</Typography>
                      <Typography variant="body1"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />End: {phase.expected_end_date ? new Date(phase.expected_end_date).toLocaleDateString() : '-'}</Typography>
                      <Typography variant="body1"><HourglassEmptyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Status: {phase.status}</Typography>
                      <Typography variant="body1"><SmokingRoomsIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Limit per day: {phase.limit_cigarettes_per_day}</Typography>
                      <Typography variant="body1"><FlagIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Duration: {phase.duration} days</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        component={Link}
                        to={`/quit-plan/${planObj.id}/phase/${phase.id}`}
                      >
                        View records
                      </Button>
                    </Paper>
                  ))}
                </PhaseScrollBox>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography color="error" align="center">Không tìm thấy dữ liệu. Vui lòng tạo kế hoạch cai thuốc trước.</Typography>
      )}
    </Box>
  );
};

function PhaseScrollBox({ children }) {
  const scrollRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e) => {
    isDownRef.current = true;
    scrollRef.current.classList.add('active');
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    scrollRef.current.classList.remove('active');
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: 'flex',
        gap: 3,
        overflowX: 'auto',
        py: 2,
        px: 2,
        cursor: 'grab',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </Box>
  );
}

export default QuitPlanResultPage; 