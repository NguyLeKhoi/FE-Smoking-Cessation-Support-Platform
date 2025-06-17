import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const QuizNavigationButtons = ({
    currentQuestion,
    questionsLength,
    submitting,
    onPrevious,
    onNext
}) => {
    return (
        <Box sx={{
            mt: 'auto',
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            flexDirection: { xs: currentQuestion > 0 ? 'column' : 'row', sm: 'row' }
        }}>
            {currentQuestion > 0 && (
                <Button
                    onClick={onPrevious}
                    variant="outlined"
                    disabled={submitting}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: '12px',
                        borderColor: '#3f332b',
                        color: '#3f332b',
                        flex: { xs: '1', sm: '0 0 auto' },
                        '&:hover': {
                            borderColor: '#3f332b',
                            bgcolor: 'rgba(63, 51, 43, 0.04)',
                        },
                        opacity: submitting ? 0.6 : 1,
                    }}
                >
                    Back
                </Button>
            )}
            <Button
                onClick={onNext}
                variant="contained"
                disabled={submitting}
                endIcon={currentQuestion < questionsLength - 1 ? <ArrowForwardIcon /> : null}
                sx={{
                    py: 1.5,
                    px: 4,
                    bgcolor: submitting ? 'rgba(63, 51, 43, 0.7)' : '#3f332b',
                    color: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 0 rgba(63, 51, 43, 0.5)',
                    ml: 'auto',
                    flex: { xs: '1', sm: '0 0 auto' },
                    '&:hover': {
                        bgcolor: submitting ? 'rgba(63, 51, 43, 0.7)' : 'rgba(63, 51, 43, 0.9)',
                        boxShadow: submitting ? '0 4px 0 rgba(63, 51, 43, 0.5)' : '0 2px 0 rgba(63, 51, 43, 0.5)',
                        transform: submitting ? 'none' : 'translateY(2px)',
                    },
                    '&:active': {
                        boxShadow: submitting ? '0 4px 0 rgba(63, 51, 43, 0.5)' : '0 0 0 rgba(63, 51, 43, 0.5)',
                        transform: submitting ? 'none' : 'translateY(4px)',
                    },
                }}
            >
                {submitting ? 'Processing...' : (currentQuestion === questionsLength - 1 ? 'Submit Assessment' : 'Next')}
            </Button>
        </Box>
    );
};

export default QuizNavigationButtons;