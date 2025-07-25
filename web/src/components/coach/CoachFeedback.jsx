import React from 'react';
import { Box, Typography, LinearProgress, Card } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import WriteFeedbackBox from './WriteFeedbackBox';

const CoachFeedback = ({
    averageStars = {},
    averageRating = 0,
    newFeedback,
    setNewFeedback,
    submitting,
    setSubmitting,
    ratingStar,
    setRatingStar,
    onSubmit
}) => {
    // Calculate total ratings
    const totalRatings = Object.values(averageStars).reduce((sum, n) => sum + n, 0);

    return (
        <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2, mt: 2, mb: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 0 }}>
                {/*Average Rating */}
                <Box sx={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minWidth: 70 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: '1.6rem' }}>
                        {averageRating.toFixed(1)}
                        <StarIcon sx={{ color: '#FFD700', ml: 0.5, fontSize: '1.3rem', verticalAlign: 'middle' }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.95rem' }}>
                        {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                {/*Star Breakdown */}
                <Box sx={{ flex: '0 0 80%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                    {[5, 4, 3, 2, 1].map(star => (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.2, width: '100%' }}>
                            <Typography variant="body2" sx={{ width: 20, fontSize: '0.95rem' }}>{star}</Typography>
                            <StarIcon sx={{ color: '#FFD700', fontSize: '0.95rem', mx: 0.3 }} />
                            <Box sx={{ flex: 1, mx: 0.5 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={totalRatings ? (averageStars[star] || 0) / totalRatings * 100 : 0}
                                    sx={{ height: 6, borderRadius: 3, bgcolor: '#f0f0f0' }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'right', fontSize: '0.95rem' }}>
                                {averageStars[star] || 0}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* Write Feedback Box below star breakdown */}
            <WriteFeedbackBox
                submitting={submitting}
                newFeedback={newFeedback}
                setNewFeedback={setNewFeedback}
                onSubmit={onSubmit}
                ratingStar={ratingStar}
                setRatingStar={setRatingStar}
            />
        </Card>
    );
};

export default CoachFeedback;
