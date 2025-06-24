import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, CircularProgress } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import ErrorIcon from '@mui/icons-material/Error';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import quitPlanService from '../../services/quitPlanService';
import Modal from '@mui/material/Modal';
import AddDailyRecordModal from '../../components/quit-plans/AddDailyRecordModal';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LoadingPage from '../LoadingPage';

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
  const [planRecords, setPlanRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [errorRecords, setErrorRecords] = useState('');
  const [addRecordError, setAddRecordError] = useState('');

  const displayData = id
    ? plan
    : result?.data?.data || result?.data || null;
  const planObj = displayData?.data || displayData;
  const phases = planObj?.phases ? getPhaseStatus(planObj.phases) : [];

  useEffect(() => {
    if (id) {
      fetchPlanById(id);
    }
  }, [id]);

  useEffect(() => {
    if (planObj?.id) {
      setLoadingRecords(true);
      quitPlanService.getPlanRecords(planObj.id)
        .then(res => setPlanRecords(Array.isArray(res.data) ? res.data : res.data?.data || []))
        .catch(() => setErrorRecords('Failed to fetch plan records'))
        .finally(() => setLoadingRecords(false));
    }
  }, [planObj?.id]);

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
    setAddRecordError('');
    if (!planObj?.id || !recordPhase?.id) return;
    console.log('Submitting daily record:', { ...data, phase_id: recordPhase.id });
    try {
      const res = await quitPlanService.createPlanRecord({
        ...data,
        phase_id: recordPhase.id,
      });
      console.log('Create record response:', res);
      // Reload records
      setLoadingRecords(true);
      const reloadRes = await quitPlanService.getPlanRecords(planObj.id);
      setPlanRecords(Array.isArray(reloadRes.data) ? reloadRes.data : reloadRes.data?.data || []);
      setOpenRecordModal(false);
      setRecordPhase(null);
    } catch (err) {
      console.error('Error adding record:', err, err?.response);
      setAddRecordError('Failed to add record. Please try again.');
    } finally {
      setLoadingRecords(false);
    }
  };

  // Tính toán dữ liệu cho vòng tròn progress dựa vào phase
  const totalPhases = phases.length;
  const completedPhases = phases.filter(phase => String(phase.status).toLowerCase() === 'completed').length;
  const percent = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
  const latestRecord = planRecords.length > 0 ? planRecords[planRecords.length - 1] : null;

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 } }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={800} mb={2} align="center">Plan Progress</Typography>
        <Box sx={{ width: 260, height: 260, mb: 3, position: 'relative' }}>
          <CircularProgressbar
            value={percent}
            text={''}
            styles={buildStyles({
              textColor: '#222',
              pathColor: '#4caf50',
              trailColor: '#e0e0e0',
              textSize: '24px',
              backgroundColor: '#fff',
            })}
          />
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: '#222' }}>{completedPhases}/{totalPhases}</Typography>
            <Typography variant="subtitle1" color="text.secondary">Phases completed</Typography>
          </Box>
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800 }}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', boxShadow: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Cigarettes</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
                <SmokingRoomsIcon color="primary" />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800 }}>{latestRecord ? latestRecord.cigarette_smoke : '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', boxShadow: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Craving level</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
                <FavoriteIcon color="error" />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800 }}>{latestRecord ? latestRecord.craving_level : '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', boxShadow: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Health</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
                <LocalHospitalIcon color="action" />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800 }}>{latestRecord ? latestRecord.health_status : '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, borderRadius: 3, textAlign: 'center', boxShadow: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Money saved</Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
                <AttachMoneyIcon color="success" />
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800 }}>{latestRecord ? latestRecord.money_saved : '-'}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {error ? (
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
                  alignItems: 'center',
                  textAlign: 'center',
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
                      <Box
                        sx={{
                          bgcolor: '#fff3e0',
                          color: '#d84315',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          mb: 1.5,
                          display: 'inline-flex',
                          alignItems: 'center',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }}
                      >
                        <SmokingRoomsIcon sx={{ mr: 1 }} />
                        Limit per day: {phase.limit_cigarettes_per_day}
                      </Box>
                      <Typography variant="body1"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Start: {phase.start_date ? new Date(phase.start_date).toLocaleDateString() : '-'}</Typography>
                      <Typography variant="body1"><EventIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />End: {phase.expected_end_date ? new Date(phase.expected_end_date).toLocaleDateString() : '-'}</Typography>
                      <Typography variant="body1"><HourglassEmptyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Status: {phase.status}</Typography>
                      <Typography variant="body1"><FlagIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />Duration: {phase.duration} days</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        component={Link}
                        to={`/quit-plan/${planObj.id}/phase/${phase.id}`}
                        disabled={String(phase.status).toUpperCase() === 'PENDING'}
                      >
                        View records
                      </Button>
                      {phase.status === 'ACTIVE' && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 2 }}
                          onClick={() => handleOpenRecordModal(phase)}
                        >
                          Add daily record
                        </Button>
                      )}
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
      <AddDailyRecordModal
        open={openRecordModal}
        onClose={handleCloseRecordModal}
        onSubmit={handleAddDailyRecord}
      />
      {addRecordError && (
        <Box mt={2} textAlign="center">
          <Typography color="error">{addRecordError}</Typography>
        </Box>
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