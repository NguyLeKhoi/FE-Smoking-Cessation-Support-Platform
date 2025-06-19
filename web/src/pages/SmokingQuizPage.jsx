import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import {
    Typography,
    Box,
    Container,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Fade,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    health_issues: []
};

// Form state reducer
const formReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'UPDATE_TRIGGERS':
            return {
                ...state,
                triggers: action.checked
                    ? [...state.triggers, action.value]
                    : state.triggers.filter((t) => t !== action.value)
            };
        case 'UPDATE_HEALTH_ISSUES':
            return {
                ...state,
                health_issues: action.checked
                    ? [...state.health_issues, action.value]
                    : state.health_issues.filter((issue) => issue !== action.value)
            };
        case 'RESET':
            return defaultState;
        case 'INITIALIZE':
            return action.data;
        default:
            return state;
    }
};

// Button styles 
const buttonStyles = {
    base: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: 500,
        cursor: 'pointer',
    },
    outline: {
        border: '1px solid #3f332b',
        color: '#3f332b',
        background: 'transparent',
    },
    primary: {
        border: 'none',
        color: 'white',
        background: '#3f332b',
        boxShadow: '0 4px 0 rgba(63, 51, 43, 0.5)',
    }
};

/**
 * assessing user's smoking habits
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

    // Create a function to show toast notifications
    const showToast = useCallback((message, type = 'error') => {
        const toastOptions = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };

        switch (type) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'info':
                toast.info(message, toastOptions);
                break;
            case 'warning':
                toast.warning(message, toastOptions);
                break;
            case 'error':
            default:
                toast.error(message, toastOptions);
                break;
        }
    }, []);

    /**
     * Generic field change handler
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
     * Handles checkbox changes for health issues
     */
    const handleHealthIssuesChange = useCallback((e) => {
        const { value, checked } = e.target;
        dispatch({ type: 'UPDATE_HEALTH_ISSUES', value, checked });
    }, []);

    /**
     * Determines the appropriate handler based on field type
     */
    const getFieldHandler = useCallback((fieldName) => {
        if (fieldName === 'triggers') return handleCheckboxChange;
        return handleChange;
    }, [handleChange, handleCheckboxChange]);

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
                const errorMsg = `Please select at least one smoking trigger before continuing.`;
                setError(errorMsg);
                showToast(errorMsg);
                return false;
            }
            return true;
        }

        // Validate other required fields
        if (!formData[currentField]) {
            const errorMsg = `Please select an option before continuing.`;
            setError(errorMsg);
            showToast(errorMsg);
            return false;
        }

        return true;
    }, [currentQuestion, formData, questions, showToast]);

    /**
     * Creates data object for API submission
     */
    const prepareDataForSubmission = useCallback(() => {
        return {
            cigarettes_per_pack: Number(formData.cigarettes_per_pack),
            price_per_pack: Number(formData.price_per_pack),
            cigarettes_per_day: Number(formData.cigarettes_per_day),
            smoking_years: Math.round(Number(formData.smoking_years)),
            triggers: formData.triggers,
            health_issues: formData.health_issues || []
        };
    }, [formData]);

    /**
     * Handles form submission
     */
    const handleSubmit = useCallback(async () => {
        try {
            // Basic validation for required fields
            const requiredFields = ['cigarettes_per_day', 'smoking_years', 'price_per_pack', 'cigarettes_per_pack'];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0 || !formData.triggers?.length) {
                const errorMsg = 'Please fill in all required fields before submitting the assessment.';
                setError(errorMsg);
                showToast(errorMsg);
                return;
            }

            // Set UI states for submission
            setSubmitting(true);
            setLoading(true);
            setError(null);

            // Format data for API submission
            const dataToSubmit = prepareDataForSubmission();
            console.log('User data being submitted:', dataToSubmit);

            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                // Submit data to API and get result
                const resultData = await smokingService.createSmokingHabit(dataToSubmit);

                // Create combined result object
                const calculatedDailyCost = (
                    (Number(dataToSubmit.cigarettes_per_day) / Number(dataToSubmit.cigarettes_per_pack)) *
                    Number(dataToSubmit.price_per_pack)
                );

                // Set the result using user's submitted data as the base
                setResult({
                    ...dataToSubmit,
                    ai_feedback: resultData?.ai_feedback || '',
                    created_at: resultData?.created_at || new Date().toISOString(),
                    daily_cost: resultData?.daily_cost || calculatedDailyCost
                });

                // Show success toast
                showToast('Assessment completed successfully!', 'success');

            } catch (apiError) {
                console.error('API error, proceeding with submitted data:', apiError);
                // If API fails, still show results with user data
                setResult({
                    ...dataToSubmit,
                    ai_feedback: "We couldn't generate personalized feedback at this time, but here's your smoking assessment based on the data you provided."
                });

                // Show warning toast for API issue
                showToast("We couldn't connect to our AI service, but your assessment is still available.", 'warning');
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
                showToast(errorMessage);
            } else {
                const errorMsg = 'There was an error submitting your assessment. Please try again.';
                setError(errorMsg);
                showToast(errorMsg);
            }
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    }, [formData, prepareDataForSubmission, showToast]);

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
     * Process health issues data from API
     */
    const processHealthIssues = useCallback((data) => {
        if (!data.health_issues) return [];

        if (Array.isArray(data.health_issues)) {
            return data.health_issues;
        }

        if (typeof data.health_issues === 'string') {
            try {
                const parsed = JSON.parse(data.health_issues);
                return Array.isArray(parsed) ? parsed : [data.health_issues];
            } catch (e) {
                return [data.health_issues];
            }
        }

        return [];
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
                        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
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
                            health_issues: processHealthIssues(latestRecord)
                        }
                    });

                    setResult(latestRecord);
                    setShowForm(false);

                    // Show success toast when previous assessment is loaded
                    showToast('Your previous assessment has been loaded.', 'info');
                } else {
                    dispatch({ type: 'RESET' });
                    setShowForm(true);
                    setResult(null);
                }
            } catch (err) {
                console.error("Error fetching smoking habits:", err);
                const errorMsg = "Failed to load your previous data. Please complete the assessment.";
                setError(errorMsg);
                showToast(errorMsg);
                setShowForm(true);
            } finally {
                setLoading(false);
            }
        };

        fetchExistingData();
    }, [quizCompleted, processHealthIssues, showToast]);

    /**
     * Control body overflow based on form/results display
     */
    useEffect(() => {
        // Document body overflow handling for modal-like behavior
        if (showForm) {
            document.body.style.overflow = 'hidden';
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
                bgcolor: '#ffffff'
            }}>
                <CircularProgress size={40} sx={{ color: '#3f332b' }} />
            </Box>
        );
    }

    // Get the current question text
    const currentQuestionText = questions[currentQuestion]?.question || '';

    // Render appropriate content based on form/results view
    const renderContent = () => {
        if (showForm) {
            return (
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
                        {/* Chat Bubble with question */}
                        <QuizChatBubble
                            questionText={currentQuestionText}
                            submitting={submitting}
                        />

                        {/* Question options */}
                        {!submitting && (
                            <Box sx={{
                                width: '100%',
                                px: { xs: 0, sm: 2 },
                                mt: -6,
                            }}>
                                {questions[currentQuestion].component(
                                    formData[questions[currentQuestion].field],
                                    getFieldHandler(questions[currentQuestion].field)
                                )}
                            </Box>
                        )}
                    </Box>

                    {/* Navigation Buttons */}
                    <Box sx={{
                        mt: 1,
                        mb: 3,
                        width: '100%',
                        position: 'relative'
                    }}>
                        <QuizNavigationButtons
                            currentQuestion={currentQuestion}
                            questionsLength={questions.length}
                            submitting={submitting}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                    </Box>
                </>
            );
        }

        // Results view
        return (
            <Fade in={!showForm} timeout={500}>
                <Box sx={{ width: '100%', bgcolor: '#ffffff' }}>
                    <Box sx={{
                        py: 4,
                        px: { xs: 2, md: 0 },
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'visible',
                    }}>
                        <SmokingHabitsResult data={result} />

                        {/* Action buttons */}
                        <Box sx={{
                            mt: 4,
                            mb: 4,
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center'
                        }}>
                            <button
                                onClick={handleRetakeQuiz}
                                style={{
                                    ...buttonStyles.base,
                                    ...buttonStyles.outline,
                                    width: isMobile ? '100%' : 'auto',
                                    justifyContent: isMobile ? 'center' : 'flex-start'
                                }}
                            >
                                <RefreshIcon style={{ marginRight: '8px' }} />
                                Retake Assessment
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    ...buttonStyles.base,
                                    ...buttonStyles.primary,
                                    width: isMobile ? '100%' : 'auto',
                                    justifyContent: isMobile ? 'center' : 'flex-start'
                                }}
                            >
                                <HomeIcon style={{ marginRight: '8px' }} />
                                Back to Homepage
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#ffffff',
            // Add padding at the bottom
            pb: { xs: 2, sm: 4 }
        }}>
            {/* Add ToastContainer at the root level */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

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
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#ffffff'
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
                        marginRight: 'auto',
                        bgcolor: '#ffffff',
                    }}
                >
                    {/* Render form or results based on showForm state */}
                    {renderContent()}
                </Container>
            </Box>
        </Box>
    );
};

export default SmokingQuiz;