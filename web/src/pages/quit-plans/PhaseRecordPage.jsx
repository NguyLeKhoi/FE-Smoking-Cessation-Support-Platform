import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LoadingPage from '../LoadingPage';
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

  // Tính toán summary
  const totalCigarettes = records.reduce((sum, r) => sum + (r.cigarette_smoke || 0), 0);
  const totalMoneySaved = records.reduce((sum, r) => sum + (r.money_saved || 0), 0);
  const totalRecords = records.length;
  const avgCraving = totalRecords > 0 ? Math.round(records.reduce((sum, r) => sum + (r.craving_level || 0), 0) / totalRecords) : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7ff', p: { xs: 2, md: 6 } }}>
      {/* Summary section: 4 card ngang hàng, không icon, đặt trên đầu trang */}
      <Typography align="center" fontWeight={800} fontSize={28} mb={2} color="#222">Phase Summary</Typography>
      <Box display="flex" justifyContent="center" alignItems="center" gap={3} mb={4}>
        <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, minWidth: 120, textAlign: 'center', boxShadow: 4 }}>
          <Typography fontWeight={700} fontSize={15} color="#222" mb={0.5}>Total Cigarettes</Typography>
          <Typography fontWeight={900} fontSize={22} color="#222">{totalCigarettes}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, minWidth: 120, textAlign: 'center', boxShadow: 4 }}>
          <Typography fontWeight={700} fontSize={15} color="#222" mb={0.5}>Total Money Saved</Typography>
          <Typography fontWeight={900} fontSize={22} color="#43a047">${totalMoneySaved.toFixed(2)}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, minWidth: 120, textAlign: 'center', boxShadow: 4 }}>
          <Typography fontWeight={700} fontSize={15} color="#222" mb={0.5}>Total Records</Typography>
          <Typography fontWeight={900} fontSize={22} color="#222">{totalRecords}</Typography>
        </Paper>
        <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3, minWidth: 120, textAlign: 'center', boxShadow: 4 }}>
          <Typography fontWeight={700} fontSize={15} color="#222" mb={0.5}>Avg Craving</Typography>
          <Typography fontWeight={900} fontSize={22} color="#1976d2">{avgCraving}</Typography>
        </Paper>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={800} color="primary">
          Phase Records
        </Typography>
      </Box>
      {loading ? (
        <LoadingPage />
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
                <TableCell align="center"><b>$ Money Saved</b></TableCell>
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
                  <TableCell align="center">
                    <span style={{ color: rec.money_saved > 0 ? '#43a047' : '#888', fontWeight: 700 }}>
                      ${rec.money_saved ? rec.money_saved.toFixed(2) : '0.00'}
                    </span>
                  </TableCell>
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