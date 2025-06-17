import React from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import Lottie from 'lottie-react';
import typingCatAnimation from '../../assets/animations/typing-cat-animation.json';

const QuizChatBubble = ({
    questionText,
    submitting,
    questionComponent,
    formValue,
    onInputChange,
    isTriggerQuestion
}) => {
    const isLongQuestion = questionText.length > 50;
    const isVeryLongQuestion = questionText.length > 100;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 3,
            mb: 3,
            ml: { xs: '-10px', md: '0px' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
        }}>
            {/* Cat animation */}
            <Box sx={{
                flexShrink: 0,
                width: { xs: '90px', md: '150px' },
                height: { xs: '90px', md: '150px' },
                position: 'relative',
                left: { xs: '-5px', md: '-3px' }
            }}>
                <Lottie
                    animationData={typingCatAnimation}
                    loop={true}
                    style={{
                        width: '100%',
                        height: '100%',
                        marginTop: '-20px'
                    }}
                />
            </Box>

            {/* Chat Bubble */}
            <Box
                sx={{
                    position: 'relative',
                    backgroundColor: '#f5f5f5',
                    padding: '20px 18px',
                    borderRadius: '16px',
                    maxWidth: { xs: '100%', sm: submitting ? '60%' : isVeryLongQuestion ? '70%' : isLongQuestion ? '60%' : '50%' },
                    width: { xs: 'calc(100% - 20px)', sm: 'auto' },
                    minWidth: { xs: 'auto', sm: '500px' },
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    alignSelf: 'flex-start',
                    mt: { xs: 0, sm: 1 },
                    transition: 'all 0.3s ease',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        left: '-10px',
                        top: '30px',
                        width: 0,
                        height: 0,
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        borderRight: '10px solid #f5f5f5',
                    },
                }}
            >
                {submitting ? (
                    // Loading state during submission
                    <Fade in={submitting}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 3,
                            minHeight: '200px'
                        }}>
                            <CircularProgress size={40} sx={{ mb: 2, color: '#3f332b' }} />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                Assessment In Progress...
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    textAlign: 'center',
                                    mt: 1
                                }}
                            >
                                Analyzing your smoking habits
                            </Typography>
                        </Box>
                    </Fade>
                ) : (
                    // Question content
                    <Fade in={!submitting} timeout={300}>
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.primary',
                                    mb: 1.5,
                                    fontWeight: 520
                                }}
                            >
                                {questionText}
                            </Typography>

                            {/* Input field */}
                            <Box sx={{ mt: 1.5 }}>
                                {questionComponent(
                                    formValue,
                                    isTriggerQuestion ? onInputChange.handleCheckboxChange : onInputChange.handleChange
                                )}
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

export default QuizChatBubble;