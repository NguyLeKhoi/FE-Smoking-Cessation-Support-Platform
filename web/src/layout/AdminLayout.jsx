import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: 'none', borderBottom: '1px solid #e0e0e0', mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64, mb: 3, px: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#222', letterSpacing: 2 }}>
            Zerotine Admin
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              bgcolor: '#000',
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              py: 1,
              '&:hover': {
                bgcolor: '#333',
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Box>
  );
}