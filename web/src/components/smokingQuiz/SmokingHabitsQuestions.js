import React from 'react';
import {
    TextField,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Typography
} from '@mui/material';

// Extract common styles to reuse across components
const optionBoxStyles = (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    p: 2,
    mb: 1.5,
    borderRadius: '12px',
    border: '1px solid',
    borderColor: isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
    bgcolor: isSelected ? 'rgba(0, 0, 0, 0.03)' : 'background.paper',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.24)',
        bgcolor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    }
});

const circleIndicatorStyles = (isSelected) => ({
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mr: 2,
    bgcolor: isSelected ? '#3f332b' : 'rgba(0, 0, 0, 0.08)',
    color: isSelected ? '#ffffff' : 'text.secondary',
    fontWeight: 'bold'
});

// Create reusable option selection component
const SelectableOption = ({ option, index, value, field, onChange }) => (
    <Box
        key={index}
        onClick={() => {
            const event = { target: { name: field, value: option.value } };
            onChange(event);
        }}
        sx={optionBoxStyles(value === option.value)}
    >
        <Box sx={circleIndicatorStyles(value === option.value)}>
            {String.fromCharCode(65 + index)}
        </Box>
        <Typography variant="body1" sx={{ fontWeight: value === option.value ? 600 : 400 }}>
            {option.label}
        </Typography>
    </Box>
);

const SmokingHabitsQuestions = () => {
    // Define common option sets for reuse
    const cigarettesPerDayOptions = [
        { label: '1–5 cigarettes', value: '3' },
        { label: '6–10 cigarettes', value: '8' },
        { label: '11–15 cigarettes', value: '12' },
        { label: 'More than 15 cigarettes', value: '18' },
    ];

    const cigarettesPerPackOptions = [
        { label: '10 cigarettes (small pack)', value: '10' },
        { label: '20 cigarettes (regular pack)', value: '20' },
        { label: '25 or more cigarettes (large pack)', value: '25' },
        { label: 'I don\'t pay attention / I  don\'t buy cigarettes', value: '15' }
    ];

    const pricePerPackOptions = [
        { label: 'Less than $3', value: '2' },
        { label: '$3 – $5', value: '4' },
        { label: '$6 – $8', value: '7' },
        { label: 'More than $8', value: '10' }
    ];

    const smokingYearsOptions = [
        { label: 'Less than 1 year', value: '0.5' },
        { label: '1–5 years', value: '3' },
        { label: '6–10 years', value: '8' },
        { label: 'More than 10 years', value: '15' }
    ];

    const smokingTriggers = [
        'Stress',
        'After meals',
        'Social situations',
        'Boredom',
        'Alcohol consumption'
    ];

    const healthIssuesList = [
        'Persistent cough',
        'Shortness of breath',
        'Chest pain',
        'Frequent respiratory infections',
        'Gum disease or tooth loss',
        'Reduced sense of taste or smell',
        'Fatigue or low energy',
        'No, I haven\'t experienced any health issues'
    ];

    const questions = [
        {
            id: 1,
            question: 'How many cigarettes do you smoke a day?',
            field: 'cigarettes_per_day',
            component: (value, onChange) => (
                <Box sx={{ mt: 1 }}>
                    {cigarettesPerDayOptions.map((option, index) => (
                        <SelectableOption
                            key={option.value}
                            option={option}
                            index={index}
                            value={value}
                            field="cigarettes_per_day"
                            onChange={onChange}
                        />
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
                    {cigarettesPerPackOptions.map((option, index) => (
                        <SelectableOption
                            key={option.value}
                            option={option}
                            index={index}
                            value={value}
                            field="cigarettes_per_pack"
                            onChange={onChange}
                        />
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
                    {pricePerPackOptions.map((option, index) => (
                        <SelectableOption
                            key={option.value}
                            option={option}
                            index={index}
                            value={value}
                            field="price_per_pack"
                            onChange={onChange}
                        />
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
                    {smokingYearsOptions.map((option, index) => (
                        <SelectableOption
                            key={option.value}
                            option={option}
                            index={index}
                            value={value}
                            field="smoking_years"
                            onChange={onChange}
                        />
                    ))}
                </Box>
            )
        },
        {
            id: 5,
            question: 'When are you most likely to smoke? (Select all that apply)',
            field: 'triggers',
            component: (value, onChange) => (
                <FormControl component="fieldset" fullWidth>
                    <FormGroup data-field="triggers">
                        {smokingTriggers.map((trigger) => (
                            <FormControlLabel
                                key={trigger}
                                control={
                                    <Checkbox
                                        checked={Array.isArray(value) && value.includes(trigger)}
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
                    value={value || ''}
                    onChange={(e) => {
                        // Ensure we pass a properly formatted event object
                        const event = {
                            target: {
                                name: 'health_issues',
                                value: e.target.value
                            }
                        };
                        onChange(event);
                    }}
                    placeholder="e.g. coughing, shortness of breath, reduced stamina"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.12)' },
                            '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.24)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        }
                    }}
            />
            )
        }
    ];

    return { questions };
};

export default SmokingHabitsQuestions;