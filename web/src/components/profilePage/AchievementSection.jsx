import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, LinearProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AchievementSection = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievementsProgress = async () => {
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
        const progressData = await achievementsService.getUserAchievementsProgressById(userId);
        setProgressList(Array.isArray(progressData.data) ? progressData.data : []);
      } catch (err) {
        setError('Failed to load achievement progress');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievementsProgress();
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
        ) : progressList.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', }}>
            You have not obtained any achievements yet! {" "}
            <Typography
              component={Link}
              to="/achievements"
              sx={{ color: 'primary.main', fontWeight: 'medium', cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, textDecoration: 'none', fontStyle: 'italic' }}
            >
              View all available achievements.
            </Typography>
          </Box>
        ) : (
          (() => {
            const obtained = progressList.filter(ach => ach.isMet);
            if (obtained.length === 0) {
              return (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  You have not obtained any achievements yet!
                </Box>
              );
            }
            return obtained.map((ach, idx, arr) => {
              const progress = Math.min((Number(ach.progressValue) / Number(ach.threshold_value)) * 100, 100);
              return (
                <Box
                  key={ach.id || idx}
                  sx={{
                    p: 3,
                    borderBottom: idx !== arr.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    opacity: 1,
                    filter: 'none',
                    transition: 'opacity 0.3s, filter 0.3s',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Avatar src={ach.image_url || ach.thumbnail} alt={ach.name} sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{ach.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{ach.description}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          flex: 1,
                          height: 10,
                          borderRadius: 5,
                          bgcolor: '#ffd8b9',
                          '& .MuiLinearProgress-bar': { bgcolor: '#ffa426' }
                        }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right', color: 'primary.main' }}>
                        {Math.floor(Number(ach.progressValue))}/{ach.threshold_value}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            });
          })()
        )}
      </Paper>
    </Box>
  );
};

export default AchievementSection;