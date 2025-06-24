import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Modal, Grid, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import quitPlanService from '../../services/quitPlanService';
import DailyRecordForm from './QuitPlanResultPage';

function PlanRecordPage() {
  const { planId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [planId]);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await quitPlanService.getPlanRecords(planId);
      setRecords(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  // Summary calculations
  const totalRecords = records.length;
  const totalCigarettes = records.reduce((sum, r) => sum + (r.cigarette_smoke || 0), 0);
  const totalMoney = records.reduce((sum, r) => sum + (r.money_saved || 0), 0);
  const successStreak = (() => {
    let streak = 0;
    for (let i = records.length - 1; i >= 0; i--) {
      if (records[i].is_pass) streak++;
      else break;
    }
    return streak;
  })();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 }, position: 'relative' }}>
      <Typography variant="h4" fontWeight={800} color="primary" mb={3}>
        All Records
      </Typography>
      {/* Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon color="primary" />
            <Box>
              <Typography variant="subtitle2">Total Records</Typography>
              <Typography variant="h6">{totalRecords}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon color="success" />
            <Box>
              <Typography variant="subtitle2">Success Streak</Typography>
              <Typography variant="h6">{successStreak}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SmokingRoomsIcon color="warning" />
            <Box>
              <Typography variant="subtitle2">Cigarettes</Typography>
              <Typography variant="h6">{totalCigarettes}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <MonetizationOnIcon color="success" />
            <Box>
              <Typography variant="subtitle2">Money Saved</Typography>
              <Typography variant="h6">${totalMoney}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Record List */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : records.length === 0 ? (
        <Typography align="center">No records found for this plan.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {records.map((rec) => (
            <Paper key={rec.id} sx={{ p: 3, borderRadius: 3, boxShadow: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              {rec.is_pass ? <SentimentSatisfiedAltIcon color="success" fontSize="large" /> : <SentimentDissatisfiedIcon color="error" fontSize="large" />}
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700}>Date: {rec.record_date ? new Date(rec.record_date).toLocaleDateString() : '-'}</Typography>
                <Typography variant="body2">Cigarettes: {rec.cigarette_smoke}</Typography>
                <Typography variant="body2">Craving level: {rec.craving_level}</Typography>
                <Typography variant="body2">Health: {rec.health_status}</Typography>
                <Typography variant="body2">Result: {rec.is_pass ? 'Pass' : 'Fail'}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      {/* Floating Add Button */}
      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="add-record-modal" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 3, minWidth: 340, boxShadow: 6 }}>
          <Typography id="add-record-modal" variant="h6" fontWeight={700} mb={2}>
            Add daily record
          </Typography>
          <DailyRecordForm onSuccess={() => { handleCloseModal(); fetchRecords(); }} planId={planId} />
          <Button onClick={handleCloseModal} sx={{ mt: 2, width: '100%' }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default PlanRecordPage; 