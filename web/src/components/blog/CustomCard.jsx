import React from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Box
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CustomCard = ({ image, title, subtitle, author, date, slug }) => {
    return (
        <Card
            component={RouterLink}
            to={`/blog/${slug || 'post'}`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                maxWidth: 360,
                minWidth: 360,
                minHeight: 350,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'none', // Remove default shadow
                textDecoration: 'none',
                position: 'relative',
                transition: 'transform 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-6px)'
                }
            }}
        >
            {/* Image Container */}
            <Box sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                mb: 2,
                // Subtle border effect
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.04)'
            }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        height: 220,
                        objectFit: 'cover'
                    }}
                />
            </Box>

            {/* Date and Author */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#9E9E9E',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {date}
                </Typography>

                <Box
                    component="span"
                    sx={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        bgcolor: '#D0D0D0'
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{
                        color: '#9E9E9E',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {author}
                </Typography>
            </Box>

            {/* Title */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '1.5rem',
                    lineHeight: 1.3,
                    mb: 1.5
                }}
            >
                {title}
            </Typography>

            {/* Subtitle/Excerpt */}
            <Typography
                variant="body1"
                sx={{
                    color: '#555',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1
                }}
            >
                {subtitle}
            </Typography>
        </Card>
    );
};

export default CustomCard;
