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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Achievements
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                fontWeight: 'medium',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              VIEW ALL
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 0,
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            {/* Smoke-Free Streak Achievement */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '40px',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    🚭
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: '#ff6b6b',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      px: 1,
                      py: 0,
                      borderRadius: 1,
                      border: '2px solid white',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      textAlign: 'center'
                    }}
                  >
                    LEVEL 6
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Smoke-Free Streak
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      63/75 days
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Maintain a 75-day smoke-free streak
                  </Typography>

                  {/* Progress Bar */}
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'section.main',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(63 / 75) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff6b6b, #ff8e53)',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Health Recovery Achievement */}
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '40px',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    ❤️
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: '#e74c3c',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      px: 1,
                      py: 0,
                      borderRadius: 1,
                      border: '2px solid white',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      textAlign: 'center'
                    }}
                  >
                    LEVEL 9
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Health Recovery
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      183/200 days
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Reach 200 days to restore lung function
                  </Typography>

                  {/* Progress Bar */}
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'section.main',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(183 / 200) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Money Saved Achievement */}
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f7b733, #fc4a1a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '40px',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    💰
                  </Box>

                  {/* Third achievement (Money Saved) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: '#f7b733',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      px: 1,
                      py: 0,
                      borderRadius: 1,
                      border: '2px solid white',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      textAlign: 'center'
                    }}
                  >
                    LEVEL 10
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                      Money Saved
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      $1000/$1000
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    You've saved $1000 by not buying cigarettes
                  </Typography>

                  {/* Progress Bar */}
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'section.main',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f7b733, #fc4a1a)',
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
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