import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    IconButton,
    Chip,
    LinearProgress,
    Paper,
    useTheme,
    alpha
} from '@mui/material';
import {
    FormatQuote,
    Circle,
    RadioButtonUnchecked
} from '@mui/icons-material';

const quotes = [
    {
        quote: "Every year, more than 8 million people die from tobacco use.",
        author: "World Health Organization (WHO)",
        category: "Global Impact"
    },
    {
        quote: "Quitting smoking reduces the risk of coronary heart disease by 50% after one year.",
        author: "Centers for Disease Control and Prevention (CDC)",
        category: "Health Benefits"
    },
    {
        quote: "Smokers can gain up to 10 years of life expectancy by quitting early.",
        author: "National Cancer Institute",
        category: "Life Expectancy"
    },
    {
        quote: "The true face of smoking is disease, death and horror - not the glamour and sophistication the pushers in the tobacco industry try to portray.",
        author: "David Byrne",
        category: "Reality Check"
    }
];

const QuotesCarousel = () => {
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % quotes.length);
            setProgress(0);
        }, 5000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0;
                return prev + 2;
            });
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [isAutoPlaying]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setProgress(0);
        setTimeout(() => setIsAutoPlaying(true), 3000);
    };


    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                py: { xs: 8, md: 12 },
                background: "background.paper",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: 'all 1s ease-out'
            }}
        >


            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2
                        }}
                    >
                        Evidence-based insights for better decisions
                    </Typography>
                </Box>

                {/* Main carousel container */}
                <Box sx={{ position: 'relative' }}>
                    {/* Quote container */}
                    <Box
                        sx={{
                            position: 'relative',
                            minHeight: { xs: 320, md: 280 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 768 }}>
                            {quotes.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: index === currentSlide ? 1 : 0,
                                        transform: index === currentSlide
                                            ? 'translateY(0) scale(1)'
                                            : 'translateY(32px) scale(0.95)',
                                        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                                        pointerEvents: index === currentSlide ? 'auto' : 'none'
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                            backdropFilter: 'blur(20px)',
                                            borderRadius: 4,
                                            p: { xs: 4, md: 6 },
                                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`
                                        }}
                                    >
                                        {/* Category badge */}
                                        <Chip
                                            icon={<FormatQuote />}
                                            label={item.category}
                                            variant="outlined"
                                            sx={{
                                                mb: 3,
                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                backdropFilter: 'blur(10px)',
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                            }}
                                        />

                                        {/* Quote text */}
                                        <Typography
                                            variant="h4"
                                            component="blockquote"
                                            sx={{
                                                fontSize: { xs: '1.5rem', md: '1.8rem' },
                                                fontWeight: 500,
                                                lineHeight: 1.4,
                                                mb: 4,
                                                fontStyle: 'italic',
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            "{item.quote}"
                                        </Typography>

                                        {/* Author */}
                                        <Typography
                                            variant="h6"
                                            component="cite"
                                            sx={{
                                                fontSize: { xs: '1rem', md: '1.25rem' },
                                                fontWeight: 500,
                                                color: theme.palette.text.secondary,
                                                fontStyle: 'normal'
                                            }}
                                        >
                                            — {item.author}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Dots indicator */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, gap: 1.5 }}>
                    {quotes.map((_, index) => (
                        <IconButton
                            key={index}
                            onClick={() => goToSlide(index)}
                            size="small"
                            sx={{
                                width: index === currentSlide ? 32 : 12,
                                height: 12,
                                borderRadius: 6,
                                minWidth: 'auto',
                                backgroundColor: index === currentSlide
                                    ? theme.palette.primary.main
                                    : alpha(theme.palette.text.secondary, 0.3),
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: index === currentSlide
                                        ? theme.palette.primary.dark
                                        : alpha(theme.palette.text.secondary, 0.5)
                                }
                            }}
                            aria-label={`Go to quote ${index + 1}`}
                        >
                            {index === currentSlide ? <Circle sx={{ fontSize: 0 }} /> : <RadioButtonUnchecked sx={{ fontSize: 0 }} />}
                        </IconButton>
                    ))}
                </Box>

                {/* Progress bar */}
                <Box sx={{ mt: 4, maxWidth: 200, mx: 'auto' }}>
                    <LinearProgress
                        variant="determinate"
                        value={isAutoPlaying ? progress : 0}
                        sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.text.secondary, 0.2),
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                            }
                        }}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default QuotesCarousel;