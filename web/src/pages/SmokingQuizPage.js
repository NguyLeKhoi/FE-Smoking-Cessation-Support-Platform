// Smoking Habit Quiz - Frontend (React)

import React, { useState } from 'react';
import { 
    Typography, 
    Box, 
    Paper, 
    TextField, 
    Button, 
    FormControl, 
    FormGroup,
    FormControlLabel, 
    Checkbox, 
    Container 
} from '@mui/material';
import smokingService from '../services/smokingService';

const SmokingQuiz = () => {
    const [formData, setFormData] = useState({
        cigarettes_per_pack: 20,
        price_per_pack: 5.99,
        cigarettes_per_day: '',
        smoking_years: '',
        triggers: [],
        health_issues: ''
    });

    const [result, setResult] = useState(null);

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
            const data = await smokingService.createSmokingHabit(formData);
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            py: 4
        }}>
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        bgcolor: 'section.light',
                        border: '1px solid',
                        borderColor: 'divider',
                        mb: 4
                    }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            mb: 4,
                            color: 'text.primary'
                        }}
                    >
                        Smoking Habit Assessment
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
                                InputProps={{
                                    sx: { borderRadius: 2 }
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
                                InputProps={{
                                    sx: { borderRadius: 2 }
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
                                                        color: 'text.secondary',
                                                        '&.Mui-checked': {
                                                            color: 'primary.main',
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
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                py: 1.5,
                                px: 4,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    boxShadow: '0 2px 0 rgba(0,0,0,0.2)',
                                    transform: 'translateY(2px)',
                                },
                                '&:active': {
                                    boxShadow: '0 0 0 rgba(0,0,0,0.2)',
                                    transform: 'translateY(4px)',
                                },
                            }}
                        >
                            Submit Assessment
                        </Button>
                    </Box>
                </Paper>

                {result && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            bgcolor: 'section.light',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 'bold', 
                                mb: 3,
                                color: 'text.primary'
                            }}
                        >
                            Your Smoking Habit Evaluation
                        </Typography>
                        
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'section.main', 
                            borderRadius: 2,
                            overflow: 'auto'
                        }}>
                            <pre style={{ 
                                margin: 0, 
                                fontFamily: 'monospace', 
                                fontSize: '0.9rem',
                                color: 'text.secondary'
                            }}>
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </Box>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default SmokingQuiz;
