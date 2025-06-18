import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
    Typography,
    Box,
    Container,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Fade,
    Alert,
    TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import smokingService from '../services/smokingService';
import SmokingHabitsResult from '../components/smokingQuiz/SmokingHabitsResult';
import SmokingHabitsQuestions from '../components/smokingQuiz/SmokingHabitsQuestions';
import QuizProgressIndicator from '../components/smokingQuiz/ProgressIndicator';
import QuizNavigationButtons from '../components/smokingQuiz/NavigationButtons';
import QuizChatBubble from '../components/smokingQuiz/ChatBubble';

// Default form state
const defaultState = {
    cigarettes_per_pack: '',
    price_per_pack: '',
    cigarettes_per_day: '',
    smoking_years: '',
    triggers: [],
    health_issues: '' // Changed from array to string
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
            return true; // Health issues is optional
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
                smoking_years: Math.round(Number(formData.smoking_years)),
                triggers: formData.triggers,
                health_issues: formData.health_issues || 'No health issues reported' // Default value if empty
            };

            console.log('User data being submitted:', dataToSubmit);

            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                // Submit data to API and get result
                const resultData = await smokingService.createSmokingHabit(dataToSubmit);

                // Make sure we're using the user's submitted data as the base
                setResult({
                    ...dataToSubmit,
                    ai_feedback: resultData?.ai_feedback || '',
                    // Add any other fields from API that are needed but preserve user input
                    created_at: resultData?.created_at || new Date().toISOString(),
                    daily_cost: resultData?.daily_cost ||
                        ((Number(dataToSubmit.cigarettes_per_day) / Number(dataToSubmit.cigarettes_per_pack)) *
                            Number(dataToSubmit.price_per_pack))
                });

            } catch (apiError) {
                console.error('API error, proceeding with submitted data:', apiError);
                // If API fails, still show results with user data
                setResult({
                    ...dataToSubmit,
                    ai_feedback: "We couldn't generate personalized feedback at this time, but here's your smoking assessment based on the data you provided."
                });
            }

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
                    // Sort data by created_at in descending order to get the most recent record
                    const sortedRecords = [...response.data].sort((a, b) => {
                        const dateA = new Date(a.created_at || 0);
                        const dateB = new Date(b.created_at || 0);
                        return dateB - dateA; // Most recent first
                    });

                    // Get the most recent record
                    const latestRecord = sortedRecords[0];

                    console.log("Selected most recent record:", latestRecord);

                    // Initialize form with fetched data
                    dispatch({
                        type: 'INITIALIZE',
                        data: {
                            cigarettes_per_pack: latestRecord.cigarettes_per_pack,
                            price_per_pack: latestRecord.price_per_pack,
                            cigarettes_per_day: latestRecord.cigarettes_per_day,
                            smoking_years: latestRecord.smoking_years,
                            triggers: Array.isArray(latestRecord.triggers) ? latestRecord.triggers : [],
                            health_issues: latestRecord.health_issues || '' // Keep as string
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

    // Add or update the useEffect hook that controls body overflow
    useEffect(() => {
        // Disable scrolling when the form is shown
        if (showForm) {
            document.body.style.overflow = 'hidden';
            // For iOS Safari which might not respect overflow:hidden
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            // Re-enable scrolling when showing results
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.top = '';

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
            }
        }

        return () => {
            // Cleanup: always re-enable scrolling when component unmounts
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.top = '';
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

    // Get the current question text
    const currentQuestionText = questions[currentQuestion]?.question || '';

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* Progress bar section */}
            {showForm && (
                <Box sx={{
                    width: '100%',
                    top: 0,
                    zIndex: 10,
                    py: 1,
                    position: 'relative',
                }}>
                    {/* Close button */}
                    <IconButton
                        aria-label="close"
                        onClick={() => navigate('/')}
                        sx={{
                            position: 'absolute',
                            left: '10%',
                            top: '60%',
                            transform: 'translateY(-50%)',
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'text.primary',
                                bgcolor: 'rgba(0,0,0,0.04)'
                            },
                            zIndex: 11
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Progress indicator centered in container */}
                    <Container
                        maxWidth="md"
                        sx={{
                            mx: 'auto',
                            width: { xs: 'calc(100% - 80px)', sm: 'calc(100% - 120px)' },
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        <QuizProgressIndicator
                            currentQuestion={currentQuestion}
                            totalQuestions={questions.length}
                        />
                    </Container>
                </Box>
            )}

            {/* Main content */}
            <Box sx={{
                flex: 1,
                py: 2,
                px: { xs: 2, md: 4 },
                overflowY: showForm ? 'hidden' : 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <Container
                    maxWidth="md"
                    sx={{
                        height: showForm ? '100%' : 'auto',
                        overflowY: showForm ? 'hidden' : 'visible',
                        display: 'flex',
                        flexDirection: 'column',
                        width: { xs: 'calc(100% - 80px)', sm: 'calc(100% - 120px)' },
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}
                >
                    {/* Error message alert */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError(null)}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                                mb: 3,
                                width: '100%'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {showForm ? (
                        <>
                            {/* Quiz header */}
                            <Box mb={4} sx={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="h4" component="h1" sx={{
                                    fontWeight: 600,
                                    mb: -2,
                                    color: 'text.primary',
                                    fontSize: { xs: '1.75rem', md: '2rem' }
                                }}>
                                    Assessing Your Smoking Habit...
                                </Typography>
                            </Box>

                            {/* Question content - centered */}
                            <Box sx={{
                                mt: 2,
                                mb: 2,
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                {/* Chat Bubble with question only */}
                                <QuizChatBubble
                                    questionText={currentQuestionText}
                                    submitting={submitting}
                                />

                                {/* Options below the chat bubble */}
                                {!submitting && (
                                    <Box sx={{
                                        width: '100%',
                                        px: { xs: 0, sm: 2 },
                                        mt: -6,
                                    }}>
                                        {questions[currentQuestion].component(
                                            formData[questions[currentQuestion].field],
                                            questions[currentQuestion].field === 'triggers'
                                                ? handleCheckboxChange
                                                : handleChange // Use handleChange for health_issues
                                        )}
                                    </Box>
                                )}
                            </Box>

                            {/* Navigation Buttons */}
                            <Box sx={{ mt: 1 }}>
                                <QuizNavigationButtons
                                    currentQuestion={currentQuestion}
                                    questionsLength={questions.length}
                                    submitting={submitting}
                                    onPrevious={handlePrevious}
                                    onNext={handleNext}
                                />
                            </Box>
                        </>
                    ) : (
                        // Results display
                        <Fade in={!showForm} timeout={500}>
                            <Box sx={{ width: '100%' }}>
                                <SmokingHabitsResult data={result} />
                                <Box sx={{
                                    mt: 4,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: 'center'
                                }}>
                                    <button
                                        onClick={handleRetakeQuiz}
                                        className="btn btn-outline"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid #3f332b',
                                            color: '#3f332b',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            width: isMobile ? '100%' : 'auto',
                                            justifyContent: isMobile ? 'center' : 'flex-start'
                                        }}
                                    >
                                        <RefreshIcon style={{ marginRight: '8px' }} />
                                        Retake Assessment
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="btn btn-primary"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            color: 'white',
                                            background: '#3f332b',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            boxShadow: '0 4px 0 rgba(63, 51, 43, 0.5)',
                                            width: isMobile ? '100%' : 'auto',
                                            justifyContent: isMobile ? 'center' : 'flex-start'
                                        }}
                                    >
                                        <HomeIcon style={{ marginRight: '8px' }} />
                                        Back to Homepage
                                    </button>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default SmokingQuiz;