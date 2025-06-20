import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { fetchCurrentUser, updateCurrentUser } from '../services/userService';
import ProfileSidebar from '../components/profilePage/ProfileSidebar';
import UserInfoSection from '../components/profilePage/UserInfoSection';
import StatisticsSection from '../components/profilePage/StatisticsSection';
import AchievementSection from '../components/profilePage/AchievementSection';
import LoadingPage from './LoadingPage';
import QuitPlanPage from './QuitPlanPages/QuitPlanPage';

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
    avatar: '',
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
          avatar: response.data.avatar || '', 
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
      const updatedUserData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        avatar: formData.avatar,
        dob: formData.dob 
      };

      setLoading(true);
      const response = await updateCurrentUser(updatedUserData);

      setUserData(prevData => ({
        ...prevData,
        ...response.data,
        dob: response.data.dob || prevData.dob 
      }));

      setFormData(prevFormData => ({
        ...prevFormData,
        first_name: response.data.first_name || prevFormData.first_name,
        last_name: response.data.last_name || prevFormData.last_name,
        phone_number: response.data.phone_number || prevFormData.phone_number,
        avatar: response.data.avatar || prevFormData.avatar,
        email: prevFormData.email,
        dob: response.data.dob || prevFormData.dob 
      }));

      setIsEditing(false);
      setError(null);
    } catch (err) {
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
    return <LoadingPage />;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-error">No profile data available</div>;
  }

  return (
    <>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'visible'
      }}>
        {/* Pass userData to the ProfileSidebar */}
        <ProfileSidebar userData={userData} />

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
          <UserInfoSection
            userData={userData}
            formData={formData}
            isEditing={isEditing}
            handleEditToggle={handleEditToggle}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
          />

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
      <Routes>
        <Route path="/quit-plan" element={<QuitPlanPage />} />
      </Routes>
    </>
  );
}