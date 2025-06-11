import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';

const FeatureSection = () => {
    const features = [
        { title: 'Personalized Quit Plans', desc: 'Custom plans to reduce smoking step-by-step.', icon: 'plan-icon' },
        { title: 'Expert Coaching', desc: 'Connect with certified coaches for 1:1 support.', icon: 'coach-icon' },
        { title: 'Community Support', desc: 'Join a community to share your journey.', icon: 'community-icon' },
        { title: 'Track Achievements', desc: 'Earn badges and compete on leaderboards.', icon: 'achievement-icon' },
    ];

    return (
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'section.main' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" gutterBottom>Why Choose Zerotine?</Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {features.map((feature) => (
                        <Grid item xs={12} sm={6} md={3} key={feature.title}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Box sx={{ mb: 2 }}>{/* Add icon or Lottie */}</Box>
                                <Typography variant="h6">{feature.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{feature.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeatureSection;