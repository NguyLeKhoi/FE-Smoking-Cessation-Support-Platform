import React from 'react';
import { Box, Typography } from '@mui/material';

const QuizProgressIndicator = ({ currentQuestion, totalQuestions }) => {
    const progressPercentage = Math.round((currentQuestion + 1) / totalQuestions * 100);

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                    Question {currentQuestion + 1} of {totalQuestions}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {progressPercentage}% complete
                </Typography>
            </Box>
            <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.08)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                <Box
                    sx={{
                        height: '100%',
                        bgcolor: '#3f332b',
                        width: `${progressPercentage}%`,
                        transition: 'width 0.3s ease-out'
                    }}
                />
            </Box>
        </Box>
    );
};

export default QuizProgressIndicator;