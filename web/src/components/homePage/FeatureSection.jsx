import React, { useState, useEffect, useMemo } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FeatureSlide from './FeatureSlide';

const StyledNavButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    padding: '12px 24px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    margin: theme.spacing(0, 1, 1, 0),
    transition: 'all 0.3s ease',
    backgroundColor: active ? theme.palette.primary.main : '#fff',
    color: active ? '#fff' : theme.palette.primary.main,
    boxShadow: active ? theme.shadows[4] : theme.shadows[2],
    '&:hover': {
        backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[100],
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[6],
    },
}));

const FeatureSection = () => {
    const theme = useTheme();
    const [activeSlide, setActiveSlide] = useState('personalized-plans');
    const [direction, setDirection] = useState(0);
    const [previousSlide, setPreviousSlide] = useState('personalized-plans');

    const navigationItems = useMemo(() => [
        { id: 'personalized-plans', label: 'Personalized Plans' },
        { id: 'expert-coaching', label: 'Expert Coaching' },
        { id: 'community-support', label: 'Community Support' },
        { id: 'track-progress', label: 'Track Progress' },
        { id: 'health-benefits', label: 'Health Benefits' },
    ], []);

    // Extract just the IDs for slide ordering
    const slideOrder = useMemo(() => navigationItems.map(item => item.id), [navigationItems]);

    // Determine slide direction based on index
    useEffect(() => {
        if (previousSlide === activeSlide) return;

        const prevIndex = navigationItems.findIndex(item => item.id === previousSlide);
        const currIndex = navigationItems.findIndex(item => item.id === activeSlide);

        // Ensure direction is always exactly -1 or 1
        setDirection(prevIndex < currIndex ? 1 : -1);
        setPreviousSlide(activeSlide);
    }, [activeSlide, previousSlide, navigationItems]);

    const handleSlideChange = (slideId) => {
        if (slideId === activeSlide) return;

        const currentIndex = navigationItems.findIndex(item => item.id === activeSlide);
        const newIndex = navigationItems.findIndex(item => item.id === slideId);

        // Explicitly set direction based on navigation direction
        setDirection(currentIndex < newIndex ? 1 : -1);
        setActiveSlide(slideId);
    };

    // Updated slide content with backgroundColor instead of backgroundColor
    const slideContent = {
        'personalized-plans': {
            title: 'Personalized Quit Plans',
            subtitle: 'Custom strategies for your smoking habits',
            description: 'Get a personalized quit plan based on your smoking history, triggers, and lifestyle. Our step-by-step approach helps you gradually reduce smoking in a way that works for you.',
            backgroundColor: ' #fbd4bf',
            features: ['Custom reduction schedule', 'Trigger identification', 'Alternative strategies', 'Personalized milestones'],
            customAnimation: 'personalized-plan'
        },
        'expert-coaching': {
            title: 'Expert Coaching',
            subtitle: 'One-on-one support from cessation specialists',
            description: 'Connect with certified smoking cessation coaches who provide personalized guidance throughout your quitting journey. Access professional advice whenever you need extra support.',
            backgroundColor: ' #FFCFDF',
            features: ['Certified coaches', 'Video consultations', '24/7 messaging', 'Evidence-based strategies'],
            customAnimation: 'expert-coaching'
        },
        'community-support': {
            title: 'Community Support',
            subtitle: 'Connect with others on the same journey',
            description: 'Join a supportive community of people who understand exactly what you\'re going through. Share experiences, celebrate milestones, and get motivation when you need it most.',
            backgroundColor: ' #CAE8BD',
            features: ['Group forums', 'Success stories', 'Accountability partners', 'Live group sessions'],
            customAnimation: 'community-support'
        },
        'track-progress': {
            title: 'Progress Tracking',
            subtitle: 'Visualize your journey to becoming smoke-free',
            description: 'Track your progress with our intuitive tools that show health improvements, money saved, and cigarettes avoided. Earn badges and rewards that keep you motivated.',
            backgroundColor: ' #C6E7FF',
            features: ['Health timeline', 'Money saved calculator', 'Achievement badges', 'Streak tracking'],
            customAnimation: 'progress-tracking'
        },
        'health-benefits': {
            title: 'Your Health Timeline',
            subtitle: 'Watch your body recover in real-time',
            description: 'See how your body heals day by day after quitting smoking. Our health timeline shows you exactly what\'s improving, from circulation and lung function to reduced risk of disease.',
            backgroundColor: ' #CDC1FF',
            features: ['Daily health updates', 'Scientific explanations', 'Body system improvements', 'Long-term outlooks'],
            customAnimation: 'health-benefits'
        }
    };

    const currentSlide = slideContent[activeSlide];

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        mb: 5
                    }}
                >
                    Why you should choose Zerotine
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    mb: 4,
                    px: 2,
                    gap: 2
                }}>
                    {navigationItems.map((item) => (
                        <StyledNavButton
                            key={item.id}
                            active={activeSlide === item.id}
                            onClick={() => handleSlideChange(item.id)}
                        >
                            {item.label}
                        </StyledNavButton>
                    ))}
                </Box>

                {/* Slide Content with animation */}
                <Box sx={{
                    position: 'relative',
                    overflow: 'visible',
                    width: '100%',
                    pl: { xs: 0, md: 1 },
                    pr: { xs: 0, md: 1 },
                    mt: 4,
                    mb: 2
                }}>
                    <FeatureSlide
                        slideContent={currentSlide}
                        activeSlide={activeSlide}
                        direction={direction}
                        allSlides={slideContent}
                        slideOrder={slideOrder}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default FeatureSection;