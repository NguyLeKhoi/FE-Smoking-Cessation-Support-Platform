import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import quitPlanService from '../../services/quitPlanService';
import EventIcon from '@mui/icons-material/Event';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

function PhaseRecordPage() {
  const { planId, phaseId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slogans = [
    'Every record is a step closer to a healthier you!',
    'Consistency is the key to quitting successfully.',
    'Small steps every day make a big difference.',
  ];
  const randomSlogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);

  useEffect(() => {
    fetchRecords();
    window.scrollTo({ top: 0 });
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
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell align="center"><EventIcon sx={{ mr: 1, color: '#1976d2' }} /> <b>Date</b></TableCell>
                <TableCell align="center"><SmokingRoomsIcon sx={{ mr: 1, color: '#388e3c' }} /> <b>Cigarettes</b></TableCell>
                <TableCell align="center"><FavoriteIcon sx={{ mr: 1, color: '#e53935' }} /> <b>Craving level</b></TableCell>
                <TableCell align="center"><LocalHospitalIcon sx={{ mr: 1, color: '#607d8b' }} /> <b>Health</b></TableCell>
                <TableCell align="center"><b>Result</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell align="center">{rec.record_date ? new Date(rec.record_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="center">{rec.cigarette_smoke}</TableCell>
                  <TableCell align="center">{rec.craving_level}</TableCell>
                  <TableCell align="center">{rec.health_status}</TableCell>
                  <TableCell align="center">
                    {rec.is_pass ? (
                      <CheckCircleIcon sx={{ color: '#43a047', verticalAlign: 'middle', mr: 0.5 }} />
                    ) : (
                      <ErrorIcon sx={{ color: '#e53935', verticalAlign: 'middle', mr: 0.5 }} />
                    )}
                    <span style={{ color: rec.is_pass ? '#43a047' : '#e53935', fontWeight: 700 }}>{rec.is_pass ? 'Pass' : 'Fail'}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Typography align="center" color="text.secondary" sx={{ mt: 4, fontSize: '1.1rem' }}>
        {randomSlogan}
      </Typography>
    </Box>
  );
}

export default PhaseRecordPage; 