import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AchievementSection = () => {
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      const accessToken = localStorage.getItem('accessToken');
      let userId = null;
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        userId = decoded.sub || decoded.id || decoded.user_id;
      }
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }
      try {
        const userAchievementsData = await achievementsService.getUserAchievementsById(userId);
        setUserAchievements(userAchievementsData.data ? userAchievementsData.data.slice(0, 3) : []);
      } catch (err) {
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5"
          sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary', fontSize: '32px' }}>
          Achievements
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          to="/achievements"
          sx={{ color: 'primary.main', fontWeight: 'medium', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, textDecoration: 'none' }}
        >
          VIEW ALL
        </Typography>
      </Box>
      <Paper
        elevation={0}
        sx={{ p: 0, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>{error}</Box>
        ) : userAchievements.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
            You have not obtained any achievements yet!
          </Box>
        ) : (
          userAchievements.map((ach, idx) => (
            <Box
              key={ach.id || idx}
              sx={{
                p: 3,
                borderBottom: idx !== userAchievements.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Avatar src={ach.image_url || ach.thumbnail} alt={ach.name} sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{ach.name}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{ach.description}</Typography>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>{ach.earned_date ? `Obtained: ${new Date(ach.earned_date).toLocaleDateString()}` : ''}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default AchievementSection;