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

  const statisticsData = [
    {
      icon: '💧',
      value: '0',
      label: 'Day streak',
      iconColor: '#64748b'
    },
    {
      icon: '⚡',
      value: '18303',
      label: 'Total XP',
      iconColor: '#f59e0b'
    },
    {
      icon: '🏅',
      value: 'Gold',
      label: 'Current league',
      iconColor: '#f59e0b'
    },
    {
      icon: '🏆',
      value: '3',
      label: 'Top 3 finishes',
      iconColor: '#f59e0b'
    }
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <ProfileSidebar />

      {/* Main content */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 4,
        overflow: 'auto',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}>

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
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
            {/* Avatar Section - Left Side */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: '200px'
            }}>
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  bgcolor: '#f0f0f0',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  mb: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {userData.username.charAt(0).toUpperCase()}
                {/* Alternatively, use an image:
                <Box 
                  component="img"
                  src="https://via.placeholder.com/160"
                  alt="User avatar"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                */}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  textAlign: 'center',
                  color: 'text.primary'
                }}
              >
                {userData.username}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center'
                }}
              >
                Member since {userData.joined}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3
                }}
              >
                Edit Profile
              </Button>
            </Box>

            {/* User Information - Right Side */}
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                </Grid>

                <Grid item xs={12} sm={6}>
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
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {userData.dob}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>

        {/* Statistics Section*/}
        <Box sx={{ mt: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3, 
              color: 'text.primary',
              fontSize: '32px'
            }}
          >
            Statistics
          </Typography>
          <Grid container spacing={4}> 
            {statisticsData.map((stat, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '120px', 
                    width: '100%', 
                    minWidth: '200px', 
                    bgcolor: 'section.light',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      bgcolor: 'section.main',
                      borderColor: 'text.secondary',
                    },
                    display: 'flex',
                    alignItems: 'flex-start', 
                    gap: 2,
                    boxSizing: 'border-box', 
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      fontSize: '24px',
                      flexShrink: 0,
                      mt: 1, 
                    }}
                  >
                    {stat.icon}
                  </Box>
                  
                  <Box sx={{ 
                    flex: 1,
                    textAlign: 'left',
                    overflow: 'hidden', 
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: 'text.primary', 
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: '36px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '16px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Achievements Section */}
        <Box sx={{ mt: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                color: 'text.primary',
                fontSize: '32px'
              }}>
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