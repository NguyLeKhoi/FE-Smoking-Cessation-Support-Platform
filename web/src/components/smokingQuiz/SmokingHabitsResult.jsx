import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SavingsIcon from '@mui/icons-material/Savings';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SmokingHabitsQuestions from './SmokingHabitsQuestions';

const SmokingHabitsResult = ({ data }) => {
    // Get questions to reference fields and labels
    const { questions } = SmokingHabitsQuestions();

    if (!data) return null;

    // Ensure we're working with the correct data structure
    console.log("Raw result data:", data);

    // Get data from the right location in the response
    const smokingData = data.data || data; // Handle both {data: {...}} and direct object format

    // Access fields with proper error handling
    const cigarettesPerDay = parseFloat(smokingData.cigarettes_per_day);
    const smokingYears = parseFloat(smokingData.smoking_years);
    const pricePerPack = parseFloat(smokingData.price_per_pack);
    const cigarettesPerPack = parseFloat(smokingData.cigarettes_per_pack);
    const triggers = Array.isArray(smokingData.triggers) ? smokingData.triggers : [];
    const healthIssues = Array.isArray(smokingData.health_issues)
        ? smokingData.health_issues
        : (smokingData.health_issues ? [smokingData.health_issues] : []);
    const aiFeedback = smokingData.ai_feedback || "";

    // Calculate lifetime cigarettes
    const lifetimeCigarettes = cigarettesPerDay * 365 * smokingYears;

    // Calculate annual cost
    const annualCost = (cigarettesPerDay / cigarettesPerPack) * pricePerPack * 365;

    // Calculate lifetime cost
    const lifetimeCost = annualCost * smokingYears;

    // Calculate time spent smoking (assuming 5 minutes per cigarette)
    const minutesPerDay = cigarettesPerDay * 5;
    const daysSpentSmoking = (minutesPerDay * 365 * smokingYears) / (60 * 24);

    // Format AI feedback with paragraph breaks
    const formattedAiFeedback = aiFeedback ?
        aiFeedback.split('\n\n').map((paragraph, index) => (
            <Typography key={index} variant="body1" paragraph>
                {paragraph}
            </Typography>
        )) : null;

    return (
        <Box>
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary'
                }}
            >
                Your Smoking Impact Assessment
            </Typography>

            {aiFeedback && (
                <Box sx={{ mb: 5, width: '100%' }}>
                    <Accordion
                        defaultExpanded={true} // Start expanded to show the important feedback
                        elevation={0}
                        sx={{
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            '&:before': {
                                display: 'none',
                            },
                            overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="ai-feedback-content"
                            id="ai-feedback-header"
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                borderBottom: '1px solid',
                                borderBottomColor: expanded => expanded ? 'divider' : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary'
                                }}
                            >
                                Personalized Feedback
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: { xs: 3, md: 4 } }}>
                            <Box sx={{
                                pl: 1,
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap',
                                width: '100%',
                                height: 'auto',
                                overflow: 'visible'
                            }}>
                                {aiFeedback.split('\n\n').map((paragraph, index) => (
                                    <Typography
                                        key={index}
                                        variant="body1"
                                        paragraph
                                        sx={{
                                            mb: 2,
                                            lineHeight: 1.7,
                                            width: '100%',
                                            display: 'block'
                                        }}
                                    >
                                        {paragraph}
                                    </Typography>
                                ))}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            )}

            <Typography
                variant="body1"
                sx={{ mb: 4, color: 'text.secondary' }}
            >
                Based on your smoking habits, we've calculated the impact on your health, finances, and time.
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                {/* Each grid item will have exactly the same width */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            minHeight: '240px',
                            width: '100%',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <LocalFireDepartmentIcon
                            sx={{
                                fontSize: 48,
                                color: '#f97316',
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                            {Math.round(lifetimeCigarettes).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Cigarettes smoked in your lifetime
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3} sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            minHeight: '240px',
                            width: '100%', // Ensure paper takes full width of grid item
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box'
                        }}
                    >
                        <SavingsIcon
                            sx={{
                                fontSize: 48,
                                color: '#10b981',
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                            ${Math.round(lifetimeCost).toLocaleString()}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lifetime spending on cigarettes
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3} sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            minHeight: '240px',
                            width: '100%', // Ensure paper takes full width of grid item
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box' // Include padding in element's dimensions
                        }}
                    >
                        <AccessTimeIcon
                            sx={{
                                fontSize: 48,
                                color: '#6366f1',
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                            {daysSpentSmoking.toFixed(1)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Days spent smoking
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3} sx={{ width: { xs: '100%', sm: '50%', md: '40%' } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            height: '100%',
                            minHeight: '240px',
                            width: '100%',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxSizing: 'border-box'
                        }}
                    >
                        <HealthAndSafetyIcon
                            sx={{
                                fontSize: 48,
                                color: '#ef4444',
                                mb: 2
                            }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.2 }}>
                            {Math.round(cigarettesPerDay * 11)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Minutes of life lost per day
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: 'text.primary'
                    }}
                >
                    Your Smoking Triggers
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    {triggers && triggers.length > 0 ? (
                        <Grid container spacing={2}>
                            {triggers.map((trigger, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                mr: 2
                                            }}
                                        />
                                        <Typography variant="body1">{trigger}</Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No specific triggers identified.
                        </Typography>
                    )}
                </Paper>
            </Box>

            {healthIssues.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary'
                        }}
                    >
                        Health Concerns
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="body1">
                            {healthIssues.join(', ')}
                        </Typography>
                    </Paper>
                </Box>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: 'text.primary'
                    }}
                >
                    Next Steps
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <Typography variant="body1" paragraph>
                        Based on your assessment, here are some recommendations:
                    </Typography>

                    <Box component="ul" sx={{ pl: 2 }}>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1">
                                Consider setting a quit date within the next 30 days.
                            </Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1">
                                Explore nicotine replacement therapies that could help with withdrawal symptoms.
                            </Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1">
                                Join our community support group to connect with others on their quitting journey.
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1">
                                Download our app to track your progress and celebrate milestones.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* shows the original answers */}
            <Box sx={{ mt: 6, mb: 4 }}>
                <Accordion
                    elevation={0}
                    sx={{
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:before': {
                            display: 'none',
                        },
                        overflow: 'hidden'
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="assessment-answers-content"
                        id="assessment-answers-header"
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            borderBottom: '1px solid',
                            borderBottomColor: expanded => expanded ? 'divider' : 'transparent',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            Your Assessment Answers
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                        {questions.map(question => (
                            <Box key={question.id} sx={{
                                mb: 2,
                                pb: 2,
                                borderBottom: question.id !== questions.length ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'
                            }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {question.question}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    {question.field === 'triggers'
                                        ? (triggers.length > 0 ? triggers.join(', ') : 'None selected')
                                        : smokingData[question.field] || 'Not provided'}
                                </Typography>
                            </Box>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    );
};

export default SmokingHabitsResult;