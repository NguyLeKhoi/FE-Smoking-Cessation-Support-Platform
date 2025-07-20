import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, IconButton, Tabs, Tab } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorIcon from '@mui/icons-material/Error';
import LinearProgress from '@mui/material/LinearProgress';

import quitPlanService from '../../services/quitPlanService';
import AddDailyRecordModal from '../../components/quit-plans/AddDailyRecordModal';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LoadingPage from '../LoadingPage';
import toast from 'react-hot-toast';

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
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [recordPhase, setRecordPhase] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState([]);
  const [tabValues, setTabValues] = useState([]);

  const displayData = id
    ? plan
    : result?.data?.data || result?.data || null;
  const planObj = displayData?.data || displayData;
  const phases = planObj?.phases ? getPhaseStatus(planObj.phases) : [];

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  useEffect(() => {
    setTabValues(phases.map(() => 0));
  }, [phases.length]);

  const handleTabChange = (idx, newValue) => {
    setTabValues(prev => {
      const copy = [...prev];
      copy[idx] = newValue;
      return copy;
    });
  };

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

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

  const handleOpenRecordModal = (phase) => {
    setRecordPhase(phase);
    setOpenRecordModal(true);
  };

  const handleCloseRecordModal = () => {
    setOpenRecordModal(false);
    setRecordPhase(null);
  };

  const handleAddDailyRecord = async (data) => {
    if (!planObj?.id || !recordPhase?.id) return;
    console.log('Submitting daily record:', { ...data, phase_id: recordPhase.id });
    try {
      const res = await quitPlanService.createPlanRecord({
        ...data,
        phase_id: recordPhase.id,
      });
      console.log('Create record response:', res);
      setOpenRecordModal(false);
      setRecordPhase(null);
      toast.success('Add daily record successfully!', {
        position: 'top-center',
        style: { marginTop: '70px' }
      });
    } catch (err) {
      console.error('Error adding record:', err, err?.response);
    }
  };

  // Use new progress and statistics fields from API
  const planProgress = planObj?.progress || {};
  const planStatistics = planObj?.statistics || {};
  // Use new progress percentage and completed/total phases
  const totalPhases = planProgress.totalPhases ?? phases.length;
  const completedPhases = planProgress.completedPhases ?? phases.filter(phase => String(phase.status).toLowerCase() === 'completed').length;
  const percent = planProgress.progressPercentage ?? (totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0);

  const handleTogglePhase = (index) => {
    const newExpandedPhases = [...expandedPhases];
    newExpandedPhases[index] = !newExpandedPhases[index];
    setExpandedPhases(newExpandedPhases);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 } }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={900} mb={2} align="center" sx={{ letterSpacing: 1 }}>
          Plan Progress
        </Typography>
        <Box sx={{ width: 300, height: 300, mb: 3, position: 'relative' }}>
          <CircularProgressbar
            value={percent}
            text={''}
            styles={buildStyles({
              textColor: '#222',
              pathColor: '#4caf50',
              trailColor: '#e0e0e0',
              textSize: '28px',
              backgroundColor: '#fff',
            })}
          />
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <Typography sx={{ fontSize: '3.5rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>{completedPhases}/{totalPhases}</Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 0.5 }}>Phases completed</Typography>
          </Box>
        </Box>
        {/* Plan-level statistics */}
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', boxShadow: 4, bgcolor: '#fff' }}>
              <Typography variant="subtitle1" color="text.primary" fontWeight={800} sx={{ letterSpacing: 0.5 }}>Money Saved</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mt={2}>
                <AttachMoneyIcon sx={{ color: '#222', fontSize: 36 }} />
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#388e3c' }}>
                  {typeof planStatistics.totalMoneySaved === 'number'
                    ? planStatistics.totalMoneySaved.toFixed(2)
                    : planStatistics.totalMoneySaved ?? '-'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', boxShadow: 4, bgcolor: '#fff' }}>
              <Typography variant="subtitle1" color="text.primary" fontWeight={800} sx={{ letterSpacing: 0.5 }}>Days Recorded</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mt={2}>
                <EventIcon sx={{ color: '#222', fontSize: 36 }} />
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#222' }}>{planStatistics.totalDaysRecorded ?? '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 4, textAlign: 'center', boxShadow: 4, bgcolor: '#fff' }}>
              <Typography variant="subtitle1" color="text.primary" fontWeight={800} sx={{ letterSpacing: 0.5 }}>Avg. Cigarettes/Day</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mt={2}>
                <SmokingRoomsIcon sx={{ color: '#222', fontSize: 36 }} />
                <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, color: '#222' }}>{planStatistics.averageCigarettesPerDay ?? '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : planObj ? (
        <Grid container spacing={0} alignItems="flex-start">
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 4 },
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              {/* Plan Summary */}
              <Paper
                sx={{
                  flex: '0 0 100%',
                  maxWidth: { md: 380 },
                  minWidth: 0,
                  p: 4,
                  borderRadius: 4,
                  boxShadow: 8,
                  mb: { xs: 4, md: 0 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  bgcolor: '#f5f7fa',
                }}
              >
                <Typography variant="h4" fontWeight={900} mb={2} align="center" color="primary" sx={{ letterSpacing: 1 }}><FlagIcon sx={{ mr: 1, fontSize: 32, verticalAlign: 'middle' }} />Plan Overview</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5 }}><SmokingRoomsIcon sx={{ mr: 1, fontSize: 22, verticalAlign: 'middle' }} />Reason</Typography>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all', fontWeight: 900 }}>{planObj.reason}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5 }}><FlagIcon sx={{ mr: 1, fontSize: 22, verticalAlign: 'middle' }} />Type</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        color:
                          String(planObj.plan_type).toLowerCase() === 'standard' ? '#388e3c' :
                          String(planObj.plan_type).toLowerCase() === 'slow' ? '#1976d2' :
                          String(planObj.plan_type).toLowerCase() === 'aggressive' ? '#ff9800' :
                          '#222',
                        textTransform: 'uppercase',
                      }}
                    >
                      {String(planObj.plan_type).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5 }}><HourglassEmptyIcon sx={{ mr: 1, fontSize: 22, verticalAlign: 'middle' }} />Status</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        color:
                          String(planObj.status).toLowerCase() === 'active' ? '#43a047' :
                          String(planObj.status).toLowerCase() === 'completed' ? '#43a047' :
                          String(planObj.status).toLowerCase() === 'failed' ? '#e53935' :
                          String(planObj.status).toLowerCase() === 'in-progress' ? '#1976d2' :
                          String(planObj.status).toLowerCase() === 'pending' ? '#888' :
                          '#222',
                        textTransform: 'uppercase',
                      }}
                    >
                      {String(planObj.status).replace(/-/g, ' ').toUpperCase()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5 }}><EventIcon sx={{ mr: 1, fontSize: 22, verticalAlign: 'middle' }} />Start date</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>{planObj.start_date ? new Date(planObj.start_date).toLocaleDateString() : '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={800} sx={{ letterSpacing: 0.5 }}><EventIcon sx={{ mr: 1, fontSize: 22, verticalAlign: 'middle' }} />End date</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>{planObj.expected_end_date ? new Date(planObj.expected_end_date).toLocaleDateString() : '-'}</Typography>
                  </Box>
                </Box>
              </Paper>
              {/* Phases Section */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 4,
                  borderRadius: 4,
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  ml: { md: 2 },
                  background: 'none',
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
                <Typography variant="h4" fontWeight={900} mb={2} align="center" color="primary" sx={{ letterSpacing: 1 }}><FlagIcon sx={{ mr: 1, fontSize: 32, verticalAlign: 'middle' }} />Phases</Typography>
                <PhaseScrollBox>
                  {phases.map((phase, idx) => {
                    return (
                      <Paper
                        key={phase.id || idx}
                        sx={{
                          minWidth: 600,
                          maxWidth: 900,
                          p: 4,
                          borderRadius: 4,
                          bgcolor: '#fff',
                          boxShadow: phase.status === 'ACTIVE' ? 12 : 4,
                          opacity: phase.status === 'PENDING' ? 0.2 : 1,
                          border: '2px solid',
                          borderColor: phase.status === 'ACTIVE' ? 'primary.main' : '#e0e0e0',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          fontSize: '1.2rem',
                          transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.03)',
                            boxShadow: 16,
                            zIndex: 2,
                          },
                        }}
                      >
                        <Typography variant="h5" fontWeight={900} mb={1.5} color="primary">Phase {phase.phase_number}</Typography>
                        {/* Limit per day: show as a single row, centered */}
                        <Box
                          sx={{
                            bgcolor: '#ffe0b2',
                            color: '#d84315',
                            borderRadius: 2,
                            px: 2,
                            py: 2,
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 900,
                            fontSize: '1.3rem',
                            justifyContent: 'center',
                            boxShadow: 2,
                            width: '100%',
                            border: '2px solid #ff9800',
                          }}
                        >
                          <SmokingRoomsIcon sx={{ mr: 1, fontSize: 32 }} />
                          <span style={{fontWeight: 900}}>Limit per day: <span style={{color:'#d84315', fontWeight:900, fontSize:'1.4rem'}}>{phase.limit_cigarettes_per_day}</span></span>
                        </Box>
                        {/* Tabs cho số liệu */}
                        <Tabs value={tabValues[idx] || 0} onChange={(_, v) => handleTabChange(idx, v)} centered sx={{ mb: 2, '& .MuiTab-root': { fontSize: '1.1rem', fontWeight: 800 } }}>
                          <Tab label="Overview" disabled={String(phase.status).toUpperCase() === 'PENDING'} />
                          <Tab label="Statistics" disabled={String(phase.status).toUpperCase() === 'PENDING'} />
                        </Tabs>
                        {tabValues[idx] === 0 && (
                          <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={5} mt={2} mb={1} textAlign="center">
                            <Box flex={1} display="flex" flexDirection="column" gap={2} alignItems="center">
                              <Box display="flex" alignItems="center" gap={1.5} justifyContent="center">
                                <EventIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
                                <Typography variant="body1" fontWeight={900}>Start:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, ml: 1 }}>{phase.start_date ? new Date(phase.start_date).toLocaleDateString() : '-'}</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1.5} justifyContent="center">
                                <HourglassEmptyIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
                                <Typography variant="body1" fontWeight={900}>Status:</Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 900,
                                    ml: 1,
                                    textTransform: 'uppercase',
                                    color:
                                      String(phase.status).toLowerCase() === 'completed' ? '#43a047' :
                                      String(phase.status).toLowerCase() === 'failed' ? '#e53935' :
                                      String(phase.status).toLowerCase() === 'in-progress' ? '#1976d2' :
                                      String(phase.status).toLowerCase() === 'pending' ? '#888' :
                                      '#222',
                                  }}
                                >
                                  {String(phase.status).replace(/-/g, ' ').toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box flex={1} display="flex" flexDirection="column" gap={2} alignItems="center">
                              <Box display="flex" alignItems="center" gap={1.5} justifyContent="center">
                                <EventIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
                                <Typography variant="body1" fontWeight={900}>End:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, ml: 1 }}>{phase.expected_end_date ? new Date(phase.expected_end_date).toLocaleDateString() : '-'}</Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={1.5} justifyContent="center">
                                <FlagIcon sx={{ fontSize: 22, verticalAlign: 'middle' }} />
                                <Typography variant="body1" fontWeight={900}>Duration:</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700, ml: 1 }}>{phase.duration} days</Typography>
                              </Box>
                            </Box>
                          </Box>
                        )}
                        {tabValues[idx] === 1 && phase.statistics && (
                          <Box mt={2} textAlign="center" sx={{ maxHeight: 72, overflowY: 'auto' }}>
                            {(() => {
                              const total = phase.duration || 1;
                              const recorded = phase.statistics.recordedDays || 0;
                              const passed = phase.statistics.passedDays || 0;
                              const missed = phase.statistics.missedDays || 0;
                              const failed = phase.statistics.failedDays || 0;
                              return (
                                <Box display="flex" flexDirection="column" gap={1}>
                                  <Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.1}>
                                      <Box display="flex" alignItems="center" gap={0.3}>
                                        <CheckCircleIcon sx={{ color: '#43a047', fontSize: 15 }} />
                                        <Typography fontWeight={900} fontSize={12}>Recorded</Typography>
                                      </Box>
                                      <Typography fontWeight={700} color="#43a047" fontSize={11}>{recorded} days ({Math.round((recorded/total)*100)}%)</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.round((recorded/total)*100)} sx={{ height: 8, borderRadius: 4, background: '#e0f2f1', '& .MuiLinearProgress-bar': { backgroundColor: '#43a047' } }} />
                                  </Box>
                                  <Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.1}>
                                      <Box display="flex" alignItems="center" gap={0.3}>
                                        <FavoriteIcon sx={{ color: '#1976d2', fontSize: 15 }} />
                                        <Typography fontWeight={900} fontSize={12}>Passed</Typography>
                                      </Box>
                                      <Typography fontWeight={700} color="#1976d2" fontSize={11}>{passed} days ({Math.round((passed/total)*100)}%)</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.round((passed/total)*100)} sx={{ height: 8, borderRadius: 4, background: '#e3f2fd', '& .MuiLinearProgress-bar': { backgroundColor: '#1976d2' } }} />
                                  </Box>
                                  <Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.1}>
                                      <Box display="flex" alignItems="center" gap={0.3}>
                                        <BlockIcon sx={{ color: '#e53935', fontSize: 15 }} />
                                        <Typography fontWeight={900} fontSize={12}>Missed</Typography>
                                      </Box>
                                      <Typography fontWeight={700} color="#e53935" fontSize={11}>{missed} days ({Math.round((missed/total)*100)}%)</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.round((missed/total)*100)} sx={{ height: 8, borderRadius: 4, background: '#ffebee', '& .MuiLinearProgress-bar': { backgroundColor: '#e53935' } }} />
                                  </Box>
                                  <Box>
                                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.1}>
                                      <Box display="flex" alignItems="center" gap={0.3}>
                                        <ErrorIcon sx={{ color: '#ff9800', fontSize: 15 }} />
                                        <Typography fontWeight={900} fontSize={12}>Failed</Typography>
                                      </Box>
                                      <Typography fontWeight={700} color="#ff9800" fontSize={11}>{failed} days ({Math.round((failed/total)*100)}%)</Typography>
                                    </Box>
                                    <LinearProgress variant="determinate" value={Math.round((failed/total)*100)} sx={{ height: 8, borderRadius: 4, background: '#fff3e0', '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }} />
                                  </Box>
                                </Box>
                              );
                            })()}
                          </Box>
                        )}
                        {/* Buttons: View records & Add daily record side by side */}
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={3} mt={3}>
                          <Button
                            variant="outlined"
                            size="large"
                            sx={{ flex: 1, minWidth: 180, fontWeight: 800, fontSize: 18, py: 1.2, borderWidth: 2 }}
                            component={Link}
                            to={`/quit-plan/${planObj.id}/phase/${phase.id}`}
                            disabled={String(phase.status).toUpperCase() === 'PENDING'}
                          >
                            View records
                          </Button>
                          {/* Add daily record button for ACTIVE phase */}
                          {String(phase.status).toUpperCase() === 'ACTIVE' || String(phase.status).toUpperCase() === 'IN-PROGRESS' ? (
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ flex: 1, minWidth: 180, fontWeight: 800, fontSize: 18, py: 1.2, boxShadow: 3 }}
                              onClick={() => handleOpenRecordModal(phase)}
                            >
                              Add daily record
                            </Button>
                          ) : null}
                        </Box>
                      </Paper>
                    );
                  })}
                </PhaseScrollBox>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography color="error" align="center">Không tìm thấy dữ liệu. Vui lòng tạo kế hoạch cai thuốc trước.</Typography>
      )}
      <AddDailyRecordModal
        open={openRecordModal}
        onClose={handleCloseRecordModal}
        onSubmit={handleAddDailyRecord}
        limitCigarettesPerDay={recordPhase?.limit_cigarettes_per_day}
      />
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