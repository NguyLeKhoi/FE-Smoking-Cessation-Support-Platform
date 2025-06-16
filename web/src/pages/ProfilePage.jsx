import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, updateCurrentUser } from '../services/userService';
import { format } from 'date-fns';
import ProfileSidebar from '../components/profilePage/ProfileSidebar';
import StatisticsSection from '../components/profilePage/StatisticsSection';
import AchievementSection from '../components/profilePage/AchievementSection';

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    dob: '',
    phone_number: '',
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchCurrentUser();
        setUserData(response.data);
        setFormData({
          email: response.data.email || '',
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          dob: response.data.dob || '',
          phone_number: response.data.phone_number || '',
        });
      } catch (err) {
        setError('Failed to load user profile. Please try again later.');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      // Only include editable fields
      const updatedUserData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number
        // email and dob intentionally excluded
      };

      setLoading(true);
      const updatedData = await updateCurrentUser(updatedUserData);
      setUserData(updatedData);
      setIsEditing(false);

      // Remove toast notification
      // toast.success('Profile updated successfully!');

      // Instead, you could use a regular state for success messages
      setError(null); // Clear any previous errors

    } catch (err) {
      // Remove toast notification
      // toast.error('Failed to update profile. Please try again.');

      // Use state for error messages instead
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  const statisticsData = [
    {
      icon: '💧',
      value: '63',
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

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-error">No profile data available</div>;
  }

  // Format date of birth if available
  const formattedDob = userData.dob
    ? format(new Date(userData.dob), 'MMMM dd, yyyy')
    : 'Not provided';

  return (
    <>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'visible'
      }}>
        <ProfileSidebar />

        {/* Main content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
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
                  {userData.username ? userData.username.charAt(0).toUpperCase() : '?'}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleEditToggle}
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSave}
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          bgcolor: 'primary.main',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleEditToggle}
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 3,
                          width: '100%',
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
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
                      <TextField
                        id="email-field"
                        label="Email"
                        name="email"
                        variant="standard"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{
                          readOnly: true
                        }}
                        disabled={isEditing}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        id="phone-field"
                        label="Phone Number"
                        name="phone_number"
                        variant="standard"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{ readOnly: !isEditing }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        id="first-name-field"
                        label="First Name"
                        name="first_name"
                        variant="standard"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{ readOnly: !isEditing }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        id="dob-field"
                        label="Date of Birth"
                        name="dob"
                        variant="standard"
                        value={isEditing ? formData.dob : formattedDob}
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{
                          readOnly: true // Always read-only regardless of edit mode
                        }}
                        disabled={isEditing} // Only visually disable when in edit mode
                        type={isEditing ? 'date' : 'text'}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        id="last-name-field"
                        label="Last Name"
                        name="last_name"
                        variant="standard"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        fullWidth
                        InputProps={{ readOnly: !isEditing }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>

          {/* Statistics Section */}
          <StatisticsSection statisticsData={statisticsData} />

          {/* Achievements Section */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            </Box>
            <AchievementSection />
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
    </>
  );
}