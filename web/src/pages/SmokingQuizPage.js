import React, { useState, useReducer, useEffect } from 'react';
import {
    Typography,
    Box,
    Button,
    Container,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import smokingService from '../services/smokingService';
import SmokingHabitsResult from '../components/smokingQuiz/SmokingHabitsResult';
import SmokingHabitsQuestions from '../components/smokingQuiz/SmokingHabitsQuestions';

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

                // If data exists, use it to initialize the form
                if (response && response.data && response.data.length > 0) {
                    // Use the most recent record (assuming sorted by date)
                    const latestRecord = response.data[0];

                    // Initialize form with existing data
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

                    // Also show the result if it exists
                    setResult(latestRecord);
                    setShowForm(false);
                }
            } catch (err) {
                console.error("Error fetching smoking habits:", err);
                setError("Failed to load your previous data. Starting with default values.");
                // Continue with default values if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchExistingData();
    }, []);

    // Effect to disable scrolling when showing the quiz form
    useEffect(() => {
        if (showForm) {
            // Disable scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
        }

        // Cleanup function to re-enable scrolling when component unmounts
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
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Request setup error:', error.message);
            }
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

    return (
        <Box sx={{
            minHeight: '100vh',
            minWidth: '100%',
            bgcolor: 'background.default',
            py: 5,
            overflow: showForm ? 'hidden' : 'auto',
        }}>
            <Container maxWidth="md">
                {error && (
                    <Box sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: 'error.light',
                        color: 'error.dark',
                        borderRadius: 2
                    }}>
                        <Typography>{error}</Typography>
                    </Box>
                )}

                {showForm ? (
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            mb: 4,
                            height: 'auto',
                            maxHeight: 'calc(100vh - 80px)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: 'text.primary'
                            }}
                        >
                            Smoking Habit Assessment
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                mb: 4,
                                color: 'text.secondary'
                            }}
                        >
                            Question {currentQuestion + 1} of {questions.length}
                        </Typography>

                        <Box sx={{ mt: 2, flexGrow: 1 }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 1,
                                    fontWeight: 'medium',
                                    color: 'text.primary'
                                }}
                            >
                                {questions[currentQuestion].question}
                            </Typography>
                            {questions[currentQuestion].component(
                                formData[questions[currentQuestion].field],
                                questions[currentQuestion].field === 'triggers'
                                    ? handleCheckboxChange
                                    : (e) => handleChange(e)
                            )}
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            {currentQuestion > 0 && (
                                <Button
                                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    variant="outlined"
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        borderRadius: '12px',
                                        borderColor: '#000000',
                                        color: '#000000',
                                        '&:hover': {
                                            borderColor: '#000000',
                                            bgcolor: 'rgba(0, 0, 0, 0.04)',
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
                                    bgcolor: '#000000',
                                    color: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 0 #00000080',
                                    '&:hover': {
                                        bgcolor: '#000000cd',
                                        boxShadow: '0 2px 0 #00000080',
                                        transform: 'translateY(2px)',
                                    },
                                    '&:active': {
                                        boxShadow: '0 0 0 #00000080',
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
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        <SmokingHabitsResult data={result} />

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                onClick={handleRetakeQuiz}
                                variant="outlined"
                                sx={{
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: '12px',
                                    borderColor: '#000000',
                                    color: '#000000',
                                    '&:hover': {
                                        borderColor: '#000000',
                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
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
                                    bgcolor: '#000000',
                                    color: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 0 #00000080',
                                    '&:hover': {
                                        bgcolor: '#000000cd',
                                        boxShadow: '0 2px 0 #00000080',
                                        transform: 'translateY(2px)',
                                    },
                                    '&:active': {
                                        boxShadow: '0 0 0 #00000080',
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