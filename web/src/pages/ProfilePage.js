import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../components/ProfileSidebar'; // Import the sidebar component

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Include the sidebar */}
      <ProfileSidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', p: 4 }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              mt: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              borderRadius: 2,
              bgcolor: '#2c3e50',
              color: 'white',
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              Profile Page
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: '#b0b3b8' }}>
              Welcome to your profile.
            </Typography>
            <Button
              variant="contained"
              onClick={onLogoutClick}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#00b0ff',
                '&:hover': {
                  bgcolor: '#0091ea',
                },
                borderRadius: '4px',
                color: 'white',
              }}
            >
              Log Out
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}