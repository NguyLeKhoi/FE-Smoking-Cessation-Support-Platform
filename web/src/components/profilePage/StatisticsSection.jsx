import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import trophyIcon from '../../assets/icons/leaderboard.png';
import streakIcon from '../../assets/icons/streak.png';
import xpIcon from '../../assets/icons/xp.png';

const StatisticsSection = ({ user }) => {
  if (!user) return null;
  const totalScoreEntry = Array.isArray(user.leaderboard)
    ? user.leaderboard.find(entry => entry.rank_type === 'total_score')
    : null;
  const cards = [
    {
      icon: <img src={streakIcon} alt="Streak" style={{ width: 48, height: 48 }} />,
      value: user.streak ?? 0,
      label: 'Day streak',
    },
    {
      icon: <img src={xpIcon} alt="XP" style={{ width: 48, height: 48 }} />,
      value: user.point ?? 0,
      label: 'Total XP',
    },
    {
      icon: <img src={trophyIcon} alt="Total Score Rank" style={{ width: 48, height: 48 }} />,
      value: totalScoreEntry ? (totalScoreEntry.rank ?? '-') : '-',
      label: totalScoreEntry ? (totalScoreEntry.rank_type ? `Rank: ${totalScoreEntry.rank_type.replace(/_/g, ' ')}` : 'No ranking data') : 'Rank: total score',
    },
  ];
  return (
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
      <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'nowrap' }}>
        {cards.map((card, idx) => (
          <Grid item xs={12} sm={4} key={idx} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '120px',
                width: '100%',
                minWidth: '300px',
                maxWidth: '340px',
                flex: 1,
                bgcolor: 'section.light',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxSizing: 'border-box',
              }}
            >
              <Box sx={{ mr: 2 }}>{card.icon}</Box>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 0.5 }}>{card.value}</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '16px' }}>{card.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatisticsSection;