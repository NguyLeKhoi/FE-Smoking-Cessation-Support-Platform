import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          backgroundColor: '#EAEBD0'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#AF3E3E' }}>
          Profile Page
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome to your profile.
        </Typography>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            mt: 3,
            py: 1.5,
            backgroundColor: '#AF3E3E',
            '&:hover': {
              backgroundColor: '#CD5656',
            },
          }}
        >
          Log Out
        </Button>
      </Box>
    </Container>
  );
} 