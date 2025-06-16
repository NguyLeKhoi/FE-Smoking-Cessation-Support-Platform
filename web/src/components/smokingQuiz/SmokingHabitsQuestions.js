import React from 'react';
import {
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box
} from '@mui/material';
import { Typography } from '@mui/material';

const SmokingHabitsQuestions = () => {
    const questions = [
        {
            id: 1,
            question: 'How many cigarettes do you smoke a day?',
            field: 'cigarettes_per_day',
            component: (value, onChange) => (
                <Box sx={{ mt: 1 }}>
                    {[
                        { label: '1–5 cigarettes', value: '3' },
                        { label: '6–10 cigarettes', value: '8' },
                        { label: '11–15 cigarettes', value: '12' },
                        { label: 'More than 15 cigarettes', value: '18' },
                    ].map((option, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                const event = { target: { name: 'cigarettes_per_day', value: option.value } };
                                onChange(event);
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                mb: 1.5,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                                bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.03)' : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
                                    bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    bgcolor: value === option.value ? '#3f332b' : 'rgba(0, 0, 0, 0.08)',
                                    color: value === option.value ? '#ffffff' : 'text.secondary',
                                    fontWeight: 'bold'
                                }}
                            >
                                {String.fromCharCode(65 + index)}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: value === option.value ? 600 : 400 }}>
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )
        },
        {
            id: 2,
            question: 'How many cigarettes are in a pack that you usually buy?',
            field: 'cigarettes_per_pack',
            component: (value, onChange) => (
                <Box sx={{ mt: 1 }}>
                    {[
                        { label: '10 cigarettes (small pack)', value: '10' },
                        { label: '20 cigarettes (regular pack)', value: '20' },
                        { label: '25 or more cigarettes (large pack)', value: '25' },
                        { label: 'I don\'t pay attention / I  don\'t buy cigarettes', value: '15' } // Default to 20 for calculation purposes
                    ].map((option, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                const event = { target: { name: 'cigarettes_per_pack', value: option.value } };
                                onChange(event);
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                mb: 1.5,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                                bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.03)' : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
                                    bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    bgcolor: value === option.value ? '#3f332b' : 'rgba(0, 0, 0, 0.08)',
                                    color: value === option.value ? '#ffffff' : 'text.secondary',
                                    fontWeight: 'bold'
                                }}
                            >
                                {String.fromCharCode(65 + index)}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: value === option.value ? 600 : 400 }}>
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )
        },
        {
            id: 3,
            question: 'What is the average price you pay for a pack of cigarettes? (in $)',
            field: 'price_per_pack',
            component: (value, onChange) => (
                <Box sx={{ mt: 1 }}>
                    {[
                        { label: 'Less than $3', value: '2' },
                        { label: '$3 – $5', value: '4' },
                        { label: '$6 – $8', value: '7' },
                        { label: 'More than $8', value: '10' }
                    ].map((option, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                const event = { target: { name: 'price_per_pack', value: option.value } };
                                onChange(event);
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                mb: 1.5,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                                bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.03)' : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
                                    bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    bgcolor: value === option.value ? '#3f332b' : 'rgba(0, 0, 0, 0.08)',
                                    color: value === option.value ? '#ffffff' : 'text.secondary',
                                    fontWeight: 'bold'
                                }}
                            >
                                {String.fromCharCode(65 + index)}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: value === option.value ? 600 : 400 }}>
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )
        },
        {
            id: 4,
            question: 'How many years have you been smoking?',
            field: 'smoking_years',
            component: (value, onChange) => (
                <Box sx={{ mt: 1 }}>
                    {[
                        { label: 'Less than 1 year', value: '0.5' },
                        { label: '1–5 years', value: '3' },
                        { label: '6–10 years', value: '8' },
                        { label: 'More than 10 years', value: '15' }
                    ].map((option, index) => (
                        <Box
                            key={index}
                            onClick={() => {
                                const event = { target: { name: 'smoking_years', value: option.value } };
                                onChange(event);
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                mb: 1.5,
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                                bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.03)' : 'background.paper',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: value === option.value ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
                                    bgcolor: value === option.value ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    bgcolor: value === option.value ? '#3f332b' : 'rgba(0, 0, 0, 0.08)',
                                    color: value === option.value ? '#ffffff' : 'text.secondary',
                                    fontWeight: 'bold'
                                }}
                            >
                                {String.fromCharCode(65 + index)}
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: value === option.value ? 600 : 400 }}>
                                {option.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )
        },
        {
            id: 5,
            question: 'When are you most likely to smoke? (Select all that apply)',
            field: 'triggers',
            component: (value, onChange) => (
                <FormControl component="fieldset">
                    <FormGroup>
                        {['Stress', 'After meals', 'Social situations', 'Boredom', 'Alcohol consumption'].map((trigger) => (
                            <FormControlLabel
                                key={trigger}
                                control={
                                    <Checkbox
                                        checked={value.includes(trigger)}
                                        onChange={onChange}
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
            )
        },
        {
            id: 6,
            question: 'Have you experienced any health issues due to smoking?',
            field: 'health_issues',
            component: (value, onChange) => (
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="health_issues"
                    value={value}
                    onChange={onChange}
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
            )
        }
    ];

    return { questions };
};

export default SmokingHabitsQuestions;