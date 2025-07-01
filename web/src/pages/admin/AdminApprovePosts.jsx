import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box, IconButton } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const mockPosts = [
  { title: 'Bài viết 1', author: 'Nguyễn Văn A', created: '2024-06-01', status: 'Pending' },
  { title: 'Bài viết 2', author: 'Trần Thị B', created: '2024-06-02', status: 'Pending' },
];

const statusColor = (status) => {
  if (status === 'Pending') return 'warning.main';
  if (status === 'Approved') return 'success.main';
  if (status === 'Rejected') return 'error.main';
  return 'text.secondary';
};

export default function AdminApprovePosts() {
  return (
    <>
      <Typography variant="h5" mb={2} p={2} sx={{ fontWeight: 900, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', width: '100%', maxWidth: '100%', mx: 0, color: '#111' }}>Approve Posts</Typography>
      <TableContainer sx={{ width: '100%', maxWidth: '100%', mx: 0, bgcolor: '#fff', borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa', borderRadius: 0 }}>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><TitleIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Title</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><PersonIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Author</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><DateRangeIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Created</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><VerifiedUserIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Status</TableCell>
              <TableCell align="left" sx={{ fontWeight: 900, borderBottom: '2px solid #e0e0e0', py: 2, color: '#111', fontSize: 17 }}><SettingsIcon sx={{ mr: 1, color: '#111', fontSize: 22 }} /> Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPosts.map((row, idx) => (
              <TableRow key={idx} hover sx={{ transition: 'background 0.2s', '&:hover': { bgcolor: '#f7f7f7' } }}>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222', fontWeight: 600 }}>{row.title}</TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.author}</TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>{row.created}</TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2, color: '#222' }}>
                  <Box component="span" fontWeight={700} color={statusColor(row.status)}>
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell align="left" sx={{ borderBottom: '1px solid #e0e0e0', py: 2 }}>
                  <IconButton color="success" size="small" sx={{ mr: 1, borderRadius: '50%', bgcolor: '#f5f5f5', color: '#111', '&:hover': { bgcolor: '#222', color: '#fff' } }}><CheckCircleIcon /></IconButton>
                  <IconButton color="error" size="small" sx={{ borderRadius: '50%', bgcolor: '#f5f5f5', color: '#d32f2f', '&:hover': { bgcolor: '#222', color: '#fff' } }}><CancelIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 