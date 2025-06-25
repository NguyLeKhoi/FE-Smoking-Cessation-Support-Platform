import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';

const BlogBanner = ({
    title,
    subtitle,
    bannerImage,
    date,
    author,
    slug,
    id
}) => {
    // Extract subtitle from markdown content
    const getSubtitle = (content) => {
        if (!content) return null;
        
        // Remove markdown formatting for subtitle
        const plainText = content
            .replace(/#{1,6}\s+/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/`(.*?)`/g, '$1') // Remove inline code
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
            .trim();

        return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    };

    return (
        <Box sx={{ width: '100%', py: 5 }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        alignItems: 'center',
                    }}
                >
                    {/* LEFT SIDE - Text */}
                    <Box sx={{
                        flexBasis: { md: '50%' },
                        flexShrink: 0,
                        width: { xs: '100%', md: '50%' }
                    }}>
                        {/* Date and Author */}
                        {(date || author) && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 2
                            }}>
                                {date && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: '0.85rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {date}
                                    </Typography>
                                )}

                                {date && author && (
                                    <Box
                                        component="span"
                                        sx={{
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            bgcolor: 'divider'
                                        }}
                                    />
                                )}

                                {author && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            fontWeight: 500,
                                            fontSize: '0.85rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {author}
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Main Title */}
                        {title && (
                            <Typography
                                variant="h1"
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    color: 'primary.main',
                                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
                                    lineHeight: 1.1,
                                }}
                            >
                                {title}
                            </Typography>
                        )}

                        {/* Subtitle - Now handles markdown content */}
                        {subtitle && (
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 4,
                                    color: 'text.primary',
                                    fontSize: { xs: '1rem', md: '1.15rem' },
                                    lineHeight: 1.5
                                }}
                            >
                                {getSubtitle(subtitle)}
                            </Typography>
                        )}

                        {/* Read More Button */}
                        {(slug || id) && (
                            <Button
                                component={RouterLink}
                                to={id ? `/blog/${id}` : `/blog/${slug}`}
                                variant="outlined"
                                sx={{
                                    borderRadius: '2rem',
                                    px: 4,
                                    py: 1.2,
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                Read More
                            </Button>
                        )}
                    </Box>

                    {/* RIGHT SIDE - Image */}
                    {bannerImage && (
                        <Box sx={{
                            flexBasis: { md: '50%' },
                            flexShrink: 0,
                            width: { xs: '100%', md: '50%' }
                        }}>
                            <Box
                                component="img"
                                src={bannerImage}
                                alt={title || "Featured post"}
                                sx={{
                                    width: '90%',
                                    height: '350px',
                                    borderRadius: 8,
                                    display: 'block',
                                    maxHeight: '500px'
                                }}
                            />
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default BlogBanner;