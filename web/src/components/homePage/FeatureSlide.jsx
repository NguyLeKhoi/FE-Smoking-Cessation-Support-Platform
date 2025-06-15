import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

// Import all animations
import personalizedPlanAnimation from '../../assets/animations/personalized-plan.json';
import coachingAnimation from '../../assets/animations/coaching.json';
import communityAnimation from '../../assets/animations/community.json';
import progressAnimation from '../../assets/animations/progress.json';
import healthBenefitsAnimation from '../../assets/animations/health.json';


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

const PhoneFrame = styled(Box)(({ theme }) => ({
    width: '250px',
    height: '450px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '30px',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: theme.spacing(1),
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '6px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '3px',
        zIndex: 2,
    }
}));

const PhoneScreen = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: theme.spacing(3, 2),
    paddingTop: theme.spacing(4),
    overflow: 'hidden',
    position: 'relative',
}));

const MockContentBlock = styled(Box)(({ theme }) => ({
    height: '48px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '8px',
    marginBottom: theme.spacing(1.5),
}));

const CTAButton = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: theme.spacing(1.5, 4),
    borderRadius: '50px',
    fontSize: '18px',
    fontWeight: 600,
    textTransform: 'none',
    marginTop: theme.spacing(4),
    display: 'inline-block',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[8],
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

const FeatureSlide = ({ slideContent, activeSlide, direction, allSlides, slideOrder }) => {
    // Force direction to be exactly -1 or 1 to ensure consistent animation behavior
    const animationDirection = direction > 0 ? 1 : -1;
    const renderLeftSideContent = (slideData, slideId) => {
        console.log("Rendering slide:", slideId, "customAnimation:", slideData.customAnimation);

        // Check if this slide has a custom animation
        if (slideData.customAnimation) {
            // Get the appropriate animation data based on the customAnimation property
            let animationData;
            switch (slideData.customAnimation) {
                case 'personalized-plan':
                    animationData = personalizedPlanAnimation;
                    break;
                case 'expert-coaching':
                    animationData = coachingAnimation;
                    break;
                case 'community-support':
                    animationData = communityAnimation;
                    break;
                case 'progress-tracking':
                    animationData = progressAnimation;
                    break;
                case 'health-benefits':
                    animationData = healthBenefitsAnimation;
                    break;
                default:
                    console.warn("No animation found for:", slideData.customAnimation);
                    animationData = null;
            }

            // If we have animation data, render the animation
            if (animationData) {
                return (
                    <Box sx={{
                        width: { xs: '280px', md: '320px' },
                        height: { xs: '280px', md: '320px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                    }}>
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
                    </Box>
                );
            }
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
            overflow: 'hidden', // Change from 'visible' to 'hidden'
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
                overflow: 'hidden', // Add this to prevent inner content overflow
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
                            // Ensure content doesn't trigger scrollbars
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
                                    {/* Phone Mockup - Left side - Now with conditional rendering */}
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
                                            gap: 1.5, // Increased gap for better spacing
                                            justifyContent: { xs: 'center', md: 'flex-start' },
                                            mb: 2
                                        }}>
                                            {slideContent.features.map((feature, index) => (
                                                <Chip
                                                    key={index}
                                                    label={feature}
                                                    sx={{
                                                        backgroundColor: 'rgba(0,0,0,0.08)', // Lighter background color
                                                        color: 'text.primary', // Using theme text color
                                                        backdropFilter: 'blur(10px)',
                                                        border: '1px solid rgba(0,0,0,0.12)', // Subtle border
                                                        fontWeight: 500,
                                                        fontSize: '0.875rem',
                                                        py: 0.75, // More vertical padding
                                                        height: 'auto', // Allow multi-line if needed
                                                        '& .MuiChip-label': {
                                                            px: 1.5, // More horizontal padding
                                                            py: 0.5, // Vertical padding inside chip
                                                            fontSize: '0.875rem',
                                                            lineHeight: 1.4,
                                                            whiteSpace: 'normal', // Allow text wrapping
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