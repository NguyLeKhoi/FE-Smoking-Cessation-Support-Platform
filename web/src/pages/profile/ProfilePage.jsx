import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { fetchCurrentUser, updateCurrentUser } from '../../services/userService';
import ProfileSidebar from '../../components/profilePage/ProfileSidebar';
import UserInfoSection from '../../components/profilePage/UserInfoSection';
import StatisticsSection from '../../components/profilePage/StatisticsSection';
import AchievementSection from '../../components/profilePage/AchievementSection';
import LoadingPage from '../LoadingPage'

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

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

  return (
    <>
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'visible'
      }}>
        <ProfileSidebar userData={null} />

        {/* Main content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 4,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}>
          <UserInfoSection />

          <StatisticsSection statisticsData={statisticsData} />

          <Box sx={{ mt: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            </Box>
            <AchievementSection />
          </Box>

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