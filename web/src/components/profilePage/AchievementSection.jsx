import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress } from '@mui/material';
import achievementsService from '../../services/achievementsService';
import { Link } from 'react-router-dom';

const AchievementSection = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await achievementsService.getAllAchievements();
        setAchievements(data.data || []);
      } catch (err) {
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  // Show only top 3 achievements
  const topAchievements = achievements.slice(0, 3);

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
        ) : topAchievements.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No achievements yet.</Box>
        ) : (
          topAchievements.map((ach, idx) => (
            <Box key={ach.id || idx} sx={{ p: 3, borderBottom: idx !== topAchievements.length - 1 ? '1px solid' : 'none', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar src={ach.image_url} alt={ach.name} sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{ach.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{ach.point} pts</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{ach.description}</Typography>
                {/* <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#f5f5f5', position: 'relative', overflow: 'hidden', mb: 1 }}>
                  <Box
                    sx={{
                      width: ach.progress !== undefined
                        ? `${Math.round(ach.progress * 100)}%`
                        : ach.max_point
                          ? `${Math.min(100, Math.round((ach.point / ach.max_point) * 100))}%`
                          : '100%',
                      height: '100%',
                      background: '#ffd353',
                      borderRadius: 4,
                      transition: 'width 0.4s',
                    }}
                  />
                </Box> */}
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Obtained on: {new Date(ach.created_at).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default AchievementSection;