import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, LinearProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AchievementStyle from './AchievementStyle';

const AchievementSection = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievementsProgress = async () => {
      const accessToken = localStorage.getItem('accessToken');
      let decoded = null;
      if (typeof accessToken === 'string' && accessToken) {
        try {
          decoded = jwtDecode(accessToken);
        } catch (e) {
          decoded = null;
        }
      }
      let userId = null;
      if (decoded) {
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
                <AchievementStyle
                  key={ach.id || idx}
                  ach={ach}
                  isMet={true}
                  progress={progress}
                  idx={idx}
                  arr={arr}
                />
              );
            });
          })()
        )}
      </Paper>
    </Box>
  );
};

export default AchievementSection;