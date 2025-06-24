import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, CircularProgress, IconButton, Fade, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const navigate = useNavigate();
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const result = location.state?.result;
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [recordPhase, setRecordPhase] = useState(null);

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

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await quitPlanService.deleteQuitPlan(id);
      navigate('/quit-plan');
    } catch (err) {
      setError('Không thể xóa kế hoạch');
    } finally {
      setDeleting(false);
    }
  };

  const displayData = id
    ? plan
    : result?.data?.data || result?.data || null;
  const planObj = displayData?.data || displayData;
  const phases = planObj?.phases ? getPhaseStatus(planObj.phases) : [];

  const handleOpenRecordModal = (phase) => {
    setRecordPhase(phase);
    setOpenRecordModal(true);
  };
  const handleCloseRecordModal = () => {
    setOpenRecordModal(false);
    setRecordPhase(null);
  };

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
              
                <Button sx={{ mt: 3, width: '100%' }} variant="contained" onClick={() => navigate('/quit-plan')}>Back</Button>
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
                      {phase.status === 'ACTIVE' && (
                        <Box mt={2}>
                          <Button variant="contained" color="primary" onClick={() => handleOpenRecordModal(phase)}>
                            Add daily record
                          </Button>
                        </Box>
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
      <Modal
        open={openRecordModal}
        onClose={handleCloseRecordModal}
        aria-labelledby="daily-record-modal"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 3, minWidth: 340, boxShadow: 6 }}>
          <Typography id="daily-record-modal" variant="h6" fontWeight={700} mb={2}>
            Add daily record for phase {recordPhase?.phase_number}
          </Typography>
          <DailyRecordForm onSuccess={handleCloseRecordModal} />
          <Button onClick={handleCloseRecordModal} sx={{ mt: 2, width: '100%' }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

function DailyRecordForm({ onSuccess }) {
  const [cigaretteSmoke, setCigaretteSmoke] = useState('');
  const [cravingLevel, setCravingLevel] = useState('');
  const [healthStatus, setHealthStatus] = useState('GOOD');
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await quitPlanService.createDailyRecord({
        cigarette_smoke: Number(cigaretteSmoke),
        craving_level: Number(cravingLevel),
        health_status: healthStatus,
        record_date: new Date(recordDate).toISOString(),
      });
      setSuccess('Ghi nhận thành công!');
      setCigaretteSmoke('');
      setCravingLevel('');
      setHealthStatus('GOOD');
      setRecordDate(new Date().toISOString().slice(0, 10));
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Ghi nhận thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <label>
          Cigarettes today
          <input
            type="number"
            min="0"
            value={cigaretteSmoke}
            onChange={e => setCigaretteSmoke(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <label>
          Craving level (1-10)
          <input
            type="number"
            min="1"
            max="10"
            value={cravingLevel}
            onChange={e => setCravingLevel(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <label>
          Health status
          <select
            value={healthStatus}
            onChange={e => setHealthStatus(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="GOOD">Good</option>
            <option value="NORMAL">Normal</option>
            <option value="BAD">Bad</option>
          </select>
        </label>
        <label>
          Record date
          <input
            type="date"
            value={recordDate}
            onChange={e => setRecordDate(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 8,
            padding: '10px 0',
            borderRadius: 6,
            background: '#1976d2',
            color: 'white',
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Adding...' : 'Add record'}
        </button>
        {error && <span style={{ color: 'red' }}>{error}</span>}
        {success && <span style={{ color: 'green' }}>{success}</span>}
      </Box>
    </form>
  );
}

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