import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button
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
    backgroundColor: active ? theme.palette.grey[800] : '#fff',
    color: active ? '#fff' : theme.palette.grey[600],
    boxShadow: active ? theme.shadows[4] : theme.shadows[2],
    '&:hover': {
        backgroundColor: active ? theme.palette.grey[700] : theme.palette.grey[100],
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[6],
    },
}));

const FeatureSection = () => {
    const [activeSlide, setActiveSlide] = useState('guided-meditations');
    const [direction, setDirection] = useState(0);
    const [previousSlide, setPreviousSlide] = useState('guided-meditations');

    const navigationItems = [
        { id: 'online-therapy', label: 'Online therapy' },
        { id: 'guided-meditations', label: 'Guided meditations' },
        { id: 'ai-guidance', label: 'AI guidance' },
        { id: 'sleep-resources', label: 'Sleep resources' },
        { id: 'expert-programs', label: 'Expert-led programs' },
    ];

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

    const slideContent = {
        'online-therapy': {
            title: 'Professional Online Therapy',
            subtitle: 'Connect with licensed therapists',
            description: 'Get personalized support from certified mental health professionals through secure video sessions, messaging, and phone calls.',
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            features: ['Licensed therapists', '24/7 availability', 'Secure sessions', 'Personalized treatment']
        },
        'guided-meditations': {
            title: 'Feel-good library',
            subtitle: 'Explore 1,000+ guided meditations',
            description: 'Explore 1,000+ guided meditations for feeling more relaxed — ad-free and always there. Try one for yourself.',
            bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            features: ['1,000+ meditations', 'Ad-free experience', 'Always available', 'Expert-guided']
        },
        'ai-guidance': {
            title: 'AI-Powered Support',
            subtitle: 'Intelligent mental health assistance',
            description: 'Get instant support with our AI-powered chatbot that provides personalized recommendations and coping strategies.',
            bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            features: ['24/7 AI support', 'Personalized tips', 'Instant responses', 'Evidence-based']
        },
        'sleep-resources': {
            title: 'Better Sleep Solutions',
            subtitle: 'Improve your sleep quality',
            description: 'Access sleep stories, soundscapes, and bedtime routines designed to help you fall asleep faster and sleep better.',
            bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            features: ['Sleep stories', 'Calming sounds', 'Sleep tracking', 'Bedtime routines']
        },
        'expert-programs': {
            title: 'Expert-Led Programs',
            subtitle: 'Structured mental health courses',
            description: 'Join comprehensive programs designed by mental health experts to address specific challenges and build resilience.',
            bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            features: ['Expert-designed', 'Structured courses', 'Progress tracking', 'Community support']
        }
    };

    const currentSlide = slideContent[activeSlide];

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    align="center"
                    sx={{
                        mb: 6,
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '2rem', md: '3.5rem' }
                    }}
                >
                    Why choose Zerotine
                </Typography>

                {/* Navigation Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    mb: 4,
                    px: 2
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
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <FeatureSlide
                        slideContent={currentSlide}
                        activeSlide={activeSlide}
                        direction={direction}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default FeatureSection;