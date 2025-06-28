import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0', mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'center', minHeight: 64, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#222', letterSpacing: 2 }}>
            Zerotine
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
} 