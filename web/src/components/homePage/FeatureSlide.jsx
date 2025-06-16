import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

// import animations
const animationMap = {
    'personalized-plan': () => import('../../assets/animations/personalized-plan.json'),
    'expert-coaching': () => import('../../assets/animations/coaching.json'),
    'community-support': () => import('../../assets/animations/community.json'),
    'progress-tracking': () => import('../../assets/animations/progress.json'),
    'health-benefits': () => import('../../assets/animations/health.json')
};

// Styled components
const SlideContainer = styled(Paper)(({ theme, backgroundColor }) => ({
    minHeight: '500px',
    padding: theme.spacing(6, 4),
    borderRadius: '24px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    background: backgroundColor,

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 0,
    }
}));

const ContentBox = styled(Box)({
    position: 'relative',
    zIndex: 1,
});

const CTAButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5, 4),
    backgroundColor: '#000000',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 0 #00000080',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1.2rem',
    '&:hover': {
        backgroundColor: '#000000cd',
        boxShadow: '0 2px 0 #00000080',
        transform: 'translateY(2px)',
    },
    '&:active': {
        boxShadow: '0 0 0 #00000080',
        transform: 'translateY(4px)',
    },
}));

// Animation 
const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '95%' : '-95%',
        opacity: 0.4,
        scale: 0.9,
        transition: {
            x: { type: "tween", ease: "easeInOut", duration: 0.2 },
            opacity: { duration: 0.1 },
            scale: { duration: 0.1 }
        }
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: "tween", ease: "easeOut", duration: 0.3 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
        }
    },
    exit: (direction) => ({
        x: direction < 0 ? '95%' : '-95%',
        opacity: 0.4,
        scale: 0.9,
        transition: {
            x: { type: "tween", ease: "easeIn", duration: 0.2 },
            opacity: { duration: 0.1 },
            scale: { duration: 0.1 }
        }
    })
};

// Animation component with lazy loading
const LazyAnimation = ({ animationType }) => {
    const [animationData, setAnimationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        // Only load animation if the component is mounted 
        if (animationType && animationMap[animationType]) {
            animationMap[animationType]()
                .then(module => {
                    if (isMounted) {
                        setAnimationData(module.default || module);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error(`Error loading animation: ${animationType}`, err);
                    if (isMounted) {
                        setError(err);
                        setLoading(false);
                    }
                });
        }

        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        };
    }, [animationType]);

    if (loading) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.05)',
            }}>
                <Typography variant="body2" color="text.secondary">
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (error || !animationData) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.05)',
            }}>
                <Typography variant="body2" color="error">
                    {error ? 'Failed to load animation' : 'Animation not found'}
                </Typography>
            </Box>
        );
    }

    return (
        <Lottie
            animationData={animationData}
            style={{
                width: '100%',
                height: '100%',
            }}
            loop={true}
            rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice',
                clearCanvas: false,
                progressiveLoad: true,
                hideOnTransparent: false
            }}
        />
    );
};

const FeatureSlide = ({ slideContent, activeSlide, direction, allSlides, slideOrder }) => {
    const animationDirection = direction > 0 ? 1 : -1;

    const renderLeftSideContent = (slideData, slideId) => {
        // Only proceed if this slide has a custom animation defined
        if (slideData.customAnimation) {
            return (
                <Box sx={{
                    width: { xs: '280px', md: '400px' },
                    height: { xs: '280px', md: '400px' },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                }}>
                    <LazyAnimation animationType={slideData.customAnimation} />
                </Box>
            );
        }

        // Fallback for slides without animation
        return (
            <Box sx={{
                width: { xs: '280px', md: '320px' },
                height: { xs: '280px', md: '320px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '16px',
                color: 'text.secondary',
                fontSize: '1rem',
                textAlign: 'center',
                padding: 2,
            }}>
                {slideData.title} visualization
            </Box>
        );
    };

    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: { xs: '800px', md: '600px' },
            backgroundColor: slideContent.bgGradient,
            perspective: '1200px',
        }}>
            <Box sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 2, md: 4 },
                overflow: 'hidden',
            }}>
                <AnimatePresence initial={false} custom={animationDirection}>
                    <motion.div
                        key={activeSlide}
                        custom={animationDirection}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{
                            width: '100%',
                            maxWidth: '1200px',
                            height: '100%',
                            position: 'absolute',
                            willChange: 'transform, opacity',
                            overflowX: 'hidden',
                        }}
                    >
                        <SlideContainer
                            elevation={0}
                            backgroundColor={slideContent.backgroundColor}
                        >
                            <ContentBox>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 4
                                }}>
                                    {/* Left side */}
                                    <Box sx={{
                                        flex: { xs: '1 1 100%', md: '0 0 40%' },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        py: { xs: 3, md: 0 },
                                        order: { xs: 2, md: 1 }
                                    }}>
                                        {renderLeftSideContent(slideContent, activeSlide)}
                                    </Box>

                                    {/* Content - Right side */}
                                    <Box sx={{
                                        flex: { xs: '1 1 100%', md: '0 0 60%' },
                                        textAlign: { xs: 'center', md: 'left' },
                                        order: { xs: 1, md: 2 }
                                    }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 700,
                                                fontSize: { xs: '2rem', md: '2.5rem' },
                                                color: 'primary.main'
                                            }}
                                        >
                                            {slideContent.title}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                mb: 3,
                                                opacity: 0.9,
                                                fontSize: '1.25rem',
                                                fontWeight: 400,
                                                color: 'primary.main'
                                            }}
                                        >
                                            {slideContent.subtitle}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                mb: 4,
                                                fontSize: '1.1rem',
                                                lineHeight: 1.6,
                                                opacity: 0.9,
                                                color: 'primary.main'
                                            }}
                                        >
                                            {slideContent.description}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 1.5,
                                            justifyContent: { xs: 'center', md: 'flex-start' },
                                            mb: 2
                                        }}>
                                            {slideContent.features.map((feature, index) => (
                                                <Chip
                                                    key={index}
                                                    label={feature}
                                                    sx={{
                                                        backgroundColor: 'rgba(0,0,0,0.08)',
                                                        color: 'text.primary',
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(0,0,0,0.12)',
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem',
                                                        py: 0.75,
                                                        height: 'auto',
                                                        borderRadius: '12px',
                                                        '& .MuiChip-label': {
                                                            px: 1.5,
                                                            py: 0.5,
                                                            fontSize: '0.875rem',
                                                            lineHeight: 1.4,
                                                            whiteSpace: 'normal',
                                                        },
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0,0,0,0.12)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>

                                        <CTAButton>
                                            Try Now
                                        </CTAButton>
                                    </Box>
                                </Box>
                            </ContentBox>
                        </SlideContainer>
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Slide indicators */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                zIndex: 5
            }}>
                {slideOrder.map((slideId) => (
                    <Box
                        key={slideId}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: slideId === activeSlide ? 'primary.main' : 'section.main',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default FeatureSlide;