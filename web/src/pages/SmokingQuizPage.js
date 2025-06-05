// Smoking Habit Quiz - Frontend (React)

import React, { useState } from 'react';
import { 
    Typography, 
    Box, 
    TextField, 
    Button, 
    FormControl, 
    FormGroup,
    FormControlLabel, 
    Checkbox, 
    Container 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import smokingService from '../services/smokingService';
import SmokingHabitsResult from '../components/smokingQuiz/SmokingHabitsResult';

const SmokingQuiz = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        cigarettes_per_pack: 20,
        price_per_pack: 5.99,
        cigarettes_per_day: '',
        smoking_years: '',
        triggers: [],
        health_issues: ''
    });

    const [result, setResult] = useState(null);
    const [showForm, setShowForm] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const updatedTriggers = checked
            ? [...formData.triggers, value]
            : formData.triggers.filter((t) => t !== value);
        setFormData({ ...formData, triggers: updatedTriggers });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate form data before submitting
            if (!formData.cigarettes_per_day || !formData.smoking_years) {
                console.error('Please fill in all required fields');
                return;
            }
            
            // Make sure triggers is an array (even if empty)
            const dataToSubmit = {
                ...formData,
                // Convert string values to numbers
                cigarettes_per_day: Number(formData.cigarettes_per_day),
                smoking_years: Number(formData.smoking_years),
                price_per_pack: Number(formData.price_per_pack),
                cigarettes_per_pack: Number(formData.cigarettes_per_pack)
            };
            
            const data = await smokingService.createSmokingHabit(dataToSubmit);
            setResult(data);
            setShowForm(false); // Hide the form after submission
        } catch (error) {
            console.error('Error:', error);
            
            // Display more specific error information
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request setup error:', error.message);
            }
        }
    };

    const handleRetakeQuiz = () => {
        setShowForm(true);
        setResult(null);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#f6f5f3',
            py: 4,
        }}>
            <Container maxWidth="md">
                {showForm ? (
                    <Box
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            bgcolor: '#ffffff',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                            mb: 4
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
                            Let's understand your smoking habits to help you quit
                        </Typography>
                        
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 'medium',
                                        color: 'text.primary'
                                    }}
                                >
                                    How many cigarettes do you smoke each day?
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="cigarettes_per_day"
                                    value={formData.cigarettes_per_day}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'background.paper',
                                            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                                            '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'text.secondary',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            color: 'text.primary',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 'medium',
                                        color: 'text.primary'
                                    }}
                                >
                                    How many years have you been smoking?
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="smoking_years"
                                    value={formData.smoking_years}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'background.paper',
                                            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                                            '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'text.secondary',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            color: 'text.primary',
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 'medium',
                                        color: 'text.primary'
                                    }}
                                >
                                    When are you most likely to smoke? (Select all that apply)
                                </Typography>
                                <FormControl component="fieldset">
                                    <FormGroup>
                                        {['Stress', 'After meals', 'Social situations', 'Boredom', 'Alcohol consumption'].map((trigger) => (
                                            <FormControlLabel
                                                key={trigger}
                                                control={
                                                    <Checkbox 
                                                        checked={formData.triggers.includes(trigger)} 
                                                        onChange={handleCheckboxChange} 
                                                        value={trigger}
                                                        sx={{
                                                            color: 'rgba(0, 0, 0, 0.6)',
                                                            '&.Mui-checked': {
                                                                color: '#000000',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={trigger}
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    '& .MuiFormControlLabel-label': {
                                                        fontSize: '0.95rem',
                                                    }
                                                }}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 'medium',
                                        color: 'text.primary'
                                    }}
                                >
                                    Have you experienced any health issues due to smoking?
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="health_issues"
                                    value={formData.health_issues}
                                    onChange={handleChange}
                                    placeholder="e.g. coughing, shortness of breath"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'background.paper',
                                            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                                            '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: 'text.secondary',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            color: 'text.primary',
                                        },
                                    }}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    mt: 4,
                                    mb: 2,
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
                                Submit Assessment
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
