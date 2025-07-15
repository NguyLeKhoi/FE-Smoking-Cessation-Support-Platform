import React from 'react';
import { Box, Typography, Avatar, LinearProgress, Chip } from '@mui/material';

const AchievementStyle = ({ ach, isMet, progress, idx, arr }) => (
    <Box
        key={ach.id || idx}
        sx={{
            p: 3,
            borderBottom: idx !== arr.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
        }}
    >
        <Avatar src={ach.image_url || ach.thumbnail} alt={ach.name} sx={{ width: 50, height: 50, borderRadius: 2, mr: 2, opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }} />
        <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }}>{ach.name}</Typography>
                {Number(ach.progressValue) >= Number(ach.threshold_value) && (
                    <Chip label="completed" size="small" sx={{ fontWeight: 600, ml: 1, justifySelf: 'flex-end', bgcolor: '#63bd6f', color: 'white' }} />
                )}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, opacity: isMet ? 1 : 0.5, filter: isMet ? 'none' : 'grayscale(100%)' }}>{ach.description}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        flex: 1,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#eee',
                        '& .MuiLinearProgress-bar': { bgcolor: isMet ? '#ffa426' : '#ffd8b9' }
                    }}
                />
                <Typography variant="body2" sx={{ minWidth: 80, textAlign: 'right', color: isMet ? '#ffa426' : 'text.secondary' }}>
                    {`${Math.floor(Number(ach.progressValue))}/${ach.threshold_value}`}
                </Typography>
            </Box>
        </Box>
    </Box>
);

export default AchievementStyle;
