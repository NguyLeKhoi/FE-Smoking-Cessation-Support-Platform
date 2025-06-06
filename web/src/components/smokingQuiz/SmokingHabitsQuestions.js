import React from 'react';
import {
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';

const SmokingHabitsQuestions = () => {
    const questions = [
        {
            id: 1,
            question: 'How many cigarettes do you smoke each day?',
            field: 'cigarettes_per_day',
            component: (value, onChange) => (
                <TextField
                    fullWidth
                    type="number"
                    name="cigarettes_per_day"
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    required
                    min={0}
                    inputProps={{ min: 0 }}
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
        },
        {
            id: 2,
            question: 'How many cigarettes are in a pack that you usually buy?',
            field: 'cigarettes_per_pack',
            component: (value, onChange) => (
                <TextField
                    fullWidth
                    type="number"
                    name="cigarettes_per_pack"
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    required
                    min={1}
                    inputProps={{ min: 1 }}
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
        },
        {
            id: 3,
            question: 'What is the average price you pay for a pack of cigarettes? (in $)',
            field: 'price_per_pack',
            component: (value, onChange) => (
                <TextField
                    fullWidth
                    type="number"
                    name="price_per_pack"
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    required
                    min={0}
                    step="0.01"
                    inputProps={{ min: 0, step: 0.01 }}
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
        },
        {
            id: 4,
            question: 'How many years have you been smoking?',
            field: 'smoking_years',
            component: (value, onChange) => (
                <TextField
                    fullWidth
                    type="number"
                    name="smoking_years"
                    value={value}
                    onChange={onChange}
                    variant="outlined"
                    required
                    min={0}
                    inputProps={{ min: 0 }}
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