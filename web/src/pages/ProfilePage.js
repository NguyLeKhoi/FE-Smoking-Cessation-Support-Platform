import React from 'react';
import { Button, Typography, Box, Paper, Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from '../components/ProfileSidebar';

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const userData = {
    username: "johnsmith",
    role: "MEMBER",
    email: "john.smith@example.com",
    phone_number: "+1 (555) 123-4567",
    dob: "1990-05-15",
    joined: "June 2023"
  };

  // Statistics data
  const statisticsData = [
    { label: 'Day Streak', value: '0' },
    { label: 'Total XP', value: '18303' },
    { label: 'Current League', value: 'Gold' },
    { label: 'Top 3 finishes', value: '3' },
  ];

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
          User Profile
        </Typography>

        {/* User Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: 'section.light',
            border: '1px solid',
            borderColor: 'divider',
            mb: 4
          }}
        >
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Username
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.username}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Role
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.role}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Joined
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.joined}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.phone_number}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Date of Birth
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {userData.dob}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Statistics Section - Updated to use Grid */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
            Statistics
          </Typography>
          <Grid container spacing={2}>
            {statisticsData.map((stat, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: '100%',
                    bgcolor: 'section.light',
                    borderRadius: 3,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                      bgcolor: 'section.main',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
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