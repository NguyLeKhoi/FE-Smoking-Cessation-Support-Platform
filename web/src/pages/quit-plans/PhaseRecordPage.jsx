import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import quitPlanService from '../../services/quitPlanService';
import DailyRecordForm from './QuitPlanResultPage';

function PhaseRecordPage() {
  const { planId, phaseId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [planId, phaseId]);

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await quitPlanService.getPhaseRecords(planId, phaseId);
      setRecords(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={800} color="primary">
          Phase Records
        </Typography>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">{error}</Typography>
      ) : records.length === 0 ? (
        <Typography align="center">No records found for this phase.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {records.map((rec) => (
            <Paper key={rec.id} sx={{ p: 3, borderRadius: 3, boxShadow: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
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
    </Box>
  );
}

export default PhaseRecordPage; 