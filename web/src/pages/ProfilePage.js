import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../components/ProfileSidebar'; // Import the sidebar component

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Include the sidebar */}
      <ProfileSidebar />

      {/* Main content - without Paper wrapper */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        overflow: 'auto',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          syl
        </Typography>
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
          Joined June 2015
        </Typography>

        {/* Statistics Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
            Statistics
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[
              { label: 'Day Streak', value: '0' },
              { label: 'Total XP', value: '18303' },
              { label: 'Current League', value: 'Gold' },
              { label: 'Top 3 finishes', value: '3' },
            ].map((stat, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'section.light',
                  borderRadius: 3,
                  minWidth: 130,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                    bgcolor: 'section.main',
                  }
                }}
              >
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Achievements Section */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
            Achievements
          </Typography>
          {/* Wildfire */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'section.light',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              Wildfire (63/75)
            </Typography>
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                mt: 1,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: `${(63 / 75) * 100}%`,
                  height: '100%',
                  bgcolor: '#fbc02d',
                  borderRadius: 5,
                }}
              />
            </Box>
          </Paper>

          {/* Sage */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'section.light',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              Sage (18303/20000)
            </Typography>
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: 'rgba(0, 0, 0, 0.1)',
                mt: 1,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: `${(18303 / 20000) * 100}%`,
                  height: '100%',
                  bgcolor: '#00e676',
                  borderRadius: 5,
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Logout Button */}
        <Button
          variant="contained"
          onClick={onLogoutClick}
          sx={{
            mt: 5,
            py: 1.5,
            bgcolor: '#000000',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 0 #00000080',
            '&:hover': {
              bgcolor: '#000000cd',
              boxShadow: '0 2px 0 #00000080',
              transform: 'translateY(2px)',
            },
            '&:active': {
              boxShadow: '0 0 0 #00000080',
              transform: 'translateY(4px)',
            },
          }}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
}