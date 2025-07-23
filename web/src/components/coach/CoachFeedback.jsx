import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const CoachFeedback = ({ averageStars = {}, averageRating = 0 }) => {
    // Calculate total ratings
    const totalRatings = Object.values(averageStars).reduce((sum, n) => sum + n, 0);

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Average Rating: {averageRating.toFixed(1)}
                <StarIcon sx={{ color: '#FFD700', ml: 0.5, fontSize: '1.2rem', verticalAlign: 'middle' }} />
            </Typography>
            <Box sx={{ mt: 1 }}>
                {[5, 4, 3, 2, 1].map(star => (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ width: 24 }}>{star}</Typography>
                        <StarIcon sx={{ color: '#FFD700', fontSize: '1rem', mx: 0.5 }} />
                        <Box sx={{ flex: 1, mx: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={totalRatings ? (averageStars[star] || 0) / totalRatings * 100 : 0}
                                sx={{ height: 8, borderRadius: 5, bgcolor: '#f0f0f0' }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'right' }}>
                            {averageStars[star] || 0}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CoachFeedback;
