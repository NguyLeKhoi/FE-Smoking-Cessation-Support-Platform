import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
    Typography,
    Box,
    Button,
    Container,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Fade,
    Alert,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import Lottie from 'lottie-react';
import smokingService from '../services/smokingService';
import SmokingHabitsResult from '../components/smokingQuiz/SmokingHabitsResult';
import SmokingHabitsQuestions from '../components/smokingQuiz/SmokingHabitsQuestions';
import typingCatAnimation from '../assets/animations/typing-cat-animation.json';

// Default form state
const defaultState = {
    cigarettes_per_pack: '',
    price_per_pack: '',
    cigarettes_per_day: '',
    smoking_years: '',
    triggers: [],
    health_issues: ''
};

// Form state reducer
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

/**
 * SmokingQuiz component for assessing user's smoking habits
 */
const SmokingQuiz = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State management
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [formData, dispatch] = useReducer(formReducer, defaultState);
    const [result, setResult] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Get questions with memoization
    const { questions } = useMemo(() => SmokingHabitsQuestions(), []);

    /**
     * Handles field value changes
     */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_FIELD', field: name, value });
    }, []);

    /**
     * Handles checkbox changes for triggers
     */
    const handleCheckboxChange = useCallback((e) => {
        const { value, checked } = e.target;
        dispatch({ type: 'UPDATE_TRIGGERS', value, checked });
    }, []);

    /**
     * Validates the current question's field
     */
    const validateCurrentField = useCallback(() => {
        const currentField = questions[currentQuestion].field;

        // Skip validation for optional fields
        if (currentField === 'health_issues') {
            return true;
        }

        // Validate triggers field (array)
        if (currentField === 'triggers') {
            if (!formData.triggers?.length) {
                setError(`Please select at least one smoking trigger before continuing.`);
                return false;
            }
            return true;
        }

        // Validate other fields
        if (!formData[currentField]) {
            setError(`Please fill in the required field before continuing.`);
            return false;
        }

        return true;
    }, [currentQuestion, formData, questions]);

    /**
     * Handles form submission
     */
    const handleSubmit = useCallback(async () => {
        try {
            // Basic validation for all fields
            if (
                !formData.cigarettes_per_day ||
                !formData.smoking_years ||
                !formData.price_per_pack ||
                !formData.cigarettes_per_pack ||
                !formData.triggers ||
                formData.triggers.length === 0
            ) {
                setError('Please fill in all required fields before submitting the assessment.');
                return;
            }

            // Set UI states for submission
            setSubmitting(true);
            setLoading(true);
            setError(null);

            // Format data for API submission
            const dataToSubmit = {
                cigarettes_per_pack: Number(formData.cigarettes_per_pack),
                price_per_pack: Number(formData.price_per_pack),
                cigarettes_per_day: Number(formData.cigarettes_per_day),
                smoking_years: Math.round(Number(formData.smoking_years)), // Round to integer per API requirement
                triggers: formData.triggers,
                health_issues: formData.health_issues || ''
            };

            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            // Submit data to API
            const data = await smokingService.createSmokingHabit(dataToSubmit);

            // Update UI with result
            setResult(data);
            setShowForm(false);
            setQuizCompleted(true);
        } catch (error) {
            console.error('Error submitting smoking assessment:', error);

            // Handle API error responses
            if (error.response?.data) {
                const errorData = error.response.data;
                let errorMessage = 'Server validation error. Please check your inputs.';

                // Format validation errors from different possible formats
                if (errorData.message && Array.isArray(errorData.message) && errorData.message.length > 0) {
                    const messages = errorData.message.map(item => {
                        if (item.path && item.message) {
                            return `${item.path}: ${item.message}`;
                        }
                        return JSON.stringify(item);
                    });
                    errorMessage = messages.join('; ');
                } else if (typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                }

                setError(errorMessage);
            } else {
                setError('There was an error submitting your assessment. Please try again.');
            }
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    }, [formData]);

    /**
     * Handles navigation to the next question
     */
    const handleNext = useCallback(() => {
        if (!validateCurrentField()) {
            return;
        }

        setError(null);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            handleSubmit();
        }
    }, [currentQuestion, questions.length, validateCurrentField, handleSubmit]);

    /**
     * Handles navigation to the previous question
     */
    const handlePrevious = useCallback(() => {
        setCurrentQuestion(prev => prev - 1);
        setError(null);
    }, []);

    /**
     * Resets the quiz to start over
     */
    const handleRetakeQuiz = useCallback(() => {
        setShowForm(true);
        setCurrentQuestion(0);
        setError(null);
        dispatch({ type: 'RESET' });
    }, []);

    /**
     * Fetch existing data when component mounts or quiz is completed
     */
    useEffect(() => {
        const fetchExistingData = async () => {
            try {
                setLoading(true);
                const response = await smokingService.getMySmokingHabits();

                if (quizCompleted && response?.data?.length > 0) {
                    const latestRecord = response.data[0];

                    // Initialize form with fetched data
                    dispatch({
                        type: 'INITIALIZE',
                        data: {
                            cigarettes_per_pack: latestRecord.cigarettes_per_pack,
                            price_per_pack: latestRecord.price_per_pack,
                            cigarettes_per_day: latestRecord.cigarettes_per_day,
                            smoking_years: latestRecord.smoking_years,
                            triggers: Array.isArray(latestRecord.triggers) ? latestRecord.triggers : [],
                            health_issues: latestRecord.health_issues || ''
                        }
                    });

                    setResult(latestRecord);
                    setShowForm(false);
                } else {
                    dispatch({ type: 'RESET' });
                    setShowForm(true);
                    setResult(null);
                }
            } catch (err) {
                console.error("Error fetching smoking habits:", err);
                setError("Failed to load your previous data. Please complete the assessment.");
                setShowForm(true);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingData();
    }, [quizCompleted]);

    /**
     * Control body overflow based on form visibility
     */
    useEffect(() => {
        document.body.style.overflow = showForm ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showForm]);

    // Show loading indicator while fetching initial data
    if (loading && !showForm) {
        return (
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}>
                <CircularProgress size={40} sx={{ color: '#3f332b' }} />
            </Box>
        );
    }

    // Get the current question text and determine layout
    const currentQuestionText = questions[currentQuestion]?.question || '';
    const isLongQuestion = currentQuestionText.length > 50;
    const isVeryLongQuestion = currentQuestionText.length > 100;

    return (
        <Box sx={{
            minHeight: '100vh',
            minWidth: '100%',
            bgcolor: 'background.default',
            pt: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: showForm ? 'hidden' : 'auto',
        }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                {/* Error message alert */}
                <Fade in={!!error}>
                    <Box sx={{
                        position: 'relative',
                        zIndex: 2,
                        maxWidth: '800px',
                        mx: 'auto',
                        mb: 2
                    }}>
                        {error && (
                            <Alert
                                severity="error"
                                onClose={() => setError(null)}
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                    </Box>
                </Fade>

                {showForm ? (
                    <Box
                        sx={{
                            p: { xs: 3, md: 5 },
                            pt: { xs: 3, md: 4 },
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            width: '100%',
                            maxWidth: '800px',
                            mx: 'auto',
                            height: 'auto',
                            minHeight: { xs: 'auto', md: '500px' },
                            maxHeight: 'calc(100vh - 140px)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            zIndex: 1,
                            top: { xs: 0, md: '10px' },
                            transform: { xs: 'none', md: 'translateY(-5%)' },
                        }}
                    >
                        {/* Quiz header */}
                        <Box mb={3}>
                            <Typography variant="h3" component="h1" sx={{
                                fontWeight: 700,
                                mb: 1,
                                color: 'text.primary',
                                fontSize: { xs: '1.75rem', md: '2.5rem' }
                            }}>
                                Assessing Your Smoking Habit
                            </Typography>

                            {/* Progress indicator */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                                        Question {currentQuestion + 1} of {questions.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {Math.round((currentQuestion + 1) / questions.length * 100)}% complete
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.08)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                                    <Box
                                        sx={{
                                            height: '100%',
                                            bgcolor: '#3f332b',
                                            width: `${(currentQuestion + 1) / questions.length * 100}%`,
                                            transition: 'width 0.3s ease-out'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Question content */}
                        <Box sx={{
                            mt: 1,
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start'
                        }}>
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
                                                    {currentQuestionText}
                                                </Typography>

                                                {/* Input field */}
                                                <Box sx={{ mt: 1.5 }}>
                                                    {questions[currentQuestion].component(
                                                        formData[questions[currentQuestion].field],
                                                        questions[currentQuestion].field === 'triggers'
                                                            ? handleCheckboxChange
                                                            : (e) => handleChange(e)
                                                    )}
                                                </Box>
                                            </Box>
                                        </Fade>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Navigation buttons */}
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
                                    onClick={handlePrevious}
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
                                onClick={handleNext}
                                variant="contained"
                                disabled={submitting}
                                endIcon={currentQuestion < questions.length - 1 ? <ArrowForwardIcon /> : null}
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
                                {submitting ? 'Processing...' : (currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Next')}
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    // Results display
                    <Fade in={!showForm} timeout={500}>
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
                            <Box sx={{
                                mt: 4,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: 'center'
                            }}>
                                <Button
                                    onClick={handleRetakeQuiz}
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
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
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default SmokingQuiz;