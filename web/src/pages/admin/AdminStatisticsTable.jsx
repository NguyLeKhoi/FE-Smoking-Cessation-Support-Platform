import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import NumbersIcon from '@mui/icons-material/Numbers';
import NotesIcon from '@mui/icons-material/Notes';

const mockStats = [
  { metric: 'Total Users', value: 150, note: 'Tính đến tháng 6/2024' },
  { metric: 'Total Posts', value: 45, note: 'Tính đến tháng 6/2024' },
  { metric: 'Active Users', value: 89, note: 'Trong 30 ngày qua' },
];

export default function AdminStatisticsTable() {
  return (
    <>
      <Typography variant="h5" mb={2} p={2} sx={{ fontWeight: 900, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, color: '#111' }}>Statistics Table</Typography>
      <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><BarChartIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Metric</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><NumbersIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Value</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><NotesIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockStats.map((row, idx) => (
              <TableRow key={idx} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.metric}</TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.value}</TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 