import React, { useState, useReducer, useEffect } from 'react';
import {
    Typography,
    Box,
    Button,
    Container,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import Lottie from 'lottie-react';
import smokingService from '../services/smokingService';
import SmokingHabitsResult from '../components/smokingQuiz/SmokingHabitsResult';
import SmokingHabitsQuestions from '../components/smokingQuiz/SmokingHabitsQuestions';
import typingCatAnimation from '../assets/animations/typing-cat-animation.json';

// Default values to use if no existing data is found
const defaultState = {
    cigarettes_per_pack: 20,
    price_per_pack: 5.99,
    cigarettes_per_day: 0,
    smoking_years: 0,
    triggers: [],
    health_issues: ''
};

const formReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'UPDATE_TRIGGERS':
            const updatedTriggers = action.checked
                ? [...state.triggers, action.value]
                : state.triggers.filter((t) => t !== action.value);
            return { ...state, triggers: updatedTriggers };
        case 'RESET':
            return defaultState;
        case 'INITIALIZE':
            return action.data;
        default:
            return state;
    }
};

const SmokingQuiz = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [formData, dispatch] = useReducer(formReducer, defaultState);
    const [result, setResult] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get questions from the extracted component
    const { questions } = SmokingHabitsQuestions();

    // Fetch existing data when component mounts
    useEffect(() => {
        const fetchExistingData = async () => {
            try {
                setLoading(true);
                const response = await smokingService.getMySmokingHabits();

                if (response && response.data && response.data.length > 0) {
                    const latestRecord = response.data[0];
                    dispatch({
                        type: 'INITIALIZE',
                        data: {
                            cigarettes_per_pack: latestRecord.cigarettes_per_pack || 20,
                            price_per_pack: latestRecord.price_per_pack || 5.99,
                            cigarettes_per_day: latestRecord.cigarettes_per_day || 0,
                            smoking_years: latestRecord.smoking_years || 0,
                            triggers: latestRecord.triggers || [],
                            health_issues: latestRecord.health_issues || ''
                        }
                    });
                    setResult(latestRecord);
                    setShowForm(false);
                }
            } catch (err) {
                console.error("Error fetching smoking habits:", err);
                setError("Failed to load your previous data. Starting with default values.");
            } finally {
                setLoading(false);
            }
        };
        fetchExistingData();
    }, []);

    useEffect(() => {
        if (showForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showForm]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_FIELD', field: name, value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        dispatch({ type: 'UPDATE_TRIGGERS', value, checked });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.cigarettes_per_day || !formData.smoking_years) {
                console.error('Please fill in all required fields');
                return;
            }
            const dataToSubmit = {
                ...formData,
                cigarettes_per_day: Number(formData.cigarettes_per_day),
                smoking_years: Number(formData.smoking_years),
                price_per_pack: Number(formData.price_per_pack),
                cigarettes_per_pack: Number(formData.cigarettes_per_pack)
            };
            const data = await smokingService.createSmokingHabit(dataToSubmit);
            setResult(data);
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRetakeQuiz = () => {
        setShowForm(true);
        setCurrentQuestion(0);
        dispatch({ type: 'RESET' });
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // Get the current question's length to determine bubble size
    const currentQuestionText = questions[currentQuestion].question;
    const isLongQuestion = currentQuestionText.length > 50;
    const isVeryLongQuestion = currentQuestionText.length > 100;

    return (
        <Box sx={{
            minHeight: '100vh',
            minWidth: '100%',
            bgcolor: 'background.default',
            py: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: showForm ? 'hidden' : 'auto',
        }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {error && (
                    <Box sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.dark', borderRadius: 2 }}>
                        <Typography>{error}</Typography>
                    </Box>
                )}

                {showForm ? (
                    <Box
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            maxWidth: '800px',
                            mx: 'auto',
                            height: 'auto',
                            minHeight: { xs: 'auto', md: '500px' },
                            maxHeight: 'calc(100vh - 120px)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            top: '50%',
                            transform: { xs: 'none', md: 'translateY(-10%)' },
                        }}
                    >
                        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
                            Smoking Habit Assessment
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            Question {currentQuestion + 1} of {questions.length}
                        </Typography>

                        <Box sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 3, 
                                mb: 3, 
                                ml: { xs: '-10px', md: '-15px' },
                                flexWrap: { xs: 'wrap', sm: 'nowrap' }
                            }}>
                                <Box sx={{ 
                                    flexShrink: 0, 
                                    width: { xs: '100px', md: '140px' }, 
                                    height: { xs: '100px', md: '140px' },
                                    position: 'relative',
                                    left: { xs: '-5px', md: '-10px' }
                                }}>
                                    <Lottie
                                        animationData={typingCatAnimation}
                                        loop={true}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            marginBottom: '-10px' 
                                        }}
                                    />
                                </Box>
                                
                                {/* Chat Bubble that grows based on content */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        backgroundColor: '#f5f5f5',
                                        padding: '15px 20px',
                                        borderRadius: '16px',
                                        maxWidth: { xs: '100%', sm: isVeryLongQuestion ? '70%' : isLongQuestion ? '60%' : '50%' },
                                        width: { xs: 'calc(100% - 20px)', sm: 'auto' },
                                        minWidth: { xs: 'auto', sm: '300px' },
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                        alignSelf: 'flex-start',
                                        mt: { xs: 0, sm: 2 }, // Add margin top on desktop
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
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: 'text.primary',
                                            mb: 2,
                                            fontWeight: 500
                                        }}
                                    >
                                        {currentQuestionText}
                                    </Typography>
                                    
                                    {/* Input field inside the chat bubble */}
                                    <Box sx={{ mt: 2 }}>
                                        {questions[currentQuestion].component(
                                            formData[questions[currentQuestion].field],
                                            questions[currentQuestion].field === 'triggers'
                                                ? handleCheckboxChange
                                                : (e) => handleChange(e)
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ 
                            mt: 4, 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            gap: 2, 
                            flexDirection: { xs: currentQuestion > 0 ? 'column' : 'row', sm: 'row' } 
                        }}>
                            {currentQuestion > 0 && (
                                <Button
                                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    variant="outlined"
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
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    bgcolor: '#3f332b',
                                    color: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 0 rgba(63, 51, 43, 0.5)',
                                    ml: 'auto',
                                    flex: { xs: '1', sm: '0 0 auto' },
                                    '&:hover': {
                                        bgcolor: 'rgba(63, 51, 43, 0.9)',
                                        boxShadow: '0 2px 0 rgba(63, 51, 43, 0.5)',
                                        transform: 'translateY(2px)',
                                    },
                                    '&:active': {
                                        boxShadow: '0 0 0 rgba(63, 51, 43, 0.5)',
                                        transform: 'translateY(4px)',
                                    },
                                }}
                            >
                                {currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Next'}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            maxWidth: '800px',
                            mx: 'auto',
                        }}
                    >
                        <SmokingHabitsResult data={result} />
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                            <Button
                                onClick={handleRetakeQuiz}
                                variant="outlined"
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: '12px',
                                    borderColor: '#3f332b',
                                    color: '#3f332b',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': {
                                        borderColor: '#3f332b',
                                        bgcolor: 'rgba(63, 51, 43, 0.04)',
                                    },
                                }}
                            >
                                Retake Assessment
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<HomeIcon />}
                                onClick={() => navigate('/')}
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    bgcolor: '#3f332b',
                                    color: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 0 rgba(63, 51, 43, 0.5)',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': {
                                        bgcolor: 'rgba(63, 51, 43, 0.9)',
                                        boxShadow: '0 2px 0 rgba(63, 51, 43, 0.5)',
                                        transform: 'translateY(2px)',
                                    },
                                    '&:active': {
                                        boxShadow: '0 0 0 rgba(63, 51, 43, 0.5)',
                                        transform: 'translateY(4px)',
                                    },
                                }}
                            >
                                Back to Homepage
                            </Button>
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default SmokingQuiz;