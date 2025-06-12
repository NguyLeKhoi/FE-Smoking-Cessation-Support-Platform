import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayArrow } from '@mui/icons-material';
// Import Swiper and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Styled components (keep your existing ones)
const SlideContainer = styled(Paper)(({ theme, bgGradient }) => ({
    minHeight: '500px',
    padding: theme.spacing(6, 4),
    borderRadius: '24px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    background: bgGradient,
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

// Custom pagination bullet styling
const PaginationBullet = styled(Box)(({ active, theme }) => ({
    width: active ? 10 : 8,
    height: active ? 10 : 8,
    borderRadius: '50%',
    backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.3)',
    margin: '0 4px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
}));

const FeatureSlide = ({ slideContent, activeSlide, direction, allSlides, slideOrder }) => {
    const swiperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(slideOrder.indexOf(activeSlide));

    // Initialize Swiper with the active slide
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const index = slideOrder.indexOf(activeSlide);
            if (index !== activeIndex && index !== -1) {
                swiperRef.current.swiper.slideTo(index);
            }
        }
    }, [activeSlide, slideOrder, activeIndex]);

    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: { xs: '800px', md: '600px' },
            backgroundColor: slideContent.bgGradient,
            perspective: '1200px',
        }}>
            <Swiper
                ref={swiperRef}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                initialSlide={slideOrder.indexOf(activeSlide)}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}" style="
                            width: ${index === activeIndex ? '10px' : '8px'};
                            height: ${index === activeIndex ? '10px' : '8px'};
                            background-color: ${index === activeIndex ? '#1976d2' : 'rgba(255,255,255,0.3)'};
                            display: inline-block;
                            border-radius: 50%;
                            margin: 0 4px;
                            transition: all 0.3s ease;
                        "></span>`;
                    },
                }}
                onSlideChange={(swiper) => {
                    setActiveIndex(swiper.activeIndex);
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                style={{
                    width: '100%',
                    height: '100%',
                    padding: '20px 0'
                }}
            >
                {slideOrder.map((slideId) => {
                    const slideData = allSlides[slideId];
                    return (
                        <SwiperSlide
                            key={slideId}
                            style={{
                                width: '80%',
                                borderRadius: '24px',
                                overflow: 'hidden',
                            }}
                        >
                            <SlideContainer
                                elevation={0}
                                bgGradient={slideData.bgGradient}
                            >
                                <ContentBox>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 4
                                    }}>
                                        {/* Phone Mockup - Left side */}
                                        <Box sx={{
                                            flex: { xs: '1 1 100%', md: '0 0 40%' },
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            py: { xs: 3, md: 0 },
                                            order: { xs: 2, md: 1 }
                                        }}>
                                            <PhoneFrame>
                                                <PhoneScreen>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            opacity: 0.7,
                                                            textAlign: 'center',
                                                            mb: 3,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {slideData.title}
                                                    </Typography>

                                                    <MockContentBlock />
                                                    <MockContentBlock />
                                                    <MockContentBlock />
                                                    <MockContentBlock />

                                                    {slideId === 'expert-coaching' && (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            mt: 3
                                                        }}>
                                                            <Box sx={{
                                                                width: 48,
                                                                height: 48,
                                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255,255,255,0.4)',
                                                                    transform: 'scale(1.1)'
                                                                }
                                                            }}>
                                                                <PlayArrow sx={{ color: 'white', fontSize: 24 }} />
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </PhoneScreen>
                                            </PhoneFrame>
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
                                                {slideData.title}
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
                                                {slideData.subtitle}
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
                                                {slideData.description}
                                            </Typography>

                                            <Box sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 1,
                                                justifyContent: { xs: 'center', md: 'flex-start' },
                                                mb: 2
                                            }}>
                                                {slideData.features.map((feature, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={feature}
                                                        sx={{
                                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                                            color: 'white',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255,255,255,0.3)',
                                                            fontWeight: 500,
                                                            '& .MuiChip-label': {
                                                                fontSize: '0.875rem'
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
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Custom pagination (optional if you want to use your own instead of Swiper's) */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                zIndex: 5,
                // Comment this out if you're using Swiper's built-in pagination
                display: 'none'
            }}>
                {slideOrder.map((slideId, index) => (
                    <PaginationBullet
                        key={slideId}
                        active={index === activeIndex}
                        onClick={() => {
                            if (swiperRef.current && swiperRef.current.swiper) {
                                swiperRef.current.swiper.slideTo(index);
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default FeatureSlide;