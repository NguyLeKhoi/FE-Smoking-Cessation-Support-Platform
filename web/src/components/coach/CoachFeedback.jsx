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
    setSubmitting, // not used in this component, but passed for completeness
    ratingStar,
    setRatingStar,
    onSubmit
}) => {
    // Calculate total ratings
    const totalRatings = Object.values(averageStars).reduce((sum, n) => sum + n, 0);

    return (
        <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3, mt: 3, mb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 0 }}>
                {/*Average Rating */}
                <Box sx={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minWidth: 70 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', fontSize: '2.2rem' }}>
                        {averageRating.toFixed(1)}
                        <StarIcon sx={{ color: '#FFD700', ml: 0.5, fontSize: '2rem', verticalAlign: 'middle' }} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                {/*Star Breakdown */}
                <Box sx={{ flex: '0 0 80%', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                    {[5, 4, 3, 2, 1].map(star => (
                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '100%' }}>
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
