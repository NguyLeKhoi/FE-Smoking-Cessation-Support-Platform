import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Container } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const quotes = [
    {
        quote: "Every year, more than 8 million people die from tobacco use.",
        author: "World Health Organization (WHO)"
    },
    {
        quote: "Quitting smoking reduces the risk of coronary heart disease by 50% after one year.",
        author: "Centers for Disease Control and Prevention (CDC)"
    },
    {
        quote: "Smokers can gain up to 10 years of life expectancy by quitting early.",
        author: "National Cancer Institute"
    },
    {
        quote: "The true face of smoking is disease, death and horror - not the glamour and sophistication the pushers in the tobacco industry try to portray.",
        author: "David Byrne"
    }
];

const QuotesCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        arrows: false,
        adaptiveHeight: true
    };

    return (
        <Box sx={{
            width: '100%',
            overflow: 'hidden',
            py: { xs: 4, md: 6 },
            bgcolor: 'background.paper'
        }}>
            <Container maxWidth="md">
                <Slider {...settings}>
                    {quotes.map((item, index) => (
                        <Box key={index} sx={{ textAlign: 'center', px: 2 }}>
                            <Typography
                                variant="h3"
                                gutterBottom
                                sx={{
                                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    mb: 3
                                }}
                            >
                                "{item.quote}"
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: { xs: '1rem', md: '1.25rem' },
                                    opacity: 0.8,
                                    mb: 4
                                }}
                            >
                                - {item.author} -
                            </Typography>
                        </Box>
                    ))}
                </Slider>
            </Container>
        </Box>
    );
};

export default QuotesCarousel;